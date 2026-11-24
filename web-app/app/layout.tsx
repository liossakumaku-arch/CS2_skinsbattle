import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Providers } from './providers';
import { getServerSession } from 'next-auth'; 
import { authOptions } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'CS2BATTLE — Кейсы и Баттлы скинов',
  description: 'Открывай кейсы CS2 и сражайся в баттлах с другими игроками',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="ru">
      <body className="flex min-h-screen flex-col bg-gray-950 text-white antialiased">
        <Providers session={session}> 
          <Header />
          <main className="mx-auto w-full max-w-7xl flex-1 px-4">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
