import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma"; // Проверь путь!

export async function POST(req: Request) {
  console.log("🔥 1. РОУТ РЕГИСТРАЦИИ ЗАПУЩЕН!"); // <--- Смотрим в терминал VS Code
  
  try {
    const { email, password, name } = await req.json();
    console.log("🔥 2. ДАННЫЕ ПРИНЯТЫ:", { email, name });

    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log("🔥 3. ПЫТАЕМСЯ ЗАПИСАТЬ В БАЗУ...");
    const user = await prisma.user.create({
      data: { email, name, password: hashedPassword },
    });
    console.log("🔥 4. УСПЕХ! ID:", user.id);

    // Меняем статус на 299, чтобы отличить от кэша
    return NextResponse.json({ message: "OK", userId: user.id }, { status: 299 });
    
  } catch (error) {
    console.error("💀 ОШИБКА В API:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}