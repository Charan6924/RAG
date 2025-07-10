"use client";
import { useState } from "react";
import { useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const apiUrl = "http://127.0.0.1:8001/rag";

export default function History({initial_messages = [], session_id} : {initial_messages?:Message[], session_id : string}) {
  const [messages, setMessages] = useState<Message[]>(initial_messages);
  const [input, setInput] = useState("");
  const [chatStarted, setChatStarted] = useState(true);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (!input.trim() || !session_id) return;

    const query = input;
    setInput("");
    const userMessage: Message = { role: "user", content: query };
    setMessages((prev) => [...prev, userMessage]);
    if (!chatStarted) setChatStarted(true);

    setLoading(true);
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          session_id: session_id,
        }),
      });

      const data = await res.json();
      const botMessage: Message = {
        role: "assistant",
        content: data.answer || "No response from backend.",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Error contacting server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <main className="bg-black text-white flex flex-col h-screen w-full">
      <AnimatePresence mode="wait">
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col w-full h-full bg-black"
          >
            {/* Chat History */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-3 rounded-2xl shadow-md text-sm leading-relaxed max-w-[80%] whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "bg-cyan-500 text-white"
                          : "bg-zinc-800 text-gray-100"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-start"
                  >
                    <div className="px-4 py-3 rounded-2xl bg-zinc-800 text-gray-400 text-sm font-mono flex gap-1 animate-pulse">
                      <span>Thinking</span>
                      <span className="animate-bounce">.</span>
                      <span className="animate-bounce delay-150">.</span>
                      <span className="animate-bounce delay-300">.</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={sendMessage}
              className="w-full flex justify-center px-4 py-6 border-t border-black bg-black"
            >
              <div className="flex items-center w-full max-w-2xl bg-zinc-800 rounded-3xl px-4 py-3 shadow-lg">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(e);
                    }
                  }}
                  placeholder="Type your message..."
                  rows={2}
                  className="flex-1 bg-transparent resize-none text-white placeholder-gray-400 focus:outline-none text-base"
                />
                <button
                  type="submit"
                  className="ml-3 px-4 py-2 rounded-full bg-cyan-500 hover:bg-blue-700 transition text-white text-sm"
                >
                  Send
                </button>
              </div>
            </form>
          </motion.div>
      </AnimatePresence>
    </main>
  );
}
