import React from 'react';
import { Play, Bookmark, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { TeleprompterState, Bookmark as BookmarkType } from '@/hooks/useTeleprompterState';

interface TeleprompterStartScreenProps {
  state: TeleprompterState;
  availableScripts: string[];
  onScriptUrlChange: (url: string) => void;
  onPreviewModeChange: (preview: boolean) => void;
  onStart: () => void;
  onImportScript: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExportScript: () => void;
  onGoToBookmark: (bookmark: BookmarkType) => void;
}

export const TeleprompterStartScreen: React.FC<TeleprompterStartScreenProps> = ({
  state,
  availableScripts,
  onScriptUrlChange,
  onPreviewModeChange,
  onStart,
  onImportScript,
  onExportScript,
  onGoToBookmark
}) => {
  return (
    <div className="min-h-screen bg-teleprompter-bg text-teleprompter-text flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <h1 className="text-4xl font-bold mb-8">Teleprompter</h1>
        
        {state.error && (
          <div className="bg-red-900/20 border border-red-500 text-red-300 p-4 rounded-lg">
            {state.error}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label htmlFor="script-select" className="block text-sm font-medium mb-2">
              Skript auswählen:
            </label>
            <Select value={state.scriptUrl} onValueChange={onScriptUrlChange}>
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
              value={state.scriptUrl}
              onChange={(e) => onScriptUrlChange(e.target.value)}
              placeholder="https://example.com/script.json"
              className="bg-teleprompter-bg border-gray-600 text-teleprompter-text"
            />
          </div>
          
          <div className="flex gap-2">
            <input
              type="file"
              accept=".json"
              onChange={onImportScript}
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
              onClick={onExportScript}
              disabled={state.script.length === 0}
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
              checked={state.isPreviewMode}
              onCheckedChange={onPreviewModeChange}
            />
          </div>
        </div>
        
        <Button
          onClick={onStart}
          disabled={state.script.length === 0}
          className="w-full py-4 text-lg bg-startButton hover:bg-startButton-hover text-white font-bold"
          aria-label="Teleprompter starten"
        >
          <Play className="w-6 h-6 mr-2" />
          Teleprompter starten
        </Button>
        
        {state.bookmarks.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Lesezeichen:</h3>
            <div className="space-y-1">
              {state.bookmarks.map(bookmark => (
                <Button
                  key={bookmark.id}
                  variant="ghost"
                  onClick={() => onGoToBookmark(bookmark)}
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
};