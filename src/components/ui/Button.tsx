"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: () => void;
  className?: string;
  download?: boolean;
  type?: "button" | "submit";
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  className,
  download,
  type = "button",
}: ButtonProps) {
  const baseClasses = cn(
    "inline-flex items-center justify-center gap-2 font-medium rounded-full transition-all duration-300",
    "hover:shadow-lg active:scale-95",
    {
      primary:
        "bg-primary text-white hover:shadow-primary/40",
      outline:
        "border border-primary/50 text-primary hover:bg-primary/10",
      ghost:
        "text-gray-300 hover:text-primary hover:bg-white/5",
    }[variant],
    {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    }[size],
    className
  );

  const content = (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={baseClasses}
    >
      {children}
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} download={download} target={!download ? "_blank" : undefined} rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      type={type}
      className={baseClasses}
    >
      {children}
    </motion.button>
  );
}
