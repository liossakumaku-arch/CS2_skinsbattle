import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CASES_DATA } from "@/data/casesData"; // Нужен для цены кейса

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!userId) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const { result, reward, isPerfectWin } = await req.json();

  const activeBattle = await prisma.activeBattle.findUnique({ where: { userId } });
  if (!activeBattle) return NextResponse.json({ error: "Бой не найден" }, { status: 400 });

  // активный бой
  await prisma.activeBattle.delete({ where: { userId } });

  let totalReward = 0;

  if (result === 'win') {
    // Базовая награда 
    totalReward += reward;

    // Бонус за идеальную победу 
    if (isPerfectWin) {
      const cheapestCase = [...CASES_DATA].sort((a, b) => a.price - b.price)[0];
      if (cheapestCase) {
        totalReward += cheapestCase.price; // Добавляем цену кейса 
      }
    }

    // Начисляем общую сумму в базу данных
    await prisma.user.update({
      where: { id: userId },
      data: { balance: { increment: totalReward } }
    });
  }

  // Возвращаем итоговую награду , чтобы показать 
  return NextResponse.json({ success: true, totalReward });
}