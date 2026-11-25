import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // путь к твоему конфигу
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET: Загрузка данных при входе
export async function GET() {
  const session = await getServerSession(authOptions);
  
  //console.log("--- API USER DATA ---");
  //console.log("SESSION:", session); 
  //рабочие процессы

  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { balance: true, inventory: true, fighters: true, streak: true, lastClaimDate: true },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({
    balance: user.balance,
    inventory: user.inventory ? JSON.parse(user.inventory) : [],
    fighters: user.fighters ? JSON.parse(user.fighters) : null,
    streak: user.streak,
    lastClaimDate: user.lastClaimDate,
  });
}

// POST: Сохранение данных (вызывать после каждого изменения)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { balance, inventory, fighters, streak, lastClaimDate } = body;

  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      balance,
      inventory: JSON.stringify(inventory),
      fighters: fighters ? JSON.stringify(fighters) : null,
      streak,
      lastClaimDate,
    },
  });

  return NextResponse.json({ success: true });
}