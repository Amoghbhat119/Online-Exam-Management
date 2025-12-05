import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({ _id: data._id, name: data.name, role: data.role, email: data.email })
      );
      navigate(data.role === "Admin" ? "/admin" : "/student");
    } catch (e) {
      setErr(e.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-indigo-100">
        <h1 className="text-2xl font-bold text-indigo-700 mb-6 text-center">Welcome back</h1>
        {err && <p className="mb-3 text-sm text-red-600">{err}</p>}
        <form onSubmit={submit} className="space-y-3">
          <input
            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-400"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg p-3 font-semibold transition">
            Login
          </button>
        </form>
        <p className="text-xs text-center mt-4 text-gray-500">
          
        </p>
      </div>
    </div>
  );
}
