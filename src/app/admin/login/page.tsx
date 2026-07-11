"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { authAPI } from "@/lib/api";
import { useAuthStore } from "@/store";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill all fields");
    setLoading(true);
    try {
      const { data } = await authAPI.login({ email, password });
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
      setUser(data.data.user);
      toast.success("Welcome back!");
      router.push("/admin");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-dark">
      <div className="absolute inset-0 cyber-grid-bg opacity-20" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md glass rounded-2xl p-8"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold neon-text mb-2">Admin Login</h1>
          <p className="text-gray-400 text-sm">Sign in to manage your portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 glass rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50"
              placeholder="admin@portfolio.com"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 glass rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50"
              placeholder="••••••••"
            />
          </div>
          <Button variant="primary" size="lg" type="submit" className="w-full">
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
