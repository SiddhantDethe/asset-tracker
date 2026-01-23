import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const data = await req.formData();

    const assetId = Number(data.get("assetId"));
    const type = data.get("type") as "REQUEST" | "RETURN";

    if (!assetId || !type) {
      return NextResponse.json(
        { error: "Missing assetId or type" },
        { status: 400 }
      );
    }

    const userId = Number(session.user.id);

    // 🚫 Prevent duplicate pending requests
    const existing = await prisma.assetRequest.findFirst({
      where: {
        assetId,
        userId,
        type,
        status: "PENDING",
      },
    });

    if (existing) {
      return NextResponse.redirect(
        new URL("/dashboard", req.url)
      );
    }

    await prisma.assetRequest.create({
      data: {
        assetId,
        userId,
        type,
        status: "PENDING",
      },
    });

    return NextResponse.redirect(
      new URL("/dashboard", req.url)
    );
  } catch (error) {
    console.error("REQUEST CREATE ERROR:", error);
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}
