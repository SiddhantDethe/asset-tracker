/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const { assetId, userId } = await req.json();

    if (!assetId || !userId) {
      return NextResponse.json(
        { error: "Missing assetId or userId" },
        { status: 400 }
      );
    }

    // 🔍 Check availability
    const asset = await prisma.asset.findUnique({
      where: { id: assetId },
    });

    if (!asset || asset.availableCount <= 0) {
      return NextResponse.json(
        { error: "Asset not available" },
        { status: 400 }
      );
    }

    // 🔒 Atomic operation (safe under concurrency)
    await prisma.$transaction([
      prisma.assetAssignment.create({
        data: {
          assetId,
          userId,
        },
      }),

      prisma.asset.update({
        where: { id: assetId },
        data: {
          availableCount: { decrement: 1 },
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}
