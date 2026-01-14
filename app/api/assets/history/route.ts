import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();

    const history = await prisma.assetAssignment.findMany({
      include: {
        asset: true,
        user: true,
      },
      orderBy: { assignedAt: "desc" },
    });

    return NextResponse.json(history);
  } catch {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}
