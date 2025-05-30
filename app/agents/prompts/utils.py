import os
import yaml
import re

from pathlib import Path
import random

def load_prompts(filename: str) -> dict:
    """
    Loads prompts from a YAML file located in the utils directory.
    """
    current_dir = os.path.dirname(os.path.dirname(__file__))
    prompts_file = os.path.join(current_dir, "prompts", filename)
    with open(prompts_file, "r") as file:
        return yaml.safe_load(file)

def extract_xml(text: str, tag: str) -> str:
    """
    Extracts the content of the specified XML tag from the given text. Used for parsing structured responses.

    Args:
        text (str): The text containing the XML.
        tag (str): The XML tag to extract content from.

    Returns:
        str: The content of the specified XML tag, or an empty string if the tag is not found.
    """
    match = re.search(f'<{tag}>(.*?)</{tag}>', text, re.DOTALL)
    if match:
        content = match.group(1).strip()
        content = ' '.join(content.split())
        return content
    return ""


def choose_random_system_prompt() -> str:
    """Choose random system prompt from prompts templates"""

    current_dir = os.path.dirname(os.path.dirname(__file__))
    prompts_file = os.path.join(current_dir, "prompts")
    all_available_system_prompts: list[Path] = list(Path(prompts_file).glob("*candidate_system_prompt.yaml"))
    return random.choice(all_available_system_prompts)