"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { contactAPI } from "@/lib/api";
import { SOCIAL_LINKS } from "@/lib/constants";
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { HiMail, HiPhone } from "react-icons/hi";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const { ref, isVisible } = useScrollAnimation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill all fields");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Please enter a valid email");
      return;
    }
    setSending(true);
    try {
      await contactAPI.send(formData);
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="relative py-20" ref={ref}>
      <div className="absolute inset-0 cyber-grid-bg opacity-20" />
      <div className="section-container relative z-10">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
        >
          Get In <span className="text-gradient">Touch</span>
        </motion.h2>
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
        >
          Have a project in mind? Let&apos;s build something amazing together
        </motion.p>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 glass rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Your Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 glass rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 glass rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="Project Collaboration"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 glass rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>
              <Button variant="primary" size="lg" type="submit" className="w-full">
                {sending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="glass rounded-2xl p-6 space-y-4">
              <h3 className="text-xl font-bold mb-4">Contact Information</h3>
              {[
                { icon: HiMail, label: "Email", value: SOCIAL_LINKS.email },
                { icon: HiPhone, label: "Phone", value: "+91 9889109941" },
                { icon: FaMapMarkerAlt, label: "Location", value: "Chandigarh , India" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="w-12 h-12 glass rounded-xl flex items-center justify-center text-primary">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">{item.label}</p>
                    <p className="font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">Follow Me</h3>
              <div className="flex gap-3">
                {[
                  { icon: FaGithub, href: SOCIAL_LINKS.github },
                  { icon: FaLinkedin, href: SOCIAL_LINKS.linkedin },
                  // { icon: FaTwitter, href: SOCIAL_LINKS.twitter },
                  { icon: FaEnvelope, href: `mailto:${SOCIAL_LINKS.email}` },
                ].map(({ icon: Icon, href }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 glass rounded-xl flex items-center justify-center text-gray-300 hover:text-primary hover:border-primary transition-all"
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            {/* <div className="glass rounded-2xl h-48 overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823277!2d72.74109995705735!3d19.082197839582217!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644e5c1%3A0x5c0e4b0c1e4b0c1e!2sMumbai%2C%20Maharashtra%2C%20India!5e0!3m2!1sen!2s!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                className="grayscale opacity-60 hover:opacity-100 transition-opacity"
              />
            </div> */}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
