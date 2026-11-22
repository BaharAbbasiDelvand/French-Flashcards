from anthropic import Anthropic
from app.config import settings
from app.models import Flashcard

client = Anthropic(api_key=settings.anthropic_api_key)

SYSTEM_PROMPT = (
    "You are a French-language tutor that turns a learner's notes into high-quality "
    "spaced-repetition flashcards. Read the provided notes (which may be transcribed "
    "from handwriting or a PDF) and extract the French vocabulary, expressions and "
    "grammar points worth memorising. For each card: put the French on one side and a "
    "natural English translation on the other; add a short example sentence in French "
    "with its English translation; for nouns include the gender; for verbs note the "
    "infinitive. Skip anything that is not useful to drill. Never invent vocabulary that "
    "is not supported by the notes."
)

CARD_TOOL = {
    "name": "emit_flashcards",
    "description": "Return the finished set of French flashcards extracted from the notes.",
    "input_schema": {
        "type": "object",
        "properties": {
            "cards": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "french": {"type": "string"},
                        "english": {"type": "string"},
                        "example_fr": {"type": "string"},
                        "example_en": {"type": "string"},
                        "part_of_speech": {"type": "string"},
                        "gender": {"type": "string", "enum": ["m", "f", "m/f"]},
                        "notes": {"type": "string"},
                        "tags": {"type": "array", "items": {"type": "string"}},
                    },
                    "required": ["french", "english"],
                },
            }
        },
        "required": ["cards"],
    },
}


def generate_cards(content_blocks: list[dict], bulk: bool = False) -> list[Flashcard]:
    model = settings.model_bulk if bulk else settings.model_quality
    message = client.messages.create(
        model=model,
        max_tokens=4096,
        system=SYSTEM_PROMPT,
        tools=[CARD_TOOL],
        tool_choice={"type": "tool", "name": "emit_flashcards"},
        messages=[{"role": "user", "content": content_blocks}],
    )
    for block in message.content:
        if block.type == "tool_use" and block.name == "emit_flashcards":
            return [Flashcard(**c) for c in block.input.get("cards", [])]
    return []
