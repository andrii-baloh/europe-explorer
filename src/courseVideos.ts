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
  ruhr: { url: 'https://ru.euronews.com/2018/12/21/closure-german-coal-mine', title: 'В Германии закрыли последнюю шахту по добыче каменного угля', channel: 'Euronews по-русски', note: 'Русскоязычный видеорепортаж о Рурском бассейне; открывается на сайте источника.' },
  sectors: { url: 'https://rutube.ru/video/33cc5d2c1f95476723300849320d38f4/', rutubeId: '33cc5d2c1f95476723300849320d38f4', title: 'Хозяйство страны: три сектора экономики · видеоурок', channel: 'Онлайн-школа № 1 / RUTUBE', note: 'Примеры относятся к России; используй общую классификацию секторов экономики.' },
  tourism: { id: 'V4HBwi1KLfk', title: 'Ответственный туризм · обучающий фильм', channel: 'Фонд «Озеро Байкал»' },
  regions: { id: 'MxlZI59-cyg', title: 'Горы и горные формы рельефа · 5 класс', channel: 'Учебник вслух' },
  sustainable: { id: 'VxrNMbfFtH4', title: 'Воздействие человека на природные комплексы · 6 класс', channel: 'InternetUrok.ru' }
};

const selectedLessons: Record<string,string> = {
  'M01-01':'mapreading','M01-02':'compass','M01-03':'scale','M01-04':'scale',
  'M02-01':'mountains','M02-02':'regions','M02-04':'mountains',
  'M03-01':'citycountry','M03-02':'citycountry','M03-05':'citycountry',
  'M04-01':'citystructure','M04-02':'citystructure','M04-05':'citystructure',
  'M05-01':'milk','M05-02':'citycountry','M05-03':'citycountry','M05-05':'citycountry',
  'M06-03':'milk','M06-04':'milk',
  'M07-04':'bio',
  'M08-01':'sectors','M08-02':'sectors','M08-04':'ruhr','M08-05':'ruhr',
  'M09-01':'sectors','M09-03':'sectors','M09-05':'citycountry',
  'M10-01':'tourism','M10-04':'mountains','M10-05':'tourism',
  'M11-01':'sustainable','M11-03':'sustainable','M11-04':'tourism',
  'M12-02':'milk','M12-04':'tourism'
};

export function getLessonVideo(id: string, lang: Lang): CourseVideo | null {
  const topic = selectedLessons[id];
  if (!topic) return null;
  const clip = (lang === 'ru' ? ru : de)[topic];
  return clip ? {...clip, language:lang} : null;
}

export const curatedVideoCount = Object.keys(selectedLessons).length;
export const curatedVideoCountForLanguage = (lang: Lang) =>
  Object.values(selectedLessons).filter(topic => Boolean((lang === 'ru' ? ru : de)[topic])).length;

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
