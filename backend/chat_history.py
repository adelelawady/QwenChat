import json
from datetime import datetime
from typing import List, Dict, Optional
import os

HISTORY_FILE = "chat_history.json"

class ChatHistory:
    def __init__(self):
        self.history_file = HISTORY_FILE
        self.chats: Dict[str, Dict] = self._load_history()

    def _load_history(self) -> Dict:
        if os.path.exists(self.history_file):
            try:
                with open(self.history_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except json.JSONDecodeError:
                return {}
        return {}

    def _save_history(self):
        with open(self.history_file, 'w', encoding='utf-8') as f:
            json.dump(self.chats, f, ensure_ascii=False, indent=2)

    def create_chat(self, title: str = "New Chat") -> Dict:
        chat_id = str(int(datetime.now().timestamp() * 1000))
        chat = {
            "id": chat_id,
            "title": title,
            "messages": [],
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
        self.chats[chat_id] = chat
        self._save_history()
        return chat

    def get_chat(self, chat_id: str) -> Optional[Dict]:
        return self.chats.get(chat_id)

    def get_all_chats(self) -> List[Dict]:
        return sorted(
            self.chats.values(),
            key=lambda x: x['updated_at'],
            reverse=True
        )

    def add_message(self, chat_id: str, role: str, content: str):
        if chat_id in self.chats:
            message = {
                "role": role,
                "content": content,
                "timestamp": datetime.now().isoformat()
            }
            self.chats[chat_id]["messages"].append(message)
            self.chats[chat_id]["updated_at"] = datetime.now().isoformat()
            
            # Update title from first user message if it's "New Chat"
            if (self.chats[chat_id]["title"] == "New Chat" and 
                role == "user" and 
                len(self.chats[chat_id]["messages"]) == 1):
                self.chats[chat_id]["title"] = content[:30] + "..." if len(content) > 30 else content
            
            self._save_history()
            return message
        return None

    def delete_chat(self, chat_id: str) -> bool:
        if chat_id in self.chats:
            del self.chats[chat_id]
            self._save_history()
            return True
        return False 

    def get_chat_messages(self, chat_id: str) -> List[Dict]:
        chat = self.get_chat(chat_id)
        if chat:
            return chat["messages"]
        return [] 