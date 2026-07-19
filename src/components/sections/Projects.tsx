"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiSearch, HiExternalLink, HiCode } from "react-icons/hi";
import { FaGithub } from "react-icons/fa";
import { projectAPI } from "@/lib/api";
import { Project } from "@/types";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { PROJECT_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Modal from "@/components/ui/Modal";
import { ProjectCardSkeleton } from "@/components/ui/Skeleton";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { ref, isVisible } = useScrollAnimation();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const params: Record<string, string> = {};
        if (activeCategory !== "all") params.category = activeCategory;
        if (search) params.search = search;
        const { data } = await projectAPI.getAll(params);
        setProjects(data.data);
      } catch (err) {
        console.error("Failed to load projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [activeCategory, search]);

  return (
    <section id="projects" className="relative py-0" ref={ref}>
      <div className="section-container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
        >
          My <span className="text-gradient">Projects</span>
        </motion.h2>
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
        >
          Showcasing my work and the technologies I&apos;ve used
        </motion.p>

        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
          <div className="flex gap-2 flex-wrap justify-center">
            {PROJECT_CATEGORIES.map((cat) => (
              <motion.button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm transition-all",
                  activeCategory === cat.value
                    ? "bg-primary text-white"
                    : "glass text-gray-300 hover:text-primary"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 glass rounded-full text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {projects.map((project, i) => (
                <motion.div
                  key={project._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="group relative glass rounded-2xl overflow-hidden cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                  whileHover={{ y: -5 }}
                  style={{ transformStyle: "preserve-3d" }}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = (y - centerY) / 20;
                    const rotateY = (centerX - x) / 20;
                    e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
                  }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={project.images[0]?.url || "https://via.placeholder.com/400x250/1a1a35/6C63FF?text=Project"}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-100 via-transparent to-transparent" />
                    {project.featured && (
                      <span className="absolute top-3 right-3 px-3 py-1 bg-primary/90 text-xs rounded-full font-medium">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 text-xs glass rounded-full text-primary"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 4 && (
                        <span className="px-2 py-0.5 text-xs glass rounded-full text-gray-400">
                          +{project.techStack.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <Modal isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} title={selectedProject?.title} size="lg">
        {selectedProject && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedProject.images.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt={`${selectedProject.title} ${i + 1}`}
                  className="rounded-xl w-full h-48 object-cover"
                  loading="lazy"
                />
              ))}
            </div>
            <p className="text-gray-300">{selectedProject.description}</p>
            <div>
              <h4 className="font-semibold mb-2">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {selectedProject.techStack.map((tech) => (
                  <span key={tech} className="px-3 py-1 glass rounded-full text-sm text-primary">{tech}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              {selectedProject.githubLink && (
                <a href={selectedProject.githubLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 glass rounded-full hover:text-primary transition-colors">
                  <FaGithub /> Source Code
                </a>
              )}
              {selectedProject.liveLink && (
                <a href={selectedProject.liveLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-primary rounded-full hover:bg-primary/80 transition-colors">
                  <HiExternalLink /> Live Demo
                </a>
              )}
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
