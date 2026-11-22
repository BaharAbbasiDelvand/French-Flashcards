# Cartes françaises — French Flashcards from Notes

Turn your French notes (Markdown, PDFs, exported notes, or photos of handwriting) into
Anki flashcards with Claude.

## Stack

- **Backend** — FastAPI (Python 3.12). Handles ingestion, calls the Claude API to extract
  cards, and builds Anki `.apkg` decks with `genanki`.
- **Frontend** — React + TypeScript (Vite). Upload notes, review and edit the generated
  cards, then export.
- **AI** — Claude (`claude-opus-4-8` for quality, `claude-haiku-5-5` for cheap bulk runs),
  using tool use to return structured cards. Handwriting photos are read directly by
  Claude's vision, no separate OCR engine required.

## Layout

```
french-flashcards/
├── backend/
│   ├── app/
│   │   ├── main.py            FastAPI app + CORS
│   │   ├── config.py          Settings (.env)
│   │   ├── models.py          Flashcard schemas
│   │   ├── routers/cards.py   /api/generate, /api/export
│   │   └── services/
│   │       ├── ingestion.py   text / PDF / image handling
│   │       ├── ai.py          Claude card generation
│   │       └── anki_export.py genanki deck builder
│   └── requirements.txt
└── frontend/                  Vite + React + TS
```

## Running it

### Backend

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # then add your ANTHROPIC_API_KEY
uvicorn app.main:app --reload
```

The API runs at http://localhost:8000.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at http://localhost:5173.

## Notes

- PDFs are read with PyMuPDF. Scanned/image-only PDFs may need OCR (`pytesseract` +
  the Tesseract binary) — wiring is stubbed in `ingestion.py` for later.
- Import the exported `.apkg` into Anki (File → Import). Spaced repetition, sync, and
  mobile apps come from Anki.

## Roadmap ideas

- Notion / Apple Notes import
- Auto-generated audio (TTS) on cards
- Dedupe against an existing deck
- CEFR-level tagging
- A built-in review mode (drop the Anki dependency)
