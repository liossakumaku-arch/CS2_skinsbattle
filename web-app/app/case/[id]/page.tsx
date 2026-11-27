'use client';

import { Suspense, use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CASES_DATA } from '@/data/casesData';
import { useUser, SkinItem } from '@/context/UserContext';
import CaseRoulette from '@/components/CaseRoulette';

function CaseContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { isLoggedIn, login, spendBalance, addItem, addBalance } = useUser();

  const caseItem = CASES_DATA.find((c) => c.id === Number(id));
  const [tape, setTape] = useState<Omit<SkinItem, 'id'>[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonItem, setWonItem] = useState<SkinItem | null>(null);
  const [error, setError] = useState('');

  if (!caseItem) {
    return <div className="py-20 text-center text-gray-400">Кейс не найден</div>;
  }

  const handleOpen = () => {
    setError('');
    if (!isLoggedIn) {
      login();
      return;
    }
    if (!spendBalance(caseItem.price)) {
      setError('Недостаточно средств! Пополните баланс.');
      return;
    }

    const roll = Math.random() * 100;
    let currentSum = 0;
    let winner = caseItem.drops[0];

    for (const drop of caseItem.drops) {
      const dropChance = drop.chance || 10;
      currentSum += dropChance;
      if (roll <= currentSum) {
        winner = drop;
        break;
      }
    }

    const commonDrops = caseItem.drops.filter(d => (d.chance || 10) > 1);
    const fallbackSkin = commonDrops.length > 0 ? commonDrops[0] : caseItem.drops[0];

    const generated = Array.from({ length: 42 }, (_, i) => {
      if (i === 35) return winner;
      return commonDrops[Math.floor(Math.random() * commonDrops.length)] || fallbackSkin;
    });

    setWonItem(null);
    setTape(generated);
    setIsSpinning(true);

    setTimeout(() => {
      setIsSpinning(false);
      setWonItem({ ...winner, id: `${Date.now()}-${Math.random()}` });
    }, 4500);
  };

  const RARITY_COLORS: Record<string, string> = {
    white: 'border-white-500',
    cyan: 'border-cyan-400',
    blue: 'border-blue-500',
    purple: 'border-purple-500',
    pink: 'border-pink-500',
    red: 'border-red-500',
    gold: 'border-amber-400',
  };

  return (
    <div className="mx-auto max-w-5xl py-10">
      <Link href="/" className="mb-6 inline-block text-sm text-gray-400 hover:text-white">
        ← Назад к кейсам
      </Link>

      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 text-center">
        <h1 className="mb-6 text-3xl font-black uppercase text-white">
          {caseItem.title}
        </h1>

        {tape.length > 0 ? (
          <CaseRoulette items={tape} winIndex={35} />
        ) : (
          <div className="mx-auto mb-8 flex h-44 max-w-md items-center justify-center rounded-2xl border-2 border-dashed border-gray-800 bg-gray-950 p-4">
            <img
              src={caseItem.icon}
              alt={caseItem.title}
              className="h-full w-auto object-contain drop-shadow-2xl"
            />
          </div>
        )}

        {wonItem && !isSpinning && (
          <div className="mx-auto mb-6 max-w-md rounded-xl border border-amber-500 bg-amber-500/10 p-4">
            <div className="text-lg font-black text-white">
              {wonItem.name} | {wonItem.skin}
            </div>
            <div className="mt-1 flex justify-center gap-4 text-sm font-bold">
              <span className="text-emerald-400">{wonItem.price} ₽</span>
              <span className="text-amber-400">+{wonItem.power} ⚡</span>
            </div>
          </div>
        )}

        {error && <p className="mb-4 text-sm font-bold text-red-400">{error}</p>}

        {wonItem && !isSpinning ? (
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                addItem(wonItem);
                setWonItem(null);
              }}
              className="rounded-xl bg-amber-500 px-6 py-3 font-extrabold text-gray-950"
            >
              Забрать в инвентарь
            </button>
            <button
              onClick={() => {
                addBalance(wonItem.price);
                setWonItem(null);
              }}
              className="rounded-xl bg-emerald-600 px-6 py-3 font-extrabold text-white"
            >
              Продать за {wonItem.price} ₽
            </button>
            <button
              onClick={() => {
                addItem(wonItem);
                router.push('/profile');
              }}
              className="rounded-xl bg-gray-800 px-6 py-3 font-bold text-white"
            >
              К бойцам →
            </button>
          </div>
        ) : (
          <button
            disabled={isSpinning}
            onClick={handleOpen}
            className="rounded-xl bg-amber-500 px-10 py-4 text-lg font-black uppercase text-gray-950 disabled:opacity-50"
          >
            {isSpinning ? 'Крутится...' : `Открыть за ${caseItem.price} ₽`}
          </button>
        )}
      </div>

      {/* БЛОК: ЧТО ВНУТРИ КЕЙСА */}
      <div className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-6">
        <h2 className="mb-6 text-xl font-black uppercase text-white">
          Что внутри?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {caseItem.drops.map((drop, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center justify-between rounded-xl border-2 bg-gray-950 p-4 ${
                RARITY_COLORS[drop.rarity] || 'border-gray-700'
              }`}
            >
              <span className="text-xs font-bold text-gray-400 mb-2">{drop.name}</span>
              
              <div className="mb-3 flex h-16 w-full items-center justify-center">
                <img
                  src={drop.icon || '/skins/placeholder.png'}
                  alt={drop.skin}
                  className="h-full w-auto object-contain"
                />
              </div>
              
              <span className="text-sm font-extrabold text-white text-center mb-2">{drop.skin}</span>
              
              <div className="w-full flex justify-between text-xs font-bold mb-3">
                <span className="text-emerald-400">{drop.price} ₽</span>
                <span className="text-amber-400">+{drop.power} ⚡</span>
              </div>

              <div className="w-full rounded bg-gray-800 py-1 text-center text-xs font-bold text-gray-300">
                Шанс: {drop.chance || 0}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CaseOpenPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="py-20 text-center text-white">Загрузка кейса...</div>}>
      <CaseContent params={params} />
    </Suspense>
  );
}