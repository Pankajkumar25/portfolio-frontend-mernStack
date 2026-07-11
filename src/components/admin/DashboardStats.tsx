"use client";

import { motion } from "framer-motion";
import { DashboardStats as Stats } from "@/types";
import { HiCube, HiCollection, HiBriefcase, HiStar, HiCog, HiMail, HiDocumentText } from "react-icons/hi";

interface DashboardStatsProps {
  stats: Stats;
}

const statCards = [
  { key: "projects", label: "Projects", icon: HiCube, color: "from-blue-500 to-blue-600" },
  { key: "skills", label: "Skills", icon: HiCollection, color: "from-green-500 to-green-600" },
  { key: "experiences", label: "Experiences", icon: HiBriefcase, color: "from-purple-500 to-purple-600" },
  { key: "testimonials", label: "Testimonials", icon: HiStar, color: "from-yellow-500 to-yellow-600" },
  { key: "services", label: "Services", icon: HiCog, color: "from-pink-500 to-pink-600" },
  { key: "messages", label: "Messages", icon: HiMail, color: "from-indigo-500 to-indigo-600" },
  { key: "blogs", label: "Blogs", icon: HiDocumentText, color: "from-teal-500 to-teal-600" },
];

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {statCards.map((card, i) => {
        const value = stats[card.key as keyof Stats] ?? 0;
        const isUnread = card.key === "messages" && stats.unreadMessages > 0;

        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-xl p-4 hover:neon-glow transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${card.color}`}>
                <card.icon className="text-white" size={18} />
              </div>
              {isUnread && (
                <span className="px-2 py-0.5 text-xs bg-red-500/20 text-red-400 rounded-full">
                  {stats.unreadMessages} unread
                </span>
              )}
            </div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-gray-400">{card.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
