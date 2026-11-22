export interface Flashcard {
  french: string;
  english: string;
  example_fr?: string | null;
  example_en?: string | null;
  part_of_speech?: string | null;
  gender?: "m" | "f" | "m/f" | null;
  notes?: string | null;
  tags: string[];
}

export interface GenerateResponse {
  source_text: string;
  cards: Flashcard[];
}

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export async function generateCards(files: File[], bulk: boolean): Promise<GenerateResponse> {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  form.append("bulk", String(bulk));

  const res = await fetch(`${BASE}/api/generate`, { method: "POST", body: form });
  if (!res.ok) throw new Error((await res.text()) || "Generation failed");
  return res.json();
}

export async function exportDeck(deckName: string, cards: Flashcard[]): Promise<void> {
  const res = await fetch(`${BASE}/api/export`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ deck_name: deckName, cards }),
  });
  if (!res.ok) throw new Error((await res.text()) || "Export failed");

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${deckName.replace(/\s+/g, "_")}.apkg`;
  a.click();
  URL.revokeObjectURL(url);
}
