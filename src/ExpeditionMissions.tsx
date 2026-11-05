import { useState } from 'react';
import data from './expeditionMissions.json';
import course from './fullCourse.json';
import type { Lang } from './ui';
import './expeditionMissions.css';

type Pair={ru:string;de:string};
type Case={id:string;layout:string;categories:Pair[];samples:{label:Pair;answer:number}[];decision:{question:Pair;options:Pair[];answer:number;why:Pair}};
const missions=data as Case[];
const byId=new Map(missions.map(m=>[m.id,m]));
const byLesson=new Map(course.lessons.map(l=>[l.id,l]));
const local=(t:Pair,lang:Lang)=>t[lang];
const symbols:Record<string,string>={flow:'🔗',route:'🧭',compare:'🔎',network:'🕸️',balance:'⚖️',measure:'📊'};

function LessonDiagram({m,lang}:{m:Case;lang:Lang}){
 const l=byLesson.get(m.id);
 if(!l)return null;
 const icon=(i:number)=>l.visual[i]?.icon || ['📍','➡️','🏁'][i];
 const title=(i:number)=>l.visual[i]?.[lang] || local(m.categories[i],lang);
 const caption=lang==='ru'?'Учебная схема: изучи связи перед расследованием':'Lernschema: Erkenne die Zusammenhänge';
 const labels=[0,1,2].map(i=>({icon:icon(i),text:title(i)}));
 if(m.layout==='measure'&&m.id==='M03-04')return <figure className="em-figure" aria-label={caption}>
   <svg viewBox="0 0 700 270" role="img" aria-label={lang==='ru'?'Плотность = количество жителей делённое на площадь':'Dichte = Einwohner durch Fläche'} className="em-svg">
     <rect width="700" height="270" rx="20" fill="#eef7ff"/>
     <text x="350" y="38" fill="#245378" textAnchor="middle" fontWeight="800" fontSize="20">{lang==='ru'?'Число жителей ÷ площадь = плотность':'Einwohner ÷ Fläche = Bevölkerungsdichte'}</text>
     <rect x="80" y="70" width="230" height="125" rx="17" fill="#d7ebfa"/>
     <rect x="390" y="70" width="230" height="125" rx="17" fill="#dcf2dc"/>
     <text x="195" y="104" textAnchor="middle" fontWeight="900" fontSize="23" fill="#1b4c71">1200 / 1 km²</text>
     <text x="505" y="104" textAnchor="middle" fontWeight="900" fontSize="23" fill="#23634f">1200 / 12 km²</text>
     <text x="195" y="154" textAnchor="middle" fontWeight="800" fontSize="28" fill="#1b4c71">1200</text>
     <text x="505" y="154" textAnchor="middle" fontWeight="800" fontSize="28" fill="#23634f">100</text>
     <text x="350" y="237" textAnchor="middle" fill="#395f79" fontSize="18">{lang==='ru'?'Жителей на 1 км²':'Einwohner pro km²'}</text>
   </svg><figcaption>{caption}</figcaption>
 </figure>;
 if(m.layout==='measure'&&m.id==='M05-03')return <figure className="em-figure" aria-label={caption}>
   <svg viewBox="0 0 700 270" className="em-svg" role="img" aria-label={lang==='ru'?'Сравнение поездок 12 и 70 минут':'Fahrtzeiten 12 und 70 Minuten'}>
     <rect width="700" height="270" rx="20" fill="#eef7ff"/>
     <text x="45" y="48" fontSize="19" fontWeight="800" fill="#1f5779">{lang==='ru'?'Сравни доступность по времени':'Erreichbarkeit nach Zeit vergleichen'}</text>
     <text x="47" y="108" fontSize="17" fill="#1e5278">{lang==='ru'?'Школа':'Schule'}</text><rect x="165" y="81" width="110" height="36" rx="8" fill="#3e9dc7"/>
     <text x="290" y="107" fontSize="18" fill="#25547e">12 min</text>
     <text x="47" y="183" fontSize="17" fill="#1e5278">{lang==='ru'?'Врач':'Arzt'}</text><rect x="165" y="156" width="420" height="36" rx="8" fill="#f0a54f"/>
     <text x="599" y="183" fontSize="18" fill="#25547e">70 min</text>
     <text x="47" y="244" fontSize="16" fill="#42677d">{lang==='ru'?'Показаны учебные примеры, не реальное расписание':'Beispiele, kein echter Fahrplan'}</text>
   </svg><figcaption>{caption}</figcaption>
 </figure>;
 if(m.layout==='measure'&&m.id==='M10-02')return <figure className="em-figure" aria-label={caption}>
   <svg viewBox="0 0 700 270" className="em-svg" role="img" aria-label={lang==='ru'?'Погода, климат, высота — три разных понятия':'Wetter, Klima und Höhe – unterschiedliche Begriffe'}>
     <rect width="700" height="270" rx="20" fill="#eef7ff"/>
     <rect x="25" y="35" width="203" height="198" rx="15" fill="#cfe9ff"/>
     <rect x="248" y="35" width="203" height="198" rx="15" fill="#ffedc6"/>
     <rect x="471" y="35" width="204" height="198" rx="15" fill="#dceadc"/>
     {['🌦️','📅','⛰️'].map((s,i)=><text key={s} x={125+223*i} y="112" textAnchor="middle" fontSize="47">{s}</text>)}
     {(lang==='ru'?['Сегодня','За многие годы','Выше — холоднее']:['Heute','Über viele Jahre','Höher – kälter']).map((s,i)=><text key={i} x={125+223*i} y="173" textAnchor="middle" fontSize="18" fontWeight="800" fill="#294f74">{s}</text>)}
   </svg><figcaption>{caption}</figcaption>
 </figure>;
 const cls='em-scene em-'+m.layout;
 return <figure className="em-figure" aria-label={caption}>
   <div className={cls} role="img" aria-label={labels.map(x=>x.text).join(' · ')}>
     {labels.map((x,i)=><div className="em-scene-unit" key={i}>
        <span aria-hidden="true">{x.icon}</span>
        <strong>{x.text}</strong>
        {m.layout==='balance'&&<small>{local(m.categories[i],lang)}</small>}
        {(m.layout==='flow'||m.layout==='route')&&i<2&&<i className="em-scene-arrow" aria-hidden="true">→</i>}
      </div>)}
     {m.layout==='network'&&<div className="em-network-lines" aria-hidden="true">↔</div>}
   </div>
   <figcaption>{caption}</figcaption>
 </figure>;
}

export default function ExpeditionMission({id,lang,onMastered}:{id:string;lang:Lang;onMastered:()=>void}){
 const m=byId.get(id);
 const [phase,setPhase]=useState<'sort'|'decision'|'completed'>('sort');
 const [sample,setSample]=useState(0);
 const [choice,setChoice]=useState<number|null>(null);
 if(!m)return null;
 const current=m.samples[sample];
 const background=byLesson.get(id)?.[lang].concept || '';
 const expected=phase==='sort'?current.answer:m.decision.answer;
 const correct=choice!==null&&choice===expected;
 const t=(ru:string,de:string)=>lang==='ru'?ru:de;
 function next(){
   if(!correct)return;
   if(phase==='sort'){
     if(sample===2){setPhase('decision');setChoice(null);}
     else{setSample(sample+1);setChoice(null);}
   }else if(phase==='decision'){setPhase('completed');setChoice(null);onMastered();}
 }
 function restart(){setPhase('sort');setSample(0);setChoice(null);}
 return <section className="em-shell" aria-label={t('Практическая экспедиция','Praktische Expedition')}>
   <div className="em-header">
     <span className="em-heading-emoji" aria-hidden="true">{symbols[m.layout]||'🔎'}</span>
     <div><small>{t('Исследовательское задание','Forscherauftrag')} · {m.id}</small>
       <h2>{t('Проверь свои открытия','Prüfe deine Entdeckungen')}</h2>
       <p>{t('Рассмотри схему. Сопоставь три ситуации с понятиями, затем реши практическую задачу. После этого ответь на итоговый вопрос урока ниже.',
          'Untersuche das Schaubild. Ordne drei Situationen zu, löse dann die Fallfrage und beantworte anschließend die Abschlussfrage.')}</p>
     </div>
   </div>
   <LessonDiagram m={m} lang={lang}/>
   <div className="em-progress" aria-label={t('Прогресс исследования','Fortschritt')}>
     {Array.from({length:4},(_,i)=><span key={i} className={(phase==='completed'?true:phase==='decision'?i<3:i<sample)?'em-done-step':''}>
       {i+1}</span>)}
   </div>
   {phase==='completed'?<div className="em-complete" role="status">
     <h3>🏅 {t('Практика пройдена!','Praxis geschafft!')}</h3>
     <p>{t('Три примера и ситуационная задача решены. Теперь проверь итоговый вопрос урока ниже.',
        'Drei Zuordnungen und eine Fallaufgabe sind gelöst. Nun folgt die Abschlussfrage unten.')}</p>
     <button type="button" className="em-reset" onClick={restart}>{t('Повторить исследование','Erneut üben')}</button>
   </div>:<div className="em-exercise">
     <div className="em-exercise-header"><b>{phase==='sort'?t('Часть 1 · Сопоставь примеры','Teil 1 · Ordne zu'):t('Часть 2 · Прими решение','Teil 2 · Entscheide')}</b>
       <span>{phase==='sort'?sample+1:4} / 4</span></div>
     <h3>{phase==='sort'?local(current.label,lang):local(m.decision.question,lang)}</h3>
     <p className="em-instruction">{phase==='sort'?t('К какой категории относится этот пример?','Zu welcher Kategorie gehört dieses Beispiel?'):
       t('Выбери наиболее обоснованное решение.','Wähle die am besten begründete Lösung.')}</p>
     <div className="em-choice-grid">{(phase==='sort'?m.categories:m.decision.options).map((c,i)=><button type="button" key={i}
       className={choice===i?'em-selected':''} aria-pressed={choice===i} onClick={()=>setChoice(i)}>
       <span>{String.fromCharCode(65+i)}</span><strong>{local(c,lang)}</strong></button>)}</div>
     {choice!==null&&<div role="status" className={correct?'em-feedback-right':'em-feedback-wrong'}>
       <b>{correct?t('✓ Точно!','✓ Richtig!'):t('↻ Проверь рассуждение','↻ Noch einmal überlegen')}</b>
       <p>{correct?(phase==='sort'?t('Это пример категории «','Das passt zu «')+local(m.categories[current.answer],lang)+'».':
         local(m.decision.why,lang)):
         t('Подсказка из урока: ','Tipp aus der Lektion: ')+background}</p>
     </div>}
     {correct&&<button type="button" className="em-next" onClick={next}>{phase==='decision'?
       t('Завершить практику','Praxis abschließen'):t('Следующий пример','Nächstes Beispiel')} →</button>}
   </div>}
   <small className="em-note">{t('Схемы иллюстрируют понятия и не заменяют географически точные карты или измерения.',
       'Schemata veranschaulichen Begriffe und ersetzen keine präzisen Karten oder Messungen.')}</small>
 </section>;
}
