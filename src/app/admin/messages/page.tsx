"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { contactAPI } from "@/lib/api";
import { Contact } from "@/types";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/ui/Modal";
import toast from "react-hot-toast";

export default function AdminMessages() {
  const [messages, setMessages] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contact | null>(null);

  const fetchData = async () => {
    try {
      const { data } = await contactAPI.getAll({ page: "1", limit: "50" });
      setMessages(data.data);
    } catch { toast.error("Failed to load messages"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    await contactAPI.delete(id);
    fetchData();
    toast.success("Message deleted");
  };

  const handleMarkRead = async (id: string) => {
    try {
      await contactAPI.markRead(id);
      fetchData();
    } catch { toast.error("Failed to mark as read"); }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "subject", label: "Subject" },
    { key: "read", label: "Status", render: (v: boolean) => v ? <span className="text-gray-500">Read</span> : <span className="text-primary font-medium">New</span> },
    { key: "createdAt", label: "Date", render: (v: string) => new Date(v).toLocaleDateString() },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Messages</h1>
      </div>
      <div className="glass rounded-2xl p-6">
        <DataTable
          columns={columns}
          data={messages}
          onDelete={handleDelete}
          onEdit={(msg) => {
            setSelected(msg);
            if (!msg.read) handleMarkRead(msg._id);
          }}
          loading={loading}
        />
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected?.subject} size="md">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">From</p>
                <p className="font-medium">{selected.name}</p>
              </div>
              <div>
                <p className="text-gray-400">Email</p>
                <p className="font-medium">{selected.email}</p>
              </div>
              <div>
                <p className="text-gray-400">Date</p>
                <p className="font-medium">{new Date(selected.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400">Status</p>
                <p className={`font-medium ${selected.read ? "text-gray-400" : "text-primary"}`}>
                  {selected.read ? "Read" : "New"}
                </p>
              </div>
            </div>
            <div className="glass rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-2">Message:</p>
              <p className="text-white">{selected.message}</p>
            </div>
            <a href={`mailto:${selected.email}`}
              className="inline-block px-4 py-2 bg-primary rounded-xl text-sm hover:bg-primary/80 transition-colors">
              Reply via Email
            </a>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
