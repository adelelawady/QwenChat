import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import ChatSidebar from "@/components/ChatSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
}

// Extract chat logic to reduce file size
const useChat = () => {
  const [chats, setChats] = useState<Chat[]>([
    { id: "1", title: "New Chat", messages: [] },
  ]);
  const [currentChatId, setCurrentChatId] = useState("1");
  const [isTyping, setIsTyping] = useState(false);

  return {
    chats,
    setChats,
    currentChatId,
    setCurrentChatId,
    isTyping,
    setIsTyping,
  };
};

const Index = () => {
  const { chats, setChats, currentChatId, setCurrentChatId, isTyping, setIsTyping } = useChat();
  const { toast } = useToast();

  const currentChat = chats.find((chat) => chat.id === currentChatId);

  const simulateResponse = async (message: string) => {
    setIsTyping(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const response = `I received your message: "${message}"\n\nHere's a **markdown** formatted response:\n- Point 1\n- Point 2\n\n*Italic* and **bold** text are supported.`;
    
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                { id: uuidv4(), content: response, isUser: false },
              ],
            }
          : chat
      )
    );
    setIsTyping(false);
  };

  const handleSend = async (message: string) => {
    const newMessage = { id: uuidv4(), content: message, isUser: true };
    
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId
          ? {
              ...chat,
              title: message.slice(0, 20) + "...",
              messages: [...chat.messages, newMessage],
            }
          : chat
      )
    );

    await simulateResponse(message);
  };

  const handleNewChat = () => {
    const newChat = {
      id: uuidv4(),
      title: "New Chat",
      messages: [],
    };
    setChats((prev) => [...prev, newChat]);
    setCurrentChatId(newChat.id);
    toast({
      title: "New chat created",
      description: "Start typing to begin the conversation",
    });
  };

  return (
    <div className="flex h-screen bg-chat-background text-foreground">
      <ChatSidebar
        chats={chats.map((chat) => ({
          ...chat,
          active: chat.id === currentChatId,
        }))}
        onSelectChat={setCurrentChatId}
        onNewChat={handleNewChat}
      />
      <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 p-4">
          {currentChat?.messages.map((message) => (
            <ChatMessage
              key={message.id}
              content={message.content}
              isUser={message.isUser}
            />
          ))}
          {isTyping && (
            <ChatMessage content="" isUser={false} isTyping />
          )}
        </ScrollArea>
        <ChatInput onSend={handleSend} disabled={isTyping} />
      </div>
    </div>
  );
};

export default Index;