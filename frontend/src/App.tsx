import { useState } from "react";
import { Hub, type HubItem } from "./Hub";
import { VocabMode } from "./VocabMode";
import { NotesMode } from "./NotesMode";
import "./App.css";

type View = "home" | "create" | "notes" | "dictionary";

const PARENT: Record<View, View | null> = {
  home: null,
  create: "home",
  notes: "create",
  dictionary: "create",
};

const SUBTITLES: Record<View, string> = {
  home: "Your French study workshop — pick what you want to do.",
  create: "Choose how to build your flashcards.",
  notes: "Drop your notes, let AI build French flashcards, export to Anki.",
  dictionary: "Type words and their meanings, build a deck, export to Anki.",
};

const HOME_ITEMS: HubItem[] = [
  {
    id: "create",
    title: "Create flashcards",
    subtitle: "Build decks from notes, word lists, and more",
    icon: "✎",
  },
  { id: "soon", title: "Plus à venir", subtitle: "More tools coming soon", icon: "+" },
];

const CREATE_ITEMS: HubItem[] = [
  {
    id: "notes",
    title: "Depuis mes notes",
    subtitle: "Upload notes, PDFs, or photos of handwriting",
    icon: "↑",
  },
  {
    id: "dictionary",
    title: "Dictionnaire",
    subtitle: "Type words and their meanings, one per line",
    icon: "≡",
  },
  { id: "soon", title: "Plus à venir", subtitle: "More methods coming soon", icon: "+" },
];

export default function App() {
  const [view, setView] = useState<View>("home");
  const parent = PARENT[view];

  return (
    <div className="page">
      <header>
        <div className="flag" aria-hidden />
        <h1 className="brand" onClick={() => setView("home")}>
          Cartes françaises
        </h1>
        <p>{SUBTITLES[view]}</p>
      </header>

      {parent && (
        <button className="back" onClick={() => setView(parent)}>
          ← Back
        </button>
      )}

      {view === "home" && <Hub items={HOME_ITEMS} onSelect={(id) => setView(id as View)} />}
      {view === "create" && <Hub items={CREATE_ITEMS} onSelect={(id) => setView(id as View)} />}
      {view === "notes" && <NotesMode />}
      {view === "dictionary" && <VocabMode />}
    </div>
  );
}
