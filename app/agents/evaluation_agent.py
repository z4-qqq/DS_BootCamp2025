from agents import Agent
<<<<<<< Updated upstream
from app.agents.tools.extract_situation import extract_situation
from app.agents.tools.extract_task import extract_task
from app.agents.tools.extract_action import extract_action
from app.agents.tools.extract_result import extract_result
from app.agents.tools.extract_smart import extract_star_element
=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        tools=[extract_star_element],
=======
        tools=[extract_star, skill],
>>>>>>> Stashed changes
        output_type=STAROutput
    )