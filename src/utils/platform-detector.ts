/**
 * Platform Detection Utility
 * Identifies which LLM platform the user is on and finds input elements
 */

import {
  type LLMPlatform,
  type PlatformPattern,
  PLATFORM_PATTERNS
} from '~/types';

/**
 * Detects the current LLM platform based on URL
 */
export function detectPlatform(url: string = window.location.href): LLMPlatform {
  for (const pattern of PLATFORM_PATTERNS) {
    for (const urlPattern of pattern.urlPatterns) {
      if (urlPattern.test(url)) {
        return pattern.platform;
      }
    }
  }
  return 'unknown';
}

/**
 * Gets the platform pattern configuration for a given platform
 */
export function getPlatformPattern(platform: LLMPlatform): PlatformPattern | null {
  return PLATFORM_PATTERNS.find((p) => p.platform === platform) ?? null;
}

/**
 * Finds the active input element on the current platform
 * Uses robust selectors (contenteditable, ARIA) instead of fragile CSS classes
 */
export function findInputElement(platform: LLMPlatform): HTMLElement | null {
  const pattern = getPlatformPattern(platform);
  if (!pattern) return null;

  for (const selector of pattern.inputSelectors) {
    try {
      const element = document.querySelector<HTMLElement>(selector);
      if (element && isValidInputElement(element)) {
        return element;
      }
    } catch {
      // Invalid selector, continue to next
      continue;
    }
  }

  // Fallback: search for any contenteditable or textarea
  return findFallbackInput();
}

/**
 * Validates that an element is a usable input
 */
function isValidInputElement(element: HTMLElement): boolean {
  // Check if element is visible
  const style = window.getComputedStyle(element);
  if (style.display === 'none' || style.visibility === 'hidden') {
    return false;
  }

  // Check if it's a valid input type
  const isTextarea = element.tagName.toLowerCase() === 'textarea';
  const isContentEditable = element.getAttribute('contenteditable') === 'true';
  const hasEditableRole = element.getAttribute('role') === 'textbox';

  return isTextarea || isContentEditable || hasEditableRole;
}

/**
 * Fallback input detection using generic selectors
 */
function findFallbackInput(): HTMLElement | null {
  // Try contenteditable first
  const contentEditable = document.querySelector<HTMLElement>(
    '[contenteditable="true"]:not([aria-hidden="true"])'
  );
  if (contentEditable && isValidInputElement(contentEditable)) {
    return contentEditable;
  }

  // Try textarea
  const textarea = document.querySelector<HTMLTextAreaElement>(
    'textarea:not([aria-hidden="true"]):not([disabled])'
  );
  if (textarea && isValidInputElement(textarea)) {
    return textarea;
  }

  return null;
}

/**
 * Checks if the current page is a supported LLM platform
 */
export function isSupportedPlatform(): boolean {
  return detectPlatform() !== 'unknown';
}

/**
 * Gets text content from an input element
 */
export function getInputText(element: HTMLElement): string {
  if (element instanceof HTMLTextAreaElement || element instanceof HTMLInputElement) {
    return element.value;
  }
  // For contenteditable elements
  return element.innerText || element.textContent || '';
}

/**
 * Sets text content in an input element
 * Uses execCommand for better compatibility with React-based UIs
 */
export function setInputText(element: HTMLElement, text: string): boolean {
  try {
    // Focus the element first
    element.focus();

    if (element instanceof HTMLTextAreaElement || element instanceof HTMLInputElement) {
      // For standard inputs, use native value setter to trigger React's onChange
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        element instanceof HTMLTextAreaElement
          ? HTMLTextAreaElement.prototype
          : HTMLInputElement.prototype,
        'value'
      )?.set;

      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(element, text);
      } else {
        element.value = text;
      }

      // Dispatch input event for React
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      // For contenteditable, select all and insert
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(element);
      selection?.removeAllRanges();
      selection?.addRange(range);

      // Use execCommand for better undo support
      document.execCommand('insertText', false, text);
    }

    return true;
  } catch (error) {
    console.error('[MagicSparkle] Failed to set input text:', error);
    return false;
  }
}
