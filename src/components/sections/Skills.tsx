"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { skillAPI } from "@/lib/api";
import { Skill } from "@/types";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SKILL_ICONS } from "@/lib/constants";
import Skeleton from "@/components/ui/Skeleton";

function CircularProgress({ percentage, label, icon }: { percentage: number; label: string; icon: string }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      className="flex flex-col items-center p-6 glass rounded-2xl hover:neon-glow transition-all duration-300 group"
      whileHover={{ scale: 1.05, y: -5 }}
    >
      <div className="relative mb-4">
        <svg width="130" height="130" className="transform -rotate-90">
          <circle cx="65" cy="65" r={radius} fill="none" stroke="rgba(108, 99, 255, 0.1)" strokeWidth="6" />
          <motion.circle
            cx="65" cy="65" r={radius}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: offset }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6C63FF" />
              <stop offset="100%" stopColor="#00F5FF" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
      <h3 className="font-semibold text-sm text-center group-hover:text-primary transition-colors">{label}</h3>
      <span className="text-xs text-gray-500 mt-1">{percentage}%</span>
    </motion.div>
  );
}

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, isVisible } = useScrollAnimation();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { data } = await skillAPI.getAll();
        setSkills(data.data);
      } catch (err) {
        console.error("Failed to load skills:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const categories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <section id="skills" className="relative py-0" ref={ref}>
      <div className="absolute inset-0 cyber-grid-bg opacity-20" />
      <div className="section-container relative z-10">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
        >
          My <span className="text-gradient">Skills</span>
        </motion.h2>
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
        >
          Technologies and tools I use to build amazing applications
        </motion.p>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={180} className="rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {skills.map((skill, i) => (
              <motion.div
                key={skill._id}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <CircularProgress
                  percentage={skill.percentage}
                  label={skill.name}
                  icon={SKILL_ICONS[skill.name] || "⚡"}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
