# AGENTS.md - System Prompt: Podcast-Karaoke App

## Vision & Mission

**Entwickle eine revolutionäre Podcast-Karaoke Plattform**, die es Nutzern ermöglicht, interaktive Podcast-Dialoge in Echtzeit zu performieren. Die App kombiniert KI-generierte Skripte, professionelle Teleprompter-Technologie und soziale Gaming-Elemente zu einem einzigartigen Erlebnis.

### Kernziel
Erschaffe eine intuitive, performante Web-Anwendung, die sowohl Solo-Training als auch Multi-User-Sessions für Podcast-Enthusiasten, Content-Creator und Kommunikationstrainer bietet.

## Core Features & Funktionalitäten

### 1. KI-Powered Script Generation
- **Gemini Pro Integration**: Automatische Generierung von 10-15 Minuten Podcast-Dialogen
- **Intelligente Rollen-Zuweisung**: Optimiert für 2 Sprecher (Andreas/Achim Pattern)
- **Themen-basierte Generierung**: Flexibel anpassbare Inhalte
- **Schwierigkeitsgrade**: Easy/Medium/Hard für unterschiedliche Fähigkeitslevel
- **Natürliche Gesprächsstrukturen**: Realistische Podcast-Dynamiken

### 2. Professioneller Teleprompter
- **60fps Smooth Scrolling**: Hardware-beschleunigte Animationen
- **Variable Geschwindigkeitskontrolle**: 0.05x - 1.0x Anpassung
- **Smart Focus-Line**: Visueller Indikator für aktuelle Position
- **Responsive Design**: Optimiert für Desktop und Mobile
- **Accessibility**: WCAG 2.1 AA konforme Bedienung

### 3. Multi-User Karaoke Sessions
- **Real-time Synchronisation**: Firebase-basierte Live-Sessions
- **Rollen-Management**: Automatische Speaker-A/B Zuweisung
- **Session-Hosting**: Einladungslinks und Room-Management
- **Performance-Tracking**: Timing, Synchronisation, Engagement-Metriken
- **Social Features**: Bewertungen, Challenges, Leaderboards

### 4. User Experience & Interface
- **Studio-optimiertes Dark Theme**: Professionelle Podcast-Atmosphäre
- **Intuitive Steuerung**: One-Click Start, Progressive Disclosure
- **Mobile-First Design**: Touch-optimierte Bedienung
- **Keyboard Shortcuts**: Professionelle Workflow-Unterstützung
- **Preview-Modi**: Script-Review vor Session-Start

## Technische Architektur

### Frontend Stack
```
React 18 + TypeScript + Vite
├── UI Framework: Radix UI (Shadcn/ui)
├── Styling: Tailwind CSS + Custom Design System
├── Routing: React Router DOM
├── Icons: Lucide React
├── State: Custom Hooks Pattern
└── Animation: requestAnimationFrame + CSS Transforms
```

### Backend Integration
```
Firebase Ecosystem
├── Firestore: Script Storage & User Data
├── Authentication: Multi-provider Login
├── Cloud Functions: AI Integration Layer
├── Realtime Database: Live Session Sync
└── Hosting: Global CDN Distribution
```

### AI Integration
```
Google Gemini Pro API
├── Prompt Engineering: Podcast-optimierte Templates
├── Content Moderation: Safe, broadcast-ready Scripts
├── Personalization: Adaptive Schwierigkeitsgrade
└── Quality Assurance: Automatische Script-Validierung
```

## Development Guidelines

### Code Architecture Prinzipien
1. **Component-Driven Development**: Kleine, fokussierte, wiederverwendbare Komponenten
2. **Custom Hooks Pattern**: Business Logic von UI-Komponenten getrennt
3. **Design System First**: Semantische CSS-Variablen, keine hardcoded Styles
4. **Performance First**: Lazy Loading, Code Splitting, Bundle Optimization
5. **Accessibility First**: Screen Reader Support, Keyboard Navigation, Focus Management

### Datenschutz & Sicherheit
- **Privacy by Design**: Minimale Datenerfassung, DSGVO-konform
- **Secure Authentication**: Firebase Security Rules, Token-Management
- **Content Safety**: AI-Generated Content Filtering
- **Real-time Security**: Rate Limiting, Session Validation

### Performance Targets
- **Bundle Size**: < 2MB (inklusive AI Features)
- **First Contentful Paint**: < 1.5s
- **Animation Performance**: Konstante 60fps
- **Real-time Latency**: < 100ms Session Sync
- **Mobile Performance**: Flüssig auf Mid-range Devices

## Data Structures & Interfaces

### Core Types
```typescript
interface GeneratedScript {
  metadata: {
    title: string;
    duration: string;
    difficulty: 'easy' | 'medium' | 'hard';
    topics: string[];
    generatedBy: 'gemini-pro';
    createdAt: string;
  };
  script: ScriptItem[];
}

interface ScriptItem {
  type: 'direction' | 'speaker-a' | 'speaker-b' | 'both' | 'pause';
  text: string;
  timestamp?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface KaraokeSession {
  id: string;
  hostId: string;
  scriptId: string;
  participants: Participant[];
  state: 'waiting' | 'active' | 'completed';
  roles: { speakerA: string; speakerB: string };
  performance: PerformanceMetrics;
  realTimeState: {
    currentPosition: number;
    speed: number;
    isPlaying: boolean;
    timestamp: number;
  };
}
```

## AI Agent Instructions

### Wenn du Teleprompter-Features entwickelst:
- **Priorisiere flüssige Animationen**: Verwende requestAnimationFrame für alle Scroll-Operationen
- **Implementiere Hardware-Beschleunigung**: CSS transform3d für GPU-Rendering
- **Optimiere für verschiedene Bildschirmgrößen**: Responsive Typography und Spacing
- **Berücksichtige Accessibility**: ARIA-Labels, Keyboard Navigation, Screen Reader Support

### Wenn du KI-Integration entwickelst:
- **Verwende Gemini Pro API**: Strukturierte Prompts für konsistente Script-Qualität
- **Implementiere Error Handling**: Graceful Fallbacks für API-Ausfälle
- **Cache Scripts intelligent**: Reduziere API-Calls durch lokale Speicherung
- **Validiere Generated Content**: Prüfe auf Broadcast-Tauglichkeit

### Wenn du Multi-User Features entwickelst:
- **Nutze Firebase Realtime Database**: Optimiere für niedrige Latenz
- **Implementiere Conflict Resolution**: Handhabe gleichzeitige Änderungen elegant
- **Manage Session State**: Robust gegen Verbindungsabbrüche
- **Optimize Bandwidth**: Minimiere Datenübertragung durch Delta-Updates

### Wenn du UI/UX entwickelst:
- **Folge dem Design System**: Nutze semantische CSS-Variablen aus index.css
- **Implement Progressive Disclosure**: Zeige nur relevante Controls zur aktuellen Zeit
- **Optimize for Touch**: Mobile-first Approach mit angemessenen Touch-Targets
- **Create Intuitive Workflows**: Minimize Cognitive Load durch klare Information Architecture

## Quality Gates & Standards

### Code Quality
- **TypeScript Strict Mode**: Vollständige Type Safety
- **ESLint + Prettier**: Konsistente Code-Formatierung
- **Component Testing**: React Testing Library für UI-Tests
- **Performance Monitoring**: Web Vitals Tracking
- **Accessibility Testing**: Automated a11y Validation

### User Experience Standards
- **Response Time**: < 200ms für alle User Interactions
- **Error Handling**: Informative, actionable Fehlermeldungen
- **Loading States**: Progressive Loading mit Skeleton Screens
- **Offline Capability**: Graceful Degradation bei Verbindungsverlusten
- **Cross-browser Compatibility**: Chrome 90+, Firefox 88+, Safari 14+

### Security & Privacy
- **Content Security Policy**: XSS-Schutz durch strikte CSP-Headers
- **Data Minimization**: Sammle nur notwendige User-Daten
- **Secure Communication**: HTTPS-only, verschlüsselte API-Kommunikation
- **Session Management**: Sichere Token-Rotation und Logout-Funktionalität

## Deployment & Operations

### Production Environment
- **GitHub Pages**: Frontend Hosting mit automatischen Deployments
- **Firebase Hosting**: Backup und A/B Testing Capabilities
- **CDN Integration**: Globale Content Delivery für optimale Performance
- **Monitoring**: Real-time Performance und Error Tracking

### Development Workflow
- **Git Flow**: Feature Branches mit Pull Request Reviews
- **Continuous Integration**: Automatische Tests und Quality Checks
- **Semantic Versioning**: Strukturierte Release-Management
- **Documentation**: Living Documentation mit Code-Examples

---

**Erfolg definiert sich durch**: Eine intuitive, performante App, die Podcast-Enthusiasten ermöglicht, ihre Kommunikationsfähigkeiten durch KI-unterstützte, soziale Karaoke-Sessions zu verbessern - mit professioneller Qualität und Gaming-Elements für nachhaltiges Engagement.