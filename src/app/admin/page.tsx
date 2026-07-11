"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { dashboardAPI } from "@/lib/api";
import { DashboardStats } from "@/types";
import DashboardStatsComponent from "@/components/admin/DashboardStats";
import Skeleton from "@/components/ui/Skeleton";

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await dashboardAPI.getStats();
        setStats(data.data.stats);
        setRecentProjects(data.data.recentProjects);
        setRecentMessages(data.data.recentMessages);
      } catch (err) {
        console.error("Failed to load stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="rectangular" height={200} className="rounded-xl" />
        <Skeleton variant="rectangular" height={300} className="rounded-xl" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here&apos;s your portfolio overview.</p>
      </div>

      {stats && <DashboardStatsComponent stats={stats} />}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Recent Projects</h2>
          {recentProjects.length === 0 ? (
            <p className="text-gray-500 text-sm">No projects yet</p>
          ) : (
            <div className="space-y-3">
              {recentProjects.map((project) => (
                <div key={project._id} className="flex items-center gap-3 p-3 glass rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
                    {project.title[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{project.title}</p>
                    <p className="text-xs text-gray-400">{project.category}</p>
                  </div>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${project.featured ? "bg-primary/20 text-primary" : "glass text-gray-400"}`}>
                    {project.featured ? "Featured" : "Normal"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Recent Messages</h2>
          {recentMessages.length === 0 ? (
            <p className="text-gray-500 text-sm">No messages yet</p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div key={msg._id} className="flex items-center gap-3 p-3 glass rounded-xl">
                  <div className={`w-2 h-2 rounded-full ${msg.read ? "bg-gray-600" : "bg-primary"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{msg.name}</p>
                    <p className="text-xs text-gray-400 truncate">{msg.subject}</p>
                  </div>
                  <span className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
