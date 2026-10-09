import type { MutableRefObject } from 'react';
import type { Vector3 } from 'three';

export interface GameInput {
  strafe: number;
  forward: number;
  cameraYaw: number;
}

export type GameInputRef = MutableRefObject<GameInput>;
export type PlayerPositionRef = MutableRefObject<Vector3>;
