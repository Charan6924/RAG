"use client";

import "./globals.css";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <html lang="en" className="h-full">
      <body className="h-screen w-full flex bg-black text-white overflow-hidden">
        <Sidebar isOpen={open} toggleSidebar={() => setOpen((prev) => !prev)} />
        <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
      </body>
    </html>
  );
}
