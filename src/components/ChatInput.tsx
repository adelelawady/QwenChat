import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Send, Paperclip } from "lucide-react";
import { FileUpload } from "./FileUpload";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";

interface ChatInputProps {
  onSend: (fullMessage: string, visibleMessage?: string) => void;
  disabled?: boolean;
}

interface FileInfo {
  filename: string;
  path: string;
  content: string;
  type: string;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<FileInfo | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || uploadedFile) {
      let visibleMessage = message;
      let fullMessage = message;

      // If there's an uploaded file, prepare both visible and full messages
      if (uploadedFile) {
        visibleMessage = message.trim() 
          ? `${message}\n\nI'm sending you a file: ${uploadedFile.filename}`
          : `I'm sending you a file: ${uploadedFile.filename}`;
        
        fullMessage = `${visibleMessage}\n\nFile content:\n${uploadedFile.content}\n\nPlease analyze this file and provide relevant information or help me understand its contents.`;
        setUploadedFile(null); // Clear the uploaded file after sending
      }

      // Send the full message to the backend but display only the visible part
      onSend(fullMessage, visibleMessage);
      setMessage("");
    }
  };

  const handleFileUpload = (fileInfo: FileInfo) => {
    setIsUploadOpen(false);
    setUploadedFile(fileInfo);
  };

  return (
    <div className="bg-[#343541] p-4">
      <div className="max-w-3xl mx-auto">
        {uploadedFile && (
          <div className="mb-2 p-2 bg-zinc-800/50 rounded-md flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-zinc-400" />
            <span className="text-sm text-zinc-400">
              File ready to send: {uploadedFile.filename}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto h-6"
              onClick={() => setUploadedFile(null)}
            >
              Remove
            </Button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="relative flex gap-2">
          <Popover open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-10 w-10 shrink-0"
                disabled={disabled}
              >
                <Paperclip className="w-5 h-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-3" align="start">
              <FileUpload onUploadComplete={handleFileUpload} />
            </PopoverContent>
          </Popover>

          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={uploadedFile ? "Add a message (optional) and press send" : "Send a message..."}
            className="flex-1 pr-12 bg-[#40414F] border-zinc-700 focus-visible:ring-zinc-600 text-white"
            disabled={disabled}
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={disabled || (!message.trim() && !uploadedFile)}
            className="h-10 w-10 bg-[#11A37F] hover:bg-[#11A37F]/90 disabled:bg-zinc-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;