/** Curated, language-specific educational videos; copyright stays with the source. */
import type { Lang } from './ui';
import catalogue from './lessonVideosUnique.json';

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
  fit?: 'direct' | 'related';
  note?: string;
};

const lessons = catalogue as Record<string, Record<Lang, CourseVideo>>;

/** Each of the 60 lessons has a different source per language, not a reused clip. */
export function getLessonVideo(id: string, lang: Lang): CourseVideo | null {
  return lessons[id]?.[lang] ?? null;
}
export const curatedVideoCount = Object.keys(lessons).length;
export function curatedVideoCountForLanguage(lang: Lang): number {
  return Object.values(lessons).filter(item => Boolean(item[lang])).length;
}

/** Five additional narrative expeditions, distinct from the 60-lesson curriculum. */
const chapterRu: CourseVideo[] = [
  {id:'_YZT0b-kqIc',title:'Глобус. Географическая карта',channel:'Онлайн-школа с 1 по 11 класс',language:'ru'},
  {id:'17oAfWdAh1A',title:'Погода и климат — география 6 класс',channel:'Онлайн-школа с 1 по 11 класс',language:'ru'},
  {id:'EpiSOycEB5g',title:'Растениеводство — учебный фрагмент',channel:'Онлайн-школа с 1 по 11 класс',start:0,end:360,language:'ru',note:'Примеры относятся к России; смотри общие принципы выращивания.'},
  {id:'MxlZI59-cyg',title:'Рельеф Земли. Горы',channel:'Учебник вслух',language:'ru'},
  {id:'fT3uidEqRVw',title:'Транспорт — учебный фрагмент',channel:'Онлайн-школа с 1 по 11 класс',start:0,end:665,language:'ru'},
];
export function getChapterRussianVideo(chapter: number): CourseVideo | null {
  return chapterRu[chapter] ?? null;
}
