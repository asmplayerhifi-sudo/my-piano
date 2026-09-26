import React, {
  useState, useRef, useCallback, useEffect, useMemo,
} from 'react';
import {
  RHYTHM_STYLES, RHYTHM_GENRES, DRUM_PADS,
  type RhythmStyle, type SectionId, type DrumPattern, type DrumStep, type DrumPadDef,
} from '../../core/rhythmArrangerData';
import {
  drumEngine, DRUM_KITS,
  type DrumKitId, type StemId, type StemChannelState,
} from '../../core/drumEngine';
import {
  Play, Pause, Square, ChevronLeft, ChevronRight,
  RotateCcw, Download, Search, Disc, Radio,
  Sparkles, SlidersHorizontal, ArrowRight, FolderOpen, Save,
} from 'lucide-react';
import { StudioFolderBar } from '../common/StudioFolderBar';
import { StudioProjectModal } from '../common/StudioProjectModal';
import { StudioImportExportBar } from '../common/StudioImportExportBar';
import { useStudioStorage } from '../../core/studio/useStudioStorage';
import type { StudioProjectEnvelope } from '../../core/studio/studioStorageTypes';
import type { ExportFormat } from '../../core/studio/studioImportExportService';

// ─────────────────────────────────────────────────────────────────────────────
// Tipos & Configurações da UI
// ─────────────────────────────────────────────────────────────────────────────

type ViewMode = 'catalog' | 'pad' | 'editor';

const SECTION_ORDER: SectionId[] = [
  'intro', 'mainA', 'fillAA', 'mainB', 'fillBB', 'mainC', 'mainD', 'ending',
];

const GENRE_COLORS: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  Forró:     { bg: 'bg-amber-500/10',  border: 'border-amber-500/40',  text: 'text-amber-300',  badge: 'bg-amber-500/20 text-amber-200 border-amber-500/40' },
  Piseiro:   { bg: 'bg-red-500/10',    border: 'border-red-500/40',    text: 'text-red-300',    badge: 'bg-red-500/20 text-red-200 border-red-500/40' },
  Baião:     { bg: 'bg-yellow-500/10', border: 'border-yellow-500/40', text: 'text-yellow-300', badge: 'bg-yellow-500/20 text-yellow-200 border-yellow-500/40' },
  Xote:      { bg: 'bg-lime-500/10',   border: 'border-lime-500/40',   text: 'text-lime-300',   badge: 'bg-lime-500/20 text-lime-200 border-lime-500/40' },
  Seresta:   { bg: 'bg-pink-500/10',   border: 'border-pink-500/40',   text: 'text-pink-300',   badge: 'bg-pink-500/20 text-pink-200 border-pink-500/40' },
  Sertanejo: { bg: 'bg-orange-500/10', border: 'border-orange-500/40', text: 'text-orange-300', badge: 'bg-orange-500/20 text-orange-200 border-orange-500/40' },
  Rock:      { bg: 'bg-rose-500/10',   border: 'border-rose-500/40',   text: 'text-rose-300',   badge: 'bg-rose-500/20 text-rose-200 border-rose-500/40' },
  Reggae:    { bg: 'bg-emerald-500/10',border: 'border-emerald-500/40',text: 'text-emerald-300',badge: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40' },
  Pop:       { bg: 'bg-cyan-500/10',   border: 'border-cyan-500/40',   text: 'text-cyan-300',   badge: 'bg-cyan-500/20 text-cyan-200 border-cyan-500/40' },
  Regional:  { bg: 'bg-violet-500/10', border: 'border-violet-500/40', text: 'text-violet-300', badge: 'bg-violet-500/20 text-violet-200 border-violet-500/40' },
  Todos:     { bg: 'bg-slate-500/10',  border: 'border-slate-500/40',  text: 'text-slate-300',  badge: 'bg-slate-500/20 text-slate-200 border-slate-500/40' },
};

// Cores Semânticas Profissionais para os Pads & Sequencer:
// - Tons Quentes: Bumbo e Caixa / Ritmo Primário
// - Tons Amarelos/Laranjas: Pratos e Metais
// - Tons Roxo/Azul/Verde/Teal: Percussão Complementar
const PAD_COLOR_THEMES: Record<string, {
  idleBg: string;
  idleBorder: string;
  glowColor: string;
  activeBg: string;
  stepActive: string;
  textAccent: string;
}> = {
  red: {
    idleBg: 'bg-gradient-to-b from-[#2a1719] to-[#170e10]',
    idleBorder: 'border-red-900/40',
    glowColor: 'rgba(239, 68, 68, 0.45)',
    activeBg: 'bg-red-500',
    stepActive: 'bg-red-500 text-white shadow-red-500/50',
    textAccent: 'text-red-400',
  },
  rose: {
    idleBg: 'bg-gradient-to-b from-[#2b1720] to-[#180e14]',
    idleBorder: 'border-rose-900/40',
    glowColor: 'rgba(244, 63, 94, 0.45)',
    activeBg: 'bg-rose-500',
    stepActive: 'bg-rose-500 text-white shadow-rose-500/50',
    textAccent: 'text-rose-400',
  },
  yellow: {
    idleBg: 'bg-gradient-to-b from-[#292212] to-[#161208]',
    idleBorder: 'border-yellow-900/40',
    glowColor: 'rgba(234, 179, 8, 0.45)',
    activeBg: 'bg-yellow-400',
    stepActive: 'bg-yellow-400 text-black shadow-yellow-400/50',
    textAccent: 'text-yellow-400',
  },
  amber: {
    idleBg: 'bg-gradient-to-b from-[#2b1e10] to-[#171008]',
    idleBorder: 'border-amber-900/40',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    activeBg: 'bg-amber-400',
    stepActive: 'bg-amber-400 text-black shadow-amber-400/50',
    textAccent: 'text-amber-400',
  },
  orange: {
    idleBg: 'bg-gradient-to-b from-[#2d1b10] to-[#180f08]',
    idleBorder: 'border-orange-900/40',
    glowColor: 'rgba(249, 115, 22, 0.45)',
    activeBg: 'bg-orange-500',
    stepActive: 'bg-orange-500 text-white shadow-orange-500/50',
    textAccent: 'text-orange-400',
  },
  purple: {
    idleBg: 'bg-gradient-to-b from-[#24152e] to-[#130b19]',
    idleBorder: 'border-purple-900/40',
    glowColor: 'rgba(168, 85, 247, 0.45)',
    activeBg: 'bg-purple-500',
    stepActive: 'bg-purple-500 text-white shadow-purple-500/50',
    textAccent: 'text-purple-400',
  },
  indigo: {
    idleBg: 'bg-gradient-to-b from-[#181a2e] to-[#0c0e1a]',
    idleBorder: 'border-indigo-900/40',
    glowColor: 'rgba(99, 102, 241, 0.45)',
    activeBg: 'bg-indigo-500',
    stepActive: 'bg-indigo-500 text-white shadow-indigo-500/50',
    textAccent: 'text-indigo-400',
  },
  violet: {
    idleBg: 'bg-gradient-to-b from-[#1f162e] to-[#100a1a]',
    idleBorder: 'border-violet-900/40',
    glowColor: 'rgba(139, 92, 246, 0.45)',
    activeBg: 'bg-violet-500',
    stepActive: 'bg-violet-500 text-white shadow-violet-500/50',
    textAccent: 'text-violet-400',
  },
  teal: {
    idleBg: 'bg-gradient-to-b from-[#112423] to-[#081515]',
    idleBorder: 'border-teal-900/40',
    glowColor: 'rgba(20, 184, 166, 0.45)',
    activeBg: 'bg-teal-400',
    stepActive: 'bg-teal-400 text-black shadow-teal-400/50',
    textAccent: 'text-teal-400',
  },
  cyan: {
    idleBg: 'bg-gradient-to-b from-[#0f232b] to-[#071318]',
    idleBorder: 'border-cyan-900/40',
    glowColor: 'rgba(6, 182, 212, 0.45)',
    activeBg: 'bg-cyan-400',
    stepActive: 'bg-cyan-400 text-black shadow-cyan-400/50',
    textAccent: 'text-cyan-400',
  },
  emerald: {
    idleBg: 'bg-gradient-to-b from-[#10261c] to-[#071610]',
    idleBorder: 'border-emerald-900/40',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    activeBg: 'bg-emerald-400',
    stepActive: 'bg-emerald-400 text-black shadow-emerald-400/50',
    textAccent: 'text-emerald-400',
  },
  green: {
    idleBg: 'bg-gradient-to-b from-[#122818] to-[#08160c]',
    idleBorder: 'border-green-900/40',
    glowColor: 'rgba(34, 197, 94, 0.45)',
    activeBg: 'bg-green-400',
    stepActive: 'bg-green-400 text-black shadow-green-400/50',
    textAccent: 'text-green-400',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Componente: Drum Pad Controlador de Estúdio
// ─────────────────────────────────────────────────────────────────────────────

interface StudioDrumPadProps {
  pad: DrumPadDef;
  isActive: boolean;
  onTrigger: (padKey: string) => void;
}

const StudioDrumPad: React.FC<StudioDrumPadProps> = ({ pad, isActive, onTrigger }) => {
  const [isPressed, setIsPressed] = useState(false);
  const [ripple, setRipple] = useState(false);
  const theme = PAD_COLOR_THEMES[pad.color] ?? PAD_COLOR_THEMES.red;
  const lastTriggerTimeRef = useRef(0);

  const handleTrigger = useCallback((e?: React.SyntheticEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const now = performance.now();
    if (now - lastTriggerTimeRef.current < 50) return;
    lastTriggerTimeRef.current = now;

    setIsPressed(true);
    setRipple(true);
    onTrigger(pad.key);

    setTimeout(() => setIsPressed(false), 90);
    setTimeout(() => setRipple(false), 220);
  }, [onTrigger, pad.key]);

  return (
    <button
      id={`studio-drum-pad-${pad.key}`}
      type="button"
      onPointerDown={handleTrigger}
      onClick={handleTrigger}
      className={`
        group relative flex flex-col justify-between p-2.5 rounded-2xl select-none cursor-pointer
        transition-all duration-75 text-left h-[84px] sm:h-[96px]
        border overflow-hidden
        ${isPressed
          ? 'translate-y-1 scale-[0.97] border-white/60 shadow-[inset_0_4px_12px_rgba(0,0,0,0.85)]'
          : isActive
          ? 'scale-[1.01] border-white/50 shadow-lg'
          : `${theme.idleBg} ${theme.idleBorder} hover:border-white/30 hover:scale-[1.02] shadow-[inset_0_1px_1px_rgba(255,255,255,0.12),inset_0_-2px_4px_rgba(0,0,0,0.7),0_4px_10px_rgba(0,0,0,0.5)]`
        }
      `}
      style={{
        boxShadow: isPressed || isActive
          ? `0 0 18px ${theme.glowColor}, inset 0 2px 8px rgba(0,0,0,0.8)`
          : undefined,
        WebkitTapHighlightColor: 'transparent',
      }}
      title={`${pad.label} (Tecla: ${pad.shortcut})`}
    >
      {/* LED Rim Glow */}
      <div
        className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-150 ${
          isPressed || isActive ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          boxShadow: `inset 0 0 14px ${theme.glowColor}`,
        }}
      />

      {/* Ripple Animation Wave */}
      {ripple && (
        <span
          className="absolute inset-0 rounded-2xl bg-white/20 animate-ping pointer-events-none"
          style={{ animationDuration: '300ms' }}
        />
      )}

      {/* Header do Pad: Atalho + LED Status */}
      <div className="flex items-center justify-between w-full relative z-10">
        <span className="px-1.5 py-0.5 rounded-md bg-black/60 border border-white/10 font-mono text-[9px] font-black text-slate-300 group-hover:text-white">
          {pad.shortcut}
        </span>
        <div className="flex items-center gap-1">
          {/* LED Dot */}
          <span
            className={`w-2 h-2 rounded-full transition-all duration-75 ${
              isPressed || isActive
                ? `${theme.activeBg} shadow-[0_0_8px_white]`
                : 'bg-white/15'
            }`}
          />
        </div>
      </div>

      {/* Nome Técnico do Pad */}
      <div className="relative z-10">
        <div className={`text-[11px] sm:text-xs font-black tracking-wider uppercase font-mono ${
          isPressed || isActive ? 'text-white' : 'text-slate-200'
        }`}>
          {pad.shortLabel}
        </div>
        <div className="text-[9px] text-slate-400 font-medium truncate mt-0.5">
          {pad.label}
        </div>
      </div>

      {/* Dynamic Velocity Visualizer Bar (Medidor de nível inferior) */}
      <div className="w-full h-1 rounded-full bg-black/40 overflow-hidden relative z-10 mt-1">
        <div
          className={`h-full transition-all duration-100 ${
            isPressed || isActive ? `${theme.activeBg} w-full` : 'w-2 bg-white/15'
          }`}
        />
      </div>
    </button>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Componente: Linha do Step Sequencer com Cores Semânticas
// ─────────────────────────────────────────────────────────────────────────────

interface StepSequencerRowProps {
  pad: DrumPadDef;
  stepData: DrumStep;
  currentStep: number;
  isPlaying: boolean;
  onToggleStep: (stepIndex: number) => void;
  onClearRow: () => void;
  onTriggerPad: () => void;
}

const StepSequencerRow: React.FC<StepSequencerRowProps> = ({
  pad, stepData, currentStep, isPlaying, onToggleStep, onClearRow, onTriggerPad,
}) => {
  const theme = PAD_COLOR_THEMES[pad.color] ?? PAD_COLOR_THEMES.red;

  return (
    <div className="flex items-center gap-2 group">
      {/* Botão lateral de disparo e label do instrumento */}
      <button
        type="button"
        onPointerDown={(e) => {
          e.stopPropagation();
          onTriggerPad();
        }}
        onClick={(e) => {
          e.stopPropagation();
          onTriggerPad();
        }}
        className={`w-24 sm:w-28 shrink-0 flex items-center justify-between px-2.5 py-2 rounded-xl border border-white/10 ${theme.idleBg} hover:border-white/30 text-left cursor-pointer transition-all active:scale-95`}
        title={`Disparar ${pad.label}`}
      >
        <div className="min-w-0">
          <div className="text-[10px] font-black font-mono uppercase tracking-wider text-white truncate">
            {pad.shortLabel}
          </div>
          <div className="text-[8px] text-slate-400 truncate">
            {pad.shortcut} · {pad.group}
          </div>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-white/60" />
      </button>

      {/* 16 Steps Sequencer */}
      <div className="flex flex-1 gap-1">
        {stepData.steps.map((isActive, i) => {
          const isDownbeat = i % 4 === 0;
          const isCurrent = isPlaying && i === currentStep;
          const vel = stepData.velocity?.[i] ?? 80;
          const velPercent = Math.min(100, Math.round((vel / 127) * 100));

          return (
            <button
              key={i}
              type="button"
              onClick={() => onToggleStep(i)}
              className={`
                relative flex-1 h-9 rounded-md transition-all duration-75 cursor-pointer flex flex-col justify-end p-0.5 overflow-hidden
                ${isCurrent ? 'ring-2 ring-white shadow-lg' : ''}
                ${isActive
                  ? `${theme.activeBg} border border-white/40 shadow-sm`
                  : isDownbeat
                  ? 'bg-white/[0.08] border border-white/15 hover:bg-white/[0.14]'
                  : 'bg-white/[0.03] border border-white/5 hover:bg-white/[0.08]'
                }
              `}
              title={`Passo ${i + 1} (${isDownbeat ? 'Tempo ' + (Math.floor(i / 4) + 1) : 'Semicolcheia'}) · Dinâmica: ${velPercent}%`}
            >
              {/* Velocity Meter Indicator dentro da célula */}
              {isActive && (
                <div
                  className="w-full bg-black/30 rounded-xs transition-all pointer-events-none"
                  style={{ height: `${velPercent}%` }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Botão de Limpar Linha */}
      <button
        type="button"
        onClick={onClearRow}
        className="w-7 h-7 shrink-0 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/15 transition-colors cursor-pointer"
        title="Limpar pista"
      >
        <RotateCcw className="w-3 h-3" />
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Componente: Switch Físico de Hardware Estilo Arranjador PSR / Korg
// ─────────────────────────────────────────────────────────────────────────────

interface HardwareSwitchProps {
  label: string;
  subLabel?: string;
  isActive: boolean;
  isPending?: boolean;
  ledColor?: 'green' | 'amber' | 'red' | 'blue';
  onClick: () => void;
}

const HardwareSwitch: React.FC<HardwareSwitchProps> = ({
  label, subLabel, isActive, isPending, ledColor = 'amber', onClick,
}) => {
  const ledBg = {
    green: isActive ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-emerald-950/80',
    amber: isActive ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]' : 'bg-amber-950/80',
    red:   isActive ? 'bg-red-400 shadow-[0_0_8px_#f87171]' : 'bg-red-950/80',
    blue:  isActive ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'bg-cyan-950/80',
  }[ledColor];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center px-3 py-2 rounded-xl select-none cursor-pointer
        transition-all duration-75 border font-mono
        min-w-[62px] sm:min-w-[70px] h-[52px]
        ${isActive
          ? 'bg-gradient-to-b from-[#2e261d] to-[#1a140d] border-amber-500/60 translate-y-0.5 shadow-[inset_0_2px_6px_rgba(0,0,0,0.85)]'
          : 'bg-gradient-to-b from-[#22242e] to-[#14151c] border-white/10 hover:border-white/25 shadow-[0_3px_6px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)]'
        }
      `}
    >
      {/* LED Indicator Dot */}
      <div className="absolute top-1.5 flex items-center justify-center">
        <span className={`w-2 h-1.5 rounded-full transition-all duration-100 ${ledBg} ${isPending ? 'animate-ping' : ''}`} />
      </div>

      {/* Rótulo Principal */}
      <span className={`text-[10px] font-black tracking-wider uppercase mt-1 ${
        isActive ? 'text-amber-300' : 'text-slate-300'
      }`}>
        {label}
      </span>

      {/* Sub-rótulo opcional */}
      {subLabel && (
        <span className="text-[8px] text-slate-500 font-sans leading-none mt-0.5">
          {subLabel}
        </span>
      )}
    </button>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Componente Principal: RhythmArranger (v2.0)
// ─────────────────────────────────────────────────────────────────────────────

export const RhythmArranger: React.FC = () => {
  // Navegação
  const [view, setView] = useState<ViewMode>('catalog');
  const [showMixer, setShowMixer] = useState(false);

  // Filtros de Catálogo Rígidos (Tier 1 & Tier 2)
  const [selectedGenre, setSelectedGenre] = useState<string>('Todos');
  const [selectedReference, setSelectedReference] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMeter, setFilterMeter] = useState<string>('all');
  const [filterBpmRange, setFilterBpmRange] = useState<string>('all');

  // Estado do Arranjador e Reprodução
  const [activeStyle, setActiveStyle] = useState<RhythmStyle>(RHYTHM_STYLES[0]);
  const [activeSection, setActiveSection] = useState<SectionId>('mainA');
  const [pendingSection, setPendingSection] = useState<SectionId | null>(null);
  const [autoFillEnabled, setAutoFillEnabled] = useState(true);
  const [humanizeEnabled, setHumanizeEnabled] = useState(true);
  const [activeKit, setActiveKit] = useState<DrumKitId>(RHYTHM_STYLES[0].recommendedKit || 'acoustic');
  const [bpm, setBpm] = useState(RHYTHM_STYLES[0].bpm);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Mixer Stems State
  const [stemStates, setStemStates] = useState<Record<StemId, StemChannelState>>(drumEngine.getStemStates());

  // Edição Customizada
  const [editedStyles, setEditedStyles] = useState<Record<string, RhythmStyle>>({});
  const [activePads, setActivePads] = useState<Set<string>>(new Set());

  // Refs de áudio e loop
  const playbackRef = useRef<{ raf: number; nextTime: number; step: number; barCount: number } | null>(null);
  const bpmRef = useRef(bpm);
  const sectionRef = useRef(activeSection);
  const pendingSectionRef = useRef(pendingSection);
  const autoFillRef = useRef(autoFillEnabled);
  const humanizeRef = useRef(humanizeEnabled);
  const styleRef = useRef(activeStyle);

  // Estilo atual (com mesclagem de edições em tempo real)
  const currentStyle = useMemo(() =>
    editedStyles[activeStyle.id] ?? activeStyle,
  [editedStyles, activeStyle]);

  // ── Armazenamento Soberano Local do Estúdio ──
  const studioStorage = useStudioStorage();
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [storageFeedback, setStorageFeedback] = useState<string | null>(null);

  const handleSaveRhythm = useCallback(async () => {
    if (!studioStorage.folderInfo?.isAvailable) {
      setIsProjectModalOpen(true);
      return;
    }

    try {
      if (currentProjectId) {
        await studioStorage.saveProject({
          id: currentProjectId,
          module: 'arranger',
          title: currentStyle.name,
          category: currentStyle.genre,
          data: {
            style: currentStyle,
            bpm,
            kit: activeKit,
          },
          metadata: {
            bpm,
            genre: currentStyle.genre,
            kit: activeKit,
            timeSignature: currentStyle.timeSignature,
          },
        });
        setStorageFeedback('Ritmo salvo com sucesso no disco!');
        setTimeout(() => setStorageFeedback(null), 3000);
      } else {
        const res = await studioStorage.createProject({
          module: 'arranger',
          title: currentStyle.name,
          category: currentStyle.genre,
          data: {
            style: currentStyle,
            bpm,
            kit: activeKit,
          },
          metadata: {
            bpm,
            genre: currentStyle.genre,
            kit: activeKit,
            timeSignature: currentStyle.timeSignature,
          },
        });
        setCurrentProjectId(res.item.id);
        setStorageFeedback(`Ritmo salvo: ${res.item.relativePath}`);
        setTimeout(() => setStorageFeedback(null), 3000);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setStorageFeedback(`Erro ao salvar ritmo: ${msg}`);
      setTimeout(() => setStorageFeedback(null), 4000);
    }
  }, [studioStorage, currentProjectId, currentStyle, bpm, activeKit]);

  const handleOpenRhythm = useCallback((_path: string, envelope: StudioProjectEnvelope<any>) => {
    const data = envelope.data;
    if (data && data.style) {
      setActiveStyle(data.style);
      if (data.bpm) setBpm(data.bpm);
      if (data.kit) setActiveKit(data.kit);
      setCurrentProjectId(envelope.id);
      setStorageFeedback(`Ritmo "${envelope.title}" carregado.`);
      setTimeout(() => setStorageFeedback(null), 3000);
    }
  }, []);

  // ── Envelope atual do projeto para o StudioImportExportBar ──────────────────

  const currentEnvelopeArranger = useMemo((): StudioProjectEnvelope<unknown> => ({
    id: currentProjectId ?? `local_${Date.now()}`,
    title: currentStyle.name,
    module: 'arranger',
    category: currentStyle.genre,
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: { bpm, genre: currentStyle.genre, kit: activeKit, timeSignature: currentStyle.timeSignature },
    data: { style: currentStyle, bpm, kit: activeKit },
  }), [currentProjectId, currentStyle, bpm, activeKit]);

  /** Reconstrói o estado do Arranjador a partir de um envelope importado. */
  const handleImportRhythm = useCallback((envelope: StudioProjectEnvelope<unknown>, _format: ExportFormat) => {
    const data = envelope.data as { style?: RhythmStyle; bpm?: number; kit?: DrumKitId };
    if (data?.style) {
      setActiveStyle(data.style);
      if (data.bpm) setBpm(data.bpm);
      if (data.kit) setActiveKit(data.kit);
      setCurrentProjectId(envelope.id);
    }
  }, []);

  const handleCreateNewRhythm = useCallback(async (title: string) => {
    const newStyle: RhythmStyle = {
      ...RHYTHM_STYLES[0],
      id: `custom_${Date.now()}`,
      name: title,
      genre: 'Personalizado',
    };
    if (studioStorage.folderInfo?.isAvailable) {
      try {
        const res = await studioStorage.createProject({
          module: 'arranger',
          title,
          category: 'Personalizado',
          data: {
            style: newStyle,
            bpm: newStyle.bpm,
            kit: activeKit,
          },
          metadata: {
            bpm: newStyle.bpm,
            genre: 'Personalizado',
            kit: activeKit,
          },
        });
        setCurrentProjectId(res.item.id);
      } catch (err) {
        console.warn('Falha ao registrar novo ritmo:', err);
      }
    }
    setActiveStyle(newStyle);
    setStorageFeedback(`Novo ritmo criado: ${title}`);
    setTimeout(() => setStorageFeedback(null), 3000);
  }, [studioStorage, activeKit]);

  const handleSaveRhythmAs = useCallback(async (newTitle: string) => {
    if (!studioStorage.folderInfo?.isAvailable) {
      setIsProjectModalOpen(true);
      return;
    }
    const clonedStyle: RhythmStyle = {
      ...currentStyle,
      id: `custom_${Date.now()}`,
      name: newTitle,
    };
    try {
      const res = await studioStorage.saveProjectAs({
        originalId: currentProjectId || 'temp',
        module: 'arranger',
        newTitle,
        category: clonedStyle.genre,
        data: {
          style: clonedStyle,
          bpm,
          kit: activeKit,
        },
        metadata: {
          bpm,
          genre: clonedStyle.genre,
          kit: activeKit,
        },
      });
      setCurrentProjectId(res.item.id);
      setActiveStyle(clonedStyle);
      setStorageFeedback(`Cópia salva como "${newTitle}"`);
      setTimeout(() => setStorageFeedback(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setStorageFeedback(`Erro ao salvar como: ${msg}`);
      setTimeout(() => setStorageFeedback(null), 4000);
    }
  }, [studioStorage, currentProjectId, currentStyle, bpm, activeKit]);

  useEffect(() => {
    bpmRef.current = bpm;
    sectionRef.current = activeSection;
    pendingSectionRef.current = pendingSection;
    autoFillRef.current = autoFillEnabled;
    humanizeRef.current = humanizeEnabled;
    styleRef.current = currentStyle;
  }, [bpm, activeSection, pendingSection, autoFillEnabled, humanizeEnabled, currentStyle]);

  const currentSection = currentStyle.sections[activeSection] ?? currentStyle.sections.mainA;
  const currentPattern = currentSection.pattern;

  // ── Atualização de Mixer e Soundkit ────────────────────────────────────────

  useEffect(() => {
    drumEngine.setKit(activeKit);
  }, [activeKit]);

  const handleKitChange = useCallback((kitId: DrumKitId) => {
    setActiveKit(kitId);
    drumEngine.setKit(kitId);
  }, []);

  const handleStemVolume = useCallback((stemId: StemId, vol: number) => {
    drumEngine.setStemVolume(stemId, vol);
    setStemStates(drumEngine.getStemStates());
  }, []);

  const handleStemPan = useCallback((stemId: StemId, pan: number) => {
    drumEngine.setStemPan(stemId, pan);
    setStemStates(drumEngine.getStemStates());
  }, []);

  const handleStemMute = useCallback((stemId: StemId) => {
    const cur = stemStates[stemId]?.muted ?? false;
    drumEngine.setStemMute(stemId, !cur);
    setStemStates(drumEngine.getStemStates());
  }, [stemStates]);

  const handleStemSolo = useCallback((stemId: StemId) => {
    const cur = stemStates[stemId]?.solo ?? false;
    drumEngine.setStemSolo(stemId, !cur);
    setStemStates(drumEngine.getStemStates());
  }, [stemStates]);

  // ── Reprodução e Loop de Arranjo com Transições Sincronizadas ─────────────

  const stopPlayback = useCallback(() => {
    if (playbackRef.current) {
      cancelAnimationFrame(playbackRef.current.raf);
      playbackRef.current = null;
    }
    setIsPlaying(false);
    setCurrentStep(0);
    setPendingSection(null);
  }, []);

  const startPlayback = useCallback(async () => {
    await drumEngine.ensureReady();
    setIsPlaying(true);

    const stepDuration = () => 60 / (bpmRef.current * 4); // semicolcheia
    let step = 0;
    let nextTime = drumEngine.getCurrentTime() + 0.04;
    const scheduleAhead = 0.15; // 150ms lookahead

    const tick = () => {
      const now = drumEngine.getCurrentTime();

      while (nextTime < now + scheduleAhead) {
        const secId = sectionRef.current;
        const curSection = styleRef.current.sections[secId] ?? styleRef.current.sections.mainA;
        const pattern = curSection.pattern;

        // Microtiming e Humanize
        const humanizeOffset = humanizeRef.current
          ? (Math.random() - 0.5) * 0.003
          : 0;

        const velMultiplier = (s: DrumStep) => {
          const raw = s.velocity?.[step] ?? 85;
          const base = raw / 127;
          if (!humanizeRef.current) return base;
          const jitter = (Math.random() - 0.5) * 0.1;
          return Math.max(0.1, Math.min(1.0, base + jitter));
        };

        // Dispara peças da bateria do step
        for (const pad of DRUM_PADS) {
          const s = pattern[pad.key];
          if (s && s.steps[step]) {
            drumEngine.playDrum(pad.key, nextTime + humanizeOffset, velMultiplier(s));
          }
        }

        // Toca baixo e acordes estilísticos se definidos na seção
        if (curSection.bassPattern) {
          const bNotes = curSection.bassPattern.filter(b => b.step === step);
          for (const bn of bNotes) {
            // Nota base em C2 (36)
            drumEngine.playBass(36 + bn.semitones, nextTime, bn.durationSteps * stepDuration(), (bn.velocity ?? 90) / 127);
          }
        }

        if (curSection.chordPattern) {
          const cHits = curSection.chordPattern.filter(c => c.step === step);
          for (const ch of cHits) {
            // Acorde de C Maior (C3, E3, G3)
            drumEngine.playChord([48, 52, 55], nextTime, ch.durationSteps * stepDuration(), (ch.velocity ?? 80) / 127);
          }
        }

        const capturedStep = step;
        const capturedTime = nextTime;
        const delayMs = (capturedTime - now) * 1000;
        setTimeout(() => setCurrentStep(capturedStep), Math.max(0, delayMs));

        // Transição de compasso (passo 15 -> passo 0)
        if (step === 15) {
          // Se houver uma seção pendente (ex: vindo de um Fill)
          if (pendingSectionRef.current) {
            const nextSec = pendingSectionRef.current;
            pendingSectionRef.current = null;
            sectionRef.current = nextSec;
            setActiveSection(nextSec);
            setPendingSection(null);
          } else if (secId === 'intro') {
            // Intro termina e vai direto para Main A
            sectionRef.current = 'mainA';
            setActiveSection('mainA');
          } else if (secId === 'ending') {
            // Ending termina e para
            setTimeout(() => stopPlayback(), delayMs + (stepDuration() * 1000));
            return;
          }
        }

        step = (step + 1) % 16;
        nextTime += stepDuration();
      }

      playbackRef.current = {
        ...playbackRef.current!,
        raf: requestAnimationFrame(tick),
        step,
        nextTime,
        barCount: 0,
      };
    };

    playbackRef.current = { raf: requestAnimationFrame(tick), nextTime, step: 0, barCount: 0 };
  }, [stopPlayback]);

  const togglePlayback = useCallback(() => {
    if (isPlaying) stopPlayback();
    else startPlayback();
  }, [isPlaying, startPlayback, stopPlayback]);

  // Para ao desmontar
  useEffect(() => () => stopPlayback(), [stopPlayback]);

  // ── Troca de Seção com Auto Fill-in Inteligente ─────────────────────────────

  const handleSelectSection = useCallback((targetSection: SectionId) => {
    if (!isPlaying) {
      setActiveSection(targetSection);
      return;
    }

    // Se estiver tocando e o Auto Fill estiver ativo e o usuário escolheu Main A..D diferente do atual
    const isMainTarget = targetSection.startsWith('main');
    const isCurrentMain = activeSection.startsWith('main');

    if (autoFillEnabled && isMainTarget && isCurrentMain && targetSection !== activeSection) {
      // Determina qual fill toca (Fill A ou Fill B)
      const fillToPlay: SectionId = (targetSection === 'mainC' || targetSection === 'mainD')
        ? 'fillBB'
        : 'fillAA';

      setActiveSection(fillToPlay);
      setPendingSection(targetSection);
    } else {
      setActiveSection(targetSection);
      setPendingSection(null);
    }
  }, [isPlaying, activeSection, autoFillEnabled]);

  // ── Pad ao Vivo com Feedback de LED e Som Imediato ─────────────────────────

  const triggerPad = useCallback((padKey: string) => {
    // 1. Garante que o contexto Web Audio esteja ativo (gesto síncrono do usuário)
    drumEngine.ensureReady().catch(() => {});
    // 2. Dispara a síntese percussiva imediata sem latência e sem depender de microtasks
    drumEngine.playDrum(padKey);

    // 3. Feedback visual do pad / LED
    setActivePads(prev => {
      const n = new Set(prev);
      n.add(padKey);
      return n;
    });
    setTimeout(() => {
      setActivePads(prev => {
        const n = new Set(prev);
        n.delete(padKey);
        return n;
      });
    }, 120);
  }, []);

  // ── Atalhos de Teclado (Hardware Controller Emulation) ─────────────────────

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Se estiver digitando no campo de busca, ignora
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayback();
        return;
      }

      const key = e.key.toUpperCase();
      const matchedPad = DRUM_PADS.find(p => p.shortcut === key);
      if (matchedPad) {
        e.preventDefault();
        triggerPad(matchedPad.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayback, triggerPad]);

  // ── Edição de Pattern (Step Sequencer) ──────────────────────────────────────

  const toggleStep = useCallback((padKey: keyof DrumPattern, stepIndex: number) => {
    setEditedStyles(prev => {
      const base = prev[activeStyle.id] ?? activeStyle;
      const section = base.sections[activeSection];
      const oldStep = section.pattern[padKey] ?? { steps: Array(16).fill(false), velocity: Array(16).fill(80) };
      const newSteps = [...oldStep.steps];
      newSteps[stepIndex] = !newSteps[stepIndex];

      const updatedStyle: RhythmStyle = {
        ...base,
        sections: {
          ...base.sections,
          [activeSection]: {
            ...section,
            pattern: {
              ...section.pattern,
              [padKey]: { ...oldStep, steps: newSteps },
            },
          },
        },
      };

      // Atualiza imediatamente a referência síncrona do motor de áudio
      styleRef.current = updatedStyle;

      return {
        ...prev,
        [activeStyle.id]: updatedStyle,
      };
    });
  }, [activeStyle, activeSection]);

  const clearRow = useCallback((padKey: keyof DrumPattern) => {
    setEditedStyles(prev => {
      const base = prev[activeStyle.id] ?? activeStyle;
      const section = base.sections[activeSection];
      const updatedStyle: RhythmStyle = {
        ...base,
        sections: {
          ...base.sections,
          [activeSection]: {
            ...section,
            pattern: {
              ...section.pattern,
              [padKey]: { steps: Array(16).fill(false), velocity: Array(16).fill(80) },
            },
          },
        },
      };

      styleRef.current = updatedStyle;

      return {
        ...prev,
        [activeStyle.id]: updatedStyle,
      };
    });
  }, [activeStyle, activeSection]);

  const resetSection = useCallback(() => {
    setEditedStyles(prev => {
      const { [activeStyle.id]: _, ...rest } = prev;
      styleRef.current = activeStyle;
      return rest;
    });
  }, [activeStyle]);

  // ── Seleção de Ritmo no Catálogo ───────────────────────────────────────────

  const handleSelectStyle = useCallback((style: RhythmStyle) => {
    stopPlayback();
    setActiveStyle(style);
    setBpm(style.bpm);
    setActiveSection('mainA');
    if (style.recommendedKit) {
      handleKitChange(style.recommendedKit);
    }
  }, [stopPlayback, handleKitChange]);

  // ── Filtros do Catálogo (Tier 1: Gênero, Tier 2: Referência, Busca, Compasso, BPM) ──

  // Lista única de referências para o Tier 2
  const availableReferences = useMemo(() => {
    const refs = new Set<string>();
    RHYTHM_STYLES.forEach(s => {
      if (s.referenceArtist) refs.add(s.referenceArtist);
    });
    return Array.from(refs).sort();
  }, []);

  const filteredStyles = useMemo(() => {
    return RHYTHM_STYLES.filter(s => {
      // Filtro 1: Gênero Rígido
      if (selectedGenre !== 'Todos' && s.genre !== selectedGenre) return false;

      // Filtro 2: Artista / Referência
      if (selectedReference !== 'Todas' && s.referenceArtist !== selectedReference) return false;

      // Filtro 3: Fórmula de compasso
      if (filterMeter !== 'all' && s.timeSignature !== filterMeter) return false;

      // Filtro 4: Faixa de BPM
      if (filterBpmRange === 'slow' && s.bpm >= 90) return false;
      if (filterBpmRange === 'med' && (s.bpm < 90 || s.bpm > 120)) return false;
      if (filterBpmRange === 'fast' && s.bpm <= 120) return false;

      // Filtro 5: Busca por texto
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesArtist = s.referenceArtist?.toLowerCase().includes(q);
        const matchesSong = s.referenceSong?.toLowerCase().includes(q);
        const matchesGenre = s.genre.toLowerCase().includes(q);
        const matchesBpm = s.bpm.toString().includes(q);
        if (!matchesName && !matchesArtist && !matchesSong && !matchesGenre && !matchesBpm) {
          return false;
        }
      }

      return true;
    });
  }, [selectedGenre, selectedReference, filterMeter, filterBpmRange, searchQuery]);

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDERIZAÇÃO
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="w-full space-y-4">
      {/* ── 0. Barra Soberana da Pasta do Usuário ── */}
      <StudioFolderBar onOpenCatalog={() => setIsProjectModalOpen(true)} />

      {/* Toast de Feedback */}
      {storageFeedback && (
        <div className="px-4 py-2 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs font-medium flex items-center justify-between shadow-lg animate-in fade-in">
          <span>{storageFeedback}</span>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          1. HEADER PRINCIPAL COM EFEITO GLASSMORPHISM
      ════════════════════════════════════════════════════════════════════════════ */}
      <div className="rounded-3xl p-5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#171110]/90 via-[#101018]/85 to-[#0b0c14]/90 backdrop-blur-xl shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <Disc className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span>ARRANJADOR PROFISSIONAL PSR · v2.0</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
            {activeStyle.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 mt-1">
            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-200 border border-amber-500/30 font-bold">
              {activeStyle.genre}
            </span>
            <span>·</span>
            <span className="font-mono font-bold text-white">{bpm} BPM</span>
            <span>·</span>
            <span className="font-mono text-cyan-300 font-bold">{activeStyle.timeSignature}</span>
            {activeStyle.referenceArtist && (
              <>
                <span>·</span>
                <span className="text-slate-300 font-medium">
                  Ref: <strong className="text-white">{activeStyle.referenceArtist}</strong>
                  {activeStyle.referenceSong && ` — ${activeStyle.referenceSong}`}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Botões de View e Ações de Topo */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Ações Soberanas do Estúdio */}
          <button
            type="button"
            onClick={() => setIsProjectModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-600/25 border border-amber-500/40 text-amber-200 hover:bg-amber-600/40 transition-all cursor-pointer shadow-md shadow-amber-600/20"
            title="Abrir Catálogo de Ritmos na Pasta Soberana"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Catálogo</span>
          </button>

          <button
            type="button"
            onClick={handleSaveRhythm}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 hover:bg-emerald-500/35 transition-all cursor-pointer shadow-md"
            title="Salvar Ritmo na Pasta do Usuário"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Salvar</span>
          </button>

          {/* Importar / Exportar */}
          <StudioImportExportBar
            module="arranger"
            projectTitle={currentStyle.name}
            envelope={currentEnvelopeArranger}
            existingManifestItems={studioStorage.manifest?.modules.styles ?? []}
            onImport={handleImportRhythm}
          />

          {/* Alternador do Mixer */}
          <button
            type="button"
            onClick={() => setShowMixer(prev => !prev)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              showMixer
                ? 'bg-amber-500/25 border-amber-500/60 text-amber-200 shadow-lg'
                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
            title="Abrir Mixer de Stems e Troca de Soundkits"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Mixer & Kits</span>
          </button>

          {/* Abas de Navegação (Catálogo / Pads / Editor) */}
          <div className="flex items-center gap-1 bg-black/40 rounded-2xl p-1 border border-white/5">
            {([
              ['catalog', 'Catálogo'],
              ['pad',     'Drum Pads'],
              ['editor',  'Sequencer'],
            ] as [ViewMode, string][]).map(([v, lbl]) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  view === v
                    ? 'bg-amber-500/25 border border-amber-500/50 text-amber-200 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent'
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          2. BARRA DE TRANSPORTE & SWITCHES ILUMINADOS DE HARDWARE PSR/KORG
      ════════════════════════════════════════════════════════════════════════════ */}
      <div className="rounded-2xl px-4 py-3 border border-white/10 bg-[#12131b]/95 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shadow-xl">
        {/* Controles de Transporte Primários: Play / Stop */}
        <div className="flex items-center gap-1.5 bg-black/50 rounded-2xl p-1.5 border border-white/10 shadow-inner">
          <button
            type="button"
            onClick={stopPlayback}
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-white/5 transition-all cursor-pointer"
            title="Parar Reprodução (Stop)"
          >
            <Square className="w-4 h-4" />
          </button>
          <button
            id="arranger-play-btn"
            type="button"
            onClick={togglePlayback}
            className={`w-12 h-10 rounded-xl flex items-center justify-center font-bold border transition-all cursor-pointer ${
              isPlaying
                ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                : 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
            }`}
            title={isPlaying ? 'Pausar (Barra de Espaço)' : 'Tocar Ritmo (Barra de Espaço)'}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>
        </div>

        {/* Seções de Arranjo (Switches Físicos Iluminados) */}
        <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          {SECTION_ORDER.map(sid => {
            const sec = currentStyle.sections[sid];
            if (!sec) return null;
            const isCur = activeSection === sid;
            const isPend = pendingSection === sid;

            return (
              <HardwareSwitch
                key={sid}
                label={sec.shortLabel}
                subLabel={sec.label}
                isActive={isCur}
                isPending={isPend}
                ledColor={sid.startsWith('fill') ? 'red' : sid === 'intro' || sid === 'ending' ? 'blue' : 'amber'}
                onClick={() => handleSelectSection(sid)}
              />
            );
          })}
        </div>

        {/* Funções de Performance: Auto Fill-in & Humanize */}
        <div className="flex items-center gap-1.5 bg-black/40 rounded-xl p-1 border border-white/5">
          {/* Auto Fill-in Switch */}
          <button
            type="button"
            onClick={() => setAutoFillEnabled(v => !v)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-black transition-all border cursor-pointer ${
              autoFillEnabled
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.3)]'
                : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300'
            }`}
            title="Auto Fill-in: toca virada automaticamente na troca de variação"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${autoFillEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-white/20'}`} />
            <span>AUTO FILL</span>
          </button>

          {/* Humanize Groove Switch */}
          <button
            type="button"
            onClick={() => {
              setHumanizeEnabled(v => {
                const next = !v;
                drumEngine.setHumanize(next ? 0.35 : 0);
                return next;
              });
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-black transition-all border cursor-pointer ${
              humanizeEnabled
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300'
            }`}
            title="Humanize: adiciona microtiming e variação natural de dinâmica"
          >
            <Sparkles className="w-3 h-3" />
            <span>HUMANIZE</span>
          </button>
        </div>

        {/* Controle Digital de BPM */}
        <div className="flex items-center gap-1 bg-black/60 rounded-xl px-2.5 py-1.5 border border-white/10 shadow-inner">
          <span className="text-[9px] text-amber-400 font-mono font-black uppercase tracking-wider mr-1">BPM</span>
          <button
            type="button"
            onClick={() => setBpm(b => Math.max(40, b - 5))}
            className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <input
            type="number"
            min={40}
            max={260}
            value={bpm}
            onChange={e => setBpm(Math.max(40, Math.min(260, +e.target.value)))}
            className="w-12 text-center text-sm font-black font-mono text-amber-300 bg-transparent outline-none"
          />
          <button
            type="button"
            onClick={() => setBpm(b => Math.min(260, b + 5))}
            className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          3. PAINEL DE MIXER DE STEMS & SOUNDKIT SWITCHER (EXPANSÍVEL)
      ════════════════════════════════════════════════════════════════════════════ */}
      {showMixer && (
        <div className="rounded-2xl p-4 border border-white/15 bg-[#141520]/95 backdrop-blur-xl space-y-4 shadow-2xl">
          {/* Seletor Dinâmico de Soundkit de Bateria */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 uppercase">
                <Radio className="w-3.5 h-3.5" />
                <span>SOUNDKIT / DRUMKIT SWITCHER</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Alterne os kits de bateria em tempo real no mesmo ritmo sem interromper o andamento.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {DRUM_KITS.map(kit => (
                <button
                  key={kit.id}
                  type="button"
                  onClick={() => handleKitChange(kit.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    activeKit === kit.id
                      ? 'bg-amber-500/25 border-amber-500/60 text-amber-200 shadow-md'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                  title={kit.description}
                >
                  {kit.shortName}
                </button>
              ))}
            </div>
          </div>

          {/* Stems Mixer (5 Canais: Bateria, Pratos, Percussão, Baixo, Harmonia) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {([
              ['drums',      'BATERIA',    'Bumbo, Caixa, Toms'],
              ['cymbals',    'PRATOS',     'Chimbal, Cowbell'],
              ['percussion', 'PERCUSSÃO',  'Triângulo, Pandeiro, Shaker'],
              ['bass',       'BAIXO',      'Linha de Baixo Estilística'],
              ['harmony',    'HARMONIA',   'Acordes / Base Harmônica'],
            ] as [StemId, string, string][]).map(([sid, label, desc]) => {
              const state = stemStates[sid] ?? { volume: 1.0, pan: 0, muted: false, solo: false };
              return (
                <div key={sid} className="p-3 rounded-xl bg-black/40 border border-white/10 flex flex-col justify-between gap-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[10px] font-mono font-black text-white">{label}</div>
                      <div className="text-[8px] text-slate-400 truncate max-w-[100px]">{desc}</div>
                    </div>
                    {/* Botões Mute e Solo */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleStemMute(sid)}
                        className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-black cursor-pointer ${
                          state.muted ? 'bg-red-500 text-white' : 'bg-white/10 text-slate-400 hover:text-white'
                        }`}
                        title="Mutar canal"
                      >
                        M
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStemSolo(sid)}
                        className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-black cursor-pointer ${
                          state.solo ? 'bg-amber-400 text-black' : 'bg-white/10 text-slate-400 hover:text-white'
                        }`}
                        title="Solar canal"
                      >
                        S
                      </button>
                    </div>
                  </div>

                  {/* Volume Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-mono text-slate-400">
                      <span>VOL</span>
                      <span>{Math.round(state.volume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1.5}
                      step={0.05}
                      value={state.volume}
                      onChange={e => handleStemVolume(sid, +e.target.value)}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-400"
                    />
                  </div>

                  {/* Pan Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[8px] font-mono text-slate-400">
                      <span>PAN</span>
                      <span>{state.pan === 0 ? 'C' : state.pan < 0 ? `L${Math.round(-state.pan * 100)}` : `R${Math.round(state.pan * 100)}`}</span>
                    </div>
                    <input
                      type="range"
                      min={-1}
                      max={1}
                      step={0.1}
                      value={state.pan}
                      onChange={e => handleStemPan(sid, +e.target.value)}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          4. CATÁLOGO COM FILTROS RÍGIDOS (TIER 1 GÊNERO & TIER 2 REFERÊNCIAS)
      ════════════════════════════════════════════════════════════════════════════ */}
      {view === 'catalog' && (
        <div className="space-y-4">
          {/* Barra de Busca e Filtros Ferramentas */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Campo de Busca Rápida */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="🔍 Buscar por ritmo, artista de referência ou BPM..."
                className="w-full bg-[#141520] border border-white/10 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500/60 shadow-inner"
              />
            </div>

            {/* Filtro por Fórmula de Compasso */}
            <div className="flex items-center gap-1 bg-[#141520] border border-white/10 rounded-2xl p-1 shrink-0">
              <span className="text-[10px] font-mono text-slate-400 px-2 font-bold uppercase">Métrica</span>
              {['all', '4/4', '3/4', '6/8'].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setFilterMeter(m)}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold cursor-pointer transition-colors ${
                    filterMeter === m ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {m === 'all' ? 'Todos' : m}
                </button>
              ))}
            </div>

            {/* Filtro por Faixa de BPM */}
            <div className="flex items-center gap-1 bg-[#141520] border border-white/10 rounded-2xl p-1 shrink-0">
              <span className="text-[10px] font-mono text-slate-400 px-2 font-bold uppercase">BPM</span>
              {[
                ['all', 'Todos'],
                ['slow', '< 90'],
                ['med', '90-120'],
                ['fast', '> 120'],
              ].map(([k, lbl]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setFilterBpmRange(k)}
                  className={`px-2 py-1 rounded-xl text-[10px] font-mono font-bold cursor-pointer transition-colors ${
                    filterBpmRange === k ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          {/* TIER 1: Filtro Principal de Gêneros Musicais (Rígido) */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
              1. Gênero Musical
            </div>
            <div className="flex flex-wrap gap-1.5">
              {RHYTHM_GENRES.map(cat => {
                const colors = GENRE_COLORS[cat.id] ?? GENRE_COLORS.Todos;
                const isSel = selectedGenre === cat.id;
                const count = cat.id === 'Todos'
                  ? RHYTHM_STYLES.length
                  : RHYTHM_STYLES.filter(s => s.genre === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedGenre(cat.id);
                      setSelectedReference('Todas'); // reseta subtag ao trocar gênero
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isSel
                        ? `${colors.bg} ${colors.border} ${colors.text} shadow-md scale-[1.02]`
                        : 'bg-white/5 border-white/8 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className="text-[9px] opacity-60 font-mono">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TIER 2: Filtro Secundário por Artista / Referência */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
              2. Referência de Artista / Linguagem
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedReference('Todas')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                  selectedReference === 'Todas'
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                    : 'bg-white/5 border-white/8 text-slate-400 hover:text-white'
                }`}
              >
                Todas as Referências
              </button>
              {availableReferences.map(artist => (
                <button
                  key={artist}
                  type="button"
                  onClick={() => setSelectedReference(artist)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                    selectedReference === artist
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                      : 'bg-white/5 border-white/8 text-slate-400 hover:text-white'
                  }`}
                >
                  {artist}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de Cards de Ritmos Padronizados */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {filteredStyles.map(style => {
              const isSelected = activeStyle.id === style.id;
              const gColor = GENRE_COLORS[style.genre] ?? GENRE_COLORS.Todos;

              return (
                <div
                  key={style.id}
                  id={`style-btn-${style.id}`}
                  onClick={() => handleSelectStyle(style)}
                  className={`group relative p-4 rounded-2xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'bg-gradient-to-br from-amber-950/40 via-[#18121a]/80 to-[#101018]/90 border-amber-500/60 shadow-xl scale-[1.01]'
                      : 'bg-[#13141f]/80 border-white/10 hover:border-white/25 hover:bg-[#181926]'
                  }`}
                >
                  {/* Topo do Card: Título do Groove + Badges Estruturadas */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      {/* Nome do Groove / Estilo Principal */}
                      <h3 className="font-display font-black text-sm text-white group-hover:text-amber-300 transition-colors leading-snug">
                        {style.name}
                      </h3>
                      {/* Indicador de Seleção */}
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24] shrink-0 mt-1" />
                      )}
                    </div>

                    {/* Subtítulo / Referência de Artista e Canção */}
                    {style.referenceArtist && (
                      <div className="text-[11px] font-medium text-amber-200/90 mb-2">
                        Ref: <strong>{style.referenceArtist}</strong>
                        {style.referenceSong && ` — ${style.referenceSong}`}
                      </div>
                    )}

                    {/* Descrição Estilística Musical */}
                    <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                      {style.description}
                    </p>
                  </div>

                  {/* Rodapé do Card com Badges de Alto Contraste */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/5">
                    {/* Badge de Gênero */}
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold border ${gColor.badge}`}>
                      {style.genre}
                    </span>

                    {/* Badge de BPM */}
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-black bg-black/60 text-amber-300 border border-amber-500/30">
                      BPM: {style.bpm}
                    </span>

                    {/* Badge de Compasso */}
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                      {style.timeSignature}
                    </span>

                    {/* Kit Recomendado */}
                    <span className="ml-auto text-[9px] text-slate-400 font-mono">
                      Kit: {style.recommendedKit}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          5. DRUM PADS ESTILO CONTROLADOR DE ESTÚDIO (AO VIVO)
      ════════════════════════════════════════════════════════════════════════════ */}
      {view === 'pad' && (
        <div className="space-y-4">
          {/* Indicador de Passo em Tempo Real */}
          {isPlaying && (
            <div className="flex gap-1 p-2 rounded-2xl bg-black/40 border border-white/5">
              {Array.from({ length: 16 }, (_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded-full transition-all duration-75 ${
                    i === currentStep
                      ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]'
                      : i % 4 === 0
                      ? 'bg-white/30'
                      : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Grade de Drum Pads de Hardware */}
          <div className="rounded-3xl p-5 border border-white/10 bg-[#12131c]/90 backdrop-blur-xl space-y-3 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <span className="text-xs font-mono font-black tracking-wider uppercase text-slate-300">
                  DRUM PADS DE ESTÚDIO — RESPOSTA TÁTIL & ATALHOS DE TECLADO
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Dispare com: <strong className="text-white">1..4, Q..R, A..F, Z, X</strong>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-1">
              {DRUM_PADS.map(pad => (
                <StudioDrumPad
                  key={pad.key}
                  pad={pad}
                  isActive={activePads.has(pad.key)}
                  onTrigger={triggerPad}
                />
              ))}
            </div>
          </div>

          {/* Visualização de Resumo da Seção Ativa */}
          <div className="rounded-2xl p-4 border border-white/10 bg-black/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">
                Pista Ativa: <strong className="text-amber-300">{currentSection.label}</strong> ({currentSection.shortLabel})
              </span>
              <button
                type="button"
                onClick={() => setView('editor')}
                className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
              >
                <span>Editar no Sequencer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Linhas ativas no momento */}
            <div className="space-y-1 pt-1">
              {DRUM_PADS.map(pad => {
                const s = currentPattern[pad.key];
                if (!s || !s.steps.some(Boolean)) return null;
                const theme = PAD_COLOR_THEMES[pad.color] ?? PAD_COLOR_THEMES.red;

                return (
                  <div key={pad.key} className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-slate-400 w-20 truncate">
                      {pad.shortLabel}
                    </span>
                    <div className="flex flex-1 gap-1">
                      {s.steps.map((on, i) => (
                        <div
                          key={i}
                          className={`flex-1 h-3 rounded-xs ${
                            on
                              ? theme.activeBg
                              : i % 4 === 0 ? 'bg-white/10' : 'bg-white/5'
                          } ${i === currentStep && isPlaying ? 'ring-1 ring-white' : ''}`}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          6. STEP SEQUENCER & PIANO ROLL PROFISSIONAL
      ════════════════════════════════════════════════════════════════════════════ */}
      {view === 'editor' && (
        <div className="space-y-3">
          {/* Header do Sequencer */}
          <div className="flex items-center justify-between text-xs pb-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">
                Sequencer: <strong className="text-amber-300">{currentSection.label}</strong> — {activeStyle.name}
              </span>
              {editedStyles[activeStyle.id] && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-mono font-bold animate-pulse">
                  EDITADO
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={resetSection}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Restaurar</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const json = JSON.stringify(currentStyle, null, 2);
                  const blob = new Blob([json], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${currentStyle.id}_custom_pattern.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs font-bold cursor-pointer hover:bg-amber-500/30"
              >
                <Download className="w-3 h-3" />
                <span>Exportar JSON</span>
              </button>
            </div>
          </div>

          {/* Numeração dos Tempos e Compassos (1 .. 4) */}
          <div className="flex items-center gap-2 ml-24 sm:ml-28">
            <div className="flex flex-1 gap-1">
              {Array.from({ length: 16 }, (_, i) => (
                <div
                  key={i}
                  className={`flex-1 text-center font-mono text-[9px] font-black ${
                    i % 4 === 0 ? 'text-amber-400' : 'text-slate-600'
                  }`}
                >
                  {i % 4 === 0 ? Math.floor(i / 4) + 1 : '·'}
                </div>
              ))}
            </div>
            <div className="w-7" />
          </div>

          {/* Grade Completa de Step Rows */}
          <div className="rounded-2xl p-4 border border-white/10 bg-[#12131c]/90 space-y-1.5 shadow-xl">
            {DRUM_PADS.map(pad => (
              <StepSequencerRow
                key={pad.key}
                pad={pad}
                stepData={currentPattern[pad.key] ?? { steps: Array(16).fill(false), velocity: Array(16).fill(80) }}
                currentStep={currentStep}
                isPlaying={isPlaying}
                onToggleStep={stepIdx => toggleStep(pad.key as keyof DrumPattern, stepIdx)}
                onClearRow={() => clearRow(pad.key as keyof DrumPattern)}
                onTriggerPad={() => triggerPad(pad.key)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Modal Soberano de Projetos ── */}
      <StudioProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        activeModule="arranger"
        currentProjectId={currentProjectId}
        onOpenProject={handleOpenRhythm}
        onCreateNewProject={handleCreateNewRhythm}
        onSaveCurrentAs={handleSaveRhythmAs}
      />
    </div>
  );
};
