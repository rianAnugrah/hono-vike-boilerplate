import React, { FC, ReactNode, useRef, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import cn from '@/components/utils/cn';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  className?: string;
  delay?: number;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  ariaLabel?: string;
}

type Placement = 'top' | 'bottom' | 'left' | 'right';

const getAvailablePlacements = (
  triggerRect: DOMRect,
  tooltipRect: DOMRect
): Record<Placement, boolean> => {
  const { innerWidth, innerHeight } = window;
  const spacing = 8;
  
  return {
    top: triggerRect.top >= tooltipRect.height + spacing,
    bottom: innerHeight - triggerRect.bottom >= tooltipRect.height + spacing,
    left: triggerRect.left >= tooltipRect.width + spacing,
    right: innerWidth - triggerRect.right >= tooltipRect.width + spacing,
  };
};

const getTooltipPosition = (
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
  placement: Placement
) => {
  const spacing = 8;
  let top = 0, left = 0;
  
  switch (placement) {
    case 'top':
      top = triggerRect.top + window.scrollY - tooltipRect.height - spacing;
      left = triggerRect.left + window.scrollX + (triggerRect.width - tooltipRect.width) / 2;
      break;
    case 'bottom':
      top = triggerRect.bottom + window.scrollY + spacing;
      left = triggerRect.left + window.scrollX + (triggerRect.width - tooltipRect.width) / 2;
      break;
    case 'left':
      top = triggerRect.top + window.scrollY + (triggerRect.height - tooltipRect.height) / 2;
      left = triggerRect.left + window.scrollX - tooltipRect.width - spacing;
      break;
    case 'right':
      top = triggerRect.top + window.scrollY + (triggerRect.height - tooltipRect.height) / 2;
      left = triggerRect.right + window.scrollX + spacing;
      break;
  }
  
  // Clamp to viewport with better boundaries
  const padding = 8;
  top = Math.max(padding, Math.min(top, window.innerHeight + window.scrollY - tooltipRect.height - padding));
  left = Math.max(padding, Math.min(left, window.innerWidth - tooltipRect.width - padding));
  
  return { top, left };
};

const Tooltip: FC<TooltipProps> = ({
  content,
  children,
  className = '',
  delay = 100,
  placement = 'top',
  ariaLabel,
}) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; placement: Placement }>({
    top: 0,
    left: 0,
    placement,
  });
  const [mounted, setMounted] = useState(false);
  const [measured, setMeasured] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimeout = useRef<NodeJS.Timeout | null>(null);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);
  const measureTimeout = useRef<NodeJS.Timeout | null>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current || !visible) return;
    
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    // Skip if dimensions are invalid
    if (tooltipRect.width === 0 || tooltipRect.height === 0) {
      return;
    }
    
    const available = getAvailablePlacements(triggerRect, tooltipRect);
    let finalPlacement: Placement = placement;
    
    // Smart fallback placement
    if (!available[placement]) {
      const fallbackOrder: Placement[] = ['top', 'bottom', 'right', 'left'];
      finalPlacement = fallbackOrder.find(p => available[p]) || placement;
    }
    
    const { top, left } = getTooltipPosition(triggerRect, tooltipRect, finalPlacement);
    setCoords({ top, left, placement: finalPlacement });
    setMeasured(true);
  }, [placement, visible]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Improved positioning logic with proper timing
  useEffect(() => {
    if (!visible) {
      setMeasured(false);
      return;
    }
    
    // Clear any existing measurement timeout
    if (measureTimeout.current) {
      clearTimeout(measureTimeout.current);
    }
    
    // Use requestAnimationFrame for better timing
    const measure = () => {
      measureTimeout.current = setTimeout(() => {
        requestAnimationFrame(() => {
          updatePosition();
        });
      }, 0);
    };
    
    measure();
    
    // Listen for resize/scroll with debouncing
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updatePosition, 100);
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', updatePosition, true);
    
    return () => {
      if (measureTimeout.current) clearTimeout(measureTimeout.current);
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [visible, content, updatePosition]);

  // Show/hide with delay
  const handleShow = () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    showTimeout.current = setTimeout(() => setVisible(true), delay);
  };
  
  const handleHide = () => {
    if (showTimeout.current) clearTimeout(showTimeout.current);
    hideTimeout.current = setTimeout(() => setVisible(false), 60);
  };

  // Accessibility: show on focus, hide on blur
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setVisible(false);
  };

  // Clean up timeouts
  useEffect(() => {
    return () => {
      if (showTimeout.current) clearTimeout(showTimeout.current);
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
      if (measureTimeout.current) clearTimeout(measureTimeout.current);
    };
  }, []);

  // Animation direction based on final placement
  const getAnim = () => {
    switch (coords.placement) {
      case 'top':
        return { 
          initial: { opacity: 0, scale: 0.95, y: 8 }, 
          animate: { opacity: 1, scale: 1, y: 0 }, 
          exit: { opacity: 0, scale: 0.95, y: 8 } 
        };
      case 'bottom':
        return { 
          initial: { opacity: 0, scale: 0.95, y: -8 }, 
          animate: { opacity: 1, scale: 1, y: 0 }, 
          exit: { opacity: 0, scale: 0.95, y: -8 } 
        };
      case 'left':
        return { 
          initial: { opacity: 0, scale: 0.95, x: 8 }, 
          animate: { opacity: 1, scale: 1, x: 0 }, 
          exit: { opacity: 0, scale: 0.95, x: 8 } 
        };
      case 'right':
        return { 
          initial: { opacity: 0, scale: 0.95, x: -8 }, 
          animate: { opacity: 1, scale: 1, x: 0 }, 
          exit: { opacity: 0, scale: 0.95, x: -8 } 
        };
      default:
        return { 
          initial: { opacity: 0 }, 
          animate: { opacity: 1 }, 
          exit: { opacity: 0 } 
        };
    }
  };

  // Arrow positioning classes
  const getArrowClasses = () => {
    const base = 'before:absolute before:content-[""] before:w-3 before:h-3 before:bg-inherit before:rotate-45 before:-z-10 before:border-inherit';
    switch (coords.placement) {
      case 'top':
        return `${base} before:bottom-[-6px] before:left-1/2 before:-translate-x-1/2`;
      case 'bottom':
        return `${base} before:top-[-6px] before:left-1/2 before:-translate-x-1/2`;
      case 'left':
        return `${base} before:right-[-6px] before:top-1/2 before:-translate-y-1/2`;
      case 'right':
        return `${base} before:left-[-6px] before:top-1/2 before:-translate-y-1/2`;
      default:
        return base;
    }
  };

  return (
    <>
      <span
        ref={triggerRef}
        tabIndex={0}
        aria-label={ariaLabel}
        className="inline-block focus:outline-none"
        onMouseEnter={handleShow}
        onMouseLeave={handleHide}
        onFocus={handleShow}
        onBlur={handleHide}
        onKeyDown={handleKeyDown}
      >
        {children}
      </span>
      {mounted && typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {visible && (
            <motion.div
              ref={tooltipRef}
              {...getAnim()}
              transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                position: 'absolute',
                top: coords.top,
                left: coords.left,
                zIndex: 9999,
                pointerEvents: 'none',
                minWidth: 80,
                maxWidth: 320,
                opacity: measured ? 1 : 0,
                visibility: measured ? 'visible' : 'hidden',
              }}
              className={cn(
                'px-3 py-2 rounded-xl shadow-xl text-sm font-medium text-gray-900 dark:text-white',
                'backdrop-blur-md bg-white/30 dark:bg-gray-900/40 border border-white/20',
                getArrowClasses(),
                'overflow-hidden',
                'animate-glass-liquid',
                className
              )}
              aria-live="polite"
              role="tooltip"
            >
              {/* Liquid glass animation layer */}
              <span
                className="absolute inset-0 z-0 pointer-events-none"
                aria-hidden="true"
              >
                <span
                  className={cn(
                    'absolute -top-1/2 left-1/2 w-[200%] h-[200%] opacity-30 blur-2xl animate-glass-liquid',
                    'bg-gradient-to-tr from-blue-400 via-cyan-300 to-purple-400'
                  )}
                  style={{ transform: 'translateX(-50%) rotate(12deg)' }}
                />
              </span>
              <span className="relative z-10 drop-shadow-md flex items-center justify-center w-full h-full">
                {content}
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
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default Tooltip;