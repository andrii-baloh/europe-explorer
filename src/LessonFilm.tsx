import { useState } from 'react';
import type { Lang } from './ui';
import { getChapterRussianVideo } from './courseVideos';
import './lessonFilm.css';

const germanFilms = [
  {
    title: 'Unser Bundesland Nordrhein-Westfalen',
    url: 'https://www.planet-schule.de/schwerpunkt/2-durch-nrw/unser-bundesland-film-100.html',
    task: 'Wo liegt NRW auf der Karte und welche Nachbarländer und Bundesländer grenzen daran?',
    topic: 'Kartenarbeit am Beispiel NRW (ergänzendes Regionalthema)'
  },
  {
    title: 'Westwind – Wetter vom Atlantik',
    url: 'https://www.planet-schule.de/schwerpunkt/unser-wetter/westwind-film-100.html',
    task: 'Warum beeinflusst der Atlantik das Wetter in Deutschland?',
    topic: 'Luftmassen, Wetter und Atlantikeinfluss'
  },
  {
    title: 'Von der Aussaat bis zur Ernte',
    url: 'https://www.planet-schule.de/schwerpunkt/weizen-sekundarstufe/von-der-aussaat-bis-zur-ernte-film-100.html',
    task: 'Welche drei Bedingungen braucht Weizen zum Wachsen?',
    topic: 'Getreideanbau und Wachstumsbedingungen'
  },
  {
    title: 'Murmeltier & Co. – Die Natur der Hochalpen',
    url: 'https://www.planet-schule.de/schwerpunkt/lebensraeume-auf-huegeln-und-bergen/murmeltier-co-die-natur-der-hochalpen-film-100.html',
    task: 'Wie unterscheiden sich die Bedingungen im Hochgebirge vom Tal?',
    topic: 'Höhenstufen und Leben in den Alpen'
  },
  {
    title: 'Münsterland – 2 durch NRW',
    url: 'https://www.planet-schule.de/schwerpunkt/2-durch-nrw/muensterland-film-100.html',
    task: 'Welche Verkehrswege und Wasserwege gibt es in der Region?',
    topic: 'Straßen und Wasserwege in der Region (Ergänzung zum Verkehrsthema)'
  }
];

const russianTasks = [
  'Чем географическая карта отличается от глобуса? Где посмотреть значение её условных знаков?',
  'Чем погода отличается от климата? Назови два климатообразующих фактора.',
  'Почему разные культуры выращивают в разных природных условиях?',
  'Какие формы рельефа характерны для гор? Чем горы отличаются от равнин?',
  'В чём преимущества железнодорожного и водного транспорта перед автомобильным для отдельных грузов?'
];

export default function LessonFilm({chapter,lang}:{chapter:number;lang:Lang}) {
  const [active,setActive]=useState(false);
  const de=germanFilms[chapter];
  const ru=getChapterRussianVideo(chapter);
  if (lang==='ru' && ru?.id) {
    const params=new URLSearchParams({rel:'0',playsinline:'1',cc_lang_pref:'ru'});
    if (ru.start!==undefined) params.set('start', String(ru.start));
    if (ru.end!==undefined) params.set('end',String(ru.end));
    const source=`https://www.youtube.com/watch?v=${ru.id}`;
    return <section className="lesson-film" aria-label="Русскоязычное учебное видео">
      <div className="lesson-film-main"><span aria-hidden="true">🎬</span><div>
        <h2>Учебное видео на русском языке</h2>
        <strong>{ru.title}</strong>
        <p>{ru.channel}</p>
      </div></div>
      <div className="lesson-film-task"><b>Задание после просмотра:</b> {russianTasks[chapter]}</div>
      <div className="lesson-film-player">
        {active ? <iframe title={ru.title} src={`https://www.youtube-nocookie.com/embed/${ru.id}?${params.toString()}`}
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /> :
          <div className="lesson-film-consent">
            <span aria-hidden="true">▶</span>
            <button type="button" onClick={()=>setActive(true)}>Смотреть видео на русском</button>
            <small>Видеоплеер YouTube загружается только после нажатия.</small>
          </div>}
      </div>
      {ru.note&&<p className="lesson-film-extra">{ru.note}</p>}
      <a href={source} target="_blank" rel="noopener noreferrer">Открыть ролик на YouTube ↗</a>
      <small>Видео размещено на платформе автора и не загружается на сервер Europe Explorer.</small>
    </section>;
  }
  if(!de)return null;
  return <section className="lesson-film" aria-label="Deutschsprachiges Lernvideo">
    <div className="lesson-film-main"><span aria-hidden="true">🎬</span><div>
      <h2>Deutschsprachiges Video · Planet Schule</h2>
      <strong>{de.title}</strong>
      <p>{de.topic}</p>
    </div></div>
    <div className="lesson-film-task"><b>Frage nach dem Film:</b> {de.task}</div>
    <a href={de.url} target="_blank" rel="noopener noreferrer">Film bei Planet Schule ansehen ↗</a>
    <small>Der Film öffnet sich auf der Website des Anbieters in einem neuen Tab.</small>
  </section>;
}
