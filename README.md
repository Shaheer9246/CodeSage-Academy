# CodeSage Academy 🦉

> **An interactive, gamified computer science and software engineering learning platform built for students.**  
> Live Platform: [codesageacademy.netlify.app](https://codesageacademy.netlify.app)  
> Author: **Zain Rao**

---

## 🌟 Overview

CodeSage Academy is an interactive coding education platform designed to take students from absolute zero to production-level proficiency. Built with a focus on zero-cost student accessibility and client-side performance, CodeSage delivers gamified learning, in-browser compilation and execution, and industry-standard Data Structures & Algorithms (DSA) preparation.

### 🚀 Key Engineering Highlights
- **In-Browser WebAssembly Execution**: Interactive SQL playground powered by `sql.js` (WebAssembly SQLite) running client-side with zero server latency.
- **Monaco Code Editor**: Full-featured code editor with syntax highlighting, auto-completion, and live error diagnostic overlays.
- **Duolingo-Style Gamified Progression**: Sequential lesson unlocking, daily streak tracking with streak freeze mechanics, Sage Coins economy, and level exit tests.
- **19+ Learning Tracks**: Comprehensive curricula spanning C, C++, Java, Python, Web Development, SQL, AI/ML Engineering, Cyber Security, and Computer Networking.
- **Audio & Haptic Feedback Engine**: In-browser Web Audio API synthesis delivering low-latency celebratory audio without heavy asset downloads.
- **Progressive Web App (PWA)**: Offline-first caching with installability on Android, iOS, and Desktop.
- **59-Point Security hardening**: Audited across 59 black-box attack vectors. Enforced airtight Row-Level Security (RLS) tenant isolation, patched atomic race conditions in credit detection, and configured strict security headers.
- **3000+ Active Students**: Scaled to support an active community of 3000+ learners with sub-100ms client interactions. 

---

## 🛠️ Tech Stack

- **Frontend Core**: React 18, TypeScript, Vite
- **Styling & UI**: Tailwind CSS, Radix UI Primitives, Lucide Icons, Canvas Confetti
- **Code Editor**: `@monaco-editor/react` (VS Code engine)
- **In-Browser Runtimes**: SQLite via WebAssembly (`sql.js`)
- **Backend & Auth**: PostgreSQL, Row Level Security (RLS), Edge Functions, Webhook Integrations
- **Audio Engine**: Native HTML5 Web Audio API Synthesizer

---

## 📂 Project Structure

```text
├── public/                 # Static assets, WebAssembly binaries, icons
├── src/
│   ├── components/         # Reusable UI widgets, modals, navigation, editors
│   ├── config/             # App & monetization configuration
│   ├── data/               # Static course lesson registries and DSA sheet data
│   │   └── dsa/            # 4-language solution implementations (Py, JS, C++, Java)
│   ├── hooks/              # Custom React hooks (auth, streak, sounds)
│   ├── lib/                # Audio synthesizer, storage utilities, theme definitions
│   └── pages/              # Core application views (Dashboard, Learn, Labs, Tests)
├── netlify.toml            # SPA routing rules & static cache headers
└── DOCS.md                 # Curriculum maintenance & track creation handbook
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js (>= 20)
- npm or bun

### Local Setup
```bash
# Clone the repository
git clone https://github.com/Zainrao9246/build-learn-bloom.git
cd build-learn-bloom

# Install dependencies
npm install

# Start local development server
npm run dev
```

### Build for Production
```bash
npm run build
```

---

## 👨‍💻 Author

**Zain Rao**  
- **Role**: Creator, Full-Stack Engineer & Web Security Auditor
- **Portfolio**: [zainrao.netlify.app](https://zainrao.netlify.app/)
- **Project**: CodeSage Academy  
- **Website**: [codesageacademy.netlify.app](https://codesageacademy.netlify.app)

---

## 📄 License

This project is proprietary and developed by Zain Rao for CodeSage Academy. All rights reserved.
