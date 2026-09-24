/**
 * scoreBeaming.ts
 * Algoritmo universal de agrupamento de figuras rítmicas (Beaming / União de Hastes).
 * Regras: Notação musical formal (Behind Bars / Gardner Read).
 * Agrupa colcheias (dur <= 0.5) e semicolcheias (dur <= 0.25) dentro do mesmo compasso e tempo.
 */

export interface BeamCandidate {
  id?: string;
  x: number;
  y: number;
  duration: number; // 0.5 = colcheia, 0.25 = semicolcheia
  beat: number;     // beat position
  clef: 'treble' | 'bass';
  color?: string;
  alpha?: number;
}

export interface BeamStem {
  x: number;
  yStart: number;
  yEnd: number;
  duration: number;
  color?: string;
  alpha?: number;
}

export interface BeamSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  thickness: number;
}

export interface BeamGroup {
  isBeamed: boolean;
  isUp: boolean;
  stems: BeamStem[];
  primaryBeam?: BeamSegment;
  secondaryBeams?: BeamSegment[];
  isolatedFlag?: {
    stemX: number;
    stemYEnd: number;
    isUp: boolean;
    duration: number;
    color?: string;
  };
}

export interface BeamingOptions {
  getMiddleLineY: (clef: 'treble' | 'bass') => number;
  stemOffset: number;
  minStemLength: number;
  beamThickness: number;
  beatsPerMeasure?: number;
}

/**
 * Agrupa notas contíguas que admitem barras de união (beaming).
 */
export function buildBeamGroups(
  candidates: BeamCandidate[],
  options: BeamingOptions
): BeamGroup[] {
  const beatsPerM = options.beatsPerMeasure || 4;
  const groups: BeamGroup[] = [];

  // Ordena candidatos por beat e posição X
  const sorted = [...candidates].sort((a, b) => {
    if (Math.abs(a.beat - b.beat) > 0.001) return a.beat - b.beat;
    return a.x - b.x;
  });

  let currentChunk: BeamCandidate[] = [];

  const finalizeChunk = (chunk: BeamCandidate[]) => {
    if (chunk.length === 0) return;

    if (chunk.length === 1) {
      // Nota isolada com bandeirola clássica
      const note = chunk[0];
      const midY = options.getMiddleLineY(note.clef);
      const isUp = note.y >= midY;
      const stemX = isUp ? note.x + options.stemOffset : note.x - options.stemOffset;
      const stemYEnd = isUp ? note.y - options.minStemLength : note.y + options.minStemLength;

      groups.push({
        isBeamed: false,
        isUp,
        stems: [{
          x: stemX,
          yStart: note.y,
          yEnd: stemYEnd,
          duration: note.duration,
          color: note.color,
          alpha: note.alpha,
        }],
        isolatedFlag: {
          stemX,
          stemYEnd,
          isUp,
          duration: note.duration,
          color: note.color,
        },
      });
      return;
    }

    // Grupo de 2 ou mais notas agrupadas por Barra de União (Beam)
    const midY = options.getMiddleLineY(chunk[0].clef);
    let maxDist = -1;
    let dominantIsUp = true;
    for (const n of chunk) {
      const dist = Math.abs(n.y - midY);
      if (dist > maxDist) {
        maxDist = dist;
        dominantIsUp = n.y >= midY;
      }
    }
    const isUp = dominantIsUp;

    const first = chunk[0];
    const last = chunk[chunk.length - 1];
    const stemX0 = isUp ? first.x + options.stemOffset : first.x - options.stemOffset;
    const stemXLast = isUp ? last.x + options.stemOffset : last.x - options.stemOffset;
    const dx = stemXLast - stemX0;

    let slope = dx > 0 ? (last.y - first.y) / dx : 0;
    // Limita inclinação da barra para estética refinada
    slope = Math.max(-0.25, Math.min(0.25, slope));

    // Determina altura da barra garantindo haste mínima para todas as notas do grupo
    let yBeam0 = isUp ? Infinity : -Infinity;
    const stemPositions: { stemX: number; note: BeamCandidate }[] = [];

    for (const n of chunk) {
      const sX = isUp ? n.x + options.stemOffset : n.x - options.stemOffset;
      stemPositions.push({ stemX: sX, note: n });
      const reqY = isUp
        ? n.y - options.minStemLength - slope * (sX - stemX0)
        : n.y + options.minStemLength - slope * (sX - stemX0);

      if (isUp) {
        if (reqY < yBeam0) yBeam0 = reqY;
      } else {
        if (reqY > yBeam0) yBeam0 = reqY;
      }
    }

    const stems: BeamStem[] = stemPositions.map(({ stemX, note }) => {
      const yEnd = yBeam0 + slope * (stemX - stemX0);
      return {
        x: stemX,
        yStart: note.y,
        yEnd,
        duration: note.duration,
        color: note.color,
        alpha: note.alpha,
      };
    });

    const primaryBeam: BeamSegment = {
      x1: stemX0,
      y1: yBeam0,
      x2: stemXLast,
      y2: yBeam0 + slope * (stemXLast - stemX0),
      thickness: options.beamThickness,
    };

    // Sub-barras para semicolcheias (dur <= 0.25)
    const secondaryBeams: BeamSegment[] = [];
    const secOffset = isUp ? options.beamThickness + 3.2 : -(options.beamThickness + 3.2);

    let secStartIdx: number | null = null;
    for (let i = 0; i < chunk.length; i++) {
      if (chunk[i].duration <= 0.25) {
        if (secStartIdx === null) secStartIdx = i;
      } else {
        if (secStartIdx !== null) {
          const startX = stemPositions[secStartIdx].stemX;
          const endX = i - 1 === secStartIdx
            ? startX + (secStartIdx === 0 ? 10 : -10)
            : stemPositions[i - 1].stemX;
          secondaryBeams.push({
            x1: Math.min(startX, endX),
            y1: (yBeam0 + slope * (Math.min(startX, endX) - stemX0)) + secOffset,
            x2: Math.max(startX, endX),
            y2: (yBeam0 + slope * (Math.max(startX, endX) - stemX0)) + secOffset,
            thickness: options.beamThickness,
          });
          secStartIdx = null;
        }
      }
    }

    if (secStartIdx !== null) {
      const startX = stemPositions[secStartIdx].stemX;
      const endX = chunk.length - 1 === secStartIdx
        ? startX + (secStartIdx === 0 ? 10 : -10)
        : stemPositions[chunk.length - 1].stemX;
      secondaryBeams.push({
        x1: Math.min(startX, endX),
        y1: (yBeam0 + slope * (Math.min(startX, endX) - stemX0)) + secOffset,
        x2: Math.max(startX, endX),
        y2: (yBeam0 + slope * (Math.max(startX, endX) - stemX0)) + secOffset,
        thickness: options.beamThickness,
      });
    }

    groups.push({
      isBeamed: true,
      isUp,
      stems,
      primaryBeam,
      secondaryBeams: secondaryBeams.length > 0 ? secondaryBeams : undefined,
    });
  };

  for (let i = 0; i < sorted.length; i++) {
    const note = sorted[i];

    // Figuras não agrupáveis (semibreves, mínimas, semínimas) quebram o grupo
    if (note.duration > 0.75) {
      finalizeChunk(currentChunk);
      currentChunk = [];
      continue;
    }

    if (currentChunk.length === 0) {
      currentChunk.push(note);
      continue;
    }

    const prev = currentChunk[currentChunk.length - 1];

    // Condições de continuação do grupo:
    // 1. Mesma clave
    const sameClef = note.clef === prev.clef;
    // 2. Mesmo compasso
    const sameMeasure = Math.floor(note.beat / beatsPerM) === Math.floor(prev.beat / beatsPerM);
    // 3. Mesma metade de compasso em métrica quaternária (limite de 2 tempos para não cruzar o meio do compasso)
    const sameBeatGroup = beatsPerM === 4
      ? Math.floor((note.beat % 4) / 2) === Math.floor((prev.beat % 4) / 2)
      : (beatsPerM === 3 ? Math.floor(note.beat) === Math.floor(prev.beat) : true);
    // 4. Máximo de 4 figuras por grupo
    const withinLimit = currentChunk.length < 4;
    // 5. Continuidade temporal imediata
    const gap = note.beat - (prev.beat + prev.duration);
    const isContiguous = gap >= -0.05 && gap <= 0.05;

    if (sameClef && sameMeasure && sameBeatGroup && withinLimit && isContiguous) {
      currentChunk.push(note);
    } else {
      finalizeChunk(currentChunk);
      currentChunk = [note];
    }
  }

  finalizeChunk(currentChunk);
  return groups;
}

/**
 * Renderiza um grupo de hastes e barras no Canvas 2D.
 */
export function renderBeamGroup(
  ctx: CanvasRenderingContext2D,
  group: BeamGroup,
  defaultColor: string,
  stemWidth = 1.8
): void {
  // 1. Hastes
  for (const stem of group.stems) {
    ctx.save();
    if (stem.alpha !== undefined) ctx.globalAlpha = stem.alpha;
    ctx.strokeStyle = stem.color || defaultColor;
    ctx.lineWidth = stemWidth;
    ctx.beginPath();
    ctx.moveTo(stem.x, stem.yStart);
    ctx.lineTo(stem.x, stem.yEnd);
    ctx.stroke();
    ctx.restore();
  }

  // 2. Barra de união principal (se agrupado)
  if (group.isBeamed && group.primaryBeam) {
    const b = group.primaryBeam;
    const dy = group.isUp ? b.thickness : -b.thickness;
    ctx.save();
    ctx.fillStyle = defaultColor;
    ctx.beginPath();
    ctx.moveTo(b.x1, b.y1);
    ctx.lineTo(b.x2, b.y2);
    ctx.lineTo(b.x2, b.y2 + dy);
    ctx.lineTo(b.x1, b.y1 + dy);
    ctx.closePath();
    ctx.fill();

    // Sub-barras (semicolcheias)
    if (group.secondaryBeams) {
      for (const sb of group.secondaryBeams) {
        const sdy = group.isUp ? sb.thickness : -sb.thickness;
        ctx.beginPath();
        ctx.moveTo(sb.x1, sb.y1);
        ctx.lineTo(sb.x2, sb.y2);
        ctx.lineTo(sb.x2, sb.y2 + sdy);
        ctx.lineTo(sb.x1, sb.y1 + sdy);
        ctx.closePath();
        ctx.fill();
      }
    }
    ctx.restore();
  }

  // 3. Bandeirola individual (se nota isolada)
  if (!group.isBeamed && group.isolatedFlag) {
    const f = group.isolatedFlag;
    ctx.save();
    ctx.strokeStyle = f.color || defaultColor;
    ctx.lineWidth = stemWidth;
    const dir = f.isUp ? 1 : -1;

    ctx.beginPath();
    ctx.moveTo(f.stemX, f.stemYEnd);
    ctx.quadraticCurveTo(f.stemX + 8, f.stemYEnd + 10 * dir, f.stemX + 2, f.stemYEnd + 18 * dir);
    ctx.stroke();

    if (f.duration <= 0.25) {
      ctx.beginPath();
      ctx.moveTo(f.stemX, f.stemYEnd + 6 * dir);
      ctx.quadraticCurveTo(f.stemX + 8, f.stemYEnd + 16 * dir, f.stemX + 2, f.stemYEnd + 24 * dir);
      ctx.stroke();
    }
    ctx.restore();
  }
}
