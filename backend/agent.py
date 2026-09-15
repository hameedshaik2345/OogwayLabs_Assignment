import os
import glob
import logging
from langchain_community.llms import Ollama
from langchain_community.chat_models import ChatOllama
from langchain_anthropic import ChatAnthropic
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage

logger = logging.getLogger(__name__)

def load_transcripts():
    """Simulate RAG by loading local transcripts."""
    transcripts_text = ""
    # Look for any markdown or text files in the data/transcripts folder
    search_path = os.path.join(os.path.dirname(__file__), "data", "transcripts", "*.md")
    for filepath in glob.glob(search_path):
        filename = os.path.basename(filepath)
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                transcripts_text += f"\n--- Source: {filename} ---\n"
                transcripts_text += f.read()
        except Exception as e:
            logger.error(f"Failed to read transcript {filepath}: {e}")
    return transcripts_text

def get_llm_response(messages: list, provider: str = "local"):
    logger.info(f"Routing request to LLM provider: {provider}")
    
    # 1. Load Knowledge Base (RAG Simulation)
    context = load_transcripts()
    
    # 2. Define the Ship 30 for 30 Skill and System Instructions
    system_instruction = f"""You are The Lenny Growth Assistant. 
Your primary job is to answer product and growth questions based EXCLUSIVELY on the provided podcast transcripts. 
You MUST cite the source (e.g. "[Source: ep14_mock.md]") when providing an answer. If the transcripts do not contain the answer, acknowledge that you don't know based on the provided material.

KNOWLEDGE BASE:
{context}

SKILL - SHIP 30 FOR 30 ESSAY:
If the user explicitly asks for a "Ship 30 for 30" essay, you must activate this skill. The essay must adhere to these writing principles:
- Start with a strong hook and clear narrative progression.
- Use skimmable formatting (headings, bullets, selective bold emphasis).
- Provide a specific, useful takeaway.
- Ground ALL claims in the transcript knowledge base, citing the source at the end.
- Keep it concise, engaging, and around 200-300 words for this demo.

SKILL - ARTIFACT GENERATION:
If the user asks for code, Markdown documents, or HTML/CSS snippets, output them strictly inside standard markdown code blocks (e.g. ```html ... ```). Ensure HTML is self-contained.
"""

    system_prompt = SystemMessage(content=system_instruction)
    
    formatted_messages = [system_prompt]
    for msg in messages:
        if msg["role"] == "user":
            formatted_messages.append(HumanMessage(content=msg["content"]))
        elif msg["role"] == "assistant":
            formatted_messages.append(AIMessage(content=msg["content"]))
            
    try:
        if provider == "cloud":
            anthropic_api_key = os.getenv("ANTHROPIC_API_KEY")
            if not anthropic_api_key:
                logger.warning("ANTHROPIC_API_KEY is not set.")
                return "Error: ANTHROPIC_API_KEY is not set in environment variables."
            llm = ChatAnthropic(model="claude-3-haiku-20240307", api_key=anthropic_api_key)
            response = llm.invoke(formatted_messages)
            return response.content
        else:
            local_model = os.getenv("LOCAL_MODEL", "llama3")
            chat_llm = ChatOllama(model=local_model)
            response = chat_llm.invoke(formatted_messages)
            return response.content
            
    except Exception as e:
        logger.error(f"LLM Error ({provider}): {str(e)}")
        return f"Error connecting to {provider.upper()} LLM: {str(e)}. (Check logs for details)"
