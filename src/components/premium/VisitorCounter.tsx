"use client";

import { useState, useEffect } from "react";
import { HiEye } from "react-icons/hi";

export default function VisitorCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("visitorCount");
    const newCount = stored ? parseInt(stored) + 1 : 1;
    localStorage.setItem("visitorCount", newCount.toString());
    setCount(newCount + 2350);
  }, []);

  return (
    <div className="fixed top-20 right-4 z-40 glass rounded-lg px-3 py-1.5 text-xs text-gray-400 hidden lg:flex items-center gap-2">
      <HiEye size={14} />
      <span>{count.toLocaleString()} visitors</span>
    </div>
  );
}
