"use client";

import { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";
import MouseFollower from "./MouseFollower";
import CommandMenu from "@/components/premium/CommandMenu";
import CustomCursor from "@/components/premium/CustomCursor";
import ThemeSwitcher from "@/components/premium/ThemeSwitcher";
import AIChatbot from "@/components/premium/AIChatbot";
import BackgroundMusic from "@/components/premium/BackgroundMusic";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CustomCursor />
      <MouseFollower />
      <Navbar />
      <main>{children}</main>
      <BackgroundMusic />
      <ThemeSwitcher />
      <CommandMenu />
      <AIChatbot />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#1a1a35",
            color: "#fff",
            border: "1px solid rgba(108, 99, 255, 0.3)",
          },
        }}
      />
    </>
  );
}
