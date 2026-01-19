import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  await requireAdmin();

  const assets = await prisma.asset.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(assets);
}
