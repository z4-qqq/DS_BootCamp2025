from agents import Agent
from app.agents.tools.lie_answer import lie_answer
from app.agents.tools.context import context

def create_hint_agent(system_prompt: str) -> Agent:
    return Agent(
        name="Агент для генерации подсказак нанимающему менеджеру",
        handoff_description="Ты умный помощник, который помогает придумывать вопросы таким образом, чтобы раскрыть компетенцию кандидата",
        instructions=system_prompt,
    )