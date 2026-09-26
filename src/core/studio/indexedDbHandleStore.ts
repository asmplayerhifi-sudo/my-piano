/**
 * indexedDbHandleStore.ts
 * Persistência segura do FileSystemDirectoryHandle no IndexedDB do navegador.
 * 
 * A File System Access API permite serializar handles diretamente no IndexedDB
 * via Structured Clone Algorithm. Isso permite recuperar a pasta soberana
 * entre sessões sem exigir que o usuário navegue novamente pelo sistema de arquivos.
 */

const DB_NAME = 'HarmoniaStudioStorageDB';
const DB_VERSION = 1;
const STORE_NAME = 'directory_handles';
const ROOT_HANDLE_KEY = 'active_studio_root';

function openDb(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.warn('[indexedDbHandleStore] Falha ao abrir IndexedDB:', request.error);
        resolve(null);
      };
    } catch (err) {
      console.warn('[indexedDbHandleStore] Exceção ao abrir IndexedDB:', err);
      resolve(null);
    }
  });
}

/**
 * Salva o FileSystemDirectoryHandle no IndexedDB
 */
export async function saveDirectoryHandle(handle: FileSystemDirectoryHandle): Promise<boolean> {
  const db = await openDb();
  if (!db) return false;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(handle, ROOT_HANDLE_KEY);

      req.onsuccess = () => resolve(true);
      req.onerror = () => {
        console.warn('[indexedDbHandleStore] Erro ao gravar handle:', req.error);
        resolve(false);
      };
    } catch (err) {
      console.warn('[indexedDbHandleStore] Exceção ao salvar handle:', err);
      resolve(false);
    }
  });
}

/**
 * Recupera o FileSystemDirectoryHandle armazenado no IndexedDB
 */
export async function getDirectoryHandle(): Promise<FileSystemDirectoryHandle | null> {
  const db = await openDb();
  if (!db) return null;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(ROOT_HANDLE_KEY);

      req.onsuccess = () => {
        const val = req.result;
        if (val && typeof val === 'object' && 'name' in val) {
          resolve(val as FileSystemDirectoryHandle);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => {
        console.warn('[indexedDbHandleStore] Erro ao ler handle:', req.error);
        resolve(null);
      };
    } catch (err) {
      console.warn('[indexedDbHandleStore] Exceção ao recuperar handle:', err);
      resolve(null);
    }
  });
}

/**
 * Remove o FileSystemDirectoryHandle armazenado (ao desconectar a pasta)
 */
export async function clearDirectoryHandle(): Promise<boolean> {
  const db = await openDb();
  if (!db) return false;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(ROOT_HANDLE_KEY);

      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}
