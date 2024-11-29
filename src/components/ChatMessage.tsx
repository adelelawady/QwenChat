import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "./ui/card";
import { User, Bot } from "lucide-react";

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  isTyping?: boolean;
}

const ChatMessage = ({ content, isUser, isTyping = false }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex gap-4 p-4 transition-colors duration-200",
        isUser ? "bg-chat-message-user" : "bg-chat-message-bot"
      )}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center",
          isUser ? "bg-chat-accent" : "bg-primary"
        )}
      >
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>
      <Card
        className={cn(
          "flex-1 p-4 glass border-chat-border",
          isTyping && "animate-pulse"
        )}
      >
        {isTyping ? (
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-100" />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-200" />
          </div>
        ) : (
          <p className="text-foreground whitespace-pre-wrap">{content}</p>
        )}
      </Card>
    </div>
  );
};

export default ChatMessage;