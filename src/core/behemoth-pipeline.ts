/**
 * Behemoth Pipeline - Multi-Agent Light Prompt Enrichment Engine
 * Transforms short user intents into comprehensive, expert-level prompts
 * Maintains strict <500ms latency budget through local processing
 */

import type {
  ExpertPersona,
  LLMPlatform,
  PageContext,
  SourceType,
  BehemothPrompt
} from '~/types';
import { CONTEXT_LIMITS } from '~/types';

// Expert Personas mapped to source types
const EXPERT_PERSONAS: Record<SourceType, ExpertPersona> = {
  github: {
    role: 'Senior Software Engineer',
    expertise: ['code review', 'software architecture', 'best practices', 'debugging'],
    thinkingStyle: 'systematic problem decomposition with edge case analysis',
    outputFormat: 'structured code with inline documentation'
  },
  arxiv: {
    role: 'Research Scientist',
    expertise: ['academic research', 'paper analysis', 'methodology critique', 'statistical rigor'],
    thinkingStyle: 'critical evaluation with citations and limitations',
    outputFormat: 'structured analysis with key findings and implications'
  },
  jira: {
    role: 'Technical Project Manager',
    expertise: ['requirements analysis', 'task breakdown', 'sprint planning', 'technical communication'],
    thinkingStyle: 'user-story driven with acceptance criteria',
    outputFormat: 'actionable items with clear deliverables'
  },
  stackoverflow: {
    role: 'Senior Developer & Technical Writer',
    expertise: ['debugging', 'solution comparison', 'code examples', 'common pitfalls'],
    thinkingStyle: 'root cause analysis with multiple solution approaches',
    outputFormat: 'clear explanation with working code examples'
  },
  docs: {
    role: 'Technical Documentation Expert',
    expertise: ['API documentation', 'tutorials', 'integration guides', 'best practices'],
    thinkingStyle: 'step-by-step guidance with practical examples',
    outputFormat: 'clear documentation with code snippets'
  },
  generic: {
    role: 'Senior Expert Consultant',
    expertise: ['analysis', 'problem-solving', 'comprehensive explanations', 'best practices'],
    thinkingStyle: 'thorough analysis considering multiple perspectives',
    outputFormat: 'well-structured response with actionable insights'
  }
};

// Platform-specific optimization hints
const PLATFORM_HINTS: Record<LLMPlatform, string> = {
  chatgpt: 'Leverage GPT\'s strength in creative problem-solving and code generation.',
  claude: 'Utilize Claude\'s attention to nuance and comprehensive reasoning.',
  gemini: 'Take advantage of Gemini\'s multimodal understanding and up-to-date knowledge.',
  unknown: ''
};

/**
 * Chain-of-Thought (CoT) wrapper template
 */
function buildCoTWrapper(userIntent: string, persona: ExpertPersona): string {
  return `
## Thinking Process

Before responding, I will:
1. Analyze the core intent and identify key requirements
2. Consider edge cases and potential ambiguities
3. Apply ${persona.thinkingStyle}
4. Structure my response for maximum clarity

## My Analysis

`.trim();
}

/**
 * Builds the expert persona preamble
 */
function buildPersonaPreamble(persona: ExpertPersona): string {
  return `You are a ${persona.role} with deep expertise in ${persona.expertise.join(', ')}. 
Your thinking style emphasizes ${persona.thinkingStyle}.
Provide responses in ${persona.outputFormat}.`;
}

/**
 * Builds context grounding section
 */
function buildContextGrounding(context: PageContext): string {
  const parts: string[] = [];

  // Always include title and URL
  parts.push(`**Reference Context:**`);
  parts.push(`- Page: "${context.title}"`);
  parts.push(`- URL: ${context.url}`);
  
  // Add source type hint
  if (context.sourceType !== 'generic') {
    parts.push(`- Source Type: ${context.sourceType.toUpperCase()}`);
  }

  // Add relevant metadata
  const relevantMeta = ['description', 'og:description', 'keywords'];
  for (const key of relevantMeta) {
    const value = context.metadata[key];
    if (value) {
      parts.push(`- ${key}: ${value.slice(0, 150)}`);
    }
  }

  // Add scraped content if available
  if (context.textContent && context.tokenCount > 50) {
    parts.push('\n**Page Content Summary:**');
    parts.push('```');
    parts.push(context.textContent.slice(0, 2000));
    parts.push('```');
  }

  return parts.join('\n');
}

/**
 * Builds the "Simulated Peer Review" framework
 * Adds self-checking instructions for better accuracy
 */
function buildPeerReviewInstructions(): string {
  return `
## Quality Assurance

After formulating your response:
- Verify accuracy of any technical claims
- Ensure code examples are syntactically correct
- Check for completeness against the original request
- Consider: "What would a peer reviewer critique?"
`.trim();
}

/**
 * Main enrichment function - transforms user intent into Behemoth prompt
 */
export function enrichPrompt(
  userText: string,
  context: PageContext,
  platform: LLMPlatform
): BehemothPrompt {
  const startTime = performance.now();

  // Select appropriate persona
  const persona = EXPERT_PERSONAS[context.sourceType];

  // Build the enriched prompt parts
  const parts: string[] = [];

  // 1. Persona Preamble
  parts.push(buildPersonaPreamble(persona));
  parts.push('');

  // 2. Context Grounding
  parts.push(buildContextGrounding(context));
  parts.push('');

  // 3. User Intent (prominently marked)
  parts.push('---');
  parts.push('## User Request');
  parts.push('');
  parts.push(`"${userText.trim()}"`);
  parts.push('');

  // 4. Chain-of-Thought Wrapper
  parts.push('---');
  parts.push(buildCoTWrapper(userText, persona));

  // 5. Platform-specific hint (subtle)
  const platformHint = PLATFORM_HINTS[platform];
  if (platformHint) {
    parts.push(`\n*Note: ${platformHint}*`);
  }

  // 6. Peer Review Instructions
  parts.push('');
  parts.push(buildPeerReviewInstructions());

  // Combine all parts
  const enrichedPrompt = parts.join('\n');

  // Calculate metrics
  const processingTimeMs = performance.now() - startTime;
  const expansionRatio = enrichedPrompt.length / Math.max(1, userText.length);

  // Log performance warning if over budget
  if (processingTimeMs > CONTEXT_LIMITS.LATENCY_BUDGET_MS * 0.8) {
    console.warn(`[Behemoth] Enrichment took ${processingTimeMs.toFixed(0)}ms (budget: ${CONTEXT_LIMITS.LATENCY_BUDGET_MS}ms)`);
  }

  return {
    original: {
      text: userText,
      inputElement: null,
      timestamp: Date.now()
    },
    enriched: enrichedPrompt,
    persona,
    context,
    expansionRatio,
    processingTimeMs
  };
}

/**
 * Quick enrichment for minimal contexts
 * Used when full context scraping is not possible
 */
export function quickEnrich(userText: string, platform: LLMPlatform): string {
  const persona = EXPERT_PERSONAS.generic;
  
  return `${buildPersonaPreamble(persona)}

## Request
"${userText.trim()}"

## Expected Response
Please provide a thorough, well-structured response. Think through the problem step-by-step before answering.`;
}

/**
 * Validates that a prompt meets quality thresholds
 */
export function validateEnrichedPrompt(prompt: BehemothPrompt): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Check expansion ratio (target: >400% = 4x)
  if (prompt.expansionRatio < 4) {
    issues.push(`Low expansion ratio: ${prompt.expansionRatio.toFixed(1)}x (target: >4x)`);
  }

  // Check processing time
  if (prompt.processingTimeMs > CONTEXT_LIMITS.LATENCY_BUDGET_MS) {
    issues.push(`Exceeded latency budget: ${prompt.processingTimeMs.toFixed(0)}ms`);
  }

  // Check enriched length
  if (prompt.enriched.length < 200) {
    issues.push('Enriched prompt too short');
  }

  return {
    valid: issues.length === 0,
    issues
  };
}
