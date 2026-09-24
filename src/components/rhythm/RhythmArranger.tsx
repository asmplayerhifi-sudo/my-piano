import React, {
  useState, useRef, useCallback, useEffect, useMemo,
} from 'react';
import {
  RHYTHM_STYLES, RHYTHM_CATEGORIES, DRUM_PADS,
  type RhythmStyle, type SectionId, type DrumPattern, type DrumStep,
} from '../../core/rhythmArrangerData';
import { drumEngine } from '../../core/drumEngine';
import {
  Play, Pause, Square, ChevronLeft, ChevronRight,
  Save, Download, Plus, Trash2, RotateCcw, Music,
  Sliders, Drumstick,
} from 'lucide-react';

// ────────────────────────────────────────────────────────────────────────────
// Tipos locais
// ────────────────────────────────────────────────────────────────────────────

type ViewMode = 'catalog' | 'pad' | 'editor';

const SECTION_ORDER: SectionId[] = ['intro', 'mainA', 'fillAA', 'mainB', 'fillBB', 'ending'];

const CAT_COLOR: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  orange: { bg: 'bg-orange-500/15', border: 'border-orange-500/40', text: 'text-orange-200', dot: 'bg-orange-400' },
  red:    { bg: 'bg-red-500/15',    border: 'border-red-500/40',    text: 'text-red-200',    dot: 'bg-red-400' },
  pink:   { bg: 'bg-pink-500/15',   border: 'border-pink-500/40',   text: 'text-pink-200',   dot: 'bg-pink-400' },
  violet: { bg: 'bg-violet-500/15', border: 'border-violet-500/40', text: 'text-violet-200', dot: 'bg-violet-400' },
  yellow: { bg: 'bg-yellow-500/15', border: 'border-yellow-500/40', text: 'text-yellow-200', dot: 'bg-yellow-400' },
  lime:   { bg: 'bg-lime-500/15',   border: 'border-lime-500/40',   text: 'text-lime-200',   dot: 'bg-lime-400' },
  indigo: { bg: 'bg-indigo-500/15', border: 'border-indigo-500/40', text: 'text-indigo-200', dot: 'bg-indigo-400' },
  green:  { bg: 'bg-green-500/15',  border: 'border-green-500/40',  text: 'text-green-200',  dot: 'bg-green-400' },
  cyan:   { bg: 'bg-cyan-500/15',   border: 'border-cyan-500/40',   text: 'text-cyan-200',   dot: 'bg-cyan-400' },
  slate:  { bg: 'bg-slate-500/15',  border: 'border-slate-500/40',  text: 'text-slate-200',  dot: 'bg-slate-400' },
};

const PAD_COLOR: Record<string, { bg: string; active: string; press: string }> = {
  cyan:    { bg: 'bg-cyan-500/20',    active: 'bg-cyan-400',    press: 'bg-cyan-300' },
  sky:     { bg: 'bg-sky-500/20',     active: 'bg-sky-400',     press: 'bg-sky-300' },
  rose:    { bg: 'bg-rose-500/20',    active: 'bg-rose-400',    press: 'bg-rose-300' },
  orange:  { bg: 'bg-orange-500/20',  active: 'bg-orange-400',  press: 'bg-orange-300' },
  violet:  { bg: 'bg-violet-500/20',  active: 'bg-violet-400',  press: 'bg-violet-300' },
  yellow:  { bg: 'bg-yellow-500/20',  active: 'bg-yellow-400',  press: 'bg-yellow-300' },
  teal:    { bg: 'bg-teal-500/20',    active: 'bg-teal-400',    press: 'bg-teal-300' },
  amber:   { bg: 'bg-amber-500/20',   active: 'bg-amber-400',   press: 'bg-amber-300' },
  purple:  { bg: 'bg-purple-500/20',  active: 'bg-purple-400',  press: 'bg-purple-300' },
  indigo:  { bg: 'bg-indigo-500/20',  active: 'bg-indigo-400',  press: 'bg-indigo-300' },
  lime:    { bg: 'bg-lime-500/20',    active: 'bg-lime-400',     press: 'bg-lime-300' },
  emerald: { bg: 'bg-emerald-500/20', active: 'bg-emerald-400', press: 'bg-emerald-300' },
  red:     { bg: 'bg-red-500/20',     active: 'bg-red-400',     press: 'bg-red-300' },
  green:   { bg: 'bg-green-500/20',   active: 'bg-green-400',   press: 'bg-green-300' },
};

// ────────────────────────────────────────────────────────────────────────────
// Componente: Drum Pad individual
// ────────────────────────────────────────────────────────────────────────────

interface DrumPadButtonProps {
  padKey: string;
  label: string;
  shortLabel: string;
  emoji: string;
  color: string;
  isActive: boolean;
  onTrigger: () => void;
}

const DrumPadButton: React.FC<DrumPadButtonProps> = ({
  padKey, label, shortLabel, emoji, color, isActive, onTrigger,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const colors = PAD_COLOR[color] ?? PAD_COLOR.slate;

  const handleDown = useCallback(() => {
    setIsPressed(true);
    onTrigger();
  }, [onTrigger]);

  const handleUp = useCallback(() => setIsPressed(false), []);

  return (
    <button
      id={`drum-pad-${padKey}`}
      title={label}
      onPointerDown={handleDown}
      onPointerUp={handleUp}
      onPointerLeave={handleUp}
      className={`
        relative flex flex-col items-center justify-center gap-1
        rounded-2xl border transition-all duration-75 cursor-pointer select-none
        h-[72px] sm:h-[88px] font-bold
        ${isPressed
          ? `${colors.press} border-white/50 scale-95 shadow-none`
          : isActive
          ? `${colors.active} border-white/40 shadow-lg`
          : `${colors.bg} border-white/10 hover:border-white/25 hover:scale-[1.02]`
        }
        ${isPressed ? 'translate-y-1' : ''}
      `}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {/* Indicador de atividade no topo */}
      {isActive && !isPressed && (
        <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
      )}

      <span className="text-xl leading-none">{emoji}</span>
      <span className="text-[10px] text-white/80 text-center leading-tight px-1">
        {shortLabel}
      </span>

      {/* Reflexo de profundidade */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/8 to-transparent pointer-events-none" />
    </button>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// Componente: Step Sequencer Row
// ────────────────────────────────────────────────────────────────────────────

interface StepRowProps {
  padKey: string;
  label: string;
  emoji: string;
  color: string;
  step: DrumStep;
  currentStep: number;
  isPlaying: boolean;
  onChange: (stepIndex: number) => void;
  onClear: () => void;
}

const StepRow: React.FC<StepRowProps> = ({
  padKey, label, emoji, color, step, currentStep, isPlaying, onChange, onClear,
}) => {
  const colors = PAD_COLOR[color] ?? PAD_COLOR.slate;

  const presets: Record<string, () => boolean[]> = {
    'Todos':  () => Array(16).fill(true),
    'Pares':  () => Array(16).fill(false).map((_, i) => i % 2 === 0),
    'Tempos': () => [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
  };

  return (
    <div className="flex items-center gap-2">
      {/* Label do pad */}
      <button
        onPointerDown={() => drumEngine.playDrum(padKey)}
        className={`w-[68px] shrink-0 flex items-center gap-1.5 px-2 py-1.5 rounded-xl border transition-colors cursor-pointer ${colors.bg} border-white/10 hover:border-white/25`}
        title={`Tocar ${label}`}
      >
        <span className="text-sm">{emoji}</span>
        <span className="text-[9px] font-bold text-white/70 leading-tight truncate">{label}</span>
      </button>

      {/* 16 Steps */}
      <div className="flex flex-1 gap-0.5">
        {step.steps.map((on, i) => {
          const isBeat = i % 4 === 0;
          const isCurrent = isPlaying && i === currentStep;
          return (
            <button
              key={i}
              onClick={() => onChange(i)}
              className={`
                flex-1 h-8 rounded-md border transition-all duration-75 cursor-pointer
                ${isCurrent ? 'ring-1 ring-white/60' : ''}
                ${on
                  ? `${colors.active} border-white/30 shadow-sm`
                  : isBeat
                  ? 'bg-white/[0.06] border-white/10 hover:bg-white/[0.12]'
                  : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.08]'
                }
              `}
            />
          );
        })}
      </div>

      {/* Ações rápidas */}
      <div className="flex items-center gap-0.5 shrink-0">
        {Object.entries(presets).map(([name, fn]) => (
          <button
            key={name}
            onClick={() => {
              const ps = fn();
              ps.forEach((v, i) => { if (v !== step.steps[i]) onChange(i); });
            }}
            className="text-[8px] px-1.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer font-mono"
            title={name}
          >
            {name}
          </button>
        ))}
        <button
          onClick={onClear}
          className="p-1 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-300 transition-colors cursor-pointer"
          title="Limpar linha"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// Componente Principal: RhythmArranger
// ────────────────────────────────────────────────────────────────────────────

export const RhythmArranger: React.FC = () => {
  const [view, setView] = useState<ViewMode>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<string>('Forró');
  const [activeStyle, setActiveStyle] = useState<RhythmStyle>(RHYTHM_STYLES[0]);
  const [activeSection, setActiveSection] = useState<SectionId>('mainA');
  const [bpm, setBpm] = useState(RHYTHM_STYLES[0].bpm);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Estado de edição (deep clone do pattern da seção ativa)
  const [editedStyles, setEditedStyles] = useState<Record<string, RhythmStyle>>({});
  const [activePads, setActivePads] = useState<Set<string>>(new Set());

  const playbackRef = useRef<{ raf: number; nextTime: number; step: number } | null>(null);
  const bpmRef = useRef(bpm);
  const sectionRef = useRef(activeSection);
  const styleRef = useRef(activeStyle);

  bpmRef.current = bpm;
  sectionRef.current = activeSection;
  styleRef.current = activeStyle;

  // Merge estilos editados com os originais
  const currentStyle = useMemo(() =>
    editedStyles[activeStyle.id] ?? activeStyle,
  [editedStyles, activeStyle]);

  const currentSection = currentStyle.sections[activeSection];
  const currentPattern = currentSection.pattern;

  // ── Reprodução ─────────────────────────────────────────────────────────

  const stopPlayback = useCallback(() => {
    if (playbackRef.current) {
      cancelAnimationFrame(playbackRef.current.raf);
      playbackRef.current = null;
    }
    setIsPlaying(false);
    setCurrentStep(0);
  }, []);

  const startPlayback = useCallback(async () => {
    await drumEngine.ensureReady();
    setIsPlaying(true);

    const stepDuration = () => 60 / (bpmRef.current * 4); // semicolcheia

    let step = 0;
    let nextTime = drumEngine.getCurrentTime() + 0.05;

    const scheduleAhead = 0.15; // lookahead de 150ms

    const tick = () => {
      const now = drumEngine.getCurrentTime();

      while (nextTime < now + scheduleAhead) {
        const pattern = styleRef.current.sections[sectionRef.current].pattern;
        const vel = (padKey: string, s: DrumStep) =>
          s.velocity?.[step] !== undefined ? (s.velocity[step]! / 127) : 0.85;

        // Toca todos os pads com step ativo
        for (const pad of DRUM_PADS) {
          const s = pattern[pad.key];
          if (s.steps[step]) {
            drumEngine.playDrum(pad.key, nextTime, vel(pad.key, s));
          }
        }

        const capturedStep = step;
        const capturedTime = nextTime;
        const delayMs = (capturedTime - now) * 1000;
        setTimeout(() => setCurrentStep(capturedStep), Math.max(0, delayMs));

        step = (step + 1) % 16;
        nextTime += stepDuration();
      }

      playbackRef.current = {
        ...playbackRef.current!,
        raf: requestAnimationFrame(tick),
        step,
        nextTime,
      };
    };

    playbackRef.current = { raf: requestAnimationFrame(tick), nextTime, step: 0 };
  }, []);

  const togglePlayback = useCallback(() => {
    if (isPlaying) stopPlayback();
    else startPlayback();
  }, [isPlaying, startPlayback, stopPlayback]);

  // Para ao desmontar
  useEffect(() => () => stopPlayback(), [stopPlayback]);

  // ── Edição de Pattern ────────────────────────────────────────────────

  const toggleStep = useCallback((padKey: keyof DrumPattern, stepIndex: number) => {
    setEditedStyles(prev => {
      const base = prev[activeStyle.id] ?? activeStyle;
      const section = base.sections[activeSection];
      const oldStep = section.pattern[padKey];
      const newSteps = [...oldStep.steps];
      newSteps[stepIndex] = !newSteps[stepIndex];

      return {
        ...prev,
        [activeStyle.id]: {
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
        },
      };
    });
  }, [activeStyle, activeSection]);

  const clearRow = useCallback((padKey: keyof DrumPattern) => {
    setEditedStyles(prev => {
      const base = prev[activeStyle.id] ?? activeStyle;
      const section = base.sections[activeSection];
      return {
        ...prev,
        [activeStyle.id]: {
          ...base,
          sections: {
            ...base.sections,
            [activeSection]: {
              ...section,
              pattern: {
                ...section.pattern,
                [padKey]: { steps: Array(16).fill(false) },
              },
            },
          },
        },
      };
    });
  }, [activeStyle, activeSection]);

  const resetSection = useCallback(() => {
    setEditedStyles(prev => {
      const { [activeStyle.id]: _, ...rest } = prev;
      return rest;
    });
  }, [activeStyle.id]);

  // ── Seleção de estilo ──────────────────────────────────────────────────

  const handleSelectStyle = useCallback((style: RhythmStyle) => {
    stopPlayback();
    setActiveStyle(style);
    setBpm(style.bpm);
    setActiveSection('mainA');
    setView('pad');
  }, [stopPlayback]);

  // ── Pad ao vivo ────────────────────────────────────────────────────────

  const triggerPad = useCallback((padKey: string) => {
    drumEngine.ensureReady().then(() => {
      drumEngine.playDrum(padKey);
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
      }, 150);
    });
  }, []);

  // ── Filtro por categoria ───────────────────────────────────────────────
  const filteredStyles = useMemo(() =>
    RHYTHM_STYLES.filter(s => s.category === selectedCategory),
  [selectedCategory]);

  const catDef = RHYTHM_CATEGORIES.find(c => c.id === selectedCategory)!;
  const catColor = CAT_COLOR[catDef?.color ?? 'slate'];

  // ────────────────────────────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full space-y-4">
      {/* ── Header ── */}
      <div className="glass-card rounded-3xl p-5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-orange-950/40 via-[#130b0a]/60 to-[#0a0718]/80">
        <div>
          <div className="flex items-center gap-2 text-orange-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <Drumstick className="w-4 h-4" />
            <span>Arranjador de Ritmos — PSR-E433</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
            {activeStyle.name}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {activeStyle.genre} · {activeStyle.bpm} BPM · {activeStyle.timeSignature}
            {activeStyle.referenceArtist && ` · Ref: ${activeStyle.referenceArtist}`}
          </p>
        </div>

        {/* Tabs de View */}
        <div className="flex items-center gap-1 bg-black/40 rounded-2xl p-1 border border-white/5">
          {([
            ['catalog', '📋', 'Catálogo'],
            ['pad',     '🥁', 'Drum Pads'],
            ['editor',  '🎛️', 'Editor'],
          ] as [ViewMode, string, string][]).map(([v, ico, lbl]) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                view === v
                  ? 'bg-orange-500/25 border border-orange-500/50 text-orange-200'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent'
              }`}
            >
              <span>{ico}</span>
              <span className="hidden sm:inline">{lbl}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Barra de Transporte ── */}
      <div className="glass-card rounded-2xl px-4 py-3 border border-white/10 flex flex-wrap items-center gap-3">
        {/* Play / Stop */}
        <div className="flex items-center gap-1 bg-black/30 rounded-xl p-1 border border-white/5">
          <button
            onClick={stopPlayback}
            className="p-2 rounded-lg hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
            title="Parar"
          >
            <Square className="w-3.5 h-3.5" />
          </button>
          <button
            id="arranger-play-btn"
            onClick={togglePlayback}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
            }`}
            title={isPlaying ? 'Pausar' : 'Tocar'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>

        {/* Seções de Arranjo */}
        <div className="flex items-center gap-0.5 bg-black/30 rounded-xl p-1 border border-white/5">
          {SECTION_ORDER.map(sid => {
            const sec = currentStyle.sections[sid];
            return (
              <button
                key={sid}
                onClick={() => setActiveSection(sid)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                  activeSection === sid
                    ? 'bg-orange-500/25 border border-orange-500/50 text-orange-200'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent'
                }`}
                title={sec.label}
              >
                <span>{sec.emoji}</span>
                <span className="hidden lg:inline">{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* BPM */}
        <div className="flex items-center gap-1.5 bg-black/30 rounded-xl px-3 py-1.5 border border-white/5">
          <span className="text-[10px] text-slate-400 font-mono uppercase">BPM</span>
          <button onClick={() => setBpm(b => Math.max(40, b - 5))} className="p-0.5 rounded hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <input
            type="number" min={40} max={240} value={bpm}
            onChange={e => setBpm(Math.max(40, Math.min(240, +e.target.value)))}
            className="w-10 text-center text-xs font-black font-mono text-white bg-transparent outline-none"
          />
          <button onClick={() => setBpm(b => Math.min(240, b + 5))} className="p-0.5 rounded hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1" />

        {/* Reset + Salvar */}
        <button
          onClick={resetSection}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Restaurar padrão original"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Restaurar</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          VIEW: CATÁLOGO
      ════════════════════════════════════════════════════════════════════ */}
      {view === 'catalog' && (
        <div className="space-y-4">
          {/* Filtro de Categorias */}
          <div className="flex flex-wrap gap-2">
            {RHYTHM_CATEGORIES.map(cat => {
              const cc = CAT_COLOR[cat.color] ?? CAT_COLOR.slate;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    isActive
                      ? `${cc.bg} ${cc.border} ${cc.text}`
                      : 'bg-white/5 border-white/8 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                  <span className="text-[9px] opacity-60">
                    ({RHYTHM_STYLES.filter(s => s.category === cat.id).length})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Lista de Ritmos da Categoria */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredStyles.map(style => {
              const isActive = activeStyle.id === style.id;
              return (
                <button
                  key={style.id}
                  id={`style-btn-${style.id}`}
                  onClick={() => handleSelectStyle(style)}
                  className={`flex items-start gap-3 p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    isActive
                      ? `${catColor.bg} ${catColor.border} shadow-lg`
                      : 'bg-white/[0.03] border-white/8 hover:bg-white/[0.07] hover:border-white/15'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl shrink-0 ${catColor.bg} border ${catColor.border}`}>
                    <Music className={`w-4 h-4 ${catColor.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <span className="font-bold text-sm text-white truncate">{style.name}</span>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">{style.bpm}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                      {style.description}
                    </p>
                    {style.referenceArtist && (
                      <span className="text-[9px] text-slate-500 mt-1 inline-block">
                        Ref: {style.referenceArtist}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          VIEW: DRUM PADS ao vivo
      ════════════════════════════════════════════════════════════════════ */}
      {view === 'pad' && (
        <div className="space-y-4">
          {/* Indicador do passo atual */}
          {isPlaying && (
            <div className="flex gap-1">
              {Array.from({ length: 16 }, (_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-1.5 rounded-full transition-all duration-75 ${
                    i === currentStep
                      ? 'bg-orange-400'
                      : i % 4 === 0
                      ? 'bg-white/20'
                      : 'bg-white/8'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Pads */}
          <div className="glass-card rounded-2xl p-4 border border-white/10">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-3">
              🥁 Drum Pads — Toque ao Vivo
            </p>
            <div className="grid grid-cols-6 gap-2">
              {DRUM_PADS.slice(0, 12).map(pad => (
                <DrumPadButton
                  key={pad.key}
                  padKey={pad.key}
                  label={pad.label}
                  shortLabel={pad.shortLabel}
                  emoji={pad.emoji}
                  color={pad.color}
                  isActive={activePads.has(pad.key)}
                  onTrigger={() => triggerPad(pad.key)}
                />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {DRUM_PADS.slice(12).map(pad => (
                <DrumPadButton
                  key={pad.key}
                  padKey={pad.key}
                  label={pad.label}
                  shortLabel={pad.shortLabel}
                  emoji={pad.emoji}
                  color={pad.color}
                  isActive={activePads.has(pad.key)}
                  onTrigger={() => triggerPad(pad.key)}
                />
              ))}
            </div>
          </div>

          {/* Padrão ativo da seção (leitura) */}
          <div className="glass-card rounded-2xl p-4 border border-white/10 space-y-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                Padrão Ativo — {currentSection.emoji} {currentSection.label}
              </p>
              <button
                onClick={() => setView('editor')}
                className="flex items-center gap-1 text-[10px] font-bold text-orange-300 hover:text-orange-200 cursor-pointer"
              >
                <Sliders className="w-3 h-3" />
                Editar Pattern
              </button>
            </div>

            {/* Mini visualização do padrão */}
            {DRUM_PADS.map(pad => {
              const s = currentPattern[pad.key];
              const hasAny = s.steps.some(Boolean);
              if (!hasAny) return null;
              return (
                <div key={pad.key} className="flex items-center gap-2">
                  <span className="text-[9px] text-slate-500 w-14 truncate font-mono">{pad.shortLabel}</span>
                  <div className="flex flex-1 gap-0.5">
                    {s.steps.map((on, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-3 rounded-sm ${
                          on
                            ? PAD_COLOR[pad.color]?.active ?? 'bg-white'
                            : i % 4 === 0 ? 'bg-white/10' : 'bg-white/4'
                        } ${i === currentStep && isPlaying ? 'ring-1 ring-white/40' : ''}`}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          VIEW: EDITOR de Step Sequencer
      ════════════════════════════════════════════════════════════════════ */}
      {view === 'editor' && (
        <div className="space-y-3">
          {/* Indicador de passo */}
          {isPlaying && (
            <div className="flex gap-0.5">
              {Array.from({ length: 16 }, (_, i) => (
                <div key={i} className={`flex-1 h-1 rounded-full transition-all ${
                  i === currentStep ? 'bg-orange-400' : i % 4 === 0 ? 'bg-white/20' : 'bg-white/5'
                }`} />
              ))}
            </div>
          )}

          {/* Header do editor */}
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-300 font-bold">
              {currentSection.emoji} {currentSection.label} — {activeStyle.name}
            </span>
            <div className="flex-1" />
            {editedStyles[activeStyle.id] && (
              <span className="flex items-center gap-1 text-amber-400 text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Editado
              </span>
            )}
          </div>

          {/* Numeração dos beats */}
          <div className="flex items-center gap-2 ml-[76px]">
            <div className="flex flex-1 gap-0.5">
              {Array.from({ length: 16 }, (_, i) => (
                <div key={i} className={`flex-1 text-center text-[8px] font-mono ${
                  i % 4 === 0 ? 'text-white/50' : 'text-white/15'
                }`}>
                  {i % 4 === 0 ? Math.floor(i / 4) + 1 : '·'}
                </div>
              ))}
            </div>
          </div>

          {/* Linhas por instrumento */}
          <div className="glass-card rounded-2xl p-4 border border-white/10 space-y-1.5">
            {DRUM_PADS.map(pad => (
              <StepRow
                key={pad.key}
                padKey={pad.key}
                label={pad.shortLabel}
                emoji={pad.emoji}
                color={pad.color}
                step={currentPattern[pad.key]}
                currentStep={currentStep}
                isPlaying={isPlaying}
                onChange={(stepIndex) => toggleStep(pad.key as keyof DrumPattern, stepIndex)}
                onClear={() => clearRow(pad.key as keyof DrumPattern)}
              />
            ))}
          </div>

          {/* Ações de Export */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={resetSection}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-slate-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restaurar Original
            </button>
            <button
              onClick={() => {
                const json = JSON.stringify(currentStyle, null, 2);
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${currentStyle.id}_custom.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-orange-500/15 border border-orange-500/30 text-orange-200 hover:bg-orange-500/25 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Exportar Arranjo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
