import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const base=process.cwd();
const component=fs.readFileSync(base+'/src/MapDetective.tsx','utf8');
const course=fs.readFileSync(base+'/src/FullCourse.tsx','utf8');
const css=fs.readFileSync(base+'/src/mapDetective.css','utf8');
const lessons=JSON.parse(fs.readFileSync(base+'/src/fullCourse.json','utf8')).lessons;

test('all five map lessons have a three-stage visual investigation and bilingual content',()=>{
  assert.equal((component.match(/name: t\('Расследование/g)||[]).length,5);
  assert.equal((component.match(/\bq\(t\(/g)||[]).length,15);
  assert.match(component,/lang==='ru'/);
  assert.match(component,/function Drawing/);
  assert.match(css,/md-atlas/);
  for(let i=0;i<5;i++) assert.equal(lessons[i].moduleId,'M01');
});

test('scales and plan squares match the teaching tasks',()=>{
  for(const scale of ['1 : 100 000','1 : 200 000','1 : 50 000']) assert.ok(component.includes(scale));
  assert.match(component,/\{5:'🏫',11:'🌳',12:'🌉'\}/);
  assert.match(component,/\['A','B','C','D'\]|'ABCD'/);
  for(const distance of ['3 км','4 км','2 км']) assert.ok(component.includes(distance));
});

test('old course is preserved and map investigations gate completion',()=>{
  assert.match(course,/ExistingEuropeMap = lazy/);
  assert.match(course,/MapDetective key=\{l.id\}/);
  assert.match(course,/l\.moduleId === 'M01' \? miniSolved : missionSolved/);
  assert.match(course,/function completeMini/);
  assert.match(component,/onMastered\(\)/);
  assert.match(course,/EmbeddedCourseVideo/);
});
