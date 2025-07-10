import React, { useEffect } from 'react';
import { useTeleprompterState } from '@/hooks/useTeleprompterState';
import { TeleprompterStartScreen } from './teleprompter/TeleprompterStartScreen';
import { TeleprompterPreview } from './teleprompter/TeleprompterPreview';
import { TeleprompterPlayer } from './teleprompter/TeleprompterPlayer';
import { useToast } from '@/hooks/use-toast';

const Teleprompter: React.FC = () => {
  const {
    state,
    availableScripts,
    loadScript,
    updateMaxScrollDistance,
    setCurrentPosition,
    setIsPlaying,
    setSpeed,
    setScriptUrl,
    setIsStarted,
    setIsPreviewMode,
    addBookmark,
    goToBookmark,
    handleStart,
    handleRewind
  } = useTeleprompterState();

  const { toast } = useToast();

  // Load initial script
  useEffect(() => {
    loadScript(state.scriptUrl);
  }, [loadScript, state.scriptUrl]);

  const handlePlayPause = () => {
    setIsPlaying(!state.isPlaying);
  };

  const handleSpeedChange = (delta: number) => {
    setSpeed(state.speed + delta);
  };

  const handleAddBookmark = () => {
    const name = prompt('Name für das Lesezeichen:');
    if (name) {
      addBookmark(name);
    }
  };

  const handleExportScript = () => {
    const dataStr = JSON.stringify(state.script, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'script.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportScript = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);
          loadScript(URL.createObjectURL(new Blob([content], { type: 'application/json' })));
          toast({
            title: "Skript importiert",
            description: "Das neue Skript wurde erfolgreich geladen."
          });
        } catch (err) {
          toast({
            title: "Import-Fehler",
            description: "Die Datei konnte nicht als gültiges JSON gelesen werden.",
            variant: "destructive"
          });
        }
      };
      reader.readAsText(file);
    }
  };

  if (!state.isStarted) {
    return (
      <TeleprompterStartScreen
        state={state}
        availableScripts={availableScripts}
        onScriptUrlChange={setScriptUrl}
        onPreviewModeChange={setIsPreviewMode}
        onStart={handleStart}
        onImportScript={handleImportScript}
        onExportScript={handleExportScript}
        onGoToBookmark={goToBookmark}
      />
    );
  }

  if (state.isPreviewMode) {
    return (
      <TeleprompterPreview
        script={state.script}
        onBackToStart={() => setIsStarted(false)}
      />
    );
  }

  return (
    <TeleprompterPlayer
      state={state}
      onPositionUpdate={setCurrentPosition}
      onMaxScrollUpdate={updateMaxScrollDistance}
      onPlayPause={handlePlayPause}
      onRewind={handleRewind}
      onSpeedChange={handleSpeedChange}
      onGoHome={() => setIsStarted(false)}
      onAddBookmark={handleAddBookmark}
    />
  );
};

export default Teleprompter;