/**
 * Context Heatmap Tests
 * Tests for visual heatmap effect management
 */

// Note: We need to reset modules for each test because the module has a mutable 
// `stylesInjected` flag that persists between tests
const HEATMAP_CLASS = 'magic-sparkle-heatmap';

describe('Context Heatmap', () => {
  let testElement: HTMLElement;
  let applyHeatmap: any;
  let updateHeatmapLevel: any;
  let removeHeatmap: any;
  let triggerPulseAnimation: any;
  let getHeatmapColor: any;
  let createHeatmapManager: any;

  beforeEach(async () => {
    // Reset module cache to clear the stylesInjected flag
    jest.resetModules();
    
    // Re-import the module
    const module = await import('~/components/ContextHeatmap');
    applyHeatmap = module.applyHeatmap;
    updateHeatmapLevel = module.updateHeatmapLevel;
    removeHeatmap = module.removeHeatmap;
    triggerPulseAnimation = module.triggerPulseAnimation;
    getHeatmapColor = module.getHeatmapColor;
    createHeatmapManager = module.createHeatmapManager;
    
    testElement = document.createElement('div');
    document.body.appendChild(testElement);
    
    // Clear any existing styles
    const existingStyle = document.getElementById('magic-sparkle-heatmap-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
  });

  afterEach(() => {
    document.body.innerHTML = '';
    document.head.innerHTML = '';
  });

  describe('applyHeatmap', () => {
    it('should add base heatmap class', () => {
      applyHeatmap(testElement, 'low');

      expect(testElement.classList.contains(HEATMAP_CLASS)).toBe(true);
    });

    it('should add level-specific class for low', () => {
      applyHeatmap(testElement, 'low');

      expect(testElement.classList.contains(`${HEATMAP_CLASS}-low`)).toBe(true);
    });

    it('should add level-specific class for medium', () => {
      applyHeatmap(testElement, 'medium');

      expect(testElement.classList.contains(`${HEATMAP_CLASS}-medium`)).toBe(true);
    });

    it('should add level-specific class for high', () => {
      applyHeatmap(testElement, 'high');

      expect(testElement.classList.contains(`${HEATMAP_CLASS}-high`)).toBe(true);
    });

    it('should inject styles into document head', () => {
      applyHeatmap(testElement, 'low');

      const styleElement = document.getElementById('magic-sparkle-heatmap-styles');
      expect(styleElement).not.toBeNull();
      expect(styleElement?.tagName).toBe('STYLE');
    });

    it('should only inject styles once', () => {
      applyHeatmap(testElement, 'low');
      
      const secondElement = document.createElement('div');
      document.body.appendChild(secondElement);
      applyHeatmap(secondElement, 'high');

      const styleElements = document.querySelectorAll('#magic-sparkle-heatmap-styles');
      expect(styleElements.length).toBe(1);
    });

    it('should remove existing heatmap classes before applying new ones', () => {
      applyHeatmap(testElement, 'low');
      applyHeatmap(testElement, 'high');

      expect(testElement.classList.contains(`${HEATMAP_CLASS}-low`)).toBe(false);
      expect(testElement.classList.contains(`${HEATMAP_CLASS}-high`)).toBe(true);
    });

    it('should include keyframe animations in injected styles', () => {
      applyHeatmap(testElement, 'low');

      const styleElement = document.getElementById('magic-sparkle-heatmap-styles');
      expect(styleElement?.textContent).toContain('@keyframes');
      expect(styleElement?.textContent).toContain('magic-sparkle-breathe');
    });
  });

  describe('updateHeatmapLevel', () => {
    it('should update level when heatmap already applied', () => {
      applyHeatmap(testElement, 'low');
      updateHeatmapLevel(testElement, 'medium');

      expect(testElement.classList.contains(`${HEATMAP_CLASS}-low`)).toBe(false);
      expect(testElement.classList.contains(`${HEATMAP_CLASS}-medium`)).toBe(true);
    });

    it('should apply heatmap if not already present', () => {
      updateHeatmapLevel(testElement, 'high');

      expect(testElement.classList.contains(HEATMAP_CLASS)).toBe(true);
      expect(testElement.classList.contains(`${HEATMAP_CLASS}-high`)).toBe(true);
    });

    it('should handle transition from any level to any other level', () => {
      const levels: ContextLevel[] = ['low', 'medium', 'high'];

      levels.forEach((fromLevel) => {
        levels.forEach((toLevel) => {
          applyHeatmap(testElement, fromLevel);
          updateHeatmapLevel(testElement, toLevel);

          expect(testElement.classList.contains(`${HEATMAP_CLASS}-${toLevel}`)).toBe(true);
          if (fromLevel !== toLevel) {
            expect(testElement.classList.contains(`${HEATMAP_CLASS}-${fromLevel}`)).toBe(false);
          }
        });
      });
    });

    it('should preserve base class when updating level', () => {
      applyHeatmap(testElement, 'low');
      updateHeatmapLevel(testElement, 'high');

      expect(testElement.classList.contains(HEATMAP_CLASS)).toBe(true);
    });
  });

  describe('removeHeatmap', () => {
    it('should remove base heatmap class', () => {
      applyHeatmap(testElement, 'low');
      removeHeatmap(testElement);

      expect(testElement.classList.contains(HEATMAP_CLASS)).toBe(false);
    });

    it('should remove all level classes', () => {
      applyHeatmap(testElement, 'high');
      removeHeatmap(testElement);

      expect(testElement.classList.contains(`${HEATMAP_CLASS}-low`)).toBe(false);
      expect(testElement.classList.contains(`${HEATMAP_CLASS}-medium`)).toBe(false);
      expect(testElement.classList.contains(`${HEATMAP_CLASS}-high`)).toBe(false);
    });

    it('should remove pulse class', () => {
      applyHeatmap(testElement, 'high');
      testElement.classList.add(`${HEATMAP_CLASS}-pulse`);
      removeHeatmap(testElement);

      expect(testElement.classList.contains(`${HEATMAP_CLASS}-pulse`)).toBe(false);
    });

    it('should handle element without heatmap gracefully', () => {
      expect(() => removeHeatmap(testElement)).not.toThrow();
    });

    it('should preserve non-heatmap classes', () => {
      testElement.classList.add('custom-class', 'another-class');
      applyHeatmap(testElement, 'low');
      removeHeatmap(testElement);

      expect(testElement.classList.contains('custom-class')).toBe(true);
      expect(testElement.classList.contains('another-class')).toBe(true);
    });
  });

  describe('triggerPulseAnimation', () => {
    it('should add pulse class', () => {
      triggerPulseAnimation(testElement);

      expect(testElement.classList.contains(`${HEATMAP_CLASS}-pulse`)).toBe(true);
    });

    it('should remove pulse class after animation duration', () => {
      jest.useFakeTimers();

      triggerPulseAnimation(testElement);

      expect(testElement.classList.contains(`${HEATMAP_CLASS}-pulse`)).toBe(true);

      jest.advanceTimersByTime(400);

      expect(testElement.classList.contains(`${HEATMAP_CLASS}-pulse`)).toBe(false);

      jest.useRealTimers();
    });

    it('should work on element with existing heatmap', () => {
      jest.useFakeTimers();

      applyHeatmap(testElement, 'high');
      triggerPulseAnimation(testElement);

      expect(testElement.classList.contains(`${HEATMAP_CLASS}-pulse`)).toBe(true);
      expect(testElement.classList.contains(`${HEATMAP_CLASS}-high`)).toBe(true);

      jest.advanceTimersByTime(400);

      expect(testElement.classList.contains(`${HEATMAP_CLASS}-pulse`)).toBe(false);
      expect(testElement.classList.contains(`${HEATMAP_CLASS}-high`)).toBe(true);

      jest.useRealTimers();
    });
  });

  describe('getHeatmapColor', () => {
    it('should return correct color for low level', () => {
      const color = getHeatmapColor('low');

      expect(color).toBe('#FF4444');
    });

    it('should return correct color for medium level', () => {
      const color = getHeatmapColor('medium');

      expect(color).toBe('#4488FF');
    });

    it('should return correct color for high level', () => {
      const color = getHeatmapColor('high');

      expect(color).toBe('#FFD700');
    });
  });

  describe('createHeatmapManager', () => {
    it('should create a manager object', () => {
      const manager = createHeatmapManager(testElement);

      expect(manager).toHaveProperty('apply');
      expect(manager).toHaveProperty('update');
      expect(manager).toHaveProperty('remove');
      expect(manager).toHaveProperty('pulse');
      expect(manager).toHaveProperty('getLevel');
    });

    it('should apply heatmap via manager', () => {
      const manager = createHeatmapManager(testElement);

      manager.apply('medium');

      expect(testElement.classList.contains(HEATMAP_CLASS)).toBe(true);
      expect(testElement.classList.contains(`${HEATMAP_CLASS}-medium`)).toBe(true);
    });

    it('should update level via manager', () => {
      const manager = createHeatmapManager(testElement);

      manager.apply('low');
      manager.update('high');

      expect(testElement.classList.contains(`${HEATMAP_CLASS}-high`)).toBe(true);
      expect(testElement.classList.contains(`${HEATMAP_CLASS}-low`)).toBe(false);
    });

    it('should remove heatmap via manager', () => {
      const manager = createHeatmapManager(testElement);

      manager.apply('high');
      manager.remove();

      expect(testElement.classList.contains(HEATMAP_CLASS)).toBe(false);
    });

    it('should trigger pulse via manager', () => {
      const manager = createHeatmapManager(testElement);

      manager.pulse();

      expect(testElement.classList.contains(`${HEATMAP_CLASS}-pulse`)).toBe(true);
    });

    it('should track current level', () => {
      const manager = createHeatmapManager(testElement);

      expect(manager.getLevel()).toBe('low');

      manager.apply('medium');
      expect(manager.getLevel()).toBe('medium');

      manager.update('high');
      expect(manager.getLevel()).toBe('high');
    });

    it('should maintain separate state for different managers', () => {
      const element1 = document.createElement('div');
      const element2 = document.createElement('div');
      document.body.appendChild(element1);
      document.body.appendChild(element2);

      const manager1 = createHeatmapManager(element1);
      const manager2 = createHeatmapManager(element2);

      manager1.apply('low');
      manager2.apply('high');

      expect(manager1.getLevel()).toBe('low');
      expect(manager2.getLevel()).toBe('high');
      expect(element1.classList.contains(`${HEATMAP_CLASS}-low`)).toBe(true);
      expect(element2.classList.contains(`${HEATMAP_CLASS}-high`)).toBe(true);
    });
  });
});
