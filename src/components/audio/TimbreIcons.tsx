import React from 'react';

interface TimbreIconProps {
  iconKey: string;
  className?: string;
  size?: number;
}

export const TimbreIcon: React.FC<TimbreIconProps> = ({
  iconKey,
  className = 'w-5 h-5',
  size = 20,
}) => {
  switch (iconKey) {
    // ─── Pianos ────────────────────────────────────────────────────────────
    case 'grand_piano':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          {/* Asa do piano de cauda */}
          <path d="M4 19V7c0-2.5 2-4 5-4h3c5 0 8 3 8 8v8H4z" />
          {/* Teclado frontal */}
          <path d="M4 15h16" />
          <path d="M7 15v4M10 15v4M13 15v4M16 15v4" />
          <path d="M5.5 15v2M8.5 15v2M11.5 15v2M14.5 15v2" strokeWidth="2.5" />
          {/* Pés do piano */}
          <path d="M6 19v2M18 19v2" />
        </svg>
      );

    case 'upright_piano':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          {/* Console vertical do piano de armário */}
          <rect x="3" y="4" width="18" height="15" rx="1.5" />
          <path d="M3 13h18" />
          <path d="M6 13v6M9 13v6M12 13v6M15 13v6M18 13v6" />
          <path d="M7.5 13v3.5M10.5 13v3.5M13.5 13v3.5M16.5 13v3.5" strokeWidth="2.5" />
          <path d="M8 7h8" />
          <path d="M5 19v2M19 19v2" />
        </svg>
      );

    case 'honky_tonk':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="3" y="4" width="18" height="15" rx="1" />
          <path d="M3 13h18" />
          <path d="M7 13v6M11 13v6M15 13v6" />
          {/* Tachas/tacks metálicas */}
          <circle cx="8" cy="8" r="1" fill="currentColor" />
          <circle cx="12" cy="8" r="1" fill="currentColor" />
          <circle cx="16" cy="8" r="1" fill="currentColor" />
          <path d="M5 19v2M19 19v2" />
        </svg>
      );

    // ─── Pianos Elétricos & Órgãos ──────────────────────────────────────────
    case 'rhodes':
    case 'rhodes_suitcase':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          {/* Painel do Rhodes com régua metálica e knobs */}
          <rect x="2" y="6" width="20" height="13" rx="2" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <circle cx="5.5" cy="9" r="1" fill="currentColor" />
          <circle cx="8.5" cy="9" r="1" fill="currentColor" />
          <path d="M4 12v7M7 12v7M10 12v7M13 12v7M16 12v7M19 12v7" />
          <path d="M5.5 12v3.5M8.5 12v3.5M11.5 12v3.5M14.5 12v3.5M17.5 12v3.5" strokeWidth="2.5" />
        </svg>
      );

    case 'wurlitzer':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          {/* Gabinete curvo do Wurlitzer 200A */}
          <path d="M3 8c0-2 2-3 4-3h10c2 0 4 1 4 3v10H3V8z" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <circle cx="6" cy="9" r="1.2" fill="currentColor" />
          <circle cx="9" cy="9" r="1.2" fill="currentColor" />
          <path d="M5 12v6M8 12v6M11 12v6M14 12v6M17 12v6" />
          <path d="M6.5 12v3M9.5 12v3M12.5 12v3M15.5 12v3" strokeWidth="2.5" />
          <line x1="5" y1="18" x2="4" y2="21" />
          <line x1="19" y1="18" x2="20" y2="21" />
        </svg>
      );

    case 'clavinet':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="2" y="7" width="20" height="11" rx="1.5" />
          <line x1="2" y1="11" x2="22" y2="11" />
          {/* Chaves rocker */}
          <line x1="4" y1="9" x2="6" y2="9" />
          <line x1="7.5" y1="9" x2="9.5" y2="9" />
          <path d="M4 11v7M7 11v7M10 11v7M13 11v7M16 11v7M19 11v7" />
          <path d="M5.5 11v4M8.5 11v4M11.5 11v4M14.5 11v4M17.5 11v4" strokeWidth="2.5" />
        </svg>
      );

    case 'organ_hammond':
    case 'organ':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          {/* Drawbars no topo */}
          <path d="M4 3v5M7 3v3M10 3v6M13 3v4M16 3v5M19 3v2" strokeWidth="2" />
          <circle cx="4" cy="8" r="1" fill="currentColor" />
          <circle cx="7" cy="6" r="1" fill="currentColor" />
          <circle cx="10" cy="9" r="1" fill="currentColor" />
          <circle cx="13" cy="7" r="1" fill="currentColor" />
          <circle cx="16" cy="8" r="1" fill="currentColor" />
          <circle cx="19" cy="5" r="1" fill="currentColor" />
          {/* Dois manuais */}
          <rect x="2" y="11" width="20" height="5" rx="1" />
          <rect x="2" y="16" width="20" height="5" rx="1" />
          <path d="M5 11v5M8 11v5M11 11v5M14 11v5M17 11v5" />
          <path d="M6 16v5M9 16v5M12 16v5M15 16v5M18 16v5" />
        </svg>
      );

    case 'vox_continental':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          {/* Órgão combo Vox anos 60 */}
          <path d="M2 7h20v11H2z" />
          <line x1="2" y1="11" x2="22" y2="11" />
          {/* Chaves inversas (teclas pretas com naturais invertidas) */}
          <rect x="4" y="11" width="16" height="4" fill="currentColor" opacity="0.25" />
          <path d="M5 11v7M8 11v7M11 11v7M14 11v7M17 11v7M20 11v7" />
          {/* Pés cromados em Z do Vox */}
          <path d="M4 18l-1 4M20 18l1 4M3 22h18" />
        </svg>
      );

    case 'farfisa':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="2" y="6" width="20" height="12" rx="1" />
          {/* Multi-tabs coloridos */}
          <path d="M4 8h2M7 8h2M10 8h2M13 8h2M16 8h2M19 8h1" strokeWidth="2.5" />
          <line x1="2" y1="11" x2="22" y2="11" />
          <path d="M5 11v7M9 11v7M13 11v7M17 11v7" />
          <path d="M7 11v4M11 11v4M15 11v4" strokeWidth="2.5" />
        </svg>
      );

    case 'accordion':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          {/* Teclado da sanfona à direita */}
          <rect x="17" y="5" width="5" height="14" rx="1" />
          <path d="M17 9h5M17 12h5M17 15h5" />
          {/* Fole sanfonado plissado no centro */}
          <path d="M7 5l3 2-3 2 3 2-3 2 3 2-3 2 3 2" />
          <path d="M10 5l3 2-3 2 3 2-3 2 3 2-3 2 3 2" />
          <path d="M13 5l4 2-4 2 4 2-4 2 4 2-4 2 4 2" />
          {/* Botões dos baixos à esquerda */}
          <rect x="2" y="5" width="5" height="14" rx="1" />
          <circle cx="4.5" cy="8" r="0.8" fill="currentColor" />
          <circle cx="4.5" cy="11" r="0.8" fill="currentColor" />
          <circle cx="4.5" cy="14" r="0.8" fill="currentColor" />
          <circle cx="4.5" cy="16.5" r="0.8" fill="currentColor" />
        </svg>
      );

    // ─── Percussão Afinada ──────────────────────────────────────────────────
    case 'vibraphone':
    case 'marimba':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          {/* Barras/lâminas afinadas de metal ou madeira */}
          <rect x="2" y="8" width="3" height="8" rx="0.5" />
          <rect x="6" y="7" width="3" height="10" rx="0.5" />
          <rect x="10" y="6" width="3" height="12" rx="0.5" />
          <rect x="14" y="5.5" width="3" height="13" rx="0.5" />
          <rect x="18" y="5" width="3" height="14" rx="0.5" />
          {/* Baqueta cruzada com ponta esférica */}
          <line x1="3" y1="21" x2="16" y2="3" />
          <circle cx="16.5" cy="3.5" r="1.8" fill="currentColor" />
        </svg>
      );

    case 'celesta':
    case 'glockenspiel':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          {/* Lâminas em formato trapezoidal de glockenspiel */}
          <path d="M4 4h16l-2 16H6L4 4z" />
          <line x1="5.5" y1="8" x2="18.5" y2="8" />
          <line x1="6.5" y1="12" x2="17.5" y2="12" />
          <line x1="7.5" y1="16" x2="16.5" y2="16" />
          {/* Duas baquetas */}
          <circle cx="10" cy="5.5" r="1.2" fill="currentColor" />
          <circle cx="14" cy="5.5" r="1.2" fill="currentColor" />
        </svg>
      );

    // ─── Sintetizadores & Leads ─────────────────────────────────────────────
    case 'minimoog':
    case 'minimoog_lead':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          {/* Painel basculante do Minimoog */}
          <path d="M3 4h18l-1 9H4L3 4z" />
          {/* 3 botões/knobs de oscilador e filtro */}
          <circle cx="7" cy="8" r="1.5" fill="currentColor" />
          <circle cx="12" cy="8" r="1.5" fill="currentColor" />
          <circle cx="17" cy="8" r="1.5" fill="currentColor" />
          {/* Teclado frontal plano */}
          <rect x="3" y="13" width="18" height="7" rx="1" />
          <path d="M6 13v7M9 13v7M12 13v7M15 13v7M18 13v7" />
          <path d="M7.5 13v4M10.5 13v4M13.5 13v4M16.5 13v4" strokeWidth="2.5" />
        </svg>
      );

    case 'synth_lead':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          {/* Onda dente-de-serra afiada e cortante */}
          <path d="M2 17l6-10v10l6-10v10l6-10v10h2" />
          {/* Pulso de energia */}
          <path d="M12 2l-2 4h4l-2 4" strokeWidth="2" />
        </svg>
      );

    case 'dx7':
    case 'dx7_epiano':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          {/* Display LCD e membrana do DX7 */}
          <rect x="2" y="6" width="20" height="12" rx="1" />
          <rect x="5" y="8" width="6" height="3" rx="0.5" fill="currentColor" opacity="0.3" />
          <circle cx="15" cy="9.5" r="1" fill="currentColor" />
          <circle cx="18" cy="9.5" r="1" fill="currentColor" />
          {/* Algoritmo FM gráfico */}
          <line x1="2" y1="13" x2="22" y2="13" />
          <path d="M6 13v5M10 13v5M14 13v5M18 13v5" />
        </svg>
      );

    case 'synth_pad':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          {/* Ondas atmosféricas flutuantes concêntricas */}
          <path d="M2 12c3-4 6-4 9 0s6 4 9 0" />
          <path d="M2 7c3-3 6-3 9 0s6 3 9 0" opacity="0.6" />
          <path d="M2 17c3-3 6-3 9 0s6 3 9 0" opacity="0.6" />
          <circle cx="12" cy="12" r="8" strokeDasharray="3 3" opacity="0.4" />
        </svg>
      );

    case 'synth_brass':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          {/* Onda dente de serra + campana de metais sintéticos */}
          <path d="M3 15l4-7v7l4-7v7" />
          <path d="M13 14c2-4 5-6 8-6v8c-3 0-6-2-8-2" />
          <ellipse cx="21" cy="12" rx="1.5" ry="4" />
        </svg>
      );

    case 'brass_brega':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          {/* Trompete / Saxophone campana de metais de seresta */}
          <path d="M3 13h9c3 0 6-3 8-5v8c-2-2-5-3-8-3H3v-2z" />
          <ellipse cx="20" cy="12" rx="1.5" ry="4" />
          {/* Válvulas de pistão */}
          <path d="M7 10v3M9.5 10v3M12 10v3" strokeWidth="2" />
        </svg>
      );

    // ─── Cordas & Orquestra ─────────────────────────────────────────────────
    case 'strings':
    case 'violin':
    case 'cello':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          {/* Corpo do violino / cello com curvas e F-holes */}
          <path d="M8 3c0 2 2 3 2 5-2 1-3 3-3 5 0 3 2 6 5 6s5-3 5-6c0-2-1-4-3-5 0-2 2-3 2-5-2 0-3 1-4 1s-2-1-4-1z" />
          {/* F-holes */}
          <path d="M10 11c0 1-.5 2-1 2M14 11c0 1 .5 2 1 2" />
          {/* Cordas */}
          <line x1="12" y1="3" x2="12" y2="19" strokeWidth="1" />
        </svg>
      );

    case 'harp':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          {/* Coluna e arco da harpa */}
          <path d="M4 21V4c4 1 9 1 14 6-2 7-6 11-14 11z" />
          {/* Cordas da harpa */}
          <line x1="7" y1="5.5" x2="7" y2="20" strokeWidth="1" />
          <line x1="10" y1="7" x2="10" y2="19.5" strokeWidth="1" />
          <line x1="13" y1="8.5" x2="13" y2="18" strokeWidth="1" />
          <line x1="16" y1="10" x2="16" y2="16" strokeWidth="1" />
          <path d="M3 21h8" strokeWidth="2" />
        </svg>
      );

    case 'flute':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          {/* Corpo esguio da flauta transversal */}
          <path d="M2 19L19 2l3 3L5 22H2v-3z" />
          <circle cx="8" cy="13" r="0.8" fill="currentColor" />
          <circle cx="11" cy="10" r="0.8" fill="currentColor" />
          <circle cx="14" cy="7" r="0.8" fill="currentColor" />
          <circle cx="17" cy="4" r="0.8" fill="currentColor" />
        </svg>
      );

    // ─── Guitarras & Violões ────────────────────────────────────────────────
    case 'guitar_nylon':
    case 'guitar_7strings':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          {/* Violão acústico com bocal/soundhole */}
          <path d="M12 8c2-2 4-2 6 0 2 2 2 4 0 6-2 1-3 3-2 5 1 2 0 4-2 4s-4 0-5-2c-1-2 0-4 1-5-1-2-2-4 0-6 1-1 1-1 2-2z" />
          <circle cx="15" cy="13" r="2" />
          {/* Braço e cavalete */}
          <path d="M8 8L3 3M4 6L2 4" strokeWidth="2" />
        </svg>
      );

    case 'strat_clean':
    case 'strat_drive':
    case 'guitar_reggae':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          {/* Guitarra elétrica com double-cutaway Stratocaster */}
          <path d="M14 9c1-2 3-3 5-1s1 4-1 6-2 3-1 5 1 4-1 4-5-1-6-3 0-3 1-4-1-3 0-4 2-2 3-3z" />
          {/* 3 single coils */}
          <line x1="14" y1="12" x2="16" y2="14" strokeWidth="2" />
          <line x1="15.5" y1="13.5" x2="17.5" y2="15.5" strokeWidth="2" />
          {/* Braço longo com headstock */}
          <line x1="11" y1="8" x2="3" y2="2" strokeWidth="2.5" />
          <circle cx="3" cy="2" r="1.5" fill="currentColor" />
        </svg>
      );

    case 'harpsichord':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          {/* Cravo histórico asa curva */}
          <path d="M3 18V6c3 0 9 2 13 6 2 2 4 4 5 6H3z" />
          <line x1="3" y1="14" x2="21" y2="14" />
          <path d="M5 14v4M8 14v4M11 14v4M14 14v4M17 14v4" />
          <path d="M6.5 14v2.5M9.5 14v2.5M12.5 14v2.5M15.5 14v2.5" strokeWidth="2" />
        </svg>
      );

    // ─── Baixos ─────────────────────────────────────────────────────────────
    case 'bass_pick':
    case 'bass_finger':
    case 'bass':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          {/* Baixo elétrico de 4 cordas com 4 tarraxas */}
          <path d="M13 10c1-2 3-2 5 0s1 4-1 5-2 3-1 5 1 4-1 4-5-1-6-3 0-3 1-4-1-3 0-4 1-2 3-3z" />
          <rect x="13.5" y="13" width="3" height="1.5" rx="0.5" fill="currentColor" />
          <line x1="10" y1="8" x2="3" y2="3" strokeWidth="3" />
          {/* 4 tarraxas características de baixo */}
          <circle cx="2" cy="2" r="1" fill="currentColor" />
          <circle cx="4" cy="2" r="1" fill="currentColor" />
          <circle cx="2" cy="4" r="1" fill="currentColor" />
          <circle cx="4" cy="4" r="1" fill="currentColor" />
        </svg>
      );

    case 'bass_acoustic':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          {/* Contrabaixo acústico com espigão */}
          <path d="M8 5c0 2 2 3 2 4-3 1-4 3-4 5 0 3 2 6 6 6s6-3 6-6c0-2-1-4-4-5 0-1 2-2 2-4-2 0-3 1-4 1s-2-1-4-1z" />
          <line x1="12" y1="2" x2="12" y2="5" strokeWidth="2.5" />
          <line x1="12" y1="20" x2="12" y2="23" strokeWidth="2" />
        </svg>
      );

    case 'bass_synth':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          {/* Moog Taurus pedalboard / sub-bass */}
          <rect x="3" y="6" width="18" height="13" rx="2" />
          <path d="M6 10h12" />
          <circle cx="8" cy="14" r="2" fill="currentColor" opacity="0.4" />
          <circle cx="16" cy="14" r="2" fill="currentColor" opacity="0.4" />
          <path d="M12 9v5" strokeWidth="2" />
        </svg>
      );

    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 13h18" />
          <path d="M7 13v6M11 13v6M15 13v6M19 13v6" />
          <path d="M5 13v3M9 13v3M13 13v3M17 13v3" strokeWidth="2.5" />
        </svg>
      );
  }
};
