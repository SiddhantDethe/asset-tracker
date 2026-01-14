import { prisma } from "@/lib/prisma";
import Card from "@/app/components/ui/Card";

export default async function AssetHistoryPage() {
  const history = await prisma.assetAssignment.findMany({
    include: {
      asset: true,
      user: true,
    },
    orderBy: { assignedAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Asset History</h1>

      {history.map((h) => (
        <Card key={h.id}>
          <p className="font-semibold">{h.asset.name}</p>
          <p className="text-sm">
            {h.user.username} | {h.assignedAt.toDateString()}
          </p>
        </Card>
      ))}
    </div>
  );
}
