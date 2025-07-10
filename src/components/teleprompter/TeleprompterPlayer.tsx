import React, { useRef, useEffect } from 'react';
import { TeleprompterProgressBar } from './TeleprompterProgressBar';
import { TeleprompterControls } from './TeleprompterControls';
import { useTeleprompterAnimation } from '@/hooks/useTeleprompterAnimation';
import { renderScript } from '@/utils/scriptRenderer';
import { TeleprompterState } from '@/hooks/useTeleprompterState';

interface TeleprompterPlayerProps {
  state: TeleprompterState;
  onPositionUpdate: (position: number) => void;
  onMaxScrollUpdate: (maxScroll: number) => void;
  onPlayPause: () => void;
  onRewind: () => void;
  onSpeedChange: (delta: number) => void;
  onGoHome: () => void;
  onAddBookmark: () => void;
}

export const TeleprompterPlayer: React.FC<TeleprompterPlayerProps> = ({
  state,
  onPositionUpdate,
  onMaxScrollUpdate,
  onPlayPause,
  onRewind,
  onSpeedChange,
  onGoHome,
  onAddBookmark
}) => {
  const scriptRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use animation hook
  useTeleprompterAnimation({
    isPlaying: state.isPlaying,
    speed: state.speed,
    currentPosition: state.currentPosition,
    onPositionUpdate,
    onMaxScrollUpdate,
    scriptRef
  });

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
          e.preventDefault();
          onPlayPause();
          break;
        case '+':
        case '=':
          e.preventDefault();
          onSpeedChange(0.05);
          break;
        case '-':
          e.preventDefault();
          onSpeedChange(-0.05);
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          onRewind();
          break;
        case 'b':
        case 'B':
          e.preventDefault();
          onAddBookmark();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onPlayPause, onSpeedChange, onRewind, onAddBookmark]);

  return (
    <div 
      ref={containerRef}
      className="h-screen overflow-hidden bg-teleprompter-bg text-teleprompter-text relative select-none"
      style={{ userSelect: 'none' }}
    >
      <TeleprompterProgressBar 
        currentPosition={state.currentPosition}
        maxScrollDistance={state.maxScrollDistance}
      />

      {/* Focus line */}
      <div 
        className="absolute left-0 right-0 h-0.5 z-10 pointer-events-none"
        style={{ 
          top: '50%',
          backgroundColor: 'rgba(255, 0, 0, 0.4)'
        }}
      />
      
      {/* Script content */}
      <div
        ref={scriptRef}
        className="px-4 md:px-8 pt-[100vh] pb-[50vh] text-center mx-auto"
        style={{
          transform: `translateY(-${state.currentPosition}px)`,
          willChange: 'transform',
          fontSize: window.innerWidth <= 768 ? '5vw' : '28px',
          maxWidth: window.innerWidth <= 768 ? '95%' : '900px',
          lineHeight: '1.6'
        }}
      >
        {renderScript(state.script, state.speakerAliases)}
      </div>
      
      {/* Desktop controls */}
      <TeleprompterControls
        isPlaying={state.isPlaying}
        speed={state.speed}
        onPlayPause={onPlayPause}
        onRewind={onRewind}
        onSpeedChange={onSpeedChange}
        onGoHome={onGoHome}
        isMobile={false}
      />
      
      {/* Mobile controls */}
      <TeleprompterControls
        isPlaying={state.isPlaying}
        speed={state.speed}
        onPlayPause={onPlayPause}
        onRewind={onRewind}
        onSpeedChange={onSpeedChange}
        onGoHome={onGoHome}
        isMobile={true}
      />
    </div>
  );
};