Front-End Specification: Magic Sparkle Prompt Engine
====================================================

1\. User Persona & Architecture
-------------------------------

*   **Primary Persona**: "Flow-State Knowledge Worker" – High-efficiency users who require tools to be invisible until needed.
    
*   **Architecture**:
    
    *   **Shadow DOM Wrapper**: All UI components are contained in a Shadow DOM to prevent CSS leaks from host sites.
        
    *   **Injection Target**: Relative to contenteditable and textarea elements on supported domains.
        

2\. User Flows & Interaction
----------------------------

*   **Activation**: UI reveals only upon focus of a valid text input.
    
*   **Enhancement**:
    
    1.  User types intent.
        
    2.  Heatmap indicates context readiness (Gray -> Blue -> Gold).
        
    3.  User clicks Sparkle FAB or uses Alt + S.
        
    4.  Text is replaced with the "Behemoth" prompt via a Pulse animation.
        
*   **Persistence**: FAB fades out immediately upon blur/loss of focus.
    

3\. Visual Design (The "Lumina" Theme)
--------------------------------------

*   **Palette**:
    
    *   **Frosted Glass**: rgba(26, 26, 26, 0.85) with backdrop-filter: blur(8px).
        
    *   **Gold (High Context)**: linear-gradient(135deg, #FFD700 0%, #FFA500 100%).
        
    *   **Cyan (Scanning)**: #00F2FF.
        
*   **Components**:
    
    *   **Sparkle FAB**: Minimalist SVG wand (1.5px stroke). Shimmer effect applied in Gold state.
        
    *   **Heatmap**: 1px outline (to avoid layout shift) with a 3s breathing opacity animation.
        

4\. Accessibility & Responsiveness
----------------------------------

*   **A11y**:
    
    *   **ARIA**: aria-label="Enhance Prompt", role="button".
        
    *   **Keyboard**: Tab-indexable + Global hotkey Alt + S.
        
    *   **Non-Visual Indicators**: Solid (Low), Dotted (Med), and Pulsing (High) line styles for color-blind accessibility.
        
*   **Responsiveness**:
    
    *   20% scale reduction on mobile/narrow viewports.
        
    *   Dynamic collision detection to avoid overlapping "Send" buttons.