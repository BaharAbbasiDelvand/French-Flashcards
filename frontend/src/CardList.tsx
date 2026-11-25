import { useState } from "react";
import { useAuth } from "./auth-context";
import { exportDeck, enrichCards, type Flashcard } from "./api";

interface Props {
  cards: Flashcard[];
  onChange: (cards: Flashcard[]) => void;
  deckName: string;
  setDeckName: (name: string) => void;
}

export function CardList({ cards, onChange, deckName, setDeckName }: Props) {
  const { getToken } = useAuth();
  const [bulk, setBulk] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(i: number, patch: Partial<Flashcard>) {
    onChange(cards.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  }

  function remove(i: number) {
    onChange(cards.filter((_, idx) => idx !== i));
  }

  async function enhance() {
    setEnhancing(true);
    setError(null);
    try {
      const token = await getToken();
      onChange(await enrichCards(cards, bulk, token));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Enrichment failed");
    } finally {
      setEnhancing(false);
    }
  }

  async function handleExport() {
    setError(null);
    try {
      const token = await getToken();
      await exportDeck(deckName, cards, token);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed");
    }
  }

  return (
    <section className="results">
      <div className="toolbar">
        <input
          className="deck-name"
          value={deckName}
          onChange={(e) => setDeckName(e.target.value)}
        />
        <span className="count">{cards.length} cards</span>
        <label className="bulk">
          <input type="checkbox" checked={bulk} onChange={(e) => setBulk(e.target.checked)} />
          <span className="muted">Haiku</span>
        </label>
        <button className="enhance" onClick={enhance} disabled={enhancing}>
          {enhancing ? "Enhancing…" : "✨ Enhance with AI"}
        </button>
        <button className="export" onClick={handleExport}>
          Export .apkg
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="card-list">
        {cards.map((card, i) => (
          <div className="card" key={i}>
            <input
              className="fr"
              value={card.french}
              onChange={(e) => update(i, { french: e.target.value })}
            />
            <span className="arrow">→</span>
            <input
              className="en"
              value={card.english}
              onChange={(e) => update(i, { english: e.target.value })}
            />
            <input
              className="ex"
              placeholder="example sentence (fr)"
              value={card.example_fr ?? ""}
              onChange={(e) => update(i, { example_fr: e.target.value })}
            />
            <button className="remove" title="Remove" onClick={() => remove(i)}>
              ×
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
