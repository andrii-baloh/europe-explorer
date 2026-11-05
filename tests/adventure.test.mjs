import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const imageNames = ['hero', 'europe', 'climate', 'farm', 'alps', 'travel'];

test('all 6 illustrated chapter assets exist and are optimized locally', () => {
  for (const name of imageNames) {
    const p = path.join(root, 'public', 'art', name + '.webp');
    assert.ok(fs.existsSync(p), `${name}.webp missing`);
    const stat = fs.statSync(p);
    assert.ok(stat.size > 40_000, `${name} suspiciously small`);
    assert.ok(stat.size < 500_000, `${name} too large for a lesson banner`);
  }
});

test('only approved illustrations, not source photographs, are deployed', () => {
  const folder = path.join(root, 'public', 'art');
  const names = fs.readdirSync(folder, { withFileTypes: true });
  assert.deepEqual(names.filter(x => x.isFile()).map(x => x.name).sort(), imageNames.map(x => x + '.webp').sort());
  assert.deepEqual(names.filter(x => x.isDirectory()).map(x => x.name), ['cards']);
  const cards = fs.readdirSync(path.join(folder, 'cards')).sort();
  assert.deepEqual(cards, ['chapter1-alps.webp', 'chapter1-map.webp', 'chapter1-route.webp']);
  for (const card of cards) {
    const size = fs.statSync(path.join(folder, 'cards', card)).size;
    assert.ok(size > 30_000 && size < 500_000, `${card} must be a real optimized illustration`);
  }
});

test('illustrated experience has all five bilingual interactive secret facts', () => {
  const s = fs.readFileSync(path.join(root, 'src', 'visuals.ts'), 'utf8');
  assert.equal((s.match(/icon:"/g) || []).length, 30); // 5 chapters x 3 facts x 2 languages
  for (const key of imageNames.filter(x => x !== 'hero')) assert.match(s, new RegExp('"' + key + '"'));
});
