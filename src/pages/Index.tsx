import { Chat } from "@/components/Chat";

export default function Index() {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold text-center mb-8">Chat with Qwen</h1>
      <Chat />
    </div>
  );
}