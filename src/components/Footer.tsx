import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import ReactMarkdown from 'react-markdown';

const privacyContent = `
# Privacy Policy

Last updated: February 2024

## Introduction

This Privacy Policy describes how Chat with Qwen-Coder ("we", "us", or "our") collects, uses, and shares your information when you use our service.

## Information We Collect

### Chat History
- Chat messages and conversations
- Uploaded files and their contents
- User session information

### Technical Information
- Browser type and version
- Operating system
- IP address
- Access timestamps

## How We Use Information

We use the collected information to:
- Provide chat functionality with Qwen-Coder
- Analyze and process uploaded files
- Improve our services
- Maintain chat history

## Data Storage

- Chat history is stored locally
- Uploaded files are temporarily stored for processing
- No personal information is shared with third parties

## Data Security

We implement security measures to protect your information:
- Secure file handling
- Local storage of chat history
- Temporary file storage with automatic cleanup

## Your Rights

You have the right to:
- Delete your chat history
- Remove uploaded files
- Clear all stored data

## Contact

For any questions about this Privacy Policy, please contact:
Adel Elawady
`;

const termsContent = `
# Terms of Service

Last updated: February 2024

## Agreement to Terms

By accessing and using Chat with Qwen-Coder, you agree to these Terms of Service.

## Acceptable Use

You agree not to:
- Upload malicious files
- Share inappropriate content
- Attempt to compromise the system
- Use the service for illegal purposes

## Intellectual Property

- The service and its original content are protected by copyright
- User-uploaded content remains the property of the user
- Generated responses are provided under MIT license

## Limitations

- The service is provided "as is"
- We do not guarantee continuous availability
- File processing capabilities may be limited
- Response accuracy is not guaranteed

## User Responsibilities

Users are responsible for:
- Content of uploaded files
- Appropriate use of the chat system
- Maintaining security of their sessions

## Disclaimer

We are not liable for:
- Accuracy of AI responses
- Loss of data or files
- Service interruptions
- Third-party content

## Contact

For questions about these Terms, contact:
Adel Elawady
`;

export const Footer = () => {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  return (
    <footer className="bg-[#1A1B26] border-t border-zinc-700/50 p-2">
      <div className="max-w-3xl mx-auto flex justify-center gap-4 text-sm text-zinc-400">
        <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
          <DialogTrigger asChild>
            <button className="hover:text-zinc-200 transition-colors">
              Privacy Policy
            </button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Privacy Policy</DialogTitle>
            </DialogHeader>
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown>
                {privacyContent}
              </ReactMarkdown>
            </div>
          </DialogContent>
        </Dialog>

        <span>•</span>

        <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
          <DialogTrigger asChild>
            <button className="hover:text-zinc-200 transition-colors">
              Terms of Service
            </button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Terms of Service</DialogTitle>
            </DialogHeader>
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown>
                {termsContent}
              </ReactMarkdown>
            </div>
          </DialogContent>
        </Dialog>

        <span>•</span>

        <a
          href="https://github.com/adelelawady"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-zinc-200 transition-colors"
        >
          © 2024 Adel Elawady
        </a>
      </div>
    </footer>
  );
}; 