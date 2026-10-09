import { useRef } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

interface CameraLookAreaProps {
  onLookDelta: (pixelDelta: number) => void;
}

export function CameraLookArea({ onLookDelta }: CameraLookAreaProps) {
  const activePointer = useRef<number | null>(null);
  const lastX = useRef(0);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.preventDefault();
    activePointer.current = event.pointerId;
    lastX.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (activePointer.current !== event.pointerId) return;
    event.preventDefault();
    const delta = event.clientX - lastX.current;
    lastX.current = event.clientX;
    onLookDelta(delta);
  };

  const onPointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (activePointer.current === event.pointerId) activePointer.current = null;
  };

  return (
    <div
      className="camera-look-area"
      aria-hidden="true"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
    />
  );
}
