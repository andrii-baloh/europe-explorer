import { useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { climateAxes, moisture } from "./model.mjs";
import { t, type Lang } from "./ui";
const monthsRu = [
  "Янв",
  "Фев",
  "Мар",
  "Апр",
  "Май",
  "Июн",
  "Июл",
  "Авг",
  "Сен",
  "Окт",
  "Ноя",
  "Дек",
];
const presets = [
  {
    name: "Морской · Seeklima",
    t: [5, 5, 7, 10, 13, 16, 18, 18, 15, 12, 8, 6],
    p: [75, 55, 60, 50, 55, 60, 65, 70, 70, 85, 85, 80],
  },
  {
    name: "Континентальный · Landklima",
    t: [-8, -6, 0, 8, 15, 19, 22, 20, 14, 7, 0, -5],
    p: [30, 25, 30, 40, 55, 65, 70, 55, 45, 40, 35, 30],
  },
  {
    name: "Средиземноморский",
    t: [10, 11, 13, 16, 20, 24, 27, 27, 24, 19, 14, 11],
    p: [75, 65, 55, 45, 30, 15, 5, 10, 45, 80, 95, 90],
  },
];
const monthsDe = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
function moistureByLang(temp: number, precip: number, lang: Lang) {
  if (lang === "ru") return moisture(temp, precip);
  if (temp < 0) return "Kalter Monat: Trockenheitsregel nicht anwenden";
  if (precip < 2 * temp) return "arid · trocken";
  if (precip > 2 * temp) return "humid · feucht";
  return "Grenze: P = 2T";
}
export default function ClimateScene({ lang }: { lang: Lang }) {
  const [preset, setPreset] = useState(0);
  const [month, setMonth] = useState(6);
  const [extra, setExtra] = useState(0);
  const months = lang === "ru" ? monthsRu : monthsDe;
  const data = months.map((m, i) => ({
    m,
    t: presets[preset].t[i],
    p: presets[preset].p[i] + (i === month ? extra : 0),
  }));
  const axes = climateAxes(data);
  const row = data[month];
  return (
    <>
      <div className="segmented">
        {presets.map((p, i) => (
          <button
            key={p.name}
            aria-pressed={preset === i}
            onClick={() => {
              setPreset(i);
              setExtra(0);
            }}
          >
            {i === 0 ? t(lang, "Морской · Seeklima", "Seeklima") : i === 1 ? t(lang, "Континентальный · Landklima", "Landklima") : t(lang, "Средиземноморский", "Mittelmeerklima")}
          </button>
        ))}
      </div>
      <div className="notice">
        {t(lang, "Учебные данные, не климатическая норма конкретного города. Красная линия — температура; синие столбики — осадки.", "Beispieldaten, keine Klimanorm einer echten Stadt. Die rote Linie zeigt die Temperatur, die blauen Balken den Niederschlag.")}
      </div>
      <div
        className="chart"
        role="img"
        aria-label={t(lang,"Климатограмма, значения также доступны в таблице ниже","Klimadiagramm, Werte auch in der Tabelle unten")}
      >
        <ResponsiveContainer width="100%" height={340}>
          <ComposedChart
            data={data}
            margin={{ top: 25, right: 10, bottom: 10, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 5" vertical={false} />
            <XAxis dataKey="m" tick={{ fontSize: 11 }} />
            <YAxis
              yAxisId="temperature"
              domain={axes.temperature}
              ticks={axes.ticks}
              allowDataOverflow
              label={{ value: "°C", position: "top" }}
              width={40}
            />
            <YAxis
              yAxisId="precipitation"
              orientation="right"
              domain={axes.precipitation}
              ticks={axes.ticks
                .filter((n: number) => n >= 0)
                .map((n: number) => n * 2)}
              allowDataOverflow
              label={{ value: "мм", position: "top" }}
              width={45}
            />
            <Tooltip />
            <ReferenceLine yAxisId="temperature" y={0} stroke="#526b62" />
            <Bar
              yAxisId="precipitation"
              dataKey="p"
              name={t(lang,"Осадки, мм","Niederschlag, mm")}
              fill="#71aabd"
              radius={[3, 3, 0, 0]}
              isAnimationActive={false}
            />
            <Line
              yAxisId="temperature"
              dataKey="t"
              name={t(lang,"Температура, °C","Temperatur, °C")}
              stroke="#ba503d"
              strokeWidth={3}
              dot={{ r: 3 }}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="grid2">
        <label>
          {t(lang,"Месяц","Monat")}
          <select
            value={month}
            onChange={(e) => {
              setMonth(+e.target.value);
              setExtra(0);
            }}
          >
            {months.map((m, i) => (
              <option key={m} value={i}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t(lang,"Добавить дождь","Zusätzlicher Niederschlag")}: {extra} mm
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={extra}
            onChange={(e) => setExtra(+e.target.value)}
          />
        </label>
      </div>
      <div className="result">
        <b>
          {row.m}: {row.t} °C · {row.p} mm → {moistureByLang(row.t, row.p, lang)}
        </b>
        <p>
          {t(lang,"При T ≥ 0 сравни P с 2T.", "Bei T ≥ 0: Vergleiche P mit 2T.")} 2 × {row.t} = {2 * row.t}. {t(lang,"Годовая амплитуда", "Jahresamplitude")}:{" "}
          {Math.max(...data.map((r) => r.t)) -
            Math.min(...data.map((r) => r.t))}{" "}
          °C.
        </p>
      </div>
      <details>
        <summary>{t(lang,"Почему шкалы 1:2? Посмотреть значения","Warum Skalen 1:2? Werte anzeigen")}</summary>
        <p>
          {t(lang,
            "10 °C слева соответствует 20 мм справа, а 0 °C и 0 мм лежат на одной линии. Если P < 2T, месяц считается сухим по этому учебному критерию. Отрицательных осадков не бывает. Здесь шкалы линейные; в других атласах они могут быть оформлены иначе — всегда смотри легенду.",
            "10 °C links entsprechen 20 mm rechts; 0 °C und 0 mm liegen auf derselben Linie. Bei P < 2T gilt ein Monat nach dieser Unterrichtsregel als trocken. Negative Niederschläge gibt es nicht. Hier sind die Skalen linear; lies immer die Legende deines Atlas.")}
        </p>
        <table>
          <thead>
            <tr>
              <th>{t(lang,"Месяц","Monat")}</th>
              <th>°C</th>
              <th>mm</th>
              <th>{t(lang,"Наблюдение","Beobachtung")}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r) => (
              <tr key={r.m}>
                <td>{r.m}</td>
                <td>{r.t}</td>
                <td>{r.p}</td>
                <td>{moistureByLang(r.t, r.p, lang)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </>
  );
}
