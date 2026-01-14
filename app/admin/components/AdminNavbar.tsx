import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminNavbar() {
  const pendingCount = await prisma.assetRequest.count({
    where: {
      status: "PENDING",
    },
  });

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b bg-black/10">
      <div className="flex gap-6 font-medium">
      
        <Link href="/admin/requests" className="relative">
          Requests
          {pendingCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center 
              rounded-full bg-red-600 text-white text-xs px-2 py-0.5">
              {pendingCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}
