import base64
import json
import os

from agents import Runner
from fastapi import (
    APIRouter,
    Body,
    Header,
    Query,
    Request,
    WebSocket,
    WebSocketDisconnect,
)
from fastapi.responses import JSONResponse
from jose import JWTError, jwt

from app.agents.interviewee_agent import create_interviewee_agent
from app.agents.prompts.utils import choose_random_system_prompt, load_prompts
from app.agents.utils import change_voice
from app.db import get_db_pool
from app.model.stt import STT
from app.model.tts import TTS
from app.model.ttt import TTT
from app.settings import settings

# Используем директорию /tmp для временных файлов (доступна для записи всем пользователям)
TEMP_DIR = "/tmp/ai-interview-temp"
os.makedirs(TEMP_DIR, exist_ok=True)

router = APIRouter()

ttt = TTT()
stt = STT()
tts = TTS()


# Вебсокет-эндпоинт для интервью
@router.websocket("/ws/interview")
async def websocket_interview(
    ws: WebSocket,
    persona: str = Query("Junior Python Developer"),
    skill: str = Query("Python programming"),
):
    system_prompt_yaml_file = choose_random_system_prompt()
    prompts = load_prompts(system_prompt_yaml_file)
    await ws.accept()  # Принимаем подключение
    # системный промпт для агента на основе выбранной персоны и навыка
    system_prompt = prompts["persona_system_prompt"].format(
        persona=persona, skill=skill
    )
    agent = create_interviewee_agent(system_prompt)  # агент для интервью
    messages = []
    try:
        while True:
            data = await ws.receive_text()  # сообщение от клиента
            json_data = json.loads(data)
            if json_data["type"] == "text":  # текст
                user_input = json_data.get("message", "")
                is_audio = False
            elif json_data["type"] == "audio":  # аудио
                audio_bytes = base64.b64decode(json_data["audio"])
                temp_audio_path = os.path.join(TEMP_DIR, "temp_audio.wav")
                with open(temp_audio_path, "wb") as f:
                    f.write(audio_bytes)  # Сохраняем аудио во временный файл
                user_input = stt.transcribe_from_path(
                    temp_audio_path
                )  # Распознаём речь
                is_audio = True
            current_mesage = ttt.create_chat_message("user", user_input)
            messages.append(current_mesage)  # Добавляем текущее сообщение пользователя
            response = await Runner.run(
                agent, user_input, context={"chat_history": messages}
            )  # Вариант с контекстом
            agent_text = response.final_output  # Текстовый ответ агента
            if is_audio:
                # Генерируем аудиофайл с ответом агента
                change_voice(tts=tts, system_prompt_yaml_file=system_prompt_yaml_file)
                tts_response = tts.generate_speech(
                    agent_text, tone=prompts["persona_voice_tone_prompt"]
                )
                agent_audio = base64.b64encode(tts_response.content).decode("utf-8")
                # Отправляем клиенту текст и аудио
                await ws.send_json(
                    {
                        "type": "voice",
                        "content": agent_text,
                        "user_text": user_input,
                        "audio": agent_audio,
                    }
                )
            elif not is_audio:
                # Отправляем клиенту только текст
                await ws.send_json({"type": "text", "content": agent_text})
    except WebSocketDisconnect:
        pass


@router.post("/api/save-interview")
async def save_interview(
    request: Request, data: dict = Body(...), authorization: str = Header(None)
):
    if not authorization or not authorization.startswith("Bearer "):
        return JSONResponse(status_code=401, content={"error": "Требуется авторизация"})

    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        username = payload.get("sub")
        if not username:
            raise JWTError("Пустой subject")
    except JWTError:
        return JSONResponse(status_code=401, content={"error": "Неверный токен"})

    if not data:
        return JSONResponse(status_code=400, content={"error": "Пустой JSON"})

    db = get_db_pool()
    async with db.acquire() as conn:
        await conn.execute(
            f"""
            INSERT INTO {settings.DB_SCHEMA}.interviews (username, interview_data)
            VALUES ($1, $2)
            """,
            username,
            json.dumps(data),
        )
    return {"status": "ok"}
