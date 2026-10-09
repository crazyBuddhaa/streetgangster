import { useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

interface VirtualJoystickProps {
  onMove: (strafe: number, forward: number) => void;
}

export function VirtualJoystick({ onMove }: VirtualJoystickProps) {
  const padRef = useRef<HTMLDivElement>(null);
  const activePointer = useRef<number | null>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });

  const updateFromPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const pad = padRef.current;
    if (!pad) return;
    const bounds = pad.getBoundingClientRect();
    const radius = bounds.width * 0.33;
    let x = (event.clientX - (bounds.left + bounds.width / 2)) / radius;
    let y = (event.clientY - (bounds.top + bounds.height / 2)) / radius;
    const length = Math.hypot(x, y);
    if (length > 1) {
      x /= length;
      y /= length;
    }
    setKnob({ x, y });
    onMove(x, -y);
  };

  const endPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (activePointer.current !== event.pointerId) return;
    activePointer.current = null;
    setKnob({ x: 0, y: 0 });
    onMove(0, 0);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    activePointer.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    updateFromPointer(event);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (activePointer.current !== event.pointerId) return;
    event.preventDefault();
    updateFromPointer(event);
  };

  return (
    <div
      ref={padRef}
      className="virtual-joystick"
      aria-label="Movement joystick"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
    >
      <div
        className="joystick-knob"
        style={{ transform: `translate(${knob.x * 32}px, ${knob.y * 32}px)` }}
      />
    </div>
  );
}
