"use client";

import { signIn, getSession } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (!res?.ok) return alert("Invalid credentials");

    const session = await getSession();

    if (session?.user?.role === "admin") {
      window.location.href = "/admin/dashboard";
    } else {
      window.location.href = "/dashboard";
    }
  }

  return (
    <form
      onSubmit={handleLogin}
      className="max-w-md mx-auto p-6 rounded shadow text-shadow-blue-950 "
    >
      <h2 className="text-2xl font-bold mb-4 text-shadow-blue-950">Login</h2>

      <input
        className="w-full border p-2 mb-3 text-shadow-blue-950"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        className="w-full border p-2 mb-4 text-shadow-blue-950"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="w-full bg-slate-900 text-grey py-2 rounded">
        Login
      </button>
    </form>
  );
}
