"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { serviceAPI } from "@/lib/api";
import { Service } from "@/types";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import Skeleton from "@/components/ui/Skeleton";

const defaultServices = [
  { title: "Full Stack Development", description: "End-to-end web application development using MERN stack with modern architecture and best practices.", icon: "🚀", features: ["React/Next.js Frontend", "Node.js Backend", "MongoDB Database", "RESTful APIs"] },
  { title: "REST API Development", description: "Scalable and secure RESTful APIs with proper authentication, validation, and documentation.", icon: "🔌", features: ["JWT Authentication", "API Documentation", "Input Validation", "Rate Limiting"] },
  { title: "Admin Dashboard", description: "Feature-rich admin panels with analytics, data tables, charts, and user management.", icon: "📊", features: ["Real-time Analytics", "CRUD Operations", "Data Visualization", "Role Management"] },
  { title: "Real-time Applications", description: "Real-time features using WebSockets for chat, notifications, and live updates.", icon: "⚡", features: ["Socket.IO Integration", "Live Notifications", "Real-time Chat", "Collaborative Tools"] },
  { title: "Deployment", description: "Production-ready deployment on Vercel, AWS, Render, or custom servers with CI/CD pipelines.", icon: "☁️", features: ["Vercel/AWS Setup", "Docker Support", "CI/CD Pipelines", "Domain Setup"] },
  { title: "Database Design", description: "Efficient database schema design, optimization, and data modeling for scalable applications.", icon: "🗄️", features: ["Schema Design", "Query Optimization", "Data Migration", "Backup Strategy"] },
];

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, isVisible } = useScrollAnimation();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await serviceAPI.getAll();
        setServices(data.data.length ? data.data : defaultServices as any);
      } catch {
        setServices(defaultServices as any);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const displayServices = services.length ? services : defaultServices;

  return (
    <section id="services" className="relative py-20" ref={ref}>
      <div className="section-container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
        >
          My <span className="text-gradient">Services</span>
        </motion.h2>
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
        >
          What I can do for you
        </motion.p>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={260} className="rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(displayServices as any[]).map((service, i) => (
              <motion.div
                key={service.title}
                className="group glass rounded-2xl p-6 hover:neon-glow transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <motion.div
                  className="text-4xl mb-4"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  {service.icon}
                </motion.div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{service.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {(service.features || []).map((feat: string) => (
                    <li key={feat} className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
