import { useRef, useState } from "react";
import { useAuth } from "./auth-context";
import { generateCards, type Flashcard } from "./api";
import { CardList } from "./CardList";

export function NotesMode() {
  const { getToken } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [bulk, setBulk] = useState(false);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [deckName, setDeckName] = useState("French from Notes");
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleGenerate() {
    if (!files.length) return;
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const res = await generateCards(files, bulk, token);
      setCards(res.cards);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    setFiles(Array.from(e.dataTransfer.files));
  }

  return (
    <section>
      <div
        className={`dropzone${dragging ? " dragging" : ""}${files.length ? " filled" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          accept=".txt,.md,.pdf,image/*"
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
        />
        <div className="dz-icon">↑</div>
        {files.length ? (
          <div className="dz-files">
            {files.map((f) => (
              <span className="chip" key={f.name}>
                {f.name}
              </span>
            ))}
          </div>
        ) : (
          <>
            <p className="dz-title">Drop notes here or click to browse</p>
            <p className="dz-hint">Markdown, text, PDF, or a photo of handwriting</p>
          </>
        )}
      </div>

      <div className="controls">
        <label className="bulk">
          <input type="checkbox" checked={bulk} onChange={(e) => setBulk(e.target.checked)} />
          Cheap bulk mode <span className="muted">(Haiku)</span>
        </label>
        <button className="generate" onClick={handleGenerate} disabled={!files.length || loading}>
          {loading ? "Thinking…" : "Generate cards"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {cards.length > 0 && (
        <CardList cards={cards} onChange={setCards} deckName={deckName} setDeckName={setDeckName} />
      )}
    </section>
  );
}
