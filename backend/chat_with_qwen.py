from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.llms import Ollama
from langchain_core.messages import HumanMessage, AIMessage
import textwrap
import sys

async def create_chat_chain():
    """
    Create a LangChain chat chain with the Qwen model
    """
    # Create the chat template with history
    template = ChatPromptTemplate.from_messages([
        MessagesPlaceholder(variable_name="history"),
        ("human", "{input}")
    ])
    
    # Initialize the Ollama model
    model = Ollama(
        model="qwen2.5-coder:3b"
    )
    
    # Create the chain
    chain = template | model
    
    return chain

# Remove the main() function since we'll be using the WebSocket interface 