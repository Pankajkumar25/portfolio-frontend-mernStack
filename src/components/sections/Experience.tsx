"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { experienceAPI } from "@/lib/api";
import { Experience as ExperienceType } from "@/types";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { formatDateRange } from "@/lib/utils";
import Skeleton from "@/components/ui/Skeleton";

export default function Experience() {
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"experience" | "education" | "internship">("experience");
  const { ref, isVisible } = useScrollAnimation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await experienceAPI.getAll({ type: activeTab });
        setExperiences(data.data);
      } catch (err) {
        console.error("Failed to load experiences:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  return (
    <section id="experience" className="relative py-20" ref={ref}>
      <div className="section-container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
        >
          My <span className="text-gradient">Journey</span>
        </motion.h2>
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
        >
          Professional experience and educational background
        </motion.p>

        <div className="flex justify-center gap-2 mb-10">
          {[
            { value: "experience" as const, label: "Experience" },
            { value: "education" as const, label: "Education" },
            { value: "internship" as const, label: "Internship" },
          ].map((tab) => (
            <motion.button
              key={tab.value}
              onClick={() => { setActiveTab(tab.value); setLoading(true); }}
              className={`px-6 py-2 rounded-full text-sm transition-all ${
                activeTab === tab.value
                  ? "bg-primary text-white"
                  : "glass text-gray-300 hover:text-primary"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-6 max-w-3xl mx-auto">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={150} className="rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary/20 transform md:-translate-x-1/2" />

            {experiences.map((exp, i) => (
              <motion.div
                key={exp._id}
                className={`relative flex items-start gap-8 mb-8 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
                initial={{ opacity: 0, y: 50 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <div className="hidden md:flex flex-1 justify-end">
                  {i % 2 === 0 && (
                    <div className="text-right">
                      <span className="text-xs text-primary font-mono">{formatDateRange(exp.startDate, exp.endDate, exp.current)}</span>
                    </div>
                  )}
                </div>

                <div className="relative flex-shrink-0 z-10">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                    <div className="w-3 h-3 rounded-full bg-white" />
                  </div>
                </div>

                <div className="flex-1">
                  <motion.div
                    className="glass rounded-xl p-5 hover:neon-glow transition-all"
                    whileHover={{ x: 5 }}
                  >
                    <span className="text-xs text-primary font-mono md:hidden block mb-2">
                      {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                    </span>
                    <h3 className="text-lg font-bold">{exp.role}</h3>
                    <p className="text-primary text-sm mb-2">{exp.company}</p>
                    <p className="text-gray-400 text-sm mb-3">{exp.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {exp.techUsed.map((tech) => (
                        <span key={tech} className="px-2 py-0.5 text-xs glass rounded-full text-accent">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
