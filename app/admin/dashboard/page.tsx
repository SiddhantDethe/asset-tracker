import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import AssetTable from "@/app/components/AssetTable";
import CreateAssetForm from "@/app/components/CreateAssetForm";

export default async function AdminDashboard() {
  await requireAdmin();

  const assets = await prisma.asset.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Admin Dashboard
      </h1>

      <CreateAssetForm />
      <AssetTable assets={assets} />
    </div>
  );
}
