"use client";

import { useEffect, useState } from "react";

type Message = {
  name: string;
  text: string;
  time: string;
};

export default function RoomChatClient({
  title,
  username,
}: {
  title: string;
  username: string;
}) {
  const [text, setText] = useState("");
  const defaultMessages: Message[] = [
  {
    name: "CineVault",
    text: `Welcome to the ${title}. What are you watching today?`,
    time: "Now",
  },
  {
    name: "MovieFan",
    text: "I need a strong recommendation for tonight.",
    time: "2 min ago",
  },
  {
    name: "TrailerHunter",
    text: "Drop trailers and reactions in #trailers.",
    time: "4 min ago",
  },
];

const [messages, setMessages] = useState<Message[]>(defaultMessages);

  const storageKey = `cinevault-room-${title}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);

      if (saved) {
          setMessages(JSON.parse(saved));
        } else {
          setMessages(defaultMessages);
        }
      } catch {
      // ignore broken saved data
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch {
      // ignore storage errors
    }
  }, [messages, storageKey]);

  function sendMessage(e: React.FormEvent) {
    e.preventDefault();

    if (!text.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        name: username || "Guest",
        text: text.trim(),
        time: "Now",
      },
    ]);

    setText("");
  }

  

  return (
    <>
      <div className="flex-1 space-y-6 overflow-y-auto p-5">
        {messages.map((msg, index) => (
          <div key={`${msg.name}-${index}`} className="flex gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-yellow-400 font-black text-black">
              {msg.name.slice(0, 1)}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <p className="font-black text-yellow-300">{msg.name}</p>
                <span className="text-xs text-white/30">{msg.time}</span>
              </div>

              <p className="mt-1 max-w-3xl text-sm leading-6 text-white/75">
                {msg.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={sendMessage}
        className="border-t border-white/10 bg-[#111722] p-4"
      >
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/35 px-4 py-3">
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-xl bg-white/[0.06] text-lg text-white/60"
          >
            +
          </button>

          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Message #general in ${title}`}
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35"
          />

          <button
            type="submit"
            className="rounded-xl bg-yellow-400 px-4 py-2 text-sm font-black text-black hover:bg-yellow-300"
          >
            Send
          </button>
        </div>

        <p className="mt-2 text-xs text-white/30">
          Demo chat only. Real-time saved messages can connect to Neon later.
        </p>
      </form>
    </>
  );
}