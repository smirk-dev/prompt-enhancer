/**
 * Context Scraper Tests
 * Tests for page context extraction utilities
 */

import {
  scrapePageContext,
  scrapeQuickContext,
  calculateContextScore,
} from '~/utils/context-scraper';
import type { PageContext } from '~/types';

// Helper to set up mock document
function setupDocument(options: {
  title?: string;
  metaTags?: Array<{ name?: string; property?: string; content: string }>;
  headings?: string[];
  codeBlocks?: string[];
  mainContent?: string[];
  selection?: string;
}) {
  // Clear body
  document.body.innerHTML = '';

  // Clear head and add meta tags
  const head = document.head;
  head.innerHTML = '';
  
  // Set title AFTER clearing head (jsdom links document.title to <title> element)
  document.title = options.title || 'Test Page';
  
  if (options.metaTags) {
    options.metaTags.forEach((meta) => {
      const tag = document.createElement('meta');
      if (meta.name) tag.setAttribute('name', meta.name);
      if (meta.property) tag.setAttribute('property', meta.property);
      tag.setAttribute('content', meta.content);
      head.appendChild(tag);
    });
  }

  // Add headings
  if (options.headings) {
    options.headings.forEach((text, i) => {
      const h = document.createElement(`h${(i % 3) + 1}`);
      h.textContent = text;
      document.body.appendChild(h);
    });
  }

  // Add code blocks
  if (options.codeBlocks) {
    options.codeBlocks.forEach((code) => {
      const pre = document.createElement('pre');
      const codeEl = document.createElement('code');
      codeEl.textContent = code;
      pre.appendChild(codeEl);
      document.body.appendChild(pre);
    });
  }

  // Add main content
  if (options.mainContent) {
    const main = document.createElement('main');
    options.mainContent.forEach((text) => {
      const p = document.createElement('p');
      p.textContent = text;
      main.appendChild(p);
    });
    document.body.appendChild(main);
  }

  // Mock selection
  if (options.selection) {
    (window.getSelection as jest.Mock).mockReturnValue({
      toString: () => options.selection,
      removeAllRanges: jest.fn(),
      addRange: jest.fn(),
    });
  }
}

describe('Context Scraper', () => {
  beforeEach(() => {
    // Reset selection mock
    (window.getSelection as jest.Mock).mockReturnValue({
      toString: () => '',
      removeAllRanges: jest.fn(),
      addRange: jest.fn(),
    });
    document.body.innerHTML = '';
    document.head.innerHTML = '';
  });

  // Note: window.location is set to https://chatgpt.com/chat via jest config
  // Tests that need different URLs should test the logic indirectly or use mocked modules

  describe('scrapePageContext', () => {
    it('should scrape basic page info', async () => {
      setupDocument({ title: 'Test Page Title' });

      const result = await scrapePageContext();

      expect(result.title).toBe('Test Page Title');
      // URL is from jest config: chatgpt.com
      expect(result.url).toBe('https://chatgpt.com/chat');
      expect(result.domain).toBe('chatgpt.com');
    });

    it('should detect source type from current URL', async () => {
      // With chatgpt.com URL, source type will be 'generic'
      setupDocument({ title: 'ChatGPT Page' });

      const result = await scrapePageContext();

      expect(result.sourceType).toBe('generic');
    });

    it('should extract meta tags', async () => {
      setupDocument({
        title: 'Page with Meta',
        metaTags: [
          { name: 'description', content: 'Page description here' },
          { name: 'keywords', content: 'test, keywords' },
          { property: 'og:title', content: 'OG Title' },
          { property: 'og:description', content: 'OG Description text' },
        ],
      });

      const result = await scrapePageContext();

      expect(result.metadata.description).toBe('Page description here');
      expect(result.metadata.keywords).toBe('test, keywords');
      expect(result.metadata['og:title']).toBe('OG Title');
      expect(result.metadata['og:description']).toBe('OG Description text');
    });

    it('should extract headings', async () => {
      setupDocument({
        title: 'Page with Headings',
        headings: ['Main Heading', 'Section One', 'Section Two'],
      });

      const result = await scrapePageContext();

      expect(result.textContent).toContain('[Heading] Main Heading');
      expect(result.textContent).toContain('[Heading] Section One');
    });

    it('should extract code blocks', async () => {
      setupDocument({
        title: 'Page with Code',
        codeBlocks: ['const x = 1;', 'function test() { return true; }'],
      });

      const result = await scrapePageContext();

      expect(result.textContent).toContain('[Code]');
      expect(result.textContent).toContain('const x = 1;');
    });

    it('should extract main content paragraphs', async () => {
      setupDocument({
        title: 'Article Page',
        mainContent: [
          'This is a paragraph with enough content to be extracted for context.',
          'Another paragraph that should also be included in the scraped content.',
        ],
      });

      const result = await scrapePageContext();

      expect(result.textContent).toContain('This is a paragraph');
    });

    it('should include selected text with priority', async () => {
      setupDocument({
        title: 'Page with Selection',
        selection: 'This is the selected text on the page',
        mainContent: ['Some paragraph content'],
      });

      const result = await scrapePageContext();

      expect(result.textContent).toContain('[Selected Text]');
      expect(result.textContent).toContain('This is the selected text');
    });

    it('should calculate token count', async () => {
      setupDocument({
        title: 'Page',
        mainContent: ['A'.repeat(100)], // 100 chars ≈ 25 tokens
      });

      const result = await scrapePageContext();

      expect(result.tokenCount).toBeGreaterThan(0);
    });

    it('should handle page with no title gracefully', async () => {
      document.title = '';
      document.body.innerHTML = '';

      const result = await scrapePageContext();

      expect(result.title).toBe('Untitled Page');
    });

    it('should truncate long metadata values', async () => {
      setupDocument({
        title: 'Page',
        metaTags: [
          { name: 'description', content: 'A'.repeat(500) },
        ],
      });

      const result = await scrapePageContext();

      expect(result.metadata.description?.length).toBeLessThanOrEqual(200);
    });
  });

  describe('scrapeQuickContext', () => {
    it('should return minimal context quickly', () => {
      document.title = 'Quick Test';

      const result = scrapeQuickContext();

      expect(result.title).toBe('Quick Test');
      // URL is from jest config
      expect(result.url).toBe('https://chatgpt.com/chat');
      expect(result.domain).toBe('chatgpt.com');
    });

    it('should handle missing title', () => {
      document.title = '';

      const result = scrapeQuickContext();

      expect(result.title).toBe('Untitled');
    });
  });

  describe('calculateContextScore', () => {
    it('should return 0 for minimal context', () => {
      const context: PageContext = {
        title: 'Untitled Page',
        url: 'https://example.com',
        domain: 'example.com',
        sourceType: 'generic',
        textContent: '',
        metadata: {},
        tokenCount: 0,
      };

      const score = calculateContextScore(context);

      expect(score).toBe(0);
    });

    it('should add points for title', () => {
      const context: PageContext = {
        title: 'Real Page Title',
        url: 'https://example.com',
        domain: 'example.com',
        sourceType: 'generic',
        textContent: '',
        metadata: {},
        tokenCount: 0,
      };

      const score = calculateContextScore(context);

      expect(score).toBeGreaterThanOrEqual(20);
    });

    it('should add points for token count', () => {
      const context: PageContext = {
        title: 'Untitled Page',
        url: 'https://example.com',
        domain: 'example.com',
        sourceType: 'generic',
        textContent: 'A'.repeat(8000), // ~2000 tokens at max
        metadata: {},
        tokenCount: 2000,
      };

      const score = calculateContextScore(context);

      expect(score).toBeGreaterThanOrEqual(40);
    });

    it('should add points for known source type', () => {
      const context: PageContext = {
        title: 'Untitled Page',
        url: 'https://github.com',
        domain: 'github.com',
        sourceType: 'github',
        textContent: '',
        metadata: {},
        tokenCount: 0,
      };

      const score = calculateContextScore(context);

      expect(score).toBe(20);
    });

    it('should add points for metadata', () => {
      const context: PageContext = {
        title: 'Untitled Page',
        url: 'https://example.com',
        domain: 'example.com',
        sourceType: 'generic',
        textContent: '',
        metadata: {
          description: 'Test',
          keywords: 'test',
          author: 'Test Author',
        },
        tokenCount: 0,
      };

      const score = calculateContextScore(context);

      expect(score).toBeGreaterThanOrEqual(12); // 3 metadata items * 4
    });

    it('should cap score at 100', () => {
      const context: PageContext = {
        title: 'Full Page Title',
        url: 'https://github.com/user/repo',
        domain: 'github.com',
        sourceType: 'github',
        textContent: 'A'.repeat(10000),
        metadata: {
          description: 'Test',
          keywords: 'test',
          author: 'Author',
          og: 'value',
          twitter: 'card',
          extra: 'data',
        },
        tokenCount: 2000,
      };

      const score = calculateContextScore(context);

      expect(score).toBeLessThanOrEqual(100);
    });

    it('should round the final score', () => {
      const context: PageContext = {
        title: 'Title',
        url: 'https://example.com',
        domain: 'example.com',
        sourceType: 'generic',
        textContent: 'Some content',
        metadata: { one: 'value' },
        tokenCount: 100,
      };

      const score = calculateContextScore(context);

      expect(Number.isInteger(score)).toBe(true);
    });
  });
});
