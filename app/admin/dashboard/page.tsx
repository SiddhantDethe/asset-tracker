import AssetTable from "@/app/components/AssetTable";
import CreateAssetForm from "@/app/components/CreateAssetForm";
import type { Asset } from "@prisma/client";

export default async function AdminDashboard() {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/assets/list`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return (
      <p className="text-red-500">
        Failed to load admin assets
      </p>
    );
  }

  const assets: Asset[] = await res.json();

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
