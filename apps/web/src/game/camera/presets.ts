export interface CameraPreset {
  pitchDegrees: number;
  distance: number;
}

export const CAMERA_PRESETS = {
  CLOSE: { pitchDegrees: 25, distance: 6 },
  DEFAULT: { pitchDegrees: 40, distance: 10 },
  FAR: { pitchDegrees: 62, distance: 18 },
} as const satisfies Record<'CLOSE' | 'DEFAULT' | 'FAR', CameraPreset>;

export const DEFAULT_ZOOM = 0.5;
export const ZOOM_MIN = 0;
export const ZOOM_MAX = 1;
export const ZOOM_TRANSITION_SECONDS = 0.4;
export const CAMERA_FOV = 45;
export const CAMERA_FOLLOW_LAG = 5.5;
export const CAMERA_TARGET_HEIGHT = 1.1;
export const CAMERA_GROUND_CLEARANCE = 1.2;
export const CAMERA_BLOCKER_PADDING = 0.7;
export const FAR_MODE_THRESHOLD = 0.5;

export function presetForZoom(zoom: number): CameraPreset {
  const clamped = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, zoom));
  if (clamped <= 0.5) {
    const t = clamped / 0.5;
    return {
      pitchDegrees:
        CAMERA_PRESETS.CLOSE.pitchDegrees +
        (CAMERA_PRESETS.DEFAULT.pitchDegrees - CAMERA_PRESETS.CLOSE.pitchDegrees) * t,
      distance:
        CAMERA_PRESETS.CLOSE.distance +
        (CAMERA_PRESETS.DEFAULT.distance - CAMERA_PRESETS.CLOSE.distance) * t,
    };
  }

  const t = (clamped - 0.5) / 0.5;
  return {
    pitchDegrees:
      CAMERA_PRESETS.DEFAULT.pitchDegrees +
      (CAMERA_PRESETS.FAR.pitchDegrees - CAMERA_PRESETS.DEFAULT.pitchDegrees) * t,
    distance:
      CAMERA_PRESETS.DEFAULT.distance +
      (CAMERA_PRESETS.FAR.distance - CAMERA_PRESETS.DEFAULT.distance) * t,
  };
}
