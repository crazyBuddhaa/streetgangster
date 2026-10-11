interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <section className="start-screen" aria-label="Start Street Gangster">
      <div className="start-world-art" aria-hidden="true">
        <img src="/assets/district0-cover.jpg" alt="" />
      </div>
      <div className="start-brand" aria-label="District0, Lagos">
        <span className="start-brand-mark">SG</span>
        <span className="start-brand-copy">
          <strong>DISTRICT0</strong>
          <small>LAGOS · BUILD 0.1</small>
        </span>
      </div>
      <div className="start-card">
        <p className="start-kicker">Single-player prototype</p>
        <h1>
          Street
          <br />
          <span>Gangster</span>
        </h1>
        <p className="start-subtitle">District0 · Lagos-inspired neighbourhood</p>
        <button className="start-button" type="button" onClick={onStart}>
          Enter District0
        </button>
        <p className="control-hint">
          WASD / arrow keys to move · drag to look · wheel to zoom
          <br />
          On mobile: left stick to move · drag right to look · pinch to zoom
        </p>
      </div>
    </section>
  );
}
