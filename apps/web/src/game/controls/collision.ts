import { MAP_BOUNDS, SOLID_COLLIDERS } from '../world/district0';

export const PLAYER_COLLISION_RADIUS = 0.46;
const MAX_COLLISION_STEP = 0.24;

function isBlocked(x: number, z: number): boolean {
  if (
    x - PLAYER_COLLISION_RADIUS < MAP_BOUNDS.minX ||
    x + PLAYER_COLLISION_RADIUS > MAP_BOUNDS.maxX ||
    z - PLAYER_COLLISION_RADIUS < MAP_BOUNDS.minZ ||
    z + PLAYER_COLLISION_RADIUS > MAP_BOUNDS.maxZ
  ) {
    return true;
  }

  return SOLID_COLLIDERS.some((box) => {
    const dx = x - box.position[0];
    const dz = z - box.position[2];

    if (box.shape === 'circle') {
      const radius = box.size[0] / 2 + PLAYER_COLLISION_RADIUS;
      return dx * dx + dz * dz < radius * radius;
    }

    const cosine = Math.cos(box.rotation);
    const sine = Math.sin(box.rotation);
    const localX = dx * cosine - dz * sine;
    const localZ = dx * sine + dz * cosine;
    const closestX = Math.max(
      -box.size[0] / 2,
      Math.min(localX, box.size[0] / 2),
    );
    const closestZ = Math.max(
      -box.size[2] / 2,
      Math.min(localZ, box.size[2] / 2),
    );
    const gapX = localX - closestX;
    const gapZ = localZ - closestZ;
    return gapX * gapX + gapZ * gapZ < PLAYER_COLLISION_RADIUS * PLAYER_COLLISION_RADIUS;
  });
}

export function moveWithCollisions(
  x: number,
  z: number,
  dx: number,
  dz: number,
): { x: number; z: number } {
  const steps = Math.max(
    1,
    Math.ceil(Math.max(Math.abs(dx), Math.abs(dz)) / MAX_COLLISION_STEP),
  );
  const stepX = dx / steps;
  const stepZ = dz / steps;
  let nextX = x;
  let nextZ = z;

  for (let step = 0; step < steps; step += 1) {
    const candidateX = nextX + stepX;
    if (!isBlocked(candidateX, nextZ)) nextX = candidateX;

    const candidateZ = nextZ + stepZ;
    if (!isBlocked(nextX, candidateZ)) nextZ = candidateZ;
  }

  return { x: nextX, z: nextZ };
}
