import { useState } from "react";
import { mountainTemperature } from "./model.mjs";
import { t, type Lang } from "./ui";
export function Farm({ lang }: { lang: Lang }) {
  const [region, setRegion] = useState("west");
  const [crop, setCrop] = useState("grass");
  const [water, setWater] = useState("rain");
  const southern = region === "south";
  const bad = crop === "citrus" && !southern;
  const dry = southern && water === "rain";
  return (
    <>
      <div className="farm-art" aria-hidden="true">
        <span>{southern ? "☀" : "☁"}</span>
        <div className="plants">
          {Array.from({ length: 7 }, (_, i) => (
            <span key={i}>
              {bad
                ? "❄"
                : crop === "citrus"
                  ? "🍊"
                  : crop === "wheat"
                    ? "🌾"
                    : "🌿"}
            </span>
          ))}
        </div>
        <div className="soil" />
      </div>
      <div className="grid3">
        <label>
          {t(lang, "Регион", "Region")}
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="west">{t(lang, "Влажный запад Европы", "Feuchter Westen Europas")}</option>
            <option value="north">{t(lang, "Прохладный север", "Kühler Norden")}</option>
            <option value="south">{t(lang, "Средиземноморье летом", "Mittelmeerraum im Sommer")}</option>
          </select>
        </label>
        <label>
          {t(lang, "Культура", "Nutzpflanze")}
          <select value={crop} onChange={(e) => setCrop(e.target.value)}>
            <option value="grass">{t(lang, "Кормовые травы", "Futtergras")}</option>
            <option value="wheat">{t(lang, "Пшеница", "Weizen")}</option>
            <option value="citrus">{t(lang, "Цитрусовые", "Zitrusfrüchte")}</option>
          </select>
        </label>
        <label>
          {t(lang, "Вода", "Wasser")}
          <select value={water} onChange={(e) => setWater(e.target.value)}>
            <option value="rain">{t(lang, "Только дождь", "Nur Regen")}</option>
            <option value="sprinkler">{t(lang, "Дождевание", "Beregnung")}</option>
            <option value="drip">{t(lang, "Капельный полив", "Tröpfchenbewässerung")}</option>
          </select>
        </label>
      </div>
      <div className="result">
        <b>
          {bad
            ? t(lang, "Цитрусовым не хватает тепла", "Zitrusfrüchte brauchen mehr Wärme")
            : dry
              ? t(lang, "Летом возникает дефицит воды", "Im Sommer fehlt Wasser")
              : t(lang, "Условия могут подходить", "Die Bedingungen können passen")}
        </b>
        <p>
          {bad
            ? t(lang, "Цитрусовые чувствительны к морозу. В открытом грунте прохладного севера это ненадёжный выбор. Полив не решит проблему холода.", "Zitrusfrüchte vertragen Frost schlecht. Im kühlen Norden ist der Anbau im Freien riskant. Gießen kann Kälte nicht ausgleichen.")
            : dry
              ? t(lang, "Дождей летом мало. Для трав и многих культур потребуется вода. Озимая пшеница может использовать зимние осадки и созревать до сильной летней засухи.", "Im Sommer fällt wenig Regen. Viele Pflanzen brauchen dann zusätzliches Wasser. Winterweizen kann Winterregen nutzen und vor der stärksten Sommerdürre reifen.")
              : t(lang, "Подходящие тепло и вода — начало. Нужны также подходящая почва, сорт, уход и экономически доступные ресурсы.", "Wärme und Wasser sind nur der Anfang. Auch Boden, Sorte, Pflege und bezahlbare Ressourcen sind wichtig.")}
        </p>
        <p>
          {water === "drip"
            ? t(lang, "Капельный полив доставляет воду к корням и может уменьшать испарение. Нужны трубки, обслуживание и доступный источник воды.", "Bei Tröpfchenbewässerung gelangt Wasser direkt zu den Wurzeln. Das kann Verdunstung verringern; nötig sind Rohre, Wartung und eine Wasserquelle.")
            : water === "sprinkler"
              ? t(lang, "Дождевание охватывает площадь, но часть воды теряется из-за ветра и испарения.", "Beregnung erreicht eine große Fläche, doch durch Wind und Verdunstung geht Wasser verloren.")
              : t(lang, "При достаточных осадках возможно земледелие без искусственного полива — Regenfeldbau.", "Bei genug Regen ist Ackerbau ohne künstliche Bewässerung möglich: Regenfeldbau.")}
        </p>
      </div>
      <small>
        {t(lang, "Качественная учебная модель: она объясняет связи, а не предсказывает урожай.", "Vereinfachtes Lernmodell: Es zeigt Zusammenhänge, keine Ernteprognosen.")}
      </small>
    </>
  );
}
export function Alps({ lang }: { lang: Lang }) {
  const [height, setHeight] = useState(0);
  const [plates, setPlates] = useState(0);
  const zone =
    height < 900
      ? t(lang, "Долина: поля, поселения и леса", "Tal: Felder, Siedlungen und Wälder")
      : height < 1800
        ? t(lang, "Горные леса", "Bergwälder")
        : height < 2500
          ? t(lang, "Альпийские луга и кустарники", "Alpine Wiesen und Sträucher")
          : t(lang, "Скалы, осыпи, снег и ледники в подходящих условиях", "Fels, Geröll, Schnee und Gletscher unter passenden Bedingungen");
  return (
    <>
      <div className="mountain">
        <svg
          viewBox="0 0 760 330"
          role="img"
          aria-label={t(lang, "Условный горный склон с путешественником", "Vereinfachter Berghang mit Wanderer")}
        >
          <rect width="760" height="330" fill="#dcebed" />
          <circle cx="650" cy="60" r="30" fill="#f4c578" />
          <path d="M0 330L260 60 430 330Z" fill="#a7b9ac" />
          <path d="M180 330L465 20 760 330Z" fill="#879e8e" />
          <path
            d="M365 130L465 20 550 110 495 92 467 118 440 85 410 130Z"
            fill="#faf8ee"
          />
          <path
            d="M0 330L140 235 290 280 370 220 500 290 650 240 760 300V330Z"
            fill="#527b55"
          />
          <text x={160 + height / 12} y={300 - height / 12} fontSize="30">
            ●
          </text>
          <text x="24" y="40" fill="#173e38" fontSize="23">
            {mountainTemperature(height)} °C
          </text>
        </svg>
      </div>
      <label>
        {t(lang, "Подъём над долиной", "Höhe über dem Tal")} : {height} m
        <input
          type="range"
          min="0"
          max="3000"
          step="100"
          value={height}
          onChange={(e) => setHeight(+e.target.value)}
        />
      </label>
      <div className="result">
        <b>{zone}</b>
        <p>
          18 − 0,6 × ({height} ÷ 100) = {mountainTemperature(height)} °C
        </p>
        <p>
          {t(lang, "Условные пояса и высоты. На настоящем склоне их границы могут быть другими; снег зависит также от сезона и осадков.", "Vereinfachte Höhenstufen: In der Wirklichkeit verlaufen die Grenzen anders. Schnee hängt auch von Jahreszeit und Niederschlag ab.")}
        </p>
      </div>
      <details>
        <summary>{t(lang, "Лаборатория горообразования", "Labor zur Gebirgsbildung")}</summary>
        <p>
          {t(lang, "Сдвигай края модели: сжатие создаёт складки. Это аналогия, а не точная модель плит.", "Schiebe die Modellränder zusammen: Druck erzeugt Falten. Dies ist nur ein Vergleich, kein maßstabgerechtes Plattenmodell.")}
        </p>
        <label>
          {t(lang, "Сжатие пород", "Zusammendrücken von Gestein")}
          <input
            type="range"
            min="0"
            max="100"
            value={plates}
            onChange={(e) => setPlates(+e.target.value)}
          />
        </label>
        <svg
          viewBox="0 0 600 140"
          role="img"
          aria-label={t(lang, "Складки пород при сжатии", "Gesteinsfalten durch Druck")}
        >
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M20 ${100 + i * 12} Q160 ${100 - plates + i * 12} 300 ${100 + i * 12} Q440 ${100 - plates + i * 12} 580 ${100 + i * 12}`}
              fill="none"
              stroke={["#ba8556", "#c8a36f", "#dbc596"][i]}
              strokeWidth="10"
            />
          ))}
        </svg>
        <p>
          {t(lang, "Поднятие и эрозия действуют вместе. Потепление и оттаивание мёрзлых пород могут делать отдельные склоны менее устойчивыми.", "Hebung und Erosion wirken zusammen. Erwärmung und tauender Permafrost können einzelne Hänge instabiler machen.")}
        </p>
      </details>
    </>
  );
}
export function Travel({ lang }: { lang: Lang }) {
  const [mode, setMode] = useState("train");
  const [guests, setGuests] = useState(100);
  const [saving, setSaving] = useState(false);
  const [cargo, setCargo] = useState("rail");
  const demand = guests * (saving ? 100 : 150);
  return (
    <>
      <div className="route">
        <span>
          ⚓<b>{t(lang, "Роттердам", "Rotterdam")}</b>
          <small>{t(lang, "Морской порт", "Seehafen")}</small>
        </span>
        <span className="route-line">→</span>
        <span>
          {cargo === "rail" ? "🚆" : cargo === "river" ? "⛴" : "🚚"}
          <b>{t(lang, "Перегрузка", "Umladen")}</b>
          <small>{t(lang, "Транспортный узел", "Verkehrsknoten")}</small>
        </span>
        <span className="route-line">→</span>
        <span>
          ▦<b>{t(lang, "Внутри Европы", "Im Inneren Europas")}</b>
          <small>{t(lang, "Предприятие", "Betrieb")}</small>
        </span>
      </div>
      <label>
        {t(lang, "Как отправить контейнер дальше?", "Wie geht es für den Container weiter?")}
        <select value={cargo} onChange={(e) => setCargo(e.target.value)}>
          <option value="rail">{t(lang, "По железной дороге", "Mit der Bahn")}</option>
          <option value="river">{t(lang, "По реке", "Auf dem Fluss")}</option>
          <option value="road">{t(lang, "Грузовиком", "Mit dem Lkw")}</option>
        </select>
      </label>
      <p>
        {cargo === "rail"
          ? t(lang, "Поезд перевозит много контейнеров, но нужны пути и терминал. Последний участок может потребовать грузовика.", "Die Bahn transportiert viele Container, benötigt aber Gleise und ein Terminal. Für den letzten Abschnitt ist vielleicht ein Lkw nötig.")
          : cargo === "river"
            ? t(lang, "Речное судно перевозит большой груз, но зависит от водных путей и уровня воды.", "Ein Binnenschiff befördert viel Fracht, ist aber von Wasserwegen und Wasserständen abhängig.")
            : t(lang, "Грузовик может довезти груз до двери, но увеличивает нагрузку на дороги. Важны расстояние и загрузка.", "Ein Lkw kann direkt anliefern, belastet aber die Straßen. Entfernung und Auslastung sind wichtig.")}
      </p>
      <hr />
      <h3>{t(lang, "Теперь спланируй горный курорт", "Plane jetzt einen Bergurlaubsort")}</h3>
      <div className="grid2">
        <label>
          {t(lang, "Как приезжают гости?", "Wie reisen die Gäste an?")}
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="train">{t(lang, "Поезд + местный автобус", "Bahn + Ortsbus")}</option>
            <option value="car">{t(lang, "Автомобиль", "Auto")}</option>
          </select>
        </label>
        <label>
          {t(lang, "Гостей за сутки", "Gäste pro Tag")}: {guests}
          <input
            type="range"
            min="100"
            max="1000"
            step="100"
            value={guests}
            onChange={(e) => setGuests(+e.target.value)}
          />
        </label>
      </div>
      <label className="check">
        <input
          type="checkbox"
          checked={saving}
          onChange={(e) => setSaving(e.target.checked)}
        />{" "}
        {t(lang, "Включить меры экономии воды", "Wassersparen einschalten")}
      </label>
      <div className="result">
        <b>{demand.toLocaleString(lang === "ru" ? "ru-RU" : "de-DE")} {t(lang, "литров воды в сутки", "Liter Wasser pro Tag")}</b>
        <p>
          {t(lang, "Условие задачи", "Aufgabenannahme")}: {saving ? 100 : 150} {t(lang, "л на гостя в сутки. При условном доступном объёме 60 000 л", "Liter pro Gast und Tag. Bei angenommenen 60 000 Litern")}{" "}
          {demand > 60000
            ? t(lang, "спрос превышает ресурс: нужно ограничить нагрузку или найти устойчивое решение.", "übersteigt der Bedarf das Angebot. Es braucht eine Begrenzung oder eine nachhaltige Lösung.")
            : t(lang, "этого объёма хватает для гостей. Нужно учитывать также местных жителей и природу.", "reicht diese Menge für die Gäste. Auch Einheimische und die Natur benötigen Wasser.")}
        </p>
        <p>
          {mode === "train"
            ? t(lang, "Общественный транспорт может уменьшать число машин и потребность в парковках. Нужны удобное расписание и доступность.", "Öffentliche Verkehrsmittel können Autos und Parkplätze einsparen. Fahrpläne und Erreichbarkeit müssen stimmen.")
            : t(lang, "Автомобиль удобен для багажа, но при большом потоке нужны парковки и возникают пробки. Совместные поездки уменьшают число машин.", "Das Auto ist praktisch für Gepäck. Bei vielen Gästen entstehen jedoch Staus und Parkplatzbedarf. Fahrgemeinschaften helfen.")}
        </p>
      </div>
      <small>
        {t(lang, "Все числа — условия учебной задачи, не статистика реального курорта.", "Alle Zahlen sind Annahmen der Aufgabe, keine Statistik eines echten Urlaubsorts.")}
      </small>
    </>
  );
}
