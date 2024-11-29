import { useState, useEffect, useRef } from 'react';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import ChatSidebar from './ChatSidebar';
import { PanelLeftIcon, PanelRightIcon } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Footer } from './Footer';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatHistoryItem {
  id: string;
  title: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
}

interface ChatProps {
  // ... other interfaces ...
}

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Fetch chat history
  const { data: chatHistory = [] } = useQuery<ChatHistoryItem[]>({
    queryKey: ['chats'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:8000/api/chats');
      return response.data;
    }
  });

  // Create new chat mutation
  const createChatMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post('http://localhost:8000/api/chats');
      return response.data;
    },
    onSuccess: (newChat) => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      setCurrentChatId(newChat.id);
      setMessages([]);
    }
  });

  // Delete chat mutation
  const deleteChatMutation = useMutation({
    mutationFn: async (chatId: string) => {
      await axios.delete(`http://localhost:8000/api/chats/${chatId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      if (chatHistory.length > 0) {
        setCurrentChatId(chatHistory[0].id);
      } else {
        handleNewChat();
      }
    }
  });

  const [currentChatId, setCurrentChatId] = useState<string | null>(
    chatHistory.length > 0 ? chatHistory[0].id : null
  );

  // Load chat messages when chat is selected
  useEffect(() => {
    if (currentChatId) {
      // Load chat messages
      axios.get(`http://localhost:8000/api/chats/${currentChatId}`).then((response) => {
        const chat = response.data;
        setMessages(chat.messages);
      });

      // Setup WebSocket connection
      wsRef.current?.close();
      wsRef.current = new WebSocket(`ws://localhost:8000/ws/chat/${currentChatId}`);

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
    }
  }, [currentChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (fullMessage: string, visibleMessage?: string) => {
    if (!isConnected || isTyping) return;

    // Add the visible message to the UI
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: visibleMessage || fullMessage 
    }]);
    
    // Send the full message to the backend
    wsRef.current?.send(fullMessage);
    setIsTyping(true);
  };

  const handleNewChat = () => {
    createChatMutation.mutate();
  };

  const handleDeleteChat = (chatId: string) => {
    deleteChatMutation.mutate(chatId);
  };

  // Handle chat selection
  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    setMessages([]); // Clear messages until new ones load
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-[#343541]">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={cn(
          "transition-all duration-300 flex-shrink-0 border-r border-zinc-700/50",
          isSidebarOpen ? "w-64" : "w-0"
        )}>
          <div className="h-full overflow-hidden">
            <ChatSidebar
              chats={chatHistory}
              onSelectChat={handleSelectChat}
              onNewChat={handleNewChat}
              onDeleteChat={handleDeleteChat}
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

          {/* Input Area with Footer */}
          <div className="flex-shrink-0">
            <div className="border-t border-zinc-700/50">
              <ChatInput
                onSend={handleSendMessage}
                disabled={!isConnected || isTyping}
              />
            </div>
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}; 