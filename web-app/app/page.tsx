import Link from 'next/link';
import CaseCard from '@/components/CaseCard';
import { CASES_DATA } from '@/data/casesData';
import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';

// 1. Выносим запрос к базе в отдельный асинхронный компонент
async function UsersList() {
  // Если база данных пуста или недоступна, это не сломает всю страницу
  try {
    const users = await prisma.user.findMany();
    
    if (users.length === 0) {
      return <p className="text-sm text-gray-500">Пользователей пока нет.</p>;
    }

    return (
      <div className="flex gap-2">
        {users.map((u) => (
          <span key={u.id} className="rounded bg-gray-800 px-2 py-1 text-xs text-gray-300">
            {u.email || u.name || 'Без имени'}
          </span>
        ))}
      </div>
    );
  } catch (error) {
    console.error("Ошибка загрузки юзеров:", error);
    return <p className="text-sm text-red-500">База данных недоступна.</p>;
  }
}

// 2. Основная страница теперь НЕ async, она просто рендерит верстку
export default function HomePage() {
  const categories = ['Бюджетные', 'Популярные сборки', 'Элитные кейсы'];

  return (
    <div className="py-8">
      <div className="mb-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-gray-900 via-amber-950/30 to-gray-900 p-6 sm:flex-row">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wide text-white">
            Собери отряд из 5 бойцов и побеждай
          </h1>
          <p className="text-sm text-gray-400">
            Выбивай редкие скины из кейсов, экипируй персонажей в профиле и сражайся на арене!
          </p>
          
          {/* 3. Оборачиваем UsersList в Suspense. Пока база думает, покажем заглушку */}
          <div className="mt-4">
            <Suspense fallback={<p className="text-sm text-gray-500">Загрузка пользователей...</p>}>
              <UsersList />
            </Suspense>
          </div>
        </div>
        
        <Link
          href="/battles"
          className="whitespace-nowrap rounded-xl bg-amber-500 px-6 py-3 font-extrabold text-gray-950 transition hover:bg-amber-400"
        >
          ⚔️ На арену баттлов
        </Link>
      </div>

      {categories.map((category) => (
        <section key={category} className="mb-12">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-6 w-1.5 rounded-full bg-amber-500"></span>
            <h2 className="text-xl font-extrabold uppercase tracking-wider text-white">
              {category}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
            {CASES_DATA.filter((c) => c.category === category).map((item) => (
              <CaseCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}