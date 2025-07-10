'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { File, MessageCircle, Menu } from 'lucide-react';
import { History } from 'lucide-react';

interface Session {
  session_id: string;
  first_msg?: string;
}

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8001/chat_history');
        const data = await res.json();
  
        // Convert object to array of sessions
        const sessionArray = Object.entries(data).map(([session_id, messages]) => ({
          session_id,
          first_msg: messages[0]?.question || "No message",
        }));
  
        setSessions(sessionArray);
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
        setSessions([]);
      }
    };
  
    fetchSessions();
  }, []);
  

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-16'
      } bg-zinc-900 text-white flex flex-col py-4 px-2 min-h-screen border-r border-zinc-800 transition-all duration-300`}
    >
      {/* Toggle Sidebar Button */}
      <button
        onClick={toggleSidebar}
        className="mb-6 p-2 self-end sm:self-start hover:bg-zinc-800 rounded"
      >
        <Menu size={20} />
      </button>

      {/* Navigation Links */}
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

        <a className={`flex items-center gap-2 px-2 py-2 transition whitespace-nowrap ${isOpen?'':'hover:text-zinc-300 cursor-pointer'}`} onClick={toggleSidebar}>
          <History size = {20}/>
          {isOpen && <span>Chat History</span>}
        </a>

        {/* Chat History Links */}
        {isOpen&&<div className="mt-4 space-y-2 max-h-[70vh] overflow-y-auto scrollbar-hidden">
          {sessions.map((session) => (
            <Link
              key={session.session_id}
              href={{
                pathname: '/ChatHistory',
                query: { session_id: session.session_id },
              }}
              className="block"
            >
              <div className="p-4 bg-zinc-800 rounded-md shadow-sm hover:bg-zinc-700 transition-colors cursor-pointer">
                <p className="text-sm text-zinc-300 truncate">
                  {session.first_msg || 'No message'}
                </p>
                <p className="text-xs text-zinc-500 mt-2 truncate">
                  Session ID: {session.session_id}
                </p>
              </div>
            </Link>
          ))}
        </div>}
      </nav>
    </aside>
  );
}
