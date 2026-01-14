import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, category, description, totalCount } = await req.json();

  if (!name || !category || totalCount < 1) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const asset = await prisma.asset.create({
    data: {
      name,
      category,
      description,
      totalCount,
      availableCount: totalCount,
    },
  });

  return NextResponse.json(asset);
}
