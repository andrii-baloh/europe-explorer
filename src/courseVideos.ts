/**
 * Curated educational clips. IDs and titles are verified against public school / publisher
 * pages; videos are embedded from the source, never mirrored or copied.
 * A deliberately short selection: never show a mismatched film just to fill a slot.
 */
export type CourseVideo = {
  id: string;
  title: string;
  channel: string;
  duration?: string;
  start?: number;
  end?: number;
};

const clips = {
  mapreading: { id: 'vOlX4iZHEHM', title: 'Wie liest man eine Landkarte?', channel: 'sofatutor · Sachunterricht' },
  compass: { id: 'KH5uWiMJJu4', title: 'Die vier Himmelsrichtungen mit dem Kompass bestimmen', channel: 'Oberschule Kötitz' },
  scale: { id: 'GisW8YDnD4s', title: 'Maßstab berechnen und umrechnen', channel: 'Lehrerschmidt' },
  grid: { id: 'L7mHlcGuA-4', title: 'Das Gradnetz der Erde', channel: 'Erklärvideo · Hessischer Bildungsserver', duration: '2:30' },
  mountains: { id: 'BzwExUaUwwk', title: 'Die Gebirge Europas – einfach erklärt', channel: 'Rivoh erklärt' },
  citycountry: { id: 'mykPdkP3UVA', title: 'Wie unterscheiden sich Stadt und Land?', channel: 'SRF Kids · Clip und klar!' },
  citystructure: { id: 'r4VOGzAh_KY', title: 'Stadtgliederung einfach erklärt', channel: 'Erdkunde · Unterrichtsvideo' },
  agriculture: { id: '5LXynl4AAv8', title: 'Unterschiede in der Landwirtschaft', channel: 'logo! · ZDFtivi', duration: '1:25' },
  milk: { id: '5fVzjn2mmOo', title: 'Wie kommt die Milch in den Supermarkt?', channel: 'Unsere Bayerischen Bauern' },
  bio: { id: 'jk2AZmjveJk', title: 'Bio-Lebensmittel erkennen', channel: 'Bundesinformationszentrum Landwirtschaft', duration: '3:30' },
  ruhr: { id: 'PpKUjSqZnMU', title: 'Strukturwandel: vom Bergbau zur Dienstleistung', channel: 'Erdkunde · Erklärvideo' },
  sectors: { id: 'YSvliFCRKD4', title: 'Die drei Wirtschaftssektoren', channel: 'Wirtschaft – animiert kapiert', duration: '~5 min' },
  tourism: { id: 'ubraV6Ly4Mo', title: 'Nachhaltiger Tourismus und seine Vorteile', channel: 'erklaerung-und-mehr', duration: '<5 min' },
  regions: { id: 'BzwExUaUwwk', title: 'Die Gebirge Europas – einfach erklärt', channel: 'Rivoh erklärt' },
  sustainable: { id: 'BYSkBldlQrY', title: 'Tourismus und Nachhaltigkeit', channel: 'WissensWerte' },
} satisfies Record<string, CourseVideo>;

/** Video is only assigned when the subject is close enough to the lesson's question. */
const selectedLessons: Record<string, keyof typeof clips> = {
  'M01-01':'mapreading','M01-02':'compass','M01-03':'scale','M01-04':'scale','M01-05':'grid',
  'M02-01':'mountains','M02-02':'regions','M02-04':'mountains',
  'M03-01':'citycountry','M03-02':'citycountry','M03-05':'citycountry',
  'M04-01':'citystructure','M04-02':'citystructure','M04-05':'citystructure',
  'M05-01':'milk','M05-02':'citycountry','M05-03':'citycountry','M05-05':'citycountry',
  'M06-01':'agriculture','M06-02':'agriculture','M06-03':'milk','M06-04':'milk',
  'M07-01':'agriculture','M07-03':'agriculture','M07-04':'bio',
  'M08-01':'sectors','M08-02':'sectors','M08-04':'ruhr','M08-05':'ruhr',
  'M09-01':'sectors','M09-03':'sectors','M09-05':'citycountry',
  'M10-01':'tourism','M10-04':'mountains','M10-05':'tourism',
  'M11-01':'sustainable','M11-03':'sustainable','M11-04':'tourism',
  'M12-01':'grid','M12-02':'milk','M12-04':'tourism',
};

export function getLessonVideo(id: string): CourseVideo | null {
  const clip = selectedLessons[id];
  return clip ? clips[clip] : null;
}

export const curatedVideoCount = Object.keys(selectedLessons).length;
