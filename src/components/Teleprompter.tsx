import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus, FileText, Bookmark, Download, Upload, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface ScriptItem {
  type: 'direction' | 'speaker-andreas' | 'speaker-achim';
  text: string;
}

interface Bookmark {
  id: string;
  name: string;
  position: number;
}

const Teleprompter: React.FC = () => {
  const [script, setScript] = useState<ScriptItem[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(0.35);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [scriptUrl, setScriptUrl] = useState('script.json');
  const [availableScripts] = useState(['script.json', 'episode-2.json', 'episode-3.json']);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [error, setError] = useState<string>('');
  
  const scriptRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load settings from localStorage
  useEffect(() => {
    const savedSpeed = localStorage.getItem('teleprompter-speed');
    const savedBookmarks = localStorage.getItem('teleprompter-bookmarks');
    
    if (savedSpeed) {
      setSpeed(parseFloat(savedSpeed));
    }
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('teleprompter-speed', speed.toString());
  }, [speed]);

  useEffect(() => {
    localStorage.setItem('teleprompter-bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Load script from JSON
  const loadScript = useCallback(async (url: string) => {
    try {
      setError('');
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Skript-Format ist ungültig. Erwartet wird ein Array.');
      }
      
      setScript(data);
      setCurrentPosition(0);
      
      // Check if script is too short
      setTimeout(() => {
        if (scriptRef.current && containerRef.current) {
          const scriptHeight = scriptRef.current.clientHeight;
          const windowHeight = window.innerHeight;
          
          if (scriptHeight <= windowHeight) {
            console.warn('Warnung: Das Skript ist zu kurz für eine Animation.');
            toast({
              title: "Warnung",
              description: "Das Skript ist möglicherweise zu kurz für eine flüssige Animation.",
              variant: "default"
            });
          }
        }
      }, 100);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unbekannter Fehler';
      setError(`Fehler beim Laden des Skripts: ${errorMessage}`);
      setScript([{
        type: 'direction',
        text: `[Fehler: Skript konnte nicht geladen werden - ${errorMessage}]`
      }]);
    }
  }, [toast]);

  // Load initial script
  useEffect(() => {
    loadScript(scriptUrl);
  }, [loadScript, scriptUrl]);

  // Animation loop
  const animate = useCallback(() => {
    if (!isPlaying || !scriptRef.current) return;

    setCurrentPosition(prev => {
      const newPosition = prev + speed;
      const maxScroll = scriptRef.current!.clientHeight - window.innerHeight + 200;
      
      if (newPosition >= maxScroll) {
        setIsPlaying(false);
        return maxScroll;
      }
      
      return newPosition;
    });

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [isPlaying, speed]);

  useEffect(() => {
    if (isPlaying && !isPreviewMode) {
      animate();
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, animate, isPreviewMode]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isStarted) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          setIsPlaying(prev => !prev);
          break;
        case '+':
        case '=':
          e.preventDefault();
          setSpeed(prev => Math.min(1.0, prev + 0.05));
          break;
        case '-':
          e.preventDefault();
          setSpeed(prev => Math.max(0.05, prev - 0.05));
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          handleRewind();
          break;
        case 'b':
        case 'B':
          e.preventDefault();
          handleAddBookmark();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isStarted]);

  const handleStart = () => {
    if (script.length === 0) {
      toast({
        title: "Fehler",
        description: "Kein Skript geladen. Bitte wählen Sie zunächst ein Skript aus.",
        variant: "destructive"
      });
      return;
    }
    setIsStarted(true);
    setIsPlaying(false); // Start paused, user must press play
  };

  const handlePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const handleRewind = () => {
    setCurrentPosition(0);
    setIsPlaying(false);
  };

  const handleSpeedChange = (delta: number) => {
    setSpeed(prev => Math.max(0.05, Math.min(1.0, prev + delta)));
  };

  const handleAddBookmark = () => {
    const name = prompt('Name für das Lesezeichen:');
    if (name) {
      const newBookmark: Bookmark = {
        id: Date.now().toString(),
        name,
        position: currentPosition
      };
      setBookmarks(prev => [...prev, newBookmark]);
      toast({
        title: "Lesezeichen hinzugefügt",
        description: `"${name}" wurde hinzugefügt.`
      });
    }
  };

  const handleGoToBookmark = (bookmark: Bookmark) => {
    setCurrentPosition(bookmark.position);
    setIsPlaying(false);
  };

  const handleExportScript = () => {
    const dataStr = JSON.stringify(script, null, 2);
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
          setScript(data);
          setCurrentPosition(0);
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

  const renderScript = () => {
    return script.map((item, index) => {
      let className = "mb-4 leading-relaxed";
      let content = item.text;

      switch (item.type) {
        case 'direction':
          className += " text-teleprompter-direction italic text-[0.8em]";
          break;
        case 'speaker-andreas':
          className += " text-teleprompter-text";
          // Entferne den Namen falls vorhanden (z.B. "Andreas: Text" -> " Text")
          content = content.replace(/^[^:]*:\s*/, '');
          return (
            <div key={index} className={className}>
              <span className="font-bold text-speaker-andreas">Andreas: </span>
              {content}
            </div>
          );
        case 'speaker-achim':
          className += " text-teleprompter-text";
          // Entferne den Namen falls vorhanden (z.B. "Achim: Text" -> " Text")
          content = content.replace(/^[^:]*:\s*/, '');
          return (
            <div key={index} className={className}>
              <span className="font-bold text-speaker-achim">Achim: </span>
              {content}
            </div>
          );
        default:
          className += " text-teleprompter-text";
      }

      return (
        <div key={index} className={className}>
          {content}
        </div>
      );
    });
  };

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-teleprompter-bg text-teleprompter-text flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6 text-center">
          <h1 className="text-4xl font-bold mb-8">Teleprompter</h1>
          
          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-300 p-4 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="script-select" className="block text-sm font-medium mb-2">
                Skript auswählen:
              </label>
              <Select value={scriptUrl} onValueChange={setScriptUrl}>
                <SelectTrigger className="bg-teleprompter-bg border-gray-600 text-teleprompter-text">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-teleprompter-bg border-gray-600">
                  {availableScripts.map(script => (
                    <SelectItem key={script} value={script} className="text-teleprompter-text hover:bg-gray-800">
                      {script}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="custom-url" className="block text-sm font-medium mb-2">
                Oder eigene URL:
              </label>
              <Input
                id="custom-url"
                type="text"
                value={scriptUrl}
                onChange={(e) => setScriptUrl(e.target.value)}
                placeholder="https://example.com/script.json"
                className="bg-teleprompter-bg border-gray-600 text-teleprompter-text"
              />
            </div>
            
            <div className="flex gap-2">
              <input
                type="file"
                accept=".json"
                onChange={handleImportScript}
                className="hidden"
                id="import-script"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('import-script')?.click()}
                className="flex-1 bg-teleprompter-bg border-gray-600 text-teleprompter-text hover:bg-gray-800"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button
                variant="outline"
                onClick={handleExportScript}
                disabled={script.length === 0}
                className="flex-1 bg-teleprompter-bg border-gray-600 text-teleprompter-text hover:bg-gray-800"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-gray-800/30 rounded-lg">
              <Label htmlFor="preview-mode" className="text-sm font-medium">
                Vorschau-Modus
              </Label>
              <Switch
                id="preview-mode"
                checked={isPreviewMode}
                onCheckedChange={setIsPreviewMode}
              />
            </div>
          </div>
          
          <Button
            onClick={handleStart}
            disabled={script.length === 0}
            className="w-full py-4 text-lg bg-startButton hover:bg-startButton-hover text-white font-bold"
            aria-label="Teleprompter starten"
          >
            <Play className="w-6 h-6 mr-2" />
            Teleprompter starten
          </Button>
          
          {bookmarks.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Lesezeichen:</h3>
              <div className="space-y-1">
                {bookmarks.map(bookmark => (
                  <Button
                    key={bookmark.id}
                    variant="ghost"
                    onClick={() => handleGoToBookmark(bookmark)}
                    className="w-full text-left justify-start text-teleprompter-text hover:bg-gray-800"
                  >
                    <Bookmark className="w-4 h-4 mr-2" />
                    {bookmark.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isPreviewMode) {
    return (
      <div className="min-h-screen bg-teleprompter-bg text-teleprompter-text">
        <div className="max-w-4xl mx-auto p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Skript-Vorschau</h1>
            <Button
              onClick={() => setIsStarted(false)}
              variant="outline"
              className="bg-teleprompter-bg border-gray-600 text-teleprompter-text hover:bg-gray-800"
            >
              Zurück zum Start
            </Button>
          </div>
          <div className="text-lg leading-relaxed">
            {renderScript()}
          </div>
        </div>
      </div>
    );
  }

  // Calculate progress percentage
  const getProgress = () => {
    if (!scriptRef.current) return 0;
    const maxScroll = scriptRef.current.clientHeight - window.innerHeight + 200;
    return Math.min(100, Math.max(0, (currentPosition / maxScroll) * 100));
  };

  return (
    <div 
      ref={containerRef}
      className="h-screen overflow-hidden bg-teleprompter-bg text-teleprompter-text relative select-none"
      style={{ userSelect: 'none' }}
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800 z-20">
        <div 
          className="h-full bg-gradient-to-r from-speaker-andreas to-speaker-achim transition-all duration-300"
          style={{ width: `${getProgress()}%` }}
        />
      </div>

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
          transform: `translateY(-${currentPosition}px)`,
          willChange: 'transform',
          fontSize: window.innerWidth <= 768 ? '5vw' : '28px',
          maxWidth: window.innerWidth <= 768 ? '95%' : '900px',
          lineHeight: '1.6'
        }}
      >
        {renderScript()}
      </div>
      
      {/* Desktop controls */}
      <div className="hidden md:block fixed bottom-4 right-4 bg-control-bg/70 text-control-text p-4 rounded-lg backdrop-blur-sm">
        <div className="text-sm space-y-1">
          <div>Leertaste: Play/Pause</div>
          <div>+/-: Geschwindigkeit</div>
          <div>R: Zurückspulen</div>
          <div>B: Lesezeichen</div>
          <div className="font-medium">Geschwindigkeit: {speed.toFixed(2)}</div>
        </div>
      </div>
      
      {/* Mobile controls */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-mobileControl-bg/95 text-mobileControl-text p-4 backdrop-blur-md border-t border-gray-600">
        <div className="flex justify-center items-center gap-3">
          <Button
            onClick={() => setIsStarted(false)}
            className="w-10 h-10 rounded-full bg-gray-700 text-white border border-gray-600 hover:bg-gray-600 focus:bg-gray-600 focus:ring-2 focus:ring-gray-500 active:bg-gray-800"
            aria-label="Zum Startmenü"
          >
            <Home className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={() => handleSpeedChange(-0.05)}
            className="w-10 h-10 rounded-full bg-gray-700 text-white border border-gray-600 hover:bg-gray-600 focus:bg-gray-600 focus:ring-2 focus:ring-gray-500 active:bg-gray-800"
            aria-label="Scrollgeschwindigkeit verringern"
          >
            <Minus className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={handlePlayPause}
            className="w-12 h-12 rounded-full bg-gray-700 text-white border border-gray-600 hover:bg-gray-600 focus:bg-gray-600 focus:ring-2 focus:ring-gray-500 active:bg-gray-800"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
          
          <Button
            onClick={() => handleSpeedChange(0.05)}
            className="w-10 h-10 rounded-full bg-gray-700 text-white border border-gray-600 hover:bg-gray-600 focus:bg-gray-600 focus:ring-2 focus:ring-gray-500 active:bg-gray-800"
            aria-label="Scrollgeschwindigkeit erhöhen"
          >
            <Plus className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={handleRewind}
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
    </div>
  );
};

export default Teleprompter;