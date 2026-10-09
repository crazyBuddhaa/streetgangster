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
      <color attach="background" args={['#c9b58e']} />
      <fog attach="fog" args={['#c9b58e', 80, 145]} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[-14, 24, 12]} intensity={1.35} />
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
