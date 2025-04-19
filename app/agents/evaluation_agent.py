from agents import Agent
from pydantic import BaseModel

from app.agents.tools.context import skill
from app.agents.tools.extract_star import extract_star


class STAROutput(BaseModel):
    Skill: str
    Situation: str
    Task: str
    Action: str
    Result: str
    Conclusion: str

def create_evaluation_agent(system_prompt: str) -> Agent:
    return Agent(
        name="Evaluation Agent",
        handoff_description="Оценка сообщений с использованием метода STAR.",
        instructions=system_prompt,
        tools=[extract_star, skill],
        output_type=STAROutput
    )