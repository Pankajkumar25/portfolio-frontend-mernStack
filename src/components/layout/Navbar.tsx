"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX, HiChartBar, HiHome, HiLogout } from "react-icons/hi";
import { useUIStore, useAuthStore } from "@/store";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { isMobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const { isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    setMobileMenuOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "glass shadow-lg shadow-primary/5" : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <motion.a
              href="#home"
              className="text-2xl font-bold neon-text"
              whileHover={{ scale: 1.05 }}
            >
              {SITE_CONFIG.name}
              <span className="text-primary">.</span>
            </motion.a>

            {isAuthenticated ? (
              <div className="hidden lg:flex items-center gap-2">
                <Link
                  href="/admin"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-primary rounded-lg hover:bg-white/5 transition-all"
                >
                  <HiChartBar size={16} />
                  Dashboard
                </Link>
                <Link
                  href="/"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-primary rounded-lg hover:bg-white/5 transition-all"
                >
                  <HiHome size={16} />
                  View Site
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                >
                  <HiLogout size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.button
                    key={link.href}
                    onClick={() => scrollToSection(link.href)}
                    className="px-4 py-2 text-sm text-gray-300 hover:text-primary rounded-lg hover:bg-white/5 transition-all"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {link.name}
                  </motion.button>
                ))}
              </div>
            )}

            <button
              className="lg:hidden p-2 text-white hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-72 glass p-6 pt-20">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-primary hover:bg-white/5 rounded-lg transition-all"
                  >
                    <HiChartBar size={18} />
                    Dashboard
                  </Link>
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-primary hover:bg-white/5 rounded-lg transition-all"
                  >
                    <HiHome size={18} />
                    View Site
                  </Link>
                  <button
                    onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                    className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-lg transition-all w-full text-left"
                  >
                    <HiLogout size={18} />
                    Logout
                  </button>
                </div>
              ) : (
                NAV_LINKS.map((link, i) => (
                  <motion.button
                    key={link.href}
                    onClick={() => scrollToSection(link.href)}
                    className="block w-full text-left px-4 py-3 text-gray-300 hover:text-primary hover:bg-white/5 rounded-lg transition-all"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {link.name}
                  </motion.button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
