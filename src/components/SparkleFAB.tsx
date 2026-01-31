/**
 * Sparkle FAB Component
 * Minimalist floating action button with shimmer effect
 * Implements the "Lumina" design system
 */

import React from 'react';
import type { ContextLevel } from '~/types';

interface SparkleFABProps {
  onClick: () => void;
  isProcessing: boolean;
  contextLevel: ContextLevel;
  disabled?: boolean;
}

// Magic Wand SVG Icon
const WandIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Wand body */}
    <path d="M15 4l-11 11 4 4 11-11-4-4z" />
    {/* Sparkles */}
    <path d="M18 2l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" />
    <path d="M3 13l.5 1 1 .5-1 .5-.5 1-.5-1-1-.5 1-.5.5-1z" />
    <path d="M10 2l.5 1 1 .5-1 .5-.5 1-.5-1-1-.5 1-.5.5-1z" />
  </svg>
);

// Spinner for processing state
const ProcessingSpinner: React.FC = () => (
  <svg
    className="animate-spin w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="3"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export const SparkleFAB: React.FC<SparkleFABProps> = ({
  onClick,
  isProcessing,
  contextLevel,
  disabled = false
}) => {
  // Determine colors based on context level
  const getGradientClass = () => {
    switch (contextLevel) {
      case 'high':
        return 'from-yellow-400 via-orange-400 to-yellow-500';
      case 'medium':
        return 'from-blue-400 to-cyan-400';
      case 'low':
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getGlowColor = () => {
    switch (contextLevel) {
      case 'high':
        return 'shadow-[0_0_20px_rgba(255,215,0,0.6)]';
      case 'medium':
        return 'shadow-[0_0_15px_rgba(0,242,255,0.4)]';
      case 'low':
      default:
        return 'shadow-[0_0_10px_rgba(150,150,150,0.3)]';
    }
  };

  const isHighContext = contextLevel === 'high';

  return (
    <button
      onClick={onClick}
      disabled={disabled || isProcessing}
      aria-label="Enhance Prompt with Magic Sparkle"
      role="button"
      tabIndex={0}
      className={`
        relative
        w-10 h-10
        rounded-full
        flex items-center justify-center
        transition-all duration-300 ease-out
        backdrop-blur-lg
        border border-white/20
        bg-gradient-to-br ${getGradientClass()}
        ${getGlowColor()}
        hover:scale-110
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:ring-offset-2 focus:ring-offset-transparent
        ${isHighContext ? 'animate-sparkle-shimmer' : ''}
      `}
      style={{
        background: contextLevel === 'high' 
          ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
          : undefined
      }}
    >
      {/* Frosted glass overlay */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: 'rgba(26, 26, 26, 0.3)',
          backdropFilter: 'blur(8px)'
        }}
      />
      
      {/* Icon */}
      <div className="relative z-10 text-white">
        {isProcessing ? (
          <ProcessingSpinner />
        ) : (
          <WandIcon className="w-5 h-5" />
        )}
      </div>

      {/* Pulse ring for high context */}
      {isHighContext && !isProcessing && (
        <div className="absolute inset-0 rounded-full animate-ping opacity-30 bg-yellow-400" />
      )}
    </button>
  );
};

export default SparkleFAB;
