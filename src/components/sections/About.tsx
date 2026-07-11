"use client";

import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SITE_CONFIG } from "@/lib/constants";
import { HiBadgeCheck, HiCode, HiCube } from "react-icons/hi";

const stats = [
  { icon: HiCode, label: "Years Experience", value: "3+" },
  { icon: HiCube, label: "Projects Completed", value: "20+" },
  { icon: HiBadgeCheck, label: "Technologies", value: "15+" },
];

export default function About() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="about" className="relative py-20" ref={ref}>
      <div className="section-container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          About <span className="text-gradient">Me</span>
        </motion.h2>
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Get to know me and my journey in the world of web development
        </motion.p>

        <div className="grid md:grid-cols-2 gap-12 items-center mt-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="gradient-border p-1 rounded-2xl">
              <div className="bg-dark-100 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold">
                    PK
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{SITE_CONFIG.name}</h3>
                    <p className="text-primary">{SITE_CONFIG.title}</p>
                  </div>
                </div>
                <p className="text-gray-400 leading-relaxed">{SITE_CONFIG.aboutText}</p>
                <div className="grid grid-cols-3 gap-4 mt-8">
                  {stats.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      className="text-center p-4 glass rounded-xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={isVisible ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                    >
                      <stat.icon className="text-primary text-2xl mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gradient">{stat.value}</div>
                      <div className="text-xs text-gray-500">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold mb-4">
              My <span className="text-gradient">Journey</span>
            </h3>

            {[
              { year: "2024", title: "Full Stack Developer", desc: "Working on enterprise-level MERN applications" },
              { year: "2023", title: "MERN Stack Developer", desc: "Built multiple full-stack applications with React & Node.js" },
              { year: "2022", title: "Frontend Developer", desc: "Started career with React.js and modern CSS" },
              { year: "2021", title: "Started Coding", desc: "Began learning JavaScript and web development fundamentals" },
            ].map((item, i) => (
              <motion.div
                key={item.year}
                className="flex gap-4 p-4 glass rounded-xl"
                initial={{ opacity: 0, x: 30 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
              >
                <div className="text-primary font-mono font-bold text-lg min-w-[60px]">{item.year}</div>
                <div>
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}

            <div className="flex flex-wrap gap-3 mt-4">
              {["React", "Next.js", "Node.js", "MongoDB", "TypeScript", "Tailwind"].map((tech, i) => (
                <motion.span
                  key={tech}
                  className="px-3 py-1.5 text-sm glass rounded-full text-primary border border-primary/20"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.8 + i * 0.05 }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
