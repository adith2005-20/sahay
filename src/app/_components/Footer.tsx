'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/../public/sahay.svg';
import CircularText from '@/components/CircularText';

// Subtle extra animations to mirror Header
const customStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-2px); }
  }
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
`;

export default function Footer({
  className = '',
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const year = new Date().getFullYear();

  return (
    <>
      <style jsx global>{customStyles}</style>

      {/* Glassy, fog-like footer bar with lavender tint */}
      <footer
        className={[
          'fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ease-out',
          isScrolled
            ? 'bg-white/30 dark:bg-black/30 backdrop-blur-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.10)] border-t border-white/20 dark:border-white/10 ring-1 ring-white/10'
            : 'bg-white/20 dark:bg-black/20 backdrop-blur-2xl border-t border-white/10 dark:border-white/5 ring-1 ring-white/10',
          className,
        ].join(' ')}
      >
        {/* Gentle fog + lavender tint overlays that allow Iridescence to shine through */}
        <div className="pointer-events-none absolute inset-0">
          {/* Lavender tint */}
          <div className="absolute inset-0 bg-gradient-to-t from-fuchsia-300/15 via-transparent to-transparent dark:from-fuchsia-400/15" />
          {/* Fog */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-white/5 to-transparent dark:from-black/10 dark:via-black/5" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-14">
            {/* Logo + brand */}
            <div className="flex items-center gap-3 group">
              <Link href="/dashboard" className="flex items-center">
                <Image
                  src={logo}
                  width={32}
                  height={32}
                  alt="Sahay"
                  className="transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6 animate-float"
                  priority
                />
              </Link>
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                © {year} Sahay
              </span>
            </div>

            {/* Right-side: circular text accent + optional actions/links */}
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
              <div className="hidden sm:block" aria-hidden>
                <CircularText
                  text="Sahay • Cares • 4 U • "
                  size={48}
                  className="text-orange-600/70 dark:text-orange-400/70"
                />
              </div>
              {children}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
