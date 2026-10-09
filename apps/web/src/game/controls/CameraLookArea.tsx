import { useRef } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

interface CameraLookAreaProps {
  onLookDelta: (pixelDelta: number) => void;
  onZoomDelta: (zoomDelta: number) => void;
}

export function CameraLookArea({ onLookDelta, onZoomDelta }: CameraLookAreaProps) {
  const activePointer = useRef<number | null>(null);
  const lastX = useRef(0);
  const touchPoints = useRef(
    new Map<number, { x: number; y: number }>(),
  );
  const lastPinchDistance = useRef(0);

  const distanceBetweenTouches = () => {
    const points = [...touchPoints.current.values()];
    if (points.length < 2) return 0;
    return Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    if (event.pointerType === 'touch') {
      touchPoints.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (touchPoints.current.size === 2) {
        activePointer.current = null;
        lastPinchDistance.current = distanceBetweenTouches();
        return;
      }
    }

    activePointer.current = event.pointerId;
    lastX.current = event.clientX;
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const isTrackedTouch = touchPoints.current.has(event.pointerId);
    if (event.pointerType === 'touch' && !isTrackedTouch) return;
    if (!isTrackedTouch && activePointer.current !== event.pointerId) return;
    event.preventDefault();

    if (isTrackedTouch) {
      touchPoints.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (touchPoints.current.size >= 2) {
        const nextDistance = distanceBetweenTouches();
        if (lastPinchDistance.current > 0) {
          onZoomDelta((nextDistance - lastPinchDistance.current) * 0.004);
        }
        lastPinchDistance.current = nextDistance;
        return;
      }
    }

    if (activePointer.current !== event.pointerId) return;
    const delta = event.clientX - lastX.current;
    lastX.current = event.clientX;
    onLookDelta(delta);
  };

  const onPointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    touchPoints.current.delete(event.pointerId);
    if (touchPoints.current.size < 2) lastPinchDistance.current = 0;
    if (activePointer.current === event.pointerId) activePointer.current = null;
    if (event.pointerType === 'touch' && touchPoints.current.size === 1) {
      const [remainingId, remainingPoint] = [...touchPoints.current.entries()][0];
      activePointer.current = remainingId;
      lastX.current = remainingPoint.x;
    }
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
