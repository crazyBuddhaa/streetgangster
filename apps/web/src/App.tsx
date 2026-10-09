import { Canvas } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { Vector3 } from 'three';
import { HUD } from './components/HUD';
import { StartScreen } from './components/StartScreen';
import { CameraLookArea } from './game/controls/CameraLookArea';
import { useGameControls } from './game/controls/useGameControls';
import { VirtualJoystick } from './game/controls/VirtualJoystick';
import { GameScene } from './game/GameScene';

export default function App() {
  const [playing, setPlaying] = useState(false);
  const controls = useGameControls(playing);
  const playerPosition = useRef(new Vector3(0, 0, 18));

  return (
    <main
      className="game-root"
      onContextMenu={(event) => event.preventDefault()}
      onDragStart={(event) => event.preventDefault()}
    >
      <Canvas
        className="scene-canvas"
        camera={{ position: [0, 4, 11], fov: 55, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: 'low-power' }}
        shadows={false}
      >
        <GameScene inputRef={controls.inputRef} playerPositionRef={playerPosition} />
      </Canvas>

      {playing && <CameraLookArea onLookDelta={controls.rotateCamera} />}
      {playing && <HUD />}
      {playing && <VirtualJoystick onMove={controls.setJoystick} />}
      {!playing && <StartScreen onStart={() => setPlaying(true)} />}
    </main>
  );
}
