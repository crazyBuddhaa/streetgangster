export interface BuildingSpec {
  id: string;
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  color: string;
  roofColor: string;
}

export interface BoxCollider {
  id: string;
  x: number;
  z: number;
  halfWidth: number;
  halfDepth: number;
}

export const MAP_BOUNDS = {
  minX: -24,
  maxX: 24,
  minZ: -34,
  maxZ: 34,
};

export const BUILDINGS: BuildingSpec[] = [
  { id: 'west-corner-house', x: -12, z: -24, width: 4.8, depth: 6, height: 4.8, color: '#b9634a', roofColor: '#68483d' },
  { id: 'west-blue-house', x: -16, z: -11, width: 5, depth: 5.4, height: 3.8, color: '#66847d', roofColor: '#465c57' },
  { id: 'west-clay-house', x: -12, z: 12, width: 4.6, depth: 6, height: 4.2, color: '#c28b55', roofColor: '#75553d' },
  { id: 'west-long-house', x: -17, z: 28, width: 5, depth: 5.4, height: 4.7, color: '#9d6655', roofColor: '#5e4941' },
  { id: 'east-cream-house', x: 13, z: -25, width: 5, depth: 5.4, height: 4.2, color: '#c5ad7d', roofColor: '#766748' },
  { id: 'east-green-house', x: 17, z: -6, width: 4.7, depth: 5.5, height: 4.9, color: '#768d68', roofColor: '#4d6146' },
  { id: 'east-pink-house', x: 12, z: 13, width: 5.5, depth: 5.8, height: 3.9, color: '#b87362', roofColor: '#664b43' },
  { id: 'east-market-house', x: 17, z: 29, width: 5, depth: 5.4, height: 4.5, color: '#a68a65', roofColor: '#62543f' },
];

export const KIOSK = { x: 7.1, z: -16, halfWidth: 1.45, halfDepth: 1.2 };
export const GENERATOR = { x: 10, z: -16, halfWidth: 0.68, halfDepth: 0.55 };
export const DANFO = { x: 3.05, z: 10, halfWidth: 1.18, halfDepth: 2.65 };
export const FENCE = { x: 21, z: 17, halfWidth: 0.38, halfDepth: 5.2 };
export const ARENA_SPOT = { x: 8, z: 23, width: 7.6, depth: 5.6 };

export const SOLID_COLLIDERS: BoxCollider[] = [
  ...BUILDINGS.map((building) => ({
    id: building.id,
    x: building.x,
    z: building.z,
    halfWidth: building.width / 2,
    halfDepth: building.depth / 2,
  })),
  { id: 'kiosk', ...KIOSK },
  { id: 'generator', ...GENERATOR },
  { id: 'danfo', ...DANFO },
  { id: 'fence', ...FENCE },
];
