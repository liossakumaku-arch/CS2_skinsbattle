export default function Inventory() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Шапка */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="/" className="text-xl font-bold tracking-tight text-indigo-600">
            MyBrand
          </a>
          <nav className="hidden gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#" className="transition hover:text-indigo-600">Возможности</a>
            <a href="#" className="transition hover:text-indigo-600">Тарифы</a>
            <a href="#" className="transition hover:text-indigo-600">О нас</a>
            <a href="#" className="transition hover:text-indigo-600">Контакты</a>
          </nav>
          <a
            href="#"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
          >
            Начать
          </a>
        </div>
      </header>

      {/* Hero-секция */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <span className="mb-4 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
          Новинка
        </span>
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">
          Создавайте сайты{' '}
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            быстрее
          </span>{' '}
          с Tailwind
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
          Утилитарный подход к стилизации: собирайте интерфейсы из готовых классов,
          не покидая разметку. Адаптивность, тёмная тема и состояния — из коробки.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#"
            className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-center font-semibold text-white shadow-md transition hover:bg-indigo-500 sm:w-auto"
          >
            Попробовать бесплатно
          </a>
          <a
            href="#"
            className="w-full rounded-lg border border-slate-300 bg-white px-6 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-100 sm:w-auto"
          >
            Документация
          </a>
        </div>
      </section>

      {/* Карточки возможностей */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl group-hover:bg-indigo-100">
                {f.icon}
              </div>
              <h2 className="text-lg font-semibold">{f.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Футер */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row">
          <p>© 2026 MyBrand. Все права защищены.</p>
          <div className="flex gap-6">
            <a href="#" className="transition hover:text-indigo-600">Политика</a>
            <a href="#" className="transition hover:text-indigo-600">Условия</a>
            <a href="#" className="transition hover:text-indigo-600">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: '⚡',
    title: 'Скорость',
    desc: 'Генерируется только тот CSS, который реально используется в разметке.',
  },
  {
    icon: '📱',
    title: 'Адаптивность',
    desc: 'Префиксы sm:, md:, lg: позволяют задавать стили под любой экран.',
  },
  {
    icon: '🎨',
    title: 'Кастомизация',
    desc: 'Цвета, шрифты и отступы настраиваются через CSS-переменные в @theme.',
  },
];
  