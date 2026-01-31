# ✨ Magic Sparkle Prompt Engine

> A cross-browser extension that enriches LLM prompts using local context-scraping with the "Behemoth" Pipeline.

![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)
![Plasmo](https://img.shields.io/badge/Framework-Plasmo-purple)

## 🎯 Features

- **Smart Platform Detection**: Automatically identifies ChatGPT, Claude, and Gemini interfaces
- **Context Heatmap**: Visual "breathing" border that indicates context readiness (Red → Blue → Gold)
- **Behemoth Pipeline**: Multi-Agent Light synthesis with expert personas and Chain-of-Thought wrappers
- **Shadow DOM Isolation**: Zero CSS leakage into host sites
- **<500ms Latency Budget**: Instant, sleek prompt enhancement
- **Keyboard Shortcut**: `Alt + S` for quick enhancement

## 🏗️ Architecture

```
src/
├── background/          # Service Worker & Message Handlers
│   ├── index.ts        # Background entry point
│   └── messages/       # Plasmo messaging API handlers
│       └── enhance.ts  # Prompt enhancement handler
├── components/         # React UI Components
│   ├── SparkleFAB.tsx  # Floating Action Button
│   └── ContextHeatmap.ts # Input border effects
├── contents/           # Content Scripts
│   └── magic-sparkle.tsx # Main injection script
├── core/               # Core Business Logic
│   └── behemoth-pipeline.ts # Prompt enrichment engine
├── store/              # Zustand State Management
│   └── sparkle-store.ts
├── types/              # TypeScript Type Definitions
│   └── index.ts
├── utils/              # Utility Functions
│   ├── platform-detector.ts
│   └── context-scraper.ts
├── popup.tsx           # Extension popup UI
└── style.css           # Global styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/smirk-dev/prompt-enhancer.git
cd prompt-enhancer

# Install dependencies
npm install

# Generate icons (if needed)
node generate-icons.js
```

### Development

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Build for Firefox
npm run build:firefox
```

### Loading the Extension

1. Run `npm run build`
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `build/chrome-mv3-prod` directory

## 🎨 Design System: "Lumina"

### Color Palette

| Context Level | Color | Hex |
|--------------|-------|-----|
| Low (Scanning) | Red | `#FF4444` |
| Medium | Blue/Cyan | `#4488FF` / `#00F2FF` |
| High (Ready) | Gold | `#FFD700` → `#FFA500` |
| Frosted Glass | Dark | `rgba(26, 26, 26, 0.85)` |

### Animations

- **Shimmer**: 2s ease-in-out infinite (FAB glow)
- **Breathe**: 3s ease-in-out infinite (Heatmap border)
- **Pulse**: 0.4s ease-out (Injection feedback)

## 🔧 Tech Stack

- **Framework**: [Plasmo](https://plasmo.com/) (Manifest V3)
- **UI**: React 18 + TypeScript (Strict Mode)
- **Styling**: Tailwind CSS 3 with Shadow DOM
- **State**: Zustand
- **Messaging**: Plasmo Messaging API

## 📋 Supported Platforms

| Platform | URL Pattern | Status |
|----------|-------------|--------|
| ChatGPT | `chat.openai.com/*`, `chatgpt.com/*` | ✅ |
| Claude | `claude.ai/*` | ✅ |
| Gemini | `gemini.google.com/*` | ✅ |

## 🧠 The Behemoth Pipeline

The enrichment engine transforms short user intents into comprehensive prompts:

1. **Persona Assignment**: Matches domain to expert role (Coder, Researcher, PM, etc.)
2. **Context Grounding**: Injects page title, URL, and scraped content
3. **CoT Wrapper**: Adds Chain-of-Thought instructions
4. **Peer Review**: Self-checking instructions for accuracy

### Example Transformation

**Input**: `fix this bug`

**Output**:
```
You are a Senior Software Engineer with deep expertise in code review, 
software architecture, best practices, debugging...

**Reference Context:**
- Page: "Issue #123 - TypeError in handleSubmit"
- URL: https://github.com/example/repo/issues/123
- Source Type: GITHUB

[...page content...]

---
## User Request

"fix this bug"

---
## Thinking Process

Before responding, I will:
1. Analyze the core intent and identify key requirements
2. Consider edge cases and potential ambiguities
...
```

## 🎯 Success Metrics

- **Prompt Expansion Ratio**: 5x+ increase in token count
- **One-Shot Success Rate**: >85% satisfactory first responses
- **UI Latency**: 100% under 500ms

## 📄 License

ISC

---

Built with ✨ by the Magic Sparkle Team
