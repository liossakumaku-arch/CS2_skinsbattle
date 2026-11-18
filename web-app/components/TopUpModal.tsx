'use client';

import { useState } from 'react';
import { useUser } from '@/context/UserContext';

export default function TopUpModal({ onClose }: { onClose: () => void }) {
  const { addBalance } = useUser();
  const [amount, setAmount] = useState(500);

  const presets = [100, 500, 1000, 5000];

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount > 0) {
      addBalance(amount);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-black uppercase text-white">Пополнение баланса</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleDeposit}>
          <div className="mb-4 grid grid-cols-4 gap-2">
            {presets.map((val) => (
              <button
                type="button"
                key={val}
                onClick={() => setAmount(val)}
                className={`rounded-lg py-2 text-sm font-bold transition ${
                  amount === val
                    ? 'bg-amber-500 text-gray-950'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {val} ₽
              </button>
            ))}
          </div>

          <label className="mb-2 block text-xs font-semibold uppercase text-gray-400">
            Сумма пополнения (₽)
          </label>
          <input
            type="number"
            min={10}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="mb-6 w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-lg font-bold text-white outline-none focus:border-amber-500"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-600 py-3 font-extrabold text-white transition hover:bg-emerald-500"
          >
            Зачислить {amount} ₽ на счет
          </button>
        </form>
      </div>
    </div>
  );
}
