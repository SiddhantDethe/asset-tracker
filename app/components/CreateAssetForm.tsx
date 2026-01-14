"use client";

import { useState } from "react";
import { AssetCategory } from "@prisma/client";
import Button from "./ui/Button";

type CreateAssetFormState = {
  name: string;
  category: AssetCategory;
  serialNo: string;
  description: string;
};

export default function CreateAssetForm() {
  const [form, setForm] = useState<CreateAssetFormState>({
    name: "",
    category: AssetCategory.LAPTOP,
    serialNo: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/assets/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create asset");
      }

      // Reset form
      setForm({
        name: "",
        category: AssetCategory.LAPTOP,
        serialNo: "",
        description: "",
      });

      // Refresh dashboard to show new asset
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
    <form
      onSubmit={submit}
      className=" p-4 rounded-xl shadow border space-y-3"
    >
      <h2 className="font-semibold text-lg">Create Asset</h2>

      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}

      <input
        required
        className="border p-2 w-full rounded"
        placeholder="Asset name"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <input
        className="border p-2 w-full rounded"
        placeholder="Serial number (optional)"
        value={form.serialNo}
        onChange={(e) =>
          setForm({ ...form, serialNo: e.target.value })
        }
      />

      <textarea
        className="border p-2 w-full rounded"
        placeholder="Description"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      <select
        className="border p-2 w-full rounded"
        value={form.category}
        onChange={(e) =>
          setForm({
            ...form,
            category: e.target.value as AssetCategory,
          })
        }
      >
        <option value={AssetCategory.LAPTOP}>Laptop</option>
        <option value={AssetCategory.LICENSE}>License</option>
        <option value={AssetCategory.SERVER}>Server</option>
        <option value={AssetCategory.OFFICE_KEY}>Office Key</option>
      </select>

      <Button type="submit">
        {loading ? "Creating..." : "Create Asset"}
      </Button>
    </form>
  );
}



