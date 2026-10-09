import { Html } from '@react-three/drei/web/Html';
import {
  ARENA_SPOT,
  BUILDINGS,
  DANFO,
  FENCE,
  GENERATOR,
  KIOSK,
  MAP_BOUNDS,
} from './mapData';
import type { BuildingSpec } from './mapData';

function Building({ building }: { building: BuildingSpec }) {
  const streetFacing = building.x < 0 ? 1 : -1;
  const wallX = streetFacing * (building.width / 2 + 0.055);

  return (
    <group position={[building.x, 0, building.z]}>
      <mesh position={[0, building.height / 2, 0]}>
        <boxGeometry args={[building.width, building.height, building.depth]} />
        <meshStandardMaterial color={building.color} flatShading />
      </mesh>
      <mesh position={[0, building.height + 0.17, 0]}>
        <boxGeometry args={[building.width + 0.3, 0.34, building.depth + 0.3]} />
        <meshStandardMaterial color={building.roofColor} flatShading />
      </mesh>
      <mesh position={[wallX, 1, 0]}>
        <boxGeometry args={[0.12, 1.9, 0.95]} />
        <meshStandardMaterial color="#473b35" flatShading />
      </mesh>
      <mesh position={[wallX, building.height * 0.67, -building.depth * 0.25]}>
        <boxGeometry args={[0.1, 0.78, 0.82]} />
        <meshStandardMaterial color="#9fc2bd" flatShading />
      </mesh>
      <mesh position={[wallX, building.height * 0.67, building.depth * 0.25]}>
        <boxGeometry args={[0.1, 0.78, 0.82]} />
        <meshStandardMaterial color="#9fc2bd" flatShading />
      </mesh>
    </group>
  );
}

function Kiosk() {
  return (
    <group position={[KIOSK.x, 0, KIOSK.z]}>
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[2.8, 1.8, 2.3]} />
        <meshStandardMaterial color="#d29a50" flatShading />
      </mesh>
      <mesh position={[0, 1.9, 0]}>
        <boxGeometry args={[3.05, 0.22, 2.5]} />
        <meshStandardMaterial color="#7a4c39" flatShading />
      </mesh>
      <mesh position={[0, 0.92, 1.18]}>
        <boxGeometry args={[2.2, 0.52, 0.12]} />
        <meshStandardMaterial color="#714e38" flatShading />
      </mesh>
      <mesh position={[0, 1.48, 1.19]}>
        <boxGeometry args={[1.8, 0.13, 0.13]} />
        <meshStandardMaterial color="#e4c886" flatShading />
      </mesh>
    </group>
  );
}

function Generator() {
  return (
    <group position={[GENERATOR.x, 0, GENERATOR.z]}>
      <mesh position={[0, 0.48, 0]}>
        <boxGeometry args={[1.25, 0.92, 1.02]} />
        <meshStandardMaterial color="#4d5550" flatShading />
      </mesh>
      <mesh position={[0, 0.98, -0.08]}>
        <boxGeometry args={[1.05, 0.13, 0.76]} />
        <meshStandardMaterial color="#313a36" flatShading />
      </mesh>
      <mesh position={[0, 0.48, 0.53]}>
        <boxGeometry args={[0.68, 0.42, 0.035]} />
        <meshStandardMaterial color="#b67b3d" flatShading />
      </mesh>
    </group>
  );
}

function Danfo() {
  return (
    <group position={[DANFO.x, 0, DANFO.z]}>
      <mesh position={[0, 0.88, 0]}>
        <boxGeometry args={[2.18, 1.32, 4.9]} />
        <meshStandardMaterial color="#d8bd35" flatShading />
      </mesh>
      <mesh position={[0, 1.63, -0.72]}>
        <boxGeometry args={[1.98, 0.76, 2.35]} />
        <meshStandardMaterial color="#d8bd35" flatShading />
      </mesh>
      <mesh position={[0, 1.66, 0.47]}>
        <boxGeometry args={[1.88, 0.5, 0.055]} />
        <meshStandardMaterial color="#38535a" flatShading />
      </mesh>
      <mesh position={[0, 1.18, -2.48]}>
        <boxGeometry args={[1.86, 0.3, 0.08]} />
        <meshStandardMaterial color="#e6d8a0" flatShading />
      </mesh>
      <mesh position={[-1.09, 0.38, -1.55]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.38, 0.38, 0.18, 8]} />
        <meshStandardMaterial color="#262b2d" flatShading />
      </mesh>
      <mesh position={[1.09, 0.38, -1.55]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.38, 0.38, 0.18, 8]} />
        <meshStandardMaterial color="#262b2d" flatShading />
      </mesh>
      <mesh position={[-1.09, 0.38, 1.55]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.38, 0.38, 0.18, 8]} />
        <meshStandardMaterial color="#262b2d" flatShading />
      </mesh>
      <mesh position={[1.09, 0.38, 1.55]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.38, 0.38, 0.18, 8]} />
        <meshStandardMaterial color="#262b2d" flatShading />
      </mesh>
    </group>
  );
}

function Fence() {
  return (
    <group position={[FENCE.x, 0, FENCE.z]}>
      {[ -5, -3, -1, 1, 3, 5 ].map((z) => (
        <mesh key={z} position={[0, 0.75, z]}>
          <boxGeometry args={[0.18, 1.5, 0.18]} />
          <meshStandardMaterial color="#705b45" flatShading />
        </mesh>
      ))}
      <mesh position={[0, 0.72, 0]}>
        <boxGeometry args={[0.12, 0.13, 10]} />
        <meshStandardMaterial color="#9c805d" flatShading />
      </mesh>
      <mesh position={[0, 1.36, 0]}>
        <boxGeometry args={[0.12, 0.13, 10]} />
        <meshStandardMaterial color="#9c805d" flatShading />
      </mesh>
    </group>
  );
}

function ArenaSpot() {
  const borderY = 0.045;
  return (
    <group position={[ARENA_SPOT.x, 0, ARENA_SPOT.z]}>
      <mesh position={[0, 0.018, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[ARENA_SPOT.width, ARENA_SPOT.depth]} />
        <meshStandardMaterial color="#927b58" />
      </mesh>
      <mesh position={[0, borderY, -ARENA_SPOT.depth / 2]}>
        <boxGeometry args={[ARENA_SPOT.width, 0.06, 0.1]} />
        <meshStandardMaterial color="#d2ad5f" />
      </mesh>
      <mesh position={[0, borderY, ARENA_SPOT.depth / 2]}>
        <boxGeometry args={[ARENA_SPOT.width, 0.06, 0.1]} />
        <meshStandardMaterial color="#d2ad5f" />
      </mesh>
      <mesh position={[-ARENA_SPOT.width / 2, borderY, 0]}>
        <boxGeometry args={[0.1, 0.06, ARENA_SPOT.depth]} />
        <meshStandardMaterial color="#d2ad5f" />
      </mesh>
      <mesh position={[ARENA_SPOT.width / 2, borderY, 0]}>
        <boxGeometry args={[0.1, 0.06, ARENA_SPOT.depth]} />
        <meshStandardMaterial color="#d2ad5f" />
      </mesh>
      <Html position={[0, 0.55, 0]} center distanceFactor={12}>
        <div className="start-arena-label">FUTURE ARENA</div>
      </Html>
    </group>
  );
}

export function World() {
  const mapWidth = MAP_BOUNDS.maxX - MAP_BOUNDS.minX;
  const mapDepth = MAP_BOUNDS.maxZ - MAP_BOUNDS.minZ;

  return (
    <>
      <mesh position={[0, -0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[mapWidth, mapDepth]} />
        <meshStandardMaterial color="#a9946b" />
      </mesh>

      <mesh position={[0, -0.025, 0]}>
        <boxGeometry args={[9, 0.08, mapDepth]} />
        <meshStandardMaterial color="#484642" />
      </mesh>
      <mesh position={[0, -0.02, 0]}>
        <boxGeometry args={[mapWidth, 0.08, 8]} />
        <meshStandardMaterial color="#484642" />
      </mesh>
      <mesh position={[-5.15, 0.025, 0]}>
        <boxGeometry args={[1.1, 0.08, mapDepth]} />
        <meshStandardMaterial color="#c2b396" />
      </mesh>
      <mesh position={[5.15, 0.025, 0]}>
        <boxGeometry args={[1.1, 0.08, mapDepth]} />
        <meshStandardMaterial color="#c2b396" />
      </mesh>

      {Array.from({ length: 12 }, (_, index) => {
        const z = -31 + index * 5.5;
        if (z > -4 && z < 4) return null;
        return (
          <mesh key={`road-mark-${index}`} position={[0, 0.035, z]}>
            <boxGeometry args={[0.12, 0.025, 1.65]} />
            <meshStandardMaterial color="#d4c9a4" />
          </mesh>
        );
      })}

      {BUILDINGS.map((building) => (
        <Building key={building.id} building={building} />
      ))}
      <Kiosk />
      <Generator />
      <Danfo />
      <Fence />
      <ArenaSpot />
    </>
  );
}
