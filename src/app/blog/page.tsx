"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { blogAPI } from "@/lib/api";
import { Blog } from "@/types";
import { formatDate, truncate } from "@/lib/utils";
import Skeleton from "@/components/ui/Skeleton";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await blogAPI.getAll({ published: "true" });
        setBlogs(data.data);
      } catch (err) {
        console.error("Failed to load blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen pt-24">
      <div className="section-container">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          My <span className="text-gradient">Blog</span>
        </motion.h1>
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Thoughts, tutorials, and insights on web development
        </motion.p>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={350} className="rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog, i) => (
              <motion.article
                key={blog._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="glass rounded-2xl overflow-hidden group hover:neon-glow transition-all"
              >
                <Link href={`/blog/${blog.slug}`}>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={blog.coverImage?.url || "https://via.placeholder.com/400x250/1a1a35/6C63FF"}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-100 via-transparent to-transparent" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      <span>{formatDate(blog.createdAt)}</span>
                      <span>·</span>
                      <span>{blog.readTime} min read</span>
                    </div>
                    <h2 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{blog.title}</h2>
                    <p className="text-gray-400 text-sm">{truncate(blog.excerpt, 120)}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {blog.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 text-xs glass rounded-full text-primary">{tag}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
