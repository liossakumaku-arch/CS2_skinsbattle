'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useUser, SkinItem } from '@/context/UserContext';

const RARITY_BORDER = {
  blue: 'border-blue-500',
  purple: 'border-purple-500',
  pink: 'border-pink-500',
  red: 'border-red-500',
  gold: 'border-amber-400',
};

const FIGHTER_AVATARS = ['🪖', '🎯', '🥷', '🛡️', '👑'];

export default function ProfilePage() {
  const {
    isLoggedIn,
    username,
    balance,
    inventory,
    fighters,
    totalSquadPower,
    equipSkin,
    unequipSkin,
    sellItem,
  } = useUser();

  const [selectedSkin, setSelectedSkin] = useState<SkinItem | null>(null);

  if (!isLoggedIn) {
    return (
      <div className="py-20 text-center">
        <h1 className="mb-4 text-2xl font-black text-white">Вы не авторизованы</h1>
        <p className="text-gray-400 mb-6">Войдите в аккаунт, чтобы увидеть свой профиль и отряд.</p>
        <Link
          href="/login"
          className="inline-block rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-500 transition-colors"
        >
          Перейти ко входу
        </Link>
      </div>
    );
  }

  const handleEquipToFighter = (slotId: number) => {
    if (!selectedSkin) return;
    equipSkin(slotId, selectedSkin);
    setSelectedSkin(null);
  };

  return (
    <div className="py-8">
      {/* Верхняя панель профиля */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-800 bg-gray-900 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 text-3xl">
            🎮
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">{username}</h1>
            <p className="text-sm text-gray-400">
              Баланс: <span className="font-bold text-emerald-400">{balance} ₽</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-3 text-center">
            <div className="text-xs font-bold uppercase text-amber-400">Общая сила отряда</div>
            <div className="text-2xl font-black text-white">{totalSquadPower} ⚡</div>
          </div>

          <Link
            href="/battles"
            className="rounded-xl bg-amber-500 px-6 py-4 font-black uppercase text-gray-950 transition hover:bg-amber-400"
          >
            ⚔️ В бой!
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Левая колонка: 5 персонажей отряда */}
        <div className="lg:col-span-7">
          <h2 className="mb-4 text-lg font-extrabold uppercase text-white">
            Ваш отряд (5 бойцов)
          </h2>
          {selectedSkin && (
            <div className="mb-4 rounded-xl border border-amber-500 bg-amber-500/10 p-3 text-sm text-amber-300">
              Выбран скин: <b>{selectedSkin.name} | {selectedSkin.skin}</b>. Нажмите «Экипировать» на нужном персонаже!
            </div>
          )}

          <div className="space-y-3">
            {fighters.map((fighter, idx) => {
              const currentPower =
                fighter.basePower + (fighter.equippedSkin ? fighter.equippedSkin.power : 0);

              return (
                <div
                  key={fighter.slotId}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-800 bg-gray-900 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-800 text-2xl">
                      {FIGHTER_AVATARS[idx]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-white">{fighter.name}</span>
                        <span className="rounded bg-gray-800 px-2 py-0.5 text-[11px] text-gray-400">
                          {fighter.role}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-amber-400">
                        Сила: {currentPower} ⚡{' '}
                        <span className="text-xs font-normal text-gray-500">
                          (база {fighter.basePower} + скин {fighter.equippedSkin?.power || 0})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Слот экипированного оружия/скина */}
                  <div className="flex items-center gap-3">
                    {fighter.equippedSkin ? (
                      <div
                        className={`flex items-center gap-3 rounded-lg border-l-4 bg-gray-950 px-3 py-2 ${
                          RARITY_BORDER[fighter.equippedSkin.rarity]
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold text-white">
                            {fighter.equippedSkin.name} | {fighter.equippedSkin.skin}
                          </div>
                          <div className="text-[11px] font-bold text-amber-400">
                            +{fighter.equippedSkin.power} ⚡
                          </div>
                        </div>
                        <button
                          onClick={() => unequipSkin(fighter.slotId)}
                          className="rounded bg-gray-800 px-2 py-1 text-xs text-gray-300 hover:bg-red-600 hover:text-white"
                          title="Снять скин"
                        >
                          Снять
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">Слот пуст</span>
                    )}

                    {selectedSkin && (
                      <button
                        onClick={() => handleEquipToFighter(fighter.slotId)}
                        className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-extrabold text-gray-950 hover:bg-amber-400"
                      >
                        Экипировать
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Правая колонка: Свободный инвентарь */}
        <div className="lg:col-span-5">
          <h2 className="mb-4 text-lg font-extrabold uppercase text-white">
            Инвентарь ({inventory.length})
          </h2>

          {inventory.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-800 p-8 text-center">
              <p className="mb-4 text-sm text-gray-400">В инвентаре пока нет свободных скинов</p>
              <Link
                href="/"
                className="inline-block rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-gray-950"
              >
                Открыть кейсы
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {inventory.map((item) => {
                const isSelected = selectedSkin?.id === item.id;
                return (
                  <div
                    key={item.id}
                    className={`rounded-xl border-2 bg-gray-900 p-4 transition ${
                      isSelected
                        ? 'border-amber-400 ring-2 ring-amber-400/30'
                        : RARITY_BORDER[item.rarity]
                    }`}
                  >
                    <div className="text-xs text-gray-400">{item.name}</div>
                    <div className="mb-2 font-extrabold text-white">{item.skin}</div>
                    <div className="mb-3 flex justify-between text-xs font-bold">
                      <span className="text-emerald-400">{item.price} ₽</span>
                      <span className="text-amber-400">+{item.power} ⚡</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedSkin(isSelected ? null : item)}
                        className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
                          isSelected
                            ? 'bg-gray-700 text-white'
                            : 'bg-amber-500 text-gray-950 hover:bg-amber-400'
                        }`}
                      >
                        {isSelected ? 'Отмена' : 'Надеть'}
                      </button>
                      <button
                        onClick={() => {
                          if (isSelected) setSelectedSkin(null);
                          sellItem(item.id);
                        }}
                        className="rounded-lg bg-gray-800 px-2.5 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-600 hover:text-white"
                      >
                        Продать
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
