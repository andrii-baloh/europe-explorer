import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const src=fs.readFileSync(path.join(root,'src/courseVideos.ts'),'utf8');
const js=ts.transpileModule(src,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const compiled={exports:{}};
new Function('module','exports',js)(compiled,compiled.exports);
const videos=compiled.exports;
const course=JSON.parse(fs.readFileSync(path.join(root,'src/fullCourse.json'),'utf8'));

test('exactly 35 of 60 lessons have curated Russian and German video sources',()=>{
  let count=0;
  for(const lesson of course.lessons) {
    const r=videos.getLessonVideo(lesson.id,'ru');
    const g=videos.getLessonVideo(lesson.id,'de');
    assert.equal(Boolean(r),Boolean(g),'different language coverage in '+lesson.id);
    if(!r)continue;
    count++;
    assert.equal(r.language,'ru');
    assert.equal(g.language,'de');
    assert.ok(r.id||r.rutubeId||r.url,'Russian video missing: '+lesson.id);
    assert.ok(g.id||g.rutubeId||g.url,'German video missing: '+lesson.id);
    assert.notEqual(r.id,g.id,'Same YouTube video in both languages: '+lesson.id);
    assert.ok(r.title.length>4 && g.title.length>4);
    if(r.url) assert.match(r.url,/^https:\/\//);
  }
  assert.equal(count,35);
  assert.equal(videos.curatedVideoCountForLanguage('ru'),35);
  assert.equal(videos.curatedVideoCountForLanguage('de'),35);
});

test('all five introductory chapters have original Russian video, not German soundtrack',()=>{
  const ids=new Set();
  for(let i=0;i<5;i++){
    const item=videos.getChapterRussianVideo(i);
    assert.equal(item?.language,'ru');
    assert.match(item.id,/^[A-Za-z0-9_-]{11}$/);
    ids.add(item.id);
  }
  assert.equal(ids.size,5);
});

test('changing language swaps video sources and resets the actual embedded player',()=>{
 const full=fs.readFileSync(path.join(root,'src/FullCourse.tsx'),'utf8');
 const main=fs.readFileSync(path.join(root,'src/main.tsx'),'utf8');
 const intro=fs.readFileSync(path.join(root,'src/LessonFilm.tsx'),'utf8');
 assert.match(full,/getLessonVideo\(l\.id,lang\)/);
 assert.match(full,/key=\{\x60video-\$\{lang\}-\$\{l\.id\}\x60\}/);
 assert.match(main,/LessonFilm key=\{\x60\$\{lang\}-\$\{chapter\}\x60\}/);
 assert.match(intro,/getChapterRussianVideo\(chapter\)/);
 assert.match(intro,/lang==='ru'/);
});
