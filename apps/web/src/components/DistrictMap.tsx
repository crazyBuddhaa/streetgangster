import { DISTRICT0_ITEMS, DISTRICT0_LANDMARKS, MAP_BOUNDS } from '../game/world/district0';

interface DistrictMapProps {
  playerPosition: [number, number];
  onClose: () => void;
}

const MAP_FRAME = { x: 22, y: 10, width: 176, height: 176 };
const VIEW_WIDTH = 220;
const VIEW_HEIGHT = 200;

function mapX(x: number) {
  return MAP_FRAME.x + ((x - MAP_BOUNDS.minX) / (MAP_BOUNDS.maxX - MAP_BOUNDS.minX)) * MAP_FRAME.width;
}

function mapY(z: number) {
  return MAP_FRAME.y + ((z - MAP_BOUNDS.minZ) / (MAP_BOUNDS.maxZ - MAP_BOUNDS.minZ)) * MAP_FRAME.height;
}

function mapRect(item: (typeof DISTRICT0_ITEMS)[number]) {
  const left = mapX(item.position[0] - item.size[0] / 2);
  const right = mapX(item.position[0] + item.size[0] / 2);
  const top = mapY(item.position[2] - item.size[2] / 2);
  const bottom = mapY(item.position[2] + item.size[2] / 2);

  return {
    x: left,
    y: top,
    width: Math.max(1.1, right - left),
    height: Math.max(1.1, bottom - top),
  };
}

const roads = DISTRICT0_ITEMS.filter((item) => item.type === 'road');
const streets = DISTRICT0_ITEMS.filter((item) => item.type === 'street');
const medians = DISTRICT0_ITEMS.filter((item) => item.type === 'median');
const trees = DISTRICT0_ITEMS.filter((item) => item.type === 'tree');

export function DistrictMap({ playerPosition, onClose }: DistrictMapProps) {
  const [playerX, playerZ] = playerPosition;
  const playerMapX = mapX(playerX);
  const playerMapY = mapY(playerZ);

  return (
    <section className="map-panel" id="district-map" aria-label="District0 map">
      <header className="map-panel-header">
        <div>
          <span className="map-kicker">Field guide · Lagos</span>
          <h2>District0</h2>
        </div>
        <button className="map-close" type="button" onClick={onClose} aria-label="Close map">
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="m5 5 10 10M15 5 5 15" />
          </svg>
        </button>
      </header>

      <div className="map-art">
        <svg
          className="district-map-svg"
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          role="img"
          aria-label="Schematic map showing District0 roads, landmarks, and your position"
        >
          <defs>
            <pattern id="map-water-dots" width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="0.8" fill="#4d9891" opacity="0.38" />
            </pattern>
            <filter id="map-island-shadow" x="-20%" y="-20%" width="140%" height="150%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#244a46" floodOpacity="0.22" />
            </filter>
          </defs>

          <rect width={VIEW_WIDTH} height={VIEW_HEIGHT} rx="12" fill="#86cfc2" />
          <rect width={VIEW_WIDTH} height={VIEW_HEIGHT} rx="12" fill="url(#map-water-dots)" />
          <path
            d="M47 12c-15 1-24 10-25 25l.2 124c.2 14 10 23 25 25l126 0c15-.3 24-10 25-25V37c-.5-15-10-24-25-25Z"
            fill="#78ad79"
            stroke="#365f55"
            strokeWidth="2"
            filter="url(#map-island-shadow)"
          />

          {trees.map((item) => {
            const x = mapX(item.position[0]);
            const y = mapY(item.position[2]);
            return <circle key={item.id} cx={x} cy={y} r="2.15" fill="#527e57" opacity="0.82" />;
          })}

          {roads.map((item) => {
            const rect = mapRect(item);
            return (
              <rect
                key={item.id}
                {...rect}
                rx="2.5"
                fill="#665d50"
                stroke="#d1c09a"
                strokeWidth="1.4"
              />
            );
          })}

          {streets.map((item) => {
            const rect = mapRect(item);
            return (
              <rect
                key={item.id}
                {...rect}
                rx="1.2"
                fill="#c8b792"
                stroke="#e2d4b4"
                strokeWidth="0.8"
              />
            );
          })}

          {medians.map((item) => {
            const rect = mapRect(item);
            return <rect key={item.id} {...rect} rx="1" fill="#83a864" stroke="#b5cb85" strokeWidth="0.7" />;
          })}

          <circle
            cx={mapX(0)}
            cy={mapY(0)}
            r="8"
            fill="#d6c8a7"
            stroke="#665d50"
            strokeWidth="2"
          />
          <circle cx={mapX(0)} cy={mapY(0)} r="3" fill="#d8845b" />

          {DISTRICT0_LANDMARKS.map((item) => {
            const x = mapX(item.position[0]);
            const y = mapY(item.position[2]);
            const isOpenSpace = item.landmark === 'footballPitch' || item.landmark === 'arena';

            return (
              <g key={item.id}>
                <title>{item.label ?? item.id}</title>
                <circle cx={x} cy={y} r="5.2" fill="#f6efd9" stroke="#344f49" strokeWidth="1.8" />
                <circle cx={x} cy={y} r="2.35" fill={isOpenSpace ? '#739455' : '#d8845b'} />
              </g>
            );
          })}

          <circle className="map-player-pulse" cx={playerMapX} cy={playerMapY} r="8.5" />
          <circle cx={playerMapX} cy={playerMapY} r="4.2" fill="#ef9c67" stroke="#263f3c" strokeWidth="2" />
          <text x="184" y="23" className="map-compass">N</text>
        </svg>
      </div>

      <div className="map-legend" aria-label="Map legend">
        <span><i className="legend-you" />You</span>
        <span><i className="legend-place" />Landmark</span>
        <span><i className="legend-green" />Open space</span>
      </div>

      <ul className="map-landmark-list" aria-label="District locations">
        {DISTRICT0_LANDMARKS.map((item) => (
          <li key={item.id}>
            <i className={item.landmark === 'footballPitch' || item.landmark === 'arena' ? 'place-dot place-dot-green' : 'place-dot'} />
            {item.label ?? item.id}
          </li>
        ))}
      </ul>

      <footer className="map-position">
        <span>Your position</span>
        <strong>{Math.round(playerX)} · {Math.round(playerZ)}</strong>
      </footer>
    </section>
  );
}
