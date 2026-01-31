/**
 * Behemoth Pipeline Tests
 * Tests for the multi-agent light prompt enrichment engine
 */

import {
  enrichPrompt,
  quickEnrich,
  validateEnrichedPrompt,
} from '~/core/behemoth-pipeline';
import type { PageContext, LLMPlatform, BehemothPrompt } from '~/types';

// Test fixtures
const mockPageContext: PageContext = {
  title: 'Sample GitHub Repository',
  url: 'https://github.com/user/repo',
  domain: 'github.com',
  sourceType: 'github',
  textContent: 'This is sample code content from a GitHub repository.',
  metadata: {
    description: 'A sample repository for testing',
    'og:description': 'A sample GitHub repo',
    keywords: 'testing, javascript, typescript',
  },
  tokenCount: 250,
};

const mockGenericContext: PageContext = {
  title: 'Generic Web Page',
  url: 'https://example.com/page',
  domain: 'example.com',
  sourceType: 'generic',
  textContent: 'Some generic content here.',
  metadata: {},
  tokenCount: 50,
};

const mockArxivContext: PageContext = {
  title: 'Research Paper on Machine Learning',
  url: 'https://arxiv.org/abs/1234.5678',
  domain: 'arxiv.org',
  sourceType: 'arxiv',
  textContent: 'Abstract: This paper presents novel research on ML...',
  metadata: {
    description: 'Research paper abstract',
  },
  tokenCount: 500,
};

const mockStackOverflowContext: PageContext = {
  title: 'How to fix TypeScript error - Stack Overflow',
  url: 'https://stackoverflow.com/questions/123',
  domain: 'stackoverflow.com',
  sourceType: 'stackoverflow',
  textContent: 'Question about TypeScript type errors...',
  metadata: {},
  tokenCount: 300,
};

const mockJiraContext: PageContext = {
  title: 'PROJ-123: Implement new feature',
  url: 'https://company.atlassian.net/browse/PROJ-123',
  domain: 'atlassian.net',
  sourceType: 'jira',
  textContent: 'Ticket description for implementing feature...',
  metadata: {},
  tokenCount: 200,
};

const mockDocsContext: PageContext = {
  title: 'API Documentation - Getting Started',
  url: 'https://docs.example.com/getting-started',
  domain: 'docs.example.com',
  sourceType: 'docs',
  textContent: 'Welcome to the documentation...',
  metadata: {},
  tokenCount: 400,
};

describe('Behemoth Pipeline', () => {
  describe('enrichPrompt', () => {
    it('should enrich a prompt with GitHub context', () => {
      const userText = 'How do I fix this bug?';
      const result = enrichPrompt(userText, mockPageContext, 'chatgpt');

      expect(result).toBeDefined();
      expect(result.enriched).toContain('Senior Software Engineer');
      expect(result.enriched).toContain(userText);
      expect(result.enriched).toContain('github.com');
      expect(result.persona.role).toBe('Senior Software Engineer');
    });

    it('should enrich a prompt with arxiv context', () => {
      const userText = 'Explain this paper';
      const result = enrichPrompt(userText, mockArxivContext, 'claude');

      expect(result.persona.role).toBe('Research Scientist');
      expect(result.enriched).toContain('academic research');
      expect(result.enriched).toContain('arxiv.org');
    });

    it('should enrich a prompt with StackOverflow context', () => {
      const userText = 'What is the best solution?';
      const result = enrichPrompt(userText, mockStackOverflowContext, 'gemini');

      expect(result.persona.role).toBe('Senior Developer & Technical Writer');
      expect(result.enriched).toContain('debugging');
    });

    it('should enrich a prompt with Jira context', () => {
      const userText = 'Break this down into tasks';
      const result = enrichPrompt(userText, mockJiraContext, 'chatgpt');

      expect(result.persona.role).toBe('Technical Project Manager');
      expect(result.enriched).toContain('requirements analysis');
    });

    it('should enrich a prompt with Docs context', () => {
      const userText = 'How do I use this API?';
      const result = enrichPrompt(userText, mockDocsContext, 'claude');

      expect(result.persona.role).toBe('Technical Documentation Expert');
      expect(result.enriched).toContain('API documentation');
    });

    it('should enrich a prompt with generic context', () => {
      const userText = 'Help me with this';
      const result = enrichPrompt(userText, mockGenericContext, 'unknown');

      expect(result.persona.role).toBe('Senior Expert Consultant');
      expect(result.enriched).toContain('analysis');
    });

    it('should include platform-specific hints for ChatGPT', () => {
      const userText = 'Generate code';
      const result = enrichPrompt(userText, mockPageContext, 'chatgpt');

      expect(result.enriched).toContain('GPT');
      expect(result.enriched).toContain('creative problem-solving');
    });

    it('should include platform-specific hints for Claude', () => {
      const userText = 'Analyze this';
      const result = enrichPrompt(userText, mockPageContext, 'claude');

      expect(result.enriched).toContain('Claude');
      expect(result.enriched).toContain('nuance');
    });

    it('should include platform-specific hints for Gemini', () => {
      const userText = 'Research this';
      const result = enrichPrompt(userText, mockPageContext, 'gemini');

      expect(result.enriched).toContain('Gemini');
      expect(result.enriched).toContain('multimodal');
    });

    it('should not include platform hints for unknown platform', () => {
      const userText = 'Help me';
      const result = enrichPrompt(userText, mockPageContext, 'unknown');

      expect(result.enriched).not.toContain('GPT');
      expect(result.enriched).not.toContain('Claude');
      expect(result.enriched).not.toContain('Gemini');
    });

    it('should include the user request section', () => {
      const userText = 'My specific question here';
      const result = enrichPrompt(userText, mockPageContext, 'chatgpt');

      expect(result.enriched).toContain('## User Request');
      expect(result.enriched).toContain(userText);
    });

    it('should include Chain-of-Thought wrapper', () => {
      const userText = 'Solve this problem';
      const result = enrichPrompt(userText, mockPageContext, 'chatgpt');

      expect(result.enriched).toContain('## Thinking Process');
      expect(result.enriched).toContain('Before responding');
    });

    it('should include peer review instructions', () => {
      const userText = 'Write code for this';
      const result = enrichPrompt(userText, mockPageContext, 'chatgpt');

      expect(result.enriched).toContain('## Quality Assurance');
      expect(result.enriched).toContain('peer reviewer');
    });

    it('should include context grounding with page title and URL', () => {
      const userText = 'Help me understand';
      const result = enrichPrompt(userText, mockPageContext, 'chatgpt');

      expect(result.enriched).toContain('Reference Context');
      expect(result.enriched).toContain(mockPageContext.title);
      expect(result.enriched).toContain(mockPageContext.url);
    });

    it('should include metadata in context grounding', () => {
      const userText = 'Analyze this';
      const result = enrichPrompt(userText, mockPageContext, 'chatgpt');

      expect(result.enriched).toContain('description');
    });

    it('should include text content summary when available', () => {
      const userText = 'Help with this';
      const result = enrichPrompt(userText, mockPageContext, 'chatgpt');

      expect(result.enriched).toContain('Page Content Summary');
    });

    it('should calculate expansion ratio correctly', () => {
      const userText = 'Short query';
      const result = enrichPrompt(userText, mockPageContext, 'chatgpt');

      expect(result.expansionRatio).toBeGreaterThan(1);
      expect(result.expansionRatio).toBe(result.enriched.length / userText.length);
    });

    it('should track processing time', () => {
      const userText = 'Test prompt';
      const result = enrichPrompt(userText, mockPageContext, 'chatgpt');

      expect(result.processingTimeMs).toBeGreaterThanOrEqual(0);
      expect(typeof result.processingTimeMs).toBe('number');
    });

    it('should preserve original user text', () => {
      const userText = 'My original question with special chars: @#$%';
      const result = enrichPrompt(userText, mockPageContext, 'chatgpt');

      expect(result.original.text).toBe(userText);
      expect(result.original.timestamp).toBeGreaterThan(0);
    });

    it('should trim user text in the enriched prompt', () => {
      const userText = '   Spaces around text   ';
      const result = enrichPrompt(userText, mockPageContext, 'chatgpt');

      expect(result.enriched).toContain('"Spaces around text"');
    });

    it('should handle empty text content gracefully', () => {
      const contextWithNoContent: PageContext = {
        ...mockPageContext,
        textContent: '',
        tokenCount: 0,
      };
      const userText = 'Help me';
      const result = enrichPrompt(userText, contextWithNoContent, 'chatgpt');

      expect(result).toBeDefined();
      expect(result.enriched.length).toBeGreaterThan(0);
    });

    it('should show source type for known sources', () => {
      const userText = 'Analyze';
      const result = enrichPrompt(userText, mockPageContext, 'chatgpt');

      expect(result.enriched).toContain('GITHUB');
    });
  });

  describe('quickEnrich', () => {
    it('should return a simplified enriched prompt', () => {
      const userText = 'Quick question';
      const result = quickEnrich(userText, 'chatgpt');

      expect(result).toContain('Senior Expert Consultant');
      expect(result).toContain(userText);
      expect(result).toContain('## Request');
    });

    it('should include step-by-step thinking instruction', () => {
      const userText = 'Help me';
      const result = quickEnrich(userText, 'claude');

      expect(result).toContain('step-by-step');
    });

    it('should use generic persona for all platforms', () => {
      const userText = 'Test';
      const chatgptResult = quickEnrich(userText, 'chatgpt');
      const claudeResult = quickEnrich(userText, 'claude');
      const geminiResult = quickEnrich(userText, 'gemini');

      expect(chatgptResult).toContain('Senior Expert Consultant');
      expect(claudeResult).toContain('Senior Expert Consultant');
      expect(geminiResult).toContain('Senior Expert Consultant');
    });

    it('should trim user text', () => {
      const userText = '   Padded text   ';
      const result = quickEnrich(userText, 'chatgpt');

      expect(result).toContain('"Padded text"');
    });
  });

  describe('validateEnrichedPrompt', () => {
    it('should validate a good prompt as valid', () => {
      const goodPrompt: BehemothPrompt = {
        original: {
          text: 'Short',
          inputElement: null,
          timestamp: Date.now(),
        },
        enriched: 'A'.repeat(500), // Long enough
        persona: {
          role: 'Expert',
          expertise: ['testing'],
          thinkingStyle: 'analytical',
          outputFormat: 'structured',
        },
        context: mockPageContext,
        expansionRatio: 10,
        processingTimeMs: 100,
      };

      const result = validateEnrichedPrompt(goodPrompt);

      expect(result.valid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it('should flag low expansion ratio', () => {
      const badPrompt: BehemothPrompt = {
        original: {
          text: 'Short',
          inputElement: null,
          timestamp: Date.now(),
        },
        enriched: 'Short response',
        persona: {
          role: 'Expert',
          expertise: ['testing'],
          thinkingStyle: 'analytical',
          outputFormat: 'structured',
        },
        context: mockPageContext,
        expansionRatio: 2, // Below 4x threshold
        processingTimeMs: 100,
      };

      const result = validateEnrichedPrompt(badPrompt);

      expect(result.valid).toBe(false);
      expect(result.issues.some((i) => i.includes('expansion ratio'))).toBe(true);
    });

    it('should flag exceeded latency budget', () => {
      const slowPrompt: BehemothPrompt = {
        original: {
          text: 'Test',
          inputElement: null,
          timestamp: Date.now(),
        },
        enriched: 'A'.repeat(500),
        persona: {
          role: 'Expert',
          expertise: ['testing'],
          thinkingStyle: 'analytical',
          outputFormat: 'structured',
        },
        context: mockPageContext,
        expansionRatio: 10,
        processingTimeMs: 600, // Over 500ms budget
      };

      const result = validateEnrichedPrompt(slowPrompt);

      expect(result.valid).toBe(false);
      expect(result.issues.some((i) => i.includes('latency'))).toBe(true);
    });

    it('should flag too short enriched prompt', () => {
      const shortPrompt: BehemothPrompt = {
        original: {
          text: 'Test',
          inputElement: null,
          timestamp: Date.now(),
        },
        enriched: 'Too short',
        persona: {
          role: 'Expert',
          expertise: ['testing'],
          thinkingStyle: 'analytical',
          outputFormat: 'structured',
        },
        context: mockPageContext,
        expansionRatio: 10,
        processingTimeMs: 100,
      };

      const result = validateEnrichedPrompt(shortPrompt);

      expect(result.valid).toBe(false);
      expect(result.issues.some((i) => i.includes('too short'))).toBe(true);
    });

    it('should collect multiple issues', () => {
      const badPrompt: BehemothPrompt = {
        original: {
          text: 'Test',
          inputElement: null,
          timestamp: Date.now(),
        },
        enriched: 'Short',
        persona: {
          role: 'Expert',
          expertise: ['testing'],
          thinkingStyle: 'analytical',
          outputFormat: 'structured',
        },
        context: mockPageContext,
        expansionRatio: 1,
        processingTimeMs: 1000,
      };

      const result = validateEnrichedPrompt(badPrompt);

      expect(result.valid).toBe(false);
      expect(result.issues.length).toBeGreaterThan(1);
    });
  });
});
