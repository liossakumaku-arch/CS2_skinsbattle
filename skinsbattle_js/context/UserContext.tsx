'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SkinItem {
  id: string;
  name: string;
  skin: string;
  price: number;
  power: number; // Сила, которую дает скин персонажу
  rarity: 'blue' | 'purple' | 'pink' | 'red' | 'gold';
}

export interface Fighter {
  slotId: number;
  name: string;
  role: string;
  basePower: number;
  equippedSkin: SkinItem | null;
}

const INITIAL_FIGHTERS: Fighter[] = [
  { slotId: 1, name: 'Штурмовик', role: 'Авангард', basePower: 10, equippedSkin: null },
  { slotId: 2, name: 'Снайпер', role: 'Дальний бой', basePower: 10, equippedSkin: null },
  { slotId: 3, name: 'Диверсант', role: 'Критический урон', basePower: 10, equippedSkin: null },
  { slotId: 4, name: 'Тяжеловес', role: 'Защита', basePower: 10, equippedSkin: null },
  { slotId: 5, name: 'Капитан', role: 'Лидер отряда', basePower: 15, equippedSkin: null },
];

interface UserContextType {
  isLoggedIn: boolean;
  username: string;
  balance: number;
  inventory: SkinItem[];
  fighters: Fighter[];
  totalSquadPower: number;
  login: () => void;
  logout: () => void;
  addBalance: (amount: number) => void;
  spendBalance: (amount: number) => boolean;
  addItem: (item: SkinItem) => void;
  sellItem: (id: string) => void;
  equipSkin: (slotId: number, item: SkinItem) => void;
  unequipSkin: (slotId: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [balance, setBalance] = useState(0);
  const [inventory, setInventory] = useState<SkinItem[]>([]);
  const [fighters, setFighters] = useState<Fighter[]>(INITIAL_FIGHTERS);

  useEffect(() => {
    const saved = localStorage.getItem('cs2_rpg_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      setIsLoggedIn(parsed.isLoggedIn || false);
      setBalance(parsed.balance || 0);
      setInventory(parsed.inventory || []);
      if (parsed.fighters) setFighters(parsed.fighters);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'cs2_rpg_data',
      JSON.stringify({ isLoggedIn, balance, inventory, fighters })
    );
  }, [isLoggedIn, balance, inventory, fighters]);

  const login = () => {
    setIsLoggedIn(true);
    if (balance === 0) setBalance(1000);
  };

  const logout = () => setIsLoggedIn(false);

  const addBalance = (amount: number) => setBalance((prev) => prev + amount);

  const spendBalance = (amount: number) => {
    if (balance < amount) return false;
    setBalance((prev) => prev - amount);
    return true;
  };

  const addItem = (item: SkinItem) => {
    setInventory((prev) => [item, ...prev]);
  };

  const sellItem = (id: string) => {
    const target = inventory.find((i) => i.id === id);
    if (!target) return;
    setBalance((prev) => prev + target.price);
    setInventory((prev) => prev.filter((i) => i.id !== id));
  };

  // Надеть скин из инвентаря на персонажа
  const equipSkin = (slotId: number, item: SkinItem) => {
    setFighters((prev) =>
      prev.map((fighter) => {
        if (fighter.slotId !== slotId) return fighter;
        // Если на бойце уже был скин, возвращаем старый в инвентарь
        if (fighter.equippedSkin) {
          setInventory((inv) => [fighter.equippedSkin!, ...inv]);
        }
        return { ...fighter, equippedSkin: item };
      })
    );
    // Убираем надетый скин из свободного инвентаря
    setInventory((prev) => prev.filter((i) => i.id !== item.id));
  };

  // Снять скин обратно в инвентарь
  const unequipSkin = (slotId: number) => {
    const targetFighter = fighters.find((f) => f.slotId === slotId);
    if (!targetFighter || !targetFighter.equippedSkin) return;

    setInventory((prev) => [targetFighter.equippedSkin!, ...prev]);
    setFighters((prev) =>
      prev.map((f) => (f.slotId === slotId ? { ...f, equippedSkin: null } : f))
    );
  };

  // Общая сила всего отряда из 5 бойцов
  const totalSquadPower = fighters.reduce(
    (sum, f) => sum + f.basePower + (f.equippedSkin ? f.equippedSkin.power : 0),
    0
  );

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        username: 'Player_CS2',
        balance,
        inventory,
        fighters,
        totalSquadPower,
        login,
        logout,
        addBalance,
        spendBalance,
        addItem,
        sellItem,
        equipSkin,
        unequipSkin,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser должен использоваться внутри UserProvider');
  return context;
}
