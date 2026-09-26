/**
 * studioStorageTypes.ts
 * Contratos de tipos para o Sistema de Armazenamento Local Soberano do Estúdio Harmonia.
 * 
 * Módulos suportados:
 * - Partitura  -> pasta "Partituras/"
 * - Arranjador -> pasta "Ritmos/"
 * - Fraseador  -> pasta "Frases/"
 */

export type StudioModuleName = 'score' | 'arranger' | 'phrase';
export type StudioSubfolder = 'Partituras' | 'Ritmos' | 'Frases';

export const MODULE_TO_SUBFOLDER: Record<StudioModuleName, StudioSubfolder> = {
  score: 'Partituras',
  arranger: 'Ritmos',
  phrase: 'Frases',
};

export const SUBFOLDER_TO_MODULE: Record<StudioSubfolder, StudioModuleName> = {
  Partituras: 'score',
  Ritmos: 'arranger',
  Frases: 'phrase',
};

export const REQUIRED_STUDIO_FOLDERS: StudioSubfolder[] = ['Partituras', 'Ritmos', 'Frases'];

export const MANIFEST_FILENAME = 'studio_manifest.json';
export const MANIFEST_VERSION = '1.0.0';

/**
 * Item individual no índice do manifesto mestre studio_manifest.json
 */
export interface StudioManifestItem {
  id: string;
  title: string;
  category: string;
  module: StudioModuleName;
  /** Caminho estritamente relativo à raiz da pasta (ex: "Partituras/minha_musica.json") */
  relativePath: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  version: string;
  metadata?: {
    bpm?: number;
    timeSignature?: [number, number] | string;
    notesCount?: number;
    measuresCount?: number;
    genre?: string;
    kit?: string;
    tonality?: string;
    tags?: string[];
    [key: string]: unknown;
  };
}

/**
 * Estrutura do Manifesto Mestre studio_manifest.json
 */
export interface StudioManifest {
  version: string;
  lastUpdated: string;
  modules: {
    scores: StudioManifestItem[];
    styles: StudioManifestItem[];
    phrases: StudioManifestItem[];
  };
}

/**
 * Status e informações da pasta soberana vinculada
 */
export type StudioPermissionState = 'granted' | 'prompt' | 'denied' | 'unsupported';

export interface StudioFolderInfo {
  name: string;
  isAvailable: boolean;
  permissionState: StudioPermissionState;
  isVirtual?: boolean;
}

/**
 * Notificação de alteração de estado no serviço de armazenamento
 */
export interface StudioStorageState {
  folderInfo: StudioFolderInfo | null;
  manifest: StudioManifest | null;
  isLoading: boolean;
  error: string | null;
  unindexedFiles: {
    relativePath: string;
    module: StudioModuleName;
    title: string;
  }[];
}

/**
 * Representação padronizada de projeto genérico do estúdio
 */
export interface StudioProjectEnvelope<T = unknown> {
  id: string;
  title: string;
  module: StudioModuleName;
  category: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
  data: T;
}
