import { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import GeoJSON from "ol/format/GeoJSON";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Fill, Stroke, Style, Text } from "ol/style";
import { fromLonLat, transformExtent } from "ol/proj";
import "ol/ol.css";
import { countries } from "./content";
import { t, type Lang } from "./ui";
const countriesDe: Record<string, {capital: string; note: string}> = {
  DEU:{capital:"Berlin",note:"Norddeutsches Tiefland, Mittelgebirge und Alpen am Südrand."},
  AUT:{capital:"Wien",note:"Große Teile Österreichs liegen in den Alpen. Temperatur und Pflanzenwelt verändern sich mit der Höhe."},
  ITA:{capital:"Rom",note:"Die Apenninhalbinsel ist stiefelförmig. Im Norden Italiens liegen die Alpen."},
  FRA:{capital:"Paris",note:"Atlantik im Westen, Mittelmeer im Süden. Das Klima ist innerhalb des Landes unterschiedlich."},
  NLD:{capital:"Amsterdam",note:"Rotterdam ist ein bedeutender Seehafen. Flaches Land, Kanäle und Nordsee prägen die Landschaft."},
  POL:{capital:"Warschau",note:"Ostsee im Norden und Gebirge im Süden, darunter die Karpaten."},
  ESP:{capital:"Madrid",note:"Große Teile liegen auf der Iberischen Halbinsel. In trockenen Gebieten ist Wassersparen wichtig."},
  GBR:{capital:"London",note:"Großbritannien ist eine Insel. Zum Vereinigten Königreich gehört außerdem Nordirland."},
  ISL:{capital:"Reykjavík",note:"Die Insel im Nordatlantik ist vollständig von Wasser umgeben."},
  NOR:{capital:"Oslo",note:"Westen der Skandinavischen Halbinsel: gebirgige Küsten mit Fjorden."},
  CHE:{capital:"Bern (Bundesstadt)",note:"Die Schweiz liegt in Europa und den Alpen, gehört aber nicht zur EU."},
  UKR:{capital:"Kyjiw",note:"Schwarzes Meer im Süden, Karpaten im Westen. International anerkannte Landesgrenzen."},
};
export default function MapScene({ lang }: { lang: Lang }) {
  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const source = useRef<VectorSource | null>(null);
  const selected = useRef("DEU");
  const [code, setCode] = useState("DEU");
  const [names, setNames] = useState<Record<string, string[]>>({});
  const [error, setError] = useState("");
  useEffect(() => {
    let alive = true;
    const src = new VectorSource();
    source.current = src;
    const layer = new VectorLayer({
      source: src,
      style: (f) =>
        new Style({
          fill: new Fill({
            color:
              f.get("ADM0_A3") === selected.current ? "#e5a858" : "#d4dfc5",
          }),
          stroke: new Stroke({ color: "#638174", width: 1 }),
          text: new Text({
            text: f.get("ADM0_A3") === selected.current ? f.get("NAME_DE") : "",
            font: "bold 14px sans-serif",
            fill: new Fill({ color: "#193f38" }),
            stroke: new Stroke({ color: "#fff", width: 3 }),
          }),
        }),
    });
    const map = new Map({
      target: el.current!,
      layers: [layer],
      view: new View({
        center: fromLonLat([15, 52]),
        zoom: 3.3,
        minZoom: 2,
        maxZoom: 7,
        extent: transformExtent([-35, 25, 65, 76], "EPSG:4326", "EPSG:3857"),
      }),
    });
    mapRef.current = map;
    map.on("singleclick", (e) => {
      const f = map.forEachFeatureAtPixel(e.pixel, (f) => f);
      if (f) {
        selected.current = f.get("ADM0_A3");
        setCode(selected.current);
        layer.changed();
      }
    });
    fetch(`${import.meta.env.BASE_URL}data/europe.geojson`)
      .then((r) => {
        if (!r.ok) throw Error();
        return r.json();
      })
      .then((data) => {
        if (!alive) return;
        const fs = new GeoJSON().readFeatures(data, {
          featureProjection: "EPSG:3857",
        });
        src.addFeatures(fs);
        setNames(
          Object.fromEntries(
            fs.map((f) => [
              f.get("ADM0_A3"),
              [f.get("NAME_RU"), f.get("NAME_DE")],
            ]),
          ),
        );
      })
      .catch(
        () =>
          alive &&
          setError("Не удалось загрузить карту. Проверь соединение и обнови страницу."),
      );
    return () => {
      alive = false;
      map.setTarget(undefined);
    };
  }, []);
  function choose(c: string) {
    selected.current = c;
    setCode(c);
    mapRef.current?.getLayers().item(0).changed();
    const feature = source.current
      ?.getFeatures()
      .find((f) => f.get("ADM0_A3") === c);
    if (feature)
      mapRef.current
        ?.getView()
        .fit(feature.getGeometry()!.getExtent(), {
          padding: [50, 50, 50, 50],
          maxZoom: 5,
        });
  }
  return (
    <>
      <div
        className="map"
        ref={el}
        aria-label={t(lang,"Интерактивная карта Европы. Страну также можно выбрать списком ниже.","Interaktive Europakarte. Ein Land kann auch aus der Liste unten gewählt werden.")}
        tabIndex={0}
      />
      {error && <p role="alert">{error}</p>}
      <div className="map-caption">
        Natural Earth · 1:110m · {t(lang,"политическая карта · север сверху","politische Karte · Norden oben")}
      </div>
      <div className="grid2">
        <label>
          {t(lang,"Исследовать страну","Land entdecken")}
          <select value={code} onChange={(e) => choose(e.target.value)}>
            {Object.entries(names)
              .sort((a, b) => a[1][lang === "ru" ? 0 : 1].localeCompare(b[1][lang === "ru" ? 0 : 1], lang === "ru" ? "ru" : "de"))
              .map(([k, n]) => (
                <option key={k} value={k}>
                  {lang === "ru" ? n[0] : n[1]} · {lang === "ru" ? n[1] : n[0]}
                </option>
              ))}
          </select>
        </label>
        <div>
          <b>{(lang === "ru" ? names[code]?.join(" · ") : names[code]?.slice().reverse().join(" · ")) || t(lang,"Германия · Deutschland","Deutschland · Германия")}</b>
          <p>
            {(lang === "ru" ? countries[code] : countriesDe[code])?.capital || t(lang,"Найди столицу в школьном атласе.","Finde die Hauptstadt im Atlas.")}
          </p>
          <p>
            {(lang === "ru" ? countries[code] : countriesDe[code])?.note ||
              t(lang,"Исследуй соседей и положение относительно морей. Сравни с физической картой атласа.","Untersuche Nachbarländer und die Lage zu den Meeren. Vergleiche mit einer physischen Atlaskarte.")}
          </p>
        </div>
      </div>
      <details>
        <summary>{t(lang,"Как читать карту и масштаб?","Wie liest man Karte und Maßstab?")}</summary>
        <p>
          {t(lang,"Легенда: зелёный — страны, охра — выбранная страна, голубой — вода. Карта обобщённая: маленькие государства могут отсутствовать в масштабе 1:110m. Проекция искажает размеры, особенно на севере.","Legende: Grün bedeutet Länder, Ocker das ausgewählte Land und Blau Wasser. Die Karte ist stark vereinfacht: Einige Kleinstaaten fehlen bei 1:110m. Die Projektion verzerrt Flächen besonders im Norden.")}
        </p>
        <p>
          {t(lang,"В атласе масштаб 1:1 000 000 означает: 1 см на бумаге равен 10 км в природе. Расстояние 3 см соответствует 30 км по прямой. Широта и долгота измеряются в градусах.","Im Atlas bedeutet 1:1 000 000: 1 cm auf Papier entspricht 10 km in der Wirklichkeit. 3 cm sind 30 km Luftlinie. Breiten- und Längengrade misst man in Grad.")}
        </p>
        <p>
          {t(lang,"Северное море — die Nordsee; Балтийское — die Ostsee; Средиземное — das Mittelmeer. Остров окружён водой, а полуостров соединён с материком.","Die Nordsee, die Ostsee und das Mittelmeer sind wichtige europäische Meere. Eine Insel ist vollständig von Wasser umgeben; eine Halbinsel ist mit dem Festland verbunden.")}
        </p>
      </details>
    </>
  );
}
