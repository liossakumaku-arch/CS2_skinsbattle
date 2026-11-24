'use client';

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// 1. Выносим всю логику в отдельный компонент
function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("1. Форма перехвачена, отправляем данные...");
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      console.log("2. Ответ от сервера:", res.status);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Что-то пошло не так");
      }

      setSuccess("Аккаунт успешно создан!");
      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5 rounded-2xl bg-slate-800 p-8 shadow-2xl border border-slate-700">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight">Создать аккаунт</h1>
          <p className="text-sm text-slate-400 mt-2">Присоединяйтесь к CS2 Skins Battle</p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20 text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-400 border border-green-500/20 text-center">
            {success}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1 text-slate-300">Имя (необязательно)</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-700 p-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            placeholder="Ваш никнейм"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-slate-300">Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-600 bg-slate-700 p-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-slate-300">Пароль *</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-lg border border-slate-600 bg-slate-700 p-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            placeholder="Минимум 6 символов"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-amber-500 py-3 font-bold text-gray-950 hover:bg-amber-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Создание..." : "Зарегистрироваться"}
        </button>
        
        <p className="text-center text-sm text-slate-400 pt-4">
          Уже есть аккаунт?{" "}
          <Link href="/login" className="text-amber-500 hover:text-amber-400 font-semibold transition">
            Войти
          </Link>
        </p>
      </form>
    </div>
  );
}

// 2. Экспортируем страницу, оборачивая форму в Suspense
export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-white">Загрузка...</div>}>
      <RegisterForm />
    </Suspense>
  );
}