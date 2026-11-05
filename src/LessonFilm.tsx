import type { Lang } from './ui';
import './lessonFilm.css';

const films = [
  {
    title: 'Unser Bundesland Nordrhein-Westfalen',
    url: 'https://www.planet-schule.de/schwerpunkt/2-durch-nrw/unser-bundesland-film-100.html',
    task: {ru:'Где на карте расположена NRW и какие страны или земли рядом?',de:'Wo liegt NRW auf der Karte, und welche Nachbarländer oder Bundesländer gibt es?'},
    topic: {ru:'Работа с картой на примере NRW (дополнительный региональный материал)',de:'Kartenarbeit am Beispiel NRW (ergänzendes Regionalthema)'}
  },
  {
    title: 'Westwind – Wetter vom Atlantik',
    url: 'https://www.planet-schule.de/schwerpunkt/unser-wetter/westwind-film-100.html',
    task: {ru:'Почему Атлантика влияет на погоду в Германии?',de:'Warum beeinflusst der Atlantik das Wetter in Deutschland?'},
    topic: {ru:'Воздушные массы, погода и влияние океана',de:'Luftmassen, Wetter und Atlantikeinfluss'}
  },
  {
    title: 'Von der Aussaat bis zur Ernte',
    url: 'https://www.planet-schule.de/schwerpunkt/weizen-sekundarstufe/von-der-aussaat-bis-zur-ernte-film-100.html',
    task: {ru:'Какие три условия нужны для роста пшеницы?',de:'Welche drei Bedingungen braucht Weizen zum Wachsen?'},
    topic: {ru:'Выращивание зерновых и условия для растений',de:'Getreideanbau und Wachstumsbedingungen'}
  },
  {
    title: 'Murmeltier & Co. – Die Natur der Hochalpen',
    url: 'https://www.planet-schule.de/schwerpunkt/lebensraeume-auf-huegeln-und-bergen/murmeltier-co-die-natur-der-hochalpen-film-100.html',
    task: {ru:'Чем условия жизни высоко в горах отличаются от долины?',de:'Wie unterscheidet sich das Hochgebirge vom Tal?'},
    topic: {ru:'Высотные пояса и жизнь в Альпах',de:'Höhenstufen und Leben in den Alpen'}
  },
  {
    title: 'Münsterland – 2 durch NRW',
    url: 'https://www.planet-schule.de/schwerpunkt/2-durch-nrw/muensterland-film-100.html',
    task: {ru:'Какие пути передвижения и водные объекты встречаются в регионе?',de:'Welche Verkehrswege und Wasserwege kommen in der Region vor?'},
    topic: {ru:'Региональные дороги и водные пути (дополнение к теме транспорта)',de:'Straßen und Wasserwege in der Region (Ergänzung zum Verkehrsthema)'}
  }
] as const;

export default function LessonFilm({chapter,lang}:{chapter:number;lang:Lang}){
 const film=films[chapter];
 if(!film)return null;
 return <section className="lesson-film" aria-label={lang==='ru'?'Учебное видео':'Lernvideo'}>
  <div className="lesson-film-main"><span aria-hidden="true">🎬</span><div>
    <h2>{lang==='ru'?'Видео по теме · Planet Schule':'Film zum Thema · Planet Schule'}</h2>
    <strong>{film.title}</strong>
    <p>{film.topic[lang]}</p>
  </div></div>
  <div className="lesson-film-task"><b>{lang==='ru'?'Вопрос после просмотра:':'Frage nach dem Film:'}</b> {film.task[lang]}</div>
  <a href={film.url} target="_blank" rel="noopener noreferrer">
    {lang==='ru'?'Смотреть на Planet Schule':'Film bei Planet Schule ansehen'} ↗
  </a>
  <small>{lang==='ru'?'Видео откроется на сайте правообладателя в новой вкладке; доступность зависит от этого сайта.':'Der Film öffnet sich auf der Seite des Anbieters in einem neuen Tab; die Verfügbarkeit wird dort bestimmt.'}</small>
 </section>;
}
