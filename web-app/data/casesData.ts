import { SkinItem } from '@/context/UserContext';

export interface CaseConfig {
  id: number;
  title: string;
  price: number;
  category: string;
  badge?: string;
  accentColor: string;
  drops: Omit<SkinItem, 'id'>[];
}

export const CASES_DATA: CaseConfig[] = [
  {
    id: 1,
    title: 'Армейский ширпотреб',
    price: 49,
    category: 'Бюджетные',
    accentColor: 'from-slate-700 to-slate-900',
    drops: [
      { name: 'P250', skin: 'Песчаная буря', price: 15, power: 8, rarity: 'blue' },
      { name: 'MP9', skin: 'Закат', price: 35, power: 14, rarity: 'blue' },
      { name: 'Glock-18', skin: 'Карамельное яблоко', price: 60, power: 22, rarity: 'purple' },
      { name: 'AK-47', skin: 'Элитное снаряжение', price: 140, power: 40, rarity: 'pink' },
    ],
  },
  {
    id: 2,
    title: 'Ночной патруль',
    price: 149,
    category: 'Бюджетные',
    badge: 'ХИТ',
    accentColor: 'from-blue-700 to-slate-900',
    drops: [
      { name: 'USP-S', skin: 'Страж', price: 70, power: 25, rarity: 'blue' },
      { name: 'M4A1-S', skin: 'Нитро', price: 130, power: 38, rarity: 'purple' },
      { name: 'Desert Eagle', skin: 'Заговор', price: 290, power: 65, rarity: 'pink' },
      { name: 'AWP', skin: 'Красная линия', price: 650, power: 120, rarity: 'red' },
    ],
  },
  {
    id: 3,
    title: 'Тайное оружие',
    price: 490,
    category: 'Популярные сборки',
    badge: 'ТОП',
    accentColor: 'from-amber-600 to-slate-900',
    drops: [
      { name: 'AK-47', skin: 'Легион Анубиса', price: 320, power: 75, rarity: 'purple' },
      { name: 'M4A4', skin: 'Император', price: 550, power: 110, rarity: 'pink' },
      { name: 'AWP', skin: 'Азимов', price: 1400, power: 230, rarity: 'red' },
      { name: 'Керамбит', skin: 'Автотроника', price: 3500, power: 500, rarity: 'gold' },
    ],
  },
  {
    id: 4,
    title: 'Ножевой раунд',
    price: 1990,
    category: 'Элитные кейсы',
    badge: 'ШАНС НОЖА',
    accentColor: 'from-yellow-500 to-amber-900',
    drops: [
      { name: 'Desert Eagle', skin: 'Пламя', price: 1200, power: 200, rarity: 'pink' },
      { name: 'AK-47', skin: 'Огненный змей', price: 2600, power: 380, rarity: 'red' },
      { name: 'Штык-нож M9', skin: 'Градиент', price: 5500, power: 750, rarity: 'gold' },
      { name: 'Нож-бабочка', skin: 'Волны', price: 8900, power: 1200, rarity: 'gold' },
    ],
  },
];
