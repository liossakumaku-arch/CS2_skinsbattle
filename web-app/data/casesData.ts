import { SkinItem } from '@/context/UserContext';

type CaseDrop = Omit<SkinItem, 'id'> & { chance: number };

export interface CaseConfig {
  id: number;
  title: string;
  price: number;
  category: string;
  badge?: string;
  accentColor: string;
  icon: string; 
  drops: CaseDrop[]; 
}

export const CASES_DATA: CaseConfig[] = [
  {
    id: 1,
    title: 'Армейский ширпотреб',
    price: 49,
    category: 'Бюджетные',
    accentColor: 'from-slate-700 to-slate-900',
    icon: '/cases/case1.png',
    drops: [
      { name: 'Tec-9', skin: 'Грунтовая вода', price: 10, power: 5, rarity: 'white', slot: 'weaponeSkin', icon: '/skins/case_1/Tec-9_Groundwater.jpg', chance: 15 },
      { name: 'R8 Revolver', skin: 'Пустынный окрас', price: 12, power: 6, rarity: 'white', slot: 'weaponeSkin', icon: '/skins/case_1/R8 Revolver_Desert Brush.jpg', chance: 15 },
      { name: 'P250', skin: 'Сливовая сеть', price: 14, power: 7, rarity: 'white', slot: 'weaponeSkin', icon: '/skins/case_1/P250_Plum Netting.jpg', chance: 15 },
      { name: 'Five-SeveN', skin: 'Хладагент', price: 20, power: 9, rarity: 'white', slot: 'weaponeSkin', icon: '/skins/case_1/Five-SeveN_Coolant.jpg', chance: 15 },
      { name: 'Desert Eagle', skin: 'Недовольство', price: 25, power:11, rarity: 'cyan', slot: 'weaponeSkin', icon: '/skins/case_1/Desert Eagle_Tilted.jpg', chance: 15 },
      { name: 'AK-47', skin: 'Фиолетовое барокко', price: 40, power:15, rarity: 'cyan', slot: 'weaponeSkin', icon: '/skins/case_1/AK-47_Baroque Purple.jpg', chance: 10 },
      { name: 'XM1014', skin: 'Банановые листья', price: 50, power:17, rarity: 'cyan', slot: 'weaponeSkin', icon: '/skins/case_1/XM1014_Banana Leaf.jpg', chance: 10 },
      { name: 'G3SG1', skin: 'Лазурная зебра', price: 100, power:25, rarity: 'blue', slot: 'weaponeSkin', icon: '/skins/case_1/G3SG1_Azure Zebra.jpg', chance: 5 },
    ],
  },
  {
    id: 2,
    title: 'Ночной патруль',
    price: 99,
    category: 'Бюджетные',
    badge: 'ХИТ',
    accentColor: 'from-blue-700 to-slate-900',
    icon: '/cases/case2.png',
    drops: [
      { name: 'Dual Berettas', skin: 'Луна в знаке Весов', price: 20, power: 10, rarity: 'white', slot: 'weaponeSkin', icon: '/skins/case_2/Dual Berettas_Moon in Libra.jpg', chance: 15 },
      { name: 'Negev', skin: 'Песочное барокко', price: 25, power: 12, rarity: 'white', slot: 'weaponeSkin', icon: '/skins/case_2/Negev _ Boroque Sand.jpg', chance: 15 },
      { name: 'FAMAS', skin: 'Ночной Борре', price: 30, power: 15, rarity: 'white', slot: 'weaponeSkin', icon: '/skins/case_2/FAMAS _ Night Borre.jpg', chance: 15 },
      { name: 'MAC-10', skin: 'Кислотные шестигранники', price: 50, power: 18, rarity: 'cyan', slot: 'weaponeSkin', icon: '/skins/case_2/MAC-10 _ Acid Hex.jpg', chance: 20 },
      { name: 'SCAR-20', skin: 'Углепластик', price: 75, power: 22, rarity: 'cyan', slot: 'weaponeSkin', icon: '/skins/case_2/SCAR-20 _ Carbon Fiber.jpg', chance: 15 },
      { name: 'M4A4', skin: 'Рубитель', price: 105, power: 24, rarity: 'blue', slot: 'weaponeSkin', icon: '/skins/case_2/M4A4 _ Choppa.jpg', chance: 10 },
      { name: 'Nova', skin: 'Буря', price: 135, power: 28, rarity: 'blue', slot: 'weaponeSkin', icon: '/skins/case_2/Nova _ Tempest.jpg', chance: 9 },
      { name: 'Ursus Knife', skin: 'Дамасская сталь', price: 7500, power: 100, rarity: 'red', slot: 'knifeSkin', icon: '/skins/case_2/Ursus Knife _ Damascus Steel.jpg', chance: 1 },
      
    ],
  },
  {
    id: 5,
    title: 'Джекпот за десятку',
    price: 10,
    category: 'Бюджетные',
    badge: 'ВА-БАНК',
    accentColor: 'from-emerald-600 to-teal-900',
    icon: '/cases/case5.jpg', // Не забудь положить картинку кейса в public/cases/
    drops: [
      { name: 'Какашка', skin: 'Обычная', price: 1, power: 1, rarity: 'white', slot: 'weaponeSkin', icon: '/skins/placeholder.png', chance: 99.9},
      { name: 'AWP', skin: 'Драконье пламя (Dragon Lore)', price: 10000, power: 1500, rarity: 'gold', slot: 'weaponeSkin', icon: '/skins/Dragon_Lore.jpg', chance: 0.1},
    ],
  },
  {
    id: 3,
    title: 'Тайное оружие',
    price: 490,
    category: 'Популярные сборки',
    badge: 'ТОП',
    accentColor: 'from-amber-600 to-slate-900',
    icon: '/cases/case3.png',
    drops: [
      { name: 'AK-47', skin: 'Легион Анубиса', price: 320, power: 75, rarity: 'purple', slot: 'weaponeSkin', icon: '/skins/The_Anubis_Legion.jpg', chance: 60 },
      { name: 'M4A4', skin: 'Император', price: 550, power: 110, rarity: 'pink', slot: 'weaponeSkin', icon: '/skins/Emperor.jpg', chance: 25 },
      { name: 'AWP', skin: 'Азимов', price: 1400, power: 230, rarity: 'red', slot: 'weaponeSkin', icon: '/skins/Asimov.png', chance: 12 },
      { name: 'Керамбит', skin: 'Автотроника', price: 3500, power: 500, rarity: 'gold', slot: 'knifeSkin', icon: '/skins/Autotronics.jpg', chance: 3 },
    ],
  },
  {
    id: 4,
    title: 'Ножевой раунд',
    price: 1990,
    category: 'Элитные кейсы',
    badge: 'ШАНС НОЖА',
    accentColor: 'from-yellow-500 to-amber-900',
    icon: '/cases/case4.png',
    drops: [
      { name: 'Desert Eagle', skin: 'Пламя', price: 1200, power: 200, rarity: 'pink', slot: 'weaponeSkin', icon: '/skins/Flame.jpg', chance: 65 },
      { name: 'AK-47', skin: 'Огненный змей', price: 2600, power: 380, rarity: 'red', slot: 'weaponeSkin', icon: '/skins/Fire_Serpent.jpg', chance: 30 },
      { name: 'Штык-нож M9', skin: 'Градиент', price: 5500, power: 750, rarity: 'gold', slot: 'knifeSkin', icon: '/skins/Gradient.jpg', chance: 3 },
      { name: 'Нож-бабочка', skin: 'Волны', price: 8800, power: 1200, rarity: 'gold', slot: 'knifeSkin', icon: '/skins/Waves.jpg', chance: 2 },
    ],
  },
];