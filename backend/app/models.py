from pydantic import BaseModel
from typing import Literal


class Flashcard(BaseModel):
    french: str
    english: str
    example_fr: str | None = None
    example_en: str | None = None
    part_of_speech: str | None = None
    gender: Literal["m", "f", "m/f", None] = None
    notes: str | None = None
    tags: list[str] = []


class GenerateResponse(BaseModel):
    source_text: str
    cards: list[Flashcard]


class ExportRequest(BaseModel):
    deck_name: str = "French from Notes"
    cards: list[Flashcard]


class EnrichRequest(BaseModel):
    cards: list[Flashcard]
    bulk: bool = False
