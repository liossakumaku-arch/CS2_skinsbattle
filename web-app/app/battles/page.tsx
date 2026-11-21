'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';

interface EnemySquad {
  id: number;
  name: string;
  difficulty: string;
  reward: number;
  fighters: { name: string; power: number }[];
}

const ENEMY_SQUADS: EnemySquad[] = [
  {
    id: 1,
    name: 'Отряд «Серебро»',
    difficulty: 'Легко',
    reward: 150,
    fighters: [
      { name: 'Новобранец', power: 15 },
      { name: 'Стрелок', power: 18 },
      { name: 'Разведчик', power: 20 },
      { name: 'Щитоносец', power: 22 },
      { name: 'Сержант', power: 25 },
    ],
  },
  {
    id: 2,
    name: 'Отряд «Беркуты»',
    difficulty: 'Средне',
    reward: 500,
    fighters: [
      { name: 'Штурмовик PRO', power: 60 },
      { name: 'Снайпер AWP', power: 85 },
      { name: 'Тень', power: 70 },
      { name: 'Джаггернаут', power: 90 },
      { name: 'Командир', power: 110 },
    ],
  },
  {
    id: 3,
    name: 'Отряд «Глобал Элита»',
    difficulty: 'Хардкор',
    reward: 2000,
    fighters: [
      { name: 'Киберспортсмен', power: 250 },
      { name: 'Охотник с Керамбитом', power: 320 },
      { name: 'Фантом', power: 290 },
      { name: 'Титан', power: 350 },
      { name: 'Легенда CS2', power: 450 },
    ],
  },
];

export default function BattlesPage() {
  const { fighters, totalSquadPower, addBalance, isLoggedIn, login } = useUser();

  const [selectedEnemy, setSelectedEnemy] = useState<EnemySquad>(ENEMY_SQUADS[0]);
  const [isFighting, setIsFighting] = useState(false);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [result, setResult] = useState<'win' | 'lose' | null>(null);

  const enemyTotalPower = selectedEnemy.fighters.reduce((sum, f) => sum + f.power, 0);

  const startBattle = () => {
    if (!isLoggedIn) {
      login();
      return;
    }

    setIsFighting(true);
    setResult(null);
    setBattleLog(['⚔️ Бой начался! Команды выходят на арену...']);

    let myScore = 0;
    let enemyScore = 0;

    // Пошаговая дуэль 5 раундов (боец против бойца)
    fighters.forEach((myFighter, index) => {
      setTimeout(() => {
        const enemyFighter = selectedEnemy.fighters[index];
        const myPower =
          myFighter.basePower +
          (myFighter.weaponeSkin?.power ?? 0) +
          (myFighter.knifeSkin?.power ?? 0);

        // Небольшой элемент удачи (±15%)
        const myRoll = Math.round(myPower * (0.85 + Math.random() * 0.3));
        const enemyRoll = Math.round(enemyFighter.power * (0.85 + Math.random() * 0.3));

        if (myRoll >= enemyRoll) {
          myScore++;
          setBattleLog((prev) => [
            ...prev,
            `✅ Раунд ${index + 1}: Ваш ${myFighter.name} (${myRoll} ⚡) победил вражеского ${enemyFighter.name} (${enemyRoll} ⚡)!`,
          ]);
        } else {
          enemyScore++;
          setBattleLog((prev) => [
            ...prev,
            `❌ Раунд ${index + 1}: Вражеский ${enemyFighter.name} (${enemyRoll} ⚡) одолел вашего ${myFighter.name} (${myRoll} ⚡).`,
          ]);
        }

        // Итог после 5-го раунда
        if (index === 4) {
          setTimeout(() => {
            setIsFighting(false);
            if (myScore > enemyScore) {
              setResult('win');
              addBalance(selectedEnemy.reward);
              setBattleLog((prev) => [
                ...prev,
                `🏆 ПОБЕДА со счетом ${myScore}:${enemyScore}! Награда +${selectedEnemy.reward} ₽ зачислена на баланс.`,
              ]);
            } else {
              setResult('lose');
              setBattleLog((prev) => [
                ...prev,
                `💀 ПОРАЖЕНИЕ со счетом ${myScore}:${enemyScore}. Усильте бойцов скинами из кейсов!`,
              ]);
            }
          }, 600);
        }
      }, (index + 1) * 700);
    });
  };

  return (
    <div className="py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase text-white">Арена Баттлов 5 на 5</h1>
          <p className="text-sm text-gray-400">
            Каждый из 5 персонажей сражается со своим оппонентом. Побеждает команда, выигравшая больше дуэлей!
          </p>
        </div>

        <Link
          href="/profile"
          className="rounded-xl border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm font-bold text-amber-400 hover:bg-gray-800"
        >
          🛡️ Настроить отряд ({totalSquadPower} ⚡)
        </Link>
      </div>

      {/* Выбор соперника */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {ENEMY_SQUADS.map((enemy) => {
          const power = enemy.fighters.reduce((s, f) => s + f.power, 0);
          const isSelected = selectedEnemy.id === enemy.id;
          return (
            <button
              key={enemy.id}
              disabled={isFighting}
              onClick={() => {
                setSelectedEnemy(enemy);
                setBattleLog([]);
                setResult(null);
              }}
              className={`rounded-2xl border-2 p-5 text-left transition ${
                isSelected
                  ? 'border-amber-500 bg-amber-500/10'
                  : 'border-gray-800 bg-gray-900 hover:border-gray-700'
              }`}
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-amber-400">{enemy.difficulty}</span>
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-extrabold text-emerald-400">
                  Награда: {enemy.reward} ₽
                </span>
              </div>
              <div className="mb-2 text-lg font-black text-white">{enemy.name}</div>
              <div className="text-sm font-bold text-gray-400">Сила врага: {power} ⚡</div>
            </button>
          );
        })}
      </div>

      {/* Поле сравнения составов */}
      <div className="mb-8 grid grid-cols-1 items-center gap-6 rounded-2xl border border-gray-800 bg-gray-900 p-6 md:grid-cols-11">
        {/* Твой отряд */}
        <div className="md:col-span-5">
          <div className="mb-3 flex justify-between font-black text-white">
            <span>Ваш отряд</span>
            <span className="text-amber-400">{totalSquadPower} ⚡</span>
          </div>
          <div className="space-y-2">
          {fighters.map((f) => {
            const p =
              f.basePower +
              (f.weaponeSkin?.power ?? 0) +
              (f.knifeSkin?.power ?? 0);
            const skins = [f.weaponeSkin, f.knifeSkin].filter(Boolean);
            return (
              <div
                key={f.slotId}
                className="flex items-center justify-between rounded-lg bg-gray-950 px-3 py-2 text-sm"
              >
                <div>
                  <span className="font-bold text-white">{f.name}</span>
                  {skins.length > 0 && (
                    <span className="ml-2 text-xs text-gray-400">
                      [{skins.map((s) => s!.name).join(', ')}]
                    </span>
                  )}
                </div>
                <span className="font-bold text-amber-400">{p} ⚡</span>
              </div>
            );
          })}
          </div>
        </div>

        {/* VS */}
        <div className="text-center md:col-span-1">
          <span className="inline-block rounded-full bg-red-600/20 px-3 py-2 text-xl font-black text-red-500">
            VS
          </span>
        </div>

        {/* Отряд врага */}
        <div className="md:col-span-5">
          <div className="mb-3 flex justify-between font-black text-white">
            <span>{selectedEnemy.name}</span>
            <span className="text-red-400">{enemyTotalPower} ⚡</span>
          </div>
          <div className="space-y-2">
            {selectedEnemy.fighters.map((ef, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-lg bg-gray-950 px-3 py-2 text-sm"
              >
                <span className="font-bold text-gray-200">{ef.name}</span>
                <span className="font-bold text-red-400">{ef.power} ⚡</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Кнопка старта боя */}
      <div className="mb-8 text-center">
        <button
          disabled={isFighting}
          onClick={startBattle}
          className="rounded-xl bg-amber-500 px-10 py-4 text-lg font-black uppercase text-gray-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-400 disabled:opacity-50"
        >
          {isFighting ? 'Идет сражение...' : `Начать бой (Награда ${selectedEnemy.reward} ₽)`}
        </button>
      </div>

      {/* Лог боя */}
      {battleLog.length > 0 && (
        <div
          className={`rounded-2xl border p-6 ${
            result === 'win'
              ? 'border-emerald-500 bg-emerald-950/20'
              : result === 'lose'
              ? 'border-red-500 bg-red-950/20'
              : 'border-gray-800 bg-gray-900'
          }`}
        >
          <h3 className="mb-3 text-sm font-extrabold uppercase text-gray-400">Ход сражения:</h3>
          <div className="space-y-2 text-sm">
            {battleLog.map((line, i) => (
              <div key={i} className="font-medium text-gray-200">
                {line}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
