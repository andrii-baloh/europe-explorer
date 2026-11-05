import type { Lang } from './ui';
type Stage = { icon:string; ru:string; de:string };
const previews: Record<string,Stage[]> = {
 M01:[{icon:'🧭',ru:'Стороны света',de:'Himmelsrichtungen'},{icon:'🗺️',ru:'Легенда карты',de:'Kartenlegende'},{icon:'📏',ru:'Масштаб',de:'Maßstab'}],
 M02:[{icon:'🇩🇪',ru:'Германия',de:'Deutschland'},{icon:'🏞️',ru:'Рельеф',de:'Relief'},{icon:'⛰️',ru:'Альпы',de:'Alpen'}],
 M03:[{icon:'🏘️',ru:'Деревня',de:'Dorf'},{icon:'🏙️',ru:'Город',de:'Stadt'},{icon:'🚍',ru:'Доступность',de:'Erreichbarkeit'}],
 M04:[{icon:'🏠',ru:'Жильё',de:'Wohnen'},{icon:'🏫',ru:'Школа',de:'Schule'},{icon:'🚲',ru:'Транспорт',de:'Verkehr'}],
 M05:[{icon:'🌾',ru:'Село',de:'Land'},{icon:'🥛',ru:'Продукты',de:'Lebensmittel'},{icon:'🏬',ru:'Город',de:'Stadt'}],
 M06:[{icon:'🌱',ru:'Поле',de:'Acker'},{icon:'⚙️',ru:'Мельница',de:'Mühle'},{icon:'🍞',ru:'Хлеб',de:'Brot'}],
 M07:[{icon:'💧',ru:'Вода',de:'Wasser'},{icon:'🌱',ru:'Почва',de:'Boden'},{icon:'📈',ru:'Урожай',de:'Ertrag'}],
 M08:[{icon:'⛏️',ru:'Сырьё',de:'Rohstoffe'},{icon:'🏭',ru:'Завод',de:'Fabrik'},{icon:'🚂',ru:'Поставка',de:'Transport'}],
 M09:[{icon:'🌾',ru:'Сельское хоз.',de:'Landwirtschaft'},{icon:'🏗️',ru:'Промышленность',de:'Industrie'},{icon:'🏥',ru:'Услуги',de:'Dienstleistung'}],
 M10:[{icon:'🗺️',ru:'Маршрут',de:'Route'},{icon:'🌦️',ru:'Климат',de:'Klima'},{icon:'🏔️',ru:'Место отдыха',de:'Reiseziel'}],
 M11:[{icon:'🧳',ru:'Туристы',de:'Gäste'},{icon:'💶',ru:'Доход',de:'Einnahmen'},{icon:'🌳',ru:'Природа',de:'Natur'}],
 M12:[{icon:'❓',ru:'Вопрос',de:'Frage'},{icon:'🔎',ru:'Доказательства',de:'Belege'},{icon:'📝',ru:'Вывод',de:'Ergebnis'}]
};
export function getModulePreview(moduleId:string,lang:Lang):{icon:string;text:string}[] {
 return (previews[moduleId] ?? []).map(item=>({icon:item.icon,text:item[lang]}));
}
