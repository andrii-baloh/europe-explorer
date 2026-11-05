/**
 * Bilingual, independently curated video selection.
 * Selected videos stay on their owners' platforms; no video files are copied.
 * Never fall back to a German-language clip when Russian is selected.
 */
import type { Lang } from './ui';

export type CourseVideo = {
  id?: string;
  rutubeId?: string;
  url?: string;
  title: string;
  channel: string;
  duration?: string;
  start?: number;
  end?: number;
  language: Lang;
  note?: string;
};

const de: Record<string, Omit<CourseVideo,'language'>> = {
  mapreading: { id: 'vOlX4iZHEHM', title: 'Wie liest man eine Landkarte?', channel: 'sofatutor · Sachunterricht' },
  compass: { id: 'KH5uWiMJJu4', title: 'Die vier Himmelsrichtungen mit dem Kompass bestimmen', channel: 'Oberschule Kötitz' },
  scale: { id: 'GisW8YDnD4s', title: 'Maßstab berechnen und umrechnen', channel: 'Lehrerschmidt' },
  mountains: { id: 'BzwExUaUwwk', title: 'Die Gebirge Europas – einfach erklärt', channel: 'Rivoh erklärt' },
  citycountry: { id: 'mykPdkP3UVA', title: 'Wie unterscheiden sich Stadt und Land?', channel: 'SRF Kids · Clip und klar!' },
  citystructure: { id: 'r4VOGzAh_KY', title: 'Stadtgliederung einfach erklärt', channel: 'Geographie · simpleclub' },
  milk: { id: '5fVzjn2mmOo', title: 'Wie kommt die Milch in den Supermarkt?', channel: 'Unsere Bayerischen Bauern' },
  bio: { id: 'jk2AZmjveJk', title: 'Bio-Lebensmittel erkennen', channel: 'Bundeszentrum für Landwirtschaft', duration: '3:30' },
  ruhr: { id: 'PpKUjSqZnMU', title: 'Strukturwandel: vom Bergbau zur Dienstleistung', channel: 'erklaerung-und-mehr' },
  sectors: { id: 'YSvliFCRKD4', title: 'Die drei Wirtschaftssektoren', channel: 'Wirtschaft – animiert kapiert', duration: '~5 min' },
  tourism: { id: 'ubraV6Ly4Mo', title: 'Nachhaltiger Tourismus und seine Vorteile', channel: 'erklaerung-und-mehr', duration: '<5 min' },
  regions: { id: 'BzwExUaUwwk', title: 'Die Gebirge Europas – einfach erklärt', channel: 'Rivoh erklärt' },
  sustainable: { id: 'BYSkBldlQrY', title: 'Tourismus und Nachhaltigkeit', channel: 'WissensWerte' }
};

// Each entry is an actual Russian-language learning video or original source page.
// Videos about Russia show general principles; their examples are not claimed to be about Germany.
const ru: Record<string, Omit<CourseVideo,'language'>> = {
  mapreading: { id: '_YZT0b-kqIc', title: 'Глобус. Географическая карта · 5 класс', channel: 'Онлайн-школа № 1' },
  compass: { id: 'P1jBfKDCRfg', title: 'Ориентирование на местности · 5 класс', channel: 'InternetUrok.ru' },
  scale: { id: 'VlDP9cvHYB0', title: 'Масштаб карты · 5 класс', channel: 'GeoГРАФ' },
  mountains: { id: 'MxlZI59-cyg', title: 'Рельеф Земли. Горы · 5 класс', channel: 'Учебник вслух' },
  citycountry: { id: 'nbBvfaiiVZ0', title: 'Населённые пункты: города и сёла · 5 класс', channel: 'InternetUrok.ru' },
  citystructure: { id: 'nbBvfaiiVZ0', title: 'Населённые пункты и их обозначения на картах', channel: 'InternetUrok.ru', start: 26 },
  milk: { id: 'eVSa0EfY5lE', title: 'Как молоко проходит путь от фермы до магазина · фрагмент', channel: 'Молочный завод Садовое', start: 260, end: 450, note: 'Фрагмент интервью технолога: с 4:20 до 7:30.' },
  bio: { id: 'LEm7UnmOjjk', title: 'Органические продукты: правда или миф?', channel: 'AdMe', note: 'Объяснение отличий органических продуктов; сравнивай утверждения с правилами маркировки ЕС.' },
  ruhr: { id: 'n_jyBMnV8Gs', title: 'В ФРГ закрыли последнюю шахту по добыче угля', channel: 'Euronews по-русски', note: 'Репортаж о закрытии шахты в Боттропе — пример структурных изменений в Рурской области.' },
  sectors: { url: 'https://rutube.ru/video/33cc5d2c1f95476723300849320d38f4/', rutubeId: '33cc5d2c1f95476723300849320d38f4', title: 'Хозяйство страны: три сектора экономики · видеоурок', channel: 'Онлайн-школа № 1 / RUTUBE', note: 'Примеры относятся к России; используй общую классификацию секторов экономики.' },
  tourism: { id: 'V4HBwi1KLfk', title: 'Ответственный туризм · обучающий фильм', channel: 'Фонд «Озеро Байкал»' },
  regions: { id: 'MxlZI59-cyg', title: 'Горы и горные формы рельефа · 5 класс', channel: 'Учебник вслух' },
  sustainable: { id: 'VxrNMbfFtH4', title: 'Воздействие человека на природные комплексы · 6 класс', channel: 'InternetUrok.ru' }
};

const selectedLessons: Record<string,string> = {
  'M01-01':'mapreading','M01-02':'compass','M01-03':'mapreading','M01-04':'scale',
  'M02-01':'mapreading','M02-02':'regions','M02-04':'mountains',
  'M03-01':'citycountry','M03-02':'citycountry','M03-05':'citycountry',
  'M04-01':'citystructure','M04-02':'citystructure','M04-05':'citystructure',
  'M05-01':'milk','M05-02':'citycountry','M05-03':'citycountry','M05-05':'citycountry',
  'M06-03':'bread','M06-04':'milk',
  'M07-04':'bio',
  'M08-01':'industry','M08-02':'sectors','M08-04':'ruhr','M08-05':'industry',
  'M09-01':'sectors','M09-03':'sectors','M09-05':'citycountry',
  'M10-01':'tourism','M10-04':'mountains','M10-05':'tourism',
  'M11-01':'sustainable','M11-03':'sustainable','M11-04':'tourism',
  'M12-02':'milk','M12-04':'sustainable'
};


/** Additional lesson videos: real sources matched to the closest taught concept.
 * Some clips intentionally recur across related lessons; 60 lesson slots are not 60 unique films.
 * Sources and titles are language-specific and never fall back cross-language.
 */
const extraRu: Record<string,Omit<CourseVideo,'language'>> = {
 coordinates: {id:'7aaIxkxzFkI',title:'Географические координаты: широта и долгота · 5 класс',channel:'Онлайн-школа с 1 по 11 класс'},
 climate: {id:'17oAfWdAh1A',title:'Погода и климат · 6 класс',channel:'Онлайн-школа № 1'},
 agriculture: {id:'EpiSOycEB5g',title:'Растениеводство · вводный учебный фрагмент',channel:'Онлайн-школа № 1',start:0,end:360,note:'Примеры сельского хозяйства России иллюстрируют общие принципы.'},
 bread: {rutubeId:'a7599e7afc660da260c8c6a4c6a51f96',url:'https://rutube.ru/video/a7599e7afc660da260c8c6a4c6a51f96/',title:'Как делают хлеб: от поля до стола',channel:'Мама Кошка ТВ',duration:'3:39'},
 industry: {rutubeId:'02e222a57f9960d26caf4fa6d5728c25',url:'https://rutube.ru/video/02e222a57f9960d26caf4fa6d5728c25/',title:'Факторы размещения сельского хозяйства, промышленности и сферы услуг',channel:'Технический храм',duration:'6:14',note:'Материал старшей школы; для курса 5–6 классов важны факторы размещения.'},
 cityServices: {url:'https://www.kanal-o.ru/announce/16232',title:'Как устроен город: транспорт, службы и инфраструктура',channel:'Телеканал «О!»',note:'Детская серия: выбери подходящий короткий выпуск.'},
};
const extraDe: Record<string,Omit<CourseVideo,'language'>> = {
 coordinates: {id:'o3ttBW3oAcs',title:'Das Gradnetz der Erde – einfach erklärt',channel:'Rivoh erklärt'},
 climate: {id:'7x2AjYFg1fU',title:'Wetter ist nicht gleich Klima – Unterschiede erklärt',channel:'wetter.com'},
 agriculture: {url:'https://www.planet-schule.de/schwerpunkt/weizen-sekundarstufe/von-der-aussaat-bis-zur-ernte-film-100.html',title:'Von der Aussaat bis zur Ernte',channel:'Planet Schule · WDR'},
 bread: {url:'https://www.planet-schule.de/schwerpunkt/weizen-sekundarstufe/von-der-muehle-zum-brot-film-100.html',title:'Von der Mühle zum Brot',channel:'Planet Schule · WDR'},
 industry: {id:'YSvliFCRKD4',title:'Die drei Wirtschaftssektoren',channel:'Wirtschaft – animiert kapiert',note:'Grundlage für Standortfaktoren; der konkrete Standort wird in der Aufgabe analysiert.'},
 cityServices: {url:'https://www.planet-schule.de/schwerpunkt/leben-in-der-digitalen-welt/erklaers-mir-was-macht-eine-stadt-zu-einer-smart-city-film-100.html',title:'Was macht eine Stadt zu einer Smart City? – Verkehr und Infrastruktur',channel:'Planet Schule · SWR',note:'Schulfilm ab Klasse 5; Verfügbarkeit laut Anbieter bis 2030.'}
};

/** Adds a film to every remaining lesson, using closely related film material where necessary. */
const supplementalLessons: Record<string,string> = {
 'M01-05':'coordinates',
 'M02-03':'mapreading',
 'M02-05':'compass',
 'M03-03':'cityServices',
 'M03-04':'citycountry',
 'M04-03':'cityServices',
 'M04-04':'cityServices',
 'M05-04':'cityServices',
 'M06-01':'agriculture',
 'M06-02':'bread',
 'M06-05':'bread',
 'M07-01':'agriculture',
 'M07-02':'agriculture',
 'M07-03':'sustainable',
 'M07-05':'agriculture',
 'M08-03':'industry',
 'M09-02':'cityServices',
 'M09-04':'cityServices',
 'M10-02':'climate',
 'M10-03':'tourism',
 'M11-02':'tourism',
 'M11-05':'sustainable',
 'M12-01':'mapreading',
 'M12-03':'cityServices',
 'M12-05':'mapreading',
};

export function getLessonVideo(id: string, lang: Lang): CourseVideo | null {
  const topic = selectedLessons[id] ?? supplementalLessons[id];
  if (!topic) return null;
  const clips = lang === 'ru' ? {...ru,...extraRu} : {...de,...extraDe};
  const clip = clips[topic];
  return clip ? {...clip,language:lang} : null;
}

export const curatedVideoCount = Object.keys({...selectedLessons,...supplementalLessons}).length;
export const curatedVideoCountForLanguage = (lang: Lang) =>
  Object.keys({...selectedLessons,...supplementalLessons})
    .filter(id => Boolean(getLessonVideo(id,lang))).length;

const chapterRu: CourseVideo[] = [
  {...ru.mapreading, language:'ru'},
  {id:'17oAfWdAh1A',title:'Погода и климат · география 6 класс',channel:'Онлайн-школа № 1',language:'ru'},
  {id:'EpiSOycEB5g',title:'Растениеводство · вводный фрагмент',channel:'Онлайн-школа № 1',start:0,end:360,language:'ru',note:'Примеры из сельского хозяйства России; принципы роста растений применимы шире.'},
  {...ru.mountains,language:'ru'},
  {id:'fT3uidEqRVw',title:'Транспорт: автомобильный, железнодорожный и водный · фрагмент',channel:'Онлайн-школа № 1',start:0,end:665,language:'ru'}
];

export function getChapterRussianVideo(chapter: number): CourseVideo | null {
  return chapterRu[chapter] ?? null;
}
