from agents import Agent
from app.agents.tools.extract_situation import extract_situation
from app.agents.tools.extract_task import extract_task
from app.agents.tools.extract_action import extract_action
from app.agents.tools.extract_result import extract_result
from app.agents.tools.extract_smart import extract_star_element
from pydantic import BaseModel


class STAROutput(BaseModel):
    Situation: str
    Task: str
    Action: str
    Result: str

def create_evaluation_agent(system_prompt: str) -> Agent:
    return Agent(
        name="Evaluation Agent",
        handoff_description="Оценка сообщений с использованием метода STAR.",
        instructions=system_prompt,
        tools=[extract_star_element],
        output_type=STAROutput
    )