from app.model.ttt import TTT
from agents import function_tool
from typing import List
from pydantic import BaseModel

from app.agents.tools.extract_situation import extract_situation
from app.agents.tools.extract_task import extract_task
from app.agents.tools.extract_action import extract_action
from app.agents.tools.extract_result import extract_result

class Message(BaseModel):
    role: str
    content: str

@function_tool
def extract_star_element(messages: List[Message], element: str) -> str:
    """
    Универсальная функция для извлечения элементов STAR (Situation, Task, Action, Result) из стенограммы собеседования.

    Args:
        messages (list): Список сообщений из стенограммы собеседования.
        element (str): Один из элементов STAR: 'situation', 'task', 'action', 'result'.

    Return:
        str: Извлечённый элемент из собеседования или сообщение, если элемент не описан.
    """

    function_map = {
        "situation": extract_situation,
        "task": extract_task,
        "action": extract_action,
        "result": extract_result,
    }

    if element not in function_map:
        return f"Неизвестный элемент STAR: {element}"

    response = ttt.generate_response_with_function(
        messages=messages,
        functions=[function_map[element]]
    )
    print(f"Response from extract_{element}:", response)
    return response
