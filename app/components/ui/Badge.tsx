export default function Badge({ label }: { label: string }) {
  const styles: Record<string, string> = {
    AVAILABLE: "bg-green-100 text-green-700",
    ASSIGNED: "bg-orange-100 text-orange-700",
    LOST: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-2 py-1 text-xs rounded ${
        styles[label] || "bg-gray-100 text-gray-700"
      }`}
    >
      {label}
    </span>
  );
}
