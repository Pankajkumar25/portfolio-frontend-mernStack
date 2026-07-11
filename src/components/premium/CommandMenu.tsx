"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/store";
import { NAV_LINKS } from "@/lib/constants";
import { HiSearch, HiX } from "react-icons/hi";

const commands = [
  ...NAV_LINKS.map((link) => ({ ...link, description: `Navigate to ${link.name}` })),
  { name: "Download Resume", href: "/images/resume.pdf", description: "Download my resume" },
  { name: "Toggle Theme", href: "", description: "Switch between dark and light mode", action: "theme" },
  { name: "Open GitHub", href: "https://github.com/pankajkumar", description: "Visit my GitHub" },
  { name: "Open LinkedIn", href: "https://linkedin.com/in/pankajkumar", description: "Visit my LinkedIn" },
];

export default function CommandMenu() {
  const { isCommandMenuOpen, setCommandMenuOpen } = useUIStore();
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredCommands = commands.filter(
    (cmd) =>
      cmd.name.toLowerCase().includes(search.toLowerCase()) ||
      cmd.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandMenuOpen(!isCommandMenuOpen);
      }
      if (e.key === "Escape") setCommandMenuOpen(false);
    },
    [isCommandMenuOpen, setCommandMenuOpen]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const executeCommand = (cmd: (typeof commands)[0]) => {
    setCommandMenuOpen(false);
    if ("action" in cmd && cmd.action === "theme") {
      document.documentElement.classList.toggle("dark");
      return;
    }
    if (cmd.href.startsWith("#")) {
      const el = document.querySelector(cmd.href);
      el?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.open(cmd.href, "_blank");
    }
  };

  return (
    <AnimatePresence>
      {isCommandMenuOpen && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center pt-[15vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setCommandMenuOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-lg glass rounded-2xl overflow-hidden shadow-2xl shadow-primary/20"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
              <HiSearch className="text-gray-400" size={20} />
              <input
                autoFocus
                type="text"
                placeholder="Search commands..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setSelectedIndex(0); }}
                className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none"
              />
              <kbd className="hidden sm:inline-flex px-2 py-0.5 text-xs glass rounded text-gray-400">ESC</kbd>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {filteredCommands.map((cmd, i) => (
                <button
                  key={cmd.name}
                  onClick={() => executeCommand(cmd)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                    i === selectedIndex ? "bg-primary/20 text-primary" : "text-gray-300 hover:bg-white/5"
                  }`}
                  onMouseEnter={() => setSelectedIndex(i)}
                >
                  <span className="flex-1">
                    <span className="block text-sm font-medium">{cmd.name}</span>
                    <span className="block text-xs text-gray-500">{cmd.description}</span>
                  </span>
                </button>
              ))}
              {filteredCommands.length === 0 && (
                <p className="text-center text-gray-500 py-6 text-sm">No results found</p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
