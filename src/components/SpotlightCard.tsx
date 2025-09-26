'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';

interface Position {
  x: number;
  y: number;
}

interface SpotlightCardProps extends React.PropsWithChildren {
  className?: string;
  spotlightColor?: `rgba(${number}, ${number}, ${number}, ${number})`;
  variant?: 'default' | 'orange' | 'rusty';
  animate?: boolean;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor,
  variant = 'orange',
  animate = true
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState<number>(0);

  // Define spotlight colors based on variant
  const getSpotlightColor = () => {
    if (spotlightColor) return spotlightColor;
    
    switch (variant) {
      case 'orange':
        return 'rgba(255, 165, 0, 0.4)'; // Bright orange
      case 'rusty':
        return 'rgba(183, 65, 14, 0.45)'; // Rusty orange
      default:
        return 'rgba(255, 255, 255, 0.25)';
    }
  };

  // Define background gradients based on variant
  const getBackgroundGradient = () => {
    switch (variant) {
      case 'orange':
        return 'bg-gradient-to-br from-orange-500/10 via-amber-400/5 to-yellow-500/10';
      case 'rusty':
        return 'bg-gradient-to-br from-orange-800/15 via-red-600/8 to-amber-600/12';
      default:
        return 'bg-white/10 dark:bg-black/20';
    }
  };

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = e => {
    if (!divRef.current || isFocused) return;

    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(0.7);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(0.7);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        whileHover={{ scale: 1.02, y: -4 }}
        ref={divRef}
        onMouseMove={handleMouseMove}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`relative rounded-3xl border border-orange-200/30 dark:border-orange-400/20 ${getBackgroundGradient()} backdrop-blur-2xl ring-1 ring-orange-300/20 dark:ring-orange-400/15 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 ${className}`}
      >
        {/* Orange tint overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-orange-400/5 via-transparent to-amber-500/8 dark:from-orange-500/8 dark:to-amber-600/10" />
        
        {/* Spotlight effect */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
          style={{
            opacity,
            background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${getSpotlightColor()}, transparent 80%)`
          }}
        />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    );
  }

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-3xl border border-orange-200/30 dark:border-orange-400/20 ${getBackgroundGradient()} backdrop-blur-2xl ring-1 ring-orange-300/20 dark:ring-orange-400/15 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 ${className}`}
    >
      {/* Orange tint overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-orange-400/5 via-transparent to-amber-500/8 dark:from-orange-500/8 dark:to-amber-600/10" />
      
      {/* Spotlight effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${getSpotlightColor()}, transparent 80%)`
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default SpotlightCard;
