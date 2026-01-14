/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Asset } from "@prisma/client";
import { useEffect, useState } from "react";
import Button from "./ui/Button";

type User = {
  id: number;
  username: string;
  email: string | null;
};

export default function AssignAssetModal({
  asset,
  onClose,
}: {
  asset: Asset;
  onClose: () => void;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔄 LOAD USERS
  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch("/api/users/list");

        // 🔴 IMPORTANT FIX (HTML / redirect safe)
        if (!res.ok) {
          const text = await res.text();
          throw new Error(
            res.status === 401
              ? "Unauthorized. Please login as admin."
              : "Failed to load users"
          );
        }

        const data: User[] = await res.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      }
    }

    loadUsers();
  }, []);

  // 📌 ASSIGN ASSET
  async function assign() {
    if (!userId) {
      setError("Please select a user");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/assets/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId: asset.id,
          userId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Assignment failed");
      }

      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className=" p-6 rounded-xl w-full max-w-md space-y-4 bg-black">
        <h2 className="font-semibold text-lg">Assign Asset</h2>

        <p className="text-sm text-gray-600">{asset.name}</p>

        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}

        <select
          className="border p-2 w-full rounded bg-black"
          value={userId}
          onChange={(e) =>
            setUserId(Number(e.target.value))
          }
        >
          <option value="">Select user</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.username}
              {u.email ? ` (${u.email})` : ""}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="text-gray-600"
          >
            Cancel
          </button>

          <Button onClick={assign} disabled={loading}>
            {loading ? "Assigning..." : "Assign"}
          </Button>
        </div>
      </div>
    </div>
  );
}
