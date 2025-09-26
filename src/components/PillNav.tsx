'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link'; // Use Next.js Link
import Image, { type StaticImageData } from 'next/image'; // Use Next.js Image
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

// Define the shape of a navigation item
export type PillNavItem = {
  label: string;
  href: string;
  ariaLabel?: string;
};

// Define the props for the PillNav component
export interface PillNavProps {
  logo: StaticImageData | string; // Allow both static imports and string paths
  logoAlt?: string;
  items: PillNavItem[];
  activeHref?: string;
  className?: string;
  ease?: string;
  baseColor?: string; // Deprecated for background usage: use idleTextColor for text and trackColor for background
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
  idleTextColor?: string;
  trackColor?: string;
  onMobileMenuClick?: () => void;
  initialLoadAnimation?: boolean;
}

const PillNav: React.FC<PillNavProps> = ({
  logo,
  logoAlt = 'Logo',
  items,
  activeHref,
  className = '',
  ease = 'power3.easeOut',
  baseColor = '#000000',
  idleTextColor,
  trackColor = 'transparent',
  pillColor = '#ffffff',
  hoveredPillTextColor = '#000000',
  pillTextColor,
  onMobileMenuClick,
  initialLoadAnimation = true
}) => {
  const resolvedIdleTextColor = idleTextColor ?? baseColor;
  const resolvedPillTextColor = pillTextColor ?? resolvedIdleTextColor;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navItemsRef = useRef<HTMLDivElement | null>(null);
  const pillRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // GSAP animation logic remains largely the same
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const activeIndex = items.findIndex(item => activeHref && activeHref.startsWith(item.href));
    const targetEl = itemRefs.current[activeIndex];

    if (targetEl && pillRef.current && navItemsRef.current) {
      const navRect = navItemsRef.current.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();

      gsap.to(pillRef.current, {
        x: targetRect.left - navRect.left,
        width: targetRect.width,
        duration: 0.5,
        ease: ease,
      });
    }
  }, [activeHref, items, ease]);

  const handleMouseEnter = (i: number) => {
    setHoveredIndex(i);
    const targetEl = itemRefs.current[i];
    if (targetEl && pillRef.current && navItemsRef.current) {
        const navRect = navItemsRef.current.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();

        gsap.to(pillRef.current, {
            x: targetRect.left - navRect.left,
            width: targetRect.width,
            duration: 0.3,
            ease: ease,
        });
    }
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    const activeIndex = items.findIndex(item => activeHref && activeHref.startsWith(item.href));
    const targetEl = itemRefs.current[activeIndex];
    
    if (targetEl && pillRef.current && navItemsRef.current) {
        const navRect = navItemsRef.current.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();

        gsap.to(pillRef.current, {
            x: targetRect.left - navRect.left,
            width: targetRect.width,
            duration: 0.5,
            ease: ease,
        });
    }
  };

  const isExternalLink = (href: string) =>
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('//') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('#');

  const cssVars = {
    ['--track']: trackColor,
    ['--pill-bg']: pillColor,
    ['--hover-text']: hoveredPillTextColor,
    ['--pill-text']: resolvedPillTextColor,
  } as React.CSSProperties;

  return (
    <nav
      className={cn('flex w-full items-center justify-between text-gray-900 dark:text-gray-100', className)}
      style={cssVars}
      aria-label="Primary"
    >
      {/* Logo */}
      <Link href="/dashboard" aria-label="Home">
        <Image src={logo} alt={logoAlt} width={40} height={40} className="h-10 w-auto" />
      </Link>

      {/* Desktop Navigation */}
      <div
        ref={navItemsRef}
        className="relative hidden items-center rounded-full p-1 md:flex"
        style={{ background: 'var(--track, transparent)' }}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          ref={pillRef} 
          className="absolute h-8 rounded-full top-1/2 -translate-y-1/2" 
          style={{ background: 'var(--pill-bg, #fff)' }} 
        />
        {items.map((item, i) => {
          const isActive = activeHref && activeHref.startsWith(item.href);
          const isHovered = hoveredIndex === i;

          const linkContent = (
            <span className="relative z-10 rounded-full px-10 py-2 text-sm font-medium transition-colors duration-300">
              {item.label}
            </span>
          );
          
          if (isExternalLink(item.href)) {
            return (
              <a
                key={item.href}
                href={item.href}
                ref={(el) => { itemRefs.current[i] = el; }}
                onMouseEnter={() => handleMouseEnter(i)}
                aria-label={item.ariaLabel || item.label}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: isHovered ? hoveredPillTextColor : (isActive ? resolvedPillTextColor : undefined),
                }}
              >
                {linkContent}
              </a>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              ref={(el) => { itemRefs.current[i] = el; }}
              onMouseEnter={() => handleMouseEnter(i)}
              aria-label={item.ariaLabel || item.label}
              style={{
                color: isHovered ? hoveredPillTextColor : (isActive ? resolvedPillTextColor : undefined),
              }}
            >
              {linkContent}
            </Link>
          );
        })}
      </div>

      {/* Mobile Menu (Functionality can be added here if needed) */}
      <div className="md:hidden">
        {/* Placeholder for hamburger icon */}
      </div>
    </nav>
  );
};

export default PillNav;

