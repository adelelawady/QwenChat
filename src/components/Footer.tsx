import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

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
              {/* Add privacy policy content */}
              <h2>Introduction</h2>
              <p>This Privacy Policy describes how Chat with Qwen-Coder collects, uses, and shares your information...</p>
              {/* Add more sections */}
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
              {/* Add terms of service content */}
              <h2>Agreement to Terms</h2>
              <p>By accessing and using Chat with Qwen-Coder, you agree to these Terms of Service...</p>
              {/* Add more sections */}
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