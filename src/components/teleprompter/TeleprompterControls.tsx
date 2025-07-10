import React from 'react';
import { Play, Pause, RotateCcw, Plus, Minus, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TeleprompterControlsProps {
  isPlaying: boolean;
  speed: number;
  onPlayPause: () => void;
  onRewind: () => void;
  onSpeedChange: (delta: number) => void;
  onGoHome: () => void;
  isMobile?: boolean;
}

export const TeleprompterControls: React.FC<TeleprompterControlsProps> = ({
  isPlaying,
  speed,
  onPlayPause,
  onRewind,
  onSpeedChange,
  onGoHome,
  isMobile = false
}) => {
  if (isMobile) {
    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-mobileControl-bg/95 text-mobileControl-text p-4 backdrop-blur-md border-t border-gray-600">
        <div className="flex justify-center items-center gap-3">
          <Button
            onClick={onGoHome}
            className="w-10 h-10 rounded-full bg-gray-700 text-white border border-gray-600 hover:bg-gray-600 focus:bg-gray-600 focus:ring-2 focus:ring-gray-500 active:bg-gray-800"
            aria-label="Zum Startmenü"
          >
            <Home className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={() => onSpeedChange(-0.05)}
            className="w-10 h-10 rounded-full bg-gray-700 text-white border border-gray-600 hover:bg-gray-600 focus:bg-gray-600 focus:ring-2 focus:ring-gray-500 active:bg-gray-800"
            aria-label="Scrollgeschwindigkeit verringern"
          >
            <Minus className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={onPlayPause}
            className="w-12 h-12 rounded-full bg-gray-700 text-white border border-gray-600 hover:bg-gray-600 focus:bg-gray-600 focus:ring-2 focus:ring-gray-500 active:bg-gray-800"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
          
          <Button
            onClick={() => onSpeedChange(0.05)}
            className="w-10 h-10 rounded-full bg-gray-700 text-white border border-gray-600 hover:bg-gray-600 focus:bg-gray-600 focus:ring-2 focus:ring-gray-500 active:bg-gray-800"
            aria-label="Scrollgeschwindigkeit erhöhen"
          >
            <Plus className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={onRewind}
            className="w-10 h-10 rounded-full bg-gray-700 text-white border border-gray-600 hover:bg-gray-600 focus:bg-gray-600 focus:ring-2 focus:ring-gray-500 active:bg-gray-800"
            aria-label="Zurückspulen"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="text-center text-sm mt-2 font-medium text-gray-300">
          Geschwindigkeit: {speed.toFixed(2)}
        </div>
      </div>
    );
  }

  return (
    <div className="hidden md:block fixed bottom-4 right-4 bg-control-bg/70 text-control-text p-4 rounded-lg backdrop-blur-sm">
      <div className="text-sm space-y-1">
        <div>Leertaste: Play/Pause</div>
        <div>+/-: Geschwindigkeit</div>
        <div>R: Zurückspulen</div>
        <div>B: Lesezeichen</div>
        <div className="font-medium">Geschwindigkeit: {speed.toFixed(2)}</div>
      </div>
    </div>
  );
};