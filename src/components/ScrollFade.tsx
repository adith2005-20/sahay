"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrollFadeProps extends React.PropsWithChildren {
  className?: string;
  maxHeight?: number | string;
  fadeSize?: number; // in px
}

export default function ScrollFade({
  className = "",
  children,
  maxHeight = "65vh",
  fadeSize = 24,
}: ScrollFadeProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const maxScrollTop = scrollHeight - clientHeight - 1; // tolerance
      setShowTopFade(scrollTop > 2);
      setShowBottomFade(scrollTop < maxScrollTop);
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const topStop = showTopFade ? fadeSize : 0;
  const bottomStop = showBottomFade ? fadeSize : 0;
  const mask = `linear-gradient(to bottom, rgba(0,0,0,${showTopFade ? 0 : 1}) 0px, black ${topStop}px, black calc(100% - ${bottomStop}px), rgba(0,0,0,${showBottomFade ? 0 : 1}) 100%)`;

  return (
    <div className={`relative ${className}`}>
      <div
        ref={scrollRef}
        className="overflow-y-auto overscroll-contain"
        style={{ maxHeight }}
      >
        <div
          style={{
            WebkitMaskImage: mask,
            maskImage: mask,
            transition: "mask-image 200ms ease, -webkit-mask-image 200ms ease",
          }}
        >
          {children}
        </div>
      </div>

      {/* Decorative gradient fades (background-aware) */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-background to-transparent transition-opacity duration-200"
        style={{ opacity: showTopFade ? 1 : 0 }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-background to-transparent transition-opacity duration-200"
        style={{ opacity: showBottomFade ? 1 : 0 }}
      />
    </div>
  );
}
