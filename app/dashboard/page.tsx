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

export default async function DashboardPage() {
  /* =========================
     1️⃣ FETCH ASSIGNED ASSETS
  ========================= */
  const myRes = await fetch(
    `${process.env.NEXTAUTH_URL}/api/assets/my`,
    { cache: "no-store" }
  );

  if (!myRes.ok) {
    return <p>Unauthorized</p>;
  }

  const assignments: AssignedAsset[] = await myRes.json();

  /* =========================
     2️⃣ FETCH ALL ASSETS
  ========================= */
  const assetsRes = await fetch(
    `${process.env.NEXTAUTH_URL}/api/assets/list`,
    { cache: "no-store" }
  );

  const allAssets: Asset[] = assetsRes.ok
    ? await assetsRes.json()
    : [];

  return (
    <div className="space-y-12">

      {/* =========================
          MY ASSIGNED ASSETS
      ========================= */}
      <section>
        <h1 className="text-2xl font-bold mb-4">
          My Assigned Assets
        </h1>

        {assignments.length === 0 && (
          <Card>No assets assigned</Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignments.map((a) => (
            <Card key={a.id}>
              <div className="space-y-2">
                <h2 className="font-semibold">
                  {a.asset.name}
                </h2>

                <p className="text-sm text-gray-400">
                  Category: {a.asset.category}
                </p>

                <p className="text-xs text-gray-500">
                  Assigned on:{" "}
                  {new Date(a.assignedAt).toDateString()}
                </p>

                <form
                  action="/api/requests/create"
                  method="POST"
                >
                  <input
                    type="hidden"
                    name="assetId"
                    value={a.asset.id}
                  />
                  <input
                    type="hidden"
                    name="type"
                    value="RETURN"
                  />

                  <Button type="submit">
                    Request Return
                  </Button>
                </form>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* =========================
          ALL ASSETS
      ========================= */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          All Assets
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allAssets.map((asset) => {
            const isAvailable =
              asset.availableCount > 0;

            return (
              <Card key={asset.id}>
                <div className="space-y-2">
                  <h3 className="font-semibold">
                    {asset.name}
                  </h3>

                  <p className="text-sm text-gray-400">
                    Category: {asset.category}
                  </p>

                  <p className="text-xs text-gray-400">
                    Available:{" "}
                    {asset.availableCount} /{" "}
                    {asset.totalCount}
                  </p>

                  {isAvailable ? (
                    <form
                      action="/api/requests/create"
                      method="POST"
                    >
                      <input
                        type="hidden"
                        name="assetId"
                        value={asset.id}
                      />
                      <input
                        type="hidden"
                        name="type"
                        value="REQUEST"
                      />

                      <Button type="submit">
                        Request Asset
                      </Button>
                    </form>
                  ) : (
                    <p className="text-xs text-red-500">
                      Asset not available
                    </p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
