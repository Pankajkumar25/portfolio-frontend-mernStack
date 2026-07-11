"use client";

import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import { SOCIAL_LINKS } from "@/lib/constants";

export default function GitHubContributions() {
  return (
    <section className="relative py-16">
      <div className="section-container">
        <motion.div
          className="glass rounded-2xl p-6 md:p-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-6">
            <FaGithub className="text-2xl" />
            <h3 className="text-xl font-bold">GitHub Contributions</h3>
          </div>
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <img
              src={`https://ghchart.rshah.org/6C63FF/${SOCIAL_LINKS.github.replace("https://github.com/", "")}`}
              alt="GitHub Contributions Chart"
              className="w-full rounded-xl opacity-80 hover:opacity-100 transition-opacity"
              loading="lazy"
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
