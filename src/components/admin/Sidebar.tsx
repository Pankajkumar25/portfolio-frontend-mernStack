"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiHome, HiCollection, HiCube, HiBriefcase, HiStar, HiCog, HiMail, HiDocumentText, HiLogout, HiMenu, HiX, HiChartBar,
} from "react-icons/hi";
import { useAuthStore } from "@/store";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: HiChartBar },
  { name: "Projects", href: "/admin/projects", icon: HiCube },
  { name: "Skills", href: "/admin/skills", icon: HiCollection },
  { name: "Experiences", href: "/admin/experiences", icon: HiBriefcase },
  { name: "Testimonials", href: "/admin/testimonials", icon: HiStar },
  { name: "Services", href: "/admin/services", icon: HiCog },
  { name: "Blogs", href: "/admin/blogs", icon: HiDocumentText },
  { name: "Messages", href: "/admin/messages", icon: HiMail },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 glass rounded-lg"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <HiX /> : <HiMenu />}
      </button>

      <AnimatePresence mode="wait">
        <motion.aside
          initial={{ width: collapsed ? 0 : 260 }}
          animate={{ width: collapsed ? 0 : 260 }}
          exit={{ width: 0 }}
          className={cn(
            "fixed lg:relative z-40 h-screen glass border-r border-white/10 overflow-hidden",
            collapsed ? "hidden lg:hidden" : "block"
          )}
        >
          <div className="p-6 border-b border-white/10">
            <Link href="/admin" className="text-xl font-bold neon-text">
              Admin<span className="text-primary">.</span>
            </Link>
          </div>

          <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-200px)]">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all",
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-300 hover:bg-white/5 hover:text-primary"
                  )}
                >
                  <item.icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
            <Link href="/" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-primary rounded-lg transition-colors">
              <HiHome size={18} />
              View Site
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-lg transition-colors w-full mt-1"
            >
              <HiLogout size={18} />
              Logout
            </button>
          </div>
        </motion.aside>
      </AnimatePresence>
    </>
  );
}
