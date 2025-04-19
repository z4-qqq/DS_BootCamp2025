from fastapi import APIRouter, Request

from app.agents.evaluation_agent import create_evaluation_agent, create_feedback_evaluation_agent, STAROutput

from agents import Runner

from app.agents.prompts.utils import load_prompts

def build_feedback_evaluation_user_prompt(
    messages: list[dict[str, str]], feedback: str, agent_feedback: dict
) -> list[dict[str, str]]:
    """
    Формирует сообщения для агента оценки фидбека.
    """
    prompt = (
        "Вот фидбек от нанимающего менеджера после интервью:\n\n"
        f"{feedback}\n\n"
        "Вот результат автоматической оценки интервью по методу STAR:\n\n"
        f"{agent_feedback}\n\n"
        "Проанализируй фидбек. Насколько он полезен кандидату? "
        "Является ли он конструктивным и конкретным? Какие рекомендации ты бы дал менеджеру по улучшению качества обратной связи?"
    )
    
    return [{"role": "user", "content": prompt}]

router = APIRouter()

prompts = load_prompts("evaluation_system_prompt.yaml")
system_prompt = prompts["evaluation_system_prompt"]

feedback_evaluation_system_prompt = prompts["evaluate_feedback_system_prompt"]
feedback_evaluation_agent = create_feedback_evaluation_agent(feedback_evaluation_system_prompt)

# Хранилище для последних результатов оценки
last_evaluation_result:dict = {}

@router.post("/api/evaluation")
async def evaluate_endpoint(request: Request):
    global last_evaluation_result
    # 1. Считаем входные данные
    data = await request.json()
    skill = data.get("skill", "")
    messages = data.get("messages", [])
    feedback = data.get("feedback", "")
    # 2. Создадим агента с системным промптом
    agent = create_evaluation_agent(system_prompt)
    # 3. Получим ответ от агента
    response = await Runner.run(agent, messages, context={"skill": skill})
    # 4. Преобразуем в словарь и запомним
    last_evaluation_result = response.final_output_as(cls=dict)
    # 5. Вернём клиенту результат сразу
    return last_evaluation_result

from fastapi.responses import JSONResponse

@router.post("/api/feedback_evaluation")
async def evaluate_feedback_endpoint(request: Request):
    data = await request.json()

    skill = data.get("skill", "")
    messages = data.get("messages", [])
    feedback = data.get("feedback", "")

    feedback_user_prompt = build_feedback_evaluation_user_prompt(
        messages=messages, feedback=feedback, agent_feedback=last_evaluation_result
    )

    response = await Runner.run(feedback_evaluation_agent, feedback_user_prompt, context={"skill": skill})

    output = response.final_output
    # Сохраняем результат во временное хранилище
    request.app.state.feedback_result = output
    return JSONResponse(content={"message": output})


@router.get("/api/feedback_evaluation")
async def get_evaluate_feedback_result(request: Request):
    result = request.app.state.feedback_result
    if not result:
        return JSONResponse(status_code=404, content={"error": "Результат пока не готов"})
    return JSONResponse(content={"message": result})

@router.get("/api/evaluation")
async def get_evaluation_result():
    """Эндпоинт для получения последних результатов оценки."""
    return last_evaluation_result