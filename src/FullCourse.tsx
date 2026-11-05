import { lazy, Suspense, useMemo, useState, type CSSProperties } from 'react';
import course from './fullCourse.json';
import type { Lang } from './ui';
import { getLessonVideo, type CourseVideo, curatedVideoCountForLanguage } from './courseVideos';
import { getModulePreview } from './courseModulePreviews';
import './fullCourse.css';
import MapDetective from './MapDetective';
import ExpeditionMission from './ExpeditionMissions';
import { serializeCourseProgress, mergeCourseProgress } from './courseProgress.mjs';
const ExistingEuropeMap = lazy(() => import('./MapScene'));

type Lesson = (typeof course.lessons)[number];
type Module = (typeof course.modules)[number];
type Progress = { completed: string[]; notes: Record<string, string> };
type Screen = { kind: 'index' } | { kind: 'module'; module: number } | { kind: 'lesson'; index: number };
const storageKey = 'europe-explorer-g9-course-v1';
const initialProgress = (): Progress => {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? '{}') as Partial<Progress>;
    const ids = new Set(course.lessons.map(l => l.id));
    return {
      completed: Array.isArray(saved.completed) ? [...new Set(saved.completed.filter(v => typeof v === 'string' && ids.has(v)))]: [],
      notes: saved.notes && typeof saved.notes === 'object' && !Array.isArray(saved.notes) ? saved.notes : {},
    };
  } catch { return { completed: [], notes: {} }; }
};

const words = {
  ru: {
    title: 'Большая школа исследователя', sub: '12 модулей • 60 мини-уроков • география 5–6 классов NRW',
    intro: 'Твоя географическая академия: изучи пример, реши задачу и проверь вывод. За каждое освоенное задание получай отметку в дневнике.',
    basis: 'Основано на обязательных темах Kernlehrplan Erdkunde NRW G9 для 5–6 классов. Порядок и число мини-уроков — наша учебная разработка, а не школьное расписание.',
    all: 'Ко всем модулям', start: 'Открыть модуль', steps: 'уроков', progress: 'Пройдено', next: 'Дальше', prev: 'Предыдущий',
    study: '01 • Изучи открытие', mission: '02 • Исследуй сам', quiz: '03 • Проверь понимание',
    practice: 'Миссия юного географа', quizHelp: 'Выбери один ответ. Ошибка не страшна: можно попробовать снова.',
    answer: 'Проверить ответ', correct: 'Отлично! Ты понял эту идею.', incorrect: 'Пока не совсем. Перечитай объяснение и попробуй снова.',
    earned: 'Открытие сохранено в твой прогресс!', notes: 'Мой вывод или рисунок: что я заметил?', notesHelp: 'Можно записать мысль в 1–2 предложениях или нарисовать схему на бумаге.',
    save: 'Сохранить заметку', videos: '🎬 Короткое видео по теме', original: 'Источник', external: 'Видео откроется прямо здесь. Перед загрузкой плеера ты решаешь, разрешать ли соединение с YouTube.',
    exercises: 'Вернуться к пяти интерактивным экспедициям', advance: 'Следующий урок', back: 'Вернуться к модулю',
    complete: 'Урок пройден', done: 'Освоено', choose: 'Начать урок', export: 'Скачать дневник курса', noteSaved: 'Заметка сохранена',
    explain: 'Почему так?', retry: 'Попробовать ещё раз', last: 'Ты закончил курс! Проверь знания на карте и в дневнике.',
    school: 'Для полного освоения программы нужны также атлас, наблюдения на местности и уроки в школе.',
    review: 'Найди и сравни', overview: 'Маршрут 12 экспедиций', video: '▶ Смотреть видео здесь', material: 'Материалы',
  },
  de: {
    title: 'Die große Forscherakademie', sub: '12 Module • 60 Mini-Lektionen • Erdkunde Klasse 5–6 NRW',
    intro: 'Deine Erdkunde-Akademie: Erforsche Beispiele, löse eine Aufgabe und überprüfe deine Erkenntnis. Für jede gelöste Aufgabe gibt es einen Fortschrittspunkt.',
    basis: 'Orientiert am Kernlehrplan Erdkunde NRW G9 für die Klassen 5–6. Reihenfolge und Anzahl der Mini-Lektionen sind unser Lernkonzept, kein offizieller Stundenplan.',
    all: 'Alle Module', start: 'Modul öffnen', steps: 'Lektionen', progress: 'Geschafft', next: 'Weiter', prev: 'Zurück',
    study: '01 • Entdecke die Idee', mission: '02 • Forsche selbst', quiz: '03 • Prüfe dein Wissen',
    practice: 'Auftrag für junge Forschende', quizHelp: 'Wähle eine Antwort. Fehler sind erlaubt – versuche es erneut!',
    answer: 'Antwort prüfen', correct: 'Super! Das hast du verstanden.', incorrect: 'Noch nicht ganz. Lies die Erklärung und versuche es erneut.',
    earned: 'Dein Erfolg wurde gespeichert!', notes: 'Meine Erkenntnis: Was habe ich beobachtet?', notesHelp: 'Notiere 1–2 Sätze oder zeichne eine kleine Skizze auf Papier.',
    save: 'Notiz speichern', videos: '🎬 Kurzes Video zum Thema', original: 'Quelle', external: 'Das Video wird hier abgespielt. Du entscheidest vor dem Laden, ob YouTube verbunden werden darf.',
    exercises: 'Zu den fünf interaktiven Expeditionen', advance: 'Nächste Lektion', back: 'Zurück zum Modul',
    complete: 'Lektion geschafft', done: 'Geschafft', choose: 'Lektion starten', export: 'Forschertagebuch herunterladen', noteSaved: 'Notiz gespeichert',
    explain: 'Warum?', retry: 'Erneut versuchen', last: 'Du hast den Kurs abgeschlossen! Prüfe dein Wissen mit den Karten und deinem Tagebuch.',
    school: 'Zum Erdkundeunterricht gehören auch Atlasarbeit, Erkundungen und Unterricht in der Schule.',
    review: 'Finde und vergleiche', overview: 'Deine 12 Expeditionen', video: '▶ Video hier abspielen', material: 'Material',
  }
};

function EmbeddedCourseVideo({ video, lang, poster }: { video: CourseVideo; lang: Lang; poster: string }) {
  const [active, setActive] = useState(false);
  const title = lang === 'ru' ? 'Посмотри и найди ответ' : 'Schau zu und finde die Antwort';
  const preview = lang === 'ru' ? 'Видео на русском языке' : 'Deutschsprachiges Video';
  const params = new URLSearchParams({ rel: '0', playsinline: '1', cc_lang_pref: lang });
  if (video.start !== undefined) params.set('start', String(video.start));
  if (video.end !== undefined) params.set('end', String(video.end));
  const source = video.id ? `https://www.youtube.com/watch?v=${video.id}` : video.url;
  const playerSrc = video.id ? `https://www.youtube-nocookie.com/embed/${video.id}?${params.toString()}` : video.rutubeId ? `https://rutube.ru/play/embed/${video.rutubeId}` : null;
  const platform = video.id ? 'YouTube' : video.rutubeId ? 'RUTUBE' : '';
  return <section className="course-video-panel" aria-label={title} data-video-language={lang}>
    <div className="course-video-heading"><span className="course-video-symbol">🎬</span><div>
      <span className="course-kicker">{title}</span>
      <h2>{video.title}</h2>
      <p>{preview}{video.duration ? ` · ${video.duration}` : ''}</p>
    </div></div>
    {playerSrc ?
      <div className="course-video-frame">
        {active ? <iframe
          key={`${lang}-${video.id ?? video.rutubeId}`}
          title={video.title}
          src={playerSrc}
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen referrerPolicy="strict-origin-when-cross-origin"
        /> : <div className="course-video-poster" style={{ backgroundImage: `linear-gradient(90deg, rgba(11,28,60,.72),rgba(11,28,60,.22)),url(${poster})` }}>
          <span className="course-video-play-icon" aria-hidden="true">▶</span>
          <button type="button" onClick={() => setActive(true)}>
            ▶ {lang === 'ru' ? 'Смотреть на русском' : 'Video auf Deutsch ansehen'}
          </button>
        </div>}
      </div>
    : <div className="course-external-video">
       <p>{lang==='ru' ? 'Русскоязычное видео откроется на сайте правообладателя.' : 'Das Video öffnet sich auf der Seite des Anbieters.'}</p>
       {source && <a href={source} target="_blank" rel="noopener noreferrer">{lang==='ru'?'Смотреть видео на русском':'Video ansehen'} ↗</a>}
      </div>}
    <div className="course-video-credit">
      <span>© {video.channel}{platform ? ` · ${platform}` : ''}</span>
      <span>{playerSrc
        ? (active ? (lang==='ru'?'Русскоязычный ролик воспроизводится здесь.':'Das deutsche Video läuft hier.')
          : (lang==='ru'?`${platform} подключается только после нажатия кнопки.`:`${platform} wird erst nach dem Klick verbunden.`))
        : (lang==='ru'?'Откроется внешняя видеоплатформа.':'Externe Videoplattform.')}</span>
    </div>
    {video.note&&<p className="course-video-note">{video.note}</p>}
    {playerSrc && source && <p className="course-video-source"><a href={source} target="_blank" rel="noopener noreferrer">
      {lang === 'ru' ? `Если плеер недоступен — открыть на ${platform}` : `Falls der Player nicht verfügbar ist – auf ${platform} öffnen`} ↗
    </a></p>}
  </section>;
}

function savedAsText(progress: Progress, lang: Lang): string {
  return [lang === 'ru' ? 'ЕВРОПА · ДНЕВНИК БОЛЬШОГО КУРСА' : 'EUROPA · KURSTAGEBUCH', '',
    ...(course.lessons.filter(l => progress.completed.includes(l.id)).flatMap(l => [
      `${l.id}: ${l[lang].title}`,
      progress.notes[l.id] ?? '', '',
    ])),
  ].join('\n');
}

export default function FullCourse({ lang, openOldGame }: { lang: Lang; openOldGame: () => void }) {
  const t = words[lang];
  const [screen, setScreen] = useState<Screen>({ kind: 'index' });
  const [progress, setProgress] = useState<Progress>(initialProgress);
  const [choice, setChoice] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [miniSolved, setMiniSolved] = useState(false);
  const [missionSolved, setMissionSolved] = useState(false);
  const [showExistingMap, setShowExistingMap] = useState(false);
  const [note, setNote] = useState('');
  const [showWhy, setShowWhy] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [backupNotice, setBackupNotice] = useState('');
  const completed = useMemo(() => new Set(progress.completed), [progress.completed]);
  const count = progress.completed.length;
  const image = (name: string) => `${import.meta.env.BASE_URL}art/${name}.webp`;

  function persist(next: Progress) {
    setProgress(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* private browser: keep progress in session */ }
  }
  function home() { setScreen({ kind:'index' }); window.scrollTo({top:0,behavior:'smooth'}); }
  function module(index: number) { setScreen({kind:'module',module:index}); window.scrollTo({top:0,behavior:'smooth'}); }
  function lesson(index: number) {
    setScreen({kind:'lesson',index}); setChoice(null); setChecked(false); setShowWhy(false); setMiniSolved(false); setMissionSolved(false); setShowExistingMap(false);
    setNote(progress.notes[course.lessons[index].id] ?? ''); setSavedNotice(false);
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function submit(l: Lesson) {
    if (choice === null) return;
    setChecked(true);
    if (choice === l.answer && (l.moduleId === 'M01' ? miniSolved : missionSolved) && !completed.has(l.id)) persist({...progress,completed:[...progress.completed,l.id]});
  }
  function completeMini(l: Lesson) {
    setMiniSolved(true);
    if (checked && choice === l.answer && !completed.has(l.id)) persist({...progress,completed:[...progress.completed,l.id]});
  }
  function completeMission(l: Lesson) {
    setMissionSolved(true);
    if (checked && choice === l.answer && !completed.has(l.id)) persist({...progress,completed:[...progress.completed,l.id]});
  }
  function saveNote(l: Lesson) { persist({...progress,notes:{...progress.notes,[l.id]: note.slice(0,1500)}}); setSavedNotice(true); }
  function exportCourseJson() {
    const content=serializeCourseProgress(progress);
    const url=URL.createObjectURL(new Blob([content],{type:'application/json;charset=utf-8'}));
    const link=document.createElement('a');link.href=url;link.download='europe-explorer-60-progress.json';link.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    setBackupNotice(lang==='ru'?'Резервная копия курса сохранена':'Kurssicherung gespeichert');
  }
  async function importCourseJson(file: File) {
    try {
      if(file.size>1024*1024)throw Error('File too large');
      const input=JSON.parse(await file.text());
      const known=new Set(course.lessons.map(l=>l.id));
      const merged=mergeCourseProgress(progress,input,known);
      persist(merged);
      setBackupNotice(lang==='ru'?'Прогресс и заметки успешно восстановлены без удаления существующих данных.':'Fortschritt und Notizen wurden ohne Verlust der bisherigen Daten zusammengeführt.');
    } catch {
      setBackupNotice(lang==='ru'?'Файл не подходит: проверь формат JSON резервной копии курса. Существующий прогресс сохранён.':'Ungültige JSON-Kurssicherung. Dein bisheriger Fortschritt bleibt erhalten.');
    }
  }
  function exportNotes() {
    const content = savedAsText(progress,lang);
    const url=URL.createObjectURL(new Blob([content],{type:'text/plain;charset=utf-8'}));
    const link=document.createElement('a');link.href=url;link.download='europe-explorer-course.txt';link.click();
    setTimeout(()=>URL.revokeObjectURL(url),500);
  }

  return <section className="course-shell" aria-label={t.title}>
    {screen.kind === 'index' ? <>
      <header className="course-hero">
        <div className="course-hero-art" aria-hidden="true"><img src={image('hero')} alt="" /></div>
        <div className="course-hero-copy"><div className="course-kicker">🌟 EUROPE EXPLORER · NRW G9</div>
          <h1>{t.title}</h1><p className="course-lead">{t.sub}</p><p>{t.intro}</p>
          <div className="course-counter"><span>🏅</span><div><b>{count} / 60</b><small>{t.progress}</small></div><progress value={count} max={60}/></div>
        </div>
      </header>
      <div className="course-notice">📘 {t.basis}<p className="course-video-coverage">{lang === "ru" ? `🎬 Видео подобраны для ${curatedVideoCountForLanguage(lang)} из 60 уроков; в остальных доступны учебные материалы и задания. Некоторые видеоролики повторяются в близких темах.` : `🎬 Videos sind ${curatedVideoCountForLanguage(lang)} der 60 Lektionen zugeordnet; die anderen bieten Lernmaterial und Aufgaben. Manche Videos werden für verwandte Themen wiederverwendet.`}</p></div>
      <div className="course-section-header"><h2>{t.overview}</h2>
        <div className="course-backup-actions">
          <button className="course-outline-button" type="button" onClick={exportNotes}>📒 {t.export} (TXT)</button>
          <button className="course-outline-button" type="button" onClick={exportCourseJson}>💾 {lang==='ru'?'Сохранить прогресс (JSON)':'Fortschritt sichern (JSON)'}</button>
          <label className="course-import-label" htmlFor="course-backup-input">{lang==='ru'?'Восстановить из JSON':'JSON-Sicherung laden'}</label>
          <input id="course-backup-input" className="course-import-input" type="file" accept=".json,application/json"
            aria-label={lang==='ru'?'Выбрать JSON для восстановления':'JSON-Sicherung auswählen'}
            onChange={e=>{const f=e.currentTarget.files?.[0];if(f)void importCourseJson(f);e.currentTarget.value='';}} />
        </div>
      </div>
      {backupNotice && <p className="course-backup-notice" role="status">{backupNotice}</p>}
      <div className="course-modules">{course.modules.map((m,i) => {
        const doneCount=course.lessons.filter(l=>l.moduleId===m.id&&completed.has(l.id)).length;
        return <button className="course-module" key={m.id} onClick={()=>module(i)} style={{'--accent':m.color} as CSSProperties}>
          <div className="course-module-art"><div className="course-module-stages" role="img" aria-label={getModulePreview(m.id,lang).map(v=>v.text).join(" → ")}>{getModulePreview(m.id,lang).map((v,j)=><div className="course-module-stage" key={j}><span aria-hidden="true">{v.icon}</span><strong>{v.text}</strong></div>)}</div><span>{m.icon}</span><b>{m.id}</b></div>
          <div className="course-module-copy"><small>NRW {m.area} · {doneCount}/5</small>
            <strong>{m.title[lang]}</strong><p>{m.intro[lang]}</p>
            <div className="course-progress"><span style={{width:`${doneCount*20}%`}}/></div>
            <em>{t.start} →</em>
          </div>
        </button>;
      })}</div>
      <div className="course-footer-note">{t.school} <button onClick={openOldGame}>{t.exercises} ↗</button></div>
    </> : screen.kind === 'module' ? (() => {
      const m: Module=course.modules[screen.module];
      const items=course.lessons.filter(l=>l.moduleId===m.id);
      const doneCount=items.filter(l=>completed.has(l.id)).length;
      return <>
        <button className="course-link-back" onClick={home}>← {t.all}</button>
        <div className="course-module-header" style={{'--accent':m.color} as CSSProperties}>
          <img src={image(m.image)} alt=""/><div><small>{m.id} · NRW {m.area}</small><h1>{m.icon} {m.title[lang]}</h1><p>{m.intro[lang]}</p>
            <span className="course-module-count">🏅 {doneCount} / 5 {t.done}</span></div>
        </div>
        <div className="course-lessons-list">{items.map((l,i)=><button className="course-lesson-row" key={l.id} onClick={()=>lesson(l.index)}>
          <span className={`course-lesson-number ${completed.has(l.id)?'complete':''}`}>{completed.has(l.id)?'✓':String(i+1).padStart(2,'0')}</span>
          <span><small>{l.id} · {t.mission}</small><strong>{l[lang].title}</strong><p>{l[lang].concept.split(/[.!?]/)[0]}.</p></span>
          <b aria-hidden="true">→</b>
        </button>)}</div>
        <div className="course-mod-footer"><button className="course-outline-button" onClick={()=>module(Math.max(0,screen.module-1))} disabled={screen.module===0}>← {t.prev}</button>
          <button className="course-primary-button" onClick={()=>module(Math.min(11,screen.module+1))} disabled={screen.module===11}>{t.next} →</button></div>
      </>;
    })() : (() => {
      const l=course.lessons[screen.index];
      const m=course.modules[Math.floor(screen.index/5)];
      const ll=l[lang];
      const video = getLessonVideo(l.id,lang);
      const resource = course.media[l.media as keyof typeof course.media];
      const isCorrect=checked&&choice===l.answer;
      return <>
        <button className="course-link-back" onClick={()=>module(Math.floor(screen.index/5))}>← {t.back}</button>
        <div className="course-lesson-hero" style={{'--accent':m.color} as CSSProperties}>
          <div><span>🧩 {l.id} · {m.title[lang]}</span><h1>{ll.title}</h1><p>{t.study} · {t.mission} · {t.quiz}</p></div>
          <span className="course-large-icon" aria-hidden="true">{m.icon}</span>
        </div>
        <div className="course-learning-grid"><div className="course-concept-card"><h2>🔎 {t.study}</h2><p>{ll.concept}</p>
          <div className="course-explainer-visual" role="img" aria-label={l.visual.map(v=>v[lang]).join(' → ')}>
            {l.visual.map((v,j)=><div key={`${l.id}-visual-${j}`} className="course-visual-stage">
              <span aria-hidden="true">{v.icon}</span><strong>{v[lang]}</strong>{j<2&&<i aria-hidden="true">→</i>}
            </div>)}
          </div></div>
          <div className="course-mission-card"><h2>🧭 {t.mission}</h2><p>{ll.mission}</p><div className="course-action-note">📝 {t.notesHelp}</div></div></div>
        {l.moduleId === 'M01' && <>
          <MapDetective key={l.id} lessonIndex={l.index} lang={lang} onMastered={() => completeMini(l)} />
          <section className="course-map-reuse">
            <button type="button" onClick={() => setShowExistingMap(v => !v)}>
              🗺️ {lang === 'ru' ? (showExistingMap ? 'Свернуть карту Европы' : 'Открыть настоящую интерактивную карту Европы') : (showExistingMap ? 'Europakarte schließen' : 'Interaktive Europakarte öffnen')}
            </button>
            {showExistingMap && <div><Suspense fallback={<p>…</p>}><ExistingEuropeMap lang={lang} /></Suspense></div>}
          </section>
        </>}
        {l.moduleId !== 'M01' && <ExpeditionMission key={`mission-${l.id}`} id={l.id} lang={lang} onMastered={() => completeMission(l)} />}
        {video && <EmbeddedCourseVideo key={`video-${lang}-${l.id}`} video={video} lang={lang} poster={image(m.image)} />}
        {resource && <section className="course-source-panel" aria-label={t.material}>
          <div><b>📚 {t.material}</b><p>{lang === 'ru' ? resource.noteRu : resource.noteDe}</p></div>
          <a href={resource.url} rel="noopener noreferrer" target="_blank">{resource.title} ↗</a>
        </section>}
        <section className="course-quiz" aria-labelledby="quiz-head">
          <div className="course-quiz-head"><small>🎯 {t.quiz}</small><h2 id="quiz-head">{ll.question}</h2><p>{t.quizHelp}</p></div>
          <div className="course-answers">{ll.options.map((op,j) =>
            <button key={j} className={`${choice===j?'selected':''} ${checked && choice===j ? (isCorrect?'correct':'incorrect'):''}`}
              onClick={()=>{setChoice(j);setChecked(false);setShowWhy(false)}} aria-pressed={choice===j}>
              <span>{String.fromCharCode(65+j)}</span>{op}{checked&&choice===j?<b>{isCorrect?'✓':'×'}</b>:null}
            </button>)}</div>
          {!checked ? <button className="course-primary-button" disabled={choice===null} onClick={()=>submit(l)}>{t.answer} →</button> :
            <div className={`course-answer-feedback ${isCorrect?'right':'wrong'}`} role="status"><strong>{isCorrect?'✅ '+t.correct:'💡 '+t.incorrect}</strong>
              {isCorrect ? <p>{(l.moduleId === 'M01' ? !miniSolved : !missionSolved)
                 ? (l.moduleId === 'M01'
                  ? (lang === 'ru' ? 'Верно! Теперь реши три задачи расследования выше, чтобы завершить урок.' : 'Richtig! Löse jetzt die drei Ermittlungsaufgaben oben, um die Lektion abzuschließen.')
                  : (lang === 'ru' ? 'Верно! Теперь заверши четыре шага практической экспедиции выше.' : 'Richtig! Schließe nun die vier Schritte der Expedition oben ab.'))
                 : t.earned}</p> : <button onClick={()=>setShowWhy(!showWhy)}>{t.explain} {showWhy?'−':'+'}</button>}
              {showWhy && <p>{ll.concept}</p>}
              {!isCorrect && <button className="course-outline-button" onClick={()=>{setChoice(null);setChecked(false);setShowWhy(false)}}>{t.retry}</button>}
            </div>}
        </section>
        <div className="course-notebook"><h2>📒 {t.notes}</h2><textarea rows={3} value={note} maxLength={1500} onChange={e=>{setNote(e.target.value);setSavedNotice(false)}} placeholder={t.notesHelp}/>
          <button className="course-outline-button" onClick={()=>saveNote(l)}>{t.save}</button>{savedNotice&&<span>✓ {t.noteSaved}</span>}
        </div>
        <div className="course-mod-footer"><button className="course-outline-button" onClick={()=>lesson(Math.max(0,screen.index-1))} disabled={screen.index===0}>← {t.prev}</button>
          <button className="course-primary-button" onClick={()=>screen.index===59?home():lesson(screen.index+1)}>{screen.index===59?t.last:t.advance} →</button></div>
      </>;
    })()}
  </section>;
}
