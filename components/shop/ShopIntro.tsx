import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Sparkles } from "lucide-react";

export default function ShopIntro() {
  return (
    <section
      aria-labelledby="shop-intro-title"
      className="relative isolate w-full overflow-hidden bg-[#080E18] px-5 py-20 text-white sm:px-8 sm:py-24 lg:px-12 lg:py-32"
    >
      {/* AMBIENT BACKGROUND */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[#7197ff]/[0.06] blur-[120px]"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1440px] items-center gap-12 lg:min-h-[460px] lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">

        {/* LEFT: INTRODUCTION */}
        <div className="flex flex-col items-start">

          {/* EYEBROW */}
          <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/[0.12] bg-white/[0.05] px-4 py-2 backdrop-blur-xl sm:mb-10">
            <span className="size-1.5 rounded-full bg-[#A9C5FF]" />

            <span className="text-[11px] font-medium tracking-[0.03em] text-white/65">
              ZELLO / The collection
            </span>
          </div>

          {/* HEADING */}
          <h1
            id="shop-intro-title"
            className="max-w-[850px] text-[clamp(4rem,9vw,8rem)] font-semibold leading-[0.98] tracking-[-0.075em] text-white"
          >
            Find your
            <br />

            <span className="bg-gradient-to-b from-white/90 to-white/40 bg-clip-text text-transparent">
              next favorite.
            </span>
          </h1>

          {/* DESCRIPTION */}
          <p className="mt-8 max-w-[460px] text-[15px] leading-[1.8] tracking-[-0.01em] text-white/50 sm:mt-10 sm:text-[17px]">
            Thoughtfully selected essentials for modern living. Discover useful
            objects that bring simplicity, function, and good design into your
            everyday life.
          </p>

          {/* EXPLORE BUTTON */}
          <Link
            href="#shop"
            className="group mt-9 inline-flex min-h-[48px] items-center justify-center gap-3 rounded-full bg-white px-7 text-[13px] font-semibold tracking-[-0.01em] text-[#080E18] shadow-[0_8px_30px_rgba(255,255,255,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#edf2ff] active:scale-[0.98] sm:mt-10"
          >
            Explore collection

            <ArrowDownRight
              size={17}
              strokeWidth={1.7}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
            />
          </Link>
        </div>

        {/* RIGHT: GLASS COLLECTION CARD */}
        <div className="relative flex items-center justify-center lg:justify-end">

          {/* BACKGROUND GLOW */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7197ff]/[0.12] blur-[90px]"
          />

          <div className="group relative w-full max-w-[420px] overflow-hidden rounded-[32px] border border-white/[0.15] bg-white/[0.06] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-2xl backdrop-saturate-150 transition-all duration-500 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.08] sm:rounded-[40px] sm:p-8">

            {/* GLASS HIGHLIGHT */}
            <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

            {/* CARD HEADER */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-[11px] font-medium text-white/55">
                <Sparkles size={14} strokeWidth={1.5} className="text-[#A9C5FF]" />
                The ZELLO Edit
              </span>

              <span className="text-[11px] font-medium text-white/35">
                001 / 007
              </span>
            </div>

            {/* FEATURED PRODUCT VISUAL */}
            <div className="relative my-8 flex aspect-[1.25] items-center justify-center overflow-hidden rounded-[24px] border border-white/[0.10] bg-gradient-to-br from-[#dbe3eb] via-[#aebfce] to-[#667f97]">

              {/* SOFT ILLUMINATION */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(255,255,255,0.7),transparent_70%)]" />

              {/* DECORATIVE PRODUCT */}
              <div className="relative flex h-[58%] w-[42%] items-center justify-center rounded-[28%] border-[5px] border-[#a3b3c0] bg-gradient-to-br from-[#e6edf2] via-[#b6c5d0] to-[#879ba9] shadow-[12px_18px_35px_rgba(24,39,54,0.25)] transition-transform duration-700 group-hover:scale-105">

                <div className="flex size-full flex-col items-center justify-center rounded-[25%] bg-gradient-to-br from-[#172a3b] via-[#091522] to-[#050d17]">
                  <span className="text-[clamp(22px,3vw,34px)] font-medium tracking-[-0.065em] text-white">
                    12:08
                  </span>

                  <span className="mt-2 text-[9px] font-medium uppercase tracking-[0.12em] text-[#A9C5FF]/80">
                    MON 08
                  </span>
                </div>
              </div>

              {/* IMAGE LABEL */}
              <div className="absolute bottom-4 left-4 rounded-full border border-white/30 bg-white/30 px-3 py-1.5 text-[10px] font-medium text-[#263544] backdrop-blur-xl">
                Everyday essentials
              </div>
            </div>

            {/* CARD FOOTER */}
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="text-[10px] font-medium text-white/40">
                  Discover the collection
                </span>

                <h2 className="mt-1 text-[23px] font-semibold tracking-[-0.045em] text-white">
                  Simply better.
                </h2>
              </div>

              <Link
                href="#shop"
                aria-label="Explore ZELLO collection"
                className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/[0.15] bg-white/[0.08] text-white transition-all duration-300 hover:border-white/25 hover:bg-white/[0.15] active:scale-95"
              >
                <ArrowUpRight size={18} strokeWidth={1.7} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM DETAIL */}
      <div className="relative z-10 mx-auto mt-20 flex w-full max-w-[1440px] items-center justify-between border-t border-white/[0.08] pt-6 sm:mt-24">
        <span className="text-[10px] font-medium tracking-[0.04em] text-white/35">
          Curated for everyday life
        </span>

        <span className="text-[10px] font-medium tracking-[0.04em] text-white/35">
          ZELLO © {new Date().getFullYear()}
        </span>
      </div>
    </section>
  );
}