export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className=" rounded-xl shadow-sm border p-4">
      {children}
    </div>
  );
}
