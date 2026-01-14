"use client";

import { useState } from "react";

export default function AdminRegisterPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/auth/admin-register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Admin created");
      window.location.href = "/login";
    } else {
      alert("Admin creation failed");
    }
  }

  return (
    <form
      onSubmit={submit}
      className="max-w-md mx-auto p-6 rounded shadow"
    >
      <h2 className="text-2xl font-bold mb-4">Admin Registration</h2>

      <input
        className="w-full border p-2 mb-3"
        placeholder="Username"
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />

      <input
        className="w-full border p-2 mb-3"
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        className="w-full border p-2 mb-4"
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button className="w-full bg-red-600 text-white py-2 rounded">
        Create Admin
      </button>
    </form>
  );
}
