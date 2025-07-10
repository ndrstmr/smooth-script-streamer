# Technical Specification - Podcast Karaoke

## Core Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS mit Custom Design System
- **UI Components**: Radix UI (Shadcn/ui)
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Animation**: requestAnimationFrame für flüssiges Scrolling
- **Backend**: Firebase (Firestore, Authentication, Cloud Functions)
- **AI Integration**: Google Gemini Pro API für Script-Generierung
- **Real-time**: Firebase Realtime Database für Multi-User Sessions
- **Deployment**: GitHub Pages + Firebase Hosting

## Architektur-Prinzipien
- Komponenten-basierte Architektur mit klarer Trennung
- Custom Hooks für State Management und Business Logic
- Design System mit semantischen CSS-Variablen
- Mobile-First Responsive Design
- Performance-optimiert mit 60fps Animations
- AI-First Approach für Content-Generierung
- Real-time Multi-User Architektur
- Firebase-basierte Backend Services

## Dependencies Setup

### Core Dependencies
```bash
npm install @radix-ui/react-* lucide-react class-variance-authority
npm install tailwindcss-animate clsx tailwind-merge
npm install react-router-dom @types/node
```

### Firebase & AI Integration
```bash
npm install firebase @google/generative-ai
npm install @firebase/firestore @firebase/auth @firebase/functions
```

### Dev Dependencies
```bash
npm install -D @types/react @types/react-dom eslint typescript
```

## Design System Configuration

### tailwind.config.ts
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

### src/index.css (Design System)
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

## Data Structures

### TypeScript Interfaces
```typescript
export interface ScriptItem {
  type: 'direction' | 'speaker-a' | 'speaker-b' | 'both' | 'pause';
  text: string;
  timestamp?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface GeneratedScript {
  metadata: {
    title: string;
    duration: string;
    difficulty: 'easy' | 'medium' | 'hard';
    generatedBy: 'gemini-pro';
    createdAt: string;
    topics: string[];
  };
  script: ScriptItem[];
}

export interface KaraokeSession {
  id: string;
  hostId: string;
  scriptId: string;
  participants: Participant[];
  state: 'waiting' | 'active' | 'completed';
  roles: { speakerA: string; speakerB: string };
  performance: PerformanceMetrics;
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

## Performance Requirements

### Animation Targets
- 60fps flüssiges Scrolling
- requestAnimationFrame für optimale Performance
- Hardware-Beschleunigung via CSS transforms
- Geschwindigkeitsregelung: 0.05 - 1.0

### Bundle Size Limits
- Tree-shaking für Lucide Icons
- Code Splitting für bessere Ladezeiten
- Optimierte Tailwind CSS Build
- Total Bundle < 2MB (inkl. AI features)

### Accessibility Standards
- ARIA-Labels für alle interaktiven Elemente
- Vollständige Tastatursteuerung
- Screenreader-Kompatibilität
- Fokus-Indikatoren
- WCAG 2.1 AA Compliance

### Browser Compatibility
- Chrome 90+, Firefox 88+, Safari 14+
- Mobile Browser Support (iOS Safari, Chrome Mobile)
- Touch-Event Handling
- Cross-device Testing