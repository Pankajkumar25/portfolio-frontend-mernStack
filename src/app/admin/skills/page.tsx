"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { skillAPI } from "@/lib/api";
import { Skill } from "@/types";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/ui/Modal";
import toast from "react-hot-toast";

const categories = ["frontend", "backend", "devops", "tools", "database"];

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState({ name: "", percentage: 0, category: "frontend" as Skill["category"] });

  const fetchData = async () => {
    try {
      const { data } = await skillAPI.getAll();
      setSkills(data.data);
    } catch { toast.error("Failed to load skills"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", percentage: 50, category: "frontend" });
    setModalOpen(true);
  };

  const openEdit = (skill: Skill) => {
    setEditing(skill);
    setForm({ name: skill.name, percentage: skill.percentage, category: skill.category });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await skillAPI.update(editing._id, form);
        toast.success("Skill updated!");
      } else {
        await skillAPI.create(form);
        toast.success("Skill created!");
      }
      setModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save");
    }
  };

  const handleDelete = async (id: string) => {
    await skillAPI.delete(id);
    fetchData();
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "percentage", label: "Percentage", render: (v: number) => `${v}%` },
    { key: "category", label: "Category", render: (v: string) => <span className="capitalize">{v}</span> },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Skills</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-primary rounded-xl text-sm hover:bg-primary/80 transition-colors">+ Add Skill</button>
      </div>
      <div className="glass rounded-2xl p-6">
        <DataTable columns={columns} data={skills} onEdit={openEdit} onDelete={handleDelete} loading={loading} />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Skill" : "Add Skill"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 glass rounded-xl text-sm text-white focus:outline-none" required />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Percentage ({form.percentage}%)</label>
            <input type="range" min={0} max={100} value={form.percentage} onChange={(e) => setForm({ ...form, percentage: Number(e.target.value) })}
              className="w-full accent-primary" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Skill["category"] })}
              className="w-full px-3 py-2 glass rounded-xl text-sm text-white focus:outline-none">
              {categories.map((c) => <option key={c} value={c} className="bg-dark-100">{c}</option>)}
            </select>
          </div>
          <button type="submit" className="w-full py-3 bg-primary rounded-xl text-sm font-medium hover:bg-primary/80 transition-colors">
            {editing ? "Update Skill" : "Create Skill"}
          </button>
        </form>
      </Modal>
    </motion.div>
  );
}
