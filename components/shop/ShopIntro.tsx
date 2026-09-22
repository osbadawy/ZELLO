"use client";

import Link from "next/link";
import { useRef, useState, type MouseEvent } from "react";
import { ArrowDownRight, ArrowUpRight, Sparkles } from "lucide-react";

export default function ShopIntro() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [glow, setGlow] = useState({ x: 50, y: 50, active: false });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlow({ x, y, active: true });
  };

  return (
    <section
      aria-labelledby="shop-intro-title"
      className="relative isolate w-full overflow-hidden bg-[#050810] px-5 py-24 text-white antialiased sm:px-8 sm:py-28 lg:px-12 lg:py-36"
    >
      {/* GRAIN TEXTURE */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* AMBIENT BACKGROUND */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-120px] h-[640px] w-[980px] -translate-x-1/2 rounded-full bg-[#5b7fff]/[0.08] blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-160px] right-[-80px] h-[420px] w-[420px] rounded-full bg-[#7cd9ff]/[0.05] blur-[130px]"
      />

      {/* HAIRLINE VIGNETTE FRAME */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 rounded-[2rem] border border-white/[0.06] sm:inset-6 lg:inset-8"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1440px] items-center gap-14 lg:min-h-[480px] lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
        {/* LEFT: INTRODUCTION */}
        <div className="flex flex-col items-start">
          {/* EYEBROW */}
          <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/[0.10] bg-white/[0.04] px-4 py-2 backdrop-blur-2xl sm:mb-10">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#A9C5FF]/70" />
              <span className="relative inline-flex size-1.5 rounded-full bg-[#A9C5FF]" />
            </span>
            <span className="text-[11px] font-medium tracking-[0.03em] text-white/60">
              quickshipgo / The collection
            </span>
          </div>

          {/* HEADING */}
          <h1
            id="shop-intro-title"
            className="max-w-[880px] text-[clamp(3.4rem,8.6vw,7.75rem)] font-semibold leading-[0.97] tracking-[-0.075em] text-white [text-wrap:balance]"
          >
            Find your
            <br />
            <span className="bg-gradient-to-b from-white via-white/95 to-white/35 bg-clip-text text-transparent">
              next favorite.
            </span>
          </h1>

          {/* DESCRIPTION */}
          <p className="mt-8 max-w-[460px] text-[15px] font-normal leading-[1.85] tracking-[-0.01em] text-white/45 sm:mt-10 sm:text-[17px]">
            Thoughtfully selected essentials for modern living. Discover useful
            objects that bring simplicity, function, and good design into your
            everyday life.
          </p>

          {/* ACTIONS */}
          <div className="mt-10 flex items-center gap-4 sm:mt-11">
            <Link
              href="#shop"
              className="group inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-white pl-6 pr-5 text-[13px] font-semibold tracking-[-0.01em] text-[#080E18] shadow-[0_1px_1px_rgba(255,255,255,0.4)_inset,0_10px_30px_rgba(0,0,0,0.35)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_1px_1px_rgba(255,255,255,0.5)_inset,0_16px_40px_rgba(0,0,0,0.4)] active:scale-[0.97] active:translate-y-0"
            >
              Explore collection
              <span className="flex size-6 items-center justify-center rounded-full bg-[#080E18]/[0.08] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5">
                <ArrowDownRight size={14} strokeWidth={2} />
              </span>
            </Link>

            <Link
              href="#learn-more"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/[0.12] px-6 text-[13px] font-medium tracking-[-0.01em] text-white/70 backdrop-blur-xl transition-all duration-300 hover:border-white/25 hover:bg-white/[0.05] hover:text-white active:scale-[0.97]"
            >
              Learn more
            </Link>
          </div>
        </div>

        {/* RIGHT: GLASS COLLECTION CARD */}
        <div className="relative flex items-center justify-center lg:justify-end">
          {/* BACKGROUND GLOW */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7197ff]/[0.14] blur-[100px]"
          />

          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setGlow((g) => ({ ...g, active: false }))}
            className="group relative w-full max-w-[420px] overflow-hidden rounded-[32px] border border-white/[0.12] bg-white/[0.045] p-6 shadow-[0_1px_0_rgba(255,255,255,0.08)_inset,0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl backdrop-saturate-150 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-white/[0.20] hover:bg-white/[0.06] sm:rounded-[40px] sm:p-8"
          >
            {/* CURSOR-TRACKED SHEEN */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500"
              style={{
                opacity: glow.active ? 1 : 0,
                background: `radial-gradient(320px circle at ${glow.x}% ${glow.y}%, rgba(255,255,255,0.10), transparent 65%)`,
              }}
            />

            {/* GLASS TOP HIGHLIGHT */}
            <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />

            <div className="relative z-10">
              {/* CARD HEADER */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-[11px] font-medium text-white/50">
                  <Sparkles size={13} strokeWidth={1.5} className="text-[#A9C5FF]" />
                  The quickshipgo Edit
                </span>
                <span className="text-[11px] font-medium tabular-nums text-white/30">
                  001 / 007
                </span>
              </div>

              {/* FEATURED PRODUCT VISUAL */}
              <div className="relative my-8 flex aspect-[1.25] items-center justify-center overflow-hidden rounded-[24px] border border-white/[0.08] sm:rounded-[28px]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#e2e8ee] via-[#aebfce] to-[#65809a]" />

                {/* SOFT ILLUMINATION */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_25%,rgba(255,255,255,0.75),transparent_65%)]" />

                {/* AMBIENT REFLECTION SWEEP */}
                <div className="pointer-events-none absolute -inset-x-10 -top-10 h-32 rotate-[-8deg] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-60 transition-transform duration-700 group-hover:translate-x-6" />

                {/* DECORATIVE PRODUCT */}
                <div className="relative flex h-[58%] w-[42%] items-center justify-center rounded-[28%] border-[5px] border-[#a3b3c0]/80 bg-gradient-to-br from-[#eef2f5] via-[#b6c5d0] to-[#879ba9] shadow-[0_2px_2px_rgba(255,255,255,0.5)_inset,12px_18px_38px_rgba(24,39,54,0.3)] transition-transform duration-700 ease-out group-hover:scale-[1.06] group-hover:-rotate-1">
                  <div className="flex size-full flex-col items-center justify-center rounded-[25%] bg-gradient-to-br from-[#182b3d] via-[#091522] to-[#040a12] shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]">
                    <span className="text-[clamp(22px,3vw,34px)] font-medium tracking-[-0.065em] text-white">
                      12:08
                    </span>
                    <span className="mt-2 text-[9px] font-medium uppercase tracking-[0.14em] text-[#A9C5FF]/80">
                      MON 08
                    </span>
                  </div>
                </div>

                {/* IMAGE LABEL */}
                <div className="absolute bottom-4 left-4 rounded-full border border-white/40 bg-white/40 px-3 py-1.5 text-[10px] font-medium text-[#263544] backdrop-blur-xl">
                  Everyday essentials
                </div>
              </div>

              {/* CARD FOOTER */}
              <div className="flex items-end justify-between gap-4">
                <div>
                  <span className="text-[10px] font-medium tracking-[0.02em] text-white/35">
                    Discover the collection
                  </span>
                  <h2 className="mt-1 text-[23px] font-semibold tracking-[-0.045em] text-white">
                    Simply better.
                  </h2>
                </div>

                <Link
                  href="#shop"
                  aria-label="Explore quickshipgo collection"
                  className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.06] text-white transition-all duration-300 hover:border-white/25 hover:bg-white hover:text-[#080E18] active:scale-95"
                >
                  <ArrowUpRight size={18} strokeWidth={1.7} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM DETAIL */}
      <div className="relative z-10 mx-auto mt-20 flex w-full max-w-[1440px] items-center justify-between border-t border-white/[0.07] pt-6 sm:mt-24">
        <span className="text-[10px] font-medium tracking-[0.04em] text-white/30">
          Curated for everyday life
        </span>
        <span className="text-[10px] font-medium tracking-[0.04em] text-white/30">
          quickshipgo © {new Date().getFullYear()}
        </span>
      </div>
    </section>
  );
}
