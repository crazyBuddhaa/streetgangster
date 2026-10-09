import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Group } from 'three';
import { moveWithCollisions } from '../controls/collision';
import type { GameInputRef, PlayerPositionRef } from '../types';

export const PLAYER_SPEED = 2.4;

interface PlayerProps {
  inputRef: GameInputRef;
  playerPositionRef: PlayerPositionRef;
}

export function Player({ inputRef, playerPositionRef }: PlayerProps) {
  const groupRef = useRef<Group>(null);
  const facing = useRef(0);

  useFrame((_, delta) => {
    const player = playerPositionRef.current;
    const input = inputRef.current;
    const strafe = input.strafe;
    const forward = input.forward;
    const inputLength = Math.hypot(strafe, forward);

    if (inputLength > 0.04) {
      const unitStrafe = strafe / Math.max(1, inputLength);
      const unitForward = forward / Math.max(1, inputLength);
      const yaw = input.cameraYaw;
      const moveX = unitStrafe * Math.cos(yaw) + unitForward * Math.sin(yaw);
      const moveZ = -unitStrafe * Math.sin(yaw) + unitForward * Math.cos(yaw);
      const distance = PLAYER_SPEED * Math.min(delta, 0.05);
      const next = moveWithCollisions(
        player.x,
        player.z,
        moveX * distance,
        moveZ * distance,
      );
      player.x = next.x;
      player.z = next.z;

      const targetFacing = Math.atan2(moveX, moveZ);
      const angleDelta = Math.atan2(
        Math.sin(targetFacing - facing.current),
        Math.cos(targetFacing - facing.current),
      );
      facing.current += angleDelta * (1 - Math.exp(-12 * delta));
    }

    if (groupRef.current) {
      groupRef.current.position.set(player.x, 0, player.z);
      groupRef.current.rotation.y = facing.current;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0.98, 0]}>
        <boxGeometry args={[0.62, 0.88, 0.38]} />
        <meshStandardMaterial color="#315e66" flatShading />
      </mesh>
      <mesh position={[0, 1.63, 0.02]}>
        <sphereGeometry args={[0.29, 8, 6]} />
        <meshStandardMaterial color="#81583f" flatShading />
      </mesh>
      <mesh position={[0, 1.69, 0.29]}>
        <boxGeometry args={[0.1, 0.07, 0.035]} />
        <meshStandardMaterial color="#e1c28a" flatShading />
      </mesh>
      <mesh position={[-0.39, 0.97, 0]}>
        <boxGeometry args={[0.17, 0.62, 0.2]} />
        <meshStandardMaterial color="#81583f" flatShading />
      </mesh>
      <mesh position={[0.39, 0.97, 0]}>
        <boxGeometry args={[0.17, 0.62, 0.2]} />
        <meshStandardMaterial color="#81583f" flatShading />
      </mesh>
      <mesh position={[-0.16, 0.22, 0.03]}>
        <boxGeometry args={[0.2, 0.42, 0.24]} />
        <meshStandardMaterial color="#272d31" flatShading />
      </mesh>
      <mesh position={[0.16, 0.22, 0.03]}>
        <boxGeometry args={[0.2, 0.42, 0.24]} />
        <meshStandardMaterial color="#272d31" flatShading />
      </mesh>
    </group>
  );
}
