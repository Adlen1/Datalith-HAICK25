from dotenv import load_dotenv
import os

from agno.models.groq import Groq
from agno.agent import Agent

load_dotenv()

# 🔁 Remplace ici par un modèle valide
model = Groq("deepseek-r1-distill-llama-70b", api_key=os.environ["GROQ_API_KEY"])

agent = Agent(
    model=model,
    system_message="Tu es un assistant utile pour aider les utilisateurs du site bancaire.",
    tools=[],
)

def ask_assistant(message: str) -> str:
    response = agent.run(message)
    return response.messages[-1].content  # Dernier message = réponse de l’assistant

