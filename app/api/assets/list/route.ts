import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const assets = await prisma.asset.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        category: true,
        description: true,
        totalCount: true,
        availableCount: true,
        createdAt: true,
      },
    });

    return NextResponse.json(assets, {
      headers: {
        "Cache-Control": "no-store", // important for Render
      },
    });
  } catch (error) {
    console.error("ASSETS LIST API ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch assets" },
      { status: 500 }
    );
  }
}
