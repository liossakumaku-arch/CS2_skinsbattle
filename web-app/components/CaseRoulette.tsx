'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image'; // ← добавили импорт картинок
import { SkinItem } from '@/context/UserContext';

const CARD_COLORS: Record<string, string> = {
  blue: 'border-b-4 border-blue-500 bg-gray-900',
  purple: 'border-b-4 border-purple-500 bg-gray-900',
  pink: 'border-b-4 border-pink-500 bg-gray-900',
  red: 'border-b-4 border-red-500 bg-gray-900',
  gold: 'border-b-4 border-amber-400 bg-gray-900',
};

export default function CaseRoulette({
  items,
  winIndex,
}: {
  items: Omit<SkinItem, 'id'>[];
  winIndex: number;
}) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    setOffset(0);
    const timer = setTimeout(() => {
      const randomShift = Math.floor(Math.random() * 60) - 30;
      setOffset(winIndex * 168 + 80 + randomShift);
    }, 60);

    return () => clearTimeout(timer);
  }, [items, winIndex]);

  return (
    <div className="relative mx-auto mb-8 h-44 w-full overflow-hidden rounded-2xl border-2 border-gray-800 bg-gray-950">
      <div className="pointer-events-none absolute inset-y-0 left-1/2 z-20 w-1 -translate-x-1/2 bg-amber-500 shadow-[0_0_15px_#f59e0b]" />

      <div
        className="flex h-full items-center gap-2"
        style={{
          paddingLeft: '50%',
          transform: `translate3d(-${offset}px, 0, 0)`,
          transition:
            offset > 0
              ? 'transform 4.4s cubic-bezier(0.12, 0.85, 0.18, 1)'
              : 'none',
        }}
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`flex h-36 w-40 min-w-[160px] flex-col justify-between rounded-xl p-3 text-left ${CARD_COLORS[item.rarity]}`}
          >
            <span className="text-[11px] font-bold uppercase text-gray-400">
              {item.name}
            </span>
            

            <div className="flex flex-1 items-center justify-center py-1">
              <div className="relative h-14 w-24">
                <Image
                  src={item.icon || '/skins/placeholder.png'}
                  alt={item.skin}
                  fill
                  unoptimized
                  className="object-contain"
                  sizes="96px"
                />
              </div>
            </div>

            <div>
              <div className="truncate text-xs font-extrabold text-white">
                {item.skin}
              </div>
              <div className="mt-1 flex justify-between text-[11px] font-bold">
                <span className="text-emerald-400">{item.price} ₽</span>
                <span className="text-amber-400">+{item.power} ⚡</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
