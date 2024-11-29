from fastapi import FastAPI, WebSocket, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from langchain_core.messages import HumanMessage, AIMessage
import asyncio
from chat_with_qwen import create_chat_chain
from chat_history import ChatHistory
from typing import Dict
import json
import os
from pathlib import Path
from fastapi.staticfiles import StaticFiles
import mimetypes
import base64

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

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Mount the uploads directory for static file serving
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

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
            
            # Check if this is a file analysis request
            is_file_message = "I'm sending you a file:" in message
            
            # Add user message to history
            chat_history.add_message(chat_id, "user", message)
            
            # If it's a file message, add analysis instructions
            if is_file_message:
                # Extract file content from the message
                file_content_start = message.find("File content:")
                if file_content_start != -1:
                    file_content = message[file_content_start:]
                    message = f"""Please analyze this file:
                    {message}
                    
                    Provide a detailed analysis including:
                    1. File type and purpose
                    2. Code structure and functionality (if it's code)
                    3. Key points and important information
                    4. Potential improvements or issues
                    5. Any relevant suggestions
                    """
            
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


# Update the upload endpoint to handle file content
@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        file_path = UPLOAD_DIR / file.filename
        content = await file.read()
        
        # Save the file
        with open(file_path, "wb") as f:
            f.write(content)
            
        # Read file content based on type
        mime_type = mimetypes.guess_type(file.filename)[0]
        file_content = ""
        
        if mime_type and mime_type.startswith('text/'):
            file_content = content.decode('utf-8')
        elif mime_type and mime_type.startswith('image/'):
            file_content = f"[Image file: {file.filename}]"
        else:
            file_content = f"[File: {file.filename}]"
        
        # Return file info and content
        return {
            "filename": file.filename,
            "size": len(content),
            "path": f"/uploads/{file.filename}",
            "content": file_content,
            "type": mime_type or "application/octet-stream"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 