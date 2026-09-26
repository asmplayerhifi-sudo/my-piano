/**
 * useStudioStorage.ts
 * React hook para integração reativa com o StudioStorageService.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { studioStorageService, StudioStorageService } from './studioStorageService';
import type { StudioStorageState, StudioModuleName, StudioManifestItem } from './studioStorageTypes';

export function useStudioStorage(customService?: StudioStorageService) {
  const service = useMemo(() => customService || studioStorageService, [customService]);
  const [state, setState] = useState<StudioStorageState>(() => service.getState());

  useEffect(() => {
    const unsub = service.subscribe((next) => {
      setState(next);
    });

    // Inicialização silenciosa para restaurar handle se existir
    service.initialize();

    return unsub;
  }, [service]);

  const selectDirectory = useCallback(async () => {
    return await service.selectDirectory();
  }, [service]);

  const requestPermission = useCallback(async () => {
    return await service.requestPermission();
  }, [service]);

  const disconnectFolder = useCallback(async () => {
    await service.disconnectFolder();
  }, [service]);

  const createProject = useCallback(
    async <T = unknown>(params: {
      module: StudioModuleName;
      title: string;
      category?: string;
      data: T;
      metadata?: Record<string, unknown>;
    }) => {
      return await service.createProject(params);
    },
    [service]
  );

  const openProject = useCallback(
    async <T = unknown>(relativePath: string) => {
      return await service.openProject<T>(relativePath);
    },
    [service]
  );

  const saveProject = useCallback(
    async <T = unknown>(params: {
      id: string;
      module: StudioModuleName;
      title?: string;
      category?: string;
      data: T;
      metadata?: Record<string, unknown>;
    }) => {
      return await service.saveProject(params);
    },
    [service]
  );

  const saveProjectAs = useCallback(
    async <T = unknown>(params: {
      originalId: string;
      module: StudioModuleName;
      newTitle: string;
      category?: string;
      data: T;
      metadata?: Record<string, unknown>;
    }) => {
      return await service.saveProjectAs(params);
    },
    [service]
  );

  const deleteProject = useCallback(
    async (id: string, module: StudioModuleName) => {
      return await service.deleteProject(id, module);
    },
    [service]
  );

  const scanAndRepairCatalog = useCallback(async () => {
    return await service.scanAndRepairCatalog();
  }, [service]);

  const getProjectsForModule = useCallback(
    (module: StudioModuleName): StudioManifestItem[] => {
      if (!state.manifest) return [];
      switch (module) {
        case 'score': return state.manifest.modules.scores;
        case 'arranger': return state.manifest.modules.styles;
        case 'phrase': return state.manifest.modules.phrases;
      }
    },
    [state.manifest]
  );

  return {
    state,
    folderInfo: state.folderInfo,
    manifest: state.manifest,
    isLoading: state.isLoading,
    error: state.error,
    unindexedFiles: state.unindexedFiles,
    isSupported: service.getAdapter().isSupported(),
    selectDirectory,
    requestPermission,
    disconnectFolder,
    createProject,
    openProject,
    saveProject,
    saveProjectAs,
    deleteProject,
    scanAndRepairCatalog,
    getProjectsForModule,
  };
}
