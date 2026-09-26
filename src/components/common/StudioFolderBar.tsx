/**
 * StudioFolderBar.tsx
 * Barra Soberana de Identificação e Controle da Pasta do Estúdio.
 *
 * Exibe o status da pasta vinculada:
 * 📂 Pasta do Estúdio [Nome da Pasta] [Status] [Alterar Pasta]
 */

import React, { useState } from 'react';
import { useStudioStorage } from '../../core/studio/useStudioStorage';
import {
  FolderOpen,
  FolderCheck,
  FolderLock,
  RefreshCw,
  AlertCircle,
  Unlink,
  CheckCircle2,
  FolderPlus,
} from 'lucide-react';

interface Props {
  className?: string;
  onOpenCatalog?: () => void;
}

export const StudioFolderBar: React.FC<Props> = ({ className = '', onOpenCatalog }) => {
  const {
    folderInfo,
    isLoading,
    isSupported,
    selectDirectory,
    requestPermission,
    disconnectFolder,
    scanAndRepairCatalog,
  } = useStudioStorage();

  const [repairMessage, setRepairMessage] = useState<string | null>(null);

  const handleSelect = async () => {
    setRepairMessage(null);
    await selectDirectory();
  };

  const handleRequestPerm = async () => {
    setRepairMessage(null);
    await requestPermission();
  };

  const handleRepair = async () => {
    try {
      const res = await scanAndRepairCatalog();
      setRepairMessage(`Catálogo reparado: +${res.added} adicionado(s), -${res.removed} removido(s)`);
      setTimeout(() => setRepairMessage(null), 4000);
    } catch {
      setRepairMessage('Erro ao auditar pasta.');
    }
  };

  if (!isSupported) {
    return (
      <div
        className={`px-3 py-2 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between gap-3 ${className}`}
      >
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Aviso de Compatibilidade:</strong> A File System Access API não está disponível neste navegador.
            Utilizando armazenamento em memória na sessão atual.
          </span>
        </div>
      </div>
    );
  }

  // 1. Estado: Nenhuma pasta conectada
  if (!folderInfo) {
    return (
      <div
        className={`px-3.5 py-2.5 rounded-xl bg-violet-950/30 border border-violet-500/30 text-xs flex flex-wrap items-center justify-between gap-3 shadow-lg backdrop-blur-md ${className}`}
      >
        <div className="flex items-center gap-2.5 text-slate-200">
          <div className="w-7 h-7 rounded-lg bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-violet-300">
            <FolderPlus className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white block">📂 Pasta Soberana do Estúdio</span>
            <span className="text-[11px] text-slate-400">
              Selecione uma pasta local no seu computador onde os projetos de Partitura, Ritmos e Frases serão salvos.
            </span>
          </div>
        </div>

        <button
          onClick={handleSelect}
          disabled={isLoading}
          className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-violet-600/30 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <FolderOpen className="w-3.5 h-3.5" />
          {isLoading ? 'Conectando...' : 'Selecionar Pasta do Estúdio'}
        </button>
      </div>
    );
  }

  // 2. Estado: Pasta vinculada, mas pendente de autorização (Prompt)
  if (folderInfo.permissionState === 'prompt' || !folderInfo.isAvailable) {
    return (
      <div
        className={`px-3.5 py-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs flex flex-wrap items-center justify-between gap-3 shadow-lg backdrop-blur-md ${className}`}
      >
        <div className="flex items-center gap-2.5 text-amber-200">
          <div className="w-7 h-7 rounded-lg bg-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-300">
            <FolderLock className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white flex items-center gap-1.5">
              📂 Pasta: <span className="text-amber-300 underline font-mono">{folderInfo.name}</span>
            </span>
            <span className="text-[11px] text-amber-300/80">
              O navegador requer sua autorização para ler e gravar nesta pasta nesta sessão.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRequestPerm}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <FolderCheck className="w-3.5 h-3.5" />
            Autorizar Acesso
          </button>
          <button
            onClick={handleSelect}
            className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 text-xs transition-all cursor-pointer"
          >
            Alterar Pasta
          </button>
        </div>
      </div>
    );
  }

  // 3. Estado: Conectado e Autorizado (Granted)
  return (
    <div
      className={`px-3.5 py-2 rounded-xl bg-[#0f111c]/90 border border-emerald-500/30 text-xs flex flex-wrap items-center justify-between gap-3 shadow-md backdrop-blur-md ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
          <FolderCheck className="w-3.5 h-3.5" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">📂 Pasta do Estúdio:</span>
          <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-mono font-bold text-[11px]">
            {folderInfo.name}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-emerald-400/90 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded">
            <CheckCircle2 className="w-2.5 h-2.5" />
            Leitura & Escrita
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {repairMessage && (
          <span className="text-[11px] text-indigo-300 animate-pulse mr-2">
            {repairMessage}
          </span>
        )}

        {onOpenCatalog && (
          <button
            onClick={onOpenCatalog}
            className="px-2.5 py-1 rounded-lg bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/40 text-violet-200 font-medium text-[11px] transition-all cursor-pointer"
            title="Abrir Catálogo de Projetos"
          >
            Ver Projetos
          </button>
        )}

        <button
          onClick={handleRepair}
          disabled={isLoading}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
          title="Verificar integridade da pasta e sincronizar com studio_manifest.json"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>

        <button
          onClick={handleSelect}
          disabled={isLoading}
          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-medium text-[11px] transition-all cursor-pointer"
        >
          Alterar Pasta
        </button>

        <button
          onClick={disconnectFolder}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-300 transition-all cursor-pointer"
          title="Desconectar Pasta"
        >
          <Unlink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
