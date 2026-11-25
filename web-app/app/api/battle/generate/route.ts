import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!userId) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const { totalSquadPower } = await req.json();

  // Проверяем, есть ли уже активный бой
  let activeBattle = await prisma.activeBattle.findUnique({
    where: { userId }
  });

  // Если боя нет — генерируем и сохраняем в БД
  if (!activeBattle) {
    const averagePower = Math.floor(totalSquadPower / 5);
    const enemyNames = ['Тень', 'Снайпер', 'Штурмовик', 'Разведчик', 'Тяжеловес'];
    
    const enemies = Array.from({ length: 5 }).map((_, i) => {
      let power = averagePower;
      if (Math.random() < 0.5) {
        if (Math.random() < 0.5) power -= Math.floor(Math.random() * 100) + 1;
        else power += Math.floor(Math.random() * 120) + 1;
      }
      if (power < 1) power = 1;
      return { name: `Враг #${i + 1} (${enemyNames[i]})`, power };
    });

    await prisma.activeBattle.create({
      data: {
        userId,
        enemyData: JSON.stringify(enemies),
      }
    });
  }

  // ВАЖНО: Мы НЕ возвращаем врагов, а просто говорим, что всё готово
  return NextResponse.json({ status: "ready" });
}