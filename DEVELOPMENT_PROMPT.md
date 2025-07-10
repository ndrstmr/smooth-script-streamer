# Smooth Script Streamer - Detaillierter Entwicklungs-Prompt

## Projektübersicht

Entwickle eine professionelle, state-of-the-art Teleprompter Web-Anwendung für Live-Podcasts und Präsentationen. Die App soll flüssiges Scrolling, JSON-basierte Skript-Verwaltung und responsive Design bieten.

## Technische Grundlagen

### Core Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS mit Custom Design System
- **UI Components**: Radix UI (Shadcn/ui)
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Animation**: requestAnimationFrame für flüssiges Scrolling
- **Deployment**: GitHub Pages mit automatischem CI/CD

### Architektur-Prinzipien
- Komponenten-basierte Architektur mit klarer Trennung
- Custom Hooks für State Management und Business Logic
- Design System mit semantischen CSS-Variablen
- Mobile-First Responsive Design
- Performance-optimiert mit 60fps Animations

## Entwicklungsschritte

### Phase 1: Projekt-Setup
```bash
# Vite React TypeScript Template
npm create vite@latest smooth-script-streamer -- --template react-ts
cd smooth-script-streamer

# Core Dependencies
npm install @radix-ui/react-* lucide-react class-variance-authority
npm install tailwindcss-animate clsx tailwind-merge
npm install react-router-dom @types/node

# Dev Dependencies  
npm install -D @types/react @types/react-dom eslint typescript
```

### Phase 2: Design System Setup

#### tailwind.config.ts
```typescript
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Semantic color system
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        
        // Teleprompter specific colors
        "teleprompter-bg": "hsl(var(--teleprompter-bg))",
        "teleprompter-text": "hsl(var(--teleprompter-text))",
        "teleprompter-direction": "hsl(var(--teleprompter-direction))",
        "teleprompter-focus": "hsl(var(--teleprompter-focus))",
        
        // Speaker colors
        speaker: {
          andreas: "hsl(var(--speaker-andreas))",
          achim: "hsl(var(--speaker-achim))",
        },
        
        // Control colors
        "control-bg": "hsl(var(--control-bg))",
        "control-text": "hsl(var(--control-text))",
        "mobileControl-bg": "hsl(var(--mobileControl-bg))",
        "mobileControl-text": "hsl(var(--mobileControl-text))",
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        }
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
}
```

#### src/index.css (Design System)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Studio-optimiertes Dark Theme */
    --background: 210 11% 7%;
    --foreground: 210 11% 88%;
    --primary: 102 76% 52%;
    --primary-foreground: 210 11% 7%;
    
    /* Teleprompter Farben */
    --teleprompter-bg: 210 11% 7%;
    --teleprompter-text: 210 11% 88%;
    --teleprompter-direction: 210 11% 60%;
    --teleprompter-focus: 0 100% 50%;
    
    /* Sprecher Farben */
    --speaker-andreas: 102 100% 52%;
    --speaker-achim: 203 100% 62%;
    
    /* Control Farben */
    --control-bg: 210 11% 15%;
    --control-text: 210 11% 88%;
    --mobileControl-bg: 210 11% 11%;
    --mobileControl-text: 210 11% 88%;
  }
  
  * {
    border-color: hsl(var(--border));
  }
  
  body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

@layer components {
  .teleprompter-scroll {
    will-change: transform;
    transform: translate3d(0, 0, 0);
  }
  
  .focus-line {
    position: fixed;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background-color: hsl(var(--teleprompter-focus) / 0.5);
    z-index: 10;
    pointer-events: none;
  }
}
```

### Phase 3: Datenstrukturen und Interfaces

#### src/hooks/useTeleprompterState.ts
```typescript
export interface ScriptItem {
  type: 'direction' | 'speaker-a' | 'speaker-b';
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
  };
}
```

### Phase 4: Core Components

#### Hauptkomponenten-Struktur:
```
src/components/
├── Teleprompter.tsx              # Haupt-Container
├── teleprompter/
│   ├── TeleprompterStartScreen.tsx
│   ├── TeleprompterPreview.tsx
│   ├── TeleprompterPlayer.tsx
│   ├── TeleprompterControls.tsx
│   └── TeleprompterProgressBar.tsx
└── ui/                           # Shadcn Components
```

#### Animation Hook (Kritisch für Performance):
```typescript
// src/hooks/useTeleprompterAnimation.ts
export const useTeleprompterAnimation = ({
  isPlaying,
  speed,
  currentPosition,
  onPositionUpdate,
  onMaxScrollUpdate,
  scriptRef
}: AnimationHookProps) => {
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>();

  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
      return;
    }

    let lastPosition = currentPosition;

    const animate = (timestamp: number) => {
      if (!scriptRef.current) return;

      const maxScroll = scriptRef.current.clientHeight - window.innerHeight + 200;
      onMaxScrollUpdate(maxScroll);

      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      const newPosition = lastPosition + (speed * deltaTime * 0.2);
      lastPosition = newPosition;
      
      if (newPosition >= maxScroll) {
        onPositionUpdate(maxScroll);
        return;
      }
      
      onPositionUpdate(newPosition);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    lastTimeRef.current = undefined;
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, speed, currentPosition]);
};
```

### Phase 5: Features Implementation

#### 5.1 JSON Script Loading
- Unterstützung für externe JSON-Dateien
- Fallback-Handling bei Netzwerkfehlern
- Validierung der Skript-Struktur
- Dynamic Import für bessere Performance

#### 5.2 Responsive Controls
- **Desktop**: Keyboard-Shortcuts (Space, +/-, R, B)
- **Mobile**: Touch-optimierte Buttons mit Backdrop-Blur
- **Accessibility**: ARIA-Labels und Focus-Management

#### 5.3 Bookmark System
- localStorage Persistence
- Navigation zu gespeicherten Positionen
- Export/Import Funktionalität

#### 5.4 Progress Tracking
- Visuelle Fortschrittsanzeige
- Position-basierte Berechnung
- Responsive Updates während Playback

### Phase 6: Styling Guidelines

#### Design Principles:
- **Studio-Dark Theme**: #121212 Background, #e0e0e0 Text
- **Kontrast-optimiert**: WCAG 2.1 AA Standard
- **Performance**: Hardware-beschleunigtes Scrolling
- **Responsive**: 320px - 1920px Viewport Support

#### Component Styling:
```css
/* Teleprompter Player Styles */
.teleprompter-container {
  background: hsl(var(--teleprompter-bg));
  color: hsl(var(--teleprompter-text));
  font-size: clamp(1.5rem, 4vw, 3rem);
  line-height: 1.6;
  padding: 2rem;
}

.direction-text {
  color: hsl(var(--teleprompter-direction));
  font-style: italic;
  font-size: 0.8em;
  margin-bottom: 1rem;
}

.speaker-text {
  margin-bottom: 1rem;
}

.speaker-andreas {
  color: hsl(var(--speaker-andreas));
  font-weight: 600;
}

.speaker-achim {
  color: hsl(var(--speaker-achim));
  font-weight: 600;
}
```

### Phase 7: State Management

#### Custom Hooks Pattern:
- `useTeleprompterState`: Zentrale State-Verwaltung
- `useTeleprompterHandlers`: Event-Handler und Business Logic
- `useTeleprompterAnimation`: Performance-optimierte Animation
- `useMobile`: Responsive Breakpoint Detection

#### localStorage Integration:
```typescript
// Persistent Settings
const persistedSettings = {
  speed: 'teleprompter-speed',
  bookmarks: 'teleprompter-bookmarks',
  speakerAliases: 'teleprompter-speaker-aliases'
};
```

### Phase 8: GitHub Pages Deployment

#### vite.config.ts Setup:
```typescript
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/smooth-script-streamer/' : '/',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
```

#### GitHub Actions Workflow:
- Automatisches Build bei Push zu main
- Upload zu GitHub Pages
- Optimierte Deployment-Pipeline

## JSON Skript-Format

### Standard-Format:
```json
[
  {
    "type": "direction",
    "text": "[Regieanweisung in eckigen Klammern]"
  },
  {
    "type": "speaker-a",
    "text": "Text des ersten Sprechers"
  },
  {
    "type": "speaker-b", 
    "text": "Text des zweiten Sprechers"
  }
]
```

### Unterstützte Typen:
- `direction`: Regieanweisungen (grau, kursiv, kleiner)
- `speaker-a`: Erster Sprecher (grün: #76ff03)
- `speaker-b`: Zweiter Sprecher (blau: #40c4ff)

## Performance Requirements

### Animation:
- 60fps flüssiges Scrolling
- requestAnimationFrame für optimale Performance
- Hardware-Beschleunigung via CSS transforms
- Geschwindigkeitsregelung: 0.05 - 1.0

### Bundle Size:
- Tree-shaking für Lucide Icons
- Code Splitting für bessere Ladezeiten
- Optimierte Tailwind CSS Build

### Accessibility:
- ARIA-Labels für alle interaktiven Elemente
- Vollständige Tastatursteuerung
- Screenreader-Kompatibilität
- Fokus-Indikatoren

## Testing & Quality Assurance

### Browser-Kompatibilität:
- Chrome 90+, Firefox 88+, Safari 14+
- Mobile Browser Support (iOS Safari, Chrome Mobile)
- Touch-Event Handling

### Performance-Tests:
- 60fps Animation Consistency
- Memory Leak Prevention
- Large Script Loading (>1MB JSON)

### Accessibility-Tests:
- WCAG 2.1 AA Compliance
- Keyboard Navigation
- Screen Reader Testing

## Deployment Checklist

### Pre-Deployment:
- [ ] Alle Tests bestanden
- [ ] Performance Audit durchgeführt
- [ ] Accessibility Validation
- [ ] Mobile Testing abgeschlossen
- [ ] GitHub Actions Workflow getestet

### Post-Deployment:
- [ ] Live URL funktional
- [ ] Script Loading funktioniert
- [ ] Mobile Controls responsive
- [ ] Performance Monitoring aktiv

## Wartung & Updates

### Monitoring:
- GitHub Actions Status
- Performance Metriken
- User Feedback Integration

### Update-Strategie:
- Semantic Versioning
- Backward-kompatible JSON-Formate
- Progressive Enhancement

---

**Ziel**: Eine professionelle, barrierefreie und performance-optimierte Teleprompter-Lösung für Live-Produktionen und Präsentationen.