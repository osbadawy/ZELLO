"use client";

import { useEffect, useState,useRef } from "react";

import HeroParticles from "./HeroParticles";
import HeroFlowField from "./HeroFlowField";
import PentaLabsParticleField from "./HeroFlowField";

export default function Hero() {
  const [navbarHeight, setNavbarHeight] = useState(76);
  const leftPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const navbar = document.getElementById("penta-navbar");

    if (!navbar) return;

    const updateHeight = () => {
      setNavbarHeight(navbar.getBoundingClientRect().height);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);

    observer.observe(navbar);

    return () => {
      observer.disconnect();
    };
  }, []);

  

  return (
    <section
      aria-labelledby="hero-title"
      style={{
        height: `calc(100svh - ${navbarHeight}px)`,
      }}
      className="relative grid min-h-0 grid-cols-1 grid-rows-[minmax(0,55fr)_minmax(0,45fr)] overflow-hidden border-x-2 border-b-2 border-[#1c242b] lg:grid-cols-[1.05fr_0.95fr] lg:grid-rows-1"
    >
      {/* INTRO OVERLAY */}

      <div
        aria-hidden="true"
        className="hero-intro-overlay pointer-events-none absolute inset-0 z-50 bg-[#1c242b]"
      />

      {/* LEFT SIDE */}

      <div
        ref={leftPanelRef}
        className="relative isolate flex min-h-0 flex-col justify-between overflow-y-auto bg-[#f3f5f7] px-5 py-9 sm:px-10 lg:px-[clamp(28px,6vw,90px)] lg:py-[clamp(28px,6vw,78px)]"
      >
        <HeroParticles parentRef={leftPanelRef} />
        {/* STATUS */}

        <div className="hero-intro-meta flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.06em] text-[#66727d]">
          <span className="inline-block size-[9px] border-2 border-[#1c242b] bg-[#91bfa7]" />

          Independent goods / online now
        </div>

        {/* HEADING AND DESCRIPTION */}

        <div>
          <h1
            id="hero-title"
            className="hero-intro-heading m-0 max-w-[720px] text-[clamp(58px,8vw,128px)] leading-[0.83] font-bold tracking-[-0.105em]"
          >
            USEFUL
            <br />

            <span className="text-[#2f6fed]">
              OBJECTS
            </span>

            <br />

            FOR NOW.
            <span
              aria-hidden="true"
              className="hero-cursor ml-2 inline-block h-[0.7em] w-[0.055em] bg-[#2f6fed] align-baseline"
            />
          </h1>

          <p className="hero-intro-content mt-7 max-w-[400px] text-[15px] leading-[1.55] text-[#66727d]">
            Everyday equipment with a little more intention.
            Curated utility, hard-wearing forms, and modern
            objects built for repeat use.
          </p>

          {/* ACTIONS */}

          <div className="hero-intro-content mt-9 flex flex-wrap items-center gap-5">
            <a
              href="#shop"
              className="inline-flex min-h-12 items-center justify-center border-2 border-[#1c242b] bg-[#1c242b] px-[18px] text-xs font-semibold text-white shadow-[5px_5px_0_#2f6fed] transition-all duration-200 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[2px_2px_0_#2f6fed]"
            >
              SHOP THE DROP ↘
            </a>

            <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#66727d]">
              12 units / limited run
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}

            <PentaLabsParticleField
        style={{ minHeight: '70vh' }}
        background="#73738f"
        particleColor="#f5f4f4"
        density={0.02}
        speed={0.9}
        interactionRadius={150}
        interactionStrength={1}
      />

      {/* INTRO ANIMATIONS */}

    <style jsx>{`
      /* Initial screen reveal */
      .hero-cursor {
        animation: cursorBlink 1s steps(1, end) infinite;
      }
    
      @keyframes heroOverlay {
        0% {
          opacity: 1;
          transform: translateY(0);
        }
    
        45% {
          opacity: 1;
        }
    
        100% {
          opacity: 0;
          transform: translateY(-100%);
        }
      }
    
      /* Digital heading reveal */
    
      @keyframes heroHeading {
        0% {
          opacity: 0;
          clip-path: inset(0 100% 0 0);
          transform: translateY(8px);
        }
    
        35% {
          opacity: 1;
          clip-path: inset(0 65% 0 0);
        }
    
        65% {
          clip-path: inset(0 25% 0 0);
          transform: translateY(0);
        }
    
        100% {
          opacity: 1;
          clip-path: inset(0 0 0 0);
          transform: translateY(0);
        }
      }
    
      /* Supporting content */
    
      @keyframes heroReveal {
        from {
          opacity: 0;
          transform: translateY(16px);
        }
    
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    
      /* Right panel reveal */
    
      @keyframes heroVisual {
        from {
          opacity: 0;
          clip-path: inset(0 0 100% 0);
        }
    
        to {
          opacity: 1;
          clip-path: inset(0 0 0 0);
        }
      }
    
      /* Product entrance */
    
      @keyframes heroProduct {
        from {
          opacity: 0;
          transform: translate(-50%, -46%) rotate(-4deg)
            scale(0.94);
        }
    
        to {
          opacity: 1;
          transform: translate(-50%, -50%) rotate(-4deg)
            scale(1);
        }
      }
    
      /* Terminal cursor */
    
      @keyframes cursorBlink {
        0%,
        49% {
          opacity: 1;
        }
    
        50%,
        100% {
          opacity: 0;
        }
      }
    
      .hero-intro-overlay {
        animation: heroOverlay 0.9s
          cubic-bezier(0.76, 0, 0.24, 1) both;
      }
    
      .hero-intro-heading {
        animation: heroHeading 0.85s
          steps(18, end) both;
        animation-delay: 0.35s;
      }
    
      .hero-intro-meta {
        animation: heroReveal 0.5s ease-out both;
        animation-delay: 0.65s;
      }
    
      .hero-intro-content {
        animation: heroReveal 0.7s
          cubic-bezier(0.22, 1, 0.36, 1) both;
        animation-delay: 0.85s;
      }
    
      .hero-intro-visual {
        animation: heroVisual 1s
          cubic-bezier(0.22, 1, 0.36, 1) both;
        animation-delay: 0.2s;
      }
    
      .hero-intro-product {
        animation: heroProduct 1s
          cubic-bezier(0.22, 1, 0.36, 1) both;
        animation-delay: 0.65s;
      }
    
      .hero-intro-detail {
        animation: heroReveal 0.6s ease-out both;
        animation-delay: 1s;
      }
    
      /* Accessibility */
    
      @media (prefers-reduced-motion: reduce) {
        .hero-intro-heading,
        .hero-intro-meta,
        .hero-intro-content,
        .hero-intro-visual,
        .hero-intro-product,
        .hero-intro-detail {
          animation: none;
        }
    
        .hero-intro-overlay {
          display: none;
        }
      }
    `}</style>
    </section>
    );
  }