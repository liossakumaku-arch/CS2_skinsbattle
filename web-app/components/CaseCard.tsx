import Link from 'next/link';
import { CaseConfig } from '@/data/casesData';

export default function CaseCard({ item }: { item: CaseConfig }) {
  return (
    <Link
      href={`/case/${item.id}`}
      className="group relative flex flex-col items-center rounded-xl border border-gray-800 bg-gray-900/80 p-5 transition duration-200 hover:-translate-y-1 hover:border-amber-500/50 hover:bg-gray-900"
    >
      {item.badge && (
        <span className="absolute right-3 top-3 rounded bg-amber-500 px-2 py-0.5 text-[10px] font-extrabold uppercase text-gray-950">
          {item.badge}
        </span>
      )}

      <div
        className={`mb-4 flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accentColor} shadow-inner transition duration-300 group-hover:scale-105`}
      >
        <span className="text-5xl">📦</span>
      </div>

      <h3 className="mb-3 text-center text-base font-bold text-gray-100 group-hover:text-amber-400">
        {item.title}
      </h3>

      <div className="mt-auto w-full rounded-lg bg-gray-800 py-2 text-center text-sm font-extrabold text-amber-400 transition group-hover:bg-amber-500 group-hover:text-gray-950">
        {item.price} ₽
      </div>
    </Link>
  );
}
