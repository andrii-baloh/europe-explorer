import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const all=JSON.parse(fs.readFileSync('src/expeditionMissions.json','utf8'));
const course=JSON.parse(fs.readFileSync('src/fullCourse.json','utf8'));
const ui=fs.readFileSync('src/ExpeditionMissions.tsx','utf8');
const main=fs.readFileSync('src/FullCourse.tsx','utf8');

test('all remaining 55 lessons have authored case studies and bilingual specific explanations',()=>{
  assert.equal(all.length,55);
  const known=course.lessons.slice(5).map(x=>x.id);
  assert.deepEqual(all.map(x=>x.id),known);
  assert.equal(new Set(all.map(x=>x.id)).size,55);
  for(const m of all){
    assert.equal(m.categories.length,3,m.id);
    assert.equal(m.samples.length,3,m.id);
    assert.equal(m.decision.options.length,3,m.id);
    assert.ok(m.decision.answer>=0&&m.decision.answer<3,m.id);
    assert.deepEqual(m.samples.map(s=>s.answer).sort(),[0,1,2],m.id);
    for(const v of [...m.categories,...m.samples.map(x=>x.label),m.decision.question,...m.decision.options,m.decision.why])
      for(const lang of ['ru','de']) assert.ok(v[lang]?.length>=3,m.id+' '+lang);
    assert.ok(m.decision.question.ru.length>30,m.id);
    assert.ok(m.decision.why.ru.length>30,m.id);
    assert.equal(new Set(m.decision.options.map(x=>x.ru)).size,3,m.id);
    assert.equal(new Set(m.categories.map(x=>x.de)).size,3,m.id);
  }
});
test('55 genuine situational questions are not copies of original checkpoint questions',()=>{
  const old=new Map(course.lessons.map(l=>[l.id,l]));
  for(const m of all){
    assert.notEqual(m.decision.question.ru.trim(),old.get(m.id).ru.question.trim(),m.id);
    assert.notEqual(m.decision.question.de.trim(),old.get(m.id).de.question.trim(),m.id);
  }
});
test('scenarios are visualized using 6 semantic diagram types',()=>{
  const css=fs.readFileSync('src/expeditionMissions.css','utf8');
  const kinds=new Set(all.map(m=>m.layout));
  assert.deepEqual([...kinds].sort(),['balance','compare','flow','measure','network','route']);
  for(const k of kinds) k==='measure' ? assert.match(ui,/m.layout==='measure'/) : assert.match(css,new RegExp('\\.em-'+k));
  for(const v of ['M03-04','M05-03','M10-02']) assert.ok(ui.includes(v));
});
test('practice cannot award progress before all exercises and the checkpoint',()=>{
  assert.match(ui,/phase==='decision'/);
  assert.match(ui,/onMastered\(\)/);
  assert.match(main,/l\.moduleId === 'M01' \? miniSolved : missionSolved/);
  assert.match(main,/l\.moduleId !== 'M01' && <ExpeditionMission key=\{`mission-/);
  assert.match(main,/function completeMission/);
});
test('all old scenes, diary, course videos and no tracking survive',()=>{
  for(const feature of ['EmbeddedCourseVideo','MapDetective','ExistingEuropeMap','saveNote','exportNotes']) assert.ok(main.includes(feature));
  assert.doesNotMatch(ui,/analytics\.google|gtag|facebook\.com\/tr/);
});

test('video and advanced exercise do not share a React sibling key',()=>{
  assert.match(main,/ExpeditionMission key=\{\`mission-\$\{l\.id\}\`\}/);
  assert.match(main,/EmbeddedCourseVideo key=\{\`video-\$\{lang\}-\$\{l\.id\}\`\}/);
});
