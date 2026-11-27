'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { useSession } from 'next-auth/react';

interface EnemyFighter {
  name: string;
  power: number;
}

export default function BattlesPage() {
  const { fighters } = useUser();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [playerSlots, setPlayerSlots] = useState([0, 1, 2, 3, 4]);
  const [selectedFighterIndex, setSelectedFighterIndex] = useState<number | null>(null);

  const [isFighting, setIsFighting] = useState(false);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [result, setResult] = useState<'win' | 'lose' | null>(null);
  
  const [enemies, setEnemies] = useState<EnemyFighter[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isBattleOver, setIsBattleOver] = useState(false); 

  const getFighterPower = (fighter: any) => {
    return fighter.basePower + (fighter.weaponeSkin?.power ?? 0) + (fighter.knifeSkin?.power ?? 0);
  };

  const totalSquadPower = useMemo(() => {
    return fighters.reduce((sum: number, f: any) => sum + getFighterPower(f), 0);
  }, [fighters]);

  useEffect(() => {
    async function prepareBattle() {
      if (status === "loading" || !session) return;
      try {
        const res = await fetch('/api/battle/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ totalSquadPower })
        });
        if (res.ok) setIsReady(true);
      } catch (error) {
        console.error("Ошибка подготовки боя", error);
      }
    }
    prepareBattle();
  }, [session, status, totalSquadPower]);

  const handleSelectFighter = (slotIndex: number) => {
    if (isFighting || isBattleOver) return;
    
    if (selectedFighterIndex === null) {
      setSelectedFighterIndex(slotIndex);
    } else {
      const newSlots = [...playerSlots];
      const temp = newSlots[selectedFighterIndex];
      newSlots[selectedFighterIndex] = newSlots[slotIndex];
      newSlots[slotIndex] = temp;
      setPlayerSlots(newSlots);
      setSelectedFighterIndex(null);
    }
  };

  const startBattle = async () => {
    if (!session) {
      window.location.href = '/login';
      return;
    }
    if (!isReady) return;

    const res = await fetch('/api/battle/reveal', { credentials: 'include' });
    if (!res.ok) {
      alert("Ошибка загрузки врагов");
      return;
    }
    const revealedEnemies: EnemyFighter[] = await res.json();
    setEnemies(revealedEnemies);

    setIsFighting(true);
    setIsBattleOver(false);
    setResult(null);
    setBattleLog(['⚔️ Бой начался! Бойцы выходят на арену...']);

    let myWins = 0;
    let enemyWins = 0;
    let myTotalPowerInBattle = 0;

    for (let i = 0; i < 5; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const myFighter = fighters[playerSlots[i]];
      const enemyFighter = revealedEnemies[i];
      const myPower = getFighterPower(myFighter);
      const enemyPower = enemyFighter.power;
      const myRoll = Math.round(myPower * (0.85 + Math.random() * 0.3));
      const enemyRoll = Math.round(enemyPower * (0.85 + Math.random() * 0.3));

      if (myRoll >= enemyRoll) {
        myWins++;
        myTotalPowerInBattle += myPower;
        setBattleLog(prev => [...prev, `✅ Раунд ${i + 1}: Ваш ${myFighter.name} (${myRoll} ⚡) победил ${enemyFighter.name} (${enemyRoll} ⚡)!`]);
      } else {
        enemyWins++;
        setBattleLog(prev => [...prev, `❌ Раунд ${i + 1}: ${enemyFighter.name} (${enemyRoll} ⚡) одолел вашего ${myFighter.name} (${myRoll} ⚡).`]);
      }
    }

    await new Promise(resolve => setTimeout(resolve, 600));
    setIsFighting(false);
    setIsBattleOver(true); 

    if (myWins >= 3) {
      setResult('win');
      const rewardMoney = Math.ceil(myTotalPowerInBattle / 100);
      const isPerfect = myWins === 5;
      
      // Отправляем результат на сервер
      const finishRes = await fetch('/api/battle/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ result: 'win', reward: rewardMoney, isPerfectWin: isPerfect })
      });

      const finishData = await finishRes.json();

      let winMessage = `🏆 ПОБЕДА со счетом ${myWins}:${enemyWins}!`;
      if (finishData.totalReward > 0) {
        winMessage += ` Награда: +${finishData.totalReward} ₽.`;
      }
      if (isPerfect) {
        winMessage += ` ИДЕАЛЬНАЯ ПОБЕДА! Вы получаете бонус на открытие кейса! 🎁`;
      }

      setBattleLog(prev => [...prev, winMessage]);
    } else {
      setResult('lose');
      await fetch('/api/battle/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ result: 'lose', reward: 0, isPerfectWin: false })
      });
      setBattleLog(prev => [...prev, `💀 ПОРАЖЕНИЕ со счетом ${myWins}:${enemyWins}.`]);
    }
  };

  return (
    <div className="py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase text-white">Арена Баттлов 5 на 5</h1>
          <p className="text-sm text-gray-400">
            Расставьте бойцов в нужном порядке и сразитесь с зеркальным отрядом. Для победы нужно выиграть 3 дуэли из 5.
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-gray-400">Общая сила отряда</div>
          <div className="text-2xl font-black text-amber-400">{totalSquadPower} ⚡</div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 items-stretch gap-6 rounded-2xl border border-gray-800 bg-gray-900 p-6 md:grid-cols-11">
        <div className="md:col-span-5">
          <div className="mb-3 text-center font-black text-white uppercase text-sm">Ваш отряд (Кликните для смены)</div>
          <div className="space-y-2">
            {playerSlots.map((fighterIndex, slotIndex) => {
              const f = fighters[fighterIndex];
              if (!f) return null;
              const p = getFighterPower(f);
              const isSelected = selectedFighterIndex === slotIndex;
              return (
                <div
                  key={slotIndex}
                  onClick={() => handleSelectFighter(slotIndex)}
                  className={`flex items-center justify-between rounded-lg px-3 py-3 text-sm cursor-pointer transition-all ${
                    isSelected ? 'bg-amber-500/20 border-2 border-amber-500 scale-105' : 'bg-gray-950 border-2 border-transparent hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 font-mono text-xs">#{slotIndex + 1}</span>
                    <span className="font-bold text-white">{f.name}</span>
                  </div>
                  <span className="font-bold text-amber-400">{p} ⚡</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-center md:col-span-1">
          <span className="inline-block rounded-full bg-red-600/20 px-4 py-3 text-xl font-black text-red-500 border border-red-500/30">
            VS
          </span>
        </div>

        <div className="md:col-span-5">
          <div className="mb-3 text-center font-black text-red-400 uppercase text-sm">Зеркальный отряд</div>
          <div className="space-y-2">
            {enemies.length === 0 ? (
              <div className="flex h-full items-center justify-center text-gray-600 text-sm italic py-10 border-2 border-dashed border-gray-800 rounded-lg">
                ???
              </div>
            ) : (
              enemies.map((ef, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-lg bg-gray-950 px-3 py-3 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 font-mono text-xs">#{idx + 1}</span>
                    <span className="font-bold text-gray-200">{ef.name}</span>
                  </div>
                  <span className="font-bold text-red-400">{ef.power} ⚡</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mb-8 text-center">
        <button
          disabled={isFighting || !isReady || isBattleOver}
          onClick={startBattle}
          className="rounded-xl bg-amber-500 px-10 py-4 text-lg font-black uppercase text-gray-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-400 disabled:opacity-50"
        >
          {isFighting ? 'Идет сражение...' : 'Начать бой'}
        </button>
      </div>

      {battleLog.length > 0 && (
        <div
          className={`rounded-2xl border p-6 ${
            result === 'win' ? 'border-emerald-500 bg-emerald-950/20' : result === 'lose' ? 'border-red-500 bg-red-950/20' : 'border-gray-800 bg-gray-900'
          }`}
        >
          <h3 className="mb-3 text-sm font-extrabold uppercase text-gray-400">Ход сражения:</h3>
          <div className="space-y-2 text-sm">
            {battleLog.map((line, i) => (
              <div key={i} className="font-medium text-gray-200">{line}</div>
            ))}
          </div>
        </div>
      )}

      {isBattleOver && (
        <div className="mt-6 text-center">
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl bg-emerald-600 px-8 py-4 font-black uppercase text-white shadow-lg transition hover:bg-emerald-500"
          >
            Далее (Новый бой) →
          </button>
        </div>
      )}
    </div>
  );
}