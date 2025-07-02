import React from "react";
import { File, ChevronLeft, ChevronRight } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { Menu } from "lucide-react";

interface sidebarProp {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: sidebarProp) {
  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-16"
      } bg-zinc-900 text-white flex flex-col py-4 px-2 min-h-screen border-r border-zinc-800 transition-all duration-300`}
    >
      {/* open and close sidebar */}
      <button
        onClick={toggleSidebar}
        className="mb-6 p-2 self-end sm:self-start hover:bg-zinc-800 rounded"
      >
        <Menu size={20} />
      </button>

      {/* Files and Chat buttons */}
      <nav className="space-y-6">
        <a
          href="/files"
          className="flex items-center gap-2 px-2 py-2 hover:text-zinc-300 transition whitespace-nowrap"
        >
          <File size={20} />
          {isOpen && <span>RAG Files</span>}
        </a>

        <a
          href="/"
          className="flex items-center gap-2 px-2 py-2 hover:text-zinc-300 transition whitespace-nowrap"
        >
          <MessageCircle size={20} />
          {isOpen && <span>Chat</span>}
        </a>
      </nav>
    </aside>
  );
}
