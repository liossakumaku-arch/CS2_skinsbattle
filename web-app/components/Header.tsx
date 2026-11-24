'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { useSession, signOut } from 'next-auth/react'; // <-- Добавили signOut
import TopUpModal from './TopUpModal';

export default function Header() {
  const { username, balance, inventory } = useUser(); // Убрали isLoggedIn и login
  const { data: session } = useSession(); // <-- Берем сессию
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Определяем статус входа
  const isLoggedIn = !!session;

  const handleOpenTopUp = () => {
    if (!isLoggedIn) {
      window.location.href = '/login'; // Если не вошел — редирект
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-gray-800 bg-gray-900/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          {/* Левая часть: Логотип и меню */}
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-black tracking-wider text-amber-500">
              CS2<span className="text-white">BATTLE</span>
            </Link>

            <nav className="hidden md:block">
              <ul className="flex items-center gap-6 text-sm font-semibold uppercase tracking-wide text-gray-300">
                <li>
                  <Link href="/" className="transition hover:text-amber-400">Кейсы</Link>
                </li>
                <li>
                  <Link href="/battles" className="flex items-center gap-1.5 rounded-md bg-amber-500/10 px-3 py-1.5 text-amber-400 transition hover:bg-amber-500/20">
                    <span>⚔️</span> Баттлы
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="transition hover:text-white">
                    Профиль и Отряд ({inventory.length})
                  </Link>
                </li>
                <li>
                  <Link href="/daily" className="flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-3 py-1.5 text-emerald-400 transition hover:bg-emerald-500/20">
                    <span>🎁</span> Бонус
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Правая часть: Пополнение и Профиль/Вход */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleOpenTopUp}
              className="cursor-pointer rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500"
            >
              + Пополнить
            </button>

            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-950 px-3 py-1.5">
                  <span className="text-sm font-extrabold text-emerald-400">{balance} ₽</span>
                </div>

                <Link
                  href="/profile"
                  className="flex items-center gap-2 rounded-lg bg-gray-800 px-3 py-2 text-sm font-bold text-white hover:bg-gray-700"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                  {session?.user?.name || username || 'Игрок'} 
                </Link>

                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: '/' })} // <-- Правильный выход
                  className="cursor-pointer text-xs text-gray-500 hover:text-red-400"
                >
                  Выход
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
              >
                Войти
              </Link>
            )}
          </div>
        </div>
      </header>

      {isModalOpen && <TopUpModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}