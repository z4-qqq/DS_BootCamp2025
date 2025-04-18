from app.model.tts import TTS
from app.data.voices import CANDIDATE_TO_VOICE

def change_voice(tts: TTS, system_prompt_yaml_file: str) -> None:
    """Change voice of tts
    Args:
        tts: Text to Speech
        system_prompt_yaml_file: system prompt yaml filename
    Returns:
        None
    
    """
    voice = CANDIDATE_TO_VOICE.get(system_prompt_yaml_file, "ash")
    setattr(tts, "voice", voice)
