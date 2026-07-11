"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { testimonialAPI } from "@/lib/api";
import { Testimonial } from "@/types";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { HiStar } from "react-icons/hi";
import Skeleton from "@/components/ui/Skeleton";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { ref, isVisible } = useScrollAnimation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await testimonialAPI.getAll();
        setTestimonials(data.data);
      } catch (err) {
        console.error("Failed to load testimonials:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <section id="testimonials" className="relative py-20" ref={ref}>
      <div className="section-container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
        >
          What People <span className="text-gradient">Say</span>
        </motion.h2>
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
        >
          Testimonials from clients and colleagues
        </motion.p>

        {loading ? (
          <div className="flex gap-6 overflow-hidden">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={200} className="min-w-[350px] rounded-xl" />
            ))}
          </div>
        ) : testimonials.length === 0 ? (
          <p className="text-center text-gray-500">No testimonials yet.</p>
        ) : (
          <div className="relative overflow-hidden" ref={scrollRef}>
            <motion.div
              className="flex gap-6"
              animate={{ x: [0, -100 * testimonials.length] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              {[...testimonials, ...testimonials].map((t, i) => (
                <div
                  key={`${t._id}-${i}`}
                  className="min-w-[350px] glass rounded-xl p-6 flex-shrink-0"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-lg font-bold flex-shrink-0">
                      {t.name[0]}
                    </div>
                    <div>
                      <h4 className="font-semibold">{t.name}</h4>
                      <p className="text-xs text-gray-400">{t.role}{t.company ? ` at ${t.company}` : ""}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, s) => (
                      <HiStar key={s} className={s < t.rating ? "text-yellow-400" : "text-gray-600"} size={14} />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">&ldquo;{t.content}&rdquo;</p>
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
