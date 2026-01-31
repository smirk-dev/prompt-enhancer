# 🪄 Magic Sparkle Prompt Engine - Complete Usage Guide

> **The Ultimate Step-by-Step Guide to Installing, Building, and Using the Magic Sparkle Browser Extension**

---

## 📑 Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Installation](#2-installation)
3. [Building the Extension](#3-building-the-extension)
4. [Loading into Chrome](#4-loading-into-chrome)
5. [Loading into Firefox](#5-loading-into-firefox)
6. [Using the Extension](#6-using-the-extension)
7. [Features Deep Dive](#7-features-deep-dive)
8. [Troubleshooting](#8-troubleshooting)
9. [Development Workflow](#9-development-workflow)
10. [Running Tests](#10-running-tests)

---

## 1. Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

| Software | Minimum Version | Download Link |
|----------|----------------|---------------|
| **Node.js** | 18.0+ | [nodejs.org](https://nodejs.org/) |
| **npm** | 9.0+ | Included with Node.js |
| **Git** | 2.30+ | [git-scm.com](https://git-scm.com/) |

### Verify Installation

Open a terminal and run:

```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show 9.x.x or higher
git --version     # Should show 2.30.x or higher
```

### Supported Browsers

| Browser | Minimum Version | Manifest |
|---------|----------------|----------|
| **Google Chrome** | 102+ | MV3 |
| **Microsoft Edge** | 102+ | MV3 |
| **Mozilla Firefox** | 109+ | MV3 |
| **Brave** | 1.40+ | MV3 |

---

## 2. Installation

### Step 2.1: Clone the Repository

```bash
git clone https://github.com/smirk-dev/prompt-enhancer.git
cd prompt-enhancer
```

### Step 2.2: Install Dependencies

```bash
npm install
```

This installs all required packages including:
- **Plasmo** - Browser extension framework
- **React 19** - UI components
- **Zustand** - State management
- **TypeScript** - Type safety

### Step 2.3: Generate Icons (if needed)

```bash
node generate-icons.js
```

This creates icon files in `assets/` directory at various sizes (16, 32, 48, 128, 512 pixels).

### ✅ Verification

Your directory should now contain:

```
prompt-enhancer/
├── node_modules/        ✓ Created by npm install
├── assets/
│   ├── icon16.png       ✓ Extension icons
│   ├── icon32.png
│   ├── icon48.png
│   ├── icon128.png
│   └── icon512.png
├── src/                 ✓ Source code
└── package.json         ✓ Project config
```

---

## 3. Building the Extension

### Option A: Development Build (with Hot Reload)

For active development with automatic rebuilds:

```bash
npm run dev
```

**What happens:**
- Starts Plasmo development server
- Creates `build/chrome-mv3-dev/` directory
- Watches for file changes and auto-rebuilds
- Hot Module Replacement (HMR) enabled

**Console output:**
```
 ESBUILD   Bundled in 1234ms
 PLASMO    Listening on http://localhost:1234
 PLASMO    Build ready for loading
```

> ⚠️ **Keep this terminal open** while developing. Press `Ctrl+C` to stop.

### Option B: Production Build (Chrome)

For final production-ready build:

```bash
npm run build
```

**Output:** `build/chrome-mv3-prod/`

### Option C: Production Build (Firefox)

```bash
npm run build:firefox
```

**Output:** `build/firefox-mv3-prod/`

### Build Output Structure

```
build/
├── chrome-mv3-dev/          # Development build
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.*.js
│   ├── popup.*.css
│   ├── magic-sparkle.*.js   # Content script
│   └── static/
│       └── background/
│           └── index.js     # Service worker
│
├── chrome-mv3-prod/         # Production build (Chrome)
│   └── ... (same structure, minified)
│
└── firefox-mv3-prod/        # Production build (Firefox)
    └── ... (same structure)
```

---

## 4. Loading into Chrome

### Step 4.1: Open Chrome Extensions Page

**Method A: URL Bar**
```
chrome://extensions/
```

**Method B: Menu Navigation**
1. Click the **⋮** (three dots) menu in top-right
2. Go to **Extensions** → **Manage Extensions**

### Step 4.2: Enable Developer Mode

![Developer Mode Toggle](https://i.imgur.com/placeholder-dev-mode.png)

1. Look at the **top-right** corner of the extensions page
2. Toggle **"Developer mode"** switch to **ON** (blue)

### Step 4.3: Load the Extension

1. Click the **"Load unpacked"** button (appears after enabling Developer mode)
2. Navigate to your project folder
3. Select the build directory:
   - For development: `build/chrome-mv3-dev/`
   - For production: `build/chrome-mv3-prod/`
4. Click **"Select Folder"**

### Step 4.4: Verify Installation

You should now see:

```
┌─────────────────────────────────────────────────────────────┐
│  🪄 Magic Sparkle Prompt Engine                      v1.0.0 │
│  ─────────────────────────────────────────────────────────  │
│  ID: [random-extension-id]                                  │
│                                                             │
│  [Details]  [Remove]  [Toggle: ON ●]                        │
└─────────────────────────────────────────────────────────────┘
```

### Step 4.5: Pin the Extension (Optional)

1. Click the **puzzle piece** 🧩 icon in Chrome toolbar
2. Find "Magic Sparkle Prompt Engine"
3. Click the **pin** 📌 icon

---

## 5. Loading into Firefox

### Step 5.1: Open Firefox Debug Page

```
about:debugging#/runtime/this-firefox
```

### Step 5.2: Load Temporary Add-on

1. Click **"Load Temporary Add-on..."** button
2. Navigate to `build/firefox-mv3-prod/`
3. Select the **`manifest.json`** file
4. Click **"Open"**

### Step 5.3: Verify Installation

The extension appears in the "Temporary Extensions" section:

```
┌─────────────────────────────────────────────────────────────┐
│  Magic Sparkle Prompt Engine                                │
│  Internal UUID: [uuid]                                      │
│  [Inspect]  [Reload]  [Remove]                              │
└─────────────────────────────────────────────────────────────┘
```

> ⚠️ **Note:** Firefox temporary add-ons are removed when Firefox closes. For permanent installation, the extension must be signed by Mozilla.

---

## 6. Using the Extension

### 6.1 Supported Platforms

Magic Sparkle works on these AI chat interfaces:

| Platform | URL Pattern | Status |
|----------|-------------|--------|
| **ChatGPT** | `chat.openai.com/*`, `chatgpt.com/*` | ✅ Supported |
| **Claude** | `claude.ai/*` | ✅ Supported |
| **Gemini** | `gemini.google.com/*` | ✅ Supported |

### 6.2 The Magic Sparkle Button

When you visit a supported platform and focus on a text input:

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│   Write your prompt here...                                    │
│                                                                │
│                                                    ┌────────┐  │
│                                                    │   ✨   │  │
│                                                    │ (FAB)  │  │
│                                                    └────────┘  │
└────────────────────────────────────────────────────────────────┘
                                                         ▲
                                               Magic Sparkle Button
```

**Visual States of the FAB:**

| State | Appearance | Meaning |
|-------|------------|---------|
| 🔴 **Red Glow** | Low context | Minimal page information available |
| 🔵 **Blue Glow** | Medium context | Moderate page content detected |
| 🟡 **Gold Glow** | High context | Rich context ready for enhancement |
| ⏳ **Spinner** | Processing | Enhancement in progress |

### 6.3 Using the Enhancement

#### Method 1: Click the Button

1. **Type your prompt** in the text input
   ```
   How do I fix this bug?
   ```

2. **Click the ✨ Magic Sparkle button**

3. **Watch** as your prompt is enhanced:
   ```
   # Context: Viewing GitHub Issue #123
   # Source: github.com/user/repo
   
   ## Expert Persona: Senior Software Engineer
   I will analyze this systematically.
   
   ## User Request:
   How do I fix this bug?
   
   ## Approach:
   1. First, understand the problem...
   2. Analyze the root cause...
   3. Propose a solution...
   
   Please think step by step...
   ```

#### Method 2: Keyboard Shortcut

| Shortcut | Action |
|----------|--------|
| **`Alt + S`** | Enhance the current prompt |

> 💡 **Pro Tip:** The keyboard shortcut works when the text input is focused.

### 6.4 The Context Heatmap

When you focus on an input, a subtle **breathing border** appears:

```
Normal Input:
┌──────────────────────────────────┐
│ Your prompt text...              │
└──────────────────────────────────┘

With Heatmap (High Context - Gold):
╔══════════════════════════════════╗  ← Pulsing gold border
║ Your prompt text...              ║
╚══════════════════════════════════╝
```

**Heatmap Colors:**

| Level | Border Color | Animation | Meaning |
|-------|-------------|-----------|---------|
| **Low** | Red (#FF4444) | Slow pulse | Limited context available |
| **Medium** | Blue (#4488FF) | Medium pulse | Good context detected |
| **High** | Gold (#FFD700) | Fast shimmer | Excellent context ready |

### 6.5 Extension Popup

Click the extension icon in your browser toolbar to see:

```
┌──────────────────────────────────────┐
│  🪄 Magic Sparkle                     │
│     Prompt Enhancement Engine         │
├──────────────────────────────────────┤
│  ● Active & Ready                     │
│                                       │
│  The Magic Sparkle button will appear │
│  when you focus on a text input on    │
│  supported LLM platforms.             │
├──────────────────────────────────────┤
│  SUPPORTED PLATFORMS                  │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│  │ ChatGPT │ │ Claude  │ │ Gemini  │ │
│  └─────────┘ └─────────┘ └─────────┘ │
├──────────────────────────────────────┤
│  Enhance Prompt          [Alt + S]   │
├──────────────────────────────────────┤
│  v1.0.0 • All processing happens     │
│           locally                     │
└──────────────────────────────────────┘
```

---

## 7. Features Deep Dive

### 7.1 The Behemoth Pipeline

Magic Sparkle uses a multi-stage enrichment pipeline:

```
┌─────────────────────────────────────────────────────────────────┐
│                    BEHEMOTH PIPELINE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   USER INPUT          CONTEXT SCRAPER         ENRICHMENT        │
│   ───────────         ───────────────         ──────────        │
│                                                                 │
│   "Fix this bug"  →   Page Title      →   Expert Persona        │
│                       URL Domain          Chain-of-Thought      │
│                       Meta Tags           Platform Hints        │
│                       Headings            Peer Review           │
│                       Code Blocks         Context Grounding     │
│                       Selected Text                             │
│                                                                 │
│   ─────────────────────────────────────────────────────────────│
│                           ↓                                     │
│                   ENRICHED PROMPT                               │
│               (400%+ character expansion)                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Expert Personas

Based on the detected source, Magic Sparkle applies specialized personas:

| Source Type | Expert Persona | Applied When |
|-------------|----------------|--------------|
| **GitHub** | Senior Software Engineer | Viewing GitHub repos, PRs, issues |
| **StackOverflow** | Tech Community Expert | Reading SO questions/answers |
| **arXiv** | Research Scientist | Viewing academic papers |
| **Jira** | Agile Project Manager | Using Jira/Atlassian tools |
| **Documentation** | Technical Writer | Reading docs pages |
| **Generic** | Knowledgeable Assistant | Any other website |

### 7.3 Platform-Specific Hints

Prompts are optimized for each LLM:

| Platform | Hint Added |
|----------|------------|
| **ChatGPT** | "You're ChatGPT by OpenAI. Use your training knowledge effectively." |
| **Claude** | "You're Claude by Anthropic. Apply careful, nuanced reasoning." |
| **Gemini** | "You're Gemini by Google. Leverage multimodal understanding." |

### 7.4 Context Scraping

What Magic Sparkle extracts from the current page:

```
Extracted Context:
├── Page Title
├── URL & Domain
├── Meta Tags
│   ├── description
│   ├── og:title
│   ├── og:description
│   └── keywords
├── Headings (h1, h2, h3)
├── Code Blocks (pre, code)
├── Main Content Paragraphs
└── Selected Text (if any)
```

**Token Budget:** Maximum 2000 tokens of context are included.

---

## 8. Troubleshooting

### Issue: FAB Button Doesn't Appear

**Possible Causes & Solutions:**

1. **Not on a supported platform**
   - Check you're on ChatGPT, Claude, or Gemini
   - Check the URL matches the patterns

2. **Extension not loaded**
   - Go to `chrome://extensions/`
   - Ensure the extension is enabled (toggle ON)
   - Click the refresh button on the extension card

3. **Input not focused**
   - Click directly inside the text input area
   - The FAB only appears when input is focused

4. **Development server not running**
   - If using dev build, ensure `npm run dev` is running

### Issue: Enhancement Not Working

**Steps to debug:**

1. **Open DevTools** (F12 or Ctrl+Shift+I)
2. **Check Console** for errors starting with `[MagicSparkle]`
3. **Common errors:**

   | Error Message | Solution |
   |--------------|----------|
   | `No text to enhance` | Type something in the input first |
   | `Context scraping error` | Refresh the page |
   | `Enhancement failed` | Check background script logs |

### Issue: Extension Errors After Code Changes

```bash
# Rebuild the extension
npm run build

# Then reload in Chrome:
# 1. Go to chrome://extensions/
# 2. Click the refresh ↻ button on Magic Sparkle
```

### Issue: Tests Failing

```bash
# Run tests with verbose output
npm test -- --verbose

# Run specific test file
npm test -- context-scraper

# Run in watch mode for development
npm run test:watch
```

---

## 9. Development Workflow

### Recommended Development Setup

1. **Terminal 1:** Run dev server
   ```bash
   npm run dev
   ```

2. **Terminal 2:** Run tests in watch mode
   ```bash
   npm run test:watch
   ```

3. **Browser:** Load extension from `build/chrome-mv3-dev/`

### File Change Workflow

```
Edit Source File
      │
      ▼
Plasmo Auto-Rebuilds (1-2 seconds)
      │
      ▼
Extension Auto-Reloads (if using dev build)
      │
      ▼
Test Changes in Browser
```

### Making Changes to Key Files

| File | Purpose | After Edit |
|------|---------|------------|
| `src/contents/magic-sparkle.tsx` | Content script & UI | Auto-reload |
| `src/components/SparkleFAB.tsx` | FAB button component | Auto-reload |
| `src/core/behemoth-pipeline.ts` | Prompt enrichment | Auto-reload |
| `src/background/messages/enhance.ts` | Background handler | Reload extension |
| `src/utils/*.ts` | Utility functions | Auto-reload |
| `package.json` | Dependencies | Run `npm install` |

---

## 10. Running Tests

### All Tests

```bash
npm test
```

**Expected Output:**
```
 PASS  src/__tests__/core/behemoth-pipeline.test.ts
 PASS  src/__tests__/background/enhance.test.ts
 PASS  src/__tests__/components/ContextHeatmap.test.ts
 PASS  src/__tests__/components/SparkleFAB.test.tsx
 PASS  src/__tests__/utils/context-scraper.test.ts
 PASS  src/__tests__/utils/platform-detector.test.ts
 PASS  src/__tests__/store/sparkle-store.test.ts
 PASS  src/__tests__/types/index.test.ts

Test Suites: 8 passed, 8 total
Tests:       239 passed, 239 total
```

### Test Coverage

```bash
npm run test:coverage
```

### Watch Mode (for development)

```bash
npm run test:watch
```

### CI Mode

```bash
npm run test:ci
```

---

## 🎉 Quick Start Checklist

```
□ Node.js 18+ installed
□ Repository cloned
□ npm install completed
□ npm run build executed
□ Extension loaded in Chrome
□ Visited ChatGPT/Claude/Gemini
□ Clicked on text input
□ Saw the ✨ Magic Sparkle button
□ Typed a prompt
□ Clicked button or pressed Alt+S
□ Prompt was enhanced!
```

---

## 📚 Additional Resources

- [Product Requirements Document](./prd.md)
- [Frontend Architecture](./front-end-architecture.md)
- [Frontend Spec](./front-end-spec.md)
- [Project Brief](./project-brief.md)

---

## 🤝 Need Help?

1. Check the [Troubleshooting](#8-troubleshooting) section
2. Open DevTools and check console for `[MagicSparkle]` logs
3. Open an issue on [GitHub](https://github.com/smirk-dev/prompt-enhancer/issues)

---

<div align="center">

**Made with ✨ by the Magic Sparkle Team**

*All processing happens locally. Your data never leaves your browser.*

</div>
