# Implementation Guide - Podcast Karaoke

## Component Architecture

### Main Component Structure
```
src/components/
├── Teleprompter.tsx              # Haupt-Container
├── teleprompter/
│   ├── TeleprompterStartScreen.tsx
│   ├── TeleprompterPreview.tsx
│   ├── TeleprompterPlayer.tsx
│   ├── TeleprompterControls.tsx
│   └── TeleprompterProgressBar.tsx
├── generator/                    # AI Script Generation
│   ├── TopicInputWizard.tsx
│   ├── ScriptGenerationProgress.tsx
│   ├── GeneratedScriptPreview.tsx
│   └── ScriptCustomization.tsx
├── session/                      # Multi-User Features
│   ├── SessionLobby.tsx
│   ├── ParticipantView.tsx
│   ├── SessionDashboard.tsx
│   └── JoinSessionModal.tsx
├── analytics/                    # Performance Tracking
│   ├── PerformanceMetrics.tsx
│   ├── SessionHistory.tsx
│   └── ReadingStatistics.tsx
└── ui/                           # Shadcn Components
```

## Critical Animation Hook

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

## Features Implementation

### AI Script Generation (Gemini Integration)
- **Topic Input Wizard**: Benutzerfreundliches Formular für Themeneingabe
- **Gemini API Integration**: Automatische Dialog-Generierung (10-15 Minuten)
- **Script Customization**: Länge, Stil (Interview, Debate, Casual), Sprecher-Anzahl
- **Real-time Generation**: Loading States und Progress Indication
- **Quality Control**: Script Validation und Verbesserungsvorschläge

### Multi-User Session Management
- **Session Creation**: QR-Code/Link Generation für Teilnehmer
- **Role Assignment**: Automatische oder manuelle Speaker-Zuteilung (Speaker A/B)
- **Real-time Sync**: Firebase Realtime Database für Live-Sessions
- **Session States**: Waiting Room, Active Session, Results Dashboard

### Firebase Backend Integration
- **Authentication**: Google/Email Login für personalisierte Erfahrung
- **Firestore Database**: Generated Scripts, Session History, User Profiles
- **Cloud Functions**: Gemini API Calls, Script Processing, Session Management
- **Security Rules**: User-basierte Datengrenzsteuerung

### Performance Analytics
- **Reading Performance**: WPM tracking, Pause analysis, Fluency scoring
- **Session Recording**: Performance comparison zwischen Teilnehmern
- **Progress Tracking**: Verbesserung über Zeit, Personal Bests
- **Social Features**: Leaderboards, Achievement System

### Enhanced Script Management
- **Generated Scripts Library**: Lokale und Cloud-Speicherung
- **Script Metadata**: Thema, Generierungszeit, Schwierigkeitsgrad, Rating
- **Export/Share**: JSON, PDF, Link-Sharing für Sessions
- **Version Control**: Script Iterationen und Verbesserungen

## Custom Hooks Pattern

```typescript
// Core Hooks
- useTeleprompterState: Zentrale State-Verwaltung
- useTeleprompterHandlers: Event-Handler und Business Logic  
- useTeleprompterAnimation: Performance-optimierte Animation
- useGeminiAI: AI Script Generation und API Management
- useFirebaseSession: Real-time Session Management
- usePerformanceTracking: Reading Analytics und Scoring
- useMobile: Responsive Breakpoint Detection
```

## Storage Integration

### localStorage Persistence
```typescript
const persistedSettings = {
  speed: 'teleprompter-speed',
  bookmarks: 'teleprompter-bookmarks',
  speakerAliases: 'teleprompter-speaker-aliases',
  generatedScripts: 'podcast-karaoke-scripts',
  userPreferences: 'user-preferences',
  sessionHistory: 'session-history'
};
```

### Firebase Services
```typescript
export const firebaseServices = {
  auth: 'user-authentication',
  firestore: 'scripts-and-sessions',
  functions: 'gemini-api-integration',
  realtimeDB: 'live-session-sync'
};
```

## JSON Script Format

### AI-Generated Format
```json
{
  "metadata": {
    "title": "Künstliche Intelligenz im Alltag",
    "duration": "12-15 minutes",
    "difficulty": "medium",
    "generatedBy": "gemini-pro",
    "createdAt": "2024-01-10T10:30:00Z",
    "topics": ["AI", "Technology", "Future"]
  },
  "script": [
    {
      "type": "direction",
      "text": "[Beide Moderatoren begrüßen sich herzlich]",
      "timestamp": 0
    },
    {
      "type": "speaker-a",
      "text": "Willkommen zu unserem Podcast über Künstliche Intelligenz! Ich bin...",
      "timestamp": 5,
      "difficulty": "easy"
    },
    {
      "type": "speaker-b", 
      "text": "...und ich bin... Heute sprechen wir über AI im Alltag.",
      "timestamp": 15,
      "difficulty": "medium"
    }
  ]
}
```

### Supported Script Types
- `direction`: Regieanweisungen (grau, kursiv, kleiner)
- `speaker-a`: Erster Sprecher (grün: #76ff03)  
- `speaker-b`: Zweiter Sprecher (blau: #40c4ff)
- `both`: Beide Sprecher gleichzeitig (gelb: #ffd54f)
- `pause`: Automatische Pausen für Timing (transparent)

## Styling Guidelines

### Component Styling Standards
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

### Design Principles
- **Studio-Dark Theme**: #121212 Background, #e0e0e0 Text
- **Kontrast-optimiert**: WCAG 2.1 AA Standard
- **Performance**: Hardware-beschleunigtes Scrolling
- **Responsive**: 320px - 1920px Viewport Support