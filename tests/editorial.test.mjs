import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const data = JSON.parse(readFileSync(new URL('../src/editorial.json', import.meta.url), 'utf8'));
const ids = ['map','climate','farm','alps','transport'];
const keys = ['title','subtitle','hook','goal','explanations','activities','checkpoint','terms','takeaway','bridge'];

test('both languages have the same five chapters and complete learning content', () => {
  for (const lang of ['ru','de']) {
    assert.deepEqual(data[lang].chapters.map(x=>x.id),ids);
    assert.ok(data[lang].homepage.story.length > 100);
    for (const chapter of data[lang].chapters) {
      for (const k of keys) assert.ok(chapter[k], `${lang}/${chapter.id}: ${k} missing`);
      assert.ok(chapter.explanations.length >= 3);
      assert.equal(chapter.activities.length,3);
      assert.ok(chapter.terms.length >= 3);
      for (const ex of chapter.explanations) assert.ok(ex.title && ex.text.length > 40);
      for (const a of chapter.activities) for (const k of ['prompt','hint','success','retry']) assert.ok(a[k]?.length > 10);
      for (const k of ['question','answer','explain']) assert.ok(chapter.checkpoint[k]?.length > 10);
    }
  }
});
test('interactive descriptions correspond to the unchanged games', () => {
  for (const lang of ['ru','de']) {
    const chapters = data[lang].chapters;
    const farm = chapters[2].activities.map(x=>x.prompt).join(' ');
    const alps = chapters[3].activities.map(x=>x.prompt).join(' ');
    const transport = chapters[4].activities.map(x=>x.prompt).join(' ');
    assert.match(farm,/полив|Beregnung|Bewässerung/);
    assert.match(alps,/2000/);
    assert.match(transport,/Роттердам|Rotterdam/);
    assert.match(transport,/500/);
  }
});
