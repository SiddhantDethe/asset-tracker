import { ReactNode } from "react";
import AdminNavbar from "./components/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black/5">
      <AdminNavbar />
      <main className="p-6">{children}</main>
    </div>
  );
}
