
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_FILE = BASE_DIR / "data" / "quiz.json"


def load_quiz():
    with DATA_FILE.open("r", encoding="utf-8") as file:
        data = json.load(file)

    if not data.get("questions"):
        raise ValueError("The quiz must contain at least one question.")

    if "scores" not in data:
        data["scores"] = {"1": 0, "2": 0}

    if "current_question" not in data:
        data["current_question"] = 0

    return data


def save_quiz(data):
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)

    temporary_file = DATA_FILE.with_suffix(".tmp")

    with temporary_file.open("w", encoding="utf-8") as file:
        json.dump(data, file, indent=2, ensure_ascii=False)

    temporary_file.replace(DATA_FILE)
