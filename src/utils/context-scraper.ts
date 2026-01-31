/**
 * Context Scraper Utility
 * Extracts page context for prompt enrichment within the <500ms latency budget
 */

import {
  type PageContext,
  type SourceType,
  CONTEXT_LIMITS
} from '~/types';

// Source type patterns for domain detection
const SOURCE_PATTERNS: Array<{ pattern: RegExp; type: SourceType }> = [
  { pattern: /github\.com/, type: 'github' },
  { pattern: /arxiv\.org/, type: 'arxiv' },
  { pattern: /jira|atlassian/, type: 'jira' },
  { pattern: /stackoverflow\.com|stackexchange\.com/, type: 'stackoverflow' },
  { pattern: /docs\.|documentation|readme/i, type: 'docs' }
];

/**
 * Estimates token count from text (rough approximation: ~4 chars per token)
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Truncates text to fit within token budget
 */
function truncateToTokenBudget(text: string, maxTokens: number): string {
  const maxChars = maxTokens * 4;
  if (text.length <= maxChars) return text;
  
  // Truncate and add indicator
  return text.slice(0, maxChars - 20) + '\n[...truncated...]';
}

/**
 * Detects the source type based on the URL
 */
function detectSourceType(url: string): SourceType {
  for (const { pattern, type } of SOURCE_PATTERNS) {
    if (pattern.test(url)) {
      return type;
    }
  }
  return 'generic';
}

/**
 * Extracts metadata from the page
 */
function extractMetadata(): Record<string, string> {
  const metadata: Record<string, string> = {};

  // Standard meta tags
  const metaTags = document.querySelectorAll('meta[name], meta[property]');
  metaTags.forEach((tag) => {
    const name = tag.getAttribute('name') || tag.getAttribute('property');
    const content = tag.getAttribute('content');
    if (name && content) {
      metadata[name] = content.slice(0, 200); // Limit metadata length
    }
  });

  // Open Graph / Twitter card data
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');
  
  if (ogTitle?.getAttribute('content')) {
    metadata['og:title'] = ogTitle.getAttribute('content')!;
  }
  if (ogDescription?.getAttribute('content')) {
    metadata['og:description'] = ogDescription.getAttribute('content')!.slice(0, 300);
  }

  return metadata;
}

/**
 * Extracts high-priority text content from the page
 * Prioritizes: headings, code blocks, main content areas
 */
function extractTextContent(maxTokens: number): string {
  const contentParts: string[] = [];
  let currentTokens = 0;

  // Priority 1: Main headings
  const headings = document.querySelectorAll('h1, h2, h3');
  headings.forEach((h) => {
    const text = h.textContent?.trim();
    if (text && currentTokens < maxTokens) {
      const tokens = estimateTokens(text);
      if (currentTokens + tokens <= maxTokens) {
        contentParts.push(`[Heading] ${text}`);
        currentTokens += tokens;
      }
    }
  });

  // Priority 2: Code blocks (especially for GitHub, StackOverflow)
  const codeBlocks = document.querySelectorAll('pre code, .highlight, .code-block');
  codeBlocks.forEach((code) => {
    const text = code.textContent?.trim();
    if (text && currentTokens < maxTokens) {
      const truncated = truncateToTokenBudget(text, Math.min(500, maxTokens - currentTokens));
      const tokens = estimateTokens(truncated);
      if (currentTokens + tokens <= maxTokens) {
        contentParts.push(`[Code]\n${truncated}`);
        currentTokens += tokens;
      }
    }
  });

  // Priority 3: Main content (article, main, or first significant paragraph)
  const mainContent = document.querySelector('article, main, [role="main"], .content, #content');
  if (mainContent && currentTokens < maxTokens) {
    const paragraphs = mainContent.querySelectorAll('p');
    paragraphs.forEach((p) => {
      const text = p.textContent?.trim();
      if (text && text.length > 50 && currentTokens < maxTokens) {
        const tokens = estimateTokens(text);
        if (currentTokens + tokens <= maxTokens) {
          contentParts.push(text);
          currentTokens += tokens;
        }
      }
    });
  }

  // Priority 4: Selected text (if any)
  const selection = window.getSelection()?.toString().trim();
  if (selection && selection.length > 10) {
    const truncated = truncateToTokenBudget(selection, Math.min(300, maxTokens));
    contentParts.unshift(`[Selected Text] ${truncated}`);
  }

  return contentParts.join('\n\n');
}

/**
 * Main context scraping function
 * Optimized for <500ms execution
 */
export async function scrapePageContext(): Promise<PageContext> {
  const startTime = performance.now();

  const url = window.location.href;
  const domain = window.location.hostname;
  const title = document.title || 'Untitled Page';
  const sourceType = detectSourceType(url);

  // Extract content with token budget
  const textContent = extractTextContent(CONTEXT_LIMITS.MAX_TOKENS);
  const metadata = extractMetadata();
  const tokenCount = estimateTokens(textContent);

  const processingTime = performance.now() - startTime;
  
  // Log performance for debugging
  if (processingTime > CONTEXT_LIMITS.LATENCY_BUDGET_MS * 0.5) {
    console.warn(`[MagicSparkle] Context scraping took ${processingTime.toFixed(0)}ms`);
  }

  return {
    title,
    url,
    domain,
    sourceType,
    textContent,
    metadata,
    tokenCount
  };
}

/**
 * Quick context scrape - minimal version for immediate feedback
 * Used for instant heatmap updates
 */
export function scrapeQuickContext(): Pick<PageContext, 'title' | 'url' | 'domain' | 'sourceType'> {
  return {
    title: document.title || 'Untitled',
    url: window.location.href,
    domain: window.location.hostname,
    sourceType: detectSourceType(window.location.href)
  };
}

/**
 * Calculates context readiness score (0-100)
 */
export function calculateContextScore(context: PageContext): number {
  let score = 0;

  // Title present: +20
  if (context.title && context.title !== 'Untitled Page') score += 20;

  // Token count scoring: up to 40 points
  score += Math.min(40, (context.tokenCount / CONTEXT_LIMITS.MAX_TOKENS) * 40);

  // Source type bonus: +20 for known sources
  if (context.sourceType !== 'generic') score += 20;

  // Metadata present: +20
  const metadataCount = Object.keys(context.metadata).length;
  score += Math.min(20, metadataCount * 4);

  return Math.min(100, Math.round(score));
}
