import { FollowCamera } from './camera/FollowCamera';
import { Player } from './player/Player';
import { World } from './world/World';
import type { GameInputRef, PlayerPositionRef } from './types';

interface GameSceneProps {
  inputRef: GameInputRef;
  playerPositionRef: PlayerPositionRef;
}

export function GameScene({ inputRef, playerPositionRef }: GameSceneProps) {
  return (
    <>
      <color attach="background" args={['#c9b58e']} />
      <fog attach="fog" args={['#c9b58e', 48, 92]} />
      <ambientLight intensity={1.35} />
      <directionalLight position={[-14, 24, 12]} intensity={1.9} />
      <World />
      <Player inputRef={inputRef} playerPositionRef={playerPositionRef} />
      <FollowCamera inputRef={inputRef} playerPositionRef={playerPositionRef} />
    </>
  );
}
