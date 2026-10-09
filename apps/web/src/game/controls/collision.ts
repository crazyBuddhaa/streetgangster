import { MAP_BOUNDS, SOLID_COLLIDERS } from '../world/mapData';

const PLAYER_RADIUS = 0.42;
const MAX_STEP = 0.28;

function isBlocked(x: number, z: number): boolean {
  if (
    x - PLAYER_RADIUS < MAP_BOUNDS.minX ||
    x + PLAYER_RADIUS > MAP_BOUNDS.maxX ||
    z - PLAYER_RADIUS < MAP_BOUNDS.minZ ||
    z + PLAYER_RADIUS > MAP_BOUNDS.maxZ
  ) {
    return true;
  }

  return SOLID_COLLIDERS.some((box) => {
    const closestX = Math.max(box.x - box.halfWidth, Math.min(x, box.x + box.halfWidth));
    const closestZ = Math.max(box.z - box.halfDepth, Math.min(z, box.z + box.halfDepth));
    const dx = x - closestX;
    const dz = z - closestZ;
    return dx * dx + dz * dz < PLAYER_RADIUS * PLAYER_RADIUS;
  });
}

export function moveWithCollisions(
  x: number,
  z: number,
  dx: number,
  dz: number,
): { x: number; z: number } {
  const steps = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dz)) / MAX_STEP));
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
