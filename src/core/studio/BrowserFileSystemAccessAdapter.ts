/**
 * BrowserFileSystemAccessAdapter.ts
 * Implementação do IStudioStorageAdapter utilizando a File System Access API nativa do navegador.
 *
 * Características:
 * - Utiliza FileSystemDirectoryHandle para ler e gravar diretamente na pasta do usuário
 * - Persiste o handle no IndexedDB para restaurar a sessão sem reabrir o picker
 * - Verifica permissões via queryPermission e solicita autorização com requestPermission
 * - Nunca depende de caminhos físicos absolutos do sistema operacional (C:\...)
 */

import type { IStudioStorageAdapter } from './IStudioStorageAdapter';
import type { StudioFolderInfo, StudioPermissionState, StudioSubfolder } from './studioStorageTypes';
import {
  saveDirectoryHandle,
  getDirectoryHandle,
  clearDirectoryHandle,
} from './indexedDbHandleStore';

export class BrowserFileSystemAccessAdapter implements IStudioStorageAdapter {
  private rootHandle: FileSystemDirectoryHandle | null = null;

  isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof (window as unknown as { showDirectoryPicker?: unknown }).showDirectoryPicker === 'function'
    );
  }

  async getFolderInfo(): Promise<StudioFolderInfo | null> {
    if (!this.rootHandle) return null;

    const perm = await this.checkPermission(this.rootHandle);
    return {
      name: this.rootHandle.name,
      isAvailable: perm === 'granted',
      permissionState: perm,
      isVirtual: false,
    };
  }

  async selectDirectory(): Promise<StudioFolderInfo> {
    if (!this.isSupported()) {
      throw new Error('A File System Access API não é suportada neste navegador.');
    }

    const picker = (window as unknown as {
      showDirectoryPicker: (opts?: { mode?: 'read' | 'readwrite' }) => Promise<FileSystemDirectoryHandle>;
    }).showDirectoryPicker;

    const handle = await picker({ mode: 'readwrite' });
    this.rootHandle = handle;

    // Persiste a referência no IndexedDB para uso futuro
    await saveDirectoryHandle(handle);

    const perm = await this.checkPermission(handle);

    return {
      name: handle.name,
      isAvailable: perm === 'granted',
      permissionState: perm,
      isVirtual: false,
    };
  }

  async requestPermission(): Promise<boolean> {
    if (!this.rootHandle) return false;

    try {
      const handleWithPerm = this.rootHandle as unknown as {
        requestPermission: (opts: { mode: 'readwrite' }) => Promise<'granted' | 'denied' | 'prompt'>;
      };
      if (typeof handleWithPerm.requestPermission === 'function') {
        const result = await handleWithPerm.requestPermission({ mode: 'readwrite' });
        return result === 'granted';
      }
      return false;
    } catch (err) {
      console.warn('[BrowserFileSystemAccessAdapter] Falha ao solicitar permissão:', err);
      return false;
    }
  }

  async hasStoredHandle(): Promise<boolean> {
    const handle = await getDirectoryHandle();
    return handle !== null;
  }

  async restoreHandle(): Promise<StudioFolderInfo | null> {
    try {
      const storedHandle = await getDirectoryHandle();
      if (!storedHandle) return null;

      this.rootHandle = storedHandle;
      const perm = await this.checkPermission(storedHandle);

      return {
        name: storedHandle.name,
        isAvailable: perm === 'granted',
        permissionState: perm,
        isVirtual: false,
      };
    } catch (err) {
      console.warn('[BrowserFileSystemAccessAdapter] Erro ao restaurar handle do IndexedDB:', err);
      return null;
    }
  }

  async disconnect(): Promise<void> {
    this.rootHandle = null;
    await clearDirectoryHandle();
  }

  async readText(relativePath: string): Promise<string | null> {
    this.ensureHandle();
    const parts = relativePath.split('/').filter(Boolean);

    try {
      let fileHandle: FileSystemFileHandle;

      if (parts.length === 1) {
        fileHandle = await this.rootHandle!.getFileHandle(parts[0], { create: false });
      } else if (parts.length === 2) {
        const subDir = await this.rootHandle!.getDirectoryHandle(parts[0], { create: false });
        fileHandle = await subDir.getFileHandle(parts[1], { create: false });
      } else {
        throw new Error(`Caminho relativo inválido: ${relativePath}`);
      }

      const file = await fileHandle.getFile();
      return await file.text();
    } catch (err: unknown) {
      // Se arquivo não existe (NotFoundError), retorna null amigavelmente
      const errorObj = err as { name?: string };
      if (errorObj?.name === 'NotFoundError') {
        return null;
      }
      throw err;
    }
  }

  async writeText(relativePath: string, content: string): Promise<void> {
    this.ensureHandle();
    const parts = relativePath.split('/').filter(Boolean);

    let fileHandle: FileSystemFileHandle;

    if (parts.length === 1) {
      fileHandle = await this.rootHandle!.getFileHandle(parts[0], { create: true });
    } else if (parts.length === 2) {
      const subDir = await this.rootHandle!.getDirectoryHandle(parts[0], { create: true });
      fileHandle = await subDir.getFileHandle(parts[1], { create: true });
    } else {
      throw new Error(`Caminho relativo não suportado: ${relativePath}`);
    }

    const writable = await (fileHandle as unknown as {
      createWritable: () => Promise<FileSystemWritableFileStream>;
    }).createWritable();

    try {
      await writable.write(content);
    } finally {
      await writable.close();
    }
  }

  async deleteFile(relativePath: string): Promise<boolean> {
    this.ensureHandle();
    const parts = relativePath.split('/').filter(Boolean);

    try {
      if (parts.length === 1) {
        await this.rootHandle!.removeEntry(parts[0]);
        return true;
      } else if (parts.length === 2) {
        const subDir = await this.rootHandle!.getDirectoryHandle(parts[0], { create: false });
        await subDir.removeEntry(parts[1]);
        return true;
      }
      return false;
    } catch (err: unknown) {
      const errorObj = err as { name?: string };
      if (errorObj?.name === 'NotFoundError') {
        return false;
      }
      throw err;
    }
  }

  async listFiles(subfolder: StudioSubfolder): Promise<string[]> {
    this.ensureHandle();

    try {
      const subDir = await this.rootHandle!.getDirectoryHandle(subfolder, { create: false });
      const results: string[] = [];

      // Itera assincronamente as entradas do diretório
      const iterator = (subDir as unknown as {
        values: () => AsyncIterable<FileSystemHandle>;
      }).values();

      for await (const entry of iterator) {
        if (entry.kind === 'file' && entry.name.endsWith('.json')) {
          results.push(entry.name);
        }
      }

      return results;
    } catch (err: unknown) {
      const errorObj = err as { name?: string };
      if (errorObj?.name === 'NotFoundError') {
        return [];
      }
      throw err;
    }
  }

  async ensureDirectories(folders: StudioSubfolder[]): Promise<void> {
    this.ensureHandle();

    for (const folder of folders) {
      await this.rootHandle!.getDirectoryHandle(folder, { create: true });
    }
  }

  // ── Auxiliares Internos ──────────────────────────────────────────────────

  private ensureHandle(): void {
    if (!this.rootHandle) {
      throw new Error('Nenhuma pasta soberana do estúdio está conectada.');
    }
  }

  private async checkPermission(handle: FileSystemDirectoryHandle): Promise<StudioPermissionState> {
    try {
      const handleWithPerm = handle as unknown as {
        queryPermission: (opts: { mode: 'readwrite' }) => Promise<'granted' | 'denied' | 'prompt'>;
      };
      if (typeof handleWithPerm.queryPermission === 'function') {
        const status = await handleWithPerm.queryPermission({ mode: 'readwrite' });
        return status;
      }
      return 'granted';
    } catch (err) {
      console.warn('[BrowserFileSystemAccessAdapter] Falha ao verificar permissão:', err);
      return 'prompt';
    }
  }
}
