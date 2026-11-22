from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import Response

from app.models import GenerateResponse, ExportRequest
from app.services import ingestion, ai, anki_export

router = APIRouter(prefix="/api", tags=["cards"])


@router.post("/generate", response_model=GenerateResponse)
async def generate(files: list[UploadFile] = File(...), bulk: bool = Form(False)):
    blocks: list[dict] = []
    preview_text: list[str] = []

    for upload in files:
        data = await upload.read()
        kind = ingestion.classify(upload.content_type or "")

        if kind == "text":
            text = ingestion.extract_text_file(data)
            preview_text.append(text)
            blocks.append({"type": "text", "text": text})
        elif kind == "pdf":
            text = ingestion.extract_pdf(data)
            preview_text.append(text)
            blocks.append({"type": "text", "text": text})
        elif kind == "image":
            blocks.append(ingestion.image_to_block(data, upload.content_type))
            preview_text.append(f"[image: {upload.filename}]")
        else:
            raise HTTPException(400, f"Unsupported file type: {upload.content_type}")

    if not blocks:
        raise HTTPException(400, "No readable content found in the uploads.")

    blocks.append({"type": "text", "text": "Create flashcards from the notes above."})
    cards = ai.generate_cards(blocks, bulk=bulk)
    return GenerateResponse(source_text="\n\n".join(preview_text), cards=cards)


@router.post("/export")
async def export(req: ExportRequest):
    if not req.cards:
        raise HTTPException(400, "No cards to export.")
    package = anki_export.build_deck(req.deck_name, req.cards)
    filename = req.deck_name.replace(" ", "_") + ".apkg"
    return Response(
        content=package,
        media_type="application/octet-stream",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
