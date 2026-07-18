"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { blogAPI } from "@/lib/api";
import { Blog } from "@/types";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/ui/Modal";
import RichTextEditor from "@/components/admin/RichTextEditor";
import toast from "react-hot-toast";

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [form, setForm] = useState({
    title: "", excerpt: "", content: "", tags: "",
    published: false, coverImage: "", readTime: 5,
  });

  const fetchData = async () => {
    try {
      const { data } = await blogAPI.getAll();
      setBlogs(data.data);
    } catch { toast.error("Failed to load blogs"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: "", excerpt: "", content: "", tags: "", published: false, coverImage: "", readTime: 5 });
    setModalOpen(true);
  };

  const openEdit = (blog: Blog) => {
    setEditing(blog);
    setForm({
      title: blog.title, excerpt: blog.excerpt, content: blog.content,
      tags: blog.tags.join(", "), published: blog.published,
      coverImage: blog.coverImage?.url || "", readTime: blog.readTime,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      coverImage: { url: form.coverImage, publicId: "" },
    };
    try {
      if (editing) { await blogAPI.update(editing._id, payload); toast.success("Updated!"); }
      else { await blogAPI.create(payload); toast.success("Created!"); }
      setModalOpen(false); fetchData();
    } catch (err: any) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const handleDelete = async (id: string) => { await blogAPI.delete(id); fetchData(); };

  const columns = [
    { key: "title", label: "Title" },
    { key: "readTime", label: "Read Time", render: (v: number) => `${v} min` },
    { key: "views", label: "Views" },
    { key: "published", label: "Status", render: (v: boolean) => v ? <span className="text-green-400">Published</span> : <span className="text-gray-500">Draft</span> },
    { key: "createdAt", label: "Date", render: (v: string) => new Date(v).toLocaleDateString() },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-xl md:text-3xl font-bold mb-6">Blogs</h1>
      <div className="glass rounded-2xl p-6">
        <DataTable
          columns={columns}
          data={blogs}
          onEdit={openEdit}
          onDelete={handleDelete}
          loading={loading}
          searchExtra={
            <button onClick={openCreate} className="px-4 py-2 bg-primary rounded-xl text-sm whitespace-nowrap">+ Add Blog</button>
          }
        />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Blog" : "Add Blog"} size="xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Title</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 glass rounded-xl text-sm text-white focus:outline-none" required />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Cover Image URL</label>
              <input type="url" value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                className="w-full px-3 py-2 glass rounded-xl text-sm text-white focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Read Time (minutes)</label>
              <input type="number" value={form.readTime} onChange={(e) => setForm({ ...form, readTime: Number(e.target.value) })}
                className="w-full px-3 py-2 glass rounded-xl text-sm text-white focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Excerpt</label>
            <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="w-full px-3 py-2 glass rounded-xl text-sm text-white focus:outline-none resize-none h-20" required />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Content</label>
            <RichTextEditor value={form.content} onChange={(value) => setForm({ ...form, content: value })} />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Tags (comma separated)</label>
            <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full px-3 py-2 glass rounded-xl text-sm text-white focus:outline-none" />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            Published
          </label>
          <button type="submit" className="w-full py-3 bg-primary rounded-xl text-sm font-medium">{editing ? "Update" : "Create"}</button>
        </form>
      </Modal>
    </motion.div>
  );
}
