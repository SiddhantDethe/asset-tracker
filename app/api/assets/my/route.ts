import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    // 🔐 Ensure user is authenticated
    const session = await requireAuth();

    // 🔑 Convert string → number for Prisma
    const userId = Number(session.user.id);

    const assets = await prisma.assetAssignment.findMany({
      where: {
        userId,
        returnedAt: null,
      },
      orderBy: {
        assignedAt: "desc",
      },
      select: {
        id: true,
        assignedAt: true,
        asset: {
          select: {
            id: true,
            name: true,
            category: true,
            description: true,
          },
        },
      },
    });

    return NextResponse.json(assets, {
      headers: {
        "Cache-Control": "no-store", // IMPORTANT on Render
      },
    });
  } catch (error) {
    console.error("MY ASSETS API ERROR:", error);

    return NextResponse.json(
      { error: "Unauthorized or failed to fetch assets" },
      { status: 401 }
    );
  }
}
