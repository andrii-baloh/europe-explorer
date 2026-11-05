import test from 'node:test';
import assert from 'node:assert/strict';
import {serializeCourseProgress,mergeCourseProgress,COURSE_KIND,COURSE_VERSION} from '../src/courseProgress.mjs';
import fs from 'node:fs';

const known=new Set(JSON.parse(fs.readFileSync('src/fullCourse.json','utf8')).lessons.map(x=>x.id));
const current={completed:['M01-01'],notes:{'M01-01':'Мой старый вывод'}};
test('full course backup can be restored across browsers without overwriting existing notes',()=>{
 const saved={completed:['M05-01','M12-05'],notes:{'M01-01':'Do not overwrite','M05-01':'Новое наблюдение'}};
 const serialized=serializeCourseProgress(saved);
 const parsed=JSON.parse(serialized);
 assert.equal(parsed.kind,COURSE_KIND);
 assert.equal(parsed.version,COURSE_VERSION);
 const merged=mergeCourseProgress(current,parsed,known);
 assert.deepEqual(new Set(merged.completed),new Set(['M01-01','M05-01','M12-05']));
 assert.equal(merged.notes['M01-01'],'Мой старый вывод');
 assert.equal(merged.notes['M05-01'],'Новое наблюдение');
});
test('reject malformed backups without changing existing data',()=>{
 const bad=[
  null,[],{}, {kind:COURSE_KIND,version:2,completed:[],notes:{}},
  {kind:COURSE_KIND,version:1,completed:['FAKE'],notes:{}},
  {kind:COURSE_KIND,version:1,completed:[],notes:{'FAKE':'bad'}},
  {kind:COURSE_KIND,version:1,completed:[],notes:{'M01-01':'x'.repeat(1501)}},
  {kind:COURSE_KIND,version:1,completed:'M01-01',notes:{}},
 ];
 for(const x of bad) assert.throws(()=>mergeCourseProgress(current,x,known));
 assert.deepEqual(current,{completed:['M01-01'],notes:{'M01-01':'Мой старый вывод'}});
});
test('course interface exposes JSON and TXT export and import',()=>{
 const s=fs.readFileSync('src/FullCourse.tsx','utf8');
 for(const token of ['serializeCourseProgress','mergeCourseProgress','exportCourseJson','importCourseJson','course-backup-input','application/json'])assert.ok(s.includes(token),token);
});
