import React from "react";
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Components } from 'react-markdown';

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  isTyping?: boolean;
}

const ChatMessage = ({ content, isUser, isTyping = false }: ChatMessageProps) => {
  const markdownComponents: Components = {
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const isInline = !match;
      return isInline ? (
        <code {...props} className="bg-[#1A1B26] rounded px-1.5 py-0.5 text-sm">
          {children}
        </code>
      ) : (
        <div className="not-prose rounded-md my-3">
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
            {String(children).replace(/\\n/g, '\n')}
          </SyntaxHighlighter>
        </div>
      );
    },
    p: ({ children }) => (
      <p className="mb-4 last:mb-0 whitespace-pre-wrap">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="mb-4 list-disc pl-4 last:mb-0 whitespace-pre-wrap">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-4 list-decimal pl-4 last:mb-0 whitespace-pre-wrap">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="mb-1 last:mb-0 whitespace-pre-wrap">{children}</li>
    ),
    pre: ({ children }) => (
      <div className="not-prose">{children}</div>
    ),
  };

  // Replace escaped newlines with actual newlines
  const formattedContent = content.replace(/\\n/g, '\n');

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
                {formattedContent}
              </ReactMarkdown>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;