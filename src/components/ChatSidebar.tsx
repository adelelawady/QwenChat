import React from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { MessageSquare, Plus, Trash } from "lucide-react";
import { cn } from "@/lib/utils";

interface Chat {
  id: string;
  title: string;
}

interface ChatSidebarProps {
  chats: Chat[];
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  currentChatId: string | null;
}

const ChatSidebar = ({ chats, onSelectChat, onNewChat, currentChatId }: ChatSidebarProps) => {
  return (
    <div className="h-full bg-[#202123] flex flex-col">
      <div className="p-2">
        <Button
          onClick={onNewChat}
          className="w-full justify-start gap-2 bg-transparent hover:bg-zinc-700/50 text-white border border-zinc-700"
          variant="outline"
        >
          <Plus className="w-4 h-4" />
          New chat
        </Button>
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1">
          {chats.map((chat) => (
            <Button
              key={chat.id}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2 hover:bg-zinc-700/50",
                chat.id === currentChatId
                  ? "bg-zinc-700/50 text-white"
                  : "text-zinc-300"
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