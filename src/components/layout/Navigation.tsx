import React, { useState } from 'react';
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
} from 'lucide-react';

export type TabId =
  | 'course-keyboard'
  | 'course-guitar'
  | 'theory'
  | 'repertoire'
  | 'rhythm'
  | 'piano'
  | 'guitar'
  | 'score-editor'
  | 'arranger';

interface Props {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
}

interface NavTabItem {
  id: TabId;
  label: string;
  mediumLabel: string;
  shortLabel: string;
  fullName: string;
  desc: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  activeBg: string;
  activeBorder: string;
  activeText: string;
  iconActiveBg: string;
}

const TABS: NavTabItem[] = [
  {
    id: 'course-keyboard',
    label: 'Curso Teclado',
    mediumLabel: 'Teclado',
    shortLabel: 'Teclado',
    fullName: 'Curso Completo de Teclado & Piano',
    desc: 'Do Zero ao Avançado com Partituras e Solfejo',
    badge: 'Curso',
    icon: GraduationCap,
    accentColor: 'indigo',
    activeBg: 'bg-indigo-500/15',
    activeBorder: 'border-indigo-500/50',
    activeText: 'text-indigo-200',
    iconActiveBg: 'bg-indigo-600 text-white shadow-indigo-500/30',
  },
  {
    id: 'course-guitar',
    label: 'Curso Violão',
    mediumLabel: 'Violão',
    shortLabel: 'Violão',
    fullName: 'Curso Completo de Violão Popular & Erudito',
    desc: 'Pestana, CAGED, Dedo Âncora e Levadas',
    badge: 'Curso',
    icon: Guitar,
    accentColor: 'amber',
    activeBg: 'bg-amber-500/15',
    activeBorder: 'border-amber-500/50',
    activeText: 'text-amber-200',
    iconActiveBg: 'bg-amber-600 text-white shadow-amber-500/30',
  },
  {
    id: 'repertoire',
    label: 'Repertório',
    mediumLabel: 'Partituras',
    shortLabel: 'Obras',
    fullName: 'Repertório & Partituras Completas',
    desc: '28 Obras Polifônicas com Ambas as Mãos e Cifra',
    badge: '28 Obras',
    icon: Music,
    accentColor: 'purple',
    activeBg: 'bg-purple-500/15',
    activeBorder: 'border-purple-500/50',
    activeText: 'text-purple-200',
    iconActiveBg: 'bg-purple-600 text-white shadow-purple-500/30',
  },
  {
    id: 'rhythm',
    label: 'Lab Rítmico',
    mediumLabel: 'Ritmo',
    shortLabel: 'Ritmo',
    fullName: 'Laboratório Rítmico Anti-Déficit',
    desc: 'Metrônomo Interativo, Pauta Deslizante e Feedback',
    badge: 'Core',
    icon: Activity,
    accentColor: 'emerald',
    activeBg: 'bg-emerald-500/15',
    activeBorder: 'border-emerald-500/50',
    activeText: 'text-emerald-200',
    iconActiveBg: 'bg-emerald-600 text-white shadow-emerald-500/30',
  },
  {
    id: 'piano',
    label: 'Teclado Virtual',
    mediumLabel: 'Piano Livre',
    shortLabel: 'Piano',
    fullName: 'Teclado Virtual & Synth Interativo',
    desc: 'Montagem de Acordes, Inversões e Rastro Synthesia',
    icon: Music2,
    accentColor: 'cyan',
    activeBg: 'bg-cyan-500/15',
    activeBorder: 'border-cyan-500/50',
    activeText: 'text-cyan-200',
    iconActiveBg: 'bg-cyan-600 text-white shadow-cyan-500/30',
  },
  {
    id: 'guitar',
    label: 'Braço Violão',
    mediumLabel: 'Fretboard',
    shortLabel: 'Braço',
    fullName: 'Braço do Violão Interativo (Fretboard)',
    desc: '15 Casas, Shapes CAGED e Diagramas de Acordes',
    icon: Guitar,
    accentColor: 'orange',
    activeBg: 'bg-orange-500/15',
    activeBorder: 'border-orange-500/50',
    activeText: 'text-orange-200',
    iconActiveBg: 'bg-orange-600 text-white shadow-orange-500/30',
  },
  {
    id: 'theory',
    label: 'Curso Teoria Musical',
    mediumLabel: 'Teoria',
    shortLabel: 'Teoria',
    fullName: 'Laboratório de Teoria & Harmonia',
    desc: 'Círculo das Quintas, Escalas e Campo Harmônico',
    icon: Compass,
    accentColor: 'rose',
    activeBg: 'bg-rose-500/15',
    activeBorder: 'border-rose-500/50',
    activeText: 'text-rose-200',
    iconActiveBg: 'bg-rose-600 text-white shadow-rose-500/30',
  },
  {
    id: 'score-editor',
    label: 'Editor de Partitura',
    mediumLabel: 'Editor',
    shortLabel: 'Editor',
    fullName: 'Editor de Partitura & MIDI',
    desc: 'Compose, reproduza e exporte suas músicas em MIDI',
    badge: 'Novo',
    icon: PenLine,
    accentColor: 'violet',
    activeBg: 'bg-violet-500/15',
    activeBorder: 'border-violet-500/50',
    activeText: 'text-violet-200',
    iconActiveBg: 'bg-violet-600 text-white shadow-violet-500/30',
  },
  {
    id: 'arranger',
    label: 'Arranjador',
    mediumLabel: 'Arranjador',
    shortLabel: 'Ritmos',
    fullName: 'Arranjador de Ritmos PSR-E433',
    desc: '50 estilos, drum pads ao vivo e editor de arranjos',
    badge: 'PSR',
    icon: Drum,
    accentColor: 'orange',
    activeBg: 'bg-orange-500/15',
    activeBorder: 'border-orange-500/50',
    activeText: 'text-orange-200',
    iconActiveBg: 'bg-orange-600 text-white shadow-orange-500/30',
  },
];

export const Navigation: React.FC<Props> = ({ activeTab, onSelectTab }) => {
  const [showGridModal, setShowGridModal] = useState<boolean>(false);

  return (
    <>
      <nav className="w-full bg-[#0a0916]/95 backdrop-blur-md border-b border-white/5 sticky top-[65px] z-30 transition-all select-none">
        <div className="w-full px-2 sm:px-4 md:px-6 2xl:px-8">
          <div className="flex items-center justify-between gap-1.5 py-2">
            {/* Lista Horizontal de Abas Otimizada ao Tamanho da Tela */}
            <div className="flex items-center justify-start lg:justify-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth flex-1 py-0.5">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => onSelectTab(tab.id)}
                    title={`${tab.fullName} — ${tab.desc}`}
                    className={`flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-1.5 lg:px-3.5 lg:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 border ${isActive
                      ? `${tab.activeBg} ${tab.activeBorder} ${tab.activeText} shadow-md shadow-black/40 ring-1 ring-white/10`
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.06] border-transparent'
                      }`}
                  >
                    <div
                      className={`p-1 rounded-lg transition-colors ${isActive ? tab.iconActiveBg : 'bg-white/5 text-slate-400'
                        }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>

                    {/* Rótulo Responsivo: Adapta o tamanho do texto ao viewport */}
                    <span className="hidden xl:inline">{tab.label}</span>
                    <span className="hidden md:inline xl:hidden">{tab.mediumLabel}</span>
                    <span className="md:hidden inline">{tab.shortLabel}</span>

                    {/* Badge Compacto (Apenas quando há espaço suficiente) */}
                    {tab.badge && (
                      <span className="hidden 2xl:inline-block text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider bg-white/10 text-slate-300 border border-white/10">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Botão de Grade Rápida de Módulos (Visível em Mobile e Telas Compactas) */}
            <button
              onClick={() => setShowGridModal(true)}
              className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors shrink-0 ml-1"
              title="Ver todos os módulos em grade"
              aria-label="Abrir grade de módulos"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Modal / Gaveta de Navegação com Todos os 8 Módulos Detalhados */}
      {showGridModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#100f24] border border-white/15 rounded-3xl p-5 sm:p-6 w-full max-w-2xl shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
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
                    Selecione rapidamente qualquer curso ou ferramenta prática
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onSelectTab(tab.id);
                      setShowGridModal(false);
                    }}
                    className={`flex items-start gap-3 p-3 rounded-2xl border text-left transition-all cursor-pointer ${isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-600/10'
                      : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/5 text-slate-300 hover:text-white'
                      }`}
                  >
                    <div
                      className={`p-2 rounded-xl shrink-0 mt-0.5 ${isSelected ? tab.iconActiveBg : 'bg-white/5 text-slate-400'
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-xs truncate text-white">
                          {tab.fullName}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {tab.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
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
        </div>
      )}
    </>
  );
};
