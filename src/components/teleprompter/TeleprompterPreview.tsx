import React from 'react';
import { Button } from '@/components/ui/button';
import { renderScript } from '@/utils/scriptRenderer';
import { ScriptItem, TeleprompterState } from '@/hooks/useTeleprompterState';

interface TeleprompterPreviewProps {
  script: ScriptItem[];
  speakerAliases: TeleprompterState['speakerAliases'];
  onBackToStart: () => void;
}

export const TeleprompterPreview: React.FC<TeleprompterPreviewProps> = ({
  script,
  speakerAliases,
  onBackToStart
}) => {
  return (
    <div className="min-h-screen bg-teleprompter-bg text-teleprompter-text">
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Skript-Vorschau</h1>
          <Button
            onClick={onBackToStart}
            variant="outline"
            className="bg-teleprompter-bg border-gray-600 text-teleprompter-text hover:bg-gray-800"
          >
            Zurück zum Start
          </Button>
        </div>
        <div className="text-lg leading-relaxed">
          {renderScript(script, speakerAliases)}
        </div>
      </div>
    </div>
  );
};