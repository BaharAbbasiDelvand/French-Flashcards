import io
import hashlib
import genanki
from app.models import Flashcard


def _stable_id(seed: str) -> int:
    digest = hashlib.sha256(seed.encode("utf-8")).hexdigest()
    return int(digest[:8], 16)


MODEL = genanki.Model(
    _stable_id("french-flashcards-model"),
    "French Note Card",
    fields=[
        {"name": "French"},
        {"name": "English"},
        {"name": "ExampleFr"},
        {"name": "ExampleEn"},
        {"name": "Extra"},
    ],
    templates=[
        {
            "name": "FR to EN",
            "qfmt": '<div class="fr">{{French}}</div>{{#ExampleFr}}<div class="ex">{{ExampleFr}}</div>{{/ExampleFr}}',
            "afmt": '{{FrontSide}}<hr id="answer"><div class="en">{{English}}</div>'
            '{{#ExampleEn}}<div class="ex">{{ExampleEn}}</div>{{/ExampleEn}}'
            '{{#Extra}}<div class="extra">{{Extra}}</div>{{/Extra}}',
        }
    ],
    css=".card{font-family:Georgia,serif;font-size:22px;text-align:center;color:#222;background:#fff}"
    ".fr{font-weight:bold}.en{color:#1a5}.ex{font-size:17px;color:#666;margin-top:8px}"
    ".extra{font-size:15px;color:#999;margin-top:10px}",
)


def build_deck(deck_name: str, cards: list[Flashcard]) -> bytes:
    deck = genanki.Deck(_stable_id(deck_name), deck_name)
    for card in cards:
        extra_bits = [b for b in [card.part_of_speech, card.gender, card.notes] if b]
        extra = " · ".join(extra_bits)
        note = genanki.Note(
            model=MODEL,
            fields=[
                card.french,
                card.english,
                card.example_fr or "",
                card.example_en or "",
                extra,
            ],
            tags=[t.replace(" ", "_") for t in card.tags],
        )
        deck.add_note(note)
    buffer = io.BytesIO()
    genanki.Package(deck).write_to_file(buffer)
    return buffer.getvalue()
