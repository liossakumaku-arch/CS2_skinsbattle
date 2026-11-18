import Link from 'next/link';
import CaseCard from '@/components/CaseCard';
import { CASES_DATA } from '@/data/casesData';

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
