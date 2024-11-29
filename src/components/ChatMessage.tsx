import React from "react";
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Components } from 'react-markdown';
import { Copy, Check, FileText } from 'lucide-react';
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

  // Check if the message contains a file upload
  const isFileUpload = content.includes("I'm sending you a file:");
  
  // Get file name for the header
  const getFileName = (content: string) => {
    if (!isFileUpload) return "";
    const filenameLine = content.split('\n').find(line => line.includes("I'm sending you a file:"));
    return filenameLine?.replace("I'm sending you a file:", "").trim() || "";
  };

  // Get user message part
  const getUserMessage = (content: string) => {
    if (!isFileUpload) return content;
    return content.split("\n\nI'm sending you a file:")[0];
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
              <>
                {isUser ? (
                  <div className="space-y-2">
                    {getUserMessage(content) && (
                      <div className="text-white">
                        {getUserMessage(content)}
                      </div>
                    )}
                    {isFileUpload && (
                      <div className="flex items-center gap-2 text-zinc-400 bg-zinc-800/50 p-2 rounded-md">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">
                          File uploaded: {getFileName(content)}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <ReactMarkdown
                    className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:p-0"
                    components={markdownComponents}
                  >
                    {content}
                  </ReactMarkdown>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;