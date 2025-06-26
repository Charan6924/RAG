// components/Chat.tsx
'use client';

import { useState, useRef, useEffect } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/rag';

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! Ask me anything.' },
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input }),
      });

      const data = await res.json();
      const botMessage = { role: 'assistant', content: data.answer || 'No response from backend.' };

      setMessages((prev) => [...prev, botMessage]);
      setInput('');
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: '❌ Error contacting server.' }]);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <div className="w-full max-w-2xl h-[90vh] bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg max-w-[80%] whitespace-pre-wrap text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'ml-auto bg-blue-600 text-white'
                  : 'mr-auto bg-zinc-700 text-gray-100'
              }`}
            >
              {msg.content}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form
          onSubmit={sendMessage}
          className="flex items-center gap-2 bg-zinc-800 p-4 border-t border-zinc-700"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 px-4 py-2 bg-zinc-900 text-white rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 px-4 py-2 rounded-lg text-white hover:bg-blue-700 transition"
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
}
