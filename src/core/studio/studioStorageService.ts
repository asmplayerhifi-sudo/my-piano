/**
 * studioStorageService.ts
 * Serviço Soberano de Armazenamento Local do Estúdio Harmonia.
 * 
 * Orquestra o CRUD de projetos para Partitura, Arranjador e Fraseador,
 * mantendo o manifesto mestre (studio_manifest.json) sincronizado
 * com os arquivos físicos reais no disco do usuário.
 */

import type { IStudioStorageAdapter } from './IStudioStorageAdapter';
import { BrowserFileSystemAccessAdapter } from './BrowserFileSystemAccessAdapter';
import {
  type StudioManifest,
  type StudioManifestItem,
  type StudioModuleName,
  type StudioStorageState,
  type StudioProjectEnvelope,
  MODULE_TO_SUBFOLDER,
  REQUIRED_STUDIO_FOLDERS,
  MANIFEST_FILENAME,
  MANIFEST_VERSION,
} from './studioStorageTypes';

export class StudioStorageService {
  private adapter: IStudioStorageAdapter;
  private state: StudioStorageState = {
    folderInfo: null,
    manifest: null,
    isLoading: false,
    error: null,
    unindexedFiles: [],
  };
  private listeners: Set<(state: StudioStorageState) => void> = new Set();
  private isInitialized = false;

  constructor(adapter?: IStudioStorageAdapter) {
    if (adapter) {
      this.adapter = adapter;
    } else {
      const browserAdapter = new BrowserFileSystemAccessAdapter();
      this.adapter = browserAdapter;
    }
  }

  /**
   * Substitui o adaptador atual (útil para testes unitários ou ambientes desktop)
   */
  setAdapter(adapter: IStudioStorageAdapter): void {
    this.adapter = adapter;
    this.isInitialized = false;
  }

  getAdapter(): IStudioStorageAdapter {
    return this.adapter;
  }

  getState(): StudioStorageState {
    return this.state;
  }

  subscribe(listener: (state: StudioStorageState) => void): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  private updateState(partial: Partial<StudioStorageState>): void {
    this.state = { ...this.state, ...partial };
    this.notify();
  }

  /**
   * Inicializa o serviço e tenta restaurar automaticamente a pasta salva de sessões anteriores
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    this.isInitialized = true;

    this.updateState({ isLoading: true, error: null });

    try {
      const hasStored = await this.adapter.hasStoredHandle();
      if (!hasStored) {
        this.updateState({ isLoading: false, folderInfo: null, manifest: null });
        return;
      }

      const folderInfo = await this.adapter.restoreHandle();
      if (!folderInfo) {
        this.updateState({ isLoading: false, folderInfo: null, manifest: null });
        return;
      }

      this.updateState({ folderInfo });

      if (folderInfo.permissionState === 'granted') {
        await this.loadOrCreateManifest();
      } else {
        this.updateState({ isLoading: false });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.updateState({ isLoading: false, error: `Erro na restauração da pasta: ${msg}` });
    }
  }

  /**
   * Solicita autorização de leitura e escrita do usuário para o handle existente
   */
  async requestPermission(): Promise<boolean> {
    this.updateState({ isLoading: true, error: null });
    try {
      const granted = await this.adapter.requestPermission();
      if (granted) {
        const info = await this.adapter.getFolderInfo();
        this.updateState({ folderInfo: info });
        await this.loadOrCreateManifest();
        return true;
      } else {
        const info = await this.adapter.getFolderInfo();
        this.updateState({ folderInfo: info, isLoading: false });
        return false;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.updateState({ isLoading: false, error: `Permissão negada: ${msg}` });
      return false;
    }
  }

  /**
   * Abre o diálogo nativo para o usuário selecionar uma pasta soberana
   */
  async selectDirectory(): Promise<boolean> {
    this.updateState({ isLoading: true, error: null });

    try {
      const folderInfo = await this.adapter.selectDirectory();
      this.updateState({ folderInfo });

      if (folderInfo.permissionState === 'granted') {
        await this.adapter.ensureDirectories(REQUIRED_STUDIO_FOLDERS);
        await this.loadOrCreateManifest();
        return true;
      } else {
        this.updateState({ isLoading: false });
        return false;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('aborted') || msg.includes('cancel')) {
        this.updateState({ isLoading: false });
        return false;
      }
      this.updateState({ isLoading: false, error: `Falha ao selecionar pasta: ${msg}` });
      return false;
    }
  }

  /**
   * Desconecta a pasta atual
   */
  async disconnectFolder(): Promise<void> {
    await this.adapter.disconnect();
    this.updateState({
      folderInfo: null,
      manifest: null,
      unindexedFiles: [],
      error: null,
      isLoading: false,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // CRUD de Projetos
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Create — Novo Projeto
   */
  async createProject<T = unknown>(params: {
    module: StudioModuleName;
    title: string;
    category?: string;
    data: T;
    metadata?: Record<string, unknown>;
  }): Promise<{ item: StudioManifestItem; envelope: StudioProjectEnvelope<T> }> {
    this.ensureConnected();

    const title = params.title.trim() || 'Novo Projeto';
    const id = this.generateId(title);
    const now = new Date().toISOString();
    const subfolder = MODULE_TO_SUBFOLDER[params.module];
    const filename = `${this.slugify(title)}_${id.slice(-6)}.json`;
    const relativePath = `${subfolder}/${filename}`;

    const envelope: StudioProjectEnvelope<T> = {
      id,
      title,
      module: params.module,
      category: params.category || 'Geral',
      version: '1.0.0',
      createdAt: now,
      updatedAt: now,
      metadata: params.metadata || {},
      data: params.data,
    };

    // 1. Grava o arquivo físico do projeto
    const content = JSON.stringify(envelope, null, 2);
    await this.adapter.writeText(relativePath, content);

    // 2. Atualiza o manifesto mestre atomicamente
    const item: StudioManifestItem = {
      id,
      title,
      category: envelope.category,
      module: params.module,
      relativePath,
      createdAt: now,
      updatedAt: now,
      version: '1.0.0',
      metadata: params.metadata,
    };

    const manifest = this.getSafeManifest();
    this.addItemToManifest(manifest, item);
    await this.saveManifest(manifest);

    this.updateState({ manifest });
    return { item, envelope };
  }

  /**
   * Read — Abrir Projeto
   */
  async openProject<T = unknown>(relativePath: string): Promise<StudioProjectEnvelope<T>> {
    this.ensureConnected();

    const text = await this.adapter.readText(relativePath);
    if (!text) {
      throw new Error(`Arquivo não encontrado: ${relativePath}`);
    }

    try {
      const parsed = JSON.parse(text);

      // Compatibilidade: se o arquivo já for um envelope com { data, ... }
      if (parsed && typeof parsed === 'object' && 'data' in parsed && 'module' in parsed) {
        return parsed as StudioProjectEnvelope<T>;
      }

      // Se for formato legado de editor direto (ex: ScoreProject)
      return {
        id: parsed.id || this.generateId(parsed.title || 'Projeto Importado'),
        title: parsed.title || 'Projeto Importado',
        module: this.inferModuleFromPath(relativePath),
        category: parsed.category || 'Geral',
        version: '1.0.0',
        createdAt: parsed.createdAt || new Date().toISOString(),
        updatedAt: parsed.updatedAt || new Date().toISOString(),
        metadata: {
          bpm: parsed.bpm,
          timeSignature: parsed.timeSignature,
        },
        data: parsed as T,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Arquivo JSON inválido ou corrompido (${relativePath}): ${msg}`);
    }
  }

  /**
   * Update — Salvar Projeto Existente
   */
  async saveProject<T = unknown>(params: {
    id: string;
    module: StudioModuleName;
    title?: string;
    category?: string;
    data: T;
    metadata?: Record<string, unknown>;
  }): Promise<StudioManifestItem> {
    this.ensureConnected();

    const manifest = this.getSafeManifest();
    const item = this.findManifestItem(manifest, params.id, params.module);
    if (!item) {
      throw new Error(`Projeto com ID "${params.id}" não encontrado no manifesto.`);
    }

    const now = new Date().toISOString();
    const updatedTitle = params.title ? params.title.trim() : item.title;

    const envelope: StudioProjectEnvelope<T> = {
      id: item.id,
      title: updatedTitle,
      module: item.module,
      category: params.category || item.category,
      version: '1.0.0',
      createdAt: item.createdAt,
      updatedAt: now,
      metadata: { ...item.metadata, ...params.metadata },
      data: params.data,
    };

    // 1. Grava o arquivo físico com segurança
    const content = JSON.stringify(envelope, null, 2);
    await this.adapter.writeText(item.relativePath, content);

    // 2. Atualiza os dados no manifesto
    item.title = updatedTitle;
    item.category = envelope.category;
    item.updatedAt = now;
    item.metadata = envelope.metadata;

    manifest.lastUpdated = now;
    await this.saveManifest(manifest);

    this.updateState({ manifest });
    return item;
  }

  /**
   * Save As — Salvar Como (Gera nova identidade e novo arquivo físico)
   */
  async saveProjectAs<T = unknown>(params: {
    originalId: string;
    module: StudioModuleName;
    newTitle: string;
    category?: string;
    data: T;
    metadata?: Record<string, unknown>;
  }): Promise<{ item: StudioManifestItem; envelope: StudioProjectEnvelope<T> }> {
    return this.createProject({
      module: params.module,
      title: params.newTitle,
      category: params.category,
      data: params.data,
      metadata: params.metadata,
    });
  }

  /**
   * Delete — Excluir Projeto
   */
  async deleteProject(id: string, module: StudioModuleName): Promise<boolean> {
    this.ensureConnected();

    const manifest = this.getSafeManifest();
    const item = this.findManifestItem(manifest, id, module);
    if (!item) {
      throw new Error(`Projeto com ID "${id}" não encontrado no manifesto.`);
    }

    // 1. Exclui o arquivo físico primeiro
    const deleted = await this.adapter.deleteFile(item.relativePath);
    if (!deleted) {
      console.warn(`[StudioStorageService] Arquivo ${item.relativePath} não pôde ser excluído ou já não existia.`);
    }

    // 2. Remove o registro do manifesto
    this.removeItemFromManifest(manifest, id, module);
    manifest.lastUpdated = new Date().toISOString();
    await this.saveManifest(manifest);

    this.updateState({ manifest });
    return true;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Auditoria, Verificação de Integridade e Recuperação
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Escaneia a pasta física e repara o catálogo / manifesto contra discrepâncias
   */
  async scanAndRepairCatalog(): Promise<{
    added: number;
    removed: number;
    manifest: StudioManifest;
  }> {
    this.ensureConnected();
    this.updateState({ isLoading: true, error: null });

    try {
      const manifest = this.getSafeManifest();
      let added = 0;
      let removed = 0;

      // 1. Verifica se os arquivos do manifesto ainda existem fisicamente
      const verifyList = async (list: StudioManifestItem[]): Promise<StudioManifestItem[]> => {
        const valid: StudioManifestItem[] = [];
        for (const item of list) {
          const content = await this.adapter.readText(item.relativePath);
          if (content !== null) {
            valid.push(item);
          } else {
            removed++;
          }
        }
        return valid;
      };

      manifest.modules.scores = await verifyList(manifest.modules.scores);
      manifest.modules.styles = await verifyList(manifest.modules.styles);
      manifest.modules.phrases = await verifyList(manifest.modules.phrases);

      // 2. Varre as subpastas em busca de arquivos não indexados no manifesto
      const modules: StudioModuleName[] = ['score', 'arranger', 'phrase'];
      const unindexedFound: { relativePath: string; module: StudioModuleName; title: string }[] = [];

      for (const mod of modules) {
        const subfolder = MODULE_TO_SUBFOLDER[mod];
        const files = await this.adapter.listFiles(subfolder);
        const existingPaths = new Set(this.getItemsForModule(manifest, mod).map(i => i.relativePath));

        for (const filename of files) {
          const relativePath = `${subfolder}/${filename}`;
          if (!existingPaths.has(relativePath)) {
            // Arquivo encontrado fora do manifesto!
            const text = await this.adapter.readText(relativePath);
            if (text) {
              try {
                const parsed = JSON.parse(text);
                const title = parsed.title || filename.replace('.json', '');
                const id = parsed.id || this.generateId(title);

                const newItem: StudioManifestItem = {
                  id,
                  title,
                  category: parsed.category || 'Recuperado',
                  module: mod,
                  relativePath,
                  createdAt: parsed.createdAt || new Date().toISOString(),
                  updatedAt: parsed.updatedAt || new Date().toISOString(),
                  version: parsed.version || '1.0.0',
                  metadata: parsed.metadata || {},
                };

                this.addItemToManifest(manifest, newItem);
                added++;
              } catch {
                unindexedFound.push({ relativePath, module: mod, title: filename });
              }
            }
          }
        }
      }

      manifest.lastUpdated = new Date().toISOString();
      await this.saveManifest(manifest);

      this.updateState({
        manifest,
        unindexedFiles: unindexedFound,
        isLoading: false,
      });

      return { added, removed, manifest };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.updateState({ isLoading: false, error: `Falha ao reparar catálogo: ${msg}` });
      throw err;
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Auxiliares de Manifesto e Utilitários
  // ──────────────────────────────────────────────────────────────────────────

  private async loadOrCreateManifest(): Promise<StudioManifest> {
    let manifestText: string | null = null;
    try {
      manifestText = await this.adapter.readText(MANIFEST_FILENAME);
    } catch (err) {
      console.warn('[StudioStorageService] Falha ao ler manifesto:', err);
    }

    if (!manifestText) {
      // Cria novo manifesto inicial
      const initialManifest: StudioManifest = {
        version: MANIFEST_VERSION,
        lastUpdated: new Date().toISOString(),
        modules: {
          scores: [],
          styles: [],
          phrases: [],
        },
      };
      await this.saveManifest(initialManifest);
      this.updateState({ manifest: initialManifest, isLoading: false });
      return initialManifest;
    }

    try {
      const parsed = JSON.parse(manifestText) as StudioManifest;
      if (!parsed.modules || !Array.isArray(parsed.modules.scores)) {
        throw new Error('Formato de manifesto corrompido');
      }
      this.updateState({ manifest: parsed, isLoading: false });
      return parsed;
    } catch {
      console.warn('[StudioStorageService] Manifesto corrompido. Executando auto-recuperação...');
      const repairResult = await this.scanAndRepairCatalog();
      return repairResult.manifest;
    }
  }

  private async saveManifest(manifest: StudioManifest): Promise<void> {
    manifest.lastUpdated = new Date().toISOString();
    const content = JSON.stringify(manifest, null, 2);
    await this.adapter.writeText(MANIFEST_FILENAME, content);
  }

  private getSafeManifest(): StudioManifest {
    if (this.state.manifest) return this.state.manifest;
    return {
      version: MANIFEST_VERSION,
      lastUpdated: new Date().toISOString(),
      modules: { scores: [], styles: [], phrases: [] },
    };
  }

  private getItemsForModule(manifest: StudioManifest, module: StudioModuleName): StudioManifestItem[] {
    switch (module) {
      case 'score': return manifest.modules.scores;
      case 'arranger': return manifest.modules.styles;
      case 'phrase': return manifest.modules.phrases;
    }
  }

  private addItemToManifest(manifest: StudioManifest, item: StudioManifestItem): void {
    const list = this.getItemsForModule(manifest, item.module);
    const existingIdx = list.findIndex(i => i.id === item.id);
    if (existingIdx >= 0) {
      list[existingIdx] = item;
    } else {
      list.unshift(item);
    }
  }

  private removeItemFromManifest(manifest: StudioManifest, id: string, module: StudioModuleName): void {
    switch (module) {
      case 'score':
        manifest.modules.scores = manifest.modules.scores.filter(i => i.id !== id);
        break;
      case 'arranger':
        manifest.modules.styles = manifest.modules.styles.filter(i => i.id !== id);
        break;
      case 'phrase':
        manifest.modules.phrases = manifest.modules.phrases.filter(i => i.id !== id);
        break;
    }
  }

  private findManifestItem(manifest: StudioManifest, id: string, module: StudioModuleName): StudioManifestItem | undefined {
    return this.getItemsForModule(manifest, module).find(i => i.id === id);
  }

  private inferModuleFromPath(relativePath: string): StudioModuleName {
    if (relativePath.startsWith('Partituras/')) return 'score';
    if (relativePath.startsWith('Ritmos/')) return 'arranger';
    if (relativePath.startsWith('Frases/')) return 'phrase';
    return 'score';
  }

  private generateId(title: string): string {
    const slug = this.slugify(title);
    const rand = Math.random().toString(36).substring(2, 8);
    const time = Date.now().toString(36);
    return `${slug}_${time}_${rand}`;
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 30) || 'projeto';
  }

  private ensureConnected(): void {
    if (!this.state.folderInfo || !this.state.folderInfo.isAvailable) {
      throw new Error('Nenhuma pasta do Estúdio conectada ou autorizada com permissão de escrita.');
    }
  }
}

// Instância singleton padrão para o aplicativo
export const studioStorageService = new StudioStorageService();
