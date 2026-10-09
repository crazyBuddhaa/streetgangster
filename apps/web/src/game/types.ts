import type { MutableRefObject } from 'react';
import type { Group, Vector3 } from 'three';

export interface GameInput {
  strafe: number;
  forward: number;
  cameraYaw: number;
  zoom: number;
}

export type GameInputRef = MutableRefObject<GameInput>;
export type PlayerPositionRef = MutableRefObject<Vector3>;
export type CameraOccludersRef = MutableRefObject<Group[]>;
