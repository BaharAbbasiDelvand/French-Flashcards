import { useRef, useState } from "react";
import { generateCards, exportDeck, type Flashcard } from "./api";
import "./App.css";

export default function App() {
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
      const res = await generateCards(files, bulk);
      setCards(res.cards);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function updateCard(i: number, patch: Partial<Flashcard>) {
    setCards((prev) => prev.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  }

  function removeCard(i: number) {
    setCards((prev) => prev.filter((_, idx) => idx !== i));
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    setFiles(Array.from(e.dataTransfer.files));
  }

  return (
    <div className="page">
      <header>
        <div className="flag" aria-hidden />
        <h1>Cartes françaises</h1>
        <p>Drop your notes, let AI build French flashcards, export to Anki.</p>
      </header>

      <section
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
      </section>

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
        <section className="results">
          <div className="toolbar">
            <input
              className="deck-name"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
            />
            <span className="count">{cards.length} cards</span>
            <button className="export" onClick={() => exportDeck(deckName, cards)}>
              Export .apkg
            </button>
          </div>

          <div className="card-list">
            {cards.map((card, i) => (
              <div className="card" key={i}>
                <input
                  className="fr"
                  value={card.french}
                  onChange={(e) => updateCard(i, { french: e.target.value })}
                />
                <span className="arrow">→</span>
                <input
                  className="en"
                  value={card.english}
                  onChange={(e) => updateCard(i, { english: e.target.value })}
                />
                <input
                  className="ex"
                  placeholder="example sentence (fr)"
                  value={card.example_fr ?? ""}
                  onChange={(e) => updateCard(i, { example_fr: e.target.value })}
                />
                <button className="remove" title="Remove" onClick={() => removeCard(i)}>
                  ×
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
