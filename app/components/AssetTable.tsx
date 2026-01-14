"use client";

import { Asset } from "@prisma/client";
import { useState } from "react";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import AssignAssetModal from "./AssignAssetModal";
import EditAssetModal from "./EditAssetModal";

type AssetTableProps = {
  assets: Asset[];
};

export default function AssetTable({ assets }: AssetTableProps) {
  const [assignAsset, setAssignAsset] = useState<Asset | null>(null);
  const [editAsset, setEditAsset] = useState<Asset | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  // 🗑 DELETE ASSET
  async function deleteAsset(id: number) {
    if (!confirm("Are you sure you want to delete this asset?")) return;

    setLoadingId(id);

    try {
      const res = await fetch("/api/assets/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        alert("Failed to delete asset");
        return;
      }

      window.location.reload();
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full rounded-xl shadow border">
          <thead>
            <tr>
              <th className="p-3 text-left">Asset</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Availability</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {assets.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  No assets found
                </td>
              </tr>
            )}

            {assets.map((asset) => {
              const isAvailable = asset.availableCount > 0;

              return (
                <tr key={asset.id} className="border-t">
                  <td className="p-3 font-medium">{asset.name}</td>

                  <td className="p-3">{asset.category}</td>

                  <td className="p-3">
                    <p className="text-xs text-gray-400">
                      Available: {asset.availableCount} / {asset.totalCount}
                    </p>

                    {!isAvailable && (
                      <Badge label="Not Available" />
                    )}
                  </td>

                  <td className="p-3 flex flex-wrap gap-2">
                    {/* ASSIGN */}
                    {isAvailable ? (
                      <Button onClick={() => setAssignAsset(asset)}>
                        Assign
                      </Button>
                    ) : (
                      <span className="text-red-500 text-xs">
                        No stock
                      </span>
                    )}

                    {/* EDIT */}
                    <Button onClick={() => setEditAsset(asset)}>
                      Edit
                    </Button>

                    {/* DELETE */}
                    <button
                      onClick={() => deleteAsset(asset.id)}
                      disabled={loadingId === asset.id}
                      className="text-red-600 hover:underline disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ASSIGN MODAL */}
      {assignAsset && (
        <AssignAssetModal
          asset={assignAsset}
          onClose={() => setAssignAsset(null)}
        />
      )}

      {/* EDIT MODAL */}
      {editAsset && (
        <EditAssetModal
          asset={editAsset}
          onClose={() => setEditAsset(null)}
        />
      )}
    </>
  );
}
