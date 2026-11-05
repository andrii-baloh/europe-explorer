import { useState } from 'react';
import type { Lang } from './ui';
import './mapDetective.css';

type TextPair = { ru: string; de: string };
type Step = { question: TextPair; options: TextPair[]; right: number; why: TextPair };
type Lesson = { name: TextPair; intro: TextPair; terms: TextPair; steps: Step[] };
const t = (ru: string, de: string): TextPair => ({ ru, de });
const q = (question: TextPair, options: TextPair[], right: number, why: TextPair): Step =>
  ({ question, options, right, why });

export const investigations: Lesson[] = [
  {
    name: t('Расследование 1 · Вид сверху', 'Ermittlung 1 · Blick von oben'),
    intro: t(
      'Представь прогулку по незнакомому городу. Фото показывает окна и фасады, а план — улицы, воду, школу и парк сразу. На плане предметы нарисованы так, как будто мы смотрим с высоты. Значки помогают не рисовать каждое дерево и каждый дом.',
      'Stell dir einen Spaziergang in einer unbekannten Stadt vor. Auf einem Foto siehst du Fassaden; im Plan erkennst du Straßen, Fluss, Schule und Park gleichzeitig. Er zeigt die Stadt von oben und vereinfacht die Wirklichkeit.'
    ),
    terms: t('План местности — Ortsplan · Вид сверху — Draufsicht',
      'Ortsplan — план местности · Draufsicht — вид сверху'),
    steps: [
      q(t('Что обозначает синяя изогнутая линия?', 'Was bedeutet die geschwungene blaue Linie?'),
        [t('Реку', 'Den Fluss'),t('Дорогу', 'Die Straße'),t('Школу', 'Die Schule')],0,
        t('На нашем учебном плане синий изгиб показывает реку. На настоящей карте всегда сверяйся с легендой.',
          'Auf diesem Lernplan ist die blaue Linie der Fluss. Auf echten Karten schaust du in die Legende.')),
      q(t('Найди школу на плане. Какой у неё знак?', 'Suche die Schule. Welches Zeichen gehört dazu?'),
        [t('Зелёный круг', 'Grüner Kreis'),t('Красный квадрат S', 'Rotes Quadrat S'),t('Синяя линия', 'Blaue Linie')],1,
        t('Школа помечена буквой S. На других планах символ может быть другим.',
          'S steht in diesem Modell für Schule. Auf anderen Plänen kann das Zeichen anders sein.')),
      q(t('Чем удобнее сравнить положение школы и парка?', 'Womit vergleichst du am besten die Lage von Schule und Park?'),
        [t('Фотографией фасада', 'Mit einem Fassadenfoto'),t('Рассказом без карты', 'Mit einer Geschichte ohne Karte'),t('Планом сверху', 'Mit dem Ortsplan von oben')],2,
        t('План показывает оба места и дороги между ними.', 'Ein Plan zeigt beide Orte und die Wege dazwischen.'))
    ]
  },
  {
    name: t('Расследование 2 · Четыре направления', 'Ermittlung 2 · Himmelsrichtungen'),
    intro: t('На многих картах север вверху, юг внизу, восток справа, запад слева. Но лист можно повернуть. Места от этого не перемещаются! Сначала найди северную стрелку, а потом выясняй направление.',
      'Auf vielen Karten liegt Norden oben, Süden unten, Osten rechts und Westen links. Drehst du die Karte, wandern die Orte nicht! Suche zuerst den Nordpfeil.'),
    terms: t('Стороны света — Himmelsrichtungen · Компас — Kompass', 'Himmelsrichtungen — стороны света · Kompass — компас'),
    steps: [
      q(t('Север вверху. Где восток?', 'Norden ist oben. Wo ist Osten?'),
        [t('Слева', 'Links'),t('Справа', 'Rechts'),t('Снизу', 'Unten')],1,
        t('При северной ориентации восток справа.', 'Bei Nordausrichtung liegt Osten rechts.')),
      q(t('Куда направлен юг на рисунке?', 'Wohin zeigt Süden auf der Windrose?'),
        [t('Вниз', 'Nach unten'),t('Вверх', 'Nach oben'),t('Влево', 'Nach links')],0,
        t('Юг находится напротив севера.', 'Süden liegt gegenüber von Norden.')),
      q(t('Школа западнее парка. В какую сторону идти от парка?', 'Die Schule liegt westlich vom Park. Wohin gehst du vom Park?'),
        [t('На север', 'Nach Norden'),t('На восток', 'Nach Osten'),t('На запад', 'Nach Westen')],2,
        t('Если школа западнее парка, идти нужно на запад.', 'Liegt die Schule westlich vom Park, gehst du nach Westen.'))
    ]
  },
  {
    name: t('Расследование 3 · Секретные знаки', 'Ermittlung 3 · Geheime Zeichen'),
    intro: t('Легенда — словарь карты. Она объясняет, что означают знаки, цвета и линии. В нашем примере три условных знака. На другой карте те же символы могут означать другое. Проверяй подпись, а не только цвет!',
      'Die Legende ist das Wörterbuch einer Karte. Sie erklärt Farben, Linien und Symbole. Drei Zeichen gehören zu unserer Übung. Auf einer anderen Karte können sie anders gemeint sein.'),
    terms: t('Легенда — Kartenlegende · Условный знак — Kartenzeichen', 'Kartenlegende — легенда · Kartenzeichen — условный знак'),
    steps: [
      q(t('Согласно нашей легенде, что означает ≋?', 'Was bedeutet ≋ laut unserer Legende?'),
        [t('Река', 'Fluss'),t('Вокзал', 'Bahnhof'),t('Медпункт', 'Sanitätsstation')],0,
        t('Волнистая линия — река в нашей учебной легенде.', 'Die Wellenlinie ist in unserer Legende der Fluss.')),
      q(t('Что означает ✚?', 'Was bedeutet ✚?'),
        [t('Мост', 'Brücke'),t('Медпункт', 'Sanitätsstation'),t('Школа', 'Schule')],1,
        t('Крест обозначает медпункт именно в этой легенде.', 'Das Kreuz bezeichnet in dieser Legende die Sanitätsstation.')),
      q(t('Что означает ▤?', 'Was bedeutet ▤?'),
        [t('Парк', 'Park'),t('Река', 'Fluss'),t('Вокзал', 'Bahnhof')],2,
        t('Знак ▤ обозначает вокзал. Не угадывай по форме — читай легенду.',
          '▤ steht hier für Bahnhof. Nicht raten: die Legende lesen.'))
    ]
  },
  {
    name: t('Расследование 4 · Скрытые километры', 'Ermittlung 4 · Versteckte Kilometer'),
    intro: t('Масштаб 1:100 000 означает: 1 см на карте равен 100 000 см в природе, то есть 1 км. При масштабе 1:200 000 тот же сантиметр равен 2 км. Это расстояние по прямой; извилистая дорога может быть длиннее.',
      'Maßstab 1:100 000 bedeutet: 1 cm auf der Karte sind 100 000 cm in Wirklichkeit, also 1 km. Bei 1:200 000 sind es 2 km. Die Luftlinie ist nicht immer so lang wie eine kurvige Straße.'),
    terms: t('Масштаб — Maßstab · По прямой — Luftlinie', 'Maßstab — масштаб · Luftlinie — по прямой'),
    steps: [
      q(t('1:100 000, на карте 3 см. Сколько по прямой?', '1:100 000, auf der Karte 3 cm. Wie weit ist die Luftlinie?'),
        [t('3 км', '3 km'),t('30 км', '30 km'),t('300 м', '300 m')],0,
        t('1 см = 1 км; 3 см = 3 км.', '1 cm = 1 km; 3 cm = 3 km.')),
      q(t('1:200 000, на карте 2 см. Сколько километров?', '1:200 000, auf der Karte 2 cm. Wie viele Kilometer?'),
        [t('2 км', '2 km'),t('4 км', '4 km'),t('20 км', '20 km')],1,
        t('1 см = 2 км; 2 см = 4 км.', '1 cm = 2 km; 2 cm = 4 km.')),
      q(t('1:50 000, на карте 4 см. Сколько километров?', '1:50 000, auf der Karte 4 cm. Wie viele Kilometer?'),
        [t('4 км', '4 km'),t('8 км', '8 km'),t('2 км', '2 km')],2,
        t('1 см = 500 м; 4 см = 2 км.', '1 cm = 500 m; 4 cm = 2 km.'))
    ]
  },
  {
    name: t('Расследование 5 · Квадраты атласа', 'Ermittlung 5 · Planquadrate'),
    intro: t('В атласе город сначала ищут в алфавитном указателе — Register. Рядом обычно указаны страница и квадрат, например 24 B2. Открой страницу 24, найди колонку B и строку 2. Сетка атласа не равна географическим координатам широты и долготы.',
      'Suche den Ort zuerst im Register. Dort stehen häufig die Seite und das Planquadrat, etwa 24 B2. Öffne Seite 24, dann Spalte B und Zeile 2. Planquadrate sind nicht dasselbe wie Breiten- und Längengrade.'),
    terms: t('Указатель — Register · Квадрат — Planquadrat', 'Register — указатель · Planquadrat — квадрат сетки'),
    steps: [
      q(t('Где школа 🏫? Выбери квадрат.', 'Wo ist die Schule 🏫? Wähle das Planquadrat.'),[],5,
        t('Школа в колонке B, строке 2 — B2.', 'Die Schule liegt in Spalte B, Zeile 2: B2.')),
      q(t('Где парк 🌳? Выбери квадрат.', 'Wo ist der Park 🌳? Wähle das Planquadrat.'),[],11,
        t('Парк находится в D3.', 'Der Park liegt in D3.')),
      q(t('Где мост 🌉? Выбери квадрат.', 'Wo ist die Brücke 🌉? Wähle das Planquadrat.'),[],12,
        t('Мост находится в A4.', 'Die Brücke liegt in A4.'))
    ]
  }
];

function Drawing({ lessonIndex, lang, step }: { lessonIndex: number; lang: Lang; step: number }) {
  const label = investigations[lessonIndex].name[lang];
  if (lessonIndex === 4) return <div className="md-atlas" role="img" aria-label={label}>
    <strong>{lang === 'ru' ? 'Атлас · учебная страница 24' : 'Atlas · Übungsseite 24'}</strong>
    <div className="md-atlas-head"><span />{'ABCD'.split('').map(c => <b key={c}>{c}</b>)}</div>
    {Array.from({ length: 4 }, (_, row) => <div className="md-atlas-row" key={row}>
      <b>{row+1}</b>{Array.from({ length: 4 }, (_, col) => <span key={col}>
        {({5:'🏫',11:'🌳',12:'🌉'} as Record<number,string>)[row*4+col] || '·'}
      </span>)}
    </div>)}
  </div>;
  if (lessonIndex === 1) return <svg className="md-image" viewBox="0 0 460 240" role="img" aria-label={label}>
    <rect x="4" y="5" width="452" height="230" rx="18" fill="#e6f4ff"/>
    <circle cx="230" cy="120" r="89" fill="white" stroke="#24638c" strokeWidth="3"/>
    <line x1="230" y1="31" x2="230" y2="209" stroke="#b9cee0" strokeWidth="2"/>
    <line x1="141" y1="120" x2="319" y2="120" stroke="#b9cee0" strokeWidth="2"/>
    <path d="M230 51 L215 119 L230 105 L245 119 Z" fill="#dc6045"/>
    <path d="M230 189 L215 121 L230 135 L245 121 Z" fill="#28618e"/>
    {[[230,25,'N'],[337,127,'O'],[230,224,'S'],[122,127,'W']].map(([x,y,v])=>
      <text key={String(v)} x={x} y={y} textAnchor="middle" fontSize="22" fontWeight="bold" fill="#17456c">{v}</text>)}
    <text x="18" y="42" fill="#194f77" fontSize="14">{lang==='ru'?'Северная стрелка':'Nordpfeil'}</text>
    <path d="M142 46 L198 68" stroke="#194f77" strokeWidth="2"/>
  </svg>;
  if (lessonIndex === 2) return <svg className="md-image" viewBox="0 0 460 240" role="img" aria-label={label}>
    <rect x="4" y="5" width="452" height="230" rx="18" fill="#fff7e6"/>
    <text x="24" y="37" fill="#144b72" fontWeight="bold" fontSize="20">{lang==='ru'?'Условные знаки':'Kartenlegende'}</text>
    {['≋','✚','▤'].map((v,i)=><g key={v}>
      <rect x="23" y={52+i*56} width="414" height="49" rx="11" fill={['#e2f3ff','#ebf8e8','#fff0e0'][i]}/>
      <text x="44" y={88+i*56} fontSize="31" fill="#245d86">{v}</text>
      <text x="127" y={85+i*56} fontSize="20" fill="#174a71">
        {(lang==='ru'?['Река','Медпункт','Вокзал']:['Fluss','Sanitätsstation','Bahnhof'])[i]}
      </text>
    </g>)}
  </svg>;
  if (lessonIndex === 3) {
    const centimeters = [3,2,4][step];
    const scale = ['1 : 100 000','1 : 200 000','1 : 50 000'][step];
    return <svg className="md-image" viewBox="0 0 460 240" role="img" aria-label={label}>
      <rect x="4" y="5" width="452" height="230" rx="18" fill="#e9f6f7"/>
      <text x="230" y="55" textAnchor="middle" fontSize="27" fontWeight="bold" fill="#114c79">{scale}</text>
      <text x="32" y="104" fontSize="17" fill="#24516f">{lang==='ru'?'Отрезок на карте':'Strecke auf der Karte'}</text>
      <rect x="36" y="122" width={centimeters*91} height="30" rx="3" fill="#ffbe49" stroke="#9d712a" strokeWidth="2"/>
      {Array.from({length:centimeters+1},(_,i)=><g key={i}>
        <line x1={36+i*91} y1="118" x2={36+i*91} y2="158" stroke="#885e27" strokeWidth="2"/>
        <text x={36+i*91} y="176" fontSize="14" fill="#265375" textAnchor="middle">{i}</text>
      </g>)}
      <text x="418" y="176" fontSize="16" textAnchor="end" fill="#265375">cm</text>
      <text x="230" y="213" textAnchor="middle" fontSize="15" fill="#265375">{lang==='ru'?'Каково расстояние в природе?':'Wie weit in Wirklichkeit?'}</text>
    </svg>;
  }
  return <svg className="md-image" viewBox="0 0 460 240" role="img" aria-label={label}>
    <rect x="4" y="5" width="452" height="230" rx="18" fill="#eaf7e7"/>
    <path d="M40 75H420 M40 163H420 M153 36V209 M335 36V209" stroke="#c8cfd4" strokeWidth="24" fill="none"/>
    <path d="M44 195 Q165 135 258 178 T419 146" stroke="#43a3d6" strokeWidth="20" strokeLinecap="round" fill="none"/>
    <rect x="190" y="92" width="53" height="48" rx="7" fill="#cf5952"/>
    <text x="216" y="122" textAnchor="middle" fontSize="27" fontWeight="bold" fill="white">S</text>
    <circle cx="397" cy="73" r="26" fill="#5d9f65"/>
    <text x="397" y="81" textAnchor="middle" fontSize="26" fill="white">♣</text>
    <path d="M320 162 L355 155" stroke="#715a40" strokeWidth="13" strokeLinecap="round"/>
    <text x="22" y="35" fontSize="14" fill="#285778">{lang==='ru'?'Вымышленный город':'Erfundene Stadt'}</text>
  </svg>;
}

export default function MapDetective({ lessonIndex, lang, onMastered }: {
  lessonIndex: number; lang: Lang; onMastered: () => void;
}) {
  const lesson = investigations[lessonIndex];
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const done = step === lesson.steps.length;
  const current = lesson.steps[Math.min(step, lesson.steps.length-1)];
  const correct = choice !== null && choice === current.right;
  const advance = () => {
    if (!correct) return;
    if (step === lesson.steps.length-1) { setStep(lesson.steps.length); onMastered(); }
    else { setStep(step+1); setChoice(null); }
  };
  return <section className="md-panel" aria-label={lesson.name[lang]}>
    <div className="md-head"><span aria-hidden="true">🕵️</span><div>
      <small>{lang==='ru'?'ИНТЕРАКТИВНЫЙ ДЕТЕКТИВ':'INTERAKTIVER DETEKTIV'}</small>
      <h2>{lesson.name[lang]}</h2><p>{lesson.intro[lang]}</p>
      <strong>{lesson.terms[lang]}</strong>
    </div></div>
    <Drawing lessonIndex={lessonIndex} lang={lang} step={Math.min(step,2)}/>
    {!done ? <div className="md-task">
      <div className="md-task-label"><b>{lang==='ru'?'Задача':'Aufgabe'}</b><b>{step+1} / 3</b></div>
      <h3>{current.question[lang]}</h3>
      {lessonIndex===4 ? <div className="md-grid-buttons" role="group" aria-label={lang==='ru'?'Квадраты карты':'Planquadrate'}>
        {Array.from({length:16},(_,i)=><button type="button" key={i} aria-pressed={choice===i}
          className={choice===i?'md-selected':''} onClick={()=>setChoice(i)}>{'ABCD'[i%4]}{Math.floor(i/4)+1}</button>)}
      </div> : <div className="md-choice-buttons">
        {current.options.map((option,i)=><button type="button" key={i} aria-pressed={choice===i}
          className={choice===i?'md-selected':''} onClick={()=>setChoice(i)}>
          <b>{String.fromCharCode(65+i)}</b> {option[lang]}
        </button>)}
      </div>}
      {choice!==null && <div className={correct?'md-feedback-good':'md-feedback-bad'} role="status">
        <b>{correct?(lang==='ru'?'✓ Верно!':'✓ Richtig!'):(lang==='ru'?'↻ Попробуй ещё раз':'↻ Versuch es erneut')}</b>
        <p>{correct?current.why[lang]:(lang==='ru'?'Сравни ответ со схемой и объяснением.':'Vergleiche deine Antwort mit Bild und Erklärung.')}</p>
      </div>}
      {correct && <button type="button" className="md-next" onClick={advance}>
        {step===2?(lang==='ru'?'Завершить расследование':'Ermittlung abschließen'):(lang==='ru'?'Следующая задача':'Nächste Aufgabe')} →
      </button>}
    </div> : <div className="md-done" role="status">
      <b>🏅 {lang==='ru'?'Все три задачи решены!':'Alle drei Aufgaben geschafft!'}</b>
      <p>{lang==='ru'?'Проверь теперь итоговый вопрос урока ниже. Оба задания необходимы для завершения урока.':'Beantworte nun auch die Abschlussfrage. Beide Aufgabenteile müssen gelöst sein.'}</p>
      <button type="button" onClick={()=>{setStep(0);setChoice(null);}}>{lang==='ru'?'Повторить':'Wiederholen'}</button>
    </div>}
    <small className="md-note">{lang==='ru'?'Схемы вымышленные, это учебные примеры.':'Schematische Lernmodelle, keine realen Kartendaten.'}</small>
  </section>;
}
