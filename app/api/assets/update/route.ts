import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const id = Number(body.id);
    const totalCount = Number(body.totalCount);

    // 🔒 VALIDATION
    if (!id || isNaN(id) || isNaN(totalCount) || totalCount < 1) {
      return NextResponse.json(
        { error: "Invalid id or totalCount" },
        { status: 400 }
      );
    }

    const asset = await prisma.asset.findUnique({
      where: { id },
    });

    if (!asset) {
      return NextResponse.json(
        { error: "Asset not found" },
        { status: 404 }
      );
    }

    // 🔑 Assigned assets count
    const assigned =
      asset.totalCount - asset.availableCount;

    if (totalCount < assigned) {
      return NextResponse.json(
        {
          error: `Cannot reduce total below assigned (${assigned})`,
        },
        { status: 400 }
      );
    }

    await prisma.asset.update({
      where: { id },
      data: {
        totalCount,
        availableCount: totalCount - assigned,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Asset update error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

