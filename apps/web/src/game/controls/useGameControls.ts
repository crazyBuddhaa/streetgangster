import { useCallback, useEffect, useRef } from 'react';
import type { GameInput } from '../types';

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
  const inputRef = useRef<GameInput>({ strafe: 0, forward: 0, cameraYaw: 0 });
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
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', clearKeys);
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
    inputRef.current.cameraYaw += pixelDelta * 0.006;
  }, []);

  return { inputRef, setJoystick, rotateCamera };
}
