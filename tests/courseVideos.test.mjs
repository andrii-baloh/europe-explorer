import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const src=fs.readFileSync(path.join(root,'src/courseVideos.ts'),'utf8');
const catalogue=JSON.parse(fs.readFileSync(path.join(root,'src/lessonVideosUnique.json'),'utf8'));
const js=ts.transpileModule(src,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const compiled={exports:{}};
new Function('module','exports','require',js)(compiled,compiled.exports,name=>{
  if(name==='./lessonVideosUnique.json')return {default:catalogue};
  throw Error('Unexpected import '+name);
});
const videos=compiled.exports;
const course=JSON.parse(fs.readFileSync(path.join(root,'src/fullCourse.json'),'utf8'));

test('all 60 lessons have same-language video sources, with no German-only extras',()=>{
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
    assert.notEqual(r.id??r.rutubeId??r.url,g.id??g.rutubeId??g.url,'Same video source in both languages: '+lesson.id);
    assert.ok(r.title.length>4 && g.title.length>4);
    if(r.url) assert.match(r.url,/^https:\/\//);
  }
  assert.equal(count,60);
  assert.equal(videos.curatedVideoCountForLanguage('ru'),60);
  assert.equal(videos.curatedVideoCountForLanguage('de'),60);
  const unique = {ru:new Set(),de:new Set()};
  for (const lesson of course.lessons) {
    for (const lang of ['ru','de']) {
      const video=videos.getLessonVideo(lesson.id,lang);
      const source=video.id ? 'https://www.youtube.com/watch?v='+video.id : video.url;
      assert.ok(source?.startsWith('https://'),lesson.id+':'+lang+' insecure or missing video URL');
      assert.ok(!unique[lang].has(source),lesson.id+':'+lang+' reused film: '+source);
      unique[lang].add(source);
    }
    assert.match(videos.getLessonVideo(lesson.id,'ru').title,/[А-Яа-яЁё]/,lesson.id+' RU clip title not Russian');
  }
  assert.equal(unique.ru.size,60);
  assert.equal(unique.de.size,60);
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
 assert.match(full,/data-material-language=\{lang\}/);
 assert.match(full,/href=\{videoSource\}/);
 assert.doesNotMatch(full,/href=\{resource\.url\}[^\n]*\{resource\.title\}/);
 assert.match(full,/key=\{\x60video-\$\{lang\}-\$\{l\.id\}\x60\}/);
 assert.match(main,/LessonFilm key=\{\x60\$\{lang\}-\$\{chapter\}\x60\}/);
 assert.match(intro,/getChapterRussianVideo\(chapter\)/);
 assert.match(intro,/lang==='ru'/);
});
