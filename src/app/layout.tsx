import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

export const metadata: Metadata = {
  title: "Pankaj Kumar | MERN Stack Developer",
  description:
    "Professional portfolio of Pankaj Kumar - MERN Stack Developer specializing in React, Next.js, Node.js, and MongoDB. Building modern web applications.",
  keywords: [
    "MERN Stack Developer",
    "React Developer",
    "Next.js Developer",
    "Node.js",
    "MongoDB",
    "Portfolio",
    "Web Developer",
    "Full Stack Developer",
  ],
  authors: [{ name: "Pankaj Kumar" }],
  openGraph: {
    title: "Pankaj Kumar | MERN Stack Developer",
    description: "Building digital experiences with modern web technologies.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
