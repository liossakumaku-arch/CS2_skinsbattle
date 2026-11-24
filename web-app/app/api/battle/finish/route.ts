import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const { result, reward, isPerfect } = await req.json();

  // Проверяем, есть ли вообще активный бой (защита от спама запросами)
  const activeBattle = await prisma.activeBattle.findUnique({
    where: { userId: session.user.id }
  });

  if (!activeBattle) {
    return NextResponse.json({ error: "Активный бой не найден" }, { status: 400 });
  }

  // Удаляем бой
  await prisma.activeBattle.delete({
    where: { userId: session.user.id }
  });

  // Начисляем награду только если победа
  if (result === 'win' && reward > 0) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { balance: { increment: reward } }
    });
  }

  // (Здесь же можно логику добавления скина, если isPerfect === true)

  return NextResponse.json({ success: true });
}