import React from 'react';
import type { CourseThemeColor } from './CourseContextualHeader';

export interface CourseSubTabItem {
  id: string;
  label: string;
  shortLabel?: string;
  icon?: React.ReactNode;
}

export interface CourseSubTabsProps {
  lessonTitle: string;
  lessonLevel?: string;
  tabs: CourseSubTabItem[];
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
  accentColor?: CourseThemeColor;
  rightSlot?: React.ReactNode;
}

export const CourseSubTabs: React.FC<CourseSubTabsProps> = ({
  lessonTitle,
  lessonLevel,
  tabs,
  activeTabId,
  onSelectTab,
  accentColor = 'indigo',
  rightSlot,
}) => {
  const colorStyles = {
    indigo: {
      activeTab: 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 font-bold',
      inactiveTab: 'text-slate-400 hover:text-white hover:bg-white/5',
      dot: 'bg-indigo-400',
    },
    amber: {
      activeTab: 'bg-amber-600 text-white shadow-sm shadow-amber-600/30 font-bold',
      inactiveTab: 'text-slate-400 hover:text-white hover:bg-white/5',
      dot: 'bg-amber-400',
    },
    cyan: {
      activeTab: 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/30 font-bold',
      inactiveTab: 'text-slate-400 hover:text-white hover:bg-white/5',
      dot: 'bg-cyan-400',
    },
    purple: {
      activeTab: 'bg-purple-600 text-white shadow-sm shadow-purple-600/30 font-bold',
      inactiveTab: 'text-slate-400 hover:text-white hover:bg-white/5',
      dot: 'bg-purple-400',
    },
  }[accentColor];

  return (
    <div
      className="w-full h-[32px] max-h-[32px] px-3 sm:px-4 flex items-center justify-between gap-2 bg-[#090814] border-b border-white/5 select-none text-xs"
      role="tablist"
      aria-label="Sub-modos da aula"
    >
      {/* 1. Título da Lição / Nível (Esquerda) */}
      <div className="flex items-center gap-2 min-w-0">
        {lessonLevel && (
          <span className="hidden lg:inline-block px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-white/5 text-slate-400 border border-white/10 shrink-0">
            {lessonLevel}
          </span>
        )}
        <h3
          className="font-bold text-slate-200 tracking-tight truncate text-[11px] sm:text-xs"
          title={lessonTitle}
        >
          {lessonTitle}
        </h3>
      </div>

      {/* 2. Sub-abas Interativas (Centro / Direita) */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="flex items-center bg-black/40 p-0.5 rounded-lg border border-white/5">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelectTab(tab.id)}
                className={`px-2 sm:px-2.5 py-0.5 rounded-md text-[10px] sm:text-[11px] transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive ? colorStyles.activeTab : colorStyles.inactiveTab
                }`}
              >
                {tab.icon && <span className="shrink-0">{tab.icon}</span>}
                <span className="hidden md:inline">{tab.label}</span>
                <span className="inline md:hidden">{tab.shortLabel || tab.label}</span>
              </button>
            );
          })}
        </div>

        {rightSlot && <div className="shrink-0">{rightSlot}</div>}
      </div>
    </div>
  );
};
