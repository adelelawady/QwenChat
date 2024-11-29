from fastapi import FastAPI, WebSocket, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langchain_core.messages import HumanMessage, AIMessage
import asyncio
from chat_with_qwen import create_chat_chain
from chat_history import ChatHistory
from typing import Dict
import json

app = FastAPI()

# Update CORS middleware with all development ports
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:8080",
        "http://localhost:8081",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8080",
        "http://127.0.0.1:8081",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize chat history
chat_history = ChatHistory()

# Store active connections
connections: Dict[str, WebSocket] = {}

# REST endpoints for chat history
@app.get("/api/chats")
async def get_chats():
    return chat_history.get_all_chats()

@app.get("/api/chats/{chat_id}")
async def get_chat(chat_id: str):
    chat = chat_history.get_chat(chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return chat

@app.post("/api/chats")
async def create_chat():
    return chat_history.create_chat()

@app.delete("/api/chats/{chat_id}")
async def delete_chat(chat_id: str):
    success = chat_history.delete_chat(chat_id)
    if not success:
        raise HTTPException(status_code=404, detail="Chat not found")
    return {"success": True}

@app.websocket("/ws/chat/{chat_id}")
async def websocket_endpoint(websocket: WebSocket, chat_id: str):
    await websocket.accept()
    
    # Get or create chat
    chat = chat_history.get_chat(chat_id)
    if not chat:
        chat = chat_history.create_chat()
        chat_id = chat["id"]
    
    # Initialize chat chain
    chain = await create_chat_chain()
    connections[chat_id] = websocket
    
    try:
        while True:
            # Receive message from client
            message = await websocket.receive_text()
            
            # Add user message to history
            chat_history.add_message(chat_id, "user", message)
            
            # Get response
            response_text = ""
            buffer = ""
            
            # Convert chat messages to LangChain format
            history = []
            for msg in chat["messages"]:
                if msg["role"] == "user":
                    history.append(HumanMessage(content=msg["content"]))
                else:
                    history.append(AIMessage(content=msg["content"]))
            
            async for chunk in chain.astream({
                "input": message,
                "history": history
            }):
                if chunk:
                    chunk_text = str(chunk)
                    buffer += chunk_text
                    
                    # Send complete lines when we have them
                    if '\n' in buffer:
                        lines = buffer.split('\n')
                        buffer = lines[-1]  # Keep the incomplete line
                        
                        for line in lines[:-1]:
                            await websocket.send_text(line + '\n')
                            await asyncio.sleep(0.02)
                    
                    response_text += chunk_text
            
            # Send any remaining text in the buffer
            if buffer:
                await websocket.send_text(buffer)
            
            # Add AI response to history
            chat_history.add_message(chat_id, "assistant", response_text)
            
            # Send end marker
            await websocket.send_text("[END]")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if chat_id in connections:
            del connections[chat_id] 