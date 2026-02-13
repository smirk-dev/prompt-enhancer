/**
 * Plasmo Background Message Handler
 * Handles prompt enhancement requests from content scripts
 * Runs in the service worker context
 */

import type { PlasmoMessaging } from '@plasmohq/messaging';
import type {
  PageContext,
  LLMPlatform
} from '~/types';
import { enrichPrompt } from '~/core/behemoth-pipeline';
import { CONTEXT_LIMITS } from '~/types';

export type RequestBody = {
  userText: string;
  context: PageContext;
  platform: LLMPlatform;
};

export type ResponseBody = {
  success: boolean;
  enrichedPrompt?: string;
  error?: string;
  processingTimeMs: number;
};

const handler: PlasmoMessaging.MessageHandler<RequestBody, ResponseBody> = async (req, res) => {
  const startTime = performance.now();

  try {
    const { userText, context, platform } = req.body ?? {};

    // Validate required fields
    if (!userText || typeof userText !== 'string') {
      return res.send({
        success: false,
        error: 'Missing or invalid user text',
        processingTimeMs: performance.now() - startTime
      });
    }

    if (!context) {
      return res.send({
        success: false,
        error: 'Missing page context',
        processingTimeMs: performance.now() - startTime
      });
    }

    // Run the Behemoth Pipeline
    const result = enrichPrompt(userText, context, platform ?? 'unknown');

    const processingTimeMs = performance.now() - startTime;

    // Log performance metrics
    console.log('[MagicSparkle] Enrichment completed:', {
      originalLength: userText.length,
      enrichedLength: result.enriched.length,
      expansionRatio: result.expansionRatio.toFixed(1),
      processingTimeMs: processingTimeMs.toFixed(0),
      withinBudget: processingTimeMs < CONTEXT_LIMITS.LATENCY_BUDGET_MS
    });

    return res.send({
      success: true,
      enrichedPrompt: result.enriched,
      processingTimeMs
    });

  } catch (error) {
    console.error('[MagicSparkle] Enhancement error:', error);
    
    return res.send({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      processingTimeMs: performance.now() - startTime
    });
  }
};

export default handler;
