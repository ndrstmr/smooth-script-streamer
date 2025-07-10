import { useRef, useEffect, useCallback } from 'react';

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

  const animate = useCallback(() => {
    if (!isPlaying || !scriptRef.current) return;

    const maxScroll = scriptRef.current.clientHeight - window.innerHeight + 200;
    onMaxScrollUpdate(maxScroll);

    const newPosition = currentPosition + speed;
    
    if (newPosition >= maxScroll) {
      onPositionUpdate(maxScroll);
      return; // Stop animation naturally
    }
    
    onPositionUpdate(newPosition);
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [isPlaying, speed, currentPosition, onPositionUpdate, onMaxScrollUpdate, scriptRef]);

  useEffect(() => {
    if (isPlaying) {
      animate();
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, animate]);

  // Update max scroll distance when script changes
  useEffect(() => {
    if (scriptRef.current) {
      const maxScroll = scriptRef.current.clientHeight - window.innerHeight + 200;
      onMaxScrollUpdate(maxScroll);
    }
  }, [scriptRef, onMaxScrollUpdate]);
};