import { useState } from "react";
import { CardList } from "./CardList";
import type { Flashcard } from "./api";

const SEPARATORS = ["\t", "=", " — ", " – ", " - ", ":"];

function parseLines(text: string): Flashcard[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      for (const sep of SEPARATORS) {
        const idx = line.indexOf(sep);
        if (idx > 0) {
          return {
            french: line.slice(0, idx).trim(),
            english: line.slice(idx + sep.length).trim(),
            tags: [],
          };
        }
      }
      return { french: line, english: "", tags: [] };
    });
}

export function VocabMode() {
  const [raw, setRaw] = useState("");
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [deckName, setDeckName] = useState("French Dictionary");

  const lineCount = raw.split("\n").filter((l) => l.trim()).length;

  return (
    <section>
      <p className="mode-intro">
        One word per line — French and meaning separated by <code>=</code>, a tab, or{" "}
        <code> - </code>. Optionally let AI add example sentences and gender.
      </p>

      <textarea
        className="vocab-input"
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        placeholder={"bonjour = hello\nle chat = the cat\nmanger = to eat"}
      />

      <div className="controls">
        <span className="muted">{lineCount} lines</span>
        <button className="generate" onClick={() => setCards(parseLines(raw))} disabled={!raw.trim()}>
          Build cards
        </button>
      </div>

      {cards.length > 0 && (
        <CardList cards={cards} onChange={setCards} deckName={deckName} setDeckName={setDeckName} />
      )}
    </section>
  );
}
