"use client";

import { Asset, AssetCategory } from "@prisma/client";
import { useState } from "react";
import Button from "./ui/Button";

type EditAssetFormState = {
  name: string;
  category: AssetCategory;
  description: string;
  totalCount: number;
};

export default function EditAssetModal({
  asset,
  onClose,
}: {
  asset: Asset;
  onClose: () => void;
}) {
  const [form, setForm] = useState<EditAssetFormState>({
    name: asset.name,
    category: asset.category,
    description: asset.description ?? "",
    totalCount: asset.totalCount,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/assets/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: asset.id,
          totalCount: form.totalCount,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update asset");
      }

      window.location.reload();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-black p-6 rounded-xl w-full max-w-md space-y-4">
        <h2 className="font-semibold text-lg">Edit Asset</h2>

        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}

        <input
          className="border p-2 w-full rounded"
          placeholder="Asset name"
          value={form.name}
          disabled
        />

        <select
          className="border p-2 w-full rounded"
          value={form.category}
          disabled
        >
          <option value={AssetCategory.LAPTOP}>Laptop</option>
          <option value={AssetCategory.LICENSE}>License</option>
          <option value={AssetCategory.SERVER}>Server</option>
          <option value={AssetCategory.OFFICE_KEY}>Office Key</option>
          <option value={AssetCategory.OTHER}>Other</option>
        </select>

        <textarea
          className="border p-2 w-full rounded"
          placeholder="Description"
          value={form.description}
          disabled
        />

        {/* 🔑 INVENTORY CONTROL */}
        <div>
          <label className="text-sm text-gray-600">
            Total Inventory Count
          </label>
          <input
            type="number"
            min={1}
            className="border p-2 w-full rounded"
            value={form.totalCount}
            onChange={(e) =>
              setForm({
                ...form,
                totalCount: Number(e.target.value),
              })
            }
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="text-gray-600"
          >
            Cancel
          </button>

          <Button onClick={save} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
