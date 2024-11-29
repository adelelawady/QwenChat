import React from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { MessageSquare, Plus } from "lucide-react";

interface Chat {
  id: string;
  title: string;
  active?: boolean;
}

interface ChatSidebarProps {
  chats: Chat[];
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
}

const ChatSidebar = ({ chats, onSelectChat, onNewChat }: ChatSidebarProps) => {
  return (
    <div className="w-64 border-r border-chat-border bg-chat-sidebar flex flex-col h-screen">
      <div className="p-4">
        <Button
          onClick={onNewChat}
          className="w-full justify-start gap-2 bg-chat-accent hover:bg-chat-accent/90 text-white"
          variant="default"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {chats.map((chat) => (
            <Button
              key={chat.id}
              variant={chat.active ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-2 transition-colors",
                chat.active
                  ? "bg-chat-hover text-white"
                  : "text-gray-300 hover:bg-chat-hover/50"
              )}
              onClick={() => onSelectChat(chat.id)}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="truncate">{chat.title}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatSidebar;