import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Card from "@/app/components/ui/Card";
// import Badge from "@/app/components/ui/Badge";
import Button from "@/app/components/ui/Button";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <p>Not authenticated</p>;
  }

  const userId = Number(session.user.id);

  /* =========================
     1️⃣ ASSIGNED ASSETS
  ========================= */

  const assignments = await prisma.assetAssignment.findMany({
    where: {
      userId,
      returnedAt: null,
    },
    include: {
      asset: true,
    },
    orderBy: {
      assignedAt: "desc",
    },
  });

  /* =========================
     2️⃣ PENDING RETURN REQUESTS
  ========================= */

  const pendingReturnRequests = await prisma.assetRequest.findMany({
    where: {
      userId,
      type: "RETURN",
      status: "PENDING",
    },
    select: {
      assetId: true,
    },
  });

  const pendingReturnAssetIds = new Set(
    pendingReturnRequests.map((r) => r.assetId)
  );

  /* =========================
     3️⃣ ALL ASSETS
  ========================= */

  const allAssets = await prisma.asset.findMany({
    orderBy: { createdAt: "desc" },
  });

  /* =========================
     4️⃣ PENDING NEW ASSET REQUESTS
  ========================= */

  const pendingAssetRequests = await prisma.assetRequest.findMany({
    where: {
      userId,
      type: "REQUEST",
      status: "PENDING",
    },
    select: {
      assetId: true,
    },
  });

  const pendingRequestAssetIds = new Set(
    pendingAssetRequests.map((r) => r.assetId)
  );

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
          {assignments.map((a) => {
            const returnPending =
              pendingReturnAssetIds.has(a.assetId);

            return (
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
                    {a.assignedAt.toDateString()}
                  </p>

                  {returnPending ? (
                    <p className="text-xs text-orange-500">
                      Return request pending
                    </p>
                  ) : (
                    <form
                      action="/api/requests/create"
                      method="POST"
                    >
                      <input
                        type="hidden"
                        name="assetId"
                        value={a.assetId}
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
                  )}
                </div>
              </Card>
            );
          })}
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
            const alreadyRequested =
              pendingRequestAssetIds.has(asset.id);

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
                    Available: {asset.availableCount} / {asset.totalCount}
                  </p>

                  {isAvailable ? (
                    alreadyRequested ? (
                      <p className="text-xs text-orange-500">
                        Request pending
                      </p>
                    ) : (
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
                    )
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
