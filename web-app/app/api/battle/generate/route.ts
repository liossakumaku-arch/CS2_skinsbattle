import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const { totalSquadPower } = await req.json();

  // Проверяем, есть ли уже активный бой
  let activeBattle = await prisma.activeBattle.findUnique({
    where: { userId: session.user.id }
  });

  // Если боя нет — генерируем
  if (!activeBattle) {
    const averagePower = Math.floor(totalSquadPower / 5);
    const enemyNames = ['Тень', 'Снайпер', 'Штурмовик', 'Разведчик', 'Тяжеловес'];
    
    const enemies = Array.from({ length: 5 }).map((_, i) => {
      let power = averagePower;
      if (Math.random() < 0.8) {
        if (Math.random() < 0.2) power -= Math.floor(Math.random() * 100) + 1;
        else power += Math.floor(Math.random() * 120) + 1;
      }
      if (power < 1) power = 1;
      return { name: `Враг #${i + 1} (${enemyNames[i]})`, power };
    });

    activeBattle = await prisma.activeBattle.create({
      data: {
        userId: session.user.id,
        enemyData: JSON.stringify(enemies),
      }
    });
  }

  // Возвращаем врагов (новых или сохраненных ранее)
  return NextResponse.json(JSON.parse(activeBattle.enemyData));
}