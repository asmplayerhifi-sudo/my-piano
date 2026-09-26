/**
 * StudioImportExportBar.tsx
 *
 * Barra de ações de Importação e Exportação reutilizável para todas as telas
 * CRUD do Estúdio (Partitura, Arranjador, Fraseador).
 *
 * Responsabilidades:
 *  - Botão Exportar JSON (todos os módulos) e MIDI (apenas Partitura).
 *  - Botão Importar com `<input type="file">` oculto (.json, .mid, .midi).
 *  - Exibição de erros de validação ao usuário.
 *  - Diálogo de confirmação de conflito (quando ID do arquivo já existe no catálogo).
 *  - Delega toda lógica ao `studioImportExportService` — nenhuma regra aqui.
 */

import React, { useRef, useState, useCallback } from 'react';
import { Upload, Download, FileMusic, AlertTriangle, CheckCircle2, XCircle, X } from 'lucide-react';
import {
  exportProject,
  importProjectFromFile,
  type ExportFormat,
  type ImportResult,
} from '../../core/studio/studioImportExportService';
import type { StudioModuleName, StudioProjectEnvelope, StudioManifestItem } from '../../core/studio/studioStorageTypes';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface StudioImportExportBarProps {
  /** Módulo do Estúdio: determina quais formatos ficam disponíveis. */
  module: StudioModuleName;
  /** Título atual do projeto (usado no nome do arquivo exportado). */
  projectTitle: string;
  /** Envelope completo do projeto para exportação. */
  envelope: StudioProjectEnvelope<unknown>;
  /** Itens do manifesto para detecção de conflitos na importação. */
  existingManifestItems: StudioManifestItem[];
  /**
   * Chamado após importação bem-sucedida (sem conflito ou após confirmação).
   * O chamador é responsável por carregar o conteúdo no estado do CRUD.
   */
  onImport: (envelope: StudioProjectEnvelope<unknown>, format: ExportFormat) => void;
  /** Classe CSS adicional para o container da barra. */
  className?: string;
}

type ToastVariant = 'success' | 'error';

interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ConflictState {
  pending: ImportResult<unknown>;
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Barra de ações de Importação/Exportação do Estúdio.
 * Reutilizável em qualquer tela com CRUD de conteúdo musical.
 */
export const StudioImportExportBar: React.FC<StudioImportExportBarProps> = ({
  module,
  projectTitle,
  envelope,
  existingManifestItems,
  onImport,
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [conflict, setConflict] = useState<ConflictState | null>(null);
  let toastCounter = 0;

  // ─── Toasts ─────────────────────────────────────────────────────────────

  const addToast = useCallback((message: string, variant: ToastVariant) => {
    const id = ++toastCounter;
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4500);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Exportação ─────────────────────────────────────────────────────────

  const handleExport = useCallback((format: ExportFormat) => {
    try {
      exportProject({ module, title: projectTitle, envelope, format });
      addToast(
        format === 'midi'
          ? `"${projectTitle}" exportado como MIDI.`
          : `"${projectTitle}" exportado como JSON.`,
        'success'
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      addToast(`Erro ao exportar: ${msg}`, 'error');
    }
  }, [module, projectTitle, envelope, addToast]);

  // ─── Importação ─────────────────────────────────────────────────────────

  const handleFileSelected = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limpa o input para permitir reimportar o mesmo arquivo
    if (fileInputRef.current) fileInputRef.current.value = '';

    setIsImporting(true);
    try {
      const result = await importProjectFromFile<unknown>(file, {
        existingItems: existingManifestItems,
        expectedModule: module,
      });

      if (!result.success) {
        addToast(result.error ?? 'Erro desconhecido na importação.', 'error');
        return;
      }

      if (result.hasConflict) {
        setConflict({ pending: result });
        return;
      }

      if (result.envelope) {
        onImport(result.envelope, result.format ?? 'json');
        addToast(
          `"${result.envelope.title}" importado com sucesso!`,
          'success'
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      addToast(`Erro inesperado: ${msg}`, 'error');
    } finally {
      setIsImporting(false);
    }
  }, [existingManifestItems, module, onImport, addToast]);

  // ─── Confirmação de Conflito ─────────────────────────────────────────────

  const handleConflictConfirm = useCallback(() => {
    if (!conflict?.pending.envelope) return;
    onImport(conflict.pending.envelope, conflict.pending.format ?? 'json');
    addToast(`"${conflict.pending.envelope.title}" importado (substituindo existente).`, 'success');
    setConflict(null);
  }, [conflict, onImport, addToast]);

  const handleConflictCancel = useCallback(() => {
    setConflict(null);
    addToast('Importação cancelada.', 'error');
  }, [addToast]);

  // ─── Render ──────────────────────────────────────────────────────────────

  const supportsmidi = module === 'score';

  return (
    <div className={`relative ${className}`}>
      {/* Barra de botões */}
      <div className="flex flex-wrap items-center gap-2">

        {/* ── Importar ── */}
        <button
          id="studio-import-btn"
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isImporting}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-200 hover:text-white border border-indigo-500/30 text-xs font-bold transition-all cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Importar projeto (.json, .mid)"
        >
          <Upload className="w-3.5 h-3.5 shrink-0" />
          <span>{isImporting ? 'Importando...' : 'Importar'}</span>
        </button>

        {/* Input de arquivo oculto */}
        <input
          ref={fileInputRef}
          type="file"
          accept={supportsmidi ? '.json,.mid,.midi' : '.json'}
          className="hidden"
          aria-hidden
          onChange={handleFileSelected}
        />

        {/* ── Exportar JSON ── */}
        <button
          id="studio-export-json-btn"
          type="button"
          onClick={() => handleExport('json')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-200 hover:text-white border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer active:scale-95"
          title="Exportar projeto como JSON com schema versionado"
        >
          <Download className="w-3.5 h-3.5 shrink-0" />
          <span>JSON</span>
        </button>

        {/* ── Exportar MIDI (apenas Partitura) ── */}
        {supportsmidi && (
          <button
            id="studio-export-midi-btn"
            type="button"
            onClick={() => handleExport('midi')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/40 text-amber-200 hover:text-white border border-amber-500/30 text-xs font-bold transition-all cursor-pointer active:scale-95"
            title="Exportar partitura como arquivo MIDI Standard (.mid)"
          >
            <FileMusic className="w-3.5 h-3.5 shrink-0" />
            <span>MIDI</span>
          </button>
        )}
      </div>

      {/* ── Diálogo de Conflito ── */}
      {conflict && (
        <div className="absolute top-10 left-0 z-50 w-80 bg-slate-900 border border-amber-500/50 rounded-2xl shadow-2xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-amber-300">Conflito detectado</p>
              <p className="text-xs text-slate-300">
                Já existe um projeto com o mesmo ID no catálogo:
                <br />
                <strong className="text-white">"{conflict.pending.conflictingItem?.title}"</strong>
              </p>
              <p className="text-xs text-slate-400">
                Deseja substituir o projeto existente pelo arquivo importado?
              </p>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={handleConflictCancel}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConflictConfirm}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3 h-3" />
              Substituir
            </button>
          </div>
        </div>
      )}

      {/* ── Toasts de Feedback ── */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border shadow-xl text-xs font-semibold max-w-xs animate-in fade-in slide-in-from-bottom-2 pointer-events-auto ${
              toast.variant === 'success'
                ? 'bg-emerald-950/95 border-emerald-500/50 text-emerald-200'
                : 'bg-rose-950/95 border-rose-500/50 text-rose-200'
            }`}
          >
            {toast.variant === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <XCircle className="w-4 h-4 shrink-0 text-rose-400" />
            )}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
