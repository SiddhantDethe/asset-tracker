"use client";

import { useEffect, useState } from "react";
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";

type AssignedAsset = {
  id: number;
  assignedAt: string;
  asset: {
    id: number;
    name: string;
    category: string;
  };
};

type Asset = {
  id: number;
  name: string;
  category: string;
  totalCount: number;
  availableCount: number;
};

export default function DashboardPage() {
  const [assignments, setAssignments] = useState<AssignedAsset[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    async function load() {
      const myRes = await fetch("/api/assets/my");
      if (!myRes.ok) {
        setUnauthorized(true);
        return;
      }

      const assetsRes = await fetch("/api/assets/list");

      setAssignments(await myRes.json());
      setAssets(assetsRes.ok ? await assetsRes.json() : []);
    }

    load();
  }, []);

  if (unauthorized) {
    return <p className="text-red-500">Unauthorized</p>;
  }

  return (
    <div className="space-y-12">
      {/* MY ASSETS */}
      <section>
        <h1 className="text-2xl font-bold mb-4">My Assigned Assets</h1>

        {assignments.length === 0 && <Card>No assets assigned</Card>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignments.map((a) => (
            <Card key={a.id}>
              <h2 className="font-semibold">{a.asset.name}</h2>
              <p className="text-sm text-gray-400">
                Category: {a.asset.category}
              </p>
              <p className="text-xs text-gray-500">
                Assigned on {new Date(a.assignedAt).toDateString()}
              </p>

              <form action="/api/requests/create" method="POST">
                <input type="hidden" name="assetId" value={a.asset.id} />
                <input type="hidden" name="type" value="RETURN" />
                <Button type="submit">Request Return</Button>
              </form>
            </Card>
          ))}
        </div>
      </section>

      {/* ALL ASSETS */}
      <section>
        <h2 className="text-2xl font-bold mb-4">All Assets</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assets.map((asset) => (
            <Card key={asset.id}>
              <h3 className="font-semibold">{asset.name}</h3>
              <p className="text-sm text-gray-400">
                Category: {asset.category}
              </p>
              <p className="text-xs text-gray-400">
                Available {asset.availableCount}/{asset.totalCount}
              </p>

              {asset.availableCount > 0 ? (
                <form action="/api/requests/create" method="POST">
                  <input type="hidden" name="assetId" value={asset.id} />
                  <input type="hidden" name="type" value="REQUEST" />
                  <Button type="submit">Request Asset</Button>
                </form>
              ) : (
                <p className="text-xs text-red-500">Not available</p>
              )}
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
