"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-slate-900 text-white">
      <Link href="/" className="font-bold text-lg">
        Asset Manager
      </Link>

      <div className="flex gap-4 items-center">
        {!session && (
          <>
            <Link href="/login">Login</Link>
            {/* <Link href="/register">Register</Link>
            <Link href="/admin/register">Admin Register</Link> */}
          </>
        )}

        {session && (
          <>
            {session.user?.role === "admin" && (
              <Link href="/admin/dashboard">Admin</Link>
            )}
            <Link href="/dashboard">Dashboard</Link>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="bg-red-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
