/**
 * IStudioStorageAdapter.ts
 * Contrato abstrato de adaptador de armazenamento do Estúdio Harmonia.
 * 
 * Desacopla o serviço de domínio das peculiaridades do navegador
 * (File System Access API / IndexedDB) e do Desktop/Electron.
 */

import type { StudioFolderInfo, StudioSubfolder } from './studioStorageTypes';

export interface IStudioStorageAdapter {
  /**
   * Indica se a API de armazenamento subjacente é suportada no ambiente atual
   */
  isSupported(): boolean;

  /**
   * Retorna os dados da pasta atualmente vinculada ou null se nenhuma pasta estiver associada
   */
  getFolderInfo(): Promise<StudioFolderInfo | null>;

  /**
   * Abre o seletor de pasta nativo do sistema operacional (showDirectoryPicker ou diálogo desktop).
   * Deve ser invocado via gesto direto do usuário.
   */
  selectDirectory(): Promise<StudioFolderInfo>;

  /**
   * Solicita autorização de leitura e escrita para o handle já vinculado
   */
  requestPermission(): Promise<boolean>;

  /**
   * Verifica se existe um handle ou referência de pasta persistida de sessões anteriores
   */
  hasStoredHandle(): Promise<boolean>;

  /**
   * Tenta restaurar a referência da pasta salva no IndexedDB / armazenamento persistente
   */
  restoreHandle(): Promise<StudioFolderInfo | null>;

  /**
   * Desconecta a pasta atual e remove a referência persistida
   */
  disconnect(): Promise<void>;

  /**
   * Lê o conteúdo textual de um arquivo a partir de um caminho relativo à raiz da pasta
   */
  readText(relativePath: string): Promise<string | null>;

  /**
   * Grava o conteúdo textual em um arquivo a partir de um caminho relativo à raiz da pasta.
   * Cria o arquivo e diretórios intermediários caso não existam.
   */
  writeText(relativePath: string, content: string): Promise<void>;

  /**
   * Remove fisicamente um arquivo a partir de um caminho relativo à raiz da pasta
   */
  deleteFile(relativePath: string): Promise<boolean>;

  /**
   * Lista os nomes de arquivos (somente os arquivos, ex: ["musica1.json"]) existentes na subpasta
   */
  listFiles(subfolder: StudioSubfolder): Promise<string[]>;

  /**
   * Garante a existência das subpastas obrigatórias no diretório do usuário
   */
  ensureDirectories(folders: StudioSubfolder[]): Promise<void>;
}
