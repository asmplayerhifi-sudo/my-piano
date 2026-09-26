/**
 * tests/domain/StudioStorageCRUD.spec.ts
 * Suíte de Testes do Sistema de Armazenamento Local Soberano do Estúdio Harmonia.
 * 
 * Validação rigorosa dos Requisitos de Engenharia:
 * - CRUD Real de Arquivos em Pasta Soberana (Partituras/, Ritmos/, Frases/)
 * - Manifesto Mestre studio_manifest.json com caminhos estritamente relativos
 * - Operações Create, Read, Update, Save As e Delete físico
 * - Troca de pasta sem perda ou remoção de dados da pasta anterior
 * - Persistência e restauração de sessão com verificação de permissões
 * - Auditoria de integridade e auto-recuperação de arquivos não indexados
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { StudioStorageService } from '../../src/core/studio/studioStorageService';
import { MemoryVirtualStorageAdapter } from '../../src/core/studio/MemoryVirtualStorageAdapter';
import {
  MANIFEST_FILENAME,
  MANIFEST_VERSION,
  REQUIRED_STUDIO_FOLDERS,
} from '../../src/core/studio/studioStorageTypes';

describe('Studio Storage Service — CRUD Local com Pasta Soberana', () => {
  let adapter: MemoryVirtualStorageAdapter;
  let service: StudioStorageService;

  beforeEach(async () => {
    adapter = new MemoryVirtualStorageAdapter('Pasta_Estudio_Usuario');
    service = new StudioStorageService(adapter);
    await service.selectDirectory();
  });

  describe('1. Inicialização da Pasta Soberana e Manifesto', () => {
    it('deve criar automaticamente as subpastas obrigatórias Partituras/, Ritmos/ e Frases/', async () => {
      const state = service.getState();
      expect(state.folderInfo).not.toBeNull();
      expect(state.folderInfo?.name).toBe('Pasta_Estudio_Usuario');
      expect(state.folderInfo?.isAvailable).toBe(true);

      // Verifica se as pastas foram criadas no adaptador
      REQUIRED_STUDIO_FOLDERS.forEach(async (folder) => {
        const files = await adapter.listFiles(folder);
        expect(Array.isArray(files)).toBe(true);
      });
    });

    it('deve criar o manifesto mestre studio_manifest.json com estrutura e versão corretas', async () => {
      const manifestText = await adapter.readText(MANIFEST_FILENAME);
      expect(manifestText).not.toBeNull();

      const manifest = JSON.parse(manifestText!);
      expect(manifest.version).toBe(MANIFEST_VERSION);
      expect(manifest.modules).toBeDefined();
      expect(Array.isArray(manifest.modules.scores)).toBe(true);
      expect(Array.isArray(manifest.modules.styles)).toBe(true);
      expect(Array.isArray(manifest.modules.phrases)).toBe(true);
    });

    it('deve armazenar caminhos estritamente relativos e nunca caminhos absolutos de sistema (C:\\...)', async () => {
      const { item } = await service.createProject({
        module: 'score',
        title: 'Estudo em Dó Maior',
        data: { notes: [], bpm: 120 },
      });

      expect(item.relativePath).toBeTypeOf('string');
      expect(item.relativePath.startsWith('Partituras/')).toBe(true);
      expect(item.relativePath).not.toContain('C:');
      expect(item.relativePath).not.toContain('\\');
    });
  });

  describe('2. Operações CRUD nos Três Módulos (Partitura, Arranjador, Fraseador)', () => {
    it('deve criar projeto no módulo Partituras com arquivo físico real e registro no manifesto', async () => {
      const scoreData = {
        bpm: 130,
        timeSignature: [4, 4] as [number, number],
        notes: [
          { id: 'n1', midi: 60, beat: 0, duration: 1 },
          { id: 'n2', midi: 64, beat: 1, duration: 1 },
        ],
      };

      const { item, envelope } = await service.createProject({
        module: 'score',
        title: 'Sonata ao Luar',
        category: 'Clássico',
        data: scoreData,
        metadata: { bpm: 130, notesCount: 2 },
      });

      expect(item.title).toBe('Sonata ao Luar');
      expect(item.module).toBe('score');
      expect(item.relativePath.startsWith('Partituras/')).toBe(true);

      // Validação do arquivo físico
      const physicalText = await adapter.readText(item.relativePath);
      expect(physicalText).not.toBeNull();
      const parsed = JSON.parse(physicalText!);
      expect(parsed.id).toBe(item.id);
      expect(parsed.data.bpm).toBe(130);
      expect(parsed.data.notes.length).toBe(2);

      // Validação no manifesto
      const manifest = service.getState().manifest!;
      const foundInManifest = manifest.modules.scores.find((s) => s.id === item.id);
      expect(foundInManifest).toBeDefined();
      expect(foundInManifest?.title).toBe('Sonata ao Luar');
    });

    it('deve criar projeto no módulo Arranjador (Ritmos/) com metadados de kit e andamento', async () => {
      const rhythmData = {
        bpm: 140,
        genre: 'Forró',
        kit: 'brazilian',
      };

      const { item } = await service.createProject({
        module: 'arranger',
        title: 'Pisada do Sertão',
        category: 'Forró',
        data: rhythmData,
        metadata: { bpm: 140, genre: 'Forró' },
      });

      expect(item.relativePath.startsWith('Ritmos/')).toBe(true);
      const manifest = service.getState().manifest!;
      expect(manifest.modules.styles.some((s) => s.id === item.id)).toBe(true);
    });

    it('deve criar projeto no módulo Fraseador (Frases/) com notas e transposição', async () => {
      const phraseData = {
        bpm: 95,
        tonalityOffset: 2,
        notes: [{ midi: 62, duration: 0.5, articulation: 'legato' }],
      };

      const { item } = await service.createProject({
        module: 'phrase',
        title: 'Lick Blues em Ré',
        category: 'Blues',
        data: phraseData,
        metadata: { bpm: 95, notesCount: 1 },
      });

      expect(item.relativePath.startsWith('Frases/')).toBe(true);
      const manifest = service.getState().manifest!;
      expect(manifest.modules.phrases.some((p) => p.id === item.id)).toBe(true);
    });

    it('Read: deve abrir projeto do disco com integridade total', async () => {
      const { item } = await service.createProject({
        module: 'score',
        title: 'Prelúdio nº 1',
        data: { bpm: 110, notes: [{ midi: 60 }] },
      });

      const loadedEnvelope = await service.openProject<{ bpm: number; notes: any[] }>(item.relativePath);
      expect(loadedEnvelope.id).toBe(item.id);
      expect(loadedEnvelope.title).toBe('Prelúdio nº 1');
      expect(loadedEnvelope.data.bpm).toBe(110);
      expect(loadedEnvelope.data.notes.length).toBe(1);
    });

    it('Update: deve atualizar arquivo físico e atualizar updatedAt no manifesto atomicamente', async () => {
      const { item } = await service.createProject({
        module: 'score',
        title: 'Minha Obra',
        data: { bpm: 100, notes: [] },
      });

      const initialUpdatedAt = item.updatedAt;

      // Espera 10ms para garantir timestamp posterior
      await new Promise((r) => setTimeout(r, 10));

      const updatedItem = await service.saveProject({
        id: item.id,
        module: 'score',
        title: 'Minha Obra (Revisada)',
        data: { bpm: 128, notes: [{ midi: 67 }] },
        metadata: { bpm: 128, notesCount: 1 },
      });

      expect(updatedItem.title).toBe('Minha Obra (Revisada)');
      expect(new Date(updatedItem.updatedAt).getTime()).toBeGreaterThanOrEqual(new Date(initialUpdatedAt).getTime());

      // Verifica arquivo no disco
      const text = await adapter.readText(updatedItem.relativePath);
      const parsed = JSON.parse(text!);
      expect(parsed.title).toBe('Minha Obra (Revisada)');
      expect(parsed.data.bpm).toBe(128);
      expect(parsed.data.notes.length).toBe(1);
    });

    it('Save As: deve criar nova identidade e novo arquivo sem sobrescrever o original', async () => {
      const { item: original } = await service.createProject({
        module: 'score',
        title: 'Tema Principal',
        data: { bpm: 120, notes: [{ midi: 60 }] },
      });

      const { item: copy } = await service.saveProjectAs({
        originalId: original.id,
        module: 'score',
        newTitle: 'Tema Principal (Variação)',
        data: { bpm: 140, notes: [{ midi: 60 }, { midi: 64 }] },
      });

      expect(copy.id).not.toBe(original.id);
      expect(copy.title).toBe('Tema Principal (Variação)');
      expect(copy.relativePath).not.toBe(original.relativePath);

      // O arquivo original deve permanecer intacto
      const originalText = await adapter.readText(original.relativePath);
      const originalParsed = JSON.parse(originalText!);
      expect(originalParsed.title).toBe('Tema Principal');
      expect(originalParsed.data.bpm).toBe(120);

      // O arquivo novo deve conter as alterações
      const copyText = await adapter.readText(copy.relativePath);
      const copyParsed = JSON.parse(copyText!);
      expect(copyParsed.title).toBe('Tema Principal (Variação)');
      expect(copyParsed.data.bpm).toBe(140);
      expect(copyParsed.data.notes.length).toBe(2);

      // O manifesto deve conter ambos os projetos
      const manifest = service.getState().manifest!;
      expect(manifest.modules.scores.some((s) => s.id === original.id)).toBe(true);
      expect(manifest.modules.scores.some((s) => s.id === copy.id)).toBe(true);
    });

    it('Delete: deve excluir o arquivo físico real e remover o registro do manifesto', async () => {
      const { item } = await service.createProject({
        module: 'score',
        title: 'Rascunho a Deletar',
        data: { notes: [] },
      });

      // Confirma que existe no disco
      expect(await adapter.readText(item.relativePath)).not.toBeNull();

      // Exclui
      const success = await service.deleteProject(item.id, 'score');
      expect(success).toBe(true);

      // Confirma que o arquivo físico foi removido do disco
      expect(await adapter.readText(item.relativePath)).toBeNull();

      // Confirma que não consta mais no manifesto
      const manifest = service.getState().manifest!;
      expect(manifest.modules.scores.some((s) => s.id === item.id)).toBe(false);
    });
  });

  describe('3. Troca de Pasta Soberana e Preservação de Dados', () => {
    it('trocar de pasta nunca deve apagar ou mover arquivos da pasta anterior', async () => {
      // 1. Cria projeto na Pasta 1
      const { item: proj1 } = await service.createProject({
        module: 'score',
        title: 'Projeto Pasta 1',
        data: { notes: [] },
      });

      const pasta1Files = new Map(adapter.getRawFiles());
      expect(pasta1Files.has(proj1.relativePath)).toBe(true);

      // 2. Simula troca para Pasta 2 com outro adaptador
      const adapter2 = new MemoryVirtualStorageAdapter('Segunda_Pasta_Estudio');
      service.setAdapter(adapter2);
      await service.selectDirectory();

      expect(service.getState().folderInfo?.name).toBe('Segunda_Pasta_Estudio');
      expect(service.getState().manifest?.modules.scores.length).toBe(0);

      // Cria projeto na Pasta 2
      const { item: proj2 } = await service.createProject({
        module: 'score',
        title: 'Projeto Pasta 2',
        data: { notes: [] },
      });

      // 3. Os arquivos da Pasta 1 permanecem 100% intactos no adapter 1
      expect(await adapter.readText(proj1.relativePath)).not.toBeNull();
      // O projeto da Pasta 2 está no adapter 2
      expect(await adapter2.readText(proj2.relativePath)).not.toBeNull();
    });

    it('ao selecionar uma pasta existente contendo projetos, deve carregar o catálogo automaticamente', async () => {
      // Cria projeto no adapter
      const { item } = await service.createProject({
        module: 'score',
        title: 'Partitura Existente',
        data: { notes: [] },
      });

      // Desconecta serviço
      await service.disconnectFolder();
      expect(service.getState().folderInfo).toBeNull();
      expect(service.getState().manifest).toBeNull();

      // Reconecta à mesma pasta
      await service.selectDirectory();
      const restoredManifest = service.getState().manifest!;
      expect(restoredManifest.modules.scores.some((s) => s.id === item.id)).toBe(true);
    });
  });

  describe('4. Auditoria de Integridade e Auto-Recuperação do Catálogo', () => {
    it('deve incorporar ao catálogo arquivos físicos criados fora do aplicativo (não indexados)', async () => {
      // Simula arquivo criado externamente (ex: cópia via Windows Explorer) em Partituras/
      const externalProject = {
        id: 'externo_123',
        title: 'Partitura Criada Externamente',
        module: 'score',
        category: 'Importados',
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        data: { bpm: 120, notes: [] },
      };

      await adapter.writeText('Partituras/partitura_externa.json', JSON.stringify(externalProject));

      // Executa varredura de integridade
      const result = await service.scanAndRepairCatalog();
      expect(result.added).toBeGreaterThanOrEqual(1);

      const manifest = service.getState().manifest!;
      const found = manifest.modules.scores.find((s) => s.relativePath === 'Partituras/partitura_externa.json');
      expect(found).toBeDefined();
      expect(found?.title).toBe('Partitura Criada Externamente');
    });

    it('deve remover do manifesto entradas cujos arquivos físicos foram deletados fora do app', async () => {
      const { item } = await service.createProject({
        module: 'score',
        title: 'Projeto a Ser Deletado Externamente',
        data: { notes: [] },
      });

      // Deleta o arquivo fisicamente "por fora"
      await adapter.deleteFile(item.relativePath);

      // Executa varredura
      const result = await service.scanAndRepairCatalog();
      expect(result.removed).toBeGreaterThanOrEqual(1);

      const manifest = service.getState().manifest!;
      expect(manifest.modules.scores.some((s) => s.id === item.id)).toBe(false);
    });

    it('se studio_manifest.json for corrompido, deve auto-recuperar o manifesto a partir dos arquivos físicos', async () => {
      // 1. Cria dois projetos válidos
      await service.createProject({
        module: 'score',
        title: 'Obra 1',
        data: { notes: [] },
      });
      await service.createProject({
        module: 'arranger',
        title: 'Ritmo 1',
        data: { kit: 'rock' },
      });

      // 2. Corrompe o arquivo do manifesto propositalmente
      await adapter.writeText(MANIFEST_FILENAME, '{{{ JSON QUEBRADO E CORROMPIDO');

      // 3. Tenta reinicializar
      const repairResult = await service.scanAndRepairCatalog();
      expect(repairResult.manifest).toBeDefined();
      expect(repairResult.manifest.modules.scores.length).toBeGreaterThanOrEqual(1);
      expect(repairResult.manifest.modules.styles.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('5. Controle de Sessão e Permissões do Navegador', () => {
    it('quando a permissão estiver em estado prompt, deve solicitar autorização antes de permitir escrita', async () => {
      adapter.setPermission('prompt');
      const info = await adapter.getFolderInfo();
      expect(info?.permissionState).toBe('prompt');
      expect(info?.isAvailable).toBe(false);

      // Tentar salvar deve lançar erro informativo
      await expect(
        service.createProject({
          module: 'score',
          title: 'Tentativa Bloqueada',
          data: {},
        })
      ).rejects.toThrow();

      // Usuário autoriza
      const granted = await service.requestPermission();
      expect(granted).toBe(true);

      const updatedInfo = service.getState().folderInfo;
      expect(updatedInfo?.permissionState).toBe('granted');
      expect(updatedInfo?.isAvailable).toBe(true);

      // Agora a gravação é permitida
      const { item } = await service.createProject({
        module: 'score',
        title: 'Tentativa Bem-Sucedida',
        data: {},
      });
      expect(item.id).toBeDefined();
    });

    it('restaura automaticamente a pasta quando o handle estiver salvo e com permissão concedida', async () => {
      adapter.setStoredHandleFlag(true);
      adapter.setPermission('granted');

      const restoredService = new StudioStorageService(adapter);
      await restoredService.initialize();

      expect(restoredService.getState().folderInfo?.name).toBe('Pasta_Estudio_Usuario');
      expect(restoredService.getState().manifest).not.toBeNull();
    });
  });
});
