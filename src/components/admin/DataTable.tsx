"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HiPencil, HiTrash, HiSearch } from "react-icons/hi";
import toast from "react-hot-toast";

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onEdit?: (item: any) => void;
  onDelete?: (id: string) => void;
  loading?: boolean;
  searchExtra?: React.ReactNode;
}

export default function DataTable({ columns, data, onEdit, onDelete, loading, searchExtra }: DataTableProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filtered = data.filter((row) =>
    columns.some((col) =>
      String(row[col.key] || "").toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await onDelete?.(id);
      toast.success("Deleted successfully");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="relative w-full sm:w-72">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 glass rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50"
          />
        </div>
        {searchExtra}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              {columns.map((col) => (
                <th key={col.key} className="text-left py-3 px-4 text-gray-400 font-medium">{col.label}</th>
              ))}
              {(onEdit || onDelete) && <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-12 text-gray-500">Loading...</td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-12 text-gray-500">No data found</td>
              </tr>
            ) : (
              paginated.map((row, i) => (
                <motion.tr
                  key={row._id || i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="py-3 px-4">
                      {col.render ? col.render(row[col.key], row) : String(row[col.key] || "")}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="py-3 px-4 text-right">
                      <div className="flex gap-2 justify-end">
                        {onEdit && (
                          <button onClick={() => onEdit(row)} className="p-1.5 glass rounded-lg text-blue-400 hover:text-blue-300 transition-colors">
                            <HiPencil size={14} />
                          </button>
                        )}
                        {onDelete && (
                          <button onClick={() => handleDelete(row._id)} className="p-1.5 glass rounded-lg text-red-400 hover:text-red-300 transition-colors">
                            <HiTrash size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-8 h-8 rounded-lg text-xs transition-colors ${
                currentPage === i + 1 ? "bg-primary text-white" : "glass text-gray-400 hover:text-primary"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
