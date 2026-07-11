"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi";

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleMusic = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/audio/background.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.button
      onClick={toggleMusic}
      className="fixed top-20 left-4 z-40 w-10 h-10 glass rounded-full flex items-center justify-center text-gray-300 hover:text-primary transition-all"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title="Toggle background music"
    >
      {isPlaying ? <HiVolumeUp size={18} /> : <HiVolumeOff size={18} />}
    </motion.button>
  );
}
