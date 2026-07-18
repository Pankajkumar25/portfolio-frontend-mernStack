"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { projectAPI } from "@/lib/api";
import { Project } from "@/types";
import DataTable from "@/components/admin/DataTable";
import CloudinaryUpload from "@/components/admin/CloudinaryUpload";
import Modal from "@/components/ui/Modal";
import toast from "react-hot-toast";

const categories = ["fullstack", "frontend", "backend", "api", "other"];

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState({
    title: "", description: "", category: "fullstack", techStack: "",
    githubLink: "", liveLink: "", featured: false,
    images: [] as { url: string; publicId: string }[],
  });

  const fetchData = async () => {
    try {
      const { data } = await projectAPI.getAll();
      setProjects(data.data);
    } catch { toast.error("Failed to load projects"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: "", description: "", category: "fullstack", techStack: "", githubLink: "", liveLink: "", featured: false, images: [] });
    setModalOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditing(project);
    setForm({
      title: project.title,
      description: project.description,
      category: project.category,
      techStack: project.techStack.join(", "),
      githubLink: project.githubLink || "",
      liveLink: project.liveLink || "",
      featured: project.featured,
      images: project.images,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      techStack: form.techStack.split(",").map((t) => t.trim()).filter(Boolean),
    };

    try {
      if (editing) {
        await projectAPI.update(editing._id, payload);
        toast.success("Project updated!");
      } else {
        await projectAPI.create(payload);
        toast.success("Project created!");
      }
      setModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save");
    }
  };

  const handleDelete = async (id: string) => {
    await projectAPI.delete(id);
    fetchData();
  };

  const columns = [
    { key: "title", label: "Title" },
    { key: "category", label: "Category", render: (v: string) => <span className="capitalize">{v}</span> },
    { key: "techStack", label: "Tech", render: (v: string[]) => v.slice(0, 3).join(", ") },
    { key: "featured", label: "Featured", render: (v: boolean) => v ? <span className="text-primary">★</span> : "—" },
    { key: "createdAt", label: "Date", render: (v: string) => new Date(v).toLocaleDateString() },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-primary rounded-xl text-sm hover:bg-primary/80 transition-colors">
          + Add Project
        </button>
      </div>

      <div className="glass rounded-2xl p-6">
        <DataTable columns={columns} data={projects} onEdit={openEdit} onDelete={handleDelete} loading={loading} />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Project" : "Add Project"} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Title</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 glass rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" required />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 glass rounded-xl text-sm text-white focus:outline-none">
                {categories.map((c) => <option key={c} value={c} className="bg-dark-100">{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 glass rounded-xl text-sm text-white focus:outline-none resize-none h-24" required />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Tech Stack (comma separated)</label>
            <input type="text" value={form.techStack} onChange={(e) => setForm({ ...form, techStack: e.target.value })}
              className="w-full px-3 py-2 glass rounded-xl text-sm text-white focus:outline-none" placeholder="React, Node.js, MongoDB" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">GitHub Link</label>
              <input type="url" value={form.githubLink} onChange={(e) => setForm({ ...form, githubLink: e.target.value })}
                className="w-full px-3 py-2 glass rounded-xl text-sm text-white focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Live Link</label>
              <input type="url" value={form.liveLink} onChange={(e) => setForm({ ...form, liveLink: e.target.value })}
                className="w-full px-3 py-2 glass rounded-xl text-sm text-white focus:outline-none" />
            </div>
          </div>
          <CloudinaryUpload
            images={form.images}
            onChange={(images) => setForm({ ...form, images })}
          />
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="rounded border-gray-600" />
            Featured Project
          </label>
          <button type="submit" className="w-full py-3 bg-primary rounded-xl text-sm font-medium hover:bg-primary/80 transition-colors">
            {editing ? "Update Project" : "Create Project"}
          </button>
        </form>
      </Modal>
    </motion.div>
  );
}
