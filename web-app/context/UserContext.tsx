'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SkinItem {
  id: string;
  name: string;
  skin: string;
  price: number;
  power: number;
  rarity: 'blue' | 'purple' | 'pink' | 'red' | 'gold';
  icon: string;
  slot: 'weaponeSkin' | 'knifeSkin';
}

export interface Fighter {
  slotId: number;
  name: string;
  role: string;
  basePower: number;
  weaponeSkin: SkinItem | null;
  knifeSkin: SkinItem | null;
}

export type SkinSlot = 'weaponeSkin' | 'knifeSkin';

const INITIAL_FIGHTERS: Fighter[] = [
  { slotId: 1, name: 'Штурмовик', role: 'Авангард',        basePower: 10, weaponeSkin: null, knifeSkin: null },
  { slotId: 2, name: 'Снайпер',   role: 'Дальний бой',     basePower: 10, weaponeSkin: null, knifeSkin: null },
  { slotId: 3, name: 'Диверсант', role: 'Критический урон', basePower: 10, weaponeSkin: null, knifeSkin: null },
  { slotId: 4, name: 'Сапёр',     role: 'Защита',          basePower: 10, weaponeSkin: null, knifeSkin: null },
  { slotId: 5, name: 'Капитан',   role: 'Лидер отряда',    basePower: 15, weaponeSkin: null, knifeSkin: null },
];

function migrateFighters(saved: any[]): Fighter[] {
  return saved.map((f) => ({
    ...f,
    weaponeSkin: f.weaponeSkin ?? f.equippedSkin ?? null,
    knifeSkin: f.knifeSkin ?? null,
    equippedSkin: undefined,
  }));
}

function migrateInventory(saved: any[]): SkinItem[] {
  return saved.map((i) => {
    const name = (i.name ?? '').toLowerCase();
    const isKnife =
      name.includes('нож') || name.includes('керамбит') || name.includes('штык') || name.includes('бабочка') || name.includes('m9');

    return {
      ...i,
      icon: i.icon ?? '/skins/placeholder.png',
      slot: i.slot ?? (isKnife ? 'knifeSkin' : 'weaponeSkin'),
    } as SkinItem;
  });
}

interface UserContextType {
  isLoggedIn: boolean;
  username: string;
  balance: number;
  inventory: SkinItem[];
  fighters: Fighter[];
  totalSquadPower: number;
  lastClaimDate: string | null;
  streak: number;
  login: () => void;
  logout: () => void;
  addBalance: (amount: number) => void;
  spendBalance: (amount: number) => boolean;
  addItem: (item: SkinItem) => void;
  sellItem: (id: string) => void;
  equipSkin: (slotId: number, item: SkinItem, target: SkinSlot) => void;
  unequipSkin: (slotId: number, target: SkinSlot) => void;
  claimDailyReward: () => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [balance, setBalance] = useState(0);
  const [inventory, setInventory] = useState<SkinItem[]>([]);
  const [fighters, setFighters] = useState<Fighter[]>(INITIAL_FIGHTERS);
  const [lastClaimDate, setLastClaimDate] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('cs2_rpg_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      setIsLoggedIn(parsed.isLoggedIn || false);
      setBalance(parsed.balance || 0);
      setInventory(migrateInventory(parsed.inventory || []));
      if (parsed.fighters) setFighters(migrateFighters(parsed.fighters));
      setLastClaimDate(parsed.lastClaimDate || null);
      setStreak(parsed.streak || 0);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'cs2_rpg_data',
      JSON.stringify({ isLoggedIn, balance, inventory, fighters, lastClaimDate, streak })
    );
  }, [isLoggedIn, balance, inventory, fighters, lastClaimDate, streak]);

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

  const equipSkin = (slotId: number, item: SkinItem, target: SkinSlot) => {
    if (item.slot !== target) return; 
    const fighter = fighters.find((f) => f.slotId === slotId);
    if (!fighter) return;

    const previous = fighter[target];

    setFighters((prev) =>
      prev.map((f) => f.slotId === slotId ? { ...f, [target]: item } : f)
    );

    setInventory((prev) => {
      const withoutNew = prev.filter((i) => i.id !== item.id);
      return previous ? [previous, ...withoutNew] : withoutNew;
    });
  };

  const unequipSkin = (slotId: number, target: SkinSlot) => {
    const fighter = fighters.find((f) => f.slotId === slotId);
    if (!fighter || !fighter[target]) return;

    const removed = fighter[target]!;

    setFighters((prev) =>
      prev.map((f) => f.slotId === slotId ? { ...f, [target]: null } : f)
    );

    setInventory((prev) => [removed, ...prev]);
  };

  const claimDailyReward = () => {
    const today = new Date().toDateString();
    if (lastClaimDate === today) return false;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const wasYesterday = lastClaimDate === yesterday.toDateString();

    let newStreak = wasYesterday ? streak + 1 : 1;
    if (newStreak > 7) newStreak = 7;

    const rewards = [50, 50, 50, 50, 60, 80, 101];
    const rewardAmount = rewards[newStreak - 1];

    setStreak(newStreak);
    setLastClaimDate(today);
    addBalance(rewardAmount);
    return true;
  };

  const totalSquadPower = fighters.reduce(
    (sum, f) =>
      sum + f.basePower + (f.weaponeSkin?.power ?? 0) + (f.knifeSkin?.power ?? 0),
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
        lastClaimDate,
        streak,
        login,
        logout,
        addBalance,
        spendBalance,
        addItem,
        sellItem,
        equipSkin,
        unequipSkin,
        claimDailyReward,
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