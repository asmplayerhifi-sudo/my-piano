import React, { useRef, useEffect, useCallback } from 'react';
import { getNoteInfo } from '../../core/musicTheory';

export interface ActiveNoteTrigger {
  midi: number;
  isDown: boolean;
  color?: string;
  timestamp?: number;
}

export type TrailColorTheme = 'coral' | 'cyan' | 'harmonic';
export type TrailDirection = 'rising' | 'falling';

interface Props {
  startOctave: number;
  octaveCount: number;
  whiteKeyWidth: number;
  blackKeyWidth: number;
  activeMidiTriggers?: ActiveNoteTrigger[];
  activeMidiNotes?: number[];
  height?: number;
  theme?: TrailColorTheme;
  direction?: TrailDirection;
  speed?: number; // pixels per second
  onKeyClick?: (midi: number) => void;
  className?: string;
}

interface TrailSegment {
  id: string;
  midi: number;
  x: number;
  width: number;
  startY: number; // Posição Y superior (em modo rising: vai subindo para 0)
  endY: number;   // Posição Y inferior (em modo rising: ancorada no fundo enquanto ativa)
  active: boolean;
  color: string;
  borderColor: string;
  glowColor: string;
  noteName: string;
  isBlack: boolean;
}

interface SparkleParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
}

export function getKeyPosition(
  midi: number,
  startOctave: number,
  whiteKeyWidth: number,
  blackKeyWidth: number
): { x: number; width: number; isBlack: boolean; noteName: string } | null {
  const octave = Math.floor(midi / 12) - 1;
  const semitone = ((midi % 12) + 12) % 12;
  const octIdx = octave - startOctave;

  const whiteOffsets: Record<number, number> = { 0: 0, 2: 1, 4: 2, 5: 3, 7: 4, 9: 5, 11: 6 };
  const blackOffsets: Record<number, number> = { 1: 0, 3: 1, 6: 3, 8: 4, 10: 5 };

  const noteInfo = getNoteInfo(midi);

  if (semitone in whiteOffsets) {
    const whiteIdxInOct = whiteOffsets[semitone];
    const totalWhiteIndex = octIdx * 7 + whiteIdxInOct;
    const x = totalWhiteIndex * whiteKeyWidth;
    const padW = Math.max(0.5, Math.min(2.5, whiteKeyWidth * 0.05));
    return {
      x: x + padW,
      width: Math.max(3, whiteKeyWidth - padW * 2),
      isBlack: false,
      noteName: `${noteInfo.name}${noteInfo.octave}`,
    };
  } else if (semitone in blackOffsets) {
    const posAfterWhite = blackOffsets[semitone];
    const x = (octIdx * 7 + posAfterWhite + 1) * whiteKeyWidth - blackKeyWidth / 2;
    const padB = Math.max(0.5, Math.min(2, blackKeyWidth * 0.05));
    return {
      x: x + padB,
      width: Math.max(3, blackKeyWidth - padB * 2),
      isBlack: true,
      noteName: `${noteInfo.name}${noteInfo.octave}`,
    };
  }
  return null;
}

export const PianoWaterfallCanvas: React.FC<Props> = ({
  startOctave,
  octaveCount,
  whiteKeyWidth,
  blackKeyWidth,
  activeMidiTriggers = [],
  activeMidiNotes = [],
  height = 240,
  theme = 'coral',
  direction = 'rising',
  speed = 180,
  onKeyClick,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const trailsRef = useRef<TrailSegment[]>([]);
  const particlesRef = useRef<SparkleParticle[]>([]);
  const activeKeysMapRef = useRef<Map<number, string>>(new Map()); // midi -> segmentId
  const lastTimeRef = useRef<number>(performance.now());
  const animationFrameRef = useRef<number | null>(null);

  const totalWhiteKeys = octaveCount * 7;
  const canvasWidth = totalWhiteKeys * whiteKeyWidth;

  const getThemeColors = useCallback((midi: number): { fill: string; border: string; glow: string } => {
    if (theme === 'coral') {
      // Vermelho / Coral / Salmão (Estilo Milo Andreo / Synthesia)
      return {
        fill: '#f43f5e',
        border: '#fda4af',
        glow: 'rgba(244, 63, 94, 0.85)',
      };
    }

    if (theme === 'cyan') {
      return {
        fill: '#06b6d4',
        border: '#a5f3fc',
        glow: 'rgba(6, 182, 212, 0.85)',
      };
    }

    // Graus harmônicos coloridos
    const semitone = ((midi % 12) + 12) % 12;
    if (semitone === 0) {
      return { fill: '#f43f5e', border: '#fda4af', glow: 'rgba(244, 63, 94, 0.85)' }; // Tônica (Dó)
    }
    if (semitone === 4 || semitone === 3) {
      return { fill: '#06b6d4', border: '#a5f3fc', glow: 'rgba(6, 182, 212, 0.85)' }; // 3ª
    }
    if (semitone === 7) {
      return { fill: '#10b981', border: '#6ee7b7', glow: 'rgba(16, 185, 129, 0.85)' }; // 5ª
    }
    if (semitone === 11 || semitone === 10) {
      return { fill: '#a855f7', border: '#e9d5ff', glow: 'rgba(168, 85, 247, 0.85)' }; // 7ª
    }
    return { fill: '#f59e0b', border: '#fde68a', glow: 'rgba(245, 158, 11, 0.85)' };
  }, [theme]);

  // Spawn partículas de impacto no teclado
  const spawnImpactParticles = (cx: number, cy: number, color: string) => {
    for (let i = 0; i < 6; i++) {
      const angle = (Math.random() * Math.PI) + Math.PI; // Para cima
      const spd = 20 + Math.random() * 60;
      particlesRef.current.push({
        x: cx + (Math.random() * 8 - 4),
        y: cy - 2,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        radius: 1.5 + Math.random() * 2,
        alpha: 1.0,
        color,
      });
    }
  };

  // Processa gatilhos de ativação/desativação de notas
  useEffect(() => {
    if (activeMidiTriggers.length === 0) return;

    activeMidiTriggers.forEach((trigger) => {
      const geo = getKeyPosition(trigger.midi, startOctave, whiteKeyWidth, blackKeyWidth);
      if (!geo) return;

      if (trigger.isDown) {
        // Se já está ativo, não duplica
        if (activeKeysMapRef.current.has(trigger.midi)) return;

        const colors = getThemeColors(trigger.midi);
        const segmentId = `${trigger.midi}_${Date.now()}_${Math.random()}`;

        const newSegment: TrailSegment = {
          id: segmentId,
          midi: trigger.midi,
          x: geo.x,
          width: geo.width,
          startY: height,
          endY: height,
          active: true,
          color: trigger.color || colors.fill,
          borderColor: colors.border,
          glowColor: colors.glow,
          noteName: geo.noteName,
          isBlack: geo.isBlack,
        };

        trailsRef.current.push(newSegment);
        activeKeysMapRef.current.set(trigger.midi, segmentId);
        spawnImpactParticles(geo.x + geo.width / 2, height, colors.border);
      } else {
        // Nota liberada
        const segmentId = activeKeysMapRef.current.get(trigger.midi);
        if (segmentId) {
          const seg = trailsRef.current.find(s => s.id === segmentId);
          if (seg) {
            seg.active = false;
          }
          activeKeysMapRef.current.delete(trigger.midi);
        }
      }
    });
  }, [activeMidiTriggers, startOctave, whiteKeyWidth, blackKeyWidth, height, getThemeColors]);

  // Sincroniza com activeMidiNotes (array simples de notas ativas)
  useEffect(() => {
    const currentActiveSet = new Set(activeMidiNotes);

    // Notas novas que não estão mapeadas
    activeMidiNotes.forEach((midi) => {
      if (!activeKeysMapRef.current.has(midi)) {
        const geo = getKeyPosition(midi, startOctave, whiteKeyWidth, blackKeyWidth);
        if (!geo) return;

        const colors = getThemeColors(midi);
        const segmentId = `${midi}_${Date.now()}_${Math.random()}`;

        const newSegment: TrailSegment = {
          id: segmentId,
          midi,
          x: geo.x,
          width: geo.width,
          startY: height,
          endY: height,
          active: true,
          color: colors.fill,
          borderColor: colors.border,
          glowColor: colors.glow,
          noteName: geo.noteName,
          isBlack: geo.isBlack,
        };

        trailsRef.current.push(newSegment);
        activeKeysMapRef.current.set(midi, segmentId);
        spawnImpactParticles(geo.x + geo.width / 2, height, colors.border);
      }
    });

    // Notas que foram liberadas
    activeKeysMapRef.current.forEach((segmentId, midi) => {
      if (!currentActiveSet.has(midi)) {
        const seg = trailsRef.current.find(s => s.id === segmentId);
        if (seg) {
          seg.active = false;
        }
        activeKeysMapRef.current.delete(midi);
      }
    });
  }, [activeMidiNotes, startOctave, whiteKeyWidth, blackKeyWidth, height, getThemeColors]);

  // Loop de Renderização a 60 FPS
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    lastTimeRef.current = performance.now();

    const render = () => {
      const now = performance.now();
      const dt = Math.min(0.1, (now - lastTimeRef.current) / 1000);
      lastTimeRef.current = now;

      const w = canvas.width;
      const h = canvas.height;

      // 1. Limpeza do Canvas
      ctx.clearRect(0, 0, w, h);

      // Fundo Noturno Hi-Fi
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#06050b');
      bgGrad.addColorStop(0.7, '#0b0914');
      bgGrad.addColorStop(1, '#110d22');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Trilhas e Guias Verticais do Teclado (Lanes)
      for (let oct = 0; oct < octaveCount; oct++) {
        for (let noteIdx = 0; noteIdx < 7; noteIdx++) {
          const x = (oct * 7 + noteIdx) * whiteKeyWidth;

          // Linhas divisórias verticais entre teclas brancas
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }

        // Pistas das Teclas Pretas (sombreadas no fundo)
        const blackOffsets = [0, 1, 3, 4, 5];
        blackOffsets.forEach((pos) => {
          const bx = (oct * 7 + pos + 1) * whiteKeyWidth - blackKeyWidth / 2;
          ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
          ctx.fillRect(bx, 0, blackKeyWidth, h);

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
          ctx.strokeRect(bx, 0, blackKeyWidth, h);
        });
      }

      // 3. Atualiza e Renderiza os Rastros (Trails)
      const currentTrails = trailsRef.current;
      const survivingTrails: TrailSegment[] = [];

      for (let i = 0; i < currentTrails.length; i++) {
        const seg = currentTrails[i];

        if (direction === 'rising') {
          // Topo sempre sobe
          seg.startY -= speed * dt;

          // Fundo permanece ancorado no teclado se ainda estiver sendo tocado
          if (seg.active) {
            seg.endY = h;
          } else {
            seg.endY -= speed * dt;
          }

          // Descarta se subiu totalmente além do topo
          if (seg.endY <= 0) continue;
        } else {
          // Modo falling
          seg.startY += speed * dt;
          if (seg.active) {
            seg.endY = 0;
          } else {
            seg.endY += speed * dt;
          }
          if (seg.startY >= h) continue;
        }

        survivingTrails.push(seg);

        // Desenho do Rastro em Barra Arredondada
        const topY = Math.min(seg.startY, seg.endY);
        const bottomY = Math.max(seg.startY, seg.endY);
        const barHeight = Math.max(8, bottomY - topY);

        ctx.save();

        // Gradiente do Rastro (Iluminação Vertical)
        const trailGrad = ctx.createLinearGradient(0, topY, 0, bottomY);
        trailGrad.addColorStop(0, `${seg.color}cc`);   // Topo com transparência sutil
        trailGrad.addColorStop(0.7, seg.color);
        trailGrad.addColorStop(1, '#ffffff');         // Base incandescente próximo à tecla

        ctx.fillStyle = trailGrad;
        ctx.shadowColor = seg.glowColor;
        ctx.shadowBlur = seg.active ? 16 : 8;

        // Retângulo com cantos arredondados
        const radius = Math.min(6, barHeight / 2, seg.width / 2);
        ctx.beginPath();
        if (typeof (ctx as any).roundRect === 'function') {
          (ctx as any).roundRect(seg.x, topY, seg.width, barHeight, [radius, radius, radius, radius]);
        } else {
          ctx.rect(seg.x, topY, seg.width, barHeight);
        }
        ctx.fill();

        // Borda neon refinada
        ctx.strokeStyle = seg.borderColor;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Rótulo da Nota no Rastro
        if (barHeight > 24) {
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px Outfit, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowBlur = 0;
          ctx.fillText(seg.noteName, seg.x + seg.width / 2, bottomY - 14);
        }

        ctx.restore();
      }

      trailsRef.current = survivingTrails;

      // 4. Efeito de Impacto & Incandescência (Bloom Flare) nas Teclas Ativas
      activeKeysMapRef.current.forEach((_, midi) => {
        const geo = getKeyPosition(midi, startOctave, whiteKeyWidth, blackKeyWidth);
        if (!geo) return;

        const cx = geo.x + geo.width / 2;
        const cy = h;
        const colors = getThemeColors(midi);

        ctx.save();

        // Feixe de Luz Vertical Emergente
        const beamGrad = ctx.createLinearGradient(0, cy - 40, 0, cy);
        beamGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        beamGrad.addColorStop(1, `${colors.glow}`);
        ctx.fillStyle = beamGrad;
        ctx.fillRect(geo.x, cy - 40, geo.width, 40);

        // Flare Radial na Junção da Tecla
        const flare = ctx.createRadialGradient(cx, cy, 2, cx, cy, geo.width * 1.6);
        flare.addColorStop(0, '#ffffff');
        flare.addColorStop(0.3, colors.border);
        flare.addColorStop(0.7, colors.glow);
        flare.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = flare;
        ctx.beginPath();
        ctx.arc(cx, cy, geo.width * 1.6, Math.PI, Math.PI * 2); // Semicírculo para cima
        ctx.fill();

        ctx.restore();
      });

      // 5. Atualiza e Renderiza Partículas de Faíscas
      const survivingParticles: SparkleParticle[] = [];
      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.alpha -= dt * 2.2;

        if (p.alpha > 0 && p.y > 0) {
          survivingParticles.push(p);

          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
      particlesRef.current = survivingParticles;

      // 6. Linha de Ataque no Rodapé (Keyboard Line)
      ctx.save();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(0, h - 1);
      ctx.lineTo(w, h - 1);
      ctx.stroke();
      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [octaveCount, startOctave, whiteKeyWidth, blackKeyWidth, speed, direction, getThemeColors]);

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/5 shadow-2xl w-full ${className}`}>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={height}
        className="block w-full cursor-pointer select-none no-select"
        onClick={(e) => {
          if (!onKeyClick) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = (e.clientX - rect.left) * (canvasWidth / rect.width);

          // Descobre qual tecla foi clicada
          for (let oct = 0; oct < octaveCount; oct++) {
            // Checa pretas primeiro (ficam por cima)
            const blackSemis = [1, 3, 6, 8, 10];
            for (const semi of blackSemis) {
              const midi = (startOctave + oct + 1) * 12 + semi;
              const geo = getKeyPosition(midi, startOctave, whiteKeyWidth, blackKeyWidth);
              if (geo && clickX >= geo.x && clickX <= geo.x + geo.width) {
                onKeyClick(midi);
                return;
              }
            }
            // Checa brancas
            const whiteSemis = [0, 2, 4, 5, 7, 9, 11];
            for (const semi of whiteSemis) {
              const midi = (startOctave + oct + 1) * 12 + semi;
              const geo = getKeyPosition(midi, startOctave, whiteKeyWidth, blackKeyWidth);
              if (geo && clickX >= geo.x && clickX <= geo.x + geo.width) {
                onKeyClick(midi);
                return;
              }
            }
          }
        }}
      />
    </div>
  );
};
