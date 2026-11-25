import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!userId) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const activeBattle = await prisma.activeBattle.findUnique({
    where: { userId }
  });

  if (!activeBattle) {
    return NextResponse.json({ error: "Бой не найден" }, { status: 404 });
  }

  return NextResponse.json(JSON.parse(activeBattle.enemyData));
}