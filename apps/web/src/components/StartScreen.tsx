interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <section className="start-screen" aria-label="Start Street Gangster">
      <div className="start-card">
        <p className="start-kicker">Single-player prototype</p>
        <h1>Street Gangster – Build 0.1</h1>
        <p className="start-subtitle">District0 · Lagos-inspired neighbourhood</p>
        <button className="start-button" type="button" onClick={onStart}>
          Enter District0
        </button>
        <p className="control-hint">
          WASD / arrow keys to move · drag to look
          <br />
          On mobile: left stick to move · drag the right side to look
        </p>
      </div>
    </section>
  );
}
