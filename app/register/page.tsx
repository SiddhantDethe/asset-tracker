"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("User registered");
      window.location.href = "/login";
    } else {
      alert("Registration failed");
    }
  }

  return (
    <div>
    <form
      onSubmit={submit}
      className="max-w-md mx-auto p-6 rounded shadow"
    >
      <h2 className="text-2xl font-bold mb-4">User Registration</h2>

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

      <button className="w-full bg-slate-900 text-white py-2 rounded">
        Register
      </button>
    </form>


    <div>
      <div className="max-w-md mx-auto p-6 rounded shadow text-center">
      <p className="text-gray-200">Want to register as an admin?</p>
       <a href="/admin/register">
        <button className="w-96 justify-center bg-slate-900 text-white py-2 rounded mt-2">
          Admin Register
        </button>
      </a>
      </div>
      </div>


    </div>
  );
}
