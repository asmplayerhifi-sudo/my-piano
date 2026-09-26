import { describe, it, expect } from 'vitest';
import { REPERTOIRE_SONGS, REPERTOIRE_CATEGORIES } from '../../src/core/repertoireData';

describe('Expanded Repertoire & Quality Standard', () => {
  const requestedSongs = [
    // Pink Floyd
    { id: 'comfortably-numb', title: 'Comfortably Numb', artist: 'Pink Floyd' },
    { id: 'wish-you-were-here', title: 'Wish You Were Here', artist: 'Pink Floyd' },
    { id: 'another-brick-in-the-wall-pt2', title: 'Another Brick in the Wall (Part 2)', artist: 'Pink Floyd' },
    // The Doors
    { id: 'light-my-fire', title: 'Light My Fire', artist: 'The Doors' },
    { id: 'riders-on-the-storm', title: 'Riders on the Storm', artist: 'The Doors' },
    { id: 'people-are-strange', title: 'People Are Strange', artist: 'The Doors' },
    // Bob Dylan
    { id: 'like-a-rolling-stone', title: 'Like a Rolling Stone', artist: 'Bob Dylan' },
    { id: 'knockin-on-heavens-door', title: "Knockin' on Heaven's Door", artist: 'Bob Dylan' },
    { id: 'blowin-in-the-wind', title: "Blowin' in the Wind", artist: 'Bob Dylan' },
    // Bruce Springsteen
    { id: 'born-to-run', title: 'Born to Run', artist: 'Bruce Springsteen' },
    { id: 'dancing-in-the-dark', title: 'Dancing in the Dark', artist: 'Bruce Springsteen' },
    { id: 'the-river', title: 'The River', artist: 'Bruce Springsteen' },
    // Bob Marley
    { id: 'is-this-love', title: 'Is This Love', artist: 'Bob Marley' },
    { id: 'three-little-birds', title: 'Three Little Birds', artist: 'Bob Marley' },
    { id: 'no-woman-no-cry', title: 'No Woman No Cry', artist: 'Bob Marley' },
    // Xote & Baião
    { id: 'asa-branca', title: 'Asa Branca', artist: 'Luiz Gonzaga' },
    { id: 'sabia-luiz-gonzaga', title: 'Sabiá', artist: 'Luiz Gonzaga' },
    { id: 'eu-so-quero-um-xodo', title: 'Eu Só Quero um Xodó', artist: 'Dominguinhos' },
    { id: 'riacho-do-navio', title: 'Riacho do Navio', artist: 'Luiz Gonzaga' },
    // Zezo & Seresta / Brega
    { id: 'dores-do-amor-zezo', title: 'As Dores do Amor', artist: 'Zezo' },
    { id: 'garcon-reginaldo-rossi', title: 'Garçon', artist: 'Reginaldo Rossi' },
    { id: 'a-raposa-e-as-uvas', title: 'A Raposa e as Uvas', artist: 'Reginaldo Rossi' },
    { id: 'leviana-barto-galeno', title: 'Leviana', artist: 'Bartô Galeno' },
  ];

  it('contains all 23 requested reference songs in the catalog', () => {
    for (const req of requestedSongs) {
      const found = REPERTOIRE_SONGS.find((s) => s.id === req.id);
      expect(found, `Expected song ${req.title} (${req.id}) to exist in REPERTOIRE_SONGS`).toBeDefined();
    }
  });

  it('guarantees dual-clef notation (treble and bass) for all requested scores', () => {
    for (const req of requestedSongs) {
      const song = REPERTOIRE_SONGS.find((s) => s.id === req.id)!;
      const trebleNotes = song.scoreTrack.filter((n) => n.clef === 'treble');
      const bassNotes = song.scoreTrack.filter((n) => n.clef === 'bass');

      expect(trebleNotes.length, `${song.title} must have treble clef notes`).toBeGreaterThan(0);
      expect(bassNotes.length, `${song.title} must have bass clef notes`).toBeGreaterThan(0);
    }
  });

  it('ensures pedagogical and musical quality metadata is fully present', () => {
    for (const req of requestedSongs) {
      const song = REPERTOIRE_SONGS.find((s) => s.id === req.id)!;

      expect(song.title.length).toBeGreaterThan(0);
      expect(song.composerOrArtist.length).toBeGreaterThan(0);
      expect(['Iniciante', 'Intermediário', 'Avançado']).toContain(song.difficulty);
      expect(song.recommendedBpm).toBeGreaterThan(40);
      expect(song.tonality.length).toBeGreaterThan(0);
      expect(song.timeSignature).toBeDefined();
      expect(song.chords.length).toBeGreaterThan(0);
      expect(song.description.length).toBeGreaterThan(20);
      expect(song.historicalContext.length).toBeGreaterThan(20);
      expect(song.biomechanicsTip.length).toBeGreaterThan(20);

      // Verify extension data
      expect(song.extension, `${song.title} (${song.id}) must have extension`).toBeDefined();
      expect(song.extension?.credits.composer).toBeDefined();
      expect(song.extension?.sections.length).toBeGreaterThan(0);
      expect(song.extension?.lyrics?.length).toBeGreaterThan(0);
    }
  });

  it('has consistent category coverage in REPERTOIRE_CATEGORIES', () => {
    const categoryIds = new Set(REPERTOIRE_CATEGORIES.map((c) => c.id));
    for (const song of REPERTOIRE_SONGS) {
      expect(categoryIds.has(song.genre), `Song ${song.title} has valid genre: ${song.genre}`).toBe(true);
    }
  });

  it('contém exatamente 58 obras completas no catálogo de repertório', () => {
    expect(REPERTOIRE_SONGS.length).toBe(58);
  });
});
