import io
import base64
import fitz
from PIL import Image

TEXT_TYPES = {"text/plain", "text/markdown"}
PDF_TYPES = {"application/pdf"}
IMAGE_TYPES = {"image/png", "image/jpeg", "image/jpg", "image/webp"}


def extract_text_file(data: bytes) -> str:
    return data.decode("utf-8", errors="replace")


def extract_pdf(data: bytes) -> str:
    chunks: list[str] = []
    with fitz.open(stream=data, filetype="pdf") as doc:
        for page in doc:
            chunks.append(page.get_text())
    return "\n\n".join(chunks).strip()


def image_to_block(data: bytes, media_type: str) -> dict:
    img = Image.open(io.BytesIO(data))
    buffer = io.BytesIO()
    img.convert("RGB").save(buffer, format="JPEG", quality=85)
    encoded = base64.standard_b64encode(buffer.getvalue()).decode("utf-8")
    return {
        "type": "image",
        "source": {
            "type": "base64",
            "media_type": "image/jpeg",
            "data": encoded,
        },
    }


def classify(media_type: str) -> str:
    if media_type in TEXT_TYPES:
        return "text"
    if media_type in PDF_TYPES:
        return "pdf"
    if media_type in IMAGE_TYPES:
        return "image"
    return "unknown"
