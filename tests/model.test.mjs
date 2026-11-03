import test from "node:test";
import assert from "node:assert/strict";
import {
  climateAxes,
  moisture,
  mountainTemperature,
  validateDiary,
  mergeDiaries,
} from "../src/model.mjs";
import { readFileSync } from "node:fs";
test("climate axes share zero and exact 1:2 ratio across all realistic values", () => {
  for (let t = -40; t <= 45; t += 5)
    for (let p = 0; p <= 400; p += 5) {
      const a = climateAxes([{ t, p }]);
      assert.deepEqual(
        a.precipitation,
        a.temperature.map((x) => x * 2),
      );
      const yT = (t - a.temperature[0]) / (a.temperature[1] - a.temperature[0]);
      const yP =
        (2 * t - a.precipitation[0]) /
        (a.precipitation[1] - a.precipitation[0]);
      assert.equal(yT, yP);
      assert.ok(p <= a.precipitation[1]);
    }
});
test("moisture handles dry, wet, boundary, freezing", () => {
  assert.match(moisture(20, 25), /arid/);
  assert.match(moisture(20, 60), /humid/);
  assert.match(moisture(20, 40), /Граница/);
  assert.match(moisture(-5, 10), /не применяем/);
});
test("altitude calculation", () => {
  assert.equal(mountainTemperature(0), 18);
  assert.equal(mountainTemperature(2000), 6);
  assert.equal(mountainTemperature(3000), 0);
});
const entry = { chapter: 1, text: "Наблюдение", date: "2026-11-03T12:00:00Z" };
test("diary JSON roundtrip and merge keep existing observations", () => {
  const d = { version: 1, entries: [entry] };
  assert.deepEqual(validateDiary(JSON.parse(JSON.stringify(d))), d);
  assert.deepEqual(mergeDiaries(d, d), d);
  assert.equal(
    mergeDiaries(d, { version: 1, entries: [{ ...entry, chapter: 3 }] }).entries
      .length,
    2,
  );
});
test("reject invalid diary without replacing current diary", () => {
  for (const d of [
    null,
    {},
    { version: 2, entries: [] },
    { version: 1, entries: [{ ...entry, chapter: 8 }] },
    { version: 1, entries: [{ ...entry, date: "bad" }] },
    { version: 1, entries: [{ ...entry, text: 4 }] },
  ])
    assert.throws(() => validateDiary(d));
});
test("map size and Crimea attribution", () => {
  const raw = readFileSync(
    new URL("../public/data/europe.geojson", import.meta.url),
  );
  assert.ok(raw.length < 250000);
  const data = JSON.parse(raw);
  const ua = data.features.find((f) => f.properties.ADM0_A3 === "UKR");
  assert.equal(ua.geometry.type, "MultiPolygon");
  assert.ok(
    ua.geometry.coordinates.some((p) =>
      p[0].some((c) => c[0] > 33 && c[0] < 35 && c[1] < 45),
    ),
  );
});
