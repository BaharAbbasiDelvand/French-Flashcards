function Brand({ tagline }: { tagline: string }) {
  return (
    <header>
      <div className="flag" aria-hidden />
      <h1>Cartes françaises</h1>
      <p>{tagline}</p>
    </header>
  );
}

export function SignIn({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="page">
      <Brand tagline="Sign in to build and save your French decks." />
      <div className="signin-card">
        <p className="signin-lead">Your flashcards, saved to your account.</p>
        <button className="generate signin-btn" onClick={onLogin}>
          Se connecter
        </button>
      </div>
    </div>
  );
}

export function Loading() {
  return (
    <div className="page">
      <p className="loading">Loading…</p>
    </div>
  );
}
