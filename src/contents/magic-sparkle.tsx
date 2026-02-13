/**
 * Magic Sparkle Content Script UI
 * Main content script that injects the FAB into LLM platforms
 * Uses Plasmo's CSUI with Shadow DOM for style isolation
 */

import type { PlasmoCSConfig, PlasmoGetStyle, PlasmoGetShadowHostId } from 'plasmo';
import { useState, useEffect, useCallback, useRef } from 'react';
import { sendToBackground } from '@plasmohq/messaging';
import cssText from 'data-text:~/style.css';

import { SparkleFAB } from '~/components/SparkleFAB';
import {
  applyHeatmap,
  updateHeatmapLevel,
  removeHeatmap,
  triggerPulseAnimation
} from '~/components/ContextHeatmap';
import {
  detectPlatform,
  findInputElement,
  getInputText,
  setInputText,
  isSupportedPlatform
} from '~/utils/platform-detector';
import { scrapePageContext, calculateContextScore } from '~/utils/context-scraper';
import type { ContextLevel, LLMPlatform, PageContext } from '~/types';

// Plasmo Configuration - Target LLM platforms
export const config: PlasmoCSConfig = {
  matches: [
    'https://chat.openai.com/*',
    'https://chatgpt.com/*',
    'https://claude.ai/*',
    'https://gemini.google.com/*'
  ],
  all_frames: false
};

// Shadow DOM host ID
export const getShadowHostId: PlasmoGetShadowHostId = () => 'magic-sparkle-root';

// Inject Tailwind styles into Shadow DOM
export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement('style');
  style.textContent = cssText + `

    /* Tailwind base reset for Shadow DOM */
    *, *::before, *::after {
      box-sizing: border-box;
      border-width: 0;
      border-style: solid;
    }

    /* FAB Container */
    .sparkle-fab-container {
      position: fixed;
      z-index: 2147483647;
      pointer-events: auto;
      transition: all 0.2s ease-out;
    }

    /* Animation keyframes */
    @keyframes shimmer {
      0%, 100% { opacity: 1; filter: brightness(1); }
      50% { opacity: 0.8; filter: brightness(1.3); }
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes ping {
      75%, 100% {
        transform: scale(2);
        opacity: 0;
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }

    @keyframes fadeOut {
      from { opacity: 1; transform: scale(1); }
      to { opacity: 0; transform: scale(0.9); }
    }

    .animate-sparkle-shimmer {
      animation: shimmer 2s ease-in-out infinite;
    }

    .animate-spin {
      animation: spin 1s linear infinite;
    }

    .animate-ping {
      animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }

    .animate-fade-in {
      animation: fadeIn 0.2s ease-out forwards;
    }

    .animate-fade-out {
      animation: fadeOut 0.2s ease-in forwards;
    }

    /* Tooltip */
    .sparkle-tooltip {
      position: absolute;
      bottom: 100%;
      right: 0;
      margin-bottom: 8px;
      padding: 6px 12px;
      background: rgba(26, 26, 26, 0.95);
      color: white;
      font-size: 12px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      border-radius: 6px;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transform: translateY(4px);
      transition: opacity 0.15s, transform 0.15s;
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .sparkle-fab-container:hover .sparkle-tooltip {
      opacity: 1;
      transform: translateY(0);
    }

    /* Keyboard shortcut badge */
    .shortcut-badge {
      display: inline-block;
      padding: 2px 6px;
      margin-left: 8px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 4px;
      font-size: 10px;
      font-family: monospace;
    }
  `;
  return style;
};

// Main component
function MagicSparkleOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [contextLevel, setContextLevel] = useState<ContextLevel>('low');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [platform, setPlatform] = useState<LLMPlatform>('unknown');
  const [pageContext, setPageContext] = useState<PageContext | null>(null);

  const activeInputRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  // Scrape context and update heatmap
  const updateContext = useCallback(async () => {
    try {
      const context = await scrapePageContext();
      setPageContext(context);

      const score = calculateContextScore(context);
      let level: ContextLevel = 'low';
      if (score > 70) level = 'high';
      else if (score > 40) level = 'medium';

      setContextLevel(level);

      // Update heatmap on active input
      if (activeInputRef.current) {
        updateHeatmapLevel(activeInputRef.current, level);
      }
    } catch (error) {
      console.error('[MagicSparkle] Context scraping error:', error);
    }
  }, []);

  // Position the FAB relative to the input element
  const positionFAB = useCallback((element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const padding = 8;
    const fabSize = 40;

    // Position in bottom-right corner of the input
    let x = rect.right - fabSize - padding;
    let y = rect.bottom - fabSize - padding;

    // Ensure FAB stays within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (x + fabSize > viewportWidth - padding) {
      x = viewportWidth - fabSize - padding;
    }
    if (y + fabSize > viewportHeight - padding) {
      y = rect.top + padding; // Move to top if no space at bottom
    }

    setPosition({ x, y });
  }, []);

  // Handle input focus
  const handleFocus = useCallback((element: HTMLElement) => {
    activeInputRef.current = element;
    positionFAB(element);
    setIsVisible(true);
    applyHeatmap(element, contextLevel);
    updateContext();
  }, [contextLevel, positionFAB, updateContext]);

  // Handle input blur
  const handleBlur = useCallback(() => {
    // Small delay to allow click on FAB
    setTimeout(() => {
      if (activeInputRef.current) {
        removeHeatmap(activeInputRef.current);
      }
      activeInputRef.current = null;
      setIsVisible(false);
    }, 150);
  }, []);

  // Handle FAB click - enhance prompt
  const handleEnhance = useCallback(async () => {
    if (!activeInputRef.current || isProcessing) return;

    const userText = getInputText(activeInputRef.current);
    if (!userText.trim()) {
      console.log('[MagicSparkle] No text to enhance');
      return;
    }

    setIsProcessing(true);

    try {
      // Scrape fresh context
      const context = pageContext ?? await scrapePageContext();

      // Send to background for enhancement
      const response = await sendToBackground({
        name: 'enhance',
        body: {
          userText,
          context,
          platform
        }
      });

      if (response.success && response.enrichedPrompt) {
        // Inject the enhanced prompt
        const success = setInputText(activeInputRef.current!, response.enrichedPrompt);
        
        if (success) {
          // Trigger pulse animation
          triggerPulseAnimation(activeInputRef.current!);
          console.log('[MagicSparkle] Prompt enhanced!', {
            processingTimeMs: response.processingTimeMs
          });
        }
      } else {
        console.error('[MagicSparkle] Enhancement failed:', response.error);
      }
    } catch (error) {
      console.error('[MagicSparkle] Enhancement error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, pageContext, platform]);

  // Keyboard shortcut handler
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Alt + S to trigger enhancement
    if (event.altKey && event.key.toLowerCase() === 's') {
      event.preventDefault();
      handleEnhance();
    }
  }, [handleEnhance]);

  // Setup platform detection and observers
  useEffect(() => {
    const detectedPlatform = detectPlatform();
    setPlatform(detectedPlatform);

    if (detectedPlatform === 'unknown') {
      console.log('[MagicSparkle] Not a supported LLM platform');
      return;
    }

    console.log('[MagicSparkle] Detected platform:', detectedPlatform);

    // Initial context scrape
    updateContext();

    // Setup focus/blur listeners
    const handleFocusEvent = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'TEXTAREA' ||
        target.getAttribute('contenteditable') === 'true' ||
        target.getAttribute('role') === 'textbox'
      ) {
        handleFocus(target);
      }
    };

    const handleBlurEvent = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      if (activeInputRef.current === target) {
        handleBlur();
      }
    };

    // Add event listeners
    document.addEventListener('focusin', handleFocusEvent, true);
    document.addEventListener('focusout', handleBlurEvent, true);
    document.addEventListener('keydown', handleKeyDown);

    // Setup MutationObserver to detect dynamically added inputs
    observerRef.current = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          // Check if any new inputs were added
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              const input = findInputElement(detectedPlatform);
              if (input && document.activeElement === input) {
                handleFocus(input);
              }
            }
          });
        }
      }
    });

    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Check for already focused input
    const existingInput = findInputElement(detectedPlatform);
    if (existingInput && document.activeElement === existingInput) {
      handleFocus(existingInput);
    }

    // Cleanup
    return () => {
      document.removeEventListener('focusin', handleFocusEvent, true);
      document.removeEventListener('focusout', handleBlurEvent, true);
      document.removeEventListener('keydown', handleKeyDown);
      observerRef.current?.disconnect();
      
      if (activeInputRef.current) {
        removeHeatmap(activeInputRef.current);
      }
    };
  }, [handleFocus, handleBlur, handleKeyDown, updateContext]);

  // Update position on scroll/resize
  useEffect(() => {
    const updatePosition = () => {
      if (activeInputRef.current && isVisible) {
        positionFAB(activeInputRef.current);
      }
    };

    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isVisible, positionFAB]);

  if (!isVisible) return null;

  return (
    <div
      className={`sparkle-fab-container ${isVisible ? 'animate-fade-in' : 'animate-fade-out'}`}
      style={{
        left: position.x,
        top: position.y
      }}
    >
      <div className="sparkle-tooltip">
        Enhance Prompt
        <span className="shortcut-badge">Alt+S</span>
      </div>
      <SparkleFAB
        onClick={handleEnhance}
        isProcessing={isProcessing}
        contextLevel={contextLevel}
      />
    </div>
  );
}

export default MagicSparkleOverlay;
