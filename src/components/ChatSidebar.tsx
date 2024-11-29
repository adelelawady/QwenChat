import React from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { MessageSquare, Plus, Trash, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatSidebarProps {
  chats: Array<{
    id: string;
    title: string;
    updated_at: string;
  }>;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  currentChatId: string | null;
}

const ChatSidebar = ({ chats, onSelectChat, onNewChat, onDeleteChat, currentChatId }: ChatSidebarProps) => {
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
            <div
              key={chat.id}
              className="group relative"
            >
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 hover:bg-zinc-700/50 pr-12",
                  chat.id === currentChatId
                    ? "bg-zinc-700/50 text-white"
                    : "text-zinc-300"
                )}
                onClick={() => onSelectChat(chat.id)}
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span className="truncate">{chat.title}</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
              >
                <Trash2 className="w-4 h-4 text-zinc-400 hover:text-zinc-200" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatSidebar;