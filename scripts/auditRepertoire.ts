import { REPERTOIRE_SONGS, REPERTOIRE_CATEGORIES } from '../src/core/repertoireData';

console.log('=== DISTRIBUIÇÃO DETALHADA POR CATEGORIA ===\n');
for (const cat of REPERTOIRE_CATEGORIES) {
  const count = cat.id === 'Todos' ? REPERTOIRE_SONGS.length : REPERTOIRE_SONGS.filter(s => s.genre === cat.id).length;
  console.log(`• ${cat.shortLabel.padEnd(20)} | Badge: ${cat.badge.padEnd(10)} | Músicas Reais: ${count}`);
}
