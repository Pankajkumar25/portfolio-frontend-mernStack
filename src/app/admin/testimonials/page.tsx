"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { testimonialAPI } from "@/lib/api";
import { Testimonial } from "@/types";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/ui/Modal";
import toast from "react-hot-toast";

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState({ name: "", role: "", company: "", content: "", rating: 5, featured: false });

  const fetchData = async () => {
    try {
      const { data } = await testimonialAPI.getAllAdmin();
      setTestimonials(data.data);
    } catch { toast.error("Failed to load testimonials"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", role: "", company: "", content: "", rating: 5, featured: false });
    setModalOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({ name: t.name, role: t.role, company: t.company, content: t.content, rating: t.rating, featured: t.featured });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await testimonialAPI.update(editing._id, form);
        toast.success("Updated!");
      } else {
        await testimonialAPI.create(form);
        toast.success("Created!");
      }
      setModalOpen(false);
      fetchData();
    } catch (err: any) { toast.error(err.response?.data?.message || "Failed to save"); }
  };

  const handleDelete = async (id: string) => {
    await testimonialAPI.delete(id);
    fetchData();
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "role", label: "Role" },
    { key: "company", label: "Company" },
    { key: "rating", label: "Rating", render: (v: number) => "★".repeat(v) + "☆".repeat(5 - v) },
    { key: "featured", label: "Featured", render: (v: boolean) => v ? <span className="text-primary">Yes</span> : "No" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Testimonials</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-primary rounded-xl text-sm">+ Add Testimonial</button>
      </div>
      <div className="glass rounded-2xl p-6">
        <DataTable columns={columns} data={testimonials} onEdit={openEdit} onDelete={handleDelete} loading={loading} />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Testimonial" : "Add Testimonial"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 glass rounded-xl text-sm text-white focus:outline-none" required />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Role</label>
              <input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-3 py-2 glass rounded-xl text-sm text-white focus:outline-none" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Company</label>
              <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full px-3 py-2 glass rounded-xl text-sm text-white focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Rating (1-5)</label>
              <input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                className="w-full px-3 py-2 glass rounded-xl text-sm text-white focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Content</label>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full px-3 py-2 glass rounded-xl text-sm text-white focus:outline-none resize-none h-24" required />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            Featured
          </label>
          <button type="submit" className="w-full py-3 bg-primary rounded-xl text-sm font-medium">{editing ? "Update" : "Create"}</button>
        </form>
      </Modal>
    </motion.div>
  );
}
