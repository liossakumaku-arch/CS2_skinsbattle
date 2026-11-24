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

const FIGHTER_AVATARS = [
  '/avatars/avatar_1.jpg',
  '/avatars/avatar_2.jpg',
  '/avatars/avatar_5.jpg',
  '/avatars/avatar_3.jpg',
  '/avatars/avatar_4.jpg',
];

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

  return (
    <div className="py-8">
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
        <div className="lg:col-span-7">
          <h2 className="mb-4 text-lg font-extrabold uppercase text-white">
            Ваш отряд (5 бойцов)
          </h2>
          {selectedSkin && (
            <div className="mb-4 rounded-xl border border-amber-500 bg-amber-500/10 p-3 text-sm text-amber-300">
              Выбран скин: <b>{selectedSkin.name} | {selectedSkin.skin}</b>. Нажмите
              «Экипировать» в подходящем слоте!
            </div>
          )}

          <div className="space-y-3">
            {fighters.map((fighter, idx) => {
              const currentPower =
                fighter.basePower +
                (fighter.weaponeSkin?.power ?? 0) +
                (fighter.knifeSkin?.power ?? 0);

              return (
                <div
                  key={fighter.slotId}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-800 bg-gray-900 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-gray-800">
                      <img
                        src={FIGHTER_AVATARS[idx % FIGHTER_AVATARS.length]}
                        alt={fighter.name}
                        className="h-full w-full object-cover"
                      />
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
                          (база {fighter.basePower} + оружие{' '}
                          {fighter.weaponeSkin?.power ?? 0} + нож{' '}
                          {fighter.knifeSkin?.power ?? 0})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <SkinSlotRow
                      label="Оружие"
                      targetSlot="weaponeSkin"
                      skin={fighter.weaponeSkin}
                      selected={selectedSkin}
                      onEquip={() => {
                        if (!selectedSkin) return;
                        equipSkin(fighter.slotId, selectedSkin, 'weaponeSkin');
                        setSelectedSkin(null);
                      }}
                      onUnequip={() => unequipSkin(fighter.slotId, 'weaponeSkin')}
                    />
                    <SkinSlotRow
                      label="Нож"
                      targetSlot="knifeSkin"
                      skin={fighter.knifeSkin}
                      selected={selectedSkin}
                      onEquip={() => {
                        if (!selectedSkin) return;
                        equipSkin(fighter.slotId, selectedSkin, 'knifeSkin');
                        setSelectedSkin(null);
                      }}
                      onUnequip={() => unequipSkin(fighter.slotId, 'knifeSkin')}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

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
                    <div className="mb-3 flex h-24 w-full items-center justify-center rounded-lg bg-gray-950 p-2">
                      <img
                        src={item.icon || '/skins/placeholder.png'}
                        alt={item.skin}
                        className="h-full w-auto object-contain"
                      />
                    </div>

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

function SkinSlotRow({
  label,
  targetSlot,
  skin,
  selected,
  onEquip,
  onUnequip,
}: {
  label: string;
  targetSlot: 'weaponeSkin' | 'knifeSkin';
  skin: SkinItem | null;
  selected: SkinItem | null;
  onEquip: () => void;
  onUnequip: () => void;
}) {
  // Проверяем, подходит ли выбранный скин для ЭТОГО слота
  const isSlotMatch = selected?.slot === targetSlot;

  return (
    <div className="flex items-center gap-3">
      <span className="w-14 text-[10px] font-bold uppercase text-gray-500">
        {label}
      </span>

      {skin ? (
        <div
          className={`flex items-center gap-3 rounded-lg border-l-4 bg-gray-950 px-3 py-2 ${
            RARITY_BORDER[skin.rarity] ?? ''
          }`}
        >
          <img
            src={skin.icon || '/skins/placeholder.png'}
            alt={skin.skin}
            className="h-8 w-auto object-contain"
          />
          
          <div>
            <div className="text-xs font-bold text-white">
              {skin.name} | {skin.skin}
            </div>
            <div className="text-[11px] font-bold text-amber-400">
              +{skin.power} ⚡
            </div>
          </div>
          <button
            onClick={onUnequip}
            className="rounded bg-gray-800 px-2 py-1 text-xs text-gray-300 hover:bg-red-600 hover:text-white"
            title={`Снять ${label.toLowerCase()}`}
          >
            Снять
          </button>
        </div>
      ) : (
        <span className="text-xs text-gray-500">пусто</span>
      )}

      {/* 
        Кнопка "Экипировать" рендерится ТОЛЬКО если:
        1. В инвентаре что-то выбрано (selected не null)
        2. Тип слота совпадает (например, 'knifeSkin' === 'knifeSkin')
      */}
      {selected && isSlotMatch && (
        <button
          onClick={onEquip}
          className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-extrabold text-gray-950 hover:bg-amber-400"
        >
          Экипировать
        </button>
      )}
    </div>
  );
}