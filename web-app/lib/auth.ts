import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma"; // Если подчеркивает, замени на "../../lib/prisma" (зависит от глубины)
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" }, // Для Credentials лучше JWT
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        // Ищем пользователя в БД
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        
        // Если юзера нет или пароль не сохранен — отказ
        if (!user || !user.password) return null;
        
        // Сравниваем пароли
        const passwordsMatch = await bcrypt.compare(credentials.password, user.password);
        if (!passwordsMatch) return null;
        
        return user;
      },
    }),
  ],
  pages: { 
    signIn: "/login" // Наша кастомная страница входа
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        // Добавляем ID в сессию, чтобы баттлы и баланс работали
        (session.user as any).id = token.sub; 
      }
      return session;
    },
  },
};