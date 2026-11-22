import { useState } from "react";
import { generateCards, exportDeck, type Flashcard } from "./api";
import "./App.css";

export default function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [bulk, setBulk] = useState(false);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [deckName, setDeckName] = useState("French from Notes");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="page">
      <header>
        <h1>Cartes françaises</h1>
        <p>Drop your notes, let AI build French flashcards, export to Anki.</p>
      </header>

      <section className="panel">
        <input
          type="file"
          multiple
          accept=".txt,.md,.pdf,image/*"
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
        />
        <label className="bulk">
          <input type="checkbox" checked={bulk} onChange={(e) => setBulk(e.target.checked)} />
          Cheap bulk mode (Haiku)
        </label>
        <button onClick={handleGenerate} disabled={!files.length || loading}>
          {loading ? "Thinking…" : "Generate cards"}
        </button>
      </section>

      {error && <p className="error">{error}</p>}

      {cards.length > 0 && (
        <section className="results">
          <div className="toolbar">
            <input value={deckName} onChange={(e) => setDeckName(e.target.value)} />
            <span>{cards.length} cards</span>
            <button className="primary" onClick={() => exportDeck(deckName, cards)}>
              Export .apkg
            </button>
          </div>

          {cards.map((card, i) => (
            <div className="card" key={i}>
              <input
                className="fr"
                value={card.french}
                onChange={(e) => updateCard(i, { french: e.target.value })}
              />
              <input
                className="en"
                value={card.english}
                onChange={(e) => updateCard(i, { english: e.target.value })}
              />
              <input
                className="ex"
                placeholder="example (fr)"
                value={card.example_fr ?? ""}
                onChange={(e) => updateCard(i, { example_fr: e.target.value })}
              />
              <button className="remove" onClick={() => removeCard(i)}>
                ×
              </button>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
