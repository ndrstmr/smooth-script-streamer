import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface TeleprompterHandlersProps {
  isPlaying: boolean;
  speed: number;
  script: any[];
  setIsPlaying: (playing: boolean) => void;
  setSpeed: (speed: number) => void;
  addBookmark: (name: string) => void;
  loadScript: (url: string) => void;
}

export const useTeleprompterHandlers = ({
  isPlaying,
  speed,
  script,
  setIsPlaying,
  setSpeed,
  addBookmark,
  loadScript
}: TeleprompterHandlersProps) => {
  const { toast } = useToast();

  const handlePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying, setIsPlaying]);

  const handleSpeedChange = useCallback((delta: number) => {
    setSpeed(speed + delta);
  }, [speed, setSpeed]);

  const handleAddBookmark = useCallback(() => {
    const name = prompt('Name für das Lesezeichen:');
    if (name) {
      addBookmark(name);
    }
  }, [addBookmark]);

  const handleExportScript = useCallback(() => {
    const dataStr = JSON.stringify(script, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'script.json';
    link.click();
    URL.revokeObjectURL(url);
  }, [script]);

  const handleImportScript = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
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
  }, [loadScript, toast]);

  return {
    handlePlayPause,
    handleSpeedChange,
    handleAddBookmark,
    handleExportScript,
    handleImportScript
  };
};