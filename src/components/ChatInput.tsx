import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <div className="bg-[#343541] p-4">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Send a message..."
            className="w-full pr-12 bg-[#40414F] border-zinc-700 focus-visible:ring-zinc-600 text-white"
            disabled={disabled}
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={disabled || !message.trim()}
            className="absolute right-1.5 top-1.5 h-8 w-8 bg-[#11A37F] hover:bg-[#11A37F]/90 disabled:bg-zinc-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;