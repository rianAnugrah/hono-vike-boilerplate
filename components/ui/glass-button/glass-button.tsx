import React, { FC, ReactNode, isValidElement } from 'react';

interface GlassButtonProps {
  children: ReactNode;
  onClick: () => void;
  ariaLabel?: string;
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fluid?: boolean;
  color?: 'blue' | 'green' | 'red' | 'purple' | 'gray';
}

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

const squareSizeClasses: Record<string, string> = {
  sm: 'w-7 h-7', // 36px
  md: 'w-12 h-12', // 48px
  lg: 'w-16 h-16', // 64px
};

const colorGradients: Record<string, string> = {
  blue: 'from-blue-400 via-cyan-300 to-purple-400',
  green: 'from-green-400 via-emerald-300 to-teal-400',
  red: 'from-red-400 via-pink-300 to-orange-400',
  purple: 'from-purple-400 via-fuchsia-300 to-indigo-400',
  gray: 'from-gray-400 via-slate-300 to-zinc-400',
};

const borderColors: Record<string, string> = {
  blue: 'border-blue-200',
  green: 'border-green-200',
  red: 'border-red-200',
  purple: 'border-purple-200',
  gray: 'border-gray-200',
};

const textColors: Record<string, string> = {
  blue: 'text-gray-600',
  green: 'text-white',
  red: 'text-white',
  purple: 'text-white',
  gray: 'text-gray-900',
};

const GlassButton: FC<GlassButtonProps> = ({
  children,
  onClick,
  ariaLabel,
  variant = 'solid',
  size = 'md',
  fluid = false,
  color = 'blue',
}) => {
  const handleClick = () => onClick();
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') onClick();
  };

  // Variant classes
  let variantClasses = '';
  if (variant === 'solid') {
    variantClasses = `bg-white/10 backdrop-blur-sm`;
  } else if (variant === 'outline') {
    variantClasses = `bg-transparent border-2 ${borderColors[color]} backdrop-blur-md`;
  } else if (variant === 'ghost') {
    variantClasses = 'bg-transparent border-none shadow-none';
  }

  // Fluid class
  const fluidClass = fluid ? 'w-full' : '';

  // Text color
  const textClass = textColors[color];

  // Gradient for liquid effect
  const gradient = colorGradients[color];

  // Determine if button is icon-only (no label)
  const isIconOnly =
    (typeof children === 'string' && children.trim() === '') ||
    (Array.isArray(children) && children.length === 0) ||
    (isValidElement(children) && !children.props.children);

  // If children is a single valid element and no label, treat as icon-only
  const isSquare =
    isIconOnly ||
    (isValidElement(children) &&
      (typeof children.props.children === 'undefined' || children.props.children === null));

  const shapeClass = 'rounded-full';
  const squareClass = isSquare ? `aspect-square ${squareSizeClasses[size]} flex items-center justify-center p-0` : '';
  const normalSizeClass = !isSquare ? sizeClasses[size] : '';

  return (
    <button
      className={`relative overflow-hidden ${shapeClass} cursor-pointer border border-white/10 transition-transform duration-200 shadow-glass active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 group ${normalSizeClass} ${variantClasses} ${fluidClass} ${textClass} ${squareClass}`}
      
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label={ariaLabel}
    >
      {/* Liquid animation layer (skip for ghost variant) */}
      {variant !== 'ghost' && (
        <span
          className="absolute inset-0 z-0 pointer-events-none"
          aria-hidden="true"
        >
          <span
            className={`absolute -top-1/2 left-1/2 w-[200%] h-[200%] opacity-30 blur-2xl animate-glass-liquid bg-gradient-to-tr ${gradient}`}
            style={{ transform: 'translateX(-50%) rotate(12deg)' }}
          />
        </span>
      )}
      {/* Button content */}
      <span className="relative z-10 font-semibold drop-shadow-md flex items-center justify-center w-full h-full">
        {children}
      </span>
      <style>{`
        @keyframes glass-liquid {
          0% { transform: translateX(-50%) rotate(12deg) scale(1); }
          50% { transform: translateX(-40%) rotate(12deg) scale(1.1); }
          100% { transform: translateX(-50%) rotate(12deg) scale(1); }
        }
        .animate-glass-liquid {
          animation: glass-liquid 3s ease-in-out infinite;
        }
      `}</style>
    </button>
  );
};

export default GlassButton;
