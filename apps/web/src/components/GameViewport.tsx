import { Canvas } from '@react-three/fiber';
import { useCallback, useRef } from 'react';
import { Group, Vector3 } from 'three';
import { HUD } from './HUD';
import { CameraLookArea } from '../game/controls/CameraLookArea';
import { useGameControls } from '../game/controls/useGameControls';
import { VirtualJoystick } from '../game/controls/VirtualJoystick';
import { GameScene } from '../game/GameScene';
import { PLAYER_START } from '../game/world/district0';

export default function GameViewport() {
  const controls = useGameControls(true);
  const playerPosition = useRef(new Vector3(...PLAYER_START));
  const cameraOccludersRef = useRef<Group[]>([]);

  const toggleZoom = useCallback(() => {
    controls.setZoom(controls.inputRef.current.zoom < 0.5 ? 1 : 0);
  }, [controls.inputRef, controls.setZoom]);

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
      </Canvas>
      <CameraLookArea
        onLookDelta={controls.rotateCamera}
        onZoomDelta={controls.zoomBy}
      />
      <HUD onToggleZoom={toggleZoom} />
      <VirtualJoystick onMove={controls.setJoystick} />
    </div>
  );
}
