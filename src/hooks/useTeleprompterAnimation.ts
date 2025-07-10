import { useRef, useEffect } from 'react';

interface AnimationHookProps {
  isPlaying: boolean;
  speed: number;
  currentPosition: number;
  onPositionUpdate: (position: number) => void;
  onMaxScrollUpdate: (maxScroll: number) => void;
  scriptRef: React.RefObject<HTMLDivElement>;
}

export const useTeleprompterAnimation = ({
  isPlaying,
  speed,
  currentPosition,
  onPositionUpdate,
  onMaxScrollUpdate,
  scriptRef
}: AnimationHookProps) => {
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>();

  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
      return;
    }

    let lastPosition = currentPosition;

    const animate = (timestamp: number) => {
      if (!scriptRef.current) return;

      // Calculate max scroll distance
      const maxScroll = scriptRef.current.clientHeight - window.innerHeight + 200;
      onMaxScrollUpdate(maxScroll);

      // Calculate time delta for consistent animation
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      // Update position based on speed and time
      const newPosition = lastPosition + (speed * deltaTime * 0.06); // 0.06 for speed calibration
      lastPosition = newPosition;
      
      if (newPosition >= maxScroll) {
        onPositionUpdate(maxScroll);
        return; // Stop animation at end
      }
      
      onPositionUpdate(newPosition);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Reset last time when starting
    lastTimeRef.current = undefined;
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, speed, currentPosition]); // Re-added currentPosition but using local variable to prevent loops

  // Update max scroll distance when script changes
  useEffect(() => {
    if (scriptRef.current) {
      const maxScroll = scriptRef.current.clientHeight - window.innerHeight + 200;
      onMaxScrollUpdate(maxScroll);
    }
  }, [scriptRef, onMaxScrollUpdate]);
};