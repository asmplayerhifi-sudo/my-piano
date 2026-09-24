import React from 'react';
import { GraduationCap, Guitar, Activity, Music2, Layers, Compass } from 'lucide-react';

export type TabId =
  | 'course-keyboard'
  | 'course-guitar'
  | 'rhythm'
  | 'piano'
  | 'guitar'
  | 'hybrid'
  | 'theory';

interface Props {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
}

export const Navigation: React.FC<Props> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    {
      id: 'course-keyboard' as TabId,
      label: 'Curso de Teclado',
      shortLabel: 'Curso Teclado',
      icon: GraduationCap,
      desc: 'Do Zero ao Avançado & Partitura',
      badge: 'Completo',
      color: 'indigo',
    },
    {
      id: 'course-guitar' as TabId,
      label: 'Curso de Violão',
      shortLabel: 'Curso Violão',
      icon: Guitar,
      desc: 'Pestana, CAGED & Dedo Âncora',
      badge: 'Completo',
      color: 'amber',
    },
    {
      id: 'rhythm' as TabId,
      label: 'Laboratório Rítmico',
      shortLabel: 'Ritmo',
      icon: Activity,
      desc: 'Metrônomo & Esteira Anti-Déficit',
      badge: 'Core',
      color: 'emerald',
    },
    {
      id: 'piano' as TabId,
      label: 'Teclado Virtual',
      shortLabel: 'Teclado',
      icon: Music2,
      desc: 'Acordes, Inversões Livres',
      color: 'indigo',
    },
    {
      id: 'guitar' as TabId,
      label: 'Braço do Violão',
      shortLabel: 'Violão',
      icon: Guitar,
      desc: '15 Casas & Shapes CAGED',
      color: 'amber',
    },
    {
      id: 'hybrid' as TabId,
      label: 'Ritmo + Harmonia',
      shortLabel: 'Híbrido',
      icon: Layers,
      desc: 'Troca de Acordes na Esteira',
      color: 'cyan',
    },
    {
      id: 'theory' as TabId,
      label: 'Teoria Musical',
      shortLabel: 'Teoria',
      icon: Compass,
      desc: 'Escalas e Círculo das Quintas',
      color: 'purple',
    },
  ];

  return (
    <nav className="w-full px-4 sm:px-8 py-3 bg-[#0d0c1c]/90 border-b border-white/5 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-2 min-w-max max-w-7xl mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer select-none ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-500/25 via-purple-500/25 to-pink-500/25 text-white border border-indigo-500/50 shadow-lg shadow-indigo-500/15'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-colors ${
                  isActive ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                  {tab.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                        tab.badge === 'Completo'
                          ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 font-normal hidden md:block">
                  {tab.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
