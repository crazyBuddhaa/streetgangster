import { useCallback, useEffect, useRef } from 'react';
import type { GameInput } from '../types';
import { DEFAULT_ZOOM, ZOOM_MAX, ZOOM_MIN } from '../camera/presets';

const MOVEMENT_KEYS = new Set([
  'KeyW',
  'KeyA',
  'KeyS',
  'KeyD',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
]);

function clampAxis(value: number) {
  return Math.max(-1, Math.min(1, value));
}

export function useGameControls(active: boolean) {
  const inputRef = useRef<GameInput>({
    strafe: 0,
    forward: 0,
    cameraYaw: 0,
    zoom: DEFAULT_ZOOM,
  });
  const pressedKeys = useRef(new Set<string>());
  const joystick = useRef({ strafe: 0, forward: 0 });

  const updateMovement = useCallback(() => {
    const keys = pressedKeys.current;
    const keyboardStrafe =
      Number(keys.has('KeyD') || keys.has('ArrowRight')) -
      Number(keys.has('KeyA') || keys.has('ArrowLeft'));
    const keyboardForward =
      Number(keys.has('KeyW') || keys.has('ArrowUp')) -
      Number(keys.has('KeyS') || keys.has('ArrowDown'));

    inputRef.current.strafe = clampAxis(keyboardStrafe + joystick.current.strafe);
    inputRef.current.forward = clampAxis(keyboardForward + joystick.current.forward);
  }, []);

  useEffect(() => {
    pressedKeys.current.clear();
    joystick.current = { strafe: 0, forward: 0 };
    updateMovement();
    if (!active) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (!MOVEMENT_KEYS.has(event.code)) return;
      event.preventDefault();
      pressedKeys.current.add(event.code);
      updateMovement();
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (!MOVEMENT_KEYS.has(event.code)) return;
      pressedKeys.current.delete(event.code);
      updateMovement();
    };
    const clearKeys = () => {
      pressedKeys.current.clear();
      updateMovement();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', clearKeys);
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      inputRef.current.zoom = Math.max(
        ZOOM_MIN,
        Math.min(ZOOM_MAX, inputRef.current.zoom + Math.sign(event.deltaY) * 0.075),
      );
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', clearKeys);
      window.removeEventListener('wheel', onWheel);
      clearKeys();
    };
  }, [active, updateMovement]);

  const setJoystick = useCallback(
    (strafe: number, forward: number) => {
      joystick.current = { strafe, forward };
      updateMovement();
    },
    [updateMovement],
  );

  const rotateCamera = useCallback((pixelDelta: number) => {
    inputRef.current.cameraYaw += pixelDelta * 0.005;
  }, []);

  const setZoom = useCallback((zoom: number) => {
    inputRef.current.zoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, zoom));
  }, []);

  const zoomBy = useCallback((amount: number) => {
    setZoom(inputRef.current.zoom + amount);
  }, [setZoom]);

  return { inputRef, setJoystick, rotateCamera, setZoom, zoomBy };
}
