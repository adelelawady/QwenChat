import { useState, useEffect, useRef } from 'react';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import ChatSidebar from './ChatSidebar';
import { PanelLeftIcon, PanelRightIcon } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
}

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    wsRef.current = new WebSocket('ws://localhost:8000/ws/chat');

    wsRef.current.onopen = () => {
      setIsConnected(true);
    };

    wsRef.current.onmessage = (event) => {
      const data = event.data;
      
      if (data === '[END]') {
        setIsTyping(false);
        return;
      }

      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];

        if (lastMessage && lastMessage.role === 'assistant') {
          lastMessage.content += data;
          return [...newMessages];
        } else {
          return [...newMessages, { role: 'assistant', content: data }];
        }
      });
    };

    wsRef.current.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      wsRef.current?.close();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (message: string) => {
    if (!isConnected || isTyping) return;

    setMessages(prev => [...prev, { role: 'user', content: message }]);
    wsRef.current?.send(message);
    setIsTyping(true);
  };

  const handleNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: []
    };
    setChats(prev => [...prev, newChat]);
    setCurrentChatId(newChat.id);
    setMessages([]);
  };

  return (
    <div className="fixed inset-0 flex bg-[#343541]">
      {/* Sidebar */}
      <div 
        className={cn(
          "transition-all duration-300 flex-shrink-0 border-r border-zinc-700/50",
          isSidebarOpen ? "w-64" : "w-0"
        )}
      >
        <div className="h-full overflow-hidden">
          <ChatSidebar
            chats={chats}
            onSelectChat={setCurrentChatId}
            onNewChat={handleNewChat}
            currentChatId={currentChatId}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Messages Container */}
        <div className="relative flex-1 overflow-hidden">
          {/* Toggle Sidebar Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 left-2 z-10 hover:bg-zinc-700/50"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <PanelLeftIcon /> : <PanelRightIcon />}
          </Button>

          {/* Messages Scroll Area */}
          <div className="absolute inset-0 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-zinc-400">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-semibold">How can I help you today?</h2>
                  <p>Start a conversation by typing a message below.</p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <ChatMessage
                    key={index}
                    content={message.content}
                    isUser={message.role === 'user'}
                  />
                ))}
                {isTyping && (
                  <ChatMessage
                    content=""
                    isUser={false}
                    isTyping={true}
                  />
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 border-t border-zinc-700/50">
          <ChatInput
            onSend={handleSendMessage}
            disabled={!isConnected || isTyping}
          />
        </div>
      </main>
    </div>
  );
}; 