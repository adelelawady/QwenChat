import React from "react";
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Components } from 'react-markdown';
import { Copy, Check } from 'lucide-react';
import { Button } from "./ui/button";
import { useState } from "react";

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  isTyping?: boolean;
}

const ChatMessage = ({ content, isUser, isTyping = false }: ChatMessageProps) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const markdownComponents: Components = {
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const isInline = !match;
      const code = String(children).replace(/\n$/, '');

      return isInline ? (
        <code {...props} className="bg-[#1A1B26] rounded px-1.5 py-0.5 text-sm">
          {children}
        </code>
      ) : (
        <div className="not-prose rounded-md my-3 relative group">
          <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 bg-zinc-700/50 hover:bg-zinc-700"
              onClick={() => handleCopyCode(code)}
            >
              {copiedCode === code ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <SyntaxHighlighter
            style={oneDark}
            language={match[1]}
            PreTag="div"
            className="!bg-[#1A1B26] !rounded-md"
            showLineNumbers={true}
            customStyle={{
              margin: 0,
              background: '#1A1B26',
              padding: '1rem',
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      );
    },
    p: ({ children }) => (
      <p className="mb-4 last:mb-0 whitespace-pre-line">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="mb-4 list-disc pl-4 last:mb-0">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-4 list-decimal pl-4 last:mb-0">{children}</ol>
    ),
    li: ({ children }) => (
      <li className="mb-1 last:mb-0">{children}</li>
    ),
    pre: ({ children }) => (
      <div className="not-prose">{children}</div>
    ),
  };

  // Clean up extra spaces and newlines while preserving code blocks
  const formatContent = (text: string) => {
    return text
      .replace(/\\n/g, '\n')
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Replace multiple newlines with double newline
      .trim();
  };

  return (
    <div className={cn(
      "border-b border-zinc-700/50",
      isUser ? "bg-[#343541]" : "bg-[#444654]",
    )}>
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="flex gap-4 items-start">
          <div className={cn(
            "w-8 h-8 rounded-sm flex items-center justify-center shrink-0 text-white",
            isUser ? "bg-[#5436DA]" : "bg-[#11A37F]"
          )}>
            {isUser ? "U" : "A"}
          </div>
          <div className="flex-1 min-w-0">
            {isTyping ? (
              <div className="flex space-x-2 h-6 items-center">
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"></div>
              </div>
            ) : (
              <ReactMarkdown
                className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:p-0"
                components={markdownComponents}
              >
                {formatContent(content)}
              </ReactMarkdown>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;