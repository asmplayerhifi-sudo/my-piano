import React, { useState, useMemo } from 'react';
import { PianoKeyboard } from './PianoKeyboard';
import { ChordSelector } from './ChordSelector';
import { MicrophonePitchBar } from '../audio/MicrophonePitchBar';
import { TimbreSelector } from '../audio/TimbreSelector';
import { MetronomeBar } from '../audio/MetronomeBar';
import { buildChord, getKeyboardInversions, CHORD_QUALITIES } from '../../core/musicTheory';
import { midiManager, type MidiDevice } from '../../core/midiManager';
import type { ChordQuality } from '../../core/types';
import { useActiveNotes } from '../../hooks/useActiveNotes';
import { Music2, Cable, CheckCircle2, ChevronRight, BookOpen, Radio } from 'lucide-react';

export const PianoModule: React.FC = () => {
  const [selectedRoot, setSelectedRoot] = useState<string>('C');
  const [selectedQuality, setSelectedQuality] = useState<ChordQuality>('major');
  const [selectedInversion, setSelectedInversion] = useState<0 | 1 | 2 | 3>(0);
  const [midiDevices, setMidiDevices] = useState<MidiDevice[]>([]);
  const [micActiveMidi, setMicActiveMidi] = useState<number | null>(null);
  const [micAcousticNotes, setMicAcousticNotes] = useState<number[]>([]);

  // Fusao de todas as fontes ativas e identificacao do acorde em tempo real
  const { activeNotes: activeExternalNotes, liveChord: liveIdentifiedChord } = useActiveNotes({
    micHearingMidi: micActiveMidi,
    micAcousticNotes,
  });

  // Subscreve a dispositivos MIDI físicos conectados (USB / OTG / Bluetooth)
  React.useEffect(() => {
    const unsubscribe = midiManager.subscribeDevices((devices) => {
      setMidiDevices(devices);
    });
    return unsubscribe;
  }, []);

  // Acorde atual
  const chord = useMemo(() => {
    return buildChord(selectedRoot, selectedQuality);
  }, [selectedRoot, selectedQuality]);

  // Inversões calculadas com suporte completo a tríades e tétrades (incluindo sétimas)
  const inversions = useMemo(() => {
    return getKeyboardInversions(selectedRoot, selectedQuality);
  }, [selectedRoot, selectedQuality]);

  // Mapeamento de teclas ativas e graus para colorização no teclado
  const activeVoicing = useMemo(() => {
    if (selectedInversion === 1) return inversions.firstInversion;
    if (selectedInversion === 2) return inversions.secondInversion;
    if (selectedInversion === 3 && inversions.thirdInversion) return inversions.thirdInversion;
    return inversions.fundamental;
  }, [selectedInversion, inversions]);

  const highlightedKeys = useMemo(() => {
    return activeVoicing.midi.map((midi, idx) => ({
      midi,
      degreeName: activeVoicing.degrees[idx] || '1',
      finger: activeVoicing.fingeringRH[idx],
    }));
  }, [activeVoicing]);

  const handleSelectQuality = (quality: ChordQuality) => {
    setSelectedQuality(quality);
    if (selectedInversion === 3) {
      const isTetrad = (CHORD_QUALITIES[quality]?.intervals.length ?? 3) === 4;
      if (!isTetrad) setSelectedInversion(0);
    }
  };

  // Verifica se o acorde escutado confere com o acorde selecionado
  const isChordMatching = useMemo(() => {
    if (!liveIdentifiedChord) return false;
    return (
      liveIdentifiedChord.root.toUpperCase() === chord.root.toUpperCase() &&
      liveIdentifiedChord.quality === chord.quality
    );
  }, [liveIdentifiedChord, chord]);

  return (
    <div className="w-full space-y-6">
      {/* Header do Módulo Teclado */}
      <div className="glass-card rounded-3xl p-6 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <Music2 className="w-4 h-4" />
            <span>Módulo 3 — Mapeamento &amp; Condução de Vozes</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
            Teclado &amp; Montador de Acordes
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-4xl">
            Visualize as teclas ativas, dedilhado recomendado (1=Polegar a 5=Mínimo) e pratique a transição de inversões para economia de movimento da mão.
          </p>
        </div>

        {/* Controles do lado direito: Seletor de Timbre + Status MIDI */}
        <div className="flex items-center gap-3 flex-wrap self-start md:self-auto">
          <TimbreSelector />

          <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-black/40 border border-white/5 text-xs">
            <Cable className={`w-4 h-4 ${midiDevices.length > 0 ? 'text-emerald-400' : 'text-slate-400'}`} />
            <div>
              <div className="font-bold text-white flex items-center gap-1.5">
                <span>{midiDevices.length > 0 ? midiDevices[0].name : 'Entrada USB / Cabo MIDI'}</span>
                {midiDevices.length > 0 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <div className="text-[10px] text-slate-400">
                {midiManager.hasSupport()
                  ? midiDevices.length > 0
                    ? `${midiDevices.length} teclado(s) conectado(s) via USB/Cabo`
                    : 'Aguardando teclado USB / Cabo OTG'
                  : 'Navegador sem suporte MIDI'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visualizador de Teclado Interativo */}
      <div className="glass-card rounded-3xl p-6 border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-white/5">
          <div>
            <span className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider font-bold">
              Acorde em Exibição
            </span>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black font-display text-white">{chord.symbol}</h3>
              <span className="text-xs text-slate-400">({chord.name})</span>
            </div>
            <div className="text-xs font-mono text-slate-400 mt-1">
              Notas esperadas: <span className="text-emerald-400 font-bold">{activeVoicing.notes.join(' • ')}</span>
            </div>
          </div>

          {/* Painel do Acorde / Nota Escutada em Tempo Real */}
          <div className="p-3 rounded-2xl bg-black/40 border border-white/10 min-w-[240px]">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
                <Radio className={`w-3.5 h-3.5 ${liveIdentifiedChord ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
                <span>Escutado no Momento</span>
              </span>
              {isChordMatching && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  <span>Confere!</span>
                </span>
              )}
            </div>

            {liveIdentifiedChord ? (
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black font-display text-amber-400">
                    {liveIdentifiedChord.symbol}
                  </span>
                  <span className="text-xs text-slate-300 font-medium">
                    {liveIdentifiedChord.namePt}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Notas detectadas: <span className="text-white font-bold">{liveIdentifiedChord.notesPt.join(' • ')}</span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic py-1">
                Toque no teclado ou produza som no instrumento...
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <MetronomeBar
            title="Metrônomo do Teclado"
            initialBpm={100}
            initialTimeSignature="4/4"
          />

          <MicrophonePitchBar
            onNoteHold={(midi) => setMicActiveMidi(midi)}
            onAcousticChordNotesChange={setMicAcousticNotes}
            expectedMidi={activeVoicing.midi[0]}
            expectedNoteName={activeVoicing.notes[0]}
          />

          <PianoKeyboard
            startOctave={2}
            allowOctaveControls={true}
            highlightedKeys={highlightedKeys}
            activeExternalNotes={activeExternalNotes}
          />
        </div>
      </div>

      {/* Painel Inferior: Seletor de Acordes + Guia de Inversões */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7">
          <ChordSelector
            selectedRoot={selectedRoot}
            selectedQuality={selectedQuality}
            selectedInversion={selectedInversion}
            onSelectRoot={setSelectedRoot}
            onSelectQuality={handleSelectQuality}
            onSelectInversion={setSelectedInversion}
            activeMidiNotes={activeVoicing.midi}
          />
        </div>

        {/* Guia de Inversões & Economia de Movimento (RF03.3) */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
            <BookOpen className="w-4 h-4" />
            <span>Por que Inverter Acordes? (Voice Leading)</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Iniciantes costumam pular com a mão inteira pelo teclado ao trocar de <strong className="text-white">Dó Maior (C)</strong> para <strong className="text-white">Fá Maior (F)</strong>.
          </p>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-xs space-y-2">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>Exemplo de Encadeamento Econômico:</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-cyan-300">
              <span>C (Dó-Mi-Sol)</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              <span>F/A (Dó-Fá-Lá)</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              <span>G/B (Si-Ré-Sol)</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Observe que a nota <strong className="text-indigo-300">Dó</strong> permanece no mesmo lugar entre o acorde de C e F/A, movendo apenas os dedos 2 e 4.
            </p>
          </div>

          <div className="pt-2 border-t border-white/5">
            <h4 className="text-xs font-bold text-slate-200 mb-1.5">Dedilhados Recomendados (Mão Direita):</h4>
            <ul className="text-[11px] text-slate-400 space-y-1 font-mono">
              <li>• Fundamental: 1 (Polegar) - 3 (Médio) - 5 (Mínimo)</li>
              <li>• 1ª Inversão: 1 (Polegar) - 2 (Indicador) - 5 (Mínimo)</li>
              <li>• 2ª Inversão: 1 (Polegar) - 3 (Médio) - 5 (Mínimo)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
