"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { serviceAPI } from "@/lib/api";
import { Service } from "@/types";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/ui/Modal";
import toast from "react-hot-toast";

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState({ title: "", description: "", icon: "", features: "" });

  const fetchData = async () => {
    try {
      const { data } = await serviceAPI.getAll();
      setServices(data.data);
    } catch { toast.error("Failed to load services"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditing(null); setForm({ title: "", description: "", icon: "🚀", features: "" }); setModalOpen(true);
  };

  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({ title: s.title, description: s.description, icon: s.icon, features: s.features.join(", ") });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, features: form.features.split(",").map((f) => f.trim()).filter(Boolean) };
    try {
      if (editing) { await serviceAPI.update(editing._id, payload); toast.success("Updated!"); }
      else { await serviceAPI.create(payload); toast.success("Created!"); }
      setModalOpen(false); fetchData();
    } catch (err: any) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const handleDelete = async (id: string) => { await serviceAPI.delete(id); fetchData(); };

  const columns = [
    { key: "icon", label: "Icon", render: (v: string) => <span className="text-xl">{v}</span> },
    { key: "title", label: "Title" },
    { key: "description", label: "Description", render: (v: string) => v.slice(0, 60) + "..." },
    { key: "features", label: "Features", render: (v: string[]) => `${v.length} features` },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Services</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-primary rounded-xl text-sm">+ Add Service</button>
      </div>
      <div className="glass rounded-2xl p-6">
        <DataTable columns={columns} data={services} onEdit={openEdit} onDelete={handleDelete} loading={loading} />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Service" : "Add Service"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Title</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 glass rounded-xl text-sm text-white focus:outline-none" required />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Icon (emoji)</label>
              <input type="text" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}
                className="w-full px-3 py-2 glass rounded-xl text-sm text-white focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 glass rounded-xl text-sm text-white focus:outline-none resize-none h-20" required />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Features (comma separated)</label>
            <input type="text" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })}
              className="w-full px-3 py-2 glass rounded-xl text-sm text-white focus:outline-none" />
          </div>
          <button type="submit" className="w-full py-3 bg-primary rounded-xl text-sm font-medium">{editing ? "Update" : "Create"}</button>
        </form>
      </Modal>
    </motion.div>
  );
}
