import React, { useEffect } from 'react';
import { useTeleprompterState } from '@/hooks/useTeleprompterState';
import { useTeleprompterHandlers } from '@/hooks/useTeleprompterHandlers';
import { TeleprompterStartScreen } from './teleprompter/TeleprompterStartScreen';
import { TeleprompterPreview } from './teleprompter/TeleprompterPreview';
import { TeleprompterPlayer } from './teleprompter/TeleprompterPlayer';

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
    handleRewind,
    setSpeakerAlias
  } = useTeleprompterState();

  const {
    handlePlayPause,
    handleSpeedChange,
    handleAddBookmark,
    handleExportScript,
    handleImportScript
  } = useTeleprompterHandlers({
    isPlaying: state.isPlaying,
    speed: state.speed,
    script: state.script,
    setIsPlaying,
    setSpeed,
    addBookmark,
    loadScript
  });

  // Load initial script when URL changes
  useEffect(() => {
    loadScript(state.scriptUrl);
  }, [loadScript, state.scriptUrl]);

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
        onSpeakerAliasChange={setSpeakerAlias}
      />
    );
  }

  if (state.isPreviewMode) {
    return (
      <TeleprompterPreview
        script={state.script}
        speakerAliases={state.speakerAliases}
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