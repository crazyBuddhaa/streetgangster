import { FollowCamera } from './camera/FollowCamera';
import { Player } from './player/Player';
import { World } from './world/World';
import type { CameraOccludersRef, GameInputRef, PlayerPositionRef } from './types';

interface GameSceneProps {
  inputRef: GameInputRef;
  playerPositionRef: PlayerPositionRef;
  cameraOccludersRef: CameraOccludersRef;
}

export function GameScene({
  inputRef,
  playerPositionRef,
  cameraOccludersRef,
}: GameSceneProps) {
  return (
    <>
      <color attach="background" args={['#7bc4bb']} />
      <fog attach="fog" args={['#7bc4bb', 95, 175]} />
      <ambientLight intensity={1.45} />
      <directionalLight position={[-14, 24, 12]} intensity={1.4} color="#fff0d5" />
      <World cameraOccludersRef={cameraOccludersRef} />
      <Player inputRef={inputRef} playerPositionRef={playerPositionRef} />
      <FollowCamera
        inputRef={inputRef}
        playerPositionRef={playerPositionRef}
        cameraOccludersRef={cameraOccludersRef}
      />
    </>
  );
}
