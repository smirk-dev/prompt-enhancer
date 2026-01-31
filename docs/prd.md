# Product Requirements Document: Magic Sparkle Prompt Engine

## 1. Goals and Background Context
* **Goals**:
    * Empower users to generate high-quality LLM responses with minimal manual effort.
    * Achieve seamless, distraction-free prompt enhancement across major browsers.
    * Reduce "Context Cold Start" by automatically providing site-specific grounding data.
* **Background**:
    * Short prompts lack environmental variables, leading to sub-optimal AI outputs.
    * The **Magic Sparkle** acts as an intelligent bridge, enriching prompts locally through a minimalist UI button.

## 2. User Stories & Requirements
* **EPIC 1: Smart Detection & Injection**
    * **Story 1.1**: Detect ChatGPT, Claude, and Gemini interfaces for UI injection.
    * **Story 1.2**: Scrape active tab DOM (Title, URL, text up to 2000 tokens) for context.
* **EPIC 2: The "Behemoth" Pipeline**
    * **Story 2.1**: Auto-expand input using "Multi-Agent Light" logic and CoT wrappers.
    * **Story 2.2**: Visual "Heatmap" border indicates context-readiness levels.
* **EPIC 3: Minimalist UX**
    * **Story 3.1**: UI remains invisible until a text box is focused to minimize distraction.

## 3. Technical Constraints & Architecture
* **Manifest V3**: All logic bundled locally (Service Worker + Content Scripts).
* **Robust Selectors**: Targeted `contenteditable` detection instead of fragile CSS classes.
* **Zero-Knowledge**: All enrichment occurs client-side; no data sent to external servers.

## 4. Design & UI/UX Requirements
* **"Magic Sparkle" Button**: Semi-transparent SVG in the bottom-right of input fields; triggers on focus.
* **Context Heatmap**: 1px "breathing" border transitioning from Red (Low) to Blue (Med) to Gold (High Context).
* **Dark Mode aesthetic**: Deep grays and neon accents to match LLM interfaces.

## 5. Success Metrics & Quality Assurance
* **Latency**: Enrichment to injection must complete in **<500ms**.
* **Prompt Depth**: Target **>400% increase** in character count from user intent.
* **One-Click Metric**: Goal of **>80%** success rate without manual user edits post-enhancement.