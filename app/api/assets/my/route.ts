import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await requireAuth();

    const assets = await prisma.assetAssignment.findMany({
      where: {
        userId: session.user.id,
        returnedAt: null,
      },
      include: {
        asset: true,
      },
    });

    return NextResponse.json(assets);
  } catch {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}
