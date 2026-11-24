import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email и пароль обязательны" }, { status: 400 });
    }

    // Проверяем, нет ли уже такого пользователя
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: "Пользователь уже существует" }, { status: 400 });
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаем пользователя в БД
    const user = await prisma.user.create({
      data: {
        email,
        name: name || null,
        password: hashedPassword,
        // Явно задаем стартовые данные для игры:
        balance: 67,
        inventory: JSON.stringify([]), // Пустой массив, закодированный в строку
        fighters: null,
        streak: 0,
        lastClaimDate: null,
      },
    });

    return NextResponse.json({ message: "Пользователь создан", userId: user.id }, { status: 201 });
  } catch (error) {
    console.error("ОШИБКА ПРИ РЕГИСТРАЦИИ:", error);
    return NextResponse.json({ error: "Ошибка при регистрации" }, { status: 500 });
  }
}