interface HUDProps {
  onToggleZoom: () => void;
}

export function HUD({ onToggleZoom }: HUDProps) {
  return (
    <aside className="hud" aria-label="Game status">
      <div className="hud-card">
        <span className="hud-label">Player</span>
        <strong className="hud-value">Rookie</strong>
      </div>
      <div className="hud-card">
        <span className="hud-label">Map</span>
        <strong className="hud-value">District0</strong>
      </div>
      <div className="hud-card health-card">
        <span className="hud-label">Health</span>
        <div
          className="health-track"
          role="meter"
          aria-label="Health"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={78}
        >
          <div className="health-fill" />
        </div>
        <span className="health-value">78%</span>
      </div>
      <button
        className="zoom-toggle"
        type="button"
        onClick={onToggleZoom}
        aria-label="Toggle close and far camera view"
      >
        <span className="hud-label">Camera</span>
        <strong>CLOSE / FAR</strong>
      </button>
    </aside>
  );
}
