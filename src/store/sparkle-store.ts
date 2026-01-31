/**
 * Magic Sparkle - Zustand State Store
 * Lightweight reactive state management for the extension
 */

import { create } from 'zustand';
import type {
  ContextLevel,
  FABState,
  LLMPlatform,
  PageContext,
  UserIntent
} from '~/types';

interface SparkleState {
  // Platform Detection
  currentPlatform: LLMPlatform;
  isActiveInput: boolean;
  activeInputElement: HTMLElement | null;

  // FAB State
  fab: FABState;

  // Context State
  contextLevel: ContextLevel;
  pageContext: PageContext | null;
  userIntent: UserIntent | null;

  // Processing State
  isEnhancing: boolean;
  lastEnhancedPrompt: string | null;
  lastProcessingTimeMs: number;

  // Actions
  setPlatform: (platform: LLMPlatform) => void;
  setActiveInput: (element: HTMLElement | null) => void;
  setFABVisible: (visible: boolean) => void;
  setFABPosition: (x: number, y: number) => void;
  setFABProcessing: (isProcessing: boolean) => void;
  setContextLevel: (level: ContextLevel) => void;
  setPageContext: (context: PageContext | null) => void;
  setUserIntent: (text: string) => void;
  setEnhancing: (isEnhancing: boolean) => void;
  setEnhancedPrompt: (prompt: string, processingTimeMs: number) => void;
  reset: () => void;
}

const initialState = {
  currentPlatform: 'unknown' as LLMPlatform,
  isActiveInput: false,
  activeInputElement: null,
  fab: {
    visible: false,
    position: { x: 0, y: 0 },
    isProcessing: false,
    isAnimating: false
  },
  contextLevel: 'low' as ContextLevel,
  pageContext: null,
  userIntent: null,
  isEnhancing: false,
  lastEnhancedPrompt: null,
  lastProcessingTimeMs: 0
};

export const useSparkleStore = create<SparkleState>((set) => ({
  ...initialState,

  setPlatform: (platform) => set({ currentPlatform: platform }),

  setActiveInput: (element) =>
    set({
      activeInputElement: element,
      isActiveInput: element !== null
    }),

  setFABVisible: (visible) =>
    set((state) => ({
      fab: { ...state.fab, visible, isAnimating: true }
    })),

  setFABPosition: (x, y) =>
    set((state) => ({
      fab: { ...state.fab, position: { x, y } }
    })),

  setFABProcessing: (isProcessing) =>
    set((state) => ({
      fab: { ...state.fab, isProcessing }
    })),

  setContextLevel: (level) => set({ contextLevel: level }),

  setPageContext: (context) => {
    // Calculate context level based on token count
    let level: ContextLevel = 'low';
    if (context) {
      if (context.tokenCount > 500) {
        level = 'high';
      } else if (context.tokenCount > 100) {
        level = 'medium';
      }
    }
    set({ pageContext: context, contextLevel: level });
  },

  setUserIntent: (text) =>
    set({
      userIntent: {
        text,
        inputElement: null,
        timestamp: Date.now()
      }
    }),

  setEnhancing: (isEnhancing) => set({ isEnhancing }),

  setEnhancedPrompt: (prompt, processingTimeMs) =>
    set({
      lastEnhancedPrompt: prompt,
      lastProcessingTimeMs: processingTimeMs,
      isEnhancing: false
    }),

  reset: () => set(initialState)
}));

// Selector hooks for performance
export const useFABState = () => useSparkleStore((state) => state.fab);
export const useContextLevel = () => useSparkleStore((state) => state.contextLevel);
export const usePlatform = () => useSparkleStore((state) => state.currentPlatform);
export const useIsEnhancing = () => useSparkleStore((state) => state.isEnhancing);
