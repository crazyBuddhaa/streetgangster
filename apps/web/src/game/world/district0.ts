export const MAP_NAME = 'District0';
export const MAP_SIZE = 100;
export const MAP_BOUNDS = {
  minX: -MAP_SIZE / 2,
  maxX: MAP_SIZE / 2,
  minZ: -MAP_SIZE / 2,
  maxZ: MAP_SIZE / 2,
} as const;
export const PLAYER_START: [number, number, number] = [0, 0, -8];

export type LandmarkKind =
  | 'mosque'
  | 'church'
  | 'hospital'
  | 'market'
  | 'kioskRow'
  | 'busPark'
  | 'generatorYard'
  | 'footballPitch'
  | 'arena';

export type DistrictItemType =
  | 'road'
  | 'street'
  | 'median'
  | 'roundabout'
  | 'building'
  | 'tree'
  | 'kiosk'
  | 'marketStall'
  | 'generator'
  | 'danfo'
  | 'fence'
  | 'streetLamp';

export type ColliderShape = 'box' | 'circle';
export type Vec3 = [number, number, number];

export interface DistrictItem {
  id: string;
  type: DistrictItemType;
  position: Vec3;
  /** Full world-space dimensions in x, y, z order. */
  size: Vec3;
  /** Rotation around the vertical axis, in radians. */
  rotation: number;
  color?: string;
  roofColor?: string;
  label?: string;
  landmark?: LandmarkKind;
  collider?: ColliderShape;
}

export interface MapCollider {
  id: string;
  position: Vec3;
  size: Vec3;
  rotation: number;
  shape: ColliderShape;
}

const BLOCK_CENTERS = [-36, 0, 36] as const;
const MAIN_ROAD_OFFSETS = [-18, 18] as const;
const TREE_OFFSETS: Array<[number, number]> = [
  [-10, -10],
  [10, 10],
  [-10, 10],
];

const landmarkItems: DistrictItem[] = [
  { id: 'mosque', type: 'building', landmark: 'mosque', label: 'Mosque', position: [-36, 0, -36], size: [17, 6, 14], rotation: 0, color: '#c9b37f', roofColor: '#967846', collider: 'box' },
  { id: 'church', type: 'building', landmark: 'church', label: 'Church', position: [0, 0, -36], size: [17, 7, 14], rotation: 0, color: '#c98b61', roofColor: '#70483d', collider: 'box' },
  { id: 'hospital', type: 'building', landmark: 'hospital', label: 'Hospital', position: [36, 0, -36], size: [18, 5, 14], rotation: 0, color: '#d6d2bd', roofColor: '#9caa9d', collider: 'box' },
  { id: 'market', type: 'building', landmark: 'market', label: 'Market', position: [-36, 0, 0], size: [18, 4, 14], rotation: 0, color: '#c2874e', roofColor: '#8e553a', collider: 'box' },
  { id: 'kiosk-row', type: 'building', landmark: 'kioskRow', label: 'Kiosk Row', position: [0, 0, 10], size: [18, 3.2, 5], rotation: 0, color: '#d6a351', roofColor: '#8f563c', collider: 'box' },
  { id: 'bus-park', type: 'building', landmark: 'busPark', label: 'Bus Park', position: [36, 0, 0], size: [18, 4, 13], rotation: 0, color: '#d1b778', roofColor: '#806c49', collider: 'box' },
  { id: 'generator-yard', type: 'building', landmark: 'generatorYard', label: 'Generator Yard', position: [-36, 0, 36], size: [16, 3.6, 13], rotation: 0, color: '#88877b', roofColor: '#4f514c', collider: 'box' },
  { id: 'football-pitch', type: 'building', landmark: 'footballPitch', label: 'Football Pitch', position: [0, 0, 36], size: [20, 0.12, 15], rotation: 0, color: '#568452', roofColor: '#e6d9a9' },
  { id: 'arena-patch', type: 'building', landmark: 'arena', label: 'Arena', position: [36, 0, 36], size: [18, 0.12, 16], rotation: 0, color: '#927d59', roofColor: '#d7b86e' },
];

const mainRoads: DistrictItem[] = MAIN_ROAD_OFFSETS.flatMap((offset, index) => [
  {
    id: `main-road-north-south-${index}`,
    type: 'road' as const,
    position: [offset, -0.045, 0] as Vec3,
    size: [8, 0.1, MAP_SIZE] as Vec3,
    rotation: 0,
  },
  {
    id: `main-road-east-west-${index}`,
    type: 'road' as const,
    position: [0, -0.045, offset] as Vec3,
    size: [MAP_SIZE, 0.1, 8] as Vec3,
    rotation: 0,
  },
  {
    id: `green-median-north-south-${index}`,
    type: 'median' as const,
    position: [offset, 0.025, 0] as Vec3,
    size: [1.15, 0.16, MAP_SIZE - 4] as Vec3,
    rotation: 0,
  },
  {
    id: `green-median-east-west-${index}`,
    type: 'median' as const,
    position: [0, 0.025, offset] as Vec3,
    size: [MAP_SIZE - 4, 0.16, 1.15] as Vec3,
    rotation: 0,
  },
]);

const sideStreets: DistrictItem[] = BLOCK_CENTERS.flatMap((z, row) =>
  BLOCK_CENTERS.flatMap((x, column) => [
    {
      id: `side-street-horizontal-${row}-${column}`,
      type: 'street' as const,
      position: [x, -0.012, z + 11.5] as Vec3,
      size: [25, 0.055, 2.3] as Vec3,
      rotation: 0,
    },
    {
      id: `side-street-vertical-${row}-${column}`,
      type: 'street' as const,
      position: [x - 11.5, -0.012, z] as Vec3,
      size: [2.3, 0.055, 25] as Vec3,
      rotation: 0,
    },
  ]),
);

const trees: DistrictItem[] = BLOCK_CENTERS.flatMap((z, row) =>
  BLOCK_CENTERS.flatMap((x, column) =>
    TREE_OFFSETS.map(([dx, dz], treeIndex) => ({
      id: `tree-${row}-${column}-${treeIndex}`,
      type: 'tree' as const,
      position: [x + dx, 0, z + dz] as Vec3,
      size: [1.15, 4.5, 1.15] as Vec3,
      rotation: 0,
    })),
  ),
);

const streetLamps: DistrictItem[] = [-44, -30, -5, 5, 30, 44].flatMap((offset, index) => [
  {
    id: `lamp-north-south-left-${index}`,
    type: 'streetLamp' as const,
    position: [-22.4, 0, offset] as Vec3,
    size: [1, 4, 1] as Vec3,
    rotation: 0,
  },
  {
    id: `lamp-north-south-right-${index}`,
    type: 'streetLamp' as const,
    position: [22.4, 0, offset] as Vec3,
    size: [1, 4, 1] as Vec3,
    rotation: 0,
  },
  {
    id: `lamp-east-west-top-${index}`,
    type: 'streetLamp' as const,
    position: [offset, 0, -22.4] as Vec3,
    size: [1, 4, 1] as Vec3,
    rotation: 0,
  },
  {
    id: `lamp-east-west-bottom-${index}`,
    type: 'streetLamp' as const,
    position: [offset, 0, 22.4] as Vec3,
    size: [1, 4, 1] as Vec3,
    rotation: 0,
  },
]);

const kiosks: DistrictItem[] = [-43, -39, -35, -31, -27].map((x, index) => ({
  id: `market-kiosk-${index}`,
  type: 'kiosk',
  position: [x, 0, 10] as Vec3,
  size: [2.7, 2.5, 2.3] as Vec3,
  rotation: 0,
  color: ['#d29a50', '#bd7749', '#dfba68'][index % 3],
  collider: 'box',
}));

const marketStalls: DistrictItem[] = [-43, -38, -33, -28].map((x, index) => ({
  id: `market-stall-${index}`,
  type: 'marketStall',
  position: [x, 0, -9] as Vec3,
  size: [3.2, 2.2, 2.5] as Vec3,
  rotation: 0,
  color: ['#b86246', '#d2a04f', '#59766c', '#c47d52'][index],
  collider: 'box',
}));

const generators: DistrictItem[] = [-42, -36, -30].map((x, index) => ({
  id: `yard-generator-${index}`,
  type: 'generator',
  position: [x, 0, 45] as Vec3,
  size: [2.2, 1.7, 1.8] as Vec3,
  rotation: index % 2 === 0 ? 0 : Math.PI / 2,
  collider: 'box',
}));

const danfo: DistrictItem[] = [
  {
    id: 'parked-danfo',
    type: 'danfo',
    position: [36, 0, 7] as Vec3,
    size: [2.3, 2.3, 5.1] as Vec3,
    rotation: Math.PI,
    collider: 'box',
  },
];

const fences: DistrictItem[] = [
  { id: 'yard-fence-north', type: 'fence', position: [-36, 0, 26] as Vec3, size: [21, 1.4, 0.22] as Vec3, rotation: 0, collider: 'box' },
  { id: 'yard-fence-south', type: 'fence', position: [-36, 0, 48] as Vec3, size: [21, 1.4, 0.22] as Vec3, rotation: 0, collider: 'box' },
  { id: 'yard-fence-west', type: 'fence', position: [-47, 0, 37] as Vec3, size: [0.22, 1.4, 22] as Vec3, rotation: 0, collider: 'box' },
  { id: 'yard-fence-east', type: 'fence', position: [-25, 0, 37] as Vec3, size: [0.22, 1.4, 22] as Vec3, rotation: 0, collider: 'box' },
  { id: 'pitch-fence-north', type: 'fence', position: [0, 0, 25] as Vec3, size: [22, 1.4, 0.22] as Vec3, rotation: 0, collider: 'box' },
  { id: 'pitch-fence-south', type: 'fence', position: [0, 0, 47] as Vec3, size: [22, 1.4, 0.22] as Vec3, rotation: 0, collider: 'box' },
  { id: 'pitch-fence-west', type: 'fence', position: [-11, 0, 36] as Vec3, size: [0.22, 1.4, 22] as Vec3, rotation: 0, collider: 'box' },
  { id: 'pitch-fence-east', type: 'fence', position: [11, 0, 36] as Vec3, size: [0.22, 1.4, 22] as Vec3, rotation: 0, collider: 'box' },
];

const centralStreets: DistrictItem[] = [
  { id: 'central-cross-street-east-west', type: 'street', position: [0, -0.012, 0] as Vec3, size: [44, 0.055, 3] as Vec3, rotation: 0 },
  { id: 'central-cross-street-north-south', type: 'street', position: [0, -0.012, 0] as Vec3, size: [3, 0.055, 44] as Vec3, rotation: 0 },
];

export const DISTRICT0_ITEMS: DistrictItem[] = [
  ...mainRoads,
  ...sideStreets,
  ...centralStreets,
  { id: 'central-roundabout', type: 'roundabout', position: [0, 0, 0], size: [11.5, 0.18, 11.5], rotation: 0, collider: 'circle' },
  ...landmarkItems,
  ...trees,
  ...streetLamps,
  ...kiosks,
  ...marketStalls,
  ...generators,
  ...danfo,
  ...fences,
];

export const SOLID_COLLIDERS: MapCollider[] = DISTRICT0_ITEMS.flatMap((item) =>
  item.collider
    ? [{
        id: item.id,
        position: item.position,
        size: item.size,
        rotation: item.rotation,
        shape: item.collider,
      }]
    : [],
);
