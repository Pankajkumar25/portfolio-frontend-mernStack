"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { experienceAPI } from "@/lib/api";
import { Experience } from "@/types";
import { formatDate } from "@/lib/utils";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/ui/Modal";
import toast from "react-hot-toast";

const types = ["experience", "education", "internship"];

export default function AdminExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form, setForm] = useState({
    company: "", role: "", description: "", type: "experience" as Experience["type"],
    techUsed: "", startDate: "", endDate: "", current: false,
  });

  const fetchData = async () => {
    try {
      const { data } = await experienceAPI.getAll();
      setExperiences(data.data);
    } catch { toast.error("Failed to load experiences"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ company: "", role: "", description: "", type: "experience", techUsed: "", startDate: "", endDate: "", current: false });
    setModalOpen(true);
  };

  const openEdit = (exp: Experience) => {
    setEditing(exp);
    setForm({
      company: exp.company, role: exp.role, description: exp.description, type: exp.type,
      techUsed: exp.techUsed.join(", "), startDate: exp.startDate.slice(0, 7), endDate: exp.endDate?.slice(0, 7) || "",
      current: exp.current,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      techUsed: form.techUsed.split(",").map((t) => t.trim()).filter(Boolean),
      startDate: new Date(form.startDate),
      endDate: form.endDate ? new Date(form.endDate) : undefined,
    };
    try {
      if (editing) {
        await experienceAPI.update(editing._id, payload);
        toast.success("Updated!");
      } else {
        await experienceAPI.create(payload);
        toast.success("Created!");
      }
      setModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save");
    }
  };

  const handleDelete = async (id: string) => {
    await experienceAPI.delete(id);
    fetchData();
  };

  const columns = [
    { key: "role", label: "Role" },
    { key: "company", label: "Company" },
    { key: "type", label: "Type", render: (v: string) => <span className="capitalize">{v}</span> },
    { key: "startDate", label: "Start", render: (v: string) => formatDate(v) },
    { key: "current", label: "Status", render: (v: boolean) => v ? <span className="text-primary">Current</span> : "—" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-xl md:text-3xl font-bold mb-6">Experiences</h1>
      <div className="glass rounded-2xl p-6">
        <DataTable
          columns={columns}
          data={experiences}
          onEdit={openEdit}
          onDelete={handleDelete}
          loading={loading}
          searchExtra={
            <button onClick={openCreate} className="px-4 py-2 bg-primary rounded-xl text-sm whitespace-nowrap">+ Add Experience</button>
          }
        />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Experience" : "Add Experience"} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Role</label>
              <input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-3 py-2 glass rounded-xl text-sm text-white focus:outline-none" required />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Company</label>
              <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full px-3 py-2 glass rounded-xl text-sm text-white focus:outline-none" required />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 glass rounded-xl text-sm text-white focus:outline-none resize-none h-20" required />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Start Date</label>
              <input type="month" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-3 py-2 glass rounded-xl text-sm text-white focus:outline-none" required />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">End Date</label>
              <input type="month" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full px-3 py-2 glass rounded-xl text-sm text-white focus:outline-none" disabled={form.current} />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Experience["type"] })}
              className="w-full px-3 py-2 glass rounded-xl text-sm text-white focus:outline-none">
              {types.map((t) => <option key={t} value={t} className="bg-dark-100">{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Tech Used (comma separated)</label>
            <input type="text" value={form.techUsed} onChange={(e) => setForm({ ...form, techUsed: e.target.value })}
              className="w-full px-3 py-2 glass rounded-xl text-sm text-white focus:outline-none" />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" checked={form.current} onChange={(e) => setForm({ ...form, current: e.target.checked })}
              className="rounded border-gray-600" />
            Currently Working
          </label>
          <button type="submit" className="w-full py-3 bg-primary rounded-xl text-sm font-medium hover:bg-primary/80">
            {editing ? "Update" : "Create"}
          </button>
        </form>
      </Modal>
    </motion.div>
  );
}
