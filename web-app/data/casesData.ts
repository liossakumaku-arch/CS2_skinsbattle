import { SkinItem } from '@/context/UserContext';

export interface CaseConfig {
  id: number;
  title: string;
  price: number;
  category: string;
  badge?: string;
  accentColor: string;
  icon: string; 
  drops: Omit<SkinItem, 'id'>[];
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
      // Сумма шансов = 100
      { name: 'P250', skin: 'Песчаная буря', price: 15, power: 8, rarity: 'blue', slot: 'weaponeSkin', icon: '/skins/icon1.jpg', chance: 60 },
      { name: 'MP9', skin: 'Закат', price: 35, power: 14, rarity: 'blue', slot: 'weaponeSkin', icon: '/skins/Sunset.jpg', chance: 25 },
      { name: 'Glock-18', skin: 'Карамельное яблоко', price: 60, power: 22, rarity: 'purple', slot: 'weaponeSkin', icon: '/skins/Caramel_apple.png', chance: 10 },
      { name: 'AK-47', skin: 'Элитное снаряжение', price: 140, power: 40, rarity: 'pink', slot: 'weaponeSkin', icon: '/skins/Elite_equipment.jpg', chance: 5 },
    ],
  },
  {
    id: 2,
    title: 'Ночной патруль',
    price: 149,
    category: 'Бюджетные',
    badge: 'ХИТ',
    accentColor: 'from-blue-700 to-slate-900',
    icon: '/cases/case2.png',
    drops: [
      { name: 'USP-S', skin: 'Страж', price: 70, power: 25, rarity: 'blue', slot: 'weaponeSkin', icon: '/skins/Guardian.jpg', chance: 55 },
      { name: 'M4A1-S', skin: 'Нитро', price: 130, power: 38, rarity: 'purple', slot: 'weaponeSkin', icon: '/skins/Nitro.jpg', chance: 30 },
      { name: 'Desert Eagle', skin: 'Заговор', price: 290, power: 65, rarity: 'pink', slot: 'weaponeSkin', icon: '/skins/Conspiracy.jpg', chance: 12 },
      { name: 'AWP', skin: 'Красная линия', price: 650, power: 120, rarity: 'red', slot: 'weaponeSkin', icon: '/skins/The_red_line.jpg', chance: 3 },
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
    {
    id: 5,
    title: 'Джекпот за десятку',
    price: 10,
    category: 'Бюджетные',
    badge: 'ВА-БАНК',
    accentColor: 'from-emerald-600 to-teal-900',
    icon: '/cases/case5.jpg', // Не забудь положить картинку кейса в public/cases/
    drops: [
      { 
        name: 'Какашка', 
        skin: 'Обычная', 
        price: 1, 
        power: 1, 
        rarity: 'blue', 
        slot: 'weaponeSkin', 
        icon: '/skins/placeholder.png', // Сюда можно поставить смешную картинку
        chance: 99.9
      },
      { 
        name: 'AWP', 
        skin: 'Драконье пламя (Dragon Lore)', 
        price: 10000, 
        power: 1500, 
        rarity: 'gold', 
        slot: 'weaponeSkin', 
        icon: '/skins/Dragon_Lore.jpg', // Путь к картинке
        chance: 0.1
      },
    ],
  },
];