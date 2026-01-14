import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";
import Badge from "@/app/components/ui/Badge";

export default async function AdminRequestsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return <p>Unauthorized</p>;
  }

  const requests = await prisma.assetRequest.findMany({
    where: {
      status: "PENDING",
    },
    include: {
      asset: true,
      user: true,
    },
    orderBy: {
      requestedAt: "asc",
    },
  });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Pending Asset Requests</h1>

      {requests.length === 0 && (
        <Card>No pending requests</Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        {requests.map((req) => (
          <Card key={req.id}>
            <div className="space-y-2">
              <h2 className="font-semibold">{req.asset.name}</h2>

              <p className="text-sm text-gray-600">
                User: <strong>{req.user.username}</strong>
              </p>

              <div className="flex gap-2 flex-wrap">
                <Badge label={req.type} />
                <Badge label={req.initiator} />
                <Badge label={req.asset.category} />
              </div>

              <p className="text-xs text-gray-500">
                Requested on:{" "}
                {req.requestedAt.toDateString()}
              </p>

              <div className="flex gap-3 pt-2">
                <form
                  action="/api/requests/approve"
                  method="POST"
                >
                  <input
                    type="hidden"
                    name="requestId"
                    value={req.id}
                  />
                  <Button type="submit">
                    Approve
                  </Button>
                </form>

                <form
                  action="/api/requests/reject"
                  method="POST"
                >
                  <input
                    type="hidden"
                    name="requestId"
                    value={req.id}
                  />
                  <Button type="submit">
                    Reject
                  </Button>
                </form>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
