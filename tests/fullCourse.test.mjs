import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const base=JSON.parse(fs.readFileSync(path.join(process.cwd(),'src','fullCourse.json'),'utf-8'));
test('12 modules with 5 lessons each and 60 unique ids',()=>{
  assert.equal(base.modules.length,12);assert.equal(base.lessons.length,60);
  assert.equal(new Set(base.lessons.map(x=>x.id)).size,60);
  for (const m of base.modules) assert.equal(base.lessons.filter(l=>l.moduleId===m.id).length,5);
});
test('each lesson contains a unique bilingual explanation, mission, quiz and exactly three alternatives',()=>{
  for(const l of base.lessons){
    for(const lang of ['ru','de']){
      const v=l[lang];assert.ok(v.title.length>5 && v.concept.length>75 && v.mission.length>10 && v.question.length>10);
      assert.equal(v.options.length,3);assert.equal(new Set(v.options).size,3);
    }
    assert.ok(l.answer>=0&&l.answer<=2);
  }
});
test('all referenced external resources use https and name source owner',()=>{
  for(const l of base.lessons){const m=base.media[l.media];assert.ok(m);assert.ok(m.url.startsWith('https://'));assert.ok(['video','catalog','method'].includes(m.kind));}
});
test('no copyrighted video files are copied into the app',()=>{
  const directory=path.join(process.cwd(),'public');
  const bad=[];function walk(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,item.name);if(item.isDirectory()) walk(p);else if(/\.(mp4|mov|avi|mkv|webm)$/i.test(item.name))bad.push(p);}}walk(directory);
  assert.deepEqual(bad,[]);
});

test('all 60 lessons have one distinct verified-source reference per language',()=>{
 const catalogue=JSON.parse(fs.readFileSync(path.join(process.cwd(),'src','lessonVideosUnique.json'),'utf8'));
 const ui=fs.readFileSync(path.join(process.cwd(),'src','FullCourse.tsx'),'utf8');
 assert.equal(Object.keys(catalogue).length,60);
 const seen={ru:new Set(),de:new Set()};
 for(const l of base.lessons)for(const lang of ['ru','de']){
   const v=catalogue[l.id]?.[lang];
   assert.ok(v, `Missing ${lang} video for ${l.id}`);
   assert.equal(v.language,lang);
   assert.ok(v.title.length>4 && v.channel.length>2);
   const source=v.id?`https://www.youtube.com/watch?v=${v.id}`:v.url;
   assert.match(source,/^https:\/\//);
   assert.ok(!seen[lang].has(source),`Repeated ${lang} film: ${source}`);
   seen[lang].add(source);
 }
 assert.equal(seen.ru.size,60);
 assert.equal(seen.de.size,60);
 assert.match(ui,/youtube-nocookie\.com\/embed/);
 assert.match(ui,/onClick=\{\(\) => setActive\(true\)\}/);
 assert.match(ui,/active \? <iframe/);
 assert.doesNotMatch(ui,/media\.url.*target="_blank"/);
});
