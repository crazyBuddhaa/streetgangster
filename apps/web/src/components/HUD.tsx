import { useState } from 'react';
import { DistrictMap } from './DistrictMap';

interface HUDProps {
  onToggleZoom: () => void;
  playerPosition: [number, number];
}

export function HUD({ onToggleZoom, playerPosition }: HUDProps) {
  const [mapOpen, setMapOpen] = useState(false);

  return (
    <aside className="hud" aria-label="Game status">
      <div className="hud-profile">
        <div className="hud-avatar" aria-hidden="true">R</div>
        <div className="hud-profile-copy">
          <span className="hud-label">Street rep</span>
          <strong className="hud-value">Rookie</strong>
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
        </div>
        <span className="health-value">78%</span>
      </div>

      <div className="hud-actions">
        <button
          className={`map-toggle${mapOpen ? ' is-active' : ''}`}
          type="button"
          onClick={() => setMapOpen((open) => !open)}
          aria-expanded={mapOpen}
          aria-controls="district-map"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m3.5 6 5.7-2 5.6 2 5.7-2v14l-5.7 2-5.6-2-5.7 2V6Z" />
            <path d="M9.2 4v14M14.8 6v14" />
            <circle cx="12" cy="11" r="1.35" />
          </svg>
          <span>Map</span>
        </button>

        <button
          className="zoom-toggle"
          type="button"
          onClick={onToggleZoom}
          aria-label="Toggle close and far camera view"
        >
          <span className="hud-label">Camera</span>
          <strong>Close / far</strong>
        </button>
      </div>

      {mapOpen && (
        <DistrictMap
          playerPosition={playerPosition}
          onClose={() => setMapOpen(false)}
        />
      )}
    </aside>
  );
}
