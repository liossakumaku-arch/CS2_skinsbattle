import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // путь к твоему конфигу

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };