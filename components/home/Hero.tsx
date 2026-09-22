"use client";

import { useEffect, useState } from "react";

import PentaLabsParticleField from "./HeroFlowField";
import HeroFloatingCards from "./HeroFloatingCards";

export default function Hero() {
  const [navbarHeight, setNavbarHeight] = useState(76);

  useEffect(() => {
    const navbar = document.getElementById("penta-navbar");

    if (!navbar) return;

    const updateHeight = () => {
      setNavbarHeight(navbar.getBoundingClientRect().height);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(navbar);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      aria-labelledby="hero-title"
      style={{ minHeight: `calc(100svh - ${navbarHeight}px)` }}
      className="relative isolate flex w-full items-center justify-center overflow-hidden bg-[#080d18] px-5 py-16 sm:px-8 lg:px-12"
    >
      {/* FULL-SCREEN PARTICLE BACKGROUND */}
      <div aria-hidden="true" className="absolute inset-0 z-0 overflow-hidden">
        <PentaLabsParticleField
          style={{ width: "100%", height: "100%", minHeight: "100%" }}
          background="#080d18"
          particleColor="#dce8ff"
          density={0.02}
          speed={0.7}
          interactionRadius={150}
          interactionStrength={1}
        />
      </div>

      {/* BACKGROUND GRADIENT */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-[#080d18]/10 to-[#080d18]/50"
      />

      {/* FLOATING PRODUCT CARDS */}
      <HeroFloatingCards />

      {/* CENTRAL CONTENT */}
      <div className="pointer-events-none relative z-10 mx-auto flex w-full max-w-7xl items-center justify-center">

        {/* GLASS PANEL */}
        <div className="pointer-events-auto relative w-full max-w-[780px] overflow-hidden rounded-[32px] border border-white/15 bg-white/[0.07] px-6 py-12 text-center text-white shadow-[0_24px_80px_rgba(0,0,0,0.20)] backdrop-blur-xl backdrop-saturate-150 sm:rounded-[40px] sm:px-10 sm:py-14 lg:px-14 lg:py-16">

          {/* GLASS HIGHLIGHT */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
          />

          {/* MAIN HEADING */}
          <h1
            id="hero-title"
            className="mx-auto max-w-[680px] text-[clamp(3.25rem,7vw,6.5rem)] font-semibold leading-[1.05] tracking-[-0.065em] text-white"
          >
            Quick Ship Go
          </h1>

          {/* ACTIONS */}
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:mt-12 sm:flex-row">

            {/* PRIMARY BUTTON */}
            <a
              href="#shop"
              className="group inline-flex min-h-[50px] w-full items-center justify-center gap-3 rounded-full bg-white px-7 py-3 text-[13px] font-semibold tracking-[-0.01em] text-[#080d18] shadow-[0_8px_30px_rgba(255,255,255,0.10)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#edf2ff] hover:shadow-[0_12px_35px_rgba(255,255,255,0.18)] active:scale-[0.98] sm:w-auto"
            >
              Explore the collection

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              >
                <path d="M7 17 17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </a>

          </div>
        </div>
      </div>
    </section>
  );
}