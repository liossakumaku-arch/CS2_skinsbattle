'use client';

import { useUser } from '@/context/UserContext';
import Link from 'next/link';

export default function DailyPage() {
  const { isLoggedIn, streak, lastClaimDate, claimDailyReward } = useUser();

  if (!isLoggedIn) {
    return (
      <div className="py-20 text-center text-white">
        <h1 className="text-2xl font-black mb-4">Вы не авторизованы</h1>
        <Link href="/login" className="bg-amber-500 text-gray-950 px-6 py-3 rounded-xl font-bold">
          Войти
        </Link>
      </div>
    );
  }

  const today = new Date().toDateString();
  const canClaim = lastClaimDate !== today;
  const currentDay = canClaim ? (streak >= 7 ? 1 : streak + 1) : streak;
  const rewards = [60, 80, 100, 150, 200, 300, 500];

  return (
    <div className="mx-auto max-w-4xl py-10 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black text-white mb-2">ЕЖЕДНЕВНЫЙ ВХОД</h1>
        <p className="text-gray-400">Заходи каждый день и получай всё больше денег!</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 mb-8">
        {rewards.map((amount, index) => {
          const dayNumber = index + 1;
          const isPassed = dayNumber < currentDay;
          const isCurrent = dayNumber === currentDay;
          
          return (
            <div
              key={index}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                isPassed
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                  : isCurrent
                  ? 'border-amber-500 bg-amber-500/20 text-amber-400 scale-105 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                  : 'border-gray-800 bg-gray-900 text-gray-500'
              }`}
            >
              <span className="text-xs font-bold uppercase mb-2">День {dayNumber}</span>
              <div className="text-xl font-black">{amount} ₽</div>
              {isPassed && <span className="text-xs mt-2">✅ Получено</span>}
            </div>
          );
        })}
      </div>

      <div className="text-center mt-10">
        <button
          onClick={() => {
            const success = claimDailyReward();
            if (success) {
              alert('Бонус успешно получен!');
            } else {
              alert('Вы уже получали бонус сегодня. Возвращайтесь завтра!');
            }
          }}
          disabled={!canClaim}
          className={`px-10 py-4 rounded-xl font-black uppercase text-lg transition-all ${
            canClaim
              ? 'bg-amber-500 text-gray-950 hover:bg-amber-400 hover:scale-105 cursor-pointer'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          {canClaim ? 'Забрать награду' : 'Уже получено'}
        </button>
      </div>

      <div className="text-center mt-6">
        <Link href="/" className="text-sm text-gray-400 hover:text-amber-400 underline">
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}