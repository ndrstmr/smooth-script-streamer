# Team Structure - Podcast Karaoke Development

## Agent Roles & Responsibilities

### 🎯 Lead Architect Agent
**Rolle**: Projektleitung und Architektur-Entscheidungen
**Verantwortlichkeiten**:
- Technische Architektur-Planung (Frontend + Backend)
- Design System Definition
- Performance-Anforderungen festlegen
- Code Review und Quality Gates
- Integration verschiedener Agent-Outputs
- AI/Firebase Integration Oversight

**Expertise**: React Patterns, TypeScript, Performance Engineering, Firebase Architecture
**Deliverables**: 
- Technische Spezifikation
- Architektur-Diagramme (inkl. Firebase/Gemini)
- Performance-Benchmarks
- Code-Standards Definition
- AI Integration Guidelines

---

### 🎨 UI/UX Design Agent
**Rolle**: Design System und User Experience
**Verantwortlichkeiten**:
- Tailwind CSS Design System entwickeln
- Responsive Design Implementation
- Accessibility Standards sicherstellen
- Shadcn/ui Component Customization
- Color Scheme und Typography
- Podcast Karaoke UI/UX Design

**Expertise**: Tailwind CSS, Responsive Design, WCAG 2.1, Color Theory
**Deliverables**:
- `index.css` mit semantischen CSS-Variablen
- `tailwind.config.ts` Configuration
- UI Component Library
- Accessibility Audit Report
- Karaoke Interface Design

**Design Requirements**:
```css
/* Studio-optimiertes Dark Theme */
:root {
  --background: 210 11% 7%;           /* #121212 */
  --foreground: 210 11% 88%;          /* #e0e0e0 */
  --teleprompter-focus: 0 100% 50%;   /* #ff0000 halbtransparent */
  --speaker-andreas: 102 100% 52%;    /* #76ff03 */
  --speaker-achim: 203 100% 62%;      /* #40c4ff */
}
```

---

### ⚛️ React Development Agent
**Rolle**: Component Development und State Management
**Verantwortlichkeiten**:
- React Component Architecture
- Custom Hooks Implementation
- TypeScript Interface Design
- State Management Pattern
- Event Handling und Business Logic
- Integration von AI/Firebase Features

**Expertise**: React 18, TypeScript, Custom Hooks, Performance Optimization
**Deliverables**:
- Component Library (`src/components/`)
- Custom Hooks (`src/hooks/`)
- TypeScript Interfaces
- State Management Logic
- AI Integration Components

---

### 🎬 Animation & Performance Agent
**Rolle**: Smooth Scrolling und Performance Optimization
**Verantwortlichkeiten**:
- requestAnimationFrame Animation
- 60fps Performance sicherstellen
- Memory Leak Prevention
- Mobile Performance Optimization
- Hardware-Beschleunigung
- Real-time Performance für Multi-User

**Expertise**: Animation APIs, Performance Profiling, Browser Optimization
**Deliverables**:
- `useTeleprompterAnimation.ts` Hook
- Performance Monitoring Tools
- Animation Benchmarks
- Mobile Performance Report

**Kritische Implementation**:
```typescript
const animate = (timestamp: number) => {
  // Delta-Time basierte Animation
  const deltaTime = timestamp - lastTimeRef.current;
  const newPosition = lastPosition + (speed * deltaTime * 0.2);
  
  // Hardware-beschleunigter Transform
  scriptRef.current.style.transform = `translateY(-${newPosition}px)`;
  
  animationFrameRef.current = requestAnimationFrame(animate);
};
```

---

### 🤖 AI Integration Agent
**Rolle**: Gemini AI Integration und Script Generation
**Verantwortlichkeiten**:
- Gemini Pro API Integration
- Prompt Engineering für Dialog-Generierung
- AI Response Processing und Validation
- Script Quality Optimization
- Error Handling für AI Services

**Expertise**: Google Gemini API, Prompt Engineering, Natural Language Processing
**Deliverables**:
- Gemini API Service Layer
- Script Generation Prompts
- AI Response Validators
- Performance Monitoring für AI Calls

**Kritische Implementation**:
```typescript
const generatePodcastScript = async (topic: string, duration: number) => {
  const prompt = `Erstelle ein ${duration}-minütiges Podcast-Script über "${topic}" 
                  für 2 Sprecher mit natürlichen Dialogen, Regieanweisungen und 
                  engaging Content für Podcast Karaoke.`;
  
  const result = await model.generateContent(prompt);
  return validateAndFormatScript(result.response.text());
};
```

---

### 🔥 Firebase Backend Agent
**Rolle**: Backend Services und Real-time Features
**Verantwortlichkeiten**:
- Firebase Project Setup und Configuration
- Firestore Database Design
- Authentication System Implementation
- Cloud Functions für AI Integration
- Real-time Database für Multi-User Sessions

**Expertise**: Firebase Suite, NoSQL Design, Cloud Functions, Real-time Systems
**Deliverables**:
- Firebase Configuration
- Database Schema Design
- Authentication Flow
- Cloud Functions für Gemini API
- Real-time Session Management

**Database Schema**:
```typescript
// Firestore Collections
collections: {
  users: { profile, preferences, history },
  scripts: { metadata, content, ratings },
  sessions: { participants, state, performance },
  analytics: { reading_stats, session_data }
}
```

---

### 📡 Session Management Agent
**Rolle**: Multi-User Session Orchestration
**Verantwortlichkeiten**:
- Real-time Session Creation und Management  
- User Role Assignment (Speaker A/B)
- Session State Synchronization
- QR-Code/Link Generation für Session Join
- Performance Tracking während Sessions

**Expertise**: Real-time Systems, WebRTC, Session Management, Multi-User UX
**Deliverables**:
- Session Management System
- Real-time Sync Logic
- User Role Assignment
- Session Analytics

**Session Flow**:
```typescript
interface KaraokeSession {
  id: string;
  hostId: string;
  scriptId: string;
  participants: Participant[];
  state: 'waiting' | 'active' | 'completed';
  roles: { speakerA: string; speakerB: string };
  performance: PerformanceMetrics;
}

const createSession = async (scriptId: string) => {
  const session = await sessionService.create({
    scriptId,
    joinCode: generateJoinCode(),
    maxParticipants: 2
  });
  return session;
};
```

---

### 📱 Mobile & Accessibility Agent
**Rolle**: Mobile Optimization und Barrierefreiheit
**Verantwortlichkeiten**:
- Touch-Controls Implementation
- Mobile Performance Optimization
- ARIA Labels und Semantic HTML
- Keyboard Navigation
- Screen Reader Compatibility
- Multi-User Mobile Experience

**Expertise**: Mobile Web, Touch Events, WCAG 2.1, Accessibility Testing
**Deliverables**:
- Mobile Controls Component
- Accessibility Audit
- Keyboard Navigation Map
- Touch Gesture Implementation

**Mobile Control Pattern**:
```jsx
<div className="md:hidden fixed bottom-0 left-0 right-0 bg-mobileControl-bg/95 backdrop-blur-md">
  <div className="flex justify-center items-center gap-3">
    {/* Touch-optimierte Buttons mit ARIA-Labels */}
  </div>
</div>
```

---

### 🚀 DevOps & Deployment Agent
**Rolle**: CI/CD und Deployment Automation
**Verantwortlichkeiten**:
- GitHub Actions Workflow
- Vite Build Configuration
- Firebase Hosting + GitHub Pages Deployment
- Environment Configuration
- Performance Monitoring Setup
- AI API Integration Monitoring

**Expertise**: GitHub Actions, Vite, Firebase Hosting, CI/CD
**Deliverables**:
- `.github/workflows/deploy.yml`
- `vite.config.ts` Configuration
- Firebase Configuration
- Deployment Documentation
- Performance Monitoring Setup

**CI/CD Pipeline**:
```yaml
name: Deploy to Firebase & GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci && npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
      - uses: actions/upload-pages-artifact@v3
```

## Agent Coordination

### Communication Protocols
- **Daily Standups**: GitHub Issues/Project Board
- **Integration Points**: Nach jeder Entwicklungsphase
- **Code Reviews**: Pull Request basiert
- **Quality Gates**: Vor jeder Phase-Transition

### Dependency Management
- **AI ↔ Firebase**: Gemini API über Cloud Functions
- **Session ↔ Real-time**: Firebase Realtime Database
- **UI ↔ Performance**: Animation optimization
- **Mobile ↔ Accessibility**: Cross-device compatibility