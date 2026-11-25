import { useState } from "react";
import { Home, type Tool } from "./Home";
import { VocabMode } from "./VocabMode";
import { NotesMode } from "./NotesMode";
import "./App.css";

type View = "home" | Tool;

const SUBTITLES: Record<View, string> = {
  home: "Your French flashcard workshop — pick a tool to begin.",
  vocab: "Paste words and meanings, build a deck, export to Anki.",
  notes: "Drop your notes, let AI build French flashcards, export to Anki.",
};

export default function App() {
  const [view, setView] = useState<View>("home");

  return (
    <div className="page">
      <header>
        <div className="flag" aria-hidden />
        <h1 className="brand" onClick={() => setView("home")}>
          Cartes françaises
        </h1>
        <p>{SUBTITLES[view]}</p>
      </header>

      {view !== "home" && (
        <button className="back" onClick={() => setView("home")}>
          ← All tools
        </button>
      )}

      {view === "home" && <Home onSelect={setView} />}
      {view === "vocab" && <VocabMode />}
      {view === "notes" && <NotesMode />}
    </div>
  );
}
