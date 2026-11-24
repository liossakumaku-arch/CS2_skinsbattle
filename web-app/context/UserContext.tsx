'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

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
  streak: number;
  lastClaimDate: string | null;
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
  const { data: session } = useSession();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [balance, setBalance] = useState(0);
  const [inventory, setInventory] = useState<SkinItem[]>([]);
  const [fighters, setFighters] = useState<Fighter[]>(INITIAL_FIGHTERS);
  const [streak, setStreak] = useState(0);
  const [lastClaimDate, setLastClaimDate] = useState<string | null>(null);

  // 1. Загрузка данных из БД при входе (вместо localStorage)
  useEffect(() => {
    if (!session) return;
    
    fetch('/api/user/data', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setBalance(data.balance);
        setInventory(migrateInventory(data.inventory || []));
        if (data.fighters) setFighters(migrateFighters(data.fighters));
        setStreak(data.streak || 0);
        setLastClaimDate(data.lastClaimDate || null);
      })
      .catch(err => console.error("Ошибка загрузки данных:", err));
  }, [session]);

  // 2. Функция сохранения на сервер (вызывать после изменений)
  const saveToServer = async (newData: any) => {
    if (!session) return;
    
    try {
      await fetch('/api/user/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      });
    } catch (err) {
      console.error("Ошибка сохранения:", err);
    }
  };

  const login = () => {
    setIsLoggedIn(true);
    if (balance === 0) setBalance(67);
  };

  const logout = () => setIsLoggedIn(false);

  // ИСПРАВЛЕНО: Теперь addBalance реально работает и сохраняет на сервер
  const addBalance = async (amount: number) => {
    const newBalance = balance + amount;
    setBalance(newBalance);
    await saveToServer({ balance: newBalance, inventory, fighters, streak, lastClaimDate });
  };

  const spendBalance = (amount: number) => {
    if (balance < amount) return false;
    const newBalance = balance - amount;
    setBalance(newBalance);
    saveToServer({ balance: newBalance, inventory, fighters, streak, lastClaimDate });
    return true;
  };

  const addItem = async (item: SkinItem) => {
    const newInventory = [item, ...inventory];
    setInventory(newInventory);
    await saveToServer({ balance, inventory: newInventory, fighters, streak, lastClaimDate });
  };

  const sellItem = async (id: string) => {
    const target = inventory.find((i) => i.id === id);
    if (!target) return;
    
    const newBalance = balance + target.price;
    const newInventory = inventory.filter((i) => i.id !== id);
    
    setBalance(newBalance);
    setInventory(newInventory);
    await saveToServer({ balance: newBalance, inventory: newInventory, fighters, streak, lastClaimDate });
  };

  const equipSkin = async (slotId: number, item: SkinItem, target: SkinSlot) => {
    if (item.slot !== target) {
      console.warn(`Ошибка: Нельзя надеть скин в слот ${target}!`);
      return; 
    }

    const fighter = fighters.find((f) => f.slotId === slotId);
    if (!fighter) return;

    const previous = fighter[target];

    const newFighters = fighters.map((f) =>
      f.slotId === slotId ? { ...f, [target]: item } : f
    );

    const withoutNew = inventory.filter((i) => i.id !== item.id);
    const newInventory = previous ? [previous, ...withoutNew] : withoutNew;

    setFighters(newFighters);
    setInventory(newInventory);
    await saveToServer({ balance, inventory: newInventory, fighters: newFighters, streak, lastClaimDate });
  };

  const unequipSkin = async (slotId: number, target: SkinSlot) => {
    const fighter = fighters.find((f) => f.slotId === slotId);
    if (!fighter || !fighter[target]) return;

    const removed = fighter[target]!;

    const newFighters = fighters.map((f) =>
      f.slotId === slotId ? { ...f, [target]: null } : f
    );
    const newInventory = [removed, ...inventory];

    setFighters(newFighters);
    setInventory(newInventory);
    await saveToServer({ balance, inventory: newInventory, fighters: newFighters, streak, lastClaimDate });
  };

  const claimDailyReward = (): boolean => {
    const today = new Date().toISOString().split('T')[0]; 
    
    if (lastClaimDate === today) {
      return false; 
    }

    const rewards = [50, 50, 50, 50, 60, 80, 100];
    const currentStreak = (streak >= 0 && streak < 7) ? streak : 0;
    const rewardAmount = rewards[currentStreak];
    const newBalance = balance + rewardAmount;
    const newStreak = streak >= 7 ? 1 : streak + 1;

    setBalance(newBalance);
    setStreak(newStreak);
    setLastClaimDate(today);
    
    // Сохраняем награду в БД
    saveToServer({ 
      balance: newBalance, 
      inventory, 
      fighters, 
      streak: newStreak, 
      lastClaimDate: today 
    });

    return true;
  };

  const totalSquadPower = fighters.reduce(
    (sum, f) =>
      sum +
      f.basePower +
      (f.weaponeSkin?.power ?? 0) +
      (f.knifeSkin?.power ?? 0),
    0
  );

  const username = session?.user?.name || 'Гость';
  const finalIsLoggedIn = isLoggedIn || !!session;

  return (
    <UserContext.Provider
      value={{
        isLoggedIn: finalIsLoggedIn,
        username,
        balance,
        inventory,
        fighters,
        totalSquadPower,
        streak,           
        lastClaimDate,    
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