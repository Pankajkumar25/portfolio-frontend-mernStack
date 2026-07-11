"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { blogAPI } from "@/lib/api";
import { Blog } from "@/types";
import { formatDate } from "@/lib/utils";
import Skeleton from "@/components/ui/Skeleton";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await blogAPI.getBySlug(slug as string);
        setBlog(data.data);
      } catch (err) {
        console.error("Failed to load blog:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 section-container">
        <Skeleton variant="rectangular" height={400} className="rounded-2xl mb-8" />
        <Skeleton variant="text" height={40} width="60%" className="mb-4" />
        <Skeleton variant="text" height={20} width="30%" className="mb-8" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} variant="text" height={16} className="mb-2" />
        ))}
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen pt-24 section-container text-center">
        <h1 className="text-2xl font-bold mb-4">Blog not found</h1>
        <Link href="/blog" className="text-primary hover:underline">Back to blog</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24">
      <div className="section-container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary mb-6 transition-colors">
            <HiArrowLeft /> Back to Blog
          </Link>

          {blog.coverImage?.url && (
            <img src={blog.coverImage.url} alt={blog.title} className="w-full h-64 md:h-96 object-cover rounded-2xl mb-8" loading="lazy" />
          )}

          <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
            <span>{formatDate(blog.createdAt)}</span>
            <span>·</span>
            <span>{blog.readTime} min read</span>
            <span>·</span>
            <span>{blog.views} views</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">{blog.title}</h1>
          <p className="text-gray-400 text-lg mb-8">{blog.excerpt}</p>

          <div className="flex flex-wrap gap-2 mb-8">
            {blog.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 glass rounded-full text-sm text-primary">{tag}</span>
            ))}
          </div>

          <article
            className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-a:text-primary prose-strong:text-white prose-code:text-accent"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </motion.div>
      </div>
    </div>
  );
}
