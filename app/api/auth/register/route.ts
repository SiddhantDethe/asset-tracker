// app/api/auth/register/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { username, password, email } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return NextResponse.json({ error: "User exists" }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      username,
      email,
      password: hashed,
      role: "user",
    },
  });

  return NextResponse.json({ success: true });
}
