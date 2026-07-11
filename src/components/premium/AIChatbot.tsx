"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiX } from "react-icons/hi";
import { FaRobot } from "react-icons/fa";
import { SITE_CONFIG, SOCIAL_LINKS } from "@/lib/constants";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const initialMessages: Message[] = [
  { role: "assistant", content: `Hi! I'm ${SITE_CONFIG.name}'s AI assistant. How can I help you today?` },
];

const responses: Record<string, string> = {
  skills: `${SITE_CONFIG.name} is skilled in React, Next.js, Node.js, Express, MongoDB, TypeScript, and more.`,
  experience: `${SITE_CONFIG.name} has 3+ years of experience as a MERN Stack Developer.`,
  projects: `${SITE_CONFIG.name} has built various projects like Book Management System, Crypto Dashboard, Vendor Auto Parts, and more.`,
  contact: `You can reach ${SITE_CONFIG.name} at ${SOCIAL_LINKS.email} or through the contact form.`,
  resume: `You can download ${SITE_CONFIG.name}'s resume from the hero section.`,
  default: `I'm not sure about that. Please ask about skills, experience, projects, or contact information.`,
};

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const lower = input.toLowerCase();
      let response = responses.default;
      if (lower.includes("skill") || lower.includes("tech")) response = responses.skills;
      else if (lower.includes("experience") || lower.includes("work")) response = responses.experience;
      else if (lower.includes("project")) response = responses.projects;
      else if (lower.includes("contact") || lower.includes("email")) response = responses.contact;
      else if (lower.includes("resume")) response = responses.resume;

      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-40 w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ boxShadow: ["0 0 20px rgba(108,99,255,0.4)", "0 0 40px rgba(108,99,255,0.6)", "0 0 20px rgba(108,99,255,0.4)"] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {isOpen ? <HiX size={24} /> : <FaRobot size={24} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 left-6 z-40 w-[350px] max-w-[calc(100vw-3rem)] glass rounded-2xl overflow-hidden shadow-2xl shadow-primary/20"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-primary/10">
              <FaRobot className="text-primary" size={20} />
              <span className="font-semibold text-sm">AI Assistant</span>
            </div>

            <div className="h-80 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                      msg.role === "assistant"
                        ? "glass text-gray-200"
                        : "bg-primary text-white"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="glass px-3 py-2 rounded-xl">
                    <span className="animate-pulse">...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about me..."
                  className="flex-1 px-3 py-2 glass rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none"
                />
                <button
                  onClick={handleSend}
                  className="px-4 py-2 bg-primary rounded-xl text-sm hover:bg-primary/80 transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

