import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await requireAuth();
  const data = await req.formData();

  const assetId = Number(data.get("assetId"));
  const type = data.get("type") as "REQUEST" | "RETURN";
  const initiator = (data.get("initiator") as "USER" | "ADMIN") ?? "USER";

  const userId =
    initiator === "ADMIN" && data.get("userId")
      ? Number(data.get("userId"))
      : Number(session.user.id);

  // 🚫 Prevent duplicate pending requests
  const existing = await prisma.assetRequest.findFirst({
    where: {
      assetId,
      userId,
      type,
      status: "PENDING",
    },
  });

  if (!existing) {
    await prisma.assetRequest.create({
      data: {
        assetId,
        userId,
        type,
        initiator,
      },
    });
  }

  return NextResponse.redirect(
    new URL("/dashboard", req.url)
  );
}
