/**
 * SparkleFAB Component Tests
 * Tests for the floating action button component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SparkleFAB } from '~/components/SparkleFAB';
import type { ContextLevel } from '~/types';

describe('SparkleFAB Component', () => {
  const defaultProps = {
    onClick: jest.fn(),
    isProcessing: false,
    contextLevel: 'low' as ContextLevel,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the FAB button', () => {
      render(<SparkleFAB {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should have correct aria-label', () => {
      render(<SparkleFAB {...defaultProps} />);

      const button = screen.getByLabelText('Enhance Prompt with Magic Sparkle');
      expect(button).toBeInTheDocument();
    });

    it('should be focusable with tabIndex 0', () => {
      render(<SparkleFAB {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('tabIndex', '0');
    });

    it('should render wand icon when not processing', () => {
      render(<SparkleFAB {...defaultProps} isProcessing={false} />);

      const button = screen.getByRole('button');
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should render spinner when processing', () => {
      render(<SparkleFAB {...defaultProps} isProcessing={true} />);

      const button = screen.getByRole('button');
      const spinner = button.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Click Handling', () => {
    it('should call onClick when clicked', () => {
      const onClick = jest.fn();
      render(<SparkleFAB {...defaultProps} onClick={onClick} />);

      fireEvent.click(screen.getByRole('button'));

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', () => {
      const onClick = jest.fn();
      render(<SparkleFAB {...defaultProps} onClick={onClick} disabled={true} />);

      fireEvent.click(screen.getByRole('button'));

      expect(onClick).not.toHaveBeenCalled();
    });

    it('should not call onClick when processing', () => {
      const onClick = jest.fn();
      render(<SparkleFAB {...defaultProps} onClick={onClick} isProcessing={true} />);

      fireEvent.click(screen.getByRole('button'));

      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('Disabled State', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<SparkleFAB {...defaultProps} disabled={true} />);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should be disabled when processing', () => {
      render(<SparkleFAB {...defaultProps} isProcessing={true} />);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should not be disabled normally', () => {
      render(<SparkleFAB {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });
  });

  describe('Context Level Styling', () => {
    it('should render with low context styling', () => {
      render(<SparkleFAB {...defaultProps} contextLevel="low" />);

      const button = screen.getByRole('button');
      expect(button.className).toContain('from-gray-400');
    });

    it('should render with medium context styling', () => {
      render(<SparkleFAB {...defaultProps} contextLevel="medium" />);

      const button = screen.getByRole('button');
      expect(button.className).toContain('from-blue-400');
    });

    it('should render with high context styling', () => {
      render(<SparkleFAB {...defaultProps} contextLevel="high" />);

      const button = screen.getByRole('button');
      // High context uses inline style for gradient
      expect(button).toHaveStyle({
        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
      });
    });

    it('should show shimmer animation for high context', () => {
      render(<SparkleFAB {...defaultProps} contextLevel="high" />);

      const button = screen.getByRole('button');
      expect(button.className).toContain('animate-sparkle-shimmer');
    });

    it('should not show shimmer animation for low/medium context', () => {
      const { rerender } = render(<SparkleFAB {...defaultProps} contextLevel="low" />);

      let button = screen.getByRole('button');
      expect(button.className).not.toContain('animate-sparkle-shimmer');

      rerender(<SparkleFAB {...defaultProps} contextLevel="medium" />);

      button = screen.getByRole('button');
      expect(button.className).not.toContain('animate-sparkle-shimmer');
    });

    it('should show pulse ring for high context when not processing', () => {
      render(<SparkleFAB {...defaultProps} contextLevel="high" isProcessing={false} />);

      const button = screen.getByRole('button');
      const pulseRing = button.querySelector('.animate-ping');
      expect(pulseRing).toBeInTheDocument();
    });

    it('should not show pulse ring when processing', () => {
      render(<SparkleFAB {...defaultProps} contextLevel="high" isProcessing={true} />);

      const button = screen.getByRole('button');
      const pulseRing = button.querySelector('.animate-ping');
      expect(pulseRing).not.toBeInTheDocument();
    });

    it('should not show pulse ring for non-high context', () => {
      render(<SparkleFAB {...defaultProps} contextLevel="medium" />);

      const button = screen.getByRole('button');
      const pulseRing = button.querySelector('.animate-ping');
      expect(pulseRing).not.toBeInTheDocument();
    });
  });

  describe('Visual Elements', () => {
    it('should have rounded-full class for circular shape', () => {
      render(<SparkleFAB {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button.className).toContain('rounded-full');
    });

    it('should have correct dimensions', () => {
      render(<SparkleFAB {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button.className).toContain('w-10');
      expect(button.className).toContain('h-10');
    });

    it('should have backdrop blur effect', () => {
      render(<SparkleFAB {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button.className).toContain('backdrop-blur-lg');
    });

    it('should have transition effects', () => {
      render(<SparkleFAB {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button.className).toContain('transition-all');
    });

    it('should have hover scale effect class', () => {
      render(<SparkleFAB {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button.className).toContain('hover:scale-110');
    });

    it('should have active scale effect class', () => {
      render(<SparkleFAB {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button.className).toContain('active:scale-95');
    });

    it('should have frosted glass overlay', () => {
      render(<SparkleFAB {...defaultProps} />);

      const button = screen.getByRole('button');
      const overlay = button.querySelector('.absolute.inset-0');
      expect(overlay).toBeInTheDocument();
    });
  });

  describe('Glow Effects', () => {
    it('should have glow shadow for low context', () => {
      render(<SparkleFAB {...defaultProps} contextLevel="low" />);

      const button = screen.getByRole('button');
      expect(button.className).toContain('shadow-[0_0_10px_rgba(150,150,150,0.3)]');
    });

    it('should have glow shadow for medium context', () => {
      render(<SparkleFAB {...defaultProps} contextLevel="medium" />);

      const button = screen.getByRole('button');
      expect(button.className).toContain('shadow-[0_0_15px_rgba(0,242,255,0.4)]');
    });

    it('should have glow shadow for high context', () => {
      render(<SparkleFAB {...defaultProps} contextLevel="high" />);

      const button = screen.getByRole('button');
      expect(button.className).toContain('shadow-[0_0_20px_rgba(255,215,0,0.6)]');
    });
  });

  describe('Focus State', () => {
    it('should have focus ring styles', () => {
      render(<SparkleFAB {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button.className).toContain('focus:outline-none');
      expect(button.className).toContain('focus:ring-2');
    });
  });

  describe('Icon Content', () => {
    it('should render wand icon with sparkles', () => {
      render(<SparkleFAB {...defaultProps} />);

      const button = screen.getByRole('button');
      const paths = button.querySelectorAll('svg path');
      // Wand has multiple paths (body + sparkles)
      expect(paths.length).toBeGreaterThan(1);
    });

    it('should render processing spinner with circles', () => {
      render(<SparkleFAB {...defaultProps} isProcessing={true} />);

      const button = screen.getByRole('button');
      const circle = button.querySelector('svg circle');
      expect(circle).toBeInTheDocument();
    });
  });
});
