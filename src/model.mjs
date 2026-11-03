export const chapters = [
  "Европа вокруг нас",
  "Лаборатория климата",
  "Европейская ферма",
  "Экспедиция в Альпы",
  "Путешествия и транспорт",
];
export const key = "europe-explorer-v1";
export function climateAxes(rows) {
  const low = Math.min(
    0,
    Math.floor(Math.min(...rows.map((r) => r.t)) / 10) * 10,
  );
  const high = Math.max(
    40,
    Math.ceil(Math.max(...rows.map((r) => Math.max(r.t, r.p / 2))) / 10) * 10,
  );
  return {
    temperature: [low, high],
    precipitation: [low * 2, high * 2],
    ticks: Array.from(
      { length: (high - low) / 10 + 1 },
      (_, i) => low + i * 10,
    ),
  };
}
export function moisture(t, p) {
  return t < 0
    ? "Холодный месяц: критерий засушливости не применяем"
    : p < 2 * t
      ? "arid · сухой"
      : p > 2 * t
        ? "humid · влажный"
        : "Граница: P = 2T";
}
export function mountainTemperature(height) {
  return Math.round((18 - 0.006 * height) * 10) / 10;
}
export function validateDiary(value) {
  if (
    !value ||
    value.version !== 1 ||
    !Array.isArray(value.entries) ||
    value.entries.length > 300
  )
    throw Error("Это не дневник «Европа» версии 1.");
  return {
    version: 1,
    entries: value.entries.map((e) => {
      if (
        !e ||
        !Number.isInteger(e.chapter) ||
        e.chapter < 0 ||
        e.chapter > 4 ||
        typeof e.text !== "string" ||
        e.text.length > 3000 ||
        typeof e.date !== "string" ||
        !Number.isFinite(Date.parse(e.date))
      )
        throw Error("В дневнике есть некорректная запись.");
      return { chapter: e.chapter, text: e.text, date: e.date };
    }),
  };
}
export function mergeDiaries(a, b) {
  const seen = new Set();
  return validateDiary({
    version: 1,
    entries: [...a.entries, ...b.entries].filter((e) => {
      const k = e.chapter + "|" + e.text + "|" + e.date;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    }),
  });
}
