from app.model.ttt import TTT
from agents import function_tool
from typing import List
from pydantic import BaseModel

ttt = TTT()

class Message(BaseModel):
    role: str
    content: str

extract_star_json = {
            "type": "function",
            "name": "extract_star",
            "description": "Извлечь элемент Skill (Компетенция), Situation (Ситуация), элемент Task (Задача), Action (Действия), Извлечь элемент Result (Результат) из стенограммы собеседования. В каждом из ответов учитывай компетенцию (Skill). Не выдумывайте ничего, используйте только предоставленную стенограмму собеседования.",
            "parameters": {
                "type": "object",
                "properties": {
                    "Skill": {"type":"string", "description": "Указать компетенцию Skill (Компетенция) из контекста. Ничего лишнего добавлять не надо, укажи просто skill из функции skill()."},
                    "Situation": {"type": "string", "description": "Извлеки элемент Situation (Ситуация) из стенограммы собеседования, строго основываясь на предоставленных сообщениях. Не выдумывай и не дополняй информацию. Убедись, что извлечённая ситуация релевантна заданной компетенции, которую можно получить через property Skill. Упор должен быть на контексте, в котором проявляется указанная компетенция."},
                    "Task": {"type": "string", "description": "Извлеки элемент Task (Задача) из стенограммы собеседования, строго опираясь на оригинальные сообщения. Укажи, какую цель или ответственность ставил перед собой кандидат в рамках описанной ситуации. Убедись, что задача связана с компетенцией, которую можно получить через вызов функции skill()."},
                    "Action": {"type": "string", "description": "Извлеки элемент Action (Действия) из стенограммы собеседования. Опиши, какие конкретные шаги предпринимал кандидат для решения поставленной задачи. Делай акцент на действия, демонстрирующие проявление компетенции, которую можно получить через функцию skill(). Не додумывай детали — используй только предоставленные сообщения."},
                    "Result": {"type": "string", "description": "Извлеки элемент Result (Результат) из стенограммы собеседования. Опиши, к какому итогу привели действия кандидата. Укажи конкретный результат, достигнутый в описанной ситуации, особенно в контексте проявления компетенции, которую можно получить через функцию skill(). Не добавляй ничего сверх того, что есть в сообщениях."},
                    "Conclusion": {"type": "string", "description": "Сделай вывод по пунктам Situation, Task, Action, Result. Напиши была ли проявлена компетенция Skill. Обоснуй свое решение."}
                },
                "required": ["Action"],
                "additionalProperties": False
            },
            "strict": True,
        }

@function_tool
def extract_star(messages: List[Message]) -> str:
    """
    Универсальная функция для извлечения элементов STAR (Situation, Task, Action, Result) из стенограммы собеседования.

    Args:
        messages (list): Список сообщений из стенограммы собеседования.
    Return:
        str: Извлечённый элемент из собеседования или сообщение, если элемент не описан.
    """

    response = ttt.generate_response_with_function(
        messages=messages,
        functions=[extract_star_json]
    )
    print("Response from extract:", response)
    return response