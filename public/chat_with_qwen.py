from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.llms import Ollama
from langchain_core.messages import HumanMessage, AIMessage
import textwrap
import sys

def create_chat_chain():
    """
    Create a LangChain chat chain with the Qwen model
    """
    # Create the chat template with history
    template = ChatPromptTemplate.from_messages([
        MessagesPlaceholder(variable_name="history"),
        ("human", "{input}")
    ])
    
    # Initialize the updated Ollama model without streaming
    model = Ollama(
        model="qwen2.5-coder:3b"
    )
    
    # Create the chain
    chain = template | model
    
    return chain

def print_streaming(text):
    """Print text with streaming effect"""
    sys.stdout.write(text)
    sys.stdout.flush()

def main():
    print("Chat with Qwen 2.5 Coder (Type 'quit' to exit)")
    print("-" * 50)
    
    # Create the chat chain
    chain = create_chat_chain()
    
    # Initialize chat history
    chat_history = []
    
    while True:
        # Get user input
        user_input = input("\nYou: ").strip()
        
        # Check if user wants to quit
        if user_input.lower() in ['quit', 'exit']:
            print("\nGoodbye!")
            break
        
        # Get response from the model
        if user_input:
            print("\nQwen:", end=" ")
            
            # Add user message to history
            chat_history.append(HumanMessage(content=user_input))
            
            # Stream the response
            response_text = ""
            for chunk in chain.stream({
                "input": user_input,
                "history": chat_history
            }):
                print_streaming(chunk)
                response_text += chunk
            
            # Add AI response to history
            chat_history.append(AIMessage(content=response_text))
            print()  # New line after response

if __name__ == "__main__":
    main() 