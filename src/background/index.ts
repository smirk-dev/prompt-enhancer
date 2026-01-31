/**
 * Background Service Worker
 * Main entry point for the extension's background processes
 */

import { CONTEXT_LIMITS } from '~/types';

// Log extension startup
console.log('[MagicSparkle] Background service worker initialized');
console.log('[MagicSparkle] Latency budget:', CONTEXT_LIMITS.LATENCY_BUDGET_MS, 'ms');

// Handle extension installation/update
chrome.runtime.onInstalled.addListener((details) => {
  console.log('[MagicSparkle] Extension installed/updated:', details.reason);
  
  if (details.reason === 'install') {
    // First-time installation
    console.log('[MagicSparkle] Welcome! Magic Sparkle Prompt Engine is ready.');
  } else if (details.reason === 'update') {
    // Extension updated
    console.log('[MagicSparkle] Updated to version:', chrome.runtime.getManifest().version);
  }
});

// Keep service worker alive for better responsiveness
// This is handled automatically by Plasmo's messaging system

export {};
