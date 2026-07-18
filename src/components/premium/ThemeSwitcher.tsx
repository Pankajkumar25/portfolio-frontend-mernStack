"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { HiSun, HiMoon } from "react-icons/hi";
import { useThemeStore } from "@/store";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-40 w-12 h-12 glass rounded-full flex items-center justify-center text-gray-300 hover:text-primary hover:border-primary transition-all shadow-lg"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {theme === "dark" ? <HiSun size={20} /> : <HiMoon size={20} />}
    </motion.button>
  );
}
