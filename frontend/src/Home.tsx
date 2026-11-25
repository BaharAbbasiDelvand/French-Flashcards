export type Tool = "vocab" | "notes";

interface Feature {
  id: Tool;
  title: string;
  subtitle: string;
  icon: string;
}

const FEATURES: Feature[] = [
  {
    id: "vocab",
    title: "Vocabulaire",
    subtitle: "Turn a list of words and their meanings into a deck",
    icon: "✎",
  },
  {
    id: "notes",
    title: "Depuis mes notes",
    subtitle: "Extract cards from notes, PDFs, or photos of handwriting",
    icon: "↑",
  },
];

export function Home({ onSelect }: { onSelect: (tool: Tool) => void }) {
  return (
    <section className="hub">
      {FEATURES.map((f) => (
        <button className="feature" key={f.id} onClick={() => onSelect(f.id)}>
          <span className="feature-icon">{f.icon}</span>
          <span className="feature-title">{f.title}</span>
          <span className="feature-sub">{f.subtitle}</span>
        </button>
      ))}
      <div className="feature soon">
        <span className="feature-icon">+</span>
        <span className="feature-title">Plus à venir</span>
        <span className="feature-sub">More tools coming soon</span>
      </div>
    </section>
  );
}
