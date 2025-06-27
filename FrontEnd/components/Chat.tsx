"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/rag";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [chatStarted, setChatStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

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
        body: JSON.stringify({ query }),
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
    <main className="w-screen min-h-screen bg-black text-white flex items-center justify-center">
      <AnimatePresence mode="wait">
        {!chatStarted ? (
          <motion.form
            key="landing"
            onSubmit={sendMessage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-6 w-full max-w-xl px-4"
          >
            <h1 className="text-4xl font-medium text-center">
              What&apos;s on your mind today?
            </h1>
            <div className="flex items-center bg-zinc-800 p-4 rounded-2xl w-full shadow-md">
              <input
                type="text"
                placeholder="Ask anything"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="bg-transparent outline-none flex-1 text-white placeholder-gray-400"
              />
            </div>
          </motion.form>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col w-full h-screen bg-zinc-900"
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
              className="w-full flex justify-center px-4 py-6 border-t border-zinc-800 bg-zinc-900"
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
        )}
      </AnimatePresence>
    </main>
  );
}
