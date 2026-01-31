/**
 * Enhance Message Handler Tests
 * Tests for the background service worker message handler
 */

// Note: We can't directly test the Plasmo handler export, so we test the core enrichPrompt function
// which is the main logic used by the handler

import { enrichPrompt } from '~/core/behemoth-pipeline';
import type { PageContext, LLMPlatform } from '~/types';
import { CONTEXT_LIMITS } from '~/types';

// Mock request/response types matching the handler
interface RequestBody {
  userText: string;
  context: PageContext;
  platform: LLMPlatform;
}

interface ResponseBody {
  success: boolean;
  enrichedPrompt?: string;
  error?: string;
  processingTimeMs: number;
}

// Simulate the handler logic
function simulateHandler(body: Partial<RequestBody> | undefined): ResponseBody {
  const startTime = performance.now();

  try {
    const { userText, context, platform } = body ?? {};

    // Validate required fields
    if (!userText || typeof userText !== 'string') {
      return {
        success: false,
        error: 'Missing or invalid user text',
        processingTimeMs: performance.now() - startTime,
      };
    }

    if (!context) {
      return {
        success: false,
        error: 'Missing page context',
        processingTimeMs: performance.now() - startTime,
      };
    }

    // Run the Behemoth Pipeline
    const result = enrichPrompt(userText, context, platform ?? 'unknown');
    const processingTimeMs = performance.now() - startTime;

    return {
      success: true,
      enrichedPrompt: result.enriched,
      processingTimeMs,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      processingTimeMs: performance.now() - startTime,
    };
  }
}

describe('Enhance Message Handler', () => {
  const validContext: PageContext = {
    title: 'Test Page',
    url: 'https://github.com/test',
    domain: 'github.com',
    sourceType: 'github',
    textContent: 'Some test content for enrichment',
    metadata: {
      description: 'Test description',
    },
    tokenCount: 100,
  };

  describe('Validation', () => {
    it('should return error when userText is missing', () => {
      const result = simulateHandler({
        context: validContext,
        platform: 'chatgpt',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Missing or invalid user text');
    });

    it('should return error when userText is not a string', () => {
      const result = simulateHandler({
        userText: 123 as unknown as string,
        context: validContext,
        platform: 'chatgpt',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Missing or invalid user text');
    });

    it('should return error when userText is empty string', () => {
      const result = simulateHandler({
        userText: '',
        context: validContext,
        platform: 'chatgpt',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Missing or invalid user text');
    });

    it('should return error when context is missing', () => {
      const result = simulateHandler({
        userText: 'Test prompt',
        platform: 'chatgpt',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Missing page context');
    });

    it('should return error when body is undefined', () => {
      const result = simulateHandler(undefined);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('Successful Enrichment', () => {
    it('should successfully enrich a valid prompt', () => {
      const result = simulateHandler({
        userText: 'How do I fix this bug?',
        context: validContext,
        platform: 'chatgpt',
      });

      expect(result.success).toBe(true);
      expect(result.enrichedPrompt).toBeDefined();
      expect(result.enrichedPrompt!.length).toBeGreaterThan(0);
    });

    it('should include processing time in response', () => {
      const result = simulateHandler({
        userText: 'Test prompt',
        context: validContext,
        platform: 'chatgpt',
      });

      expect(result.processingTimeMs).toBeGreaterThanOrEqual(0);
      expect(typeof result.processingTimeMs).toBe('number');
    });

    it('should handle unknown platform gracefully', () => {
      const result = simulateHandler({
        userText: 'Test prompt',
        context: validContext,
        platform: 'unknown',
      });

      expect(result.success).toBe(true);
      expect(result.enrichedPrompt).toBeDefined();
    });

    it('should handle missing platform by defaulting to unknown', () => {
      const result = simulateHandler({
        userText: 'Test prompt',
        context: validContext,
      });

      expect(result.success).toBe(true);
    });

    it('should include original text in enriched prompt', () => {
      const userText = 'My specific question about code';
      const result = simulateHandler({
        userText,
        context: validContext,
        platform: 'chatgpt',
      });

      expect(result.enrichedPrompt).toContain(userText);
    });
  });

  describe('Platform-specific Enrichment', () => {
    const platforms: LLMPlatform[] = ['chatgpt', 'claude', 'gemini'];

    platforms.forEach((platform) => {
      it(`should enrich prompt for ${platform}`, () => {
        const result = simulateHandler({
          userText: 'Help me with this',
          context: validContext,
          platform,
        });

        expect(result.success).toBe(true);
        expect(result.enrichedPrompt).toBeDefined();
      });
    });
  });

  describe('Source Type Handling', () => {
    const sourceTypes = [
      { type: 'github', expected: 'Software Engineer' },
      { type: 'arxiv', expected: 'Research' },
      { type: 'stackoverflow', expected: 'Developer' },
      { type: 'jira', expected: 'Project Manager' },
      { type: 'docs', expected: 'Documentation' },
      { type: 'generic', expected: 'Consultant' },
    ] as const;

    sourceTypes.forEach(({ type, expected }) => {
      it(`should use appropriate persona for ${type} source`, () => {
        const result = simulateHandler({
          userText: 'Analyze this',
          context: { ...validContext, sourceType: type },
          platform: 'chatgpt',
        });

        expect(result.success).toBe(true);
        expect(result.enrichedPrompt).toContain(expected);
      });
    });
  });

  describe('Context Inclusion', () => {
    it('should include page title in enriched prompt', () => {
      const result = simulateHandler({
        userText: 'Help me',
        context: { ...validContext, title: 'Unique Page Title 12345' },
        platform: 'chatgpt',
      });

      expect(result.enrichedPrompt).toContain('Unique Page Title 12345');
    });

    it('should include URL in enriched prompt', () => {
      const result = simulateHandler({
        userText: 'Help me',
        context: { ...validContext, url: 'https://unique.url/path' },
        platform: 'chatgpt',
      });

      expect(result.enrichedPrompt).toContain('https://unique.url/path');
    });

    it('should include text content when available', () => {
      const result = simulateHandler({
        userText: 'Help me',
        context: { 
          ...validContext, 
          textContent: 'Unique content snippet for testing inclusion',
          tokenCount: 200,
        },
        platform: 'chatgpt',
      });

      expect(result.enrichedPrompt).toContain('Unique content snippet');
    });
  });

  describe('Performance', () => {
    it('should complete enrichment within latency budget', () => {
      const result = simulateHandler({
        userText: 'Test prompt for performance',
        context: validContext,
        platform: 'chatgpt',
      });

      // In test environment, this should be fast
      // Real budget is 500ms, but mocked performance.now increments by 10
      expect(result.processingTimeMs).toBeLessThan(CONTEXT_LIMITS.LATENCY_BUDGET_MS);
    });

    it('should handle large context efficiently', () => {
      const largeContext: PageContext = {
        ...validContext,
        textContent: 'A'.repeat(5000),
        tokenCount: 1500,
      };

      const result = simulateHandler({
        userText: 'Handle large context',
        context: largeContext,
        platform: 'chatgpt',
      });

      expect(result.success).toBe(true);
    });

    it('should handle minimal context', () => {
      const minimalContext: PageContext = {
        title: '',
        url: 'https://example.com',
        domain: 'example.com',
        sourceType: 'generic',
        textContent: '',
        metadata: {},
        tokenCount: 0,
      };

      const result = simulateHandler({
        userText: 'Minimal context test',
        context: minimalContext,
        platform: 'chatgpt',
      });

      expect(result.success).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should always include processingTimeMs even on error', () => {
      const result = simulateHandler({
        userText: '',
        context: validContext,
        platform: 'chatgpt',
      });

      expect(result.processingTimeMs).toBeDefined();
      expect(typeof result.processingTimeMs).toBe('number');
    });

    it('should not include enrichedPrompt on error', () => {
      const result = simulateHandler({
        context: validContext,
        platform: 'chatgpt',
      });

      expect(result.success).toBe(false);
      expect(result.enrichedPrompt).toBeUndefined();
    });
  });

  describe('Input Sanitization', () => {
    it('should handle special characters in user text', () => {
      const result = simulateHandler({
        userText: 'Test with <script>alert("xss")</script> and "quotes"',
        context: validContext,
        platform: 'chatgpt',
      });

      expect(result.success).toBe(true);
      expect(result.enrichedPrompt).toContain('alert');
    });

    it('should handle unicode characters', () => {
      const result = simulateHandler({
        userText: 'Test with 日本語 and émojis 🚀',
        context: validContext,
        platform: 'chatgpt',
      });

      expect(result.success).toBe(true);
      expect(result.enrichedPrompt).toContain('日本語');
    });

    it('should handle very long user text', () => {
      const longText = 'A'.repeat(10000);
      const result = simulateHandler({
        userText: longText,
        context: validContext,
        platform: 'chatgpt',
      });

      expect(result.success).toBe(true);
    });

    it('should handle whitespace-only trimming', () => {
      const result = simulateHandler({
        userText: '   Trimmed text   ',
        context: validContext,
        platform: 'chatgpt',
      });

      expect(result.success).toBe(true);
      expect(result.enrichedPrompt).toContain('"Trimmed text"');
    });
  });
});
