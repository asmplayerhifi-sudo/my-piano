/**
 * MemoryVirtualStorageAdapter.ts
 * Adaptador de armazenamento virtual em memória para testes unitários,
 * execução em ambientes headless (Node / Vitest) e fallback gracioso.
 */

import type { IStudioStorageAdapter } from './IStudioStorageAdapter';
import type { StudioFolderInfo, StudioPermissionState, StudioSubfolder } from './studioStorageTypes';

export class MemoryVirtualStorageAdapter implements IStudioStorageAdapter {
  private files: Map<string, string> = new Map();
  private folderName: string = 'Projetos_Harmonia_Virtual';
  private permission: StudioPermissionState = 'granted';
  private isConnected: boolean = false;
  private hasStoredHandleFlag: boolean = false;
  private directories: Set<string> = new Set();

  constructor(initialFolderName = 'Projetos_Harmonia_Virtual') {
    this.folderName = initialFolderName;
  }

  isSupported(): boolean {
    return true;
  }

  setPermission(state: StudioPermissionState): void {
    this.permission = state;
  }

  setStoredHandleFlag(val: boolean): void {
    this.hasStoredHandleFlag = val;
  }

  async getFolderInfo(): Promise<StudioFolderInfo | null> {
    if (!this.isConnected) return null;
    return {
      name: this.folderName,
      isAvailable: this.permission === 'granted',
      permissionState: this.permission,
      isVirtual: true,
    };
  }

  async selectDirectory(customName?: string): Promise<StudioFolderInfo> {
    if (customName) this.folderName = customName;
    this.isConnected = true;
    this.hasStoredHandleFlag = true;
    return {
      name: this.folderName,
      isAvailable: this.permission === 'granted',
      permissionState: this.permission,
      isVirtual: true,
    };
  }

  async requestPermission(): Promise<boolean> {
    if (!this.isConnected) return false;
    this.permission = 'granted';
    return true;
  }

  async hasStoredHandle(): Promise<boolean> {
    return this.hasStoredHandleFlag;
  }

  async restoreHandle(): Promise<StudioFolderInfo | null> {
    if (!this.hasStoredHandleFlag) return null;
    this.isConnected = true;
    return {
      name: this.folderName,
      isAvailable: this.permission === 'granted',
      permissionState: this.permission,
      isVirtual: true,
    };
  }

  async disconnect(): Promise<void> {
    this.isConnected = false;
    this.hasStoredHandleFlag = false;
  }

  async readText(relativePath: string): Promise<string | null> {
    this.checkAccess();
    const content = this.files.get(relativePath);
    return content !== undefined ? content : null;
  }

  async writeText(relativePath: string, content: string): Promise<void> {
    this.checkAccess();
    const parts = relativePath.split('/');
    if (parts.length > 1) {
      this.directories.add(parts[0]);
    }
    this.files.set(relativePath, content);
  }

  async deleteFile(relativePath: string): Promise<boolean> {
    this.checkAccess();
    return this.files.delete(relativePath);
  }

  async listFiles(subfolder: StudioSubfolder): Promise<string[]> {
    this.checkAccess();
    const prefix = `${subfolder}/`;
    const results: string[] = [];

    for (const key of this.files.keys()) {
      if (key.startsWith(prefix)) {
        const filename = key.slice(prefix.length);
        if (!filename.includes('/') && filename.endsWith('.json')) {
          results.push(filename);
        }
      }
    }

    return results;
  }

  async ensureDirectories(folders: StudioSubfolder[]): Promise<void> {
    this.checkAccess();
    for (const folder of folders) {
      this.directories.add(folder);
    }
  }

  // ── Auxiliares para Testes ───────────────────────────────────────────────

  getRawFiles(): Map<string, string> {
    return this.files;
  }

  clearAll(): void {
    this.files.clear();
    this.directories.clear();
    this.isConnected = false;
    this.hasStoredHandleFlag = false;
  }

  private checkAccess(): void {
    if (!this.isConnected) {
      throw new Error('Nenhuma pasta virtual está conectada.');
    }
    if (this.permission !== 'granted') {
      throw new Error(`Permissão de acesso negada ou pendente: ${this.permission}`);
    }
  }
}
