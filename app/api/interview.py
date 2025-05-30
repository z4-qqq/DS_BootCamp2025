from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
import base64
import json
import os

from app.model.ttt import TTT
from app.model.stt import STT
from app.model.tts import TTS
from app.agents.prompts.utils import load_prompts, choose_random_system_prompt
from pprint import pp
from agents import Runner
from app.agents.interviewee_agent import create_interviewee_agent
from app.agents.hint_agent import create_hint_agent
from app.agents.utils import change_voice

# Используем директорию /tmp для временных файлов (доступна для записи всем пользователям)
TEMP_DIR = "/tmp/ai-interview-temp"
os.makedirs(TEMP_DIR, exist_ok=True)

router = APIRouter()

ttt = TTT()
stt = STT()
tts = TTS()


# Вебсокет-эндпоинт для интервью
@router.websocket("/ws/interview")
async def websocket_interview(ws: WebSocket, persona: str = Query("Junior Python Developer"), skill: str = Query("Python programming")):

    system_prompt_yaml_file = choose_random_system_prompt()
    prompts = load_prompts(system_prompt_yaml_file)
    await ws.accept()  # Принимаем подключение
    # системный промпт для агента на основе выбранной персоны и навыка
    system_prompt = prompts["persona_system_prompt"].format(persona=persona, skill=skill)
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
                user_input = stt.transcribe_from_path(temp_audio_path)  # Распознаём речь
                is_audio = True
            current_mesage = ttt.create_chat_message("user", user_input)
            messages.append(current_mesage)  # Добавляем текущее сообщение пользователя
            response = await Runner.run(agent, user_input, context={"chat_history": messages}) # Вариант с контекстом
            agent_text = response.final_output  # Текстовый ответ агента
            if is_audio:
                # Генерируем аудиофайл с ответом агента
                change_voice(tts=tts, system_prompt_yaml_file=system_prompt_yaml_file)
                tts_response = tts.generate_speech(agent_text, tone=prompts["persona_voice_tone_prompt"])
                agent_audio = base64.b64encode(tts_response.content).decode('utf-8')
                # Отправляем клиенту текст и аудио
                await ws.send_json({"type": "voice", "content": agent_text, "user_text": user_input, "audio": agent_audio})
            elif not is_audio:
                # Отправляем клиенту только текст
                await ws.send_json({"type": "text", "content": agent_text})
    except WebSocketDisconnect:
        pass


async def get_hint_by_agent(persona: str = Query("Junior Python Developer"), skill: str = Query("Python programming"), messages: list = []):
    # Загрузка и форматирование промпта для hint-агента
    system_prompt_yaml_file = "hint_agent_system_prompt.yaml"
    prompts = load_prompts(system_prompt_yaml_file)
    system_prompt = prompts["hint_agent_system_prompt"].format(persona=persona, skill=skill, dialogue=messages)
    # Создание агента
    agent = create_hint_agent(system_prompt=system_prompt)
    
    response = await Runner.run(agent, "Сгенерируй подсказку")

    agent_text = response.final_output

    return agent_text
    