import type { Lang } from './ui';
import './learningVisuals.css';

type Pair = { ru: string; de: string };
type Tile = { icon: string; title: Pair; detail: Pair };
type Spec = { kind: 'flow'|'compare'|'compass'|'climate'|'altitude'|'mountain'; tiles?: Tile[]; note: Pair };
const p = (ru: string, de: string): Pair => ({ ru, de });
const tile = (icon: string, ru: string, de: string, factRu: string, factDe: string): Tile =>
  ({ icon, title: p(ru, de), detail: p(factRu, factDe) });

/** Lesson-specific learning graphics: not stock illustrations or real observation data. */
export const learningVisuals: Spec[][] = [
  [
    { kind:'compass', note:p('Сначала ищи север на карте. Физическая карта показывает рельеф, политическая — страны.','Suche zuerst Norden. Physische Karten zeigen das Relief, politische Karten die Staaten.') },
    { kind:'flow', tiles:[
      tile('🇩🇪','Германия','Deutschland','Севернее Альп','Nördlich der Alpen'),
      tile('🇦🇹','Австрия','Österreich','Маршрут на юг','Route nach Süden'),
      tile('🇮🇹','Италия','Italien','Южнее Альп','Südlich der Alpen')
    ], note:p('Пример маршрута через три страны, а не дорожная карта.','Beispielroute durch drei Länder, keine Straßenkarte.') },
    { kind:'mountain', tiles:[
      tile('🛣️','Долина','Tal','Дорога огибает склон','Straße folgt dem Tal'),
      tile('⛰️','Перевал','Pass','Переход через хребет','Übergang über den Kamm'),
      tile('🚇','Тоннель','Tunnel','Путь сквозь гору','Weg durch den Berg')
    ], note:p('Реальные маршруты зависят от гор, долин и тоннелей, а не только от прямого расстояния.','Reale Routen hängen von Tälern, Pässen und Tunneln ab.') }
  ],
  [
    { kind:'compare', tiles:[
      tile('🌦️','Погода','Wetter','Сегодня или сейчас','Heute oder jetzt'),
      tile('📊','Климат','Klima','Наблюдения за десятилетия','Beobachtungen über Jahrzehnte')
    ], note:p('Один жаркий день не означает, что климат стал жарким.','Ein heißer Tag beschreibt noch kein Klima.') },
    { kind:'climate', note:p('Учебные данные, не наблюдения конкретного города. Линия — °C, столбики — осадки в мм.','Beispieldaten, keine Messungen einer Stadt. Linie: °C, Balken: Niederschlag in mm.') },
    { kind:'flow', tiles:[
      tile('🌊','Море','Meer','Смягчает колебания','Mildert Temperaturschwankungen'),
      tile('⛰️','Высота','Höhe','Выше — обычно холоднее','Höher ist meist kälter'),
      tile('🌍','Широта','Breitenlage','Меняет угол солнечных лучей','Verändert den Sonnenstand')
    ], note:p('Климат зависит от нескольких факторов одновременно.','Mehrere Faktoren wirken gleichzeitig auf das Klima.') },
    { kind:'compare', tiles:[
      tile('🌡️','Температура','Temperatur','°C — левая шкала','°C – linke Skala'),
      tile('🌧️','Осадки','Niederschlag','мм — правая шкала','mm – rechte Skala')
    ], note:p('На типовой школьной шкале 10 °C соответствует 20 мм — единицы не равны друг другу.','In einer Schulklimagraphik entsprechen 10 °C der Höhe von 20 mm, nicht derselben Einheit.') }
  ],
  [
    { kind:'flow', tiles:[
      tile('☀️','Тепло','Wärme','Подходящая температура','Passende Temperatur'),
      tile('💧','Вода','Wasser','Достаточно влаги','Ausreichend Feuchtigkeit'),
      tile('🌱','Почва','Boden','Корни и питательные вещества','Wurzeln und Nährstoffe')
    ], note:p('Урожай зависит от сочетания всех трёх условий.','Die Ernte hängt vom Zusammenspiel aller drei Faktoren ab.') },
    { kind:'compare', tiles:[
      tile('🥔','Прохладнее','Kühler','Картофель распространён','Kartoffeln sind verbreitet'),
      tile('🫒','Средиземноморье','Mittelmeerraum','Оливки и виноград','Oliven und Wein')
    ], note:p('Это типичные примеры, а не жёсткая граница выращивания.','Das sind typische Beispiele, keine festen Anbaugrenzen.') },
    { kind:'flow', tiles:[
      tile('🏞️','Долина Рейна','Rheintal','Виноградники в Германии','Weinbau in Deutschland'),
      tile('☀️','Солнечный склон','Sonnenhang','Больше тепла и света','Mehr Wärme und Licht'),
      tile('🪨','Почва','Boden','Условия для корней','Bedingungen für Wurzeln')
    ], note:p('У широты есть исключения: местные условия тоже важны.','Breitenlage allein reicht nicht: Der Standort zählt.') }
  ],
  [
    { kind:'altitude', note:p('Упрощённая модель: −0,6 °C на каждые 100 м. Реальная погода может отличаться.','Vereinfachtes Modell: −0,6 °C je 100 m. In Wirklichkeit variiert der Wert.') },
    { kind:'mountain', tiles:[
      tile('🌬️','Влажный воздух','Feuchte Luft','Поднимается по склону','Steigt am Hang auf'),
      tile('☁️','Наветренная сторона','Luvseite','Охлаждение и осадки','Abkühlung und Regen'),
      tile('🌤️','Подветренная','Leeseite','Может быть суше','Kann trockener sein')
    ], note:p('Горный хребет меняет движение воздуха и распределение осадков.','Ein Gebirge beeinflusst Wind und Niederschlagsverteilung.') },
    { kind:'compare', tiles:[
      tile('🏘️','Долина','Tal','Поселения и дороги','Siedlungen und Straßen'),
      tile('⛰️','Крутой склон','Steilhang','Меньше места для стройки','Weniger Raum zum Bauen')
    ], note:p('Рельеф влияет на то, где можно жить и проложить дорогу.','Das Relief beeinflusst, wo man bauen und fahren kann.') }
  ],
  [
    { kind:'flow', tiles:[
      tile('🚢','Морское судно','Seeschiff','Контейнеры в Роттердаме','Container in Rotterdam'),
      tile('🚂','Поезд / баржа','Zug / Binnenschiff','Дальше внутрь страны','Weiter ins Binnenland'),
      tile('🚚','Грузовик','Lkw','Доставка получателю','Lieferung zum Ziel')
    ], note:p('Схема одного возможного логистического маршрута.','Ein möglicher Transportweg, kein fest vorgeschriebener Ablauf.') },
    { kind:'mountain', tiles:[
      tile('↗️','Прямая на карте','Luftlinie','Не всегда дорога','Nicht immer eine Straße'),
      tile('🛣️','Долина','Tal','Обход горы','Umweg um das Gebirge'),
      tile('🚇','Тоннель','Tunnel','Путь через хребет','Durchquerung des Berges')
    ], note:p('Сравни расстояние, время, стоимость и влияние на природу.','Vergleiche Strecke, Zeit, Kosten und Umweltfolgen.') },
    { kind:'compare', tiles:[
      tile('👥','Больше гостей','Mehr Gäste','Доходы от туризма','Tourismuseinnahmen'),
      tile('💧','Больше ресурсов','Mehr Ressourcen','Вода, транспорт, отходы','Wasser, Verkehr, Abfall')
    ], note:p('Туризм приносит пользу, но требует бережного планирования.','Tourismus bringt Nutzen, braucht aber gute Planung.') }
  ]
];

function ClimateChart({lang}:{lang:Lang}) {
 const temp=[1,3,7,12,17,20,22,21,17,11,6,2];
 const rain=[52,41,47,48,60,69,63,58,51,55,59,57];
 const months=lang==='ru'?['Я','Ф','М','А','М','И','И','А','С','О','Н','Д']:['J','F','M','A','M','J','J','A','S','O','N','D'];
 const pts=temp.map((v,i)=>`${44+i*43},${160-v*5.2}`).join(' ');
 return <svg viewBox="0 0 570 210" role="img" aria-label={lang==='ru'?'Учебная климатограмма: температура и осадки за 12 месяцев':'Beispielklimadiagramm mit Temperatur und Niederschlag'}>
   <rect x="0" y="0" width="570" height="210" rx="14" fill="#f1f9ff"/>
   {[40,80,120,160].map(y=><line key={y} x1="32" x2="535" y1={y} y2={y} stroke="#c6dbe9" strokeWidth="1"/>)}
   {rain.map((v,i)=><rect key={i} x={32+i*43} y={166-v*1.45} width="24" height={v*1.45} rx="3" fill="#77bce0" />)}
   <polyline points={pts} fill="none" stroke="#e46b36" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
   {temp.map((v,i)=><circle key={i} cx={44+i*43} cy={160-v*5.2} r="3.5" fill="#e46b36"/>)}
   {months.map((v,i)=><text key={i} x={44+i*43} y="186" fontSize="13" textAnchor="middle" fill="#335774">{v}</text>)}
   <text x="30" y="23" fontSize="13" fontWeight="bold" fill="#dc6334">°C</text><text x="536" y="23" fontSize="13" fontWeight="bold" fill="#3280b2">mm</text>
 </svg>;
}
function AltitudeChart({lang}:{lang:Lang}) {
 const values=[['0 м','+18 °C'],['1000 м','+12 °C'],['2000 м','+6 °C']];
 return <div className="lv-altitude" role="img" aria-label={lang==='ru'?'Температура уменьшается на 6 градусов при подъеме на 1000 метров':'Pro 1000 Meter sinkt die Temperatur in diesem Modell um sechs Grad'}>
  <svg viewBox="0 0 570 185" aria-hidden="true"><rect width="570" height="185" rx="14" fill="#d9effc"/><path d="M0 180 L90 140 L160 165 L320 30 L460 148 L570 120 L570 185Z" fill="#7aa78a"/><path d="M266 80 L320 30 L377 91 L341 80 L322 69 L299 98Z" fill="#fff"/><line x1="15" y1="149" x2="542" y2="149" stroke="#fff" strokeWidth="2" strokeDasharray="7 8"/><line x1="15" y1="93" x2="542" y2="93" stroke="#fff" strokeWidth="2" strokeDasharray="7 8"/></svg>
  <div className="lv-altitude-values">{values.map(([h,t])=><span key={h}><b>{h}</b><strong>{t}</strong></span>)}</div>
 </div>;
}
function Compass({lang}:{lang:Lang}) {
 return <div className="lv-compass">
   <div className="lv-compass-rose" role="img" aria-label={lang==='ru'?'Роза ветров: север сверху, юг снизу, запад слева, восток справа':'Windrose: Nord oben, Süd unten, West links und Ost rechts'}>
    <span className="n">N</span><span className="w">W</span><span className="e">O</span><span className="s">S</span><span className="axis">🧭</span>
   </div>
   <div className="lv-compass-copy"><strong>{lang==='ru'?'Ориентир на карте':'Orientierung'}</strong>
    <span>{lang==='ru'?'N — север':'N — Nord'}</span><span>{lang==='ru'?'O — восток':'O — Ost'}</span>
    <span>{lang==='ru'?'S — юг':'S — Süd'}</span><span>{lang==='ru'?'W — запад':'W — West'}</span>
   </div>
 </div>;
}
export default function LearningVisual({chapter,index,lang}:{chapter:number;index:number;lang:Lang}){
 const spec=learningVisuals[chapter]?.[index];
 if(!spec)return null;
 return <div className="lv-graphic">
   {spec.kind==='compass'?<Compass lang={lang}/>:
    spec.kind==='climate'?<ClimateChart lang={lang}/>:
    spec.kind==='altitude'?<AltitudeChart lang={lang}/>:
    <div className={`lv-tiles lv-${spec.kind}`}>{spec.tiles?.map((v,i)=><div className="lv-tile" key={i}>
      <span className="lv-icon" aria-hidden="true">{v.icon}</span><strong>{v.title[lang]}</strong><small>{v.detail[lang]}</small>
      {spec.kind==='flow'&&i!==(spec.tiles?.length??0)-1&&<i aria-hidden="true">→</i>}
    </div>)}</div>}
   <p className="lv-note">{spec.note[lang]}</p>
 </div>;
}
