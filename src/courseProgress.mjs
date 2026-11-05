/**
 * Backup format for the 60-lesson course, separate from the original five-scene diary.
 * Old browser data is never erased or silently replaced by an imported backup.
 */
export const COURSE_KIND = 'europe-explorer-course';
export const COURSE_VERSION = 1;

/**
 * @param {{completed:string[],notes:Record<string,string>}} progress
 */
export function serializeCourseProgress(progress) {
  return JSON.stringify({
    kind: COURSE_KIND,
    version: COURSE_VERSION,
    completed: [...new Set(progress.completed)].sort(),
    notes: progress.notes,
  }, null, 2);
}

/**
 * @param {{completed:string[],notes:Record<string,string>}} current
 * @param {unknown} data
 * @param {Set<string>} known
 * @returns {{completed:string[],notes:Record<string,string>}}
 */
export function mergeCourseProgress(current, data, known) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw Error('Invalid course backup');
  }
  const src = /** @type {{kind?:unknown,version?:unknown,completed?:unknown,notes?:unknown}} */(data);
  if (src.kind !== COURSE_KIND || src.version !== COURSE_VERSION) {
    throw Error('Wrong backup format or version');
  }
  if (!Array.isArray(src.completed) || src.completed.length > 60 ||
      !src.completed.every(x => typeof x === 'string' && known.has(x))) {
    throw Error('Invalid completed lesson IDs');
  }
  const n = src.notes;
  if (!n || typeof n !== 'object' || Array.isArray(n)) {
    throw Error('Invalid notes');
  }
  const entries = Object.entries(n);
  if (entries.length > 60 ||
      !entries.every(([id,text]) => known.has(id) && typeof text === 'string' && text.length <= 1500)) {
    throw Error('Invalid course notes');
  }
  // Keep existing notes when non-empty, recover notes from the backup when absent.
  const notes = {...current.notes};
  for (const [id,value] of entries) if (!notes[id] && value) notes[id]=/** @type {string} */(value);
  return {
    completed: [...new Set([...current.completed,...src.completed])].filter(x=>known.has(x)),
    notes,
  };
}
