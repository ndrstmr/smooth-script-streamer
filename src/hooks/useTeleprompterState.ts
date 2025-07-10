import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ScriptItem {
  type: 'direction' | 'speaker-a' | 'speaker-b' | 'speaker-andreas' | 'speaker-achim';
  text: string;
}

export interface Bookmark {
  id: string;
  name: string;
  position: number;
}

export interface TeleprompterState {
  script: ScriptItem[];
  isStarted: boolean;
  isPlaying: boolean;
  speed: number;
  currentPosition: number;
  scriptUrl: string;
  bookmarks: Bookmark[];
  isPreviewMode: boolean;
  error: string;
  maxScrollDistance: number;
  speakerAliases: {
    'speaker-a': string;
    'speaker-b': string;
    'speaker-andreas': string;
    'speaker-achim': string;
  };
}

export const useTeleprompterState = () => {
  const [state, setState] = useState<TeleprompterState>({
    script: [],
    isStarted: false,
    isPlaying: false,
    speed: 0.35,
    currentPosition: 0,
    scriptUrl: 'script.json',
    bookmarks: [],
    isPreviewMode: false,
    error: '',
    maxScrollDistance: 0,
    speakerAliases: {
      'speaker-a': 'Andreas',
      'speaker-b': 'Achim', 
      'speaker-andreas': 'Andreas',
      'speaker-achim': 'Achim'
    }
  });

  const { toast } = useToast();
  const availableScripts = ['script.json', 'episode1.json'];

  // Load settings from localStorage
  useEffect(() => {
    const savedSpeed = localStorage.getItem('teleprompter-speed');
    const savedBookmarks = localStorage.getItem('teleprompter-bookmarks');
    const savedAliases = localStorage.getItem('teleprompter-speaker-aliases');
    
    if (savedSpeed) {
      setState(prev => ({ ...prev, speed: parseFloat(savedSpeed) }));
    }
    if (savedBookmarks) {
      setState(prev => ({ ...prev, bookmarks: JSON.parse(savedBookmarks) }));
    }
    if (savedAliases) {
      setState(prev => ({ ...prev, speakerAliases: { ...prev.speakerAliases, ...JSON.parse(savedAliases) } }));
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('teleprompter-speed', state.speed.toString());
  }, [state.speed]);

  useEffect(() => {
    localStorage.setItem('teleprompter-bookmarks', JSON.stringify(state.bookmarks));
  }, [state.bookmarks]);

  useEffect(() => {
    localStorage.setItem('teleprompter-speaker-aliases', JSON.stringify(state.speakerAliases));
  }, [state.speakerAliases]);

  const loadScript = useCallback(async (url: string) => {
    try {
      console.log('Loading script from:', url);
      setState(prev => ({ ...prev, error: '' }));
      const response = await fetch(url);
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const text = await response.text();
      console.log('Response text:', text.substring(0, 100));
      const data = JSON.parse(text);
      
      if (!Array.isArray(data)) {
        throw new Error('Skript-Format ist ungültig. Erwartet wird ein Array.');
      }
      
      setState(prev => ({ 
        ...prev, 
        script: data, 
        currentPosition: 0,
        maxScrollDistance: 0
      }));
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unbekannter Fehler';
      setState(prev => ({
        ...prev,
        error: `Fehler beim Laden des Skripts: ${errorMessage}`,
        script: [{
          type: 'direction',
          text: `[Fehler: Skript konnte nicht geladen werden - ${errorMessage}]`
        }]
      }));
    }
  }, []);

  const updateMaxScrollDistance = useCallback((distance: number) => {
    setState(prev => ({ ...prev, maxScrollDistance: distance }));
  }, []);

  const setCurrentPosition = useCallback((position: number) => {
    setState(prev => ({ ...prev, currentPosition: position }));
  }, []);

  const setIsPlaying = useCallback((playing: boolean) => {
    setState(prev => ({ ...prev, isPlaying: playing }));
  }, []);

  const setSpeed = useCallback((speed: number) => {
    setState(prev => ({ ...prev, speed: Math.max(0.05, Math.min(1.0, speed)) }));
  }, []);

  const setScriptUrl = useCallback((url: string) => {
    setState(prev => ({ ...prev, scriptUrl: url }));
  }, []);

  const setIsStarted = useCallback((started: boolean) => {
    setState(prev => ({ ...prev, isStarted: started }));
  }, []);

  const setIsPreviewMode = useCallback((preview: boolean) => {
    setState(prev => ({ ...prev, isPreviewMode: preview }));
  }, []);

  const addBookmark = useCallback((name: string) => {
    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      name,
      position: state.currentPosition
    };
    setState(prev => ({ ...prev, bookmarks: [...prev.bookmarks, newBookmark] }));
    toast({
      title: "Lesezeichen hinzugefügt",
      description: `"${name}" wurde hinzugefügt.`
    });
  }, [state.currentPosition, toast]);

  const goToBookmark = useCallback((bookmark: Bookmark) => {
    setState(prev => ({ 
      ...prev, 
      currentPosition: bookmark.position,
      isPlaying: false
    }));
  }, []);

  const handleStart = useCallback(() => {
    if (state.script.length === 0) {
      toast({
        title: "Fehler",
        description: "Kein Skript geladen. Bitte wählen Sie zunächst ein Skript aus.",
        variant: "destructive"
      });
      return;
    }
    setState(prev => ({ ...prev, isStarted: true, isPlaying: false }));
  }, [state.script.length, toast]);

  const handleRewind = useCallback(() => {
    setState(prev => ({ ...prev, currentPosition: 0, isPlaying: false }));
  }, []);

  const setSpeakerAlias = useCallback((speakerType: keyof TeleprompterState['speakerAliases'], alias: string) => {
    setState(prev => ({ 
      ...prev, 
      speakerAliases: { 
        ...prev.speakerAliases, 
        [speakerType]: alias 
      } 
    }));
  }, []);

  return {
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
  };
};