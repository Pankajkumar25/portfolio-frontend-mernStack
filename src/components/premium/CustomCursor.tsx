"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    window.addEventListener("mousemove", updatePosition);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed z-[9999] hidden lg:block"
      style={{
        left: position.x,
        top: position.y,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s",
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="w-8 h-8 rounded-full border border-primary/40 -ml-4 -mt-4 absolute" />
      <div className="w-1.5 h-1.5 rounded-full bg-primary absolute" />
    </div>
  );
}
