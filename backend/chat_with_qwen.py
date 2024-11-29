from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.llms.ollama import Ollama
from langchain_core.messages import HumanMessage, AIMessage
import textwrap
import sys

async def create_chat_chain():
    """
    Create a LangChain chat chain with the Qwen model
    """
    # Create the chat template with history and file analysis instructions
    template = ChatPromptTemplate.from_messages([
        MessagesPlaceholder(variable_name="history"),
        ("system", """You are a helpful AI assistant that can analyze files and code. 
        When a user sends a file:
        1. If it's code, analyze its structure, purpose, and potential improvements
        2. If it's text, summarize the content and key points
        3. Provide relevant suggestions and explanations
        4. If there are any issues or errors, point them out
        5. Answer any specific questions about the file content"""),
        ("human", "{input}")
    ])
    
    # Initialize the Ollama model with appropriate settings
    model = Ollama(
        model="qwen2.5-coder:0.5b",
        base_url="http://localhost:11434",
        temperature=0.7,  # Add some creativity for analysis
    )
    
    # Create the chain
    chain = template | model
    
    return chain

# Remove the main() function since we'll be using the WebSocket interface 