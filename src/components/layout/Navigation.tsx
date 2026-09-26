import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  GraduationCap,
  Guitar,
  Activity,
  Music2,
  Compass,
  Music,
  LayoutGrid,
  X,
  CheckCircle2,
  PenLine,
  Drum,
  Sparkles,
  Wand2,
} from 'lucide-react';

export type TabId =
  | 'course-keyboard'
  | 'course-guitar'
  | 'theory'
  | 'repertoire'
  | 'rhythm'
  | 'theory-practice'
  | 'piano'
  | 'guitar'
  | 'score-editor'
  | 'arranger'
  | 'phrase-editor';

interface Props {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
}

export type TabCategory = 'course' | 'practice' | 'studio';

export interface NavTabItem {
  id: TabId;
  label: string;
  mediumLabel: string;
  shortLabel: string;
  fullName: string;
  desc: string;
  badge?: string;
  category: TabCategory;
  categoryLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  activeBg: string;
  activeBorder: string;
  activeText: string;
  iconActiveBg: string;
}

export const TABS: NavTabItem[] = [
  // ── 1. Cursos Interativos (Prioridade Didática Máxima) ────────────────────
  {
    id: 'course-keyboard',
    label: 'Curso Teclado',
    mediumLabel: 'Teclado',
    shortLabel: 'Teclado',
    fullName: 'Curso Completo de Teclado & Piano',
    desc: 'Do Zero ao Avançado com Partituras e Solfejo',
    badge: 'Curso',
    category: 'course',
    categoryLabel: 'Cursos',
    icon: GraduationCap,
    accentColor: 'indigo',
    activeBg: 'bg-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.25)]',
    activeBorder: 'border-indigo-500/60',
    activeText: 'text-indigo-200 font-bold',
    iconActiveBg: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/40',
  },
  {
    id: 'course-guitar',
    label: 'Curso Violão',
    mediumLabel: 'Violão',
    shortLabel: 'Violão',
    fullName: 'Curso Completo de Violão Popular & Erudito',
    desc: 'Pestana, CAGED, Dedo Âncora e Levadas',
    badge: 'Curso',
    category: 'course',
    categoryLabel: 'Cursos',
    icon: Guitar,
    accentColor: 'amber',
    activeBg: 'bg-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.25)]',
    activeBorder: 'border-amber-500/60',
    activeText: 'text-amber-200 font-bold',
    iconActiveBg: 'bg-amber-600 text-white shadow-md shadow-amber-500/40',
  },
  {
    id: 'theory',
    label: 'Curso Teoria',
    mediumLabel: 'Teoria',
    shortLabel: 'Teoria',
    fullName: 'Curso de Teoria, Intervalos & Harmonia',
    desc: 'Intervalos, Círculo de Quintas, Escalas e Campo Harmônico',
    badge: 'Curso',
    category: 'course',
    categoryLabel: 'Cursos',
    icon: Compass,
    accentColor: 'rose',
    activeBg: 'bg-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.25)]',
    activeBorder: 'border-rose-500/60',
    activeText: 'text-rose-200 font-bold',
    iconActiveBg: 'bg-rose-600 text-white shadow-md shadow-rose-500/40',
  },

  // ── 2. Prática & Instrumentos ─────────────────────────────────────────────
  {
    id: 'repertoire',
    label: 'Repertório',
    mediumLabel: 'Obras',
    shortLabel: 'Obras',
    fullName: 'Repertório & Partituras Completas',
    desc: '28 Obras Polifônicas com Ambas as Mãos e Cifra',
    badge: '28 Obras',
    category: 'practice',
    categoryLabel: 'Prática',
    icon: Music,
    accentColor: 'purple',
    activeBg: 'bg-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.25)]',
    activeBorder: 'border-purple-500/60',
    activeText: 'text-purple-200 font-bold',
    iconActiveBg: 'bg-purple-600 text-white shadow-md shadow-purple-500/40',
  },
  {
    id: 'rhythm',
    label: 'Lab Rítmico',
    mediumLabel: 'Ritmo',
    shortLabel: 'Ritmo',
    fullName: 'Laboratório Rítmico de Precisão',
    desc: 'Metrônomo Interativo, Pauta Deslizante e Feedback',
    badge: 'Metrônomo',
    category: 'practice',
    categoryLabel: 'Prática',
    icon: Activity,
    accentColor: 'emerald',
    activeBg: 'bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.25)]',
    activeBorder: 'border-emerald-500/60',
    activeText: 'text-emerald-200 font-bold',
    iconActiveBg: 'bg-emerald-600 text-white shadow-md shadow-emerald-500/40',
  },
  {
    id: 'theory-practice',
    label: 'Prática Teórica',
    mediumLabel: 'Teoria',
    shortLabel: 'Teoria',
    fullName: 'Prática Teórica: Escalas, Círculo & Régua',
    desc: 'Escalas, Círculo das Quintas, Régua Cromática e Panorâmica',
    badge: 'Teoria',
    category: 'practice',
    categoryLabel: 'Prática',
    icon: Compass,
    accentColor: 'cyan',
    activeBg: 'bg-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.25)]',
    activeBorder: 'border-cyan-500/60',
    activeText: 'text-cyan-200 font-bold',
    iconActiveBg: 'bg-cyan-600 text-white shadow-md shadow-cyan-500/40',
  },
  {
    id: 'piano',
    label: 'Teclado Livre',
    mediumLabel: 'Teclado Livre',
    shortLabel: 'Teclas',
    fullName: 'Teclado Virtual & Synth Interativo',
    desc: 'Montagem de Acordes, Inversões e Rastro Synthesia',
    category: 'practice',
    categoryLabel: 'Prática',
    icon: Music2,
    accentColor: 'cyan',
    activeBg: 'bg-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.25)]',
    activeBorder: 'border-cyan-500/60',
    activeText: 'text-cyan-200 font-bold',
    iconActiveBg: 'bg-cyan-600 text-white shadow-md shadow-cyan-500/40',
  },
  {
    id: 'guitar',
    label: 'Braço Violão',
    mediumLabel: 'Fretboard',
    shortLabel: 'Fretboard',
    fullName: 'Braço do Violão Interativo (Fretboard)',
    desc: '15 Casas, Shapes CAGED e Diagramas de Acordes',
    category: 'practice',
    categoryLabel: 'Prática',
    icon: Guitar,
    accentColor: 'orange',
    activeBg: 'bg-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.25)]',
    activeBorder: 'border-orange-500/60',
    activeText: 'text-orange-200 font-bold',
    iconActiveBg: 'bg-orange-600 text-white shadow-md shadow-orange-500/40',
  },

  // ── 3. Estúdio & Criação ──────────────────────────────────────────────────
  {
    id: 'score-editor',
    label: 'Editor Partitura',
    mediumLabel: 'Editor',
    shortLabel: 'Editor',
    fullName: 'Editor de Partitura & MIDI',
    desc: 'Componha, reproduza e exporte suas músicas em MIDI',
    badge: 'MIDI',
    category: 'studio',
    categoryLabel: 'Estúdio',
    icon: PenLine,
    accentColor: 'violet',
    activeBg: 'bg-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.25)]',
    activeBorder: 'border-violet-500/60',
    activeText: 'text-violet-200 font-bold',
    iconActiveBg: 'bg-violet-600 text-white shadow-md shadow-violet-500/40',
  },
  {
    id: 'arranger',
    label: 'Arranjador PSR',
    mediumLabel: 'Arranjador',
    shortLabel: 'Ritmos',
    fullName: 'Arranjador de Ritmos PSR-E433',
    desc: '50 estilos rítmicos, drum pads ao vivo e arranjos',
    badge: 'PSR',
    category: 'studio',
    categoryLabel: 'Estúdio',
    icon: Drum,
    accentColor: 'amber',
    activeBg: 'bg-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.25)]',
    activeBorder: 'border-amber-500/60',
    activeText: 'text-amber-200 font-bold',
    iconActiveBg: 'bg-amber-600 text-white shadow-md shadow-amber-500/40',
  },
  {
    id: 'phrase-editor',
    label: 'Fraseados',
    mediumLabel: 'Fraseador',
    shortLabel: 'Frases',
    fullName: 'Editor de Fraseados & Text-to-Melody',
    desc: 'Transforme texto em notas, crie licks por gênero e treine com transposição',
    badge: 'Novo',
    category: 'studio',
    categoryLabel: 'Estúdio',
    icon: Wand2,
    accentColor: 'purple',
    activeBg: 'bg-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.25)]',
    activeBorder: 'border-purple-500/60',
    activeText: 'text-purple-200 font-bold',
    iconActiveBg: 'bg-purple-600 text-white shadow-md shadow-purple-500/40',
  },
];

const COURSE_TABS = TABS.filter((t) => t.category === 'course');
const PRACTICE_TABS = TABS.filter((t) => t.category === 'practice');
const STUDIO_TABS = TABS.filter((t) => t.category === 'studio');

export const Navigation: React.FC<Props> = ({ activeTab, onSelectTab }) => {
  const [showGridModal, setShowGridModal] = useState<boolean>(false);

  const renderTabButton = (tab: NavTabItem) => {
    const Icon = tab.icon;
    const isActive = activeTab === tab.id;

    return (
      <button
        key={tab.id}
        onClick={() => onSelectTab(tab.id)}
        title={`${tab.fullName} — ${tab.desc}`}
        className={`flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border select-none shrink-0 ${
          isActive
            ? `${tab.activeBg} ${tab.activeBorder} ${tab.activeText} ring-1 ring-white/10`
            : 'bg-white/[0.02] hover:bg-white/[0.08] border-white/5 hover:border-white/15 text-slate-400 hover:text-slate-100'
        }`}
      >
        <div
          className={`p-1 rounded-lg transition-colors ${
            isActive ? tab.iconActiveBg : 'bg-white/5 text-slate-400'
          }`}
        >
          <Icon className="w-3.5 h-3.5" />
        </div>

        {/* Rótulo Adaptativo */}
        <span className="hidden sm:inline">{tab.label}</span>
        <span className="sm:hidden inline">{tab.shortLabel}</span>

        {/* Badge Opcional */}
        {tab.badge && (
          <span
            className={`hidden md:inline-block text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              isActive
                ? 'bg-white/20 text-white'
                : 'bg-white/5 text-slate-400 border border-white/5'
            }`}
          >
            {tab.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      <nav className="w-full transition-all select-none">
        <div className="w-full px-2 sm:px-4 md:px-6 2xl:px-8 py-2">
          {/* Container Responsivo com Quebra Natural (flex-wrap) sem estouro horizontal */}
          <div className="flex flex-wrap items-center justify-between sm:justify-center gap-2">
            
            {/* 1. GRUPO: CURSOS (Destaque Principal na Frente) */}
            <div className="flex items-center flex-wrap gap-1 p-1 bg-indigo-950/30 border border-indigo-500/25 rounded-2xl shadow-inner">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300 px-2 py-0.5 inline-flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-indigo-400" />
                <span>Cursos:</span>
              </span>
              {COURSE_TABS.map(renderTabButton)}
            </div>

            {/* Separador Visual em Telas Médias e Grandes */}
            <div className="hidden sm:block w-px h-6 bg-white/10" />

            {/* 2. GRUPO: PRÁTICA & INSTRUMENTOS */}
            <div className="flex items-center flex-wrap gap-1 p-1 bg-white/[0.02] border border-white/5 rounded-2xl">
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300 px-2 py-0.5 inline-flex items-center gap-1">
                <Music2 className="w-3 h-3 text-cyan-400" />
                <span>Prática:</span>
              </span>
              {PRACTICE_TABS.map(renderTabButton)}
            </div>

            {/* Separador Visual */}
            <div className="hidden sm:block w-px h-6 bg-white/10" />

            {/* 3. GRUPO: ESTÚDIO & CRIAÇÃO */}
            <div className="flex items-center flex-wrap gap-1 p-1 bg-white/[0.02] border border-white/5 rounded-2xl">
              <span className="text-[10px] font-black uppercase tracking-wider text-violet-300 px-2 py-0.5 inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-violet-400" />
                <span>Estúdio:</span>
              </span>
              {STUDIO_TABS.map(renderTabButton)}
            </div>

            {/* Botão de Grade para Visão Geral Completa */}
            <button
              onClick={() => setShowGridModal(true)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors shrink-0"
              title="Abrir grade de todos os 9 módulos"
              aria-label="Abrir grade de módulos"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Modal de Navegação Rápida com Categorias Claramente Divididas */}
      {showGridModal && (typeof document !== 'undefined' ? createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none"
          onClick={() => setShowGridModal(false)}
        >
          <div
            className="bg-[#100f24] border border-white/15 rounded-3xl p-5 sm:p-6 w-full max-w-2xl shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black font-display text-white">
                    Todos os Módulos do Harmonia
                  </h3>
                  <p className="text-xs text-slate-400">
                    Selecione rapidamente qualquer curso, instrumento ou estúdio
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGridModal(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Seções Organizadas no Modal */}
            <div className="space-y-4">
              {/* Seção Cursos */}
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-indigo-300 flex items-center gap-1.5 mb-2">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Cursos Interativos (Trilha de Aprendizado)</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {COURSE_TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isSelected = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          onSelectTab(tab.id);
                          setShowGridModal(false);
                        }}
                        className={`flex flex-col p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600/25 border-indigo-500 text-white shadow-lg'
                            : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/5 text-slate-300 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1.5">
                          <div className={`p-1.5 rounded-lg ${isSelected ? tab.iconActiveBg : 'bg-white/5 text-slate-400'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                        </div>
                        <strong className="text-xs text-white">{tab.label}</strong>
                        <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{tab.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Seção Prática */}
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-cyan-300 flex items-center gap-1.5 mb-2">
                  <Music2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Instrumentos &amp; Prática Rítmica</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PRACTICE_TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isSelected = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          onSelectTab(tab.id);
                          setShowGridModal(false);
                        }}
                        className={`flex items-start gap-2.5 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-600/20 border-cyan-500 text-white shadow-lg'
                            : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/5 text-slate-300 hover:text-white'
                        }`}
                      >
                        <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${isSelected ? tab.iconActiveBg : 'bg-white/5 text-slate-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <strong className="text-xs text-white">{tab.fullName}</strong>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                          </div>
                          <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{tab.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Seção Estúdio */}
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-violet-300 flex items-center gap-1.5 mb-2">
                  <PenLine className="w-3.5 h-3.5 text-violet-400" />
                  <span>Estúdio de Produção &amp; Arranjos</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {STUDIO_TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isSelected = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          onSelectTab(tab.id);
                          setShowGridModal(false);
                        }}
                        className={`flex items-start gap-2.5 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-violet-600/20 border-violet-500 text-white shadow-lg'
                            : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/5 text-slate-300 hover:text-white'
                        }`}
                      >
                        <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${isSelected ? tab.iconActiveBg : 'bg-white/5 text-slate-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <strong className="text-xs text-white">{tab.fullName}</strong>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0" />}
                          </div>
                          <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{tab.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowGridModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>,
        document.body
      ) : null)}
    </>
  );
};

export default Navigation;
