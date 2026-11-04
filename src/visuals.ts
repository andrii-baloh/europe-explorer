export type Fact = { icon: string; title: string; text: string };
export const chapterArt = ["europe", "climate", "farm", "alps", "travel"] as const;
export const chapterSymbols = ["🧭", "🌦️", "🌾", "🏔️", "🚆"] as const;
export const stepSymbols = [
  ["🗺️", "📍", "🏔️", "🧭"],
  ["☀️", "🌧️", "📊", "❄️"],
  ["🌾", "🍇", "🫒", "🥔"],
  ["🌳", "🌦️", "❄️", "🚡"],
  ["🚉", "🌉", "🚇", "🗺️"],
];
export const chapterFacts: Record<"ru" | "de", Fact[][]> = {
  ru: [
    [{icon:"🌊",title:"На севере — моря",text:"Северное и Балтийское моря влияют на жизнь у побережья. Посмотри, насколько близко они к Германии."},{icon:"🏔️",title:"На юге — Альпы",text:"Австрия и север Италии соседствуют с Альпами. Горы помогают понять, почему короткая поездка меняет пейзаж."},{icon:"🧭",title:"Карта — не просто рисунок",text:"Направление и положение страны помогают объяснить климат, хозяйство и транспорт. Найди на карте путь с севера на юг."}],
    [{icon:"🌦️",title:"Погода — сегодня",text:"Дождь или солнце за окном могут измениться за несколько часов. Это погода."},{icon:"📅",title:"Климат — за долгие годы",text:"Многолетние наблюдения помогают понять, какие условия обычно бывают в разных сезонах."},{icon:"📈",title:"Линия и столбики",text:"На учебной климатограмме красная линия показывает температуру, а синие столбики — осадки."}],
    [{icon:"🍇",title:"Винограду нужен подходящий сезон",text:"Для винограда важны тепло, солнечный свет и достаточно долгий период роста."},{icon:"🥔",title:"Картофель любит иные условия",text:"Культуры по-разному реагируют на тепло и влагу. Выбирай место по условиям, а не наугад."},{icon:"🌦️",title:"Фермер читает климат",text:"Климатограмма подсказывает, какие условия возможны на ферме в течение года."}],
    [{icon:"⛰️",title:"Выше — обычно холоднее",text:"По мере подъёма температура обычно снижается. Поэтому снег на вершине возможен даже летом."},{icon:"☁️",title:"Горы направляют воздух",text:"Влажный воздух поднимается по склону и может давать больше осадков."},{icon:"🚠",title:"Горы меняют маршруты",text:"Тоннели, перевалы и канатные дороги помогают людям преодолевать сложный рельеф."}],
    [{icon:"🧩",title:"Маршрут — это задача",text:"На карте прямая линия не всегда самая удобная: между городами могут стоять горы и реки."},{icon:"🚆",title:"Железная дорога",text:"Поездам нужны подходящие уклоны, поэтому в горах строят мосты, тоннели и обходные пути."},{icon:"🏁",title:"Используй все открытия",text:"Чтобы выбрать путь, вспомни карту, рельеф, климат и то, как люди приспосабливаются к местности."}],
  ],
  de: [
    [{icon:"🌊",title:"Im Norden: die Meere",text:"Nord- und Ostsee beeinflussen das Leben an der Küste. Wie nah liegen sie an Deutschland?"},{icon:"🏔️",title:"Im Süden: die Alpen",text:"Österreich und Norditalien liegen an den Alpen. Die Berge erklären, warum sich die Landschaft rasch verändert."},{icon:"🧭",title:"Eine Karte erklärt Zusammenhänge",text:"Lage und Richtung helfen uns, Klima, Landwirtschaft und Verkehr zu verstehen. Finde einen Weg von Nord nach Süd."}],
    [{icon:"🌦️",title:"Wetter: heute",text:"Regen oder Sonnenschein können innerhalb weniger Stunden wechseln. Das ist Wetter."},{icon:"📅",title:"Klima: viele Jahre",text:"Langjährige Beobachtungen zeigen, welche Bedingungen in den Jahreszeiten typisch sind."},{icon:"📈",title:"Linie und Säulen",text:"Im Klimadiagramm zeigt die rote Linie die Temperatur, die blauen Säulen zeigen den Niederschlag."}],
    [{icon:"🍇",title:"Weintrauben brauchen Wärme",text:"Für den Weinbau sind Wärme, Sonnenschein und eine ausreichend lange Wachstumszeit wichtig."},{icon:"🥔",title:"Kartoffeln brauchen anderes Klima",text:"Pflanzen reagieren unterschiedlich auf Wärme und Wasser. Wähle nach den Bedingungen, nicht zufällig."},{icon:"🌦️",title:"Landwirte lesen das Klima",text:"Das Klimadiagramm hilft, die Bedingungen auf einem Hof im Laufe des Jahres einzuschätzen."}],
    [{icon:"⛰️",title:"Höher ist meist kälter",text:"Mit der Höhe sinkt die Temperatur gewöhnlich. Deshalb kann auf Gipfeln im Sommer Schnee liegen."},{icon:"☁️",title:"Gebirge lenken die Luft",text:"Feuchte Luft steigt am Hang auf und kann dort mehr Niederschlag bringen."},{icon:"🚠",title:"Berge verändern Wege",text:"Tunnel, Pässe und Seilbahnen helfen Menschen, schwieriges Gelände zu überwinden."}],
    [{icon:"🧩",title:"Eine Route ist ein Rätsel",text:"Die kürzeste Linie auf der Karte ist nicht immer der beste Weg: Berge und Flüsse liegen dazwischen."},{icon:"🚆",title:"Die Eisenbahn",text:"Züge benötigen passende Steigungen. Deshalb gibt es in den Bergen Brücken, Tunnel und Umwege."},{icon:"🏁",title:"Nutze alle Entdeckungen",text:"Denke für deine Route an Karte, Relief, Klima und daran, wie sich die Menschen an die Landschaft anpassen."}],
  ],
};
