import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await requireAdmin();
  const data = await req.formData();
  const requestId = Number(data.get("requestId"));

  await prisma.assetRequest.update({
    where: { id: requestId },
    data: {
      status: "REJECTED",
      resolvedAt: new Date(),
    },
  });

  return NextResponse.redirect(
    new URL("/admin/requests", req.url)
  );
}
