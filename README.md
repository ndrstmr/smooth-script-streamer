# Podcast Karaoke - AI-Enhanced Teleprompter

Eine revolutionäre Web-Anwendung für interaktives "Podcast Karaoke" mit KI-gestützter Script-Generierung, Multi-User Sessions und professionellem Teleprompter-Scrolling.

## 🎯 Projektübersicht

Podcast Karaoke kombiniert flüssiges Teleprompter-Scrolling mit Gemini AI für automatische Dialog-Erstellung und Multi-User Sessions für kollaborative Podcast-Performances. Nutzer können Themen eingeben, automatisch 10-15 minütige Scripts generieren lassen und diese gemeinsam in Echtzeit vortragen.

## ✨ Features

### 🤖 AI Script Generation
- **Automatische Dialog-Erstellung** mit Google Gemini Pro
- **Themeneingabe** via benutzerfreundlichem Wizard
- **Script-Anpassung**: Länge (10-15 Min), Stil, Schwierigkeitsgrad
- **Qualitätskontrolle** und Validierung

### 👥 Multi-User Karaoke Sessions
- **Session-Erstellung** mit QR-Code/Link für Teilnehmer
- **Automatische Rollenzuteilung** (Speaker A/B)
- **Real-time Synchronisation** über Firebase
- **Performance-Tracking** und Vergleiche

### 🎬 Professionelles Teleprompter
- **60fps flüssiges Scrolling** mit requestAnimationFrame
- **Responsive Design** für alle Geräte (320px - 1920px)
- **Studio-optimiertes Dark Theme**
- **Hardware-beschleunigtes Rendering**

### 📱 Mobile-First Design
- **Touch-optimierte Controls**
- **Cross-device Kompatibilität**
- **Progressive Web App Features**
- **Offline-Funktionalität** (geplant)

## 🛠 Technologie-Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Shadcn/ui Components
- **Backend**: Firebase (Firestore, Auth, Functions)
- **AI**: Google Gemini Pro API
- **Real-time**: Firebase Realtime Database
- **Deployment**: GitHub Pages + Firebase Hosting

## 📁 Projekt-Struktur

```
/
├── docs/                     # Dokumentation
│   ├── TECHNICAL_SPEC.md     # Technische Spezifikation
│   ├── IMPLEMENTATION_GUIDE.md # Implementierungs-Leitfaden
│   ├── DEPLOYMENT_GUIDE.md   # Deployment-Anleitung
│   ├── TEAM_STRUCTURE.md     # Agent-Team Struktur
│   ├── DEVELOPMENT_WORKFLOW.md # Entwicklungs-Workflow
│   └── QUALITY_GATES.md      # Qualitätssicherung
├── src/
│   ├── components/           # React Components
│   │   ├── teleprompter/     # Teleprompter Core
│   │   ├── generator/        # AI Script Generation
│   │   ├── session/          # Multi-User Features
│   │   ├── analytics/        # Performance Tracking
│   │   └── ui/               # Shadcn Components
│   ├── hooks/                # Custom React Hooks
│   ├── services/             # API Services
│   └── types/                # TypeScript Interfaces
└── public/                   # Static Assets
```

## 🚀 Quick Start

### Entwicklung
```bash
# Repository klonen
git clone <repository-url>
cd podcast-karaoke

# Dependencies installieren
npm install

# Development Server starten
npm run dev
```

### Deployment
```bash
# Produktions-Build
npm run build

# Firebase Deploy
firebase deploy

# GitHub Pages Deploy
npm run deploy
```

## 📖 Dokumentation

### Für Entwickler
- **[Technische Spezifikation](docs/TECHNICAL_SPEC.md)** - Core Stack, Architektur, Dependencies
- **[Implementierungs-Guide](docs/IMPLEMENTATION_GUIDE.md)** - Komponenten, Features, Hooks
- **[Deployment-Guide](docs/DEPLOYMENT_GUIDE.md)** - CI/CD, Firebase, GitHub Actions

### Für Projektmanagement
- **[Team-Struktur](docs/TEAM_STRUCTURE.md)** - Agent-Rollen und Verantwortlichkeiten
- **[Development Workflow](docs/DEVELOPMENT_WORKFLOW.md)** - Phasen, Timeline, Kommunikation
- **[Quality Gates](docs/QUALITY_GATES.md)** - Qualitätssicherung und Testing

## 🔧 Entwicklungs-Workflow

Das Projekt folgt einem **Multi-Agent Development Framework** mit spezialisierten Rollen:

1. **🎯 Lead Architect**: Gesamtarchitektur und Koordination
2. **🎨 UI/UX Design**: Design System und User Experience
3. **⚛️ React Development**: Component-Entwicklung
4. **🤖 AI Integration**: Gemini API und Script-Generierung
5. **🔥 Firebase Backend**: Backend Services und Real-time Features
6. **📱 Mobile & Accessibility**: Cross-device Optimierung
7. **🚀 DevOps**: CI/CD und Deployment

## 🎨 Design System

### Color Palette
```css
/* Studio-optimiertes Dark Theme */
--background: 210 11% 7%;           /* #121212 */
--foreground: 210 11% 88%;          /* #e0e0e0 */
--speaker-andreas: 102 100% 52%;    /* #76ff03 */
--speaker-achim: 203 100% 62%;      /* #40c4ff */
--teleprompter-focus: 0 100% 50%;   /* #ff0000 */
```

### Performance Targets
- **Animation**: 60fps flüssiges Scrolling
- **Loading**: < 2s initial load
- **Bundle**: < 2MB total size
- **Accessibility**: WCAG 2.1 AA Compliance

## 🤝 Contributing

1. **Feature Branch erstellen**: `git checkout -b feature/your-feature`
2. **Code Review**: Pull Request mit Lead Architect Review
3. **Quality Gates**: Automated testing und manual validation
4. **Integration**: Merge nach erfolgreicher Review

## 📊 Success Metrics

### Technical KPIs
- **Performance**: Lighthouse Score > 95
- **Accessibility**: WCAG 2.1 AA Compliance
- **AI Quality**: 90%+ script generation success
- **Mobile Performance**: 60fps auf mid-range devices

### User Experience KPIs  
- **Session Completion**: >80% erfolgreiche Karaoke Sessions
- **Script Quality**: >4/5 user rating
- **Mobile Usability**: Touch targets > 44px
- **Loading Experience**: < 2s to interactive

## 🚀 Roadmap

### Phase 1: Core Teleprompter (✅ Completed)
- Basis Teleprompter-Funktionalität
- Responsive Design
- Performance-Optimierung

### Phase 2: AI Integration (🚧 In Progress)
- Gemini API Integration
- Script Generation UI
- Quality Control System

### Phase 3: Multi-User Features (📋 Planned)
- Session Management
- Real-time Synchronisation
- Performance Analytics

### Phase 4: Advanced Features (🔮 Future)
- Voice Recognition Integration
- Advanced AI Prompting
- Social Features & Sharing

## 📄 Lizenz

[MIT License](LICENSE) - Siehe LICENSE Datei für Details.

## 🙋‍♂️ Support

- **GitHub Issues**: Bug Reports und Feature Requests
- **Documentation**: Vollständige Docs im `/docs` Ordner  
- **Development**: Follow development workflow in docs/

---

**Entwickelt mit ❤️ für die Podcast-Community**