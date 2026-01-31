/**
 * Types Tests
 * Tests for type definitions and constants
 */

import {
  PLATFORM_PATTERNS,
  CONTEXT_LIMITS,
  HEATMAP_COLORS,
} from '~/types';
import type {
  LLMPlatform,
  SourceType,
  ContextLevel,
  PageContext,
  UserIntent,
  ExpertPersona,
  BehemothPrompt,
  FABState,
  HeatmapState,
  PlatformPattern,
} from '~/types';

describe('Types and Constants', () => {
  describe('PLATFORM_PATTERNS', () => {
    it('should have patterns for all supported platforms', () => {
      const platforms = PLATFORM_PATTERNS.map((p) => p.platform);

      expect(platforms).toContain('chatgpt');
      expect(platforms).toContain('claude');
      expect(platforms).toContain('gemini');
    });

    it('should have valid URL patterns', () => {
      PLATFORM_PATTERNS.forEach((pattern) => {
        pattern.urlPatterns.forEach((urlPattern) => {
          expect(urlPattern).toBeInstanceOf(RegExp);
        });
      });
    });

    it('should have input selectors for each platform', () => {
      PLATFORM_PATTERNS.forEach((pattern) => {
        expect(pattern.inputSelectors.length).toBeGreaterThan(0);
      });
    });

    it('ChatGPT pattern should match correct URLs', () => {
      const chatgptPattern = PLATFORM_PATTERNS.find((p) => p.platform === 'chatgpt');

      expect(chatgptPattern?.urlPatterns.some((p) => p.test('https://chat.openai.com/'))).toBe(true);
      expect(chatgptPattern?.urlPatterns.some((p) => p.test('https://chatgpt.com/'))).toBe(true);
    });

    it('Claude pattern should match correct URLs', () => {
      const claudePattern = PLATFORM_PATTERNS.find((p) => p.platform === 'claude');

      expect(claudePattern?.urlPatterns.some((p) => p.test('https://claude.ai/'))).toBe(true);
    });

    it('Gemini pattern should match correct URLs', () => {
      const geminiPattern = PLATFORM_PATTERNS.find((p) => p.platform === 'gemini');

      expect(geminiPattern?.urlPatterns.some((p) => p.test('https://gemini.google.com/'))).toBe(true);
    });

    it('should have valid CSS selectors', () => {
      PLATFORM_PATTERNS.forEach((pattern) => {
        pattern.inputSelectors.forEach((selector) => {
          // Selector should be a non-empty string
          expect(typeof selector).toBe('string');
          expect(selector.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('CONTEXT_LIMITS', () => {
    it('should have MAX_TOKENS defined', () => {
      expect(CONTEXT_LIMITS.MAX_TOKENS).toBeDefined();
      expect(typeof CONTEXT_LIMITS.MAX_TOKENS).toBe('number');
      expect(CONTEXT_LIMITS.MAX_TOKENS).toBeGreaterThan(0);
    });

    it('should have MAX_CHARS defined', () => {
      expect(CONTEXT_LIMITS.MAX_CHARS).toBeDefined();
      expect(typeof CONTEXT_LIMITS.MAX_CHARS).toBe('number');
      expect(CONTEXT_LIMITS.MAX_CHARS).toBeGreaterThan(0);
    });

    it('should have LATENCY_BUDGET_MS defined', () => {
      expect(CONTEXT_LIMITS.LATENCY_BUDGET_MS).toBeDefined();
      expect(typeof CONTEXT_LIMITS.LATENCY_BUDGET_MS).toBe('number');
      expect(CONTEXT_LIMITS.LATENCY_BUDGET_MS).toBeGreaterThan(0);
    });

    it('should have reasonable token limit', () => {
      expect(CONTEXT_LIMITS.MAX_TOKENS).toBe(2000);
    });

    it('should have reasonable char limit', () => {
      expect(CONTEXT_LIMITS.MAX_CHARS).toBe(8000);
    });

    it('should have 500ms latency budget', () => {
      expect(CONTEXT_LIMITS.LATENCY_BUDGET_MS).toBe(500);
    });

    it('should be read-only (const assertion)', () => {
      // TypeScript should prevent modification at compile time
      // At runtime, we verify the object structure is as expected
      expect(Object.isFrozen(CONTEXT_LIMITS)).toBe(false); // Objects with 'as const' aren't actually frozen
      expect(CONTEXT_LIMITS).toEqual({
        MAX_TOKENS: 2000,
        MAX_CHARS: 8000,
        LATENCY_BUDGET_MS: 500,
      });
    });
  });

  describe('HEATMAP_COLORS', () => {
    it('should have colors for all context levels', () => {
      expect(HEATMAP_COLORS.low).toBeDefined();
      expect(HEATMAP_COLORS.medium).toBeDefined();
      expect(HEATMAP_COLORS.high).toBeDefined();
    });

    it('should have correct structure for low level', () => {
      expect(HEATMAP_COLORS.low.level).toBe('low');
      expect(HEATMAP_COLORS.low.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(HEATMAP_COLORS.low.borderStyle).toBe('solid');
    });

    it('should have correct structure for medium level', () => {
      expect(HEATMAP_COLORS.medium.level).toBe('medium');
      expect(HEATMAP_COLORS.medium.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(HEATMAP_COLORS.medium.borderStyle).toBe('dotted');
    });

    it('should have correct structure for high level', () => {
      expect(HEATMAP_COLORS.high.level).toBe('high');
      expect(HEATMAP_COLORS.high.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(HEATMAP_COLORS.high.borderStyle).toBe('pulsing');
    });

    it('should have distinct colors for each level', () => {
      const colors = [
        HEATMAP_COLORS.low.color,
        HEATMAP_COLORS.medium.color,
        HEATMAP_COLORS.high.color,
      ];
      const uniqueColors = new Set(colors);

      expect(uniqueColors.size).toBe(3);
    });

    it('should have specific expected colors', () => {
      expect(HEATMAP_COLORS.low.color).toBe('#FF4444'); // Red
      expect(HEATMAP_COLORS.medium.color).toBe('#4488FF'); // Blue
      expect(HEATMAP_COLORS.high.color).toBe('#FFD700'); // Gold
    });
  });

  describe('Type Compatibility', () => {
    it('should allow valid LLMPlatform values', () => {
      const platforms: LLMPlatform[] = ['chatgpt', 'claude', 'gemini', 'unknown'];
      expect(platforms).toHaveLength(4);
    });

    it('should allow valid SourceType values', () => {
      const sources: SourceType[] = ['github', 'arxiv', 'jira', 'stackoverflow', 'docs', 'generic'];
      expect(sources).toHaveLength(6);
    });

    it('should allow valid ContextLevel values', () => {
      const levels: ContextLevel[] = ['low', 'medium', 'high'];
      expect(levels).toHaveLength(3);
    });

    it('should validate PageContext structure', () => {
      const context: PageContext = {
        title: 'Test',
        url: 'https://test.com',
        domain: 'test.com',
        sourceType: 'generic',
        textContent: 'Content',
        metadata: { key: 'value' },
        tokenCount: 100,
      };

      expect(context.title).toBeDefined();
      expect(context.url).toBeDefined();
      expect(context.domain).toBeDefined();
      expect(context.sourceType).toBeDefined();
      expect(context.textContent).toBeDefined();
      expect(context.metadata).toBeDefined();
      expect(context.tokenCount).toBeDefined();
    });

    it('should validate UserIntent structure', () => {
      const intent: UserIntent = {
        text: 'Test intent',
        inputElement: null,
        timestamp: Date.now(),
      };

      expect(intent.text).toBeDefined();
      expect(intent.inputElement).toBeNull();
      expect(intent.timestamp).toBeGreaterThan(0);
    });

    it('should validate ExpertPersona structure', () => {
      const persona: ExpertPersona = {
        role: 'Expert',
        expertise: ['skill1', 'skill2'],
        thinkingStyle: 'analytical',
        outputFormat: 'structured',
      };

      expect(persona.role).toBeDefined();
      expect(Array.isArray(persona.expertise)).toBe(true);
      expect(persona.thinkingStyle).toBeDefined();
      expect(persona.outputFormat).toBeDefined();
    });

    it('should validate BehemothPrompt structure', () => {
      const prompt: BehemothPrompt = {
        original: {
          text: 'Original',
          inputElement: null,
          timestamp: Date.now(),
        },
        enriched: 'Enriched prompt text',
        persona: {
          role: 'Expert',
          expertise: [],
          thinkingStyle: 'style',
          outputFormat: 'format',
        },
        context: {
          title: 'Title',
          url: 'https://url.com',
          domain: 'url.com',
          sourceType: 'generic',
          textContent: '',
          metadata: {},
          tokenCount: 0,
        },
        expansionRatio: 5,
        processingTimeMs: 100,
      };

      expect(prompt.original).toBeDefined();
      expect(prompt.enriched).toBeDefined();
      expect(prompt.persona).toBeDefined();
      expect(prompt.context).toBeDefined();
      expect(prompt.expansionRatio).toBeGreaterThan(0);
      expect(prompt.processingTimeMs).toBeGreaterThanOrEqual(0);
    });

    it('should validate FABState structure', () => {
      const state: FABState = {
        visible: true,
        position: { x: 100, y: 200 },
        isProcessing: false,
        isAnimating: true,
      };

      expect(typeof state.visible).toBe('boolean');
      expect(state.position).toHaveProperty('x');
      expect(state.position).toHaveProperty('y');
      expect(typeof state.isProcessing).toBe('boolean');
      expect(typeof state.isAnimating).toBe('boolean');
    });

    it('should validate HeatmapState structure', () => {
      const state: HeatmapState = {
        level: 'high',
        color: '#FFD700',
        borderStyle: 'pulsing',
      };

      expect(['low', 'medium', 'high']).toContain(state.level);
      expect(state.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(['solid', 'dotted', 'pulsing']).toContain(state.borderStyle);
    });

    it('should validate PlatformPattern structure', () => {
      const pattern: PlatformPattern = {
        platform: 'chatgpt',
        urlPatterns: [/chatgpt\.com/],
        inputSelectors: ['textarea'],
      };

      expect(['chatgpt', 'claude', 'gemini', 'unknown']).toContain(pattern.platform);
      expect(Array.isArray(pattern.urlPatterns)).toBe(true);
      expect(Array.isArray(pattern.inputSelectors)).toBe(true);
    });
  });
});
