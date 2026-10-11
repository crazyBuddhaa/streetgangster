import { Canvas, useFrame } from '@react-three/fiber';
import { useCallback, useRef, useState } from 'react';
import { Group, Vector3 } from 'three';
import { HUD } from './HUD';
import { CameraLookArea } from '../game/controls/CameraLookArea';
import { useGameControls } from '../game/controls/useGameControls';
import { VirtualJoystick } from '../game/controls/VirtualJoystick';
import { GameScene } from '../game/GameScene';
import { PLAYER_START } from '../game/world/district0';

function PlayerMapTracker({
  playerPositionRef,
  onUpdate,
}: {
  playerPositionRef: React.MutableRefObject<Vector3>;
  onUpdate: (position: [number, number]) => void;
}) {
  const elapsed = useRef(0);
  const lastSent = useRef<[number, number]>([
    playerPositionRef.current.x,
    playerPositionRef.current.z,
  ]);

  useFrame((_, delta) => {
    elapsed.current += delta;
    if (elapsed.current < 0.12) return;

    elapsed.current = 0;
    const position = playerPositionRef.current;
    if (Math.hypot(position.x - lastSent.current[0], position.z - lastSent.current[1]) < 0.2) {
      return;
    }

    lastSent.current = [position.x, position.z];
    onUpdate(lastSent.current);
  });

  return null;
}

export default function GameViewport() {
  const controls = useGameControls(true);
  const playerPosition = useRef(new Vector3(...PLAYER_START));
  const cameraOccludersRef = useRef<Group[]>([]);
  const [mapPosition, setMapPosition] = useState<[number, number]>([
    PLAYER_START[0],
    PLAYER_START[2],
  ]);

  const toggleZoom = useCallback(() => {
    controls.setZoom(controls.inputRef.current.zoom < 0.5 ? 1 : 0);
  }, [controls.inputRef, controls.setZoom]);
  const updateMapPosition = useCallback((position: [number, number]) => {
    setMapPosition(position);
  }, []);

  return (
    <div className="game-viewport">
      <Canvas
        className="scene-canvas"
        camera={{ position: [0, 6, 12], fov: 45, near: 0.1, far: 180 }}
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: 'low-power' }}
        shadows={false}
      >
        <GameScene
          inputRef={controls.inputRef}
          playerPositionRef={playerPosition}
          cameraOccludersRef={cameraOccludersRef}
        />
        <PlayerMapTracker
          playerPositionRef={playerPosition}
          onUpdate={updateMapPosition}
        />
      </Canvas>
      <CameraLookArea
        onLookDelta={controls.rotateCamera}
        onZoomDelta={controls.zoomBy}
      />
      <HUD onToggleZoom={toggleZoom} playerPosition={mapPosition} />
      <VirtualJoystick onMove={controls.setJoystick} />
    </div>
  );
}
