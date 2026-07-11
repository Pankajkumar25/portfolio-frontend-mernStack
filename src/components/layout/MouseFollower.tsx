"use client";

import { useEffect, useRef } from "react";

export default function MouseFollower() {
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const follower = followerRef.current;
    if (!follower) return;
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;
      follower.style.transform = `translate(${currentX - 15}px, ${currentY - 15}px)`;
      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={followerRef}
      className="fixed w-[30px] h-[30px] rounded-full border border-primary/50 pointer-events-none z-[60] hidden lg:block"
      style={{ transition: "width 0.3s, height 0.3s, border-color 0.3s" }}
    />
  );
}
