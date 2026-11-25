export interface HubItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
}

export function Hub({ items, onSelect }: { items: HubItem[]; onSelect: (id: string) => void }) {
  return (
    <section className="hub">
      {items.map((f) =>
        f.id === "soon" ? (
          <div className="feature soon" key={f.id}>
            <span className="feature-icon">{f.icon}</span>
            <span className="feature-title">{f.title}</span>
            <span className="feature-sub">{f.subtitle}</span>
          </div>
        ) : (
          <button className="feature" key={f.id} onClick={() => onSelect(f.id)}>
            <span className="feature-icon">{f.icon}</span>
            <span className="feature-title">{f.title}</span>
            <span className="feature-sub">{f.subtitle}</span>
          </button>
        )
      )}
    </section>
  );
}
