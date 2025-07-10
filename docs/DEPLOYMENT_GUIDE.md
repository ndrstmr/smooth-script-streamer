# Deployment Guide - Podcast Karaoke

## Development Setup

### Vite Configuration
```typescript
// vite.config.ts
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/podcast-karaoke/' : '/',
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

## Firebase Configuration

### Firebase Project Setup
1. Create Firebase project at console.firebase.google.com
2. Enable Authentication (Google, Email/Password)
3. Create Firestore database
4. Enable Cloud Functions
5. Configure hosting (optional)

### Environment Configuration
```typescript
// firebase.config.ts
export const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};
```

### Gemini AI Configuration
```typescript
// gemini.config.ts
export const geminiConfig = {
  apiKey: process.env.VITE_GEMINI_API_KEY,
  model: 'gemini-pro',
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 8192,
  }
};
```

## GitHub Actions Workflow

### CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages and Firebase

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
          VITE_GEMINI_API_KEY: ${{ secrets.VITE_GEMINI_API_KEY }}
      
      - name: Deploy to GitHub Pages
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
      
      - name: Deploy to Firebase Hosting
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: '${{ secrets.FIREBASE_PROJECT_ID }}'
```

## Firebase Security Rules

### Firestore Rules
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Scripts can be read by authenticated users, written by owners
    match /scripts/{scriptId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (resource == null || resource.data.authorId == request.auth.uid);
    }
    
    // Sessions can be accessed by participants
    match /sessions/{sessionId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid in resource.data.participantIds || 
         resource.data.hostId == request.auth.uid);
    }
  }
}
```

### Storage Rules
```javascript
// storage.rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /user-uploads/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Cloud Functions

### Gemini Integration Function
```typescript
// functions/src/generateScript.ts
import { onCall } from 'firebase-functions/v2/https';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const generateScript = onCall(async (request) => {
  const { topic, duration, style } = request.data;
  
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Must be authenticated');
  }
  
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const prompt = `
    Erstelle ein ${duration}-minütiges Podcast-Script über "${topic}" 
    im ${style}-Stil für 2 Sprecher. 
    
    Format als JSON mit metadata und script array.
    Verwende types: direction, speaker-a, speaker-b.
    Natürliche Dialoge mit Regieanweisungen.
    Engaging Content für Podcast Karaoke.
  `;
  
  try {
    const result = await model.generateContent(prompt);
    const scriptData = JSON.parse(result.response.text());
    
    return {
      success: true,
      script: scriptData
    };
  } catch (error) {
    throw new HttpsError('internal', 'Script generation failed');
  }
});
```

## Performance Monitoring

### Lighthouse Configuration
```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["error", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.9}]
      }
    }
  }
}
```

### Analytics Setup
```typescript
// analytics.config.ts
import { getAnalytics } from 'firebase/analytics';
import { app } from './firebase.config';

export const analytics = getAnalytics(app);

export const trackEvent = (eventName: string, parameters: any) => {
  logEvent(analytics, eventName, parameters);
};
```

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Performance audit completed (Lighthouse score > 90)
- [ ] Accessibility validation (WCAG 2.1 AA)
- [ ] Mobile testing on iOS/Android
- [ ] Firebase Security Rules configured
- [ ] Environment variables set in GitHub Secrets
- [ ] AI API limits and quotas configured

### Post-Deployment
- [ ] Live URL functional (GitHub Pages)
- [ ] Firebase hosting accessible
- [ ] Authentication working
- [ ] Script generation functional
- [ ] Multi-user sessions working
- [ ] Performance monitoring active
- [ ] Error tracking configured

## Monitoring & Maintenance

### Error Tracking
```typescript
// error-tracking.ts
import { getFirestore, collection, addDoc } from 'firebase/firestore';

export const logError = async (error: Error, context: string) => {
  const db = getFirestore();
  await addDoc(collection(db, 'errors'), {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date(),
    userAgent: navigator.userAgent
  });
};
```

### Health Checks
- Firebase Functions status
- Gemini API availability
- Realtime Database connectivity
- Authentication service status
- GitHub Pages deployment status