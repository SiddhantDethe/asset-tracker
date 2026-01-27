import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";

export default async function DashboardPage() {
  const session = await requireAuth();
  const userId = Number(session.user.id);

  /* =========================
     MY ASSIGNED ASSETS
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
     PENDING RETURN REQUESTS
  ========================= */
  const pendingReturns = await prisma.assetRequest.findMany({
    where: {
      userId,
      type: "RETURN",
      status: "PENDING",
    },
    select: { assetId: true },
  });

  const pendingReturnIds = new Set(
    pendingReturns.map(r => r.assetId)
  );

  /* =========================
     ALL ASSETS
  ========================= */
  const assets = await prisma.asset.findMany({
    orderBy: { createdAt: "desc" },
  });

  /* =========================
     PENDING REQUESTS (NEW)
  ========================= */
  const pendingRequests = await prisma.assetRequest.findMany({
    where: {
      userId,
      type: "REQUEST",
      status: "PENDING",
    },
    select: { assetId: true },
  });

  const pendingRequestIds = new Set(
    pendingRequests.map(r => r.assetId)
  );

  return (
    <div className="space-y-12">

      {/* =========================
          MY ASSETS
      ========================= */}
      <section>
        <h1 className="text-2xl font-bold mb-4">
          My Assigned Assets
        </h1>

        {assignments.length === 0 && (
          <Card>No assets assigned</Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignments.map(a => (
            <Card key={a.id}>
              <h2 className="font-semibold">
                {a.asset.name}
              </h2>

              <p className="text-sm text-gray-400">
                {a.asset.category}
              </p>

              <p className="text-xs text-gray-500">
                Assigned on {a.assignedAt.toDateString()}
              </p>

              {pendingReturnIds.has(a.assetId) ? (
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
          {assets.map(asset => {
            const available = asset.availableCount > 0;
            const pending = pendingRequestIds.has(asset.id);

            return (
              <Card key={asset.id}>
                <h3 className="font-semibold">
                  {asset.name}
                </h3>

                <p className="text-sm text-gray-400">
                  {asset.category}
                </p>

                <p className="text-xs text-gray-400">
                  Available {asset.availableCount} / {asset.totalCount}
                </p>

                {available ? (
                  pending ? (
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
                    Not available
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
