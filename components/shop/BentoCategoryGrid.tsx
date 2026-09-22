"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  span: string; // tailwind grid span classes
  accent: string; // tailwind gradient classes
  image: string;
  icon: ReactNode;
};

const ICON_PROPS = {
  className: "w-6 h-6",
  strokeWidth: 1.5,
  fill: "none",
  stroke: "currentColor",
  viewBox: "0 0 24 24",
};

const categories: Category[] = [
  {
    id: "electronics",
    name: "Electronics",
    slug: "electronics",
    tagline: "Gadgets & smart devices",
    span: "col-span-2 row-span-2",
    accent: "from-[#5b7fff] to-[#7cd9ff]",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop",
    icon: (
      <svg {...ICON_PROPS}>
        <rect x="4" y="3" width="16" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "fashion",
    name: "Fashion",
    slug: "fashion",
    tagline: "Apparel & accessories",
    span: "col-span-1 row-span-1",
    accent: "from-rose-500 to-orange-400",
    image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop",
    icon: (
      <svg {...ICON_PROPS}>
        <path
          d="M8 4l4 2 4-2 3 4-3 2v10H8V10L5 8l3-4z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "home",
    name: "Home & Living",
    slug: "home-living",
    tagline: "Décor, kitchen & more",
    span: "col-span-1 row-span-1",
    accent: "from-amber-500 to-yellow-400",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M3 11l9-7 9 7" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M5 10v10h14V10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "beauty",
    name: "Beauty & Personal Care",
    slug: "beauty-personal-care",
    tagline: "Skincare, cosmetics",
    span: "col-span-1 row-span-1",
    accent: "from-pink-400 to-fuchsia-500",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M12 3v6" strokeLinecap="round" />
        <path
          d="M9 9h6l1 4a4 4 0 01-8 0l1-4z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M9 21h6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "fitness",
    name: "Fitness & Outdoors",
    slug: "fitness-outdoors",
    tagline: "Gear for active living",
    span: "col-span-1 row-span-1",
    accent: "from-emerald-500 to-teal-400",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M4 12h2m12 0h2M8 12h8M6 8v8m12-8v8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "tech-acc",
    name: "Tech Accessories",
    slug: "tech-accessories",
    tagline: "Cases, chargers, cables",
    span: "col-span-2 row-span-1",
    accent: "from-sky-500 to-indigo-500",
    image:
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1200&auto=format&fit=crop",
    icon: (
      <svg {...ICON_PROPS}>
        <rect x="9" y="2" width="6" height="20" rx="3" />
        <path d="M12 7h.01" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "pets",
    name: "Pet Supplies",
    slug: "pet-supplies",
    tagline: "For your best friend",
    span: "col-span-1 row-span-1",
    accent: "from-violet-500 to-purple-400",
    image:
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=800&auto=format&fit=crop",
    icon: (
      <svg {...ICON_PROPS}>
        <circle cx="6" cy="9" r="1.6" />
        <circle cx="10" cy="5.5" r="1.6" />
        <circle cx="14" cy="5.5" r="1.6" />
        <circle cx="18" cy="9" r="1.6" />
        <path
          d="M6 15c0-3 3-5 6-5s6 2 6 5-3 5-6 5-6-2-6-5z"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "toys",
    name: "Toys & Kids",
    slug: "toys-kids",
    tagline: "Play, learn, grow",
    span: "col-span-1 row-span-1",
    accent: "from-red-500 to-rose-400",
    image:
      "https://images.unsplash.com/photo-1558060370-d644479cb6f7?q=80&w=800&auto=format&fit=crop",
    icon: (
      <svg {...ICON_PROPS}>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l3 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function BentoCategoryGrid() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050810] flex items-center justify-center py-20 px-4 sm:px-8">
      {/* AMBIENT BACKGROUND — matches hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-120px] h-[640px] w-[980px] -translate-x-1/2 rounded-full bg-[#5b7fff]/[0.08] blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-160px] right-[-80px] h-[420px] w-[420px] rounded-full bg-[#7cd9ff]/[0.05] blur-[130px]"
      />

      {/* GRAIN TEXTURE */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/[0.10] bg-white/[0.04] px-4 py-2 backdrop-blur-2xl">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#A9C5FF]/70" />
              <span className="relative inline-flex size-1.5 rounded-full bg-[#A9C5FF]" />
            </span>
            <span className="text-[11px] font-medium tracking-[0.03em] text-white/60">
              quickshipgo / Browse
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-semibold tracking-[-0.04em] text-white">
            Shop by category
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-white/45 max-w-2xl mx-auto tracking-[-0.01em]">
            Pick what you're into. Every category, one tap away.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 auto-rows-[220px] sm:auto-rows-[260px] gap-4 sm:gap-5">
          {categories.map((cat) => {
            const isHovered = hovered === cat.id;

            return (
              <Link
                key={cat.id}
                href={`/shop/${cat.slug}`}
                onMouseEnter={() => setHovered(cat.id)}
                onMouseLeave={() => setHovered(null)}
                className={[
                  cat.span,
                  "group relative overflow-hidden rounded-3xl block",
                  "border border-white/[0.10] bg-white/[0.04] backdrop-blur-2xl backdrop-saturate-150",
                  "shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_20px_60px_rgba(0,0,0,0.35)]",
                  "transition-all duration-500 ease-out",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A9C5FF]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050810]",
                  isHovered
                    ? "border-white/[0.20] bg-white/[0.06] shadow-[0_1px_0_rgba(255,255,255,0.08)_inset,0_28px_80px_rgba(0,0,0,0.5)] -translate-y-1.5"
                    : "translate-y-0",
                ].join(" ")}
              >
                {/* Background image */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className={[
                    "absolute inset-0 h-full w-full object-cover opacity-70 transition-all duration-700 ease-out",
                    isHovered ? "scale-110 opacity-90" : "scale-100",
                  ].join(" ")}
                />

                {/* Dark base overlay to match hero depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050810]/95 via-[#050810]/50 to-[#050810]/10" />

                {/* Accent color wash on hover */}
                <div
                  className={[
                    "pointer-events-none absolute inset-0 bg-gradient-to-br mix-blend-overlay transition-opacity duration-500",
                    cat.accent,
                    isHovered ? "opacity-50" : "opacity-0",
                  ].join(" ")}
                />

                {/* Glass top highlight */}
                <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />

                {/* Content */}
                <div className="relative h-full w-full flex flex-col justify-between p-6 sm:p-7">
                  <div
                    className={[
                      "inline-flex w-11 h-11 sm:w-12 sm:h-12 items-center justify-center rounded-2xl text-white bg-white/[0.10] backdrop-blur-md border border-white/[0.14] transition-transform duration-300",
                      isHovered ? "scale-105" : "scale-100",
                    ].join(" ")}
                  >
                    {cat.icon}
                  </div>

                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <h3 className="text-white font-semibold text-lg sm:text-2xl leading-snug tracking-[-0.03em]">
                        {cat.name}
                      </h3>
                      <p className="text-white/50 text-xs sm:text-sm mt-1 tracking-[-0.01em]">
                        {cat.tagline}
                      </p>
                    </div>

                    {/* Arrow indicator */}
                    <div
                      className={[
                        "shrink-0 w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300",
                        isHovered
                          ? "opacity-100 translate-x-0 bg-white text-[#080E18] border-white"
                          : "opacity-0 -translate-x-2 bg-white/10 text-white border-white/20",
                      ].join(" ")}
                    >
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          d="M7 17L17 7M17 7H9M17 7V15"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}