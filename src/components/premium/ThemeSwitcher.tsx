"use client";

import { motion } from "framer-motion";
import { HiSun, HiMoon } from "react-icons/hi";
import { useThemeStore } from "@/store";

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useThemeStore();

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
