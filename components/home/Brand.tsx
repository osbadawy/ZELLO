"use client";

import Link from "next/link";

type BrandProps = {
  href?: string;
};

export default function Brand({ href = "/" }: BrandProps) {
  return (
    <Link
      href={href}
      aria-label="ZELLO Home"
      className="group inline-flex w-fit items-center gap-2.5"
    >
      {/* LOGO SYMBOL */}
      <div className="relative flex size-9 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-all duration-300 group-hover:border-white/30 group-hover:bg-white/[0.12] sm:size-10">
        <svg
          width="23"
          height="23"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="transition-transform duration-500 group-hover:scale-110"
        >
          <path
            d="M7 8H25L7 24H25"
            stroke="white"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <circle cx="25" cy="8" r="2" fill="#A9C5FF" />
        </svg>

        {/* Subtle glass highlight */}
        <div className="pointer-events-none absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>

      {/* WORDMARK */}
      <div className="flex items-center">
        <span className="text-[20px] font-semibold leading-none tracking-[-0.065em] text-white sm:text-[22px]">
          ZELLO
        </span>

        <span className="mb-2 ml-0.5 size-1 rounded-full bg-[#A9C5FF]" />
      </div>
    </Link>
  );
}