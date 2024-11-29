# Chat with Qwen-Coder

A real-time chat application that allows users to interact with Qwen-Coder AI model, featuring file upload capabilities and chat history. Built with React, FastAPI, and Ollama.

## Features

- Real-time chat with Qwen-Coder
- File upload and analysis
- Chat history persistence
- Code syntax highlighting
- Markdown support
- File content analysis
- Modern UI inspired by ChatGPT

## Prerequisites

- Node.js (v16 or higher)
- Python (3.8 or higher)
- Ollama installed on your system


### Installing Ollama and Qwen-Coder

1. Install Ollama:

    **On macOS or Linux:**
    ```bash
    curl -fsSL https://ollama.com/install.sh | sh
    ```

    **On Windows:**
    - Download and install from [Ollama Windows](https://ollama.com/download/windows)
    - Make sure Windows Subsystem for Linux (WSL) is installed
    - Follow the installation wizard instructions

2. Start Ollama service:
    ```bash
    ollama serve
    ```

3. Pull the Qwen-Coder model (in a new terminal):
    ```bash
    # Pull the smallest version (recommended for most users)
    ollama pull qwen2.5-coder:0.5b
    ```

    The download might take a few minutes depending on your internet connection. You'll see a progress bar like this:
    ```
    pulling manifest... done
    pulling 6c91e4... done
    pulling 4c915e... done
    verifying sha256 digest... done
    ```

4. Test the model installation:
    ```bash
    ollama run qwen2.5-coder:0.5b "Hello, are you ready?"
    ```
    You should get a response from the model.

**Troubleshooting Ollama Installation:**

- If you get permission errors on Linux:
    ```bash
    sudo chmod +x /usr/local/bin/ollama
    ```

- If Ollama service fails to start:
    ```bash
    # Check if the service is running
    ps aux | grep ollama
    
    # Restart the service
    killall ollama
    ollama serve
    ```


## Installation

### Backend Setup

1. Create a Python virtual environment:

    ```
    python -m venv venv
    source venv/bin/activate # On Windows: venv\Scripts\activate
    ```

2. Install Python dependencies:
    ```
    pip install fastapi uvicorn langchain langchain-community python-multipart
    ```

3. Create required directories:
    ```
    mkdir uploads
    ```

### Frontend Setup

1. Install Node.js dependencies:
    ```
    npm install
    ```

Required dependencies include:
- @tanstack/react-query
- axios
- react-markdown
- react-syntax-highlighter
- lucide-react
- tailwindcss
- @tailwindcss/typography
- shadcn/ui components

## Running the Application

1. Start Ollama (if not already running):
    ```
    ollama start
    ```

2. Start the backend server (from the project root):
    ```
    uvicorn backend.server:app --reload
    ```

3. Start the frontend development server (in a new terminal):
    ```
    npm run dev
    ```

4. Open your browser and navigate to:
    ```
    http://localhost:5173
    ```


## Project Structure

```
    project/
├── backend/
│ ├── init.py
│ ├── server.py # FastAPI server
│ ├── chat_with_qwen.py # Qwen integration
│ └── chat_history.py # Chat history management
├── src/
│ ├── components/ # React components
│ │ ├── Chat.tsx
│ │ ├── ChatInput.tsx
│ │ ├── ChatMessage.tsx
│ │ ├── ChatSidebar.tsx
│ │ └── FileUpload.tsx
│ └── pages/
│ └── Index.tsx
└── uploads/ # Uploaded files directory
```


## Qwen-Coder Models

Available models through Ollama:


| Model | Size | RAM Required | Performance |
|-------|------|--------------|-------------|
| qwen2.5-coder:0.5b | 500MB | 2GB | Fast, good for basic tasks |
| qwen2.5-coder:1.8b | 1.8GB | 4GB | Better comprehension |
| qwen2.5-coder:3b | 3GB | 8GB | Best quality, slower |


To change models, update the model name in `backend/chat_with_qwen.py`:
```
model = Ollama(
    model="qwen2.5-coder:0.5b",
    base_url="http://localhost:11434",
    temperature=0.7,  # Add some creativity for analysis
)
```


## Features in Detail

### File Upload
- Supports text files, code files, and other formats
- Automatic content extraction
- File content analysis by Qwen-Coder

### Chat Interface
- Real-time message streaming
- Code syntax highlighting
- Markdown rendering
- File upload indicator
- Typing indicators

### Chat History
- Persistent chat storage
- Multiple chat sessions
- Chat title generation
- Delete chat functionality

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.