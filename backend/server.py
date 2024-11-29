from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from langchain_core.messages import HumanMessage, AIMessage
import asyncio
from chat_with_qwen import create_chat_chain
import re

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store active connections and their chat histories
connections = {}

def format_code_blocks(text: str) -> str:
    """Format code blocks with proper markdown syntax"""
    # Replace triple backticks with proper markdown code blocks
   # text = re.sub(r'```(\w+)?\n(.*?)```', r'```\1\n\2\n```', text, flags=re.DOTALL)
    
    # Preserve whitespace in code blocks
   # text = re.sub(r'(```.*?\n)(.*?)(```)', 
   #              lambda m: f'{m.group(1)}{m.group(2).rstrip()}\n{m.group(3)}', 
   #              text, flags=re.DOTALL)
    
    # Ensure proper line breaks
   # text = text.replace('\n', '\\n')
    return text

@app.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    # Initialize chat for this connection
    chain = await create_chat_chain()
    chat_history = []
    connections[websocket] = chat_history
    
    try:
        while True:
            # Receive message from client
            message = await websocket.receive_text()
            
            # Add user message to history
            chat_history.append(HumanMessage(content=message))
            
            # Get response
            response_text = ""
            buffer = ""
            
            async for chunk in chain.astream({
                "input": message,
                "history": chat_history
            }):
                if chunk:
                    chunk_text = str(chunk)
                    buffer += chunk_text
                    
                    # Send complete lines when we have them
                    if '\n' in buffer:
                        lines = buffer.split('\n')
                        buffer = lines[-1]  # Keep the incomplete line
                        
                        for line in lines[:-1]:
                            formatted_line = format_code_blocks(line + '\n')
                            await websocket.send_text(formatted_line)
                            await asyncio.sleep(0.02)  # Smaller delay for smoother output
                    
                    response_text += chunk_text
            
            # Send any remaining text in the buffer
            if buffer:
                formatted_buffer = format_code_blocks(buffer)
                await websocket.send_text(formatted_buffer)
            
            # Format the final response for history
            final_response = response_text
            chat_history.append(AIMessage(content=final_response))
            
            # Send end marker
            await websocket.send_text("[END]")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if websocket in connections:
            del connections[websocket] 