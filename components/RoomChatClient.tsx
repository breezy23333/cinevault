"use client";

import { useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type RoomMessage = {
  id: number;
  room: string;
  user_id: string;
  username: string;
  avatar_url: string | null;
  message: string;
  created_at: string;
};

type PresenceUser = {
  user_id: string;
  username: string;
  online_at: string;
};

type RoomChatClientProps = {
  title: string;
  roomKey: string;
  userId: string;
  username: string;
};

export default function RoomChatClient({
  title,
  roomKey,
  userId,
  username,
}: RoomChatClientProps) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const channelRef = useRef<RealtimeChannel | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const typingSentRef = useRef(false);
  const typingStopTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);
  const remoteTypingTimersRef = useRef<
    Record<string, ReturnType<typeof setTimeout>>
  >({});

  function addMessage(message: RoomMessage) {
    setMessages((current) => {
      if (current.some((item) => item.id === message.id)) {
        return current;
      }

      return [...current, message]
        .sort(
          (a, b) =>
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
        )
        .slice(-100);
    });
  }

  function sendTyping(isTyping: boolean) {
    const channel = channelRef.current;

    if (!channel) return;

    void channel.send({
      type: "broadcast",
      event: "typing",
      payload: {
        userId,
        username,
        isTyping,
      },
    });
  }

  function stopTyping() {
    if (typingStopTimerRef.current) {
      clearTimeout(typingStopTimerRef.current);
      typingStopTimerRef.current = null;
    }

    if (typingSentRef.current) {
      sendTyping(false);
      typingSentRef.current = false;
    }
  }

  useEffect(() => {
    let cancelled = false;

    const channel = supabase
      .channel(`room:${roomKey}`, {
        config: {
          presence: {
            key: `${userId}:${crypto.randomUUID()}`,
          },
          broadcast: {
            self: false,
          },
        },
      })
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "room_messages",
          filter: `room=eq.${roomKey}`,
        },
        (payload) => {
          addMessage(payload.new as RoomMessage);
        }
      )
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState() as Record<
          string,
          PresenceUser[]
        >;

        const users = new Map<string, string>();

        Object.values(state)
          .flat()
          .forEach((person) => {
            if (person.user_id && person.username) {
              users.set(person.user_id, person.username);
            }
          });

        setOnlineUsers(Array.from(users.values()));
      })
      .on("broadcast", { event: "typing" }, ({ payload }) => {
        const remoteUserId = String(payload?.userId || "");
        const remoteUsername = String(payload?.username || "");
        const isTyping = Boolean(payload?.isTyping);

        if (!remoteUserId || remoteUserId === userId || !remoteUsername) {
          return;
        }

        if (remoteTypingTimersRef.current[remoteUserId]) {
          clearTimeout(remoteTypingTimersRef.current[remoteUserId]);
        }

        if (!isTyping) {
          setTypingUsers((current) =>
            current.filter((name) => name !== remoteUsername)
          );
          return;
        }

        setTypingUsers((current) =>
          current.includes(remoteUsername)
            ? current
            : [...current, remoteUsername]
        );

        remoteTypingTimersRef.current[remoteUserId] = setTimeout(() => {
          setTypingUsers((current) =>
            current.filter((name) => name !== remoteUsername)
          );

          delete remoteTypingTimersRef.current[remoteUserId];
        }, 2500);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            user_id: userId,
            username,
            online_at: new Date().toISOString(),
          });
        }
      });

    channelRef.current = channel;

    async function loadMessages() {
      const { data, error: loadError } = await supabase
        .from("room_messages")
        .select(
          "id, room, user_id, username, avatar_url, message, created_at"
        )
        .eq("room", roomKey)
        .order("created_at", { ascending: false })
        .limit(100);

      if (cancelled) return;

      if (loadError) {
        console.error("LOAD CHAT ERROR:", loadError);
        setError("Messages could not be loaded.");
        setLoading(false);
        return;
      }

      const loadedMessages = [...(data || [])].reverse() as RoomMessage[];

      setMessages((current) => {
        const combined = new Map<number, RoomMessage>();

        [...loadedMessages, ...current].forEach((message) => {
          combined.set(message.id, message);
        });

        return Array.from(combined.values())
          .sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          )
          .slice(-100);
      });

      setLoading(false);
    }

    void loadMessages();

    return () => {
      cancelled = true;

      if (typingStopTimerRef.current) {
        clearTimeout(typingStopTimerRef.current);
      }

      Object.values(remoteTypingTimersRef.current).forEach((timer) => {
        clearTimeout(timer);
      });

      channelRef.current = null;
      void supabase.removeChannel(channel);
    };
  }, [roomKey, userId, username]);

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: messages.length > 1 ? "smooth" : "auto",
    });
  }, [messages]);

  function handleTextChange(value: string) {
    setText(value);

    if (!value.trim()) {
      stopTyping();
      return;
    }

    if (!typingSentRef.current) {
      sendTyping(true);
      typingSentRef.current = true;
    }

    if (typingStopTimerRef.current) {
      clearTimeout(typingStopTimerRef.current);
    }

    typingStopTimerRef.current = setTimeout(() => {
      sendTyping(false);
      typingSentRef.current = false;
      typingStopTimerRef.current = null;
    }, 1200);
  }

  async function sendMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const cleanText = text.trim();

    if (!cleanText || sending) return;

    setSending(true);
    setError("");

    try {
      const response = await fetch("/api/rooms/messages", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          room: roomKey,
          message: cleanText,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "The message could not be sent.");
        return;
      }

      addMessage(result.message as RoomMessage);
      setText("");
      stopTyping();
    } catch (sendError) {
      console.error("SEND CHAT ERROR:", sendError);
      setError("The message could not be sent.");
    } finally {
      setSending(false);
    }
  }

  function formatTime(value: string) {
    return new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  }

  return (
    <>
      <div className="border-b border-white/10 bg-black/20 px-5 py-2">
        <p className="text-xs text-white/45">
          <span className="font-bold text-emerald-400">
            {onlineUsers.length} online
          </span>

          {onlineUsers.length > 0 && (
            <span> · {onlineUsers.join(", ")}</span>
          )}
        </p>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-5">
        {loading && (
          <p className="text-sm text-white/40">Loading live messages…</p>
        )}

        {!loading && messages.length === 0 && (
          <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-5">
            <p className="font-black text-yellow-300">
              Welcome to the {title}
            </p>
            <p className="mt-1 text-sm text-white/55">
              Be the first person to start the conversation.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-yellow-400 font-black text-black">
              {msg.username.slice(0, 1).toUpperCase()}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <p className="font-black text-yellow-300">
                  {msg.username}
                </p>

                <span className="text-xs text-white/30">
                  {formatTime(msg.created_at)}
                </span>
              </div>

              <p className="mt-1 max-w-3xl whitespace-pre-wrap break-words text-sm leading-6 text-white/75">
                {msg.message}
              </p>
            </div>
          </div>
        ))}

        <div ref={endRef} />
      </div>

      <div className="min-h-6 px-5 text-xs text-white/40">
        {typingUsers.length > 0 && (
          <span>
            {typingUsers.join(", ")}{" "}
            {typingUsers.length === 1 ? "is" : "are"} typing…
          </span>
        )}
      </div>

      <form
        onSubmit={sendMessage}
        className="border-t border-white/10 bg-[#111722] p-4"
      >
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/35 px-4 py-3">
          <input
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={`Message #general in ${title}`}
            maxLength={500}
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35"
          />

          <button
            type="submit"
            disabled={sending || !text.trim()}
            className="rounded-xl bg-yellow-400 px-4 py-2 text-sm font-black text-black hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending ? "Sending…" : "Send"}
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="text-xs text-white/30">
            Live room · Messages are saved securely
          </p>

          <p className="text-xs text-white/30">
            {text.length}/500
          </p>
        </div>

        {error && (
          <p className="mt-2 text-sm font-bold text-red-300">
            {error}
          </p>
        )}
      </form>
    </>
  );
}