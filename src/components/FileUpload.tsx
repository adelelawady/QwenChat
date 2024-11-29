import React, { useRef, useState } from 'react';
import { Upload, X, FileText, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import axios from 'axios';

interface FileInfo {
  filename: string;
  path: string;
  content: string;
  type: string;
}

interface FileUploadProps {
  onUploadComplete: (fileInfo: FileInfo) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post<FileInfo>('http://localhost:8000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onUploadComplete(response.data);
      setSelectedFile(null);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-4 transition-colors",
          isDragging ? "border-primary" : "border-zinc-700",
          "hover:border-primary cursor-pointer"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileSelect}
        />
        <div className="flex flex-col items-center gap-2 text-zinc-400">
          <Upload className="w-8 h-8" />
          <p className="text-sm">
            {selectedFile
              ? selectedFile.name
              : "Drop a file here or click to select"}
          </p>
        </div>
      </div>

      {selectedFile && (
        <div className="mt-2 flex items-center gap-2">
          <FileText className="w-4 h-4 text-zinc-400" />
          <span className="text-sm text-zinc-400 flex-1 truncate">
            {selectedFile.name}
          </span>
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-2"
                onClick={() => setSelectedFile(null)}
              >
                <X className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                className="h-8"
                onClick={handleUpload}
              >
                Upload
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}; 