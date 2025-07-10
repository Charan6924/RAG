'use client'
import React, { useEffect, useState } from 'react';
import History from '../../components/History';
import { useSearchParams } from 'next/navigation';

type Message = {
  role: "user" | "assistant";
  content: string;
};

const Page = () => {
  const searchParams = useSearchParams();
  const [previousMessages, setPreviousMessages] = useState<Message[]>([]);
  const session_id = searchParams.get('session_id') || '';

  useEffect(() => {
    if (!session_id) return;
    setPreviousMessages([])
    const fetchChats = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8001/complete_history?session_id=${session_id}`);
        const previousMessages = await res.json();
        setPreviousMessages(previousMessages);
      } catch (err) {
        console.error("Failed to get session:", err);
      }
    };

    fetchChats();
  }, [session_id]);

  return (
    <>
      {previousMessages.length === 0 ? (
        <div>Loading chat history...</div>
      ) : (
        <History key = {session_id} initial_messages={previousMessages} session_id={session_id} />
      )}
    </>
  );
};

export default Page;

