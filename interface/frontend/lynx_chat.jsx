import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * Chat UI for the user-facing Lynx tab.
 *
 * Props: none (reads/writes directly to /chat backend route).
 */
const LynxChat = () => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your AI health companion 🤖" },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    const prompt = input.trim();
    if (!prompt) return;
    setMessages((m) => [...m, { role: "user", content: prompt }]);
    setInput("");

    try {
      const res = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.answer }]);
    } catch (err) {
      console.error(err);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "⚠️ Sorry, something went wrong." },
      ]);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="mx-auto max-w-2xl h-[85vh] flex flex-col">
      <CardContent className="p-4 flex flex-col flex-1 overflow-hidden">
        <ScrollArea className="flex-1 pr-2">
          <div className="space-y-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-3 shadow text-sm whitespace-pre-line ${
                  m.role === "user" ? "bg-blue-100 ml-auto" : "bg-gray-100"
                }`}
              >
                {m.content}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        <div className="mt-4 flex gap-2">
          <Input
            value={input}
            onKeyDown={handleKey}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question…"
            className="flex-1"
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LynxChat;
