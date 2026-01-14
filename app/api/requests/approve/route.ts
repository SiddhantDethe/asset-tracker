import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await requireAdmin();

  const data = await req.formData();
  const requestId = Number(data.get("requestId"));

  if (!requestId) {
    return NextResponse.json(
      { error: "Invalid requestId" },
      { status: 400 }
    );
  }

  const request = await prisma.assetRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    return NextResponse.json(
      { error: "Request not found" },
      { status: 404 }
    );
  }

  /* =========================
     APPROVE ASSET REQUEST
  ========================= */

  if (request.type === "REQUEST") {
    const asset = await prisma.asset.findUnique({
      where: { id: request.assetId },
    });

    if (!asset || asset.availableCount <= 0) {
      return NextResponse.json(
        { error: "Asset not available" },
        { status: 400 }
      );
    }

    // 🔒 Atomic transaction
    await prisma.$transaction([
      prisma.assetAssignment.create({
        data: {
          assetId: request.assetId,
          userId: request.userId,
        },
      }),

      prisma.asset.update({
        where: { id: request.assetId },
        data: {
          availableCount: { decrement: 1 },
        },
      }),

      prisma.assetRequest.update({
        where: { id: request.id },
        data: {
          status: "APPROVED",
          resolvedAt: new Date(),
        },
      }),
    ]);
  }

  /* =========================
     APPROVE RETURN REQUEST
  ========================= */

  if (request.type === "RETURN") {
    const assignment = await prisma.assetAssignment.findFirst({
      where: {
        assetId: request.assetId,
        userId: request.userId,
        returnedAt: null,
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: "Active assignment not found" },
        { status: 400 }
      );
    }

    // 🔒 Atomic transaction
    await prisma.$transaction([
      prisma.assetAssignment.update({
        where: { id: assignment.id },
        data: {
          returnedAt: new Date(),
        },
      }),

      prisma.asset.update({
        where: { id: request.assetId },
        data: {
          availableCount: { increment: 1 },
        },
      }),

      prisma.assetRequest.update({
        where: { id: request.id },
        data: {
          status: "APPROVED",
          resolvedAt: new Date(),
        },
      }),
    ]);
  }

  return NextResponse.redirect(
    new URL("/admin/requests", req.url)
  );
}
