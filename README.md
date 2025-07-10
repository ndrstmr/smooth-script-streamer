# Teleprompter - State-of-the-Art Web-App

Eine moderne, responsive und barrierefreie Teleprompter Web-App, optimiert für Live-Podcasts und Präsentationen.

## 🚀 Live Demo
Die App ist live verfügbar unter: **[GitHub Pages](https://ndrstmr.github.io/smooth-script-streamer/)**

> **Hinweis**: Ersetzen Sie `yourusername` und `repository-name` mit Ihren tatsächlichen GitHub-Daten.

## Features

### 🎯 Kernfunktionalitäten
- **Flüssiges Scrollen**: Sanfte Animation von unten nach oben mit `requestAnimationFrame`
- **JSON-Skript-Integration**: Dynamisches Laden von Skripten aus externen JSON-Dateien
- **Responsive Design**: Optimiert für Desktop (320px - 1920px) und Mobile
- **Dark Mode**: Studio-optimiertes Design (#121212 Hintergrund, #e0e0e0 Text)
- **Fokuslinie**: Halbtransparente rote Linie zur Markierung des aktuellen Lesepunkts

### 🎮 Steuerung
**Desktop:**
- `Leertaste`: Play/Pause
- `+/-`: Geschwindigkeit anpassen (0.05 - 1.0)
- `R`: Zurückspulen zum Anfang
- `B`: Lesezeichen setzen

**Mobile:**
- Touch-optimierte Steuerleiste am unteren Bildschirmrand
- Runde Buttons für alle Funktionen
- Backdrop-Filter für modernen Look

### 🚀 Erweiterte Features
- **Skript-Auswahl**: Dropdown-Menü für verschiedene JSON-Dateien
- **Lesezeichen**: Setzen und Navigieren zu bestimmten Positionen
- **Export/Import**: Skripte als JSON herunterladen/hochladen
- **Vorschau-Modus**: Statische Anzeige zur Vorbereitung
- **Einstellungen-Speicherung**: Geschwindigkeit in localStorage
- **Fehlerbehandlung**: Benutzerfreundliche Fehlermeldungen

### ♿ Barrierefreiheit
- ARIA-Attribute für alle interaktiven Elemente
- Vollständige Tastatursteuerung
- Screenreader-optimierte Labels
- Fokus-Indikatoren für bessere Navigation

## JSON-Format

```json
[
  {
    "type": "direction",
    "text": "[Regieanweisung in eckigen Klammern]"
  },
  {
    "type": "speaker-andreas",
    "text": "Text des Sprechers Andreas"
  },
  {
    "type": "speaker-achim", 
    "text": "Text des Sprechers Achim"
  }
]
```

### Unterstützte Sprecher-Typen:
- `direction`: Regieanweisungen (grau, kursiv, kleiner)
- `speaker-andreas`: Sprecher Andreas (grün: #76ff03)
- `speaker-achim`: Sprecher Achim (blau: #40c4ff)

## Installation & Start

### Voraussetzungen
- Node.js (Version 16 oder höher)
- npm oder yarn

### Lokale Entwicklung
```bash
# Repository klonen
git clone <repository-url>
cd teleprompter

# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Die App ist dann unter `http://localhost:8080` erreichbar.

### Produktion
```bash
# Build erstellen
npm run build

# Mit Python-Server testen
cd dist
python -m http.server 8000
```

## Verwendung

1. **Skript auswählen**: Wählen Sie aus den verfügbaren Skripten oder geben Sie eine eigene URL ein
2. **Import/Export**: Laden Sie eigene JSON-Dateien hoch oder exportieren Sie bestehende Skripte
3. **Vorschau**: Nutzen Sie den Vorschau-Modus zur Vorbereitung
4. **Teleprompter starten**: Klicken Sie auf den grünen Start-Button
5. **Steuerung**: Nutzen Sie Tastatur (Desktop) oder Touch-Controls (Mobile)
6. **Lesezeichen**: Setzen Sie Markierungen mit 'B' für wichtige Stellen

## Technische Details

### Architektur
- **React 18** mit TypeScript
- **Tailwind CSS** für Styling
- **Radix UI** für accessible Components
- **Lucide React** für Icons
- **React Router** für Navigation

### Performance-Optimierungen
- `will-change: transform` für flüssige Animationen
- `requestAnimationFrame` für optimales Scrolling
- Geschwindigkeitsbegrenzung (0.05-1.0) für ältere Geräte
- Lazy Loading für große Skripte

### Browser-Kompatibilität
- Moderne Browser (Chrome 90+, Firefox 88+, Safari 14+)
- Fallbacks für fehlende Features
- Mobile Browser (iOS Safari, Chrome Mobile)

## Beispiel-Skripte

Die App wird mit drei Beispiel-Episoden geliefert:
- `script.json`: Erste Folge "Entwickler-Behörde"
- `episode-2.json`: APIs in der Verwaltung
- `episode-3.json`: Testing-Strategien

## Anpassungen

### Neue Sprecher hinzufügen
1. Farbe in `src/index.css` definieren:
```css
--speaker-newname: [HSL-Wert];
```

2. Farbe in `tailwind.config.ts` einbinden:
```typescript
speaker: {
  newname: 'hsl(var(--speaker-newname))',
}
```

3. Typ in Teleprompter-Komponente erweitern

### Styling anpassen
Alle Farben und Designs sind im Design-System definiert:
- `src/index.css`: CSS-Variablen
- `tailwind.config.ts`: Tailwind-Konfiguration

## Troubleshooting

### Häufige Probleme
- **Skript lädt nicht**: Prüfen Sie die JSON-Syntax und Dateipfade
- **Animation ruckelt**: Reduzieren Sie die Scrollgeschwindigkeit
- **Mobile Steuerung reagiert nicht**: Überprüfen Sie Touch-Events im Browser

### Debug-Modus
Öffnen Sie die Browser-Entwicklertools für detaillierte Logs und Fehlermeldungen.

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz verfügbar.

## Support

Bei Fragen oder Problemen erstellen Sie bitte ein Issue im Repository oder kontaktieren Sie das Entwicklerteam.

---

**Entwickelt für professionelle Podcast-Produktionen und Live-Präsentationen.**
