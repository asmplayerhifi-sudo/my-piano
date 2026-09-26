/**
 * StudioProjectModal.tsx
 * Modal Soberano de Gerenciamento e Catálogo de Projetos do Estúdio Harmonia.
 * 
 * Atende aos três módulos:
 * - Partituras (Partituras/)
 * - Arranjador / Ritmos (Ritmos/)
 * - Fraseador (Frases/)
 */

import React, { useState, useMemo } from 'react';
import {
  X,
  FolderOpen,
  Plus,
  Trash2,
  Download,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Music,
  Drum,
  Wand2,
  FileJson,
  Copy,
} from 'lucide-react';
import { useStudioStorage } from '../../core/studio/useStudioStorage';
import type {
  StudioModuleName,
  StudioManifestItem,
  StudioProjectEnvelope,
} from '../../core/studio/studioStorageTypes';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activeModule: StudioModuleName;
  currentProjectId?: string | null;
  onOpenProject: (relativePath: string, envelope: StudioProjectEnvelope<any>) => void;
  onCreateNewProject?: (title: string) => void;
  onSaveCurrentAs?: (newTitle: string) => void;
}

export const StudioProjectModal: React.FC<Props> = ({
  isOpen,
  onClose,
  activeModule,
  currentProjectId,
  onOpenProject,
  onCreateNewProject,
  onSaveCurrentAs,
}) => {
  const {
    folderInfo,
    manifest,
    isLoading,
    selectDirectory,
    deleteProject,
    openProject,
    scanAndRepairCatalog,
    getProjectsForModule,
  } = useStudioStorage();

  const [currentTab, setCurrentTab] = useState<StudioModuleName>(activeModule);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newTitle, setNewTitle] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isSavingAs, setIsSavingAs] = useState(false);
  const [saveAsTitle, setSaveAsTitle] = useState('');

  // Confirmação explícita de exclusão
  const [projectToDelete, setProjectToDelete] = useState<StudioManifestItem | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const projects = useMemo(() => {
    return getProjectsForModule(currentTab);
  }, [getProjectsForModule, currentTab]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.relativePath.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [projects, searchQuery, selectedCategory]);

  if (!isOpen) return null;

  const handleOpen = async (item: StudioManifestItem) => {
    setActionError(null);
    try {
      const envelope = await openProject(item.relativePath);
      onOpenProject(item.relativePath, envelope);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setActionError(`Erro ao abrir projeto: ${msg}`);
    }
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    setActionError(null);
    try {
      await deleteProject(projectToDelete.id, projectToDelete.module);
      setActionSuccess(`Projeto "${projectToDelete.title}" excluído do disco com sucesso.`);
      setProjectToDelete(null);
      setTimeout(() => setActionSuccess(null), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setActionError(`Falha ao excluir arquivo físico: ${msg}`);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    if (onCreateNewProject) {
      onCreateNewProject(newTitle.trim());
      setIsCreatingNew(false);
      setNewTitle('');
      onClose();
    }
  };

  const handleSaveAsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saveAsTitle.trim()) return;
    if (onSaveCurrentAs) {
      onSaveCurrentAs(saveAsTitle.trim());
      setIsSavingAs(false);
      setSaveAsTitle('');
      onClose();
    }
  };

  const handleDownloadBackup = async (item: StudioManifestItem) => {
    try {
      const envelope = await openProject(item.relativePath);
      const blob = new Blob([JSON.stringify(envelope, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${item.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.warn('Falha no download:', err);
    }
  };

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="modal-overlay-responsive z-50 select-none">
      <div className="modal-sheet-responsive md:max-w-4xl max-h-[90vh] md:max-h-[85vh] bg-[#0c0d16] text-slate-100 relative">
        {/* Drag Handle para Mobile */}
        <div className="w-12 h-1.5 rounded-full bg-white/20 mx-auto my-2 md:hidden shrink-0" />

        {/* Cabeçalho do Modal */}
        <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-white/10 flex items-center justify-between bg-[#121422]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400 shrink-0">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                Catálogo de Projetos do Estúdio
                {folderInfo && (
                  <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono font-normal">
                    📁 {folderInfo.name}
                  </span>
                )}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Arquivos .json armazenados diretamente na sua pasta local soberana
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => scanAndRepairCatalog()}
              disabled={isLoading}
              title="Auditar integridade e sincronizar manifesto"
              className="min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
              aria-label="Atualizar catálogo"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Fechar (Esc)"
              aria-label="Fechar catálogo de projetos"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notificações e Alertas */}
        {actionError && (
          <div className="px-4 py-2 bg-red-950/60 border-b border-red-500/30 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}
        {actionSuccess && (
          <div className="px-4 py-2 bg-emerald-950/60 border-b border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Abas dos Módulos do Estúdio */}
        <div className="px-5 pt-3 border-b border-white/5 flex flex-wrap items-center justify-between gap-3 bg-[#0e0f1a]">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentTab('score')}
              className={`px-3 py-1.5 rounded-t-lg font-medium text-xs flex items-center gap-1.5 transition-all cursor-pointer border-b-2 ${
                currentTab === 'score'
                  ? 'border-violet-500 text-violet-300 bg-violet-500/10 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              Partituras ({manifest?.modules.scores.length || 0})
            </button>

            <button
              onClick={() => setCurrentTab('arranger')}
              className={`px-3 py-1.5 rounded-t-lg font-medium text-xs flex items-center gap-1.5 transition-all cursor-pointer border-b-2 ${
                currentTab === 'arranger'
                  ? 'border-amber-500 text-amber-300 bg-amber-500/10 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Drum className="w-3.5 h-3.5" />
              Ritmos ({manifest?.modules.styles.length || 0})
            </button>

            <button
              onClick={() => setCurrentTab('phrase')}
              className={`px-3 py-1.5 rounded-t-lg font-medium text-xs flex items-center gap-1.5 transition-all cursor-pointer border-b-2 ${
                currentTab === 'phrase'
                  ? 'border-purple-500 text-purple-300 bg-purple-500/10 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              Frases ({manifest?.modules.phrases.length || 0})
            </button>
          </div>

          <div className="flex items-center gap-2 pb-2">
            {onCreateNewProject && (
              <button
                onClick={() => {
                  setIsCreatingNew(true);
                  setIsSavingAs(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-violet-600/30 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Novo Projeto
              </button>
            )}

            {onSaveCurrentAs && (
              <button
                onClick={() => {
                  setIsSavingAs(true);
                  setIsCreatingNew(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                Salvar Como
              </button>
            )}
          </div>
        </div>

        {/* Formulário Inline: Criar Novo Projeto */}
        {isCreatingNew && (
          <form
            onSubmit={handleCreateSubmit}
            className="p-3 bg-violet-950/40 border-b border-violet-500/30 flex items-center gap-2"
          >
            <span className="text-xs text-violet-300 font-semibold">Novo Projeto:</span>
            <input
              type="text"
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Digite o título do projeto..."
              className="flex-1 bg-black/50 border border-violet-500/40 rounded-lg px-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
            />
            <button
              type="submit"
              className="px-3 py-1 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs cursor-pointer"
            >
              Criar
            </button>
            <button
              type="button"
              onClick={() => setIsCreatingNew(false)}
              className="px-2 py-1 text-xs text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
          </form>
        )}

        {/* Formulário Inline: Salvar Como */}
        {isSavingAs && (
          <form
            onSubmit={handleSaveAsSubmit}
            className="p-3 bg-amber-950/40 border-b border-amber-500/30 flex items-center gap-2"
          >
            <span className="text-xs text-amber-300 font-semibold">Salvar Cópia Como:</span>
            <input
              type="text"
              autoFocus
              value={saveAsTitle}
              onChange={(e) => setSaveAsTitle(e.target.value)}
              placeholder="Digite o novo título do projeto..."
              className="flex-1 bg-black/50 border border-amber-500/40 rounded-lg px-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs cursor-pointer"
            >
              Salvar Cópia
            </button>
            <button
              type="button"
              onClick={() => setIsSavingAs(false)}
              className="px-2 py-1 text-xs text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
          </form>
        )}

        {/* Barra de Filtros e Busca */}
        <div className="p-3 border-b border-white/5 flex flex-wrap items-center justify-between gap-2 bg-[#0c0d16]">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por título ou arquivo..."
              className="w-full pl-8 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>

          {categories.length > 0 && (
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-500">Categoria:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-[#121422] border border-white/10 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none"
              >
                <option value="all">Todas ({projects.length})</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Lista de Projetos */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 max-h-[50vh]">
          {filteredProjects.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <FileJson className="w-10 h-10 mx-auto mb-2 text-slate-600" />
              <p className="text-sm font-medium text-slate-400">Nenhum projeto encontrado</p>
              <p className="text-xs text-slate-600 mt-1">
                {searchQuery
                  ? 'Nenhum resultado corresponde à sua busca.'
                  : 'Crie um novo projeto ou salve seu trabalho atual nesta pasta.'}
              </p>
            </div>
          ) : (
            filteredProjects.map((item) => {
              const isCurrent = currentProjectId === item.id;
              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border transition-all flex flex-wrap items-center justify-between gap-3 ${
                    isCurrent
                      ? 'bg-violet-950/20 border-violet-500/50 shadow-md shadow-violet-500/10'
                      : 'bg-[#121422]/80 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-[240px] flex-1">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        currentTab === 'score'
                          ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                          : currentTab === 'arranger'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      }`}
                    >
                      {currentTab === 'score' && <Music className="w-4 h-4" />}
                      {currentTab === 'arranger' && <Drum className="w-4 h-4" />}
                      {currentTab === 'phrase' && <Wand2 className="w-4 h-4" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white truncate">{item.title}</span>
                        {isCurrent && (
                          <span className="px-1.5 py-0.2 rounded bg-violet-500/30 text-violet-300 text-[10px] font-semibold">
                            Ativo
                          </span>
                        )}
                        <span className="px-1.5 py-0.2 rounded bg-white/5 text-slate-400 text-[10px]">
                          {item.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                        <span className="font-mono text-slate-500 truncate">{item.relativePath}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {formatDate(item.updatedAt)}
                        </span>
                        {item.metadata?.bpm && <span>• {item.metadata.bpm} BPM</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleOpen(item)}
                      className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs flex items-center gap-1 cursor-pointer transition-all shadow-md shadow-violet-600/20"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      Abrir
                    </button>

                    <button
                      onClick={() => handleDownloadBackup(item)}
                      title="Baixar cópia JSON deste projeto"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setProjectToDelete(item)}
                      title="Excluir arquivo físico e registro do catálogo"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Diálogo de Confirmação Explícita de Exclusão Física */}
        {projectToDelete && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm z-30 flex items-center justify-center p-4">
            <div className="bg-[#151728] border border-red-500/40 rounded-xl max-w-md w-full p-5 shadow-2xl text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 mx-auto mb-3">
                <Trash2 className="w-6 h-6" />
              </div>

              <h3 className="text-base font-bold text-white mb-1">Confirmar Exclusão de Arquivo</h3>
              <p className="text-xs text-slate-300 mb-2">
                Você está prestes a excluir permanentemente o arquivo físico:
              </p>
              <div className="p-2 rounded bg-black/40 font-mono text-xs text-red-300 border border-red-500/20 mb-4">
                {projectToDelete.relativePath}
              </div>
              <p className="text-[11px] text-slate-400 mb-5">
                Esta ação remove o arquivo do disco local e atualiza o manifesto mestre imediatamente.
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setProjectToDelete(null)}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold cursor-pointer transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 cursor-pointer transition-all"
                >
                  Sim, Excluir do Disco
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rodapé com Informações Soberanas */}
        <div className="px-5 py-3 border-t border-white/10 bg-[#0e0f1a] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
            <span>
              Arquivos locais acessíveis diretamente pelo usuário em formato aberto JSON.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => selectDirectory()}
              className="text-violet-400 hover:underline cursor-pointer"
            >
              Trocar de Pasta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
