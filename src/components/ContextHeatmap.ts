/**
 * Context Heatmap Manager
 * Applies breathing border effect to the target input element
 * Uses outline/box-shadow to avoid layout shifts
 */

import type { ContextLevel } from '~/types';
import { HEATMAP_COLORS } from '~/types';

// CSS class prefix to identify our injected styles
const HEATMAP_CLASS = 'magic-sparkle-heatmap';

// Keyframe animations (injected once)
const HEATMAP_STYLES = `
  @keyframes magic-sparkle-breathe-low {
    0%, 100% { 
      outline-color: rgba(255, 68, 68, 0.4);
      box-shadow: 0 0 0 1px rgba(255, 68, 68, 0.4);
    }
    50% { 
      outline-color: rgba(255, 68, 68, 0.8);
      box-shadow: 0 0 8px 1px rgba(255, 68, 68, 0.6);
    }
  }

  @keyframes magic-sparkle-breathe-medium {
    0%, 100% { 
      outline-color: rgba(68, 136, 255, 0.4);
      box-shadow: 0 0 0 1px rgba(68, 136, 255, 0.4);
    }
    50% { 
      outline-color: rgba(68, 136, 255, 0.9);
      box-shadow: 0 0 12px 1px rgba(0, 242, 255, 0.5);
    }
  }

  @keyframes magic-sparkle-breathe-high {
    0%, 100% { 
      outline-color: rgba(255, 215, 0, 0.5);
      box-shadow: 0 0 0 1px rgba(255, 215, 0, 0.5);
    }
    50% { 
      outline-color: rgba(255, 215, 0, 1);
      box-shadow: 0 0 16px 2px rgba(255, 165, 0, 0.7);
    }
  }

  .${HEATMAP_CLASS} {
    outline-style: solid !important;
    outline-width: 1px !important;
    outline-offset: 2px !important;
    transition: outline-color 0.3s ease, box-shadow 0.3s ease !important;
  }

  .${HEATMAP_CLASS}-low {
    animation: magic-sparkle-breathe-low 3s ease-in-out infinite !important;
    outline-style: solid !important;
  }

  .${HEATMAP_CLASS}-medium {
    animation: magic-sparkle-breathe-medium 3s ease-in-out infinite !important;
    outline-style: dotted !important;
  }

  .${HEATMAP_CLASS}-high {
    animation: magic-sparkle-breathe-high 2.5s ease-in-out infinite !important;
    outline-style: solid !important;
  }

  /* Pulse animation for injection feedback */
  @keyframes magic-sparkle-pulse-inject {
    0% { 
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.7);
    }
    50% { 
      transform: scale(1.01);
      box-shadow: 0 0 20px 4px rgba(255, 215, 0, 0.5);
    }
    100% { 
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(255, 215, 0, 0);
    }
  }

  .${HEATMAP_CLASS}-pulse {
    animation: magic-sparkle-pulse-inject 0.4s ease-out !important;
  }
`;

let stylesInjected = false;

/**
 * Injects the heatmap CSS styles into the document
 */
function injectStyles(): void {
  if (stylesInjected) return;

  const styleElement = document.createElement('style');
  styleElement.id = 'magic-sparkle-heatmap-styles';
  styleElement.textContent = HEATMAP_STYLES;
  document.head.appendChild(styleElement);
  stylesInjected = true;
}

/**
 * Applies the heatmap effect to an element
 */
export function applyHeatmap(element: HTMLElement, level: ContextLevel): void {
  injectStyles();

  // Remove any existing heatmap classes
  removeHeatmap(element);

  // Add base and level-specific classes
  element.classList.add(HEATMAP_CLASS);
  element.classList.add(`${HEATMAP_CLASS}-${level}`);
}

/**
 * Updates the heatmap level on an element
 */
export function updateHeatmapLevel(element: HTMLElement, level: ContextLevel): void {
  if (!element.classList.contains(HEATMAP_CLASS)) {
    applyHeatmap(element, level);
    return;
  }

  // Remove level classes and add the new one
  element.classList.remove(
    `${HEATMAP_CLASS}-low`,
    `${HEATMAP_CLASS}-medium`,
    `${HEATMAP_CLASS}-high`
  );
  element.classList.add(`${HEATMAP_CLASS}-${level}`);
}

/**
 * Removes the heatmap effect from an element
 */
export function removeHeatmap(element: HTMLElement): void {
  element.classList.remove(
    HEATMAP_CLASS,
    `${HEATMAP_CLASS}-low`,
    `${HEATMAP_CLASS}-medium`,
    `${HEATMAP_CLASS}-high`,
    `${HEATMAP_CLASS}-pulse`
  );
}

/**
 * Triggers the pulse animation (used after prompt injection)
 */
export function triggerPulseAnimation(element: HTMLElement): void {
  element.classList.add(`${HEATMAP_CLASS}-pulse`);
  
  // Remove after animation completes
  setTimeout(() => {
    element.classList.remove(`${HEATMAP_CLASS}-pulse`);
  }, 400);
}

/**
 * Gets the current heatmap state color
 */
export function getHeatmapColor(level: ContextLevel): string {
  return HEATMAP_COLORS[level].color;
}

/**
 * Creates a heatmap manager instance for a specific element
 */
export function createHeatmapManager(element: HTMLElement) {
  let currentLevel: ContextLevel = 'low';

  return {
    apply: (level: ContextLevel) => {
      currentLevel = level;
      applyHeatmap(element, level);
    },
    update: (level: ContextLevel) => {
      currentLevel = level;
      updateHeatmapLevel(element, level);
    },
    remove: () => {
      removeHeatmap(element);
    },
    pulse: () => {
      triggerPulseAnimation(element);
    },
    getLevel: () => currentLevel
  };
}
