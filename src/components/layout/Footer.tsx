"use client";

import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaTwitter, FaHeart } from "react-icons/fa";
import { SITE_CONFIG, SOCIAL_LINKS, NAV_LINKS } from "@/lib/constants";

export default function Footer() {
  const scrollToSection = (href: string) => {
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-white/5">
      <div className="absolute inset-0 cyber-grid-bg opacity-10" />
      <div className="section-container relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold neon-text mb-4">
              {SITE_CONFIG.name}
              <span className="text-primary">.</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">{SITE_CONFIG.tagline}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {NAV_LINKS.slice(0, 5).map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-sm text-gray-400 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Web Development</li>
              <li>API Development</li>
              <li>Admin Panels</li>
              <li>Deployment</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-3">
              {[
                { icon: FaGithub, href: SOCIAL_LINKS.github },
                { icon: FaLinkedin, href: SOCIAL_LINKS.linkedin },
                { icon: FaTwitter, href: SOCIAL_LINKS.twitter },
              ].map(({ icon: Icon, href }) => (
                <motion.a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 glass rounded-lg flex items-center justify-center text-gray-300 hover:text-primary hover:border-primary transition-all"
                  whileHover={{ scale: 1.1, y: -2 }}
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 flex items-center gap-1">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. Made with <FaHeart className="text-red-500" /> using Next.js
          </p>
          <div className="flex gap-4 text-sm text-gray-500">
            <button className="hover:text-primary transition-colors">Privacy Policy</button>
            <button className="hover:text-primary transition-colors">Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
