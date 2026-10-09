import { Html } from '@react-three/drei/web/Html';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';
import { Color, Group, InstancedMesh, Object3D, Vector3 } from 'three';
import { MAP_BOUNDS, DISTRICT0_ITEMS } from './district0';
import type { DistrictItem, LandmarkKind, Vec3 } from './district0';
import type { CameraOccludersRef } from '../types';

type InstanceTransform = (item: DistrictItem) => {
  position: Vec3;
  scale: Vec3;
  rotation?: number;
};

const unitBoxTransform: InstanceTransform = (item) => ({
  position: [
    item.position[0],
    item.position[1] + item.size[1] / 2,
    item.position[2],
  ],
  scale: item.size,
  rotation: item.rotation,
});

const kioskRoofTransform: InstanceTransform = (item) => ({
  position: [
    item.position[0],
    item.position[1] + item.size[1] + 0.12,
    item.position[2],
  ],
  scale: [item.size[0] * 1.08, 0.22, item.size[2] * 1.08],
  rotation: item.rotation,
});

const treeTrunkTransform: InstanceTransform = (item) => ({
  position: [item.position[0], item.position[1] + item.size[1] * 0.25, item.position[2]],
  scale: [0.19, item.size[1] * 0.52, 0.19],
  rotation: item.rotation,
});

const treeCanopyTransform: InstanceTransform = (item) => ({
  position: [item.position[0], item.position[1] + item.size[1] * 0.69, item.position[2]],
  scale: [item.size[0], item.size[1] * 0.42, item.size[2]],
  rotation: item.rotation,
});

const lampPoleTransform: InstanceTransform = (item) => ({
  position: [item.position[0], item.position[1] + item.size[1] / 2, item.position[2]],
  scale: [0.1, item.size[1], 0.1],
  rotation: item.rotation,
});

const lampHeadTransform: InstanceTransform = (item) => ({
  position: [item.position[0], item.position[1] + item.size[1] - 0.2, item.position[2]],
  scale: [0.62, 0.18, 0.62],
  rotation: item.rotation,
});

const generatorLidTransform: InstanceTransform = (item) => ({
  position: [item.position[0], item.position[1] + item.size[1] * 0.9, item.position[2]],
  scale: [item.size[0] * 0.82, 0.14, item.size[2] * 0.82],
  rotation: item.rotation,
});

function makeFenceParts(fences: DistrictItem[]) {
  const posts: DistrictItem[] = [];
  const rails: DistrictItem[] = [];

  fences.forEach((fence) => {
    const lengthIsX = fence.size[0] >= fence.size[2];
    const length = lengthIsX ? fence.size[0] : fence.size[2];
    const segments = Math.max(2, Math.ceil(length / 3));
    const cosine = Math.cos(fence.rotation);
    const sine = Math.sin(fence.rotation);

    for (let index = 0; index <= segments; index += 1) {
      const along = -length / 2 + (length * index) / segments;
      const localX = lengthIsX ? along : 0;
      const localZ = lengthIsX ? 0 : along;
      const x = fence.position[0] + localX * cosine + localZ * sine;
      const z = fence.position[2] - localX * sine + localZ * cosine;
      posts.push({
        ...fence,
        id: `${fence.id}-post-${index}`,
        position: [x, 0, z],
        size: [0.14, fence.size[1], 0.14],
        collider: undefined,
      });
    }

    const railSize: Vec3 = lengthIsX
      ? [length, 0.11, 0.11]
      : [0.11, 0.11, length];
    [0.38, 0.78].forEach((height, railIndex) => {
      rails.push({
        ...fence,
        id: `${fence.id}-rail-${railIndex}`,
        position: [
          fence.position[0],
          fence.position[1] + fence.size[1] * height,
          fence.position[2],
        ],
        size: railSize,
        collider: undefined,
      });
    });
  });

  return { posts, rails };
}

function InstanceSet({
  items,
  geometry,
  color,
  transform,
}: {
  items: DistrictItem[];
  geometry: ReactNode;
  color: string;
  transform: InstanceTransform;
}) {
  const meshRef = useRef<InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const object = new Object3D();
    const instanceColor = new Color();

    items.forEach((item, index) => {
      const next = transform(item);
      object.position.set(...next.position);
      object.scale.set(...next.scale);
      object.rotation.set(0, next.rotation ?? item.rotation, 0);
      object.updateMatrix();
      mesh.setMatrixAt(index, object.matrix);
      if (item.color) {
        instanceColor.set(item.color);
        mesh.setColorAt(index, instanceColor);
      }
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [items, transform]);

  if (items.length === 0) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, items.length]}
      castShadow={false}
      receiveShadow={false}
    >
      {geometry}
      <meshStandardMaterial color={color} flatShading />
    </instancedMesh>
  );
}

function Trees({ items }: { items: DistrictItem[] }) {
  return (
    <>
      <InstanceSet
        items={items}
        geometry={<cylinderGeometry args={[0.12, 0.17, 1, 6]} />}
        color="#70513b"
        transform={treeTrunkTransform}
      />
      <InstanceSet
        items={items}
        geometry={<coneGeometry args={[0.9, 1.5, 7]} />}
        color="#55754c"
        transform={treeCanopyTransform}
      />
    </>
  );
}

function Roundabout({ item }: { item: DistrictItem }) {
  const outerRadius = item.size[0] / 2;
  const islandRadius = outerRadius * 0.68;
  return (
    <group position={item.position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[outerRadius, 28]} />
        <meshStandardMaterial color="#494944" flatShading />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, 0]}>
        <circleGeometry args={[islandRadius + 0.28, 24]} />
        <meshStandardMaterial color="#d0c6a2" flatShading />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <circleGeometry args={[islandRadius, 24]} />
        <meshStandardMaterial color="#71875d" flatShading />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.65, 0.9, 0.72, 7]} />
        <meshStandardMaterial color="#c9b27a" flatShading />
      </mesh>
    </group>
  );
}

function LandmarkLabel({
  label,
  height,
  worldPosition,
}: {
  label: string;
  height: number;
  worldPosition: Vector3;
}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const { camera } = useThree();

  useFrame(() => {
    if (!elementRef.current) return;
    const distance = camera.position.distanceTo(worldPosition);
    const fade = Math.max(0, Math.min(1, (76 - distance) / 28));
    elementRef.current.style.opacity = String(fade);
    elementRef.current.style.visibility = fade < 0.03 ? 'hidden' : 'visible';
  });

  return (
    <Html position={[0, height, 0]} center distanceFactor={15}>
      <div ref={elementRef} className="landmark-label">
        {label}
      </div>
    </Html>
  );
}

function LandmarkModel({ item }: { item: DistrictItem }) {
  const [width, height, depth] = item.size;
  const kind = item.landmark as LandmarkKind;
  const bodyColor = item.color ?? '#bd9463';
  const roofColor = item.roofColor ?? '#725642';

  if (kind === 'footballPitch') {
    return (
      <group>
        <mesh position={[0, 0.025, 0]}>
          <boxGeometry args={[width, 0.08, depth]} />
          <meshStandardMaterial color={bodyColor} flatShading />
        </mesh>
        <mesh position={[0, 0.074, 0]}>
          <boxGeometry args={[width - 1, 0.018, 0.1]} />
          <meshStandardMaterial color="#e8e2bf" />
        </mesh>
        <mesh position={[0, 0.074, -depth / 2 + 0.55]}>
          <boxGeometry args={[width - 1, 0.018, 0.1]} />
          <meshStandardMaterial color="#e8e2bf" />
        </mesh>
        <mesh position={[0, 0.074, depth / 2 - 0.55]}>
          <boxGeometry args={[width - 1, 0.018, 0.1]} />
          <meshStandardMaterial color="#e8e2bf" />
        </mesh>
        <mesh position={[-width / 2 + 0.55, 0.074, 0]}>
          <boxGeometry args={[0.1, 0.018, depth - 1]} />
          <meshStandardMaterial color="#e8e2bf" />
        </mesh>
        <mesh position={[width / 2 - 0.55, 0.074, 0]}>
          <boxGeometry args={[0.1, 0.018, depth - 1]} />
          <meshStandardMaterial color="#e8e2bf" />
        </mesh>
        <mesh position={[0, 0.075, 0]}>
          <cylinderGeometry args={[1.15, 1.15, 0.02, 16]} />
          <meshStandardMaterial color="#e8e2bf" />
        </mesh>
        <group position={[0, 0.9, -depth / 2 + 0.4]}>
          <mesh position={[0, 1.1, 0]}>
            <boxGeometry args={[3.4, 0.12, 0.12]} />
            <meshStandardMaterial color="#e8e2bf" />
          </mesh>
          <mesh position={[-1.6, 0.55, 0]}>
            <boxGeometry args={[0.12, 1.2, 0.12]} />
            <meshStandardMaterial color="#e8e2bf" />
          </mesh>
          <mesh position={[1.6, 0.55, 0]}>
            <boxGeometry args={[0.12, 1.2, 0.12]} />
            <meshStandardMaterial color="#e8e2bf" />
          </mesh>
        </group>
      </group>
    );
  }

  if (kind === 'arena') {
    return (
      <group>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, 0]}>
          <planeGeometry args={[width, depth]} />
          <meshStandardMaterial color={bodyColor} />
        </mesh>
        <mesh position={[0, 0.12, -depth / 2]}>
          <boxGeometry args={[width, 0.16, 0.18]} />
          <meshStandardMaterial color={roofColor} />
        </mesh>
        <mesh position={[0, 0.12, depth / 2]}>
          <boxGeometry args={[width, 0.16, 0.18]} />
          <meshStandardMaterial color={roofColor} />
        </mesh>
        <mesh position={[-width / 2, 0.12, 0]}>
          <boxGeometry args={[0.18, 0.16, depth]} />
          <meshStandardMaterial color={roofColor} />
        </mesh>
        <mesh position={[width / 2, 0.12, 0]}>
          <boxGeometry args={[0.18, 0.16, depth]} />
          <meshStandardMaterial color={roofColor} />
        </mesh>
      </group>
    );
  }

  return (
    <group>
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={bodyColor} flatShading />
      </mesh>
      <mesh position={[0, height + 0.16, 0]}>
        <boxGeometry args={[width + 0.4, 0.32, depth + 0.4]} />
        <meshStandardMaterial color={roofColor} flatShading />
      </mesh>
      {kind !== 'market' && kind !== 'busPark' && (
        <>
          <mesh position={[0, 0.82, depth / 2 + 0.045]}>
            <boxGeometry args={[0.9, 1.6, 0.09]} />
            <meshStandardMaterial color="#533f35" flatShading />
          </mesh>
          {[-0.28, 0.28].map((side) => (
            <mesh key={side} position={[side * width * 0.78, height * 0.66, depth / 2 + 0.05]}>
              <boxGeometry args={[1.25, 0.78, 0.1]} />
              <meshStandardMaterial color="#96b5af" flatShading />
            </mesh>
          ))}
        </>
      )}
      {kind === 'mosque' && (
        <>
          <mesh position={[0, height + 0.62, 0]}>
            <sphereGeometry args={[Math.min(width, depth) * 0.19, 8, 6]} />
            <meshStandardMaterial color="#d5c18e" flatShading />
          </mesh>
          <mesh position={[-width * 0.39, height + 1.1, -depth * 0.35]}>
            <cylinderGeometry args={[0.38, 0.5, 2.1, 7]} />
            <meshStandardMaterial color="#bda875" flatShading />
          </mesh>
          <mesh position={[-width * 0.39, height + 2.25, -depth * 0.35]}>
            <coneGeometry args={[0.48, 0.9, 7]} />
            <meshStandardMaterial color="#806a46" flatShading />
          </mesh>
        </>
      )}
      {kind === 'church' && (
        <>
          <mesh position={[0, height + 0.42, 0]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[Math.min(width, depth) * 0.68, 1.1, 4]} />
            <meshStandardMaterial color="#794d40" flatShading />
          </mesh>
          <mesh position={[width * 0.34, height + 1.35, -depth * 0.29]}>
            <boxGeometry args={[2.2, 2.7, 2.2]} />
            <meshStandardMaterial color="#bd805b" flatShading />
          </mesh>
          <mesh position={[width * 0.34, height + 2.95, -depth * 0.29]}>
            <coneGeometry args={[1.3, 1, 4]} />
            <meshStandardMaterial color="#754a3c" flatShading />
          </mesh>
        </>
      )}
      {kind === 'hospital' && (
        <>
          <mesh position={[0, height + 0.55, 0]}>
            <boxGeometry args={[2.8, 0.7, 0.3]} />
            <meshStandardMaterial color="#c55347" flatShading />
          </mesh>
          <mesh position={[0, height + 0.55, 0]}>
            <boxGeometry args={[0.7, 2.8, 0.3]} />
            <meshStandardMaterial color="#c55347" flatShading />
          </mesh>
        </>
      )}
      {kind === 'market' && (
        <>
          {[-1, 1].flatMap((x) =>
            [-1, 1].map((z) => (
              <mesh key={`${x}-${z}`} position={[x * width * 0.4, height * 0.55, z * depth * 0.38]}>
                <boxGeometry args={[0.32, height * 1.1, 0.32]} />
                <meshStandardMaterial color="#70543d" flatShading />
              </mesh>
            )),
          )}
          <mesh position={[0, height + 0.46, 0]}>
            <boxGeometry args={[width + 1, 0.18, depth + 1]} />
            <meshStandardMaterial color="#bf7047" flatShading />
          </mesh>
        </>
      )}
      {kind === 'kioskRow' && (
        <mesh position={[0, height + 0.55, depth / 2 + 0.14]}>
          <boxGeometry args={[width * 0.78, 0.45, 0.16]} />
          <meshStandardMaterial color="#f0d38e" flatShading />
        </mesh>
      )}
      {kind === 'busPark' && (
        <>
          {[-1, 1].map((side) => (
            <mesh key={side} position={[side * width * 0.4, height * 0.55, depth * 0.45]}>
              <boxGeometry args={[0.36, height * 1.1, 0.36]} />
              <meshStandardMaterial color="#765e40" flatShading />
            </mesh>
          ))}
          <mesh position={[0, height + 0.35, depth * 0.44]}>
            <boxGeometry args={[width + 0.8, 0.2, 2.4]} />
            <meshStandardMaterial color="#d8bd79" flatShading />
          </mesh>
        </>
      )}
      {kind === 'generatorYard' && (
        <mesh position={[0, height + 0.3, 0]}>
          <boxGeometry args={[width + 0.4, 0.2, depth + 0.4]} />
          <meshStandardMaterial color="#494f4b" flatShading />
        </mesh>
      )}
    </group>
  );
}

function Landmark({
  item,
  cameraOccludersRef,
}: {
  item: DistrictItem;
  cameraOccludersRef: CameraOccludersRef;
}) {
  const groupRef = useRef<Group>(null);
  const isOpenLandmark =
    item.landmark === 'footballPitch' || item.landmark === 'arena';
  const labelHeight = isOpenLandmark ? 2.6 : item.size[1] + 3.2;
  const labelPosition = useMemo(
    () => new Vector3(item.position[0], item.position[1] + labelHeight, item.position[2]),
    [item.position, labelHeight],
  );

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    cameraOccludersRef.current.push(group);
    group.traverse((object) => {
      object.userData.cameraOccluderRoot = group;
    });

    return () => {
      const index = cameraOccludersRef.current.indexOf(group);
      if (index >= 0) cameraOccludersRef.current.splice(index, 1);
    };
  }, [cameraOccludersRef]);

  return (
    <group
      ref={groupRef}
      position={item.position}
      rotation={[0, item.rotation, 0]}
    >
      <LandmarkModel item={item} />
      {item.label && (
        <LandmarkLabel label={item.label} height={labelHeight} worldPosition={labelPosition} />
      )}
    </group>
  );
}

function Danfo({ item }: { item: DistrictItem }) {
  const [width, height, length] = item.size;
  const wheels = useMemo(
    () => [-1, 1].flatMap((side) => [-1, 1].map((end) => [side, end] as const)),
    [],
  );

  return (
    <group position={item.position} rotation={[0, item.rotation, 0]}>
      <mesh position={[0, height * 0.36, 0]}>
        <boxGeometry args={[width, height * 0.68, length]} />
        <meshStandardMaterial color="#d8bd35" flatShading />
      </mesh>
      <mesh position={[0, height * 0.77, -0.35]}>
        <boxGeometry args={[width * 0.88, height * 0.39, length * 0.56]} />
        <meshStandardMaterial color="#d8bd35" flatShading />
      </mesh>
      <mesh position={[0, height * 0.78, length * 0.16]}>
        <boxGeometry args={[width * 0.82, height * 0.23, 0.08]} />
        <meshStandardMaterial color="#36545a" flatShading />
      </mesh>
      {wheels.map(([side, end]) => (
        <mesh
          key={`${side}-${end}`}
          position={[
            side * (width / 2 + 0.03),
            0.35,
            end * (length * 0.3),
          ]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.38, 0.38, 0.18, 8]} />
          <meshStandardMaterial color="#272b2d" flatShading />
        </mesh>
      ))}
    </group>
  );
}

function World({ cameraOccludersRef }: { cameraOccludersRef: CameraOccludersRef }) {
  const groups = useMemo(
    () => ({
      roads: DISTRICT0_ITEMS.filter((item) => item.type === 'road'),
      streets: DISTRICT0_ITEMS.filter((item) => item.type === 'street'),
      medians: DISTRICT0_ITEMS.filter((item) => item.type === 'median'),
      roundabouts: DISTRICT0_ITEMS.filter((item) => item.type === 'roundabout'),
      landmarks: DISTRICT0_ITEMS.filter((item) => item.type === 'building'),
      trees: DISTRICT0_ITEMS.filter((item) => item.type === 'tree'),
      lamps: DISTRICT0_ITEMS.filter((item) => item.type === 'streetLamp'),
      kiosks: DISTRICT0_ITEMS.filter((item) => item.type === 'kiosk'),
      stalls: DISTRICT0_ITEMS.filter((item) => item.type === 'marketStall'),
      generators: DISTRICT0_ITEMS.filter((item) => item.type === 'generator'),
      danfos: DISTRICT0_ITEMS.filter((item) => item.type === 'danfo'),
      fences: DISTRICT0_ITEMS.filter((item) => item.type === 'fence'),
    }),
    [],
  );

  const fenceParts = useMemo(() => makeFenceParts(groups.fences), [groups.fences]);

  return (
    <>
      <mesh position={[0, -0.13, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[MAP_BOUNDS.maxX - MAP_BOUNDS.minX, MAP_BOUNDS.maxZ - MAP_BOUNDS.minZ]} />
        <meshStandardMaterial color="#aa946a" />
      </mesh>

      <InstanceSet
        items={groups.roads}
        geometry={<boxGeometry args={[1, 1, 1]} />}
        color="#4b4945"
        transform={unitBoxTransform}
      />
      <InstanceSet
        items={groups.streets}
        geometry={<boxGeometry args={[1, 1, 1]} />}
        color="#625d53"
        transform={unitBoxTransform}
      />
      <InstanceSet
        items={groups.medians}
        geometry={<boxGeometry args={[1, 1, 1]} />}
        color="#71855d"
        transform={unitBoxTransform}
      />

      {groups.roundabouts.map((item) => (
        <Roundabout key={item.id} item={item} />
      ))}
      {groups.landmarks.map((item) => (
        <Landmark
          key={item.id}
          item={item}
          cameraOccludersRef={cameraOccludersRef}
        />
      ))}

      <Trees items={groups.trees} />
      <InstanceSet
        items={groups.lamps}
        geometry={<cylinderGeometry args={[0.08, 0.11, 1, 6]} />}
        color="#5b5142"
        transform={lampPoleTransform}
      />
      <InstanceSet
        items={groups.lamps}
        geometry={<boxGeometry args={[1, 1, 1]} />}
        color="#d4b56e"
        transform={lampHeadTransform}
      />

      <InstanceSet
        items={groups.kiosks}
        geometry={<boxGeometry args={[1, 1, 1]} />}
        color="#d29a50"
        transform={unitBoxTransform}
      />
      <InstanceSet
        items={groups.kiosks}
        geometry={<boxGeometry args={[1, 1, 1]} />}
        color="#8a5039"
        transform={kioskRoofTransform}
      />
      <InstanceSet
        items={groups.stalls}
        geometry={<boxGeometry args={[1, 1, 1]} />}
        color="#b86246"
        transform={unitBoxTransform}
      />
      <InstanceSet
        items={groups.stalls}
        geometry={<boxGeometry args={[1, 1, 1]} />}
        color="#d5b16a"
        transform={kioskRoofTransform}
      />

      <InstanceSet
        items={groups.generators}
        geometry={<boxGeometry args={[1, 1, 1]} />}
        color="#4f5751"
        transform={unitBoxTransform}
      />
      <InstanceSet
        items={groups.generators}
        geometry={<boxGeometry args={[1, 1, 1]} />}
        color="#323b37"
        transform={generatorLidTransform}
      />
      {groups.danfos.map((item) => (
        <Danfo key={item.id} item={item} />
      ))}

      <InstanceSet
        items={fenceParts.posts}
        geometry={<boxGeometry args={[1, 1, 1]} />}
        color="#745e47"
        transform={unitBoxTransform}
      />
      <InstanceSet
        items={fenceParts.rails}
        geometry={<boxGeometry args={[1, 1, 1]} />}
        color="#9d805d"
        transform={(item) => ({
          position: item.position,
          scale: item.size,
          rotation: item.rotation,
        })}
      />
    </>
  );
}

export { World };
