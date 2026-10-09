import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { Vector3 } from 'three';
import type { GameInputRef, PlayerPositionRef } from '../types';

interface FollowCameraProps {
  inputRef: GameInputRef;
  playerPositionRef: PlayerPositionRef;
}

const WORLD_UP = new Vector3(0, 1, 0);

export function FollowCamera({ inputRef, playerPositionRef }: FollowCameraProps) {
  const { camera } = useThree();
  const desired = useRef(new Vector3());
  const lookTarget = useRef(new Vector3());
  const offset = useRef(new Vector3());

  useFrame((_, delta) => {
    const player = playerPositionRef.current;
    offset.current.set(0, 3.15, -7.2).applyAxisAngle(WORLD_UP, inputRef.current.cameraYaw);
    desired.current.set(player.x, 0, player.z).add(offset.current);
    camera.position.lerp(desired.current, 1 - Math.exp(-5.5 * delta));
    lookTarget.current.set(player.x, 1.15, player.z + 0.25);
    camera.lookAt(lookTarget.current);
  });

  return null;
}
