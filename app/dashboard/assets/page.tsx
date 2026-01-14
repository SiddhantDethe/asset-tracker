import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";
import Badge from "@/app/components/ui/Badge";

export default async function AllAssetsPage() {
  const session = await getServerSession(authOptions);
  if (!session) return <p>Not authenticated</p>;

  const assets = await prisma.asset.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">All Assets</h1>

      {assets.length === 0 && <Card>No assets found</Card>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assets.map((asset) => (
          <Card key={asset.id}>
            <h2 className="font-semibold">{asset.name}</h2>
            <p className="text-sm text-gray-500">{asset.category}</p>

            <Badge label={asset.availableCount > 0 ? "AVAILABLE" : "UNAVAILABLE"} />

            {asset.availableCount > 0 ? (
              <form
                action="/api/requests/create"
                method="POST"
                onSubmit={(e) => {
                  if (!confirm("Request this asset?")) {
                    e.preventDefault();
                  }
                }}
              >
                <input type="hidden" name="assetId" value={asset.id} />
                <input type="hidden" name="type" value="REQUEST" />
                <input type="hidden" name="initiator" value="USER" />

                <Button type="submit">Request Asset</Button>
              </form>
            ) : (
              <p className="text-xs text-gray-400">
                Not available for request
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
