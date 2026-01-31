# Technical Architecture: Magic Sparkle Prompt Engine

1\. System Components & Tech Stack
----------------------------------

*   **Framework**: **Plasmo** (Manifest V3 framework) for cross-browser extension management.
    
*   **UI Layer**: **React + Tailwind CSS** scoped within a **Shadow DOM** to prevent style bleed.
    
*   **State Management**: **Zustand** for lightweight, reactive state across content scripts.
    
*   **Communication**: **Plasmo Messaging API** for type-safe Service Worker <-> Content Script signaling.
    

2\. Data Flow & Event Mapping
-----------------------------

*   **Detection**: MutationObserver in the Content Script identifies LLM input fields.
    
*   **Scraping**: Asynchronous extraction of tab metadata (Title, URL, and high-priority DOM text).
    
*   **Enrichment**:
    
    1.  Click FAB -> Send payload to Background Service Worker.
        
    2.  Service Worker runs **Multi-Agent Light** logic (nesting input within expert templates).
        
    3.  Return enriched string -> Injected via execCommand('insertText').
        

3\. Internal Logic: The Behemoth Engine
---------------------------------------

*   **Template Orchestrator**: Matches the current domain to a specific "Expert Persona" (e.g., Coder for GitHub).
    
*   **Prompt Nesting**: Wraps user intent in Chain-of-Thought (CoT) and "Simulated Peer Review" frameworks locally.
    
*   **Token Budgeting**: Heuristic truncation to ensure context stays within the 2000-4000 token limit.
    

4\. Testing & Deployment
------------------------

*   **E2E Testing**: **Playwright** suite for daily "DOM-Watch" checks against ChatGPT, Claude, and Gemini.
    
*   **CI/CD**: GitHub Actions for automated linting, building, and cross-store submission (Chrome/Firefox).
    
*   **Rollout**: Percentage-based deployment via Chrome Web Store to monitor stability.