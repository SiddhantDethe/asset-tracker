//app/admin/register/page.tsx

"use client";

import { useState } from "react";

export default function AdminRegister() {
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
      alert("Admin created successfully");
      window.location.href = "/login";
    } else {
      const data = await res.json();
      alert(data.error || "Admin registration failed");
    }
  }

  return (
    <form onSubmit={submit}>
      <h2>Admin Register</h2>

      <input
        placeholder="Username"
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />

      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button type="submit">Create Admin</button>
    </form>
  );
}
