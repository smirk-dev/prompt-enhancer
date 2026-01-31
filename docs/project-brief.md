Project Brief: Magic Sparkle Prompt Engine
==========================================

1\. Executive Summary (Developer-Focused)
-----------------------------------------

*   **System Architecture**: A cross-browser extension (Manifest V3) utilizing a **Context Injection Engine**. It leverages DOM scraping and URL pattern matching to identify active LLM platforms (ChatGPT, Claude, Gemini) and specific high-value domains (GitHub, arXiv, Jira).
    
*   **The "Behemoth" Pipeline**: Implements a middleware layer that intercepts user input from the "Magic Sparkle" UI, passes it through a **Multi-Agent Simulation logic** to enrich context, and then re-injects the expanded "Behemoth" prompt into the target LLM's text area.
    
*   **Core Technical Features**:
    
    *   **Heuristic Site Detection**: Automated identification of page metadata for context grounding.
        
    *   **Proactive Error Correction**: Insertion of "Chain-of-Thought" (CoT) and "Few-Shot" structural wrappers to minimize LLM hallucinations.
        
    *   **Dynamic UI Overlay**: A distraction-free, context-aware floating action button (FAB) that triggers only on focused contenteditable or textarea elements.
        
*   **Browser Interoperability**: Built using a unified codebase (e.g., Plasmo or WebExtension Polyfill) to ensure 100% feature parity across Chrome, Firefox, Edge, and Safari.
    

2\. Problem Statement
---------------------

*   **The "Context Cold Start" Problem**: Users frequently provide 1-5 word prompts which lack the environmental variables (language version, project structure, or page-specific nuances) to generate a useful response.
    
*   **Platform Fragmentation**: Each LLM has different prompt engineering "sweet spots." Users cannot be expected to manually reformat intent for every tab.
    
*   **UX Intrusion**: Existing "AI sidebars" require switching focus away from the main input area, breaking user flow.
    

3\. MVP Scope
-------------

*   **Core UI**: **Floating Action Button (FAB) "Magic Sparkle"** injected into the DOM. **Context Heatmap** (1px glowing border/underline) that transitions color as context is gathered.
    
*   **Context Engine**: Level 1 (LLM Detection: ChatGPT, Claude, Gemini) and Level 2 (Source Scraping: Title, Metadata, and up to 2000 tokens of page context).
    
*   **"Behemoth" Pipeline**: Hardcoded Best-Practices (CoT, Persona Assignment based on site) and **Multi-Agent "Light"** (synthesis logic using high-performance templates).
    
*   **Compatibility**: Manifest V3 unified build script for Chrome and Firefox.
    

4\. Technical Constraints & Assumptions
---------------------------------------

*   **Latency Budget**: Enrichment must complete in under **500ms** to maintain a sleek feel.
    
*   **Local Processing**: No remotely hosted code; all logic must be bundled locally to comply with Manifest V3.
    
*   **Robust Selector Strategy**: Searching for contenteditable="true" or ARIA labels rather than hardcoded CSS classes to ensure stability against LLM UI updates.
    

5\. Success Metrics
-------------------

*   **Prompt Expansion Ratio**: Minimum **5x increase** in token count for enhanced prompts.
    
*   **One-Shot Success Rate**: **\>85%** of prompts resulting in satisfactory first-time responses.
    
*   **UI Interaction Latency**: **100%** compliance with the <500ms budget.