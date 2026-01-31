/**
 * Magic Sparkle Prompt Engine - Type Definitions
 * Strict TypeScript types for the entire extension
 */

// Supported LLM Platforms
export type LLMPlatform = 'chatgpt' | 'claude' | 'gemini' | 'unknown';

// Source context detection level
export type SourceType = 'github' | 'arxiv' | 'jira' | 'stackoverflow' | 'docs' | 'generic';

// Context readiness levels for the Heatmap
export type ContextLevel = 'low' | 'medium' | 'high';

// Heatmap visual state
export interface HeatmapState {
  level: ContextLevel;
  color: string;
  borderStyle: 'solid' | 'dotted' | 'pulsing';
}

// Page context scraped from the active tab
export interface PageContext {
  title: string;
  url: string;
  domain: string;
  sourceType: SourceType;
  textContent: string;
  metadata: Record<string, string>;
  tokenCount: number;
}

// User's original input
export interface UserIntent {
  text: string;
  inputElement: HTMLElement | null;
  timestamp: number;
}

// Expert persona for domain-specific enhancement
export interface ExpertPersona {
  role: string;
  expertise: string[];
  thinkingStyle: string;
  outputFormat: string;
}

// The enriched "Behemoth" prompt
export interface BehemothPrompt {
  original: UserIntent;
  enriched: string;
  persona: ExpertPersona;
  context: PageContext;
  expansionRatio: number;
  processingTimeMs: number;
}

// FAB component state
export interface FABState {
  visible: boolean;
  position: { x: number; y: number };
  isProcessing: boolean;
  isAnimating: boolean;
}

// Messages between content script and background service worker
export interface EnhanceRequestMessage {
  type: 'ENHANCE_PROMPT';
  payload: {
    userText: string;
    context: PageContext;
    platform: LLMPlatform;
  };
}

export interface EnhanceResponseMessage {
  type: 'ENHANCE_RESPONSE';
  payload: {
    success: boolean;
    enrichedPrompt?: string;
    error?: string;
    processingTimeMs: number;
  };
}

export type ExtensionMessage = EnhanceRequestMessage | EnhanceResponseMessage;

// Platform detection patterns
export interface PlatformPattern {
  platform: LLMPlatform;
  urlPatterns: RegExp[];
  inputSelectors: string[];
}

// Configuration constants
export const PLATFORM_PATTERNS: PlatformPattern[] = [
  {
    platform: 'chatgpt',
    urlPatterns: [/chat\.openai\.com/, /chatgpt\.com/],
    inputSelectors: [
      '#prompt-textarea',
      '[data-id="root"]',
      'div[contenteditable="true"]',
      'textarea[placeholder*="Message"]',
      'textarea[data-id="root"]'
    ]
  },
  {
    platform: 'claude',
    urlPatterns: [/claude\.ai/],
    inputSelectors: [
      'div[contenteditable="true"]',
      '[data-placeholder*="Reply"]',
      '.ProseMirror',
      'div[enterkeyhint="enter"]'
    ]
  },
  {
    platform: 'gemini',
    urlPatterns: [/gemini\.google\.com/],
    inputSelectors: [
      'div[contenteditable="true"]',
      '.ql-editor',
      'rich-textarea div[contenteditable="true"]',
      '[aria-label*="Enter a prompt"]'
    ]
  }
];

// Token and context limits
export const CONTEXT_LIMITS = {
  MAX_TOKENS: 2000,
  MAX_CHARS: 8000,
  LATENCY_BUDGET_MS: 500
} as const;

// Heatmap color configurations
export const HEATMAP_COLORS: Record<ContextLevel, HeatmapState> = {
  low: {
    level: 'low',
    color: '#FF4444',
    borderStyle: 'solid'
  },
  medium: {
    level: 'medium',
    color: '#4488FF',
    borderStyle: 'dotted'
  },
  high: {
    level: 'high',
    color: '#FFD700',
    borderStyle: 'pulsing'
  }
};
