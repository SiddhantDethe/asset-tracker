import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const { assetId } = await req.json();

    if (!assetId) {
      return NextResponse.json(
        { error: "Missing assetId" },
        { status: 400 }
      );
    }

    // Close active assignment
    await prisma.assetAssignment.updateMany({
      where: {
        assetId,
        returnedAt: null,
      },
      data: {
        returnedAt: new Date(),
      },
    });

    // Mark asset as AVAILABLE again
    await prisma.asset.update({
      where: { id: assetId },
      data: { availableCount: { increment: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}
