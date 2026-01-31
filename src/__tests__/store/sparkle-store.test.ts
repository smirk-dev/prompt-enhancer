/**
 * Sparkle Store Tests
 * Tests for Zustand state management store
 */

import { act, renderHook } from '@testing-library/react';
import {
  useSparkleStore,
  useFABState,
  useContextLevel,
  usePlatform,
  useIsEnhancing,
} from '~/store/sparkle-store';
import type { PageContext, ContextLevel } from '~/types';

// Reset store between tests
beforeEach(() => {
  const { result } = renderHook(() => useSparkleStore());
  act(() => {
    result.current.reset();
  });
});

describe('Sparkle Store', () => {
  describe('Initial State', () => {
    it('should have correct initial platform', () => {
      const { result } = renderHook(() => useSparkleStore());

      expect(result.current.currentPlatform).toBe('unknown');
    });

    it('should have no active input initially', () => {
      const { result } = renderHook(() => useSparkleStore());

      expect(result.current.isActiveInput).toBe(false);
      expect(result.current.activeInputElement).toBeNull();
    });

    it('should have FAB hidden initially', () => {
      const { result } = renderHook(() => useSparkleStore());

      expect(result.current.fab.visible).toBe(false);
      expect(result.current.fab.isProcessing).toBe(false);
      expect(result.current.fab.position).toEqual({ x: 0, y: 0 });
    });

    it('should have low context level initially', () => {
      const { result } = renderHook(() => useSparkleStore());

      expect(result.current.contextLevel).toBe('low');
    });

    it('should have no page context initially', () => {
      const { result } = renderHook(() => useSparkleStore());

      expect(result.current.pageContext).toBeNull();
    });

    it('should not be enhancing initially', () => {
      const { result } = renderHook(() => useSparkleStore());

      expect(result.current.isEnhancing).toBe(false);
    });
  });

  describe('setPlatform', () => {
    it('should update current platform', () => {
      const { result } = renderHook(() => useSparkleStore());

      act(() => {
        result.current.setPlatform('chatgpt');
      });

      expect(result.current.currentPlatform).toBe('chatgpt');
    });

    it('should allow setting all platform types', () => {
      const { result } = renderHook(() => useSparkleStore());
      const platforms = ['chatgpt', 'claude', 'gemini', 'unknown'] as const;

      platforms.forEach((platform) => {
        act(() => {
          result.current.setPlatform(platform);
        });
        expect(result.current.currentPlatform).toBe(platform);
      });
    });
  });

  describe('setActiveInput', () => {
    it('should set active input element', () => {
      const { result } = renderHook(() => useSparkleStore());
      const mockElement = document.createElement('textarea');

      act(() => {
        result.current.setActiveInput(mockElement);
      });

      expect(result.current.activeInputElement).toBe(mockElement);
      expect(result.current.isActiveInput).toBe(true);
    });

    it('should clear active input when set to null', () => {
      const { result } = renderHook(() => useSparkleStore());
      const mockElement = document.createElement('textarea');

      act(() => {
        result.current.setActiveInput(mockElement);
      });

      act(() => {
        result.current.setActiveInput(null);
      });

      expect(result.current.activeInputElement).toBeNull();
      expect(result.current.isActiveInput).toBe(false);
    });
  });

  describe('FAB State Actions', () => {
    it('should show FAB', () => {
      const { result } = renderHook(() => useSparkleStore());

      act(() => {
        result.current.setFABVisible(true);
      });

      expect(result.current.fab.visible).toBe(true);
      expect(result.current.fab.isAnimating).toBe(true);
    });

    it('should hide FAB', () => {
      const { result } = renderHook(() => useSparkleStore());

      act(() => {
        result.current.setFABVisible(true);
      });

      act(() => {
        result.current.setFABVisible(false);
      });

      expect(result.current.fab.visible).toBe(false);
    });

    it('should update FAB position', () => {
      const { result } = renderHook(() => useSparkleStore());

      act(() => {
        result.current.setFABPosition(100, 200);
      });

      expect(result.current.fab.position).toEqual({ x: 100, y: 200 });
    });

    it('should set FAB processing state', () => {
      const { result } = renderHook(() => useSparkleStore());

      act(() => {
        result.current.setFABProcessing(true);
      });

      expect(result.current.fab.isProcessing).toBe(true);

      act(() => {
        result.current.setFABProcessing(false);
      });

      expect(result.current.fab.isProcessing).toBe(false);
    });
  });

  describe('setContextLevel', () => {
    it('should update context level', () => {
      const { result } = renderHook(() => useSparkleStore());

      act(() => {
        result.current.setContextLevel('high');
      });

      expect(result.current.contextLevel).toBe('high');
    });

    it('should allow all context levels', () => {
      const { result } = renderHook(() => useSparkleStore());
      const levels: ContextLevel[] = ['low', 'medium', 'high'];

      levels.forEach((level) => {
        act(() => {
          result.current.setContextLevel(level);
        });
        expect(result.current.contextLevel).toBe(level);
      });
    });
  });

  describe('setPageContext', () => {
    const mockContext: PageContext = {
      title: 'Test Page',
      url: 'https://example.com',
      domain: 'example.com',
      sourceType: 'github',
      textContent: 'Content here',
      metadata: {},
      tokenCount: 600, // High context
    };

    it('should set page context', () => {
      const { result } = renderHook(() => useSparkleStore());

      act(() => {
        result.current.setPageContext(mockContext);
      });

      expect(result.current.pageContext).toEqual(mockContext);
    });

    it('should set context level to high for token count > 500', () => {
      const { result } = renderHook(() => useSparkleStore());

      act(() => {
        result.current.setPageContext({ ...mockContext, tokenCount: 600 });
      });

      expect(result.current.contextLevel).toBe('high');
    });

    it('should set context level to medium for token count 100-500', () => {
      const { result } = renderHook(() => useSparkleStore());

      act(() => {
        result.current.setPageContext({ ...mockContext, tokenCount: 250 });
      });

      expect(result.current.contextLevel).toBe('medium');
    });

    it('should set context level to low for token count < 100', () => {
      const { result } = renderHook(() => useSparkleStore());

      act(() => {
        result.current.setPageContext({ ...mockContext, tokenCount: 50 });
      });

      expect(result.current.contextLevel).toBe('low');
    });

    it('should handle null context', () => {
      const { result } = renderHook(() => useSparkleStore());

      act(() => {
        result.current.setPageContext(mockContext);
      });

      act(() => {
        result.current.setPageContext(null);
      });

      expect(result.current.pageContext).toBeNull();
      expect(result.current.contextLevel).toBe('low');
    });
  });

  describe('setUserIntent', () => {
    it('should set user intent with timestamp', () => {
      const { result } = renderHook(() => useSparkleStore());

      act(() => {
        result.current.setUserIntent('My question');
      });

      expect(result.current.userIntent?.text).toBe('My question');
      expect(result.current.userIntent?.timestamp).toBeGreaterThan(0);
      expect(result.current.userIntent?.inputElement).toBeNull();
    });

    it('should update user intent', () => {
      const { result } = renderHook(() => useSparkleStore());

      act(() => {
        result.current.setUserIntent('First question');
      });

      act(() => {
        result.current.setUserIntent('Updated question');
      });

      expect(result.current.userIntent?.text).toBe('Updated question');
    });
  });

  describe('setEnhancing', () => {
    it('should set enhancing state to true', () => {
      const { result } = renderHook(() => useSparkleStore());

      act(() => {
        result.current.setEnhancing(true);
      });

      expect(result.current.isEnhancing).toBe(true);
    });

    it('should set enhancing state to false', () => {
      const { result } = renderHook(() => useSparkleStore());

      act(() => {
        result.current.setEnhancing(true);
      });

      act(() => {
        result.current.setEnhancing(false);
      });

      expect(result.current.isEnhancing).toBe(false);
    });
  });

  describe('setEnhancedPrompt', () => {
    it('should set enhanced prompt and processing time', () => {
      const { result } = renderHook(() => useSparkleStore());

      act(() => {
        result.current.setEnhancedPrompt('Enhanced prompt text', 150);
      });

      expect(result.current.lastEnhancedPrompt).toBe('Enhanced prompt text');
      expect(result.current.lastProcessingTimeMs).toBe(150);
    });

    it('should set isEnhancing to false', () => {
      const { result } = renderHook(() => useSparkleStore());

      act(() => {
        result.current.setEnhancing(true);
      });

      act(() => {
        result.current.setEnhancedPrompt('Prompt', 100);
      });

      expect(result.current.isEnhancing).toBe(false);
    });
  });

  describe('reset', () => {
    it('should reset all state to initial values', () => {
      const { result } = renderHook(() => useSparkleStore());
      const mockElement = document.createElement('textarea');

      // Set various state
      act(() => {
        result.current.setPlatform('chatgpt');
        result.current.setActiveInput(mockElement);
        result.current.setFABVisible(true);
        result.current.setContextLevel('high');
        result.current.setEnhancing(true);
        result.current.setEnhancedPrompt('Prompt', 200);
      });

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.currentPlatform).toBe('unknown');
      expect(result.current.isActiveInput).toBe(false);
      expect(result.current.activeInputElement).toBeNull();
      expect(result.current.fab.visible).toBe(false);
      expect(result.current.contextLevel).toBe('low');
      expect(result.current.isEnhancing).toBe(false);
    });
  });

  describe('Selector Hooks', () => {
    it('useFABState should return FAB state', () => {
      const { result: storeResult } = renderHook(() => useSparkleStore());
      const { result: fabResult } = renderHook(() => useFABState());

      act(() => {
        storeResult.current.setFABVisible(true);
        storeResult.current.setFABPosition(50, 75);
      });

      expect(fabResult.current.visible).toBe(true);
      expect(fabResult.current.position).toEqual({ x: 50, y: 75 });
    });

    it('useContextLevel should return context level', () => {
      const { result: storeResult } = renderHook(() => useSparkleStore());
      const { result: levelResult } = renderHook(() => useContextLevel());

      act(() => {
        storeResult.current.setContextLevel('medium');
      });

      expect(levelResult.current).toBe('medium');
    });

    it('usePlatform should return current platform', () => {
      const { result: storeResult } = renderHook(() => useSparkleStore());
      const { result: platformResult } = renderHook(() => usePlatform());

      act(() => {
        storeResult.current.setPlatform('claude');
      });

      expect(platformResult.current).toBe('claude');
    });

    it('useIsEnhancing should return enhancing state', () => {
      const { result: storeResult } = renderHook(() => useSparkleStore());
      const { result: enhancingResult } = renderHook(() => useIsEnhancing());

      act(() => {
        storeResult.current.setEnhancing(true);
      });

      expect(enhancingResult.current).toBe(true);
    });
  });
});
