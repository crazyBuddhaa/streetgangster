import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { MathUtils, Raycaster, Vector3 } from 'three';
import type { Group, Material, Object3D } from 'three';
import {
  CAMERA_BLOCKER_PADDING,
  CAMERA_FOLLOW_LAG,
  CAMERA_GROUND_CLEARANCE,
  CAMERA_TARGET_HEIGHT,
  FAR_MODE_THRESHOLD,
  ZOOM_TRANSITION_SECONDS,
  presetForZoom,
} from './presets';
import type { CameraOccludersRef, GameInputRef, PlayerPositionRef } from '../types';

interface FollowCameraProps {
  inputRef: GameInputRef;
  playerPositionRef: PlayerPositionRef;
  cameraOccludersRef: CameraOccludersRef;
}

const WORLD_UP = new Vector3(0, 1, 0);
const ZOOM_SMOOTHING = -Math.log(0.02) / ZOOM_TRANSITION_SECONDS;
const materialDefaults = new WeakMap<
  Material,
  { opacity: number; transparent: boolean; depthWrite: boolean }
>();

function setGroupFaded(group: Group, faded: boolean) {
  group.traverse((object: Object3D) => {
    if (!object.userData.cameraOccluderRoot) return;
    const mesh = object as Object3D & { material?: Material | Material[] };
    if (!mesh.material) return;
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

    materials.forEach((material) => {
      if (!materialDefaults.has(material)) {
        materialDefaults.set(material, {
          opacity: material.opacity,
          transparent: material.transparent,
          depthWrite: material.depthWrite,
        });
      }
      const defaults = materialDefaults.get(material);
      if (!defaults) return;
      material.transparent = faded ? true : defaults.transparent;
      material.opacity = faded ? 0.38 : defaults.opacity;
      material.depthWrite = faded ? false : defaults.depthWrite;
      material.needsUpdate = true;
    });
  });
}

export function FollowCamera({
  inputRef,
  playerPositionRef,
  cameraOccludersRef,
}: FollowCameraProps) {
  const { camera } = useThree();
  const desired = useRef(new Vector3());
  const safeDesired = useRef(new Vector3());
  const lookTarget = useRef(new Vector3());
  const offset = useRef(new Vector3());
  const direction = useRef(new Vector3());
  const zoom = useRef(inputRef.current.zoom);
  const raycaster = useRef(new Raycaster());
  const fadedGroups = useRef(new Set<Group>());

  useFrame((_, delta) => {
    const player = playerPositionRef.current;
    zoom.current = MathUtils.damp(zoom.current, inputRef.current.zoom, ZOOM_SMOOTHING, delta);
    const preset = presetForZoom(zoom.current);
    const pitch = MathUtils.degToRad(preset.pitchDegrees);
    const horizontalDistance = Math.cos(pitch) * preset.distance;
    const verticalDistance = Math.sin(pitch) * preset.distance;

    offset.current
      .set(0, verticalDistance, -horizontalDistance)
      .applyAxisAngle(WORLD_UP, inputRef.current.cameraYaw);
    desired.current.set(player.x, CAMERA_TARGET_HEIGHT, player.z).add(offset.current);
    desired.current.y = Math.max(CAMERA_GROUND_CLEARANCE, desired.current.y);
    lookTarget.current.set(player.x, CAMERA_TARGET_HEIGHT, player.z);

    const nextFadedGroups = new Set<Group>();
    direction.current.copy(desired.current).sub(lookTarget.current);
    const cameraDistance = direction.current.length();
    direction.current.normalize();
    raycaster.current.set(lookTarget.current, direction.current);
    raycaster.current.far = cameraDistance;
    const hits = raycaster.current.intersectObjects(cameraOccludersRef.current, true);
    const blockers = hits.filter(
      (hit) => hit.distance > 0.2 && hit.distance < cameraDistance - CAMERA_BLOCKER_PADDING,
    );

    if (blockers.length > 0) {
      const firstHit = blockers[0];
      safeDesired.current
        .copy(firstHit.point)
        .addScaledVector(direction.current, -CAMERA_BLOCKER_PADDING);
      safeDesired.current.y = Math.max(CAMERA_GROUND_CLEARANCE, safeDesired.current.y);

      if (zoom.current >= FAR_MODE_THRESHOLD) {
        blockers.forEach((hit) => {
          const root = hit.object.userData.cameraOccluderRoot as Group | undefined;
          if (root) nextFadedGroups.add(root);
        });
      }
      desired.current.copy(safeDesired.current);
    }

    fadedGroups.current.forEach((group) => {
      if (!nextFadedGroups.has(group)) setGroupFaded(group, false);
    });
    nextFadedGroups.forEach((group) => {
      if (!fadedGroups.current.has(group)) setGroupFaded(group, true);
    });
    fadedGroups.current = nextFadedGroups;

    const isBlocked = blockers.length > 0;
    camera.position.lerp(
      desired.current,
      isBlocked ? 1 : 1 - Math.exp(-CAMERA_FOLLOW_LAG * delta),
    );
    camera.position.y = Math.max(CAMERA_GROUND_CLEARANCE, camera.position.y);
    camera.lookAt(lookTarget.current);
  });

  return null;
}
