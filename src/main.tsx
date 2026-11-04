import React, { lazy, Suspense, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { lessons } from "./content";
import editorialData from "./editorial.json";
import { key, validateDiary, mergeDiaries } from "./model.mjs";
import { type Lang, labels, t } from "./ui";
import { chapterArt, chapterSymbols, chapterFacts, stepSymbols } from "./visuals";
import "./style.css";
import "./adventure.css";

const MapScene = lazy(() => import("./MapScene"));
const ClimateScene = lazy(() => import("./ClimateScene"));
const Farm = lazy(() => import("./Scenes").then((m) => ({ default: m.Farm })));
const Alps = lazy(() => import("./Scenes").then((m) => ({ default: m.Alps })));
const Travel = lazy(() => import("./Scenes").then((m) => ({ default: m.Travel })));
const editorial = editorialData;
function feedbackExplanation(text: string) {
  return text.replace(/^(?:Верно|Точно|Именно так|Молодец|Отлично|Richtig|Genau|Sehr gut|Gut beobachtet|Хорошее наблюдение|Удачное решение)[.!:]?\s*/i, "");
}
type Entry = { chapter: number; text: string; date: string };
type Diary = { version: number; entries: Entry[] };
let storageWarning = false;

function initialDiary(): Diary {
  try {
    const s = localStorage.getItem(key);
    return s ? validateDiary(JSON.parse(s)) : { version: 1, entries: [] };
  } catch {
    storageWarning = true;
    return { version: 1, entries: [] };
  }
}
function download(diary: Diary, format: "json" | "txt", lang: Lang) {
  const text = format === "json"
    ? JSON.stringify(diary, null, 2)
    : (lang === "ru" ? "ЕВРОПА • ДНЕВНИК ОТКРЫТИЙ\n\n" : "EUROPA • FORSCHUNGSTAGEBUCH\n\n") +
      diary.entries.map((e) =>
        `${editorial[lang].chapters[e.chapter].nav}\n${new Date(e.date).toLocaleDateString(lang === "de" ? "de-DE" : "ru-RU")}\n${e.text}`
      ).join("\n\n");
  const url = URL.createObjectURL(new Blob([text], {
    type: format === "json" ? "application/json" : "text/plain;charset=utf-8",
  }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `europe-diary-${new Date().toISOString().slice(0, 10)}.${format}`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; lang: Lang },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    const ui = labels[this.props.lang];
    return this.state.failed ? (
      <div role="alert" className="notice">
        {ui.sceneError} <button onClick={() => location.reload()}>{ui.retry}</button>
      </div>
    ) : this.props.children;
  }
}

function App() {
  const [lang, setLang] = useState<Lang>("ru");
  const [chapter, setChapter] = useState(0);
  const [diary, setDiary] = useState<Diary>(initialDiary);
  const [notice, setNotice] = useState(storageWarning ? "Сохранённый дневник недоступен. Скачивай JSON для резервной копии." : "");
  const [view, setView] = useState<"home" | "lesson" | "diary" | "sources">("home");
  const [note, setNote] = useState("");
  const [activeActivity, setActiveActivity] = useState<number | null>(null);
  const [showExplanations, setShowExplanations] = useState<number[]>([]);
  const [revealCheck, setRevealCheck] = useState(false);
  const [openSecret, setOpenSecret] = useState<number | null>(null);
  const ui = labels[lang];
  const locale = editorial[lang];
  const lesson = locale.chapters[chapter];
  const Scene = [MapScene, ClimateScene, Farm, Alps, Travel][chapter];
  const done = new Set(diary.entries.map((e) => e.chapter));

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  function persist(next: Diary) {
    setDiary(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
      setNotice(ui.saved);
    } catch {
      setNotice(ui.denied);
    }
  }
  function openChapter(i: number) {
    setChapter(i);
    setView("lesson");
    setNote("");
    setActiveActivity(null);
    setShowExplanations([]);
    setRevealCheck(false);
    setOpenSecret(null);
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  function openView(next: "home" | "diary" | "sources") {
    setView(next);
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  async function importFile(file?: File) {
    if (!file) return;
    try {
      if (file.size > 1_000_000) throw Error(ui.maxSize);
      persist(mergeDiaries(diary, validateDiary(JSON.parse(await file.text()))));
      setNotice(ui.imported);
    } catch (e) {
      setNotice(e instanceof Error ? e.message : ui.readError);
    }
  }
  const toggleExplanation = (index: number) => {
    setShowExplanations((prev) => prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]);
  };

  return (
    <div className="app">
      <aside>
        <a href="#main" className="skip">{ui.skip}</a>
        <button className="brand brand-link" onClick={() => openView("home")} aria-label={ui.home}>
          <span className="brand-emblem">🌍</span><div>{ui.brand}<small>{ui.brandSubtitle}</small></div>
        </button>
        <div className="aside-label">{ui.explore}</div>
        <nav aria-label={ui.explore}>
          <button aria-current={view === "home" ? "page" : undefined} onClick={() => openView("home")}>
            <span className="nav-icon">⌂</span><span>{ui.home}</span>
          </button>
          {locale.chapters.map((l, i) => (
            <button key={l.id} aria-current={view === "lesson" && chapter === i ? "page" : undefined} onClick={() => openChapter(i)}>
              <span className="nav-icon">{chapterSymbols[i]}</span>
              <span><small>{ui.chapter} 0{i + 1}</small>{l.nav.replace(/^Глава \d+ · |^Kapitel \d+ · /, "")}</span>
              <span aria-label={done.has(i) ? "✓" : undefined}>{done.has(i) ? "✓" : ""}</span>
            </button>
          ))}
        </nav>
        <div className="aside-mascot" aria-hidden="true"><span>🦉</span><p>{t(lang, "Твои открытия ждут тебя!", "Deine Entdeckungen warten!")}</p></div>
        <div className="aside-bottom">
          <button className="diary-button" onClick={() => openView("diary")}>▤ {ui.journal} <b>{diary.entries.length}</b></button>
          <p>{done.size} / 5 {ui.done}</p><progress max="5" value={done.size} />
          <button className="text-button" onClick={() => openView("sources")}>{ui.sources}</button>
        </div>
      </aside>
      <main id="main">
        <header>
          <span>{ui.grade}</span>
          <span className="lang-switch" aria-label="Sprache / Язык">
            <button type="button" aria-pressed={lang === "ru"} onClick={() => setLang("ru")}>RU</button>
            <span>/</span>
            <button type="button" aria-pressed={lang === "de"} onClick={() => setLang("de")}>DE</button>
            <span className="dot">●</span>{ui.ungraded}
          </span>
        </header>
        {notice && <div className="notice status" role="status">{notice}<button aria-label={ui.close} onClick={() => setNotice("")}>×</button></div>}

        {view === "home" ? (
          <>
            <div className="eyebrow">{ui.grade} / EUROPE EXPLORER</div>
            <section className="story-hero art-hero" aria-label={locale.homepage.title}>
              <img className="hero-art" src={`${import.meta.env.BASE_URL}art/hero.webp`} alt={t(lang, "Юный исследователь Европы с картой, совой и горами", "Junger Europa-Entdecker mit Karte, Eule und Bergen")} fetchPriority="high" />
              <div className="hero-content">
                <div className="hero-mark">🎒 {t(lang,"ПРИКЛЮЧЕНИЕ НАЧИНАЕТСЯ","DEIN ABENTEUER BEGINNT")} · 01—05</div>
                <h1>{locale.homepage.title}</h1>
                <p className="intro">{locale.homepage.subtitle}</p>
                <p className="hero-story">{locale.homepage.story}</p>
                <button className="primary hero-play" onClick={() => openChapter(0)}>🚀 {locale.homepage.start} <span aria-hidden="true">→</span></button>
              </div>
            </section>
            <section className="mission home-mission"><span>✧</span><div><b>{ui.goal}</b><p>{locale.homepage.mission}</p></div></section>
            <p className="home-rule">{locale.homepage.rule}</p>
            <section className="journey-board" aria-label={t(lang,"Маршрут исследователя","Entdeckerroute")}>
              <div className="eyebrow">🏅 {t(lang,"СОБЕРИ 5 ЗНАЧКОВ ИССЛЕДОВАТЕЛЯ","SAMMLE 5 ENTDECKER-ABZEICHEN")}</div>
              <div className="stamp-track">
                {locale.chapters.map((c,i) => <button key={c.id} className={`stamp ${done.has(i) ? "earned" : ""}`} onClick={() => openChapter(i)} aria-label={`${c.nav} · ${done.has(i) ? t(lang,"открыто","geschafft") : t(lang,"вперёд","weiter")}`}>
                  <span className="stamp-icon">{chapterSymbols[i]}</span><b>{String(i+1).padStart(2,"0")}</b><small>{done.has(i) ? "✓" : "☆"}</small>
                </button>)}
              </div>
              <p>{locale.homepage.route}</p>
            </section>
            <div className="home-actions">
              <button className="primary" onClick={() => openChapter(0)}>{locale.homepage.start} →</button>
              {diary.entries.length > 0 && <button className="secondary" onClick={() => openView("diary")}>{ui.journal} ({diary.entries.length})</button>}
            </div>
            <div className="chapter-preview">
              {locale.chapters.map((c, i) => (
                <button key={c.id} className={`chapter-tile tile-${i}`} onClick={() => openChapter(i)}>
                  <span className="tile-image"><img src={`${import.meta.env.BASE_URL}art/${chapterArt[i]}.webp`} alt="" loading="lazy"/><span className="tile-emoji">{chapterSymbols[i]}</span></span>
                  <span className="tile-body"><small>{ui.chapter} 0{i + 1} {done.has(i) ? "✓" : ""}</small><b>{c.nav.replace(/^Глава \d+ · |^Kapitel \d+ · /, "")}</b><span>{c.goal}</span><strong>{t(lang,"В экспедицию","Expedition starten")} ↗</strong></span>
                </button>
              ))}
            </div>
          </>
        ) : view === "lesson" ? (
          <>
            <section className={`lesson-banner banner-${chapter}`}>
              <img className="chapter-banner-art" src={`${import.meta.env.BASE_URL}art/${chapterArt[chapter]}.webp`} alt={t(lang,"Красочная иллюстрация экспедиции: ","Farbiges Bild der Expedition: ") + lesson.title} />
              <div className="lesson-banner-content">
                <div className="hero-mark">{chapterSymbols[chapter]} {ui.expedition} 0{chapter + 1} / 05</div>
                <h1>{lesson.title}</h1>
                <p className="intro">{lesson.subtitle}</p>
              </div>
            </section>
            <p className="illustration-note">🎨 {t(lang,"Это сюжетная иллюстрация. Для точных ответов используй интерактивную карту и графики ниже.","Das Bild erzählt eine Geschichte. Für genaue Antworten nutze die interaktive Karte und die Diagramme unten.")}</p>
            <div className="story-hook"><span className="hook-icon">💡</span>{lesson.hook}</div>
            <div className="mission"><span>🎯</span><div><b>{ui.goal}</b><p>{lesson.goal}</p></div></div>

            <section className="learning-before" aria-labelledby="why-head">
              <div className="eyebrow">{ui.intro}</div><h2 id="why-head">{t(lang, "От вопроса — к открытию", "Von der Frage zur Erkenntnis")}</h2>
              <div className="explanation-grid">
                {lesson.explanations.map((item, i) => (
                  <article key={i} className={`explanation-card expl-${i % 4}`}>
                    <div className="explanation-visual" aria-hidden="true"><span className="visual-icon">{stepSymbols[chapter][i % 4]}</span><span className="visual-orbit">✦</span><span className="visual-dots">• • •</span></div>
                    <span className="card-number">{String(i+1).padStart(2,"0")}</span>
                    <h3>{item.title}</h3><p>{item.text}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="owl-facts">
              <div className="owl-facts-heading"><span className="owl-avatar" aria-hidden="true">🦉</span><div><div className="eyebrow">{t(lang,"СЕКРЕТЫ СОВЫ","EULEN-GEHEIMNISSE")}</div><h2>{t(lang,"Нажми на карточку — узнай больше!","Tippe auf eine Karte und entdecke mehr!")}</h2></div></div>
              <div className="secret-grid">{chapterFacts[lang][chapter].map((fact,i) => <button type="button" key={`${chapter}-${i}`} className={`secret-card secret-${i} ${openSecret===i ? "revealed" : ""}`} aria-expanded={openSecret===i} onClick={() => setOpenSecret(openSecret===i ? null : i)}>
                <span className="secret-icon">{fact.icon}</span><b>{fact.title}</b><span className="secret-arrow">{openSecret===i ? "−" : "+"}</span>
                {openSecret===i && <p>{fact.text}</p>}
              </button>)}</div>
            </section>
            <section className="chapter-scene">
              <div className="scene-heading"><span className="scene-badge">🎮 {t(lang,"ИГРАЕМ И ИССЛЕДУЕМ","SPIELEN & FORSCHEN")}</span><h2>{ui.scene}</h2></div><p>{ui.instructions}</p>
              <div className="scene" aria-label={ui.scene}>
                <ErrorBoundary key={chapter} lang={lang}>
                  <Suspense fallback={<p className="loading">{ui.loading}</p>}>
                    <Scene lang={lang} />
                  </Suspense>
                </ErrorBoundary>
              </div>
            </section>

            <section className="guided" aria-labelledby="guided-heading">
              <div className="eyebrow">{ui.study}</div>
              <h2 id="guided-heading">{t(lang, "Попробуй сам — и объясни результат", "Probiere es selbst und erkläre das Ergebnis")}</h2>
              <div className="guided-list">
                {lesson.activities.map((a, i) => (
                  <article className="guided-card" key={i}>
                    <div className="guided-top"><span className="guided-icon">{stepSymbols[chapter][i % 4]}</span><div><small>{t(lang,"ЗАДАНИЕ","AUFGABE")} {i+1} / 3</small><p>{a.prompt}</p></div></div>
                    <div className="guided-actions">
                      <button className="secondary small-action" aria-expanded={activeActivity === i} onClick={() => setActiveActivity(activeActivity === i ? null : i)}>{ui.hint}</button>
                      <button className="text-button" aria-expanded={showExplanations.includes(i)} onClick={() => toggleExplanation(i)}>{ui.reveal}</button>
                    </div>
                    {activeActivity === i && <p className="hint-text">{a.hint}</p>}
                    {showExplanations.includes(i) && <div className="explain-result"><b>{ui.explanation}</b><p>{feedbackExplanation(a.success)}</p><small>{ui.explainNote}</small></div>}
                  </article>
                ))}
              </div>
            </section>

            <section className="self-check">
              <span className="check-medal" aria-hidden="true">🏆</span><div className="eyebrow">{ui.check}</div><h2>{lesson.checkpoint.question}</h2>
              <button className="secondary" aria-expanded={revealCheck} onClick={() => setRevealCheck(!revealCheck)}>{revealCheck ? t(lang, "Скрыть ответ", "Antwort verbergen") : ui.answer}</button>
              {revealCheck && <div className="check-answer"><p><b>{lesson.checkpoint.answer}</b></p><p>{lesson.checkpoint.explain}</p></div>}
            </section>

            <section className="panel terms lesson-terms"><div className="eyebrow">{ui.term}</div>
              <div className="terms-grid">{lesson.terms.map(([ru, de, explanation], i) => (
                <div className="term" key={i}><b lang="de">{lang === "ru" ? de : ru}</b><span>{explanation}</span></div>
              ))}</div>
            </section>
            <section className="journal">
              <span className="journal-stamp" aria-hidden="true">{chapterSymbols[chapter]}</span>
              <div><div className="eyebrow">✨ {ui.takeaway}</div><h2>{lesson.takeaway}</h2><p>{ui.takeText}</p></div>
              <textarea value={note} maxLength={3000} onChange={(e) => setNote(e.target.value)} placeholder={lesson.takeaway} aria-label={ui.myNotes} />
              <div className="actions">
                <button className="primary" onClick={() => {
                  persist({version: 1, entries: [...diary.entries, { chapter, text: note.trim() || lesson.takeaway, date: new Date().toISOString() }] });
                  setNote("");
                }}>{ui.save}</button>
                <button className="secondary" onClick={() => download(diary,"json",lang)}>{ui.json}</button>
                <button className="secondary" onClick={() => download(diary,"txt",lang)}>{ui.txt}</button>
              </div><small>{ui.diaryTip}</small>
            </section>
            <footer><span><b>{ui.lead}</b> {lesson.bridge}</span>
              <button className="text-button" onClick={() => chapter < 4 ? openChapter(chapter + 1) : openView("diary")}>{chapter < 4 ? ui.next : ui.finish}</button>
            </footer>
          </>
        ) : view === "diary" ? (
          <>
            <section className="diary-hero"><img src={`${import.meta.env.BASE_URL}art/hero.webp`} alt=""/><div><div className="eyebrow">🏆 {t(lang,"ТВОЯ КОЛЛЕКЦИЯ НАБЛЮДЕНИЙ","DEINE SAMMLUNG VON ERKENNTNISSEN")}</div><h1>{locale.journal.title}</h1><p className="intro">{locale.journal.intro}</p></div></section>
            <div className="stamp-track diary-stamps">{locale.chapters.map((c,i)=><span key={c.id} className={`stamp ${done.has(i)?"earned":""}`} title={c.nav}><span className="stamp-icon">{chapterSymbols[i]}</span><b>{i+1}</b><small>{done.has(i)?"✓":"☆"}</small></span>)}</div>
            <section className="panel diary-final">
              <h2>{locale.journal.my_findings}</h2><p>{locale.journal.final_question}</p>
              <details><summary>{ui.answer}</summary><p>{locale.journal.final_model}</p></details>
              {done.size === 5 && <p className="diary-success">{locale.journal.completed}</p>}
            </section>
            <section className="panel download-panel"><h2>{locale.journal.export_title}</h2><p>{locale.journal.export_explain}</p>
              <div className="actions"><button className="primary" onClick={() => download(diary,"json",lang)}>{ui.json}</button>
                <button className="secondary" onClick={() => download(diary,"txt",lang)}>{ui.txt}</button>
                <label className="secondary import">{ui.restore}<input type="file" accept="application/json,.json" onChange={(e) => {void importFile(e.target.files?.[0]);e.target.value="";}} /></label>
              </div><small>{locale.journal.restore_explain}</small>
            </section>
            {!diary.entries.length ? <div className="panel"><h2>{ui.empty}</h2><p>{ui.emptyExplain}</p><button className="primary" onClick={() => openChapter(0)}>{ui.startMap}</button></div> :
              diary.entries.map((e,i) => <article className="panel diary-entry" key={i}><div className="eyebrow">{locale.chapters[e.chapter].nav} · {new Date(e.date).toLocaleDateString(lang === "ru" ? "ru-RU" : "de-DE")}</div><p className="entry">{e.text}</p></article>)}
          </>
        ) : (
          <>
            <h1>{ui.sources}</h1>
            <section className="panel">
              <h2>{t(lang,"Учебная экспедиция","Eine Lernexpedition")}</h2>
              <p>{t(lang,"Вводный курс из пяти связанных тем для 6-го класса. Он не заменяет программу твоей школы: сверяй требования с учителем и учебником.","Ein Einführungskurs aus fünf zusammenhängenden Themen für Klasse 6. Er ersetzt nicht den Lehrplan deiner Schule. Vergleiche die Inhalte mit deinem Schulbuch.")}</p>
              <p>{t(lang,"Климатические числа, высотные пояса и расход воды — учебные модели, а не наблюдения за конкретными городами или курортами.","Klima-, Höhen- und Wasserwerte sind vereinfachte Unterrichtsmodelle und keine Daten von konkreten Städten oder Urlaubsorten.")}</p>
              <h3>{t(lang,"Данные и библиотеки","Daten und Bibliotheken")}</h3>
              <ul><li><a href="https://www.naturalearthdata.com/about/terms-of-use/">Natural Earth</a> — 1:110m, public domain</li>
                <li><a href="https://openlayers.org/">OpenLayers</a> — BSD-2-Clause</li>
                <li><a href="https://recharts.org/">Recharts</a> — MIT</li>
                <li>React, Vite, Tailwind CSS — MIT; TypeScript — Apache-2.0</li></ul>
              <h3>{t(lang,"Образовательная основа","Lernmaterialien")}</h3>
              <ul><li><a href="https://www.prmrs.de/fileadmin/Redaktion/gemeinsame_Dateien/Realschule/Geo/Grundwissen_Geographie_6._Jgst.pdf">Grundwissen Geographie, 6. Jahrgangsstufe</a></li>
              <li><a href="https://www.planet-schule.de/schwerpunkt/total-phaenomenal-erde-und-klima/index.html">Planet Schule: Erde und Klima</a></li></ul>
              <h3>{t(lang,"Прогресс и приватность","Fortschritt und Datenschutz")}</h3>
              <p>{t(lang,"Аккаунтов и аналитики нет. Дневник хранится только в браузере, а резервную копию можно скачать в JSON. При смене адреса сайта импортируй сохранённый JSON заново.","Es gibt keine Konten und keine Analyse. Dein Tagebuch liegt nur im Browser. Lade eine JSON-Sicherung herunter, die du nach einem Domainwechsel wieder importieren kannst.")}</p>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<React.StrictMode><App /></React.StrictMode>);
