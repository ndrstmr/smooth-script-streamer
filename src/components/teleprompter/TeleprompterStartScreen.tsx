import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Play, Upload, Download, Bookmark } from 'lucide-react';
import { Bookmark as BookmarkType, TeleprompterState } from '@/hooks/useTeleprompterState';

interface TeleprompterStartScreenProps {
  state: TeleprompterState;
  availableScripts: string[];
  onScriptUrlChange: (url: string) => void;
  onPreviewModeChange: (preview: boolean) => void;
  onStart: () => void;
  onImportScript: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExportScript: () => void;
  onGoToBookmark: (bookmark: BookmarkType) => void;
  onSpeakerAliasChange: (speakerType: keyof TeleprompterState['speakerAliases'], alias: string) => void;
}

export const TeleprompterStartScreen: React.FC<TeleprompterStartScreenProps> = ({
  state,
  availableScripts,
  onScriptUrlChange,
  onPreviewModeChange,
  onStart,
  onImportScript,
  onExportScript,
  onGoToBookmark,
  onSpeakerAliasChange
}) => {
  return (
    <div className="min-h-screen bg-teleprompter-bg text-teleprompter-text">
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-primary">Teleprompter</h1>
          <p className="text-lg text-muted-foreground">Professionelle Lösung für Skript-Präsentationen</p>
        </div>

        <Tabs defaultValue="script" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="script">Skript</TabsTrigger>
            <TabsTrigger value="speakers">Sprecher</TabsTrigger>
            <TabsTrigger value="bookmarks">Lesezeichen</TabsTrigger>
          </TabsList>

          <TabsContent value="script">
            <Card>
              <CardHeader>
                <CardTitle>Skript-Auswahl</CardTitle>
                <CardDescription>
                  Wählen Sie ein Skript aus oder laden Sie Ihr eigenes hoch.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {state.error && (
                  <div className="bg-red-900/20 border border-red-500 text-red-300 p-4 rounded-lg">
                    {state.error}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="script-select">Verfügbare Skripte:</Label>
                    <Select value={state.scriptUrl} onValueChange={onScriptUrlChange}>
                      <SelectTrigger className="bg-teleprompter-bg border-gray-600 text-teleprompter-text">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-teleprompter-bg border-gray-600">
                        {availableScripts.map(script => (
                          <SelectItem key={script} value={script} className="text-teleprompter-text">
                            {script}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="custom-url">Eigene URL:</Label>
                    <Input
                      id="custom-url"
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
                    <Label htmlFor="preview-mode">Vorschau-Modus</Label>
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
                >
                  <Play className="w-6 h-6 mr-2" />
                  Teleprompter starten
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="speakers">
            <Card>
              <CardHeader>
                <CardTitle>Sprecher-Namen konfigurieren</CardTitle>
                <CardDescription>
                  Definieren Sie die Anzeigenamen für die verschiedenen Sprecher-Typen.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="speaker-a">Sprecher A</Label>
                    <Input
                      id="speaker-a"
                      value={state.speakerAliases['speaker-a']}
                      onChange={(e) => onSpeakerAliasChange('speaker-a', e.target.value)}
                      placeholder="Name für Sprecher A"
                    />
                  </div>
                  <div>
                    <Label htmlFor="speaker-b">Sprecher B</Label>
                    <Input
                      id="speaker-b"
                      value={state.speakerAliases['speaker-b']}
                      onChange={(e) => onSpeakerAliasChange('speaker-b', e.target.value)}
                      placeholder="Name für Sprecher B"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="speaker-andreas">Andreas</Label>
                    <Input
                      id="speaker-andreas"
                      value={state.speakerAliases['speaker-andreas']}
                      onChange={(e) => onSpeakerAliasChange('speaker-andreas', e.target.value)}
                      placeholder="Name für Andreas"
                    />
                  </div>
                  <div>
                    <Label htmlFor="speaker-achim">Achim</Label>
                    <Input
                      id="speaker-achim"
                      value={state.speakerAliases['speaker-achim']}
                      onChange={(e) => onSpeakerAliasChange('speaker-achim', e.target.value)}
                      placeholder="Name für Achim"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookmarks">
            <Card>
              <CardHeader>
                <CardTitle>Lesezeichen</CardTitle>
                <CardDescription>
                  Gespeicherte Positionen im Skript für schnelle Navigation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {state.bookmarks.length > 0 ? (
                  <div className="space-y-2">
                    {state.bookmarks.map(bookmark => (
                      <Button
                        key={bookmark.id}
                        variant="ghost"
                        onClick={() => onGoToBookmark(bookmark)}
                        className="w-full justify-start text-teleprompter-text hover:bg-gray-800"
                      >
                        <Bookmark className="w-4 h-4 mr-2" />
                        {bookmark.name}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Keine Lesezeichen vorhanden
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};