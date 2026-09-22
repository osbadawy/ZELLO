import type { Metadata } from "next";
import { ArrowUpRight, Package, Sparkles, Zap } from "lucide-react";

import SignInForm from "@/components/auth/SignInForm";

export const metadata: Metadata = {
  title: "Sign In | quickshipgo",
  description: "Sign in to your quickshipgo account.",
};

export default function SignInPage() {
  return (
    <section className="grid min-h-[calc(100svh-76px)] w-full bg-[#080d18] lg:grid-cols-[1fr_1fr]">

      {/* LEFT — BRAND EXPERIENCE */}
      <div className="relative isolate flex min-h-[380px] flex-col justify-between overflow-hidden bg-[#080d18] px-7 py-8 text-white sm:px-12 sm:py-12 lg:min-h-[calc(100svh-76px)] lg:px-14 lg:py-14 xl:px-20">

        {/* ATMOSPHERIC BACKGROUND */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute -left-[25%] -top-[30%] size-[650px] rounded-full bg-[#3b63c5]/15 blur-[120px]" />
          <div className="absolute -bottom-[35%] right-[-20%] size-[650px] rounded-full bg-[#608bff]/15 blur-[130px]" />
          <div className="absolute left-[35%] top-[40%] size-[350px] rounded-full bg-[#a9c5ff]/[0.06] blur-[100px]" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.025] via-transparent to-[#608bff]/[0.04]" />
        </div>

        {/* TOP LABEL */}
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl border border-white/15 bg-white/[0.08] backdrop-blur-xl">
              <Package size={16} strokeWidth={1.6} className="text-[#A9C5FF]" />
            </div>

            <span className="text-[14px] font-semibold tracking-[-0.045em] text-white">
              quickshipgo
            </span>
          </div>

          <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[10px] font-medium tracking-[0.03em] text-white/50 backdrop-blur-xl">
            CURATED DISCOVERIES
          </span>
        </div>

        {/* MAIN CONTENT */}
        <div className="relative z-10 my-12 flex flex-1 flex-col justify-center lg:my-8">

          {/* FLOATING PRODUCT VISUAL */}
          <div
            aria-hidden="true"
            className="relative mx-auto mb-14 hidden h-[290px] w-full max-w-[440px] items-center justify-center sm:flex lg:mb-16 xl:h-[340px]"
          >
            {/* BACKGROUND GLOW */}
            <div className="absolute left-1/2 top-1/2 size-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#648bff]/15 blur-[75px]" />

            {/* DECORATIVE ORBITS */}
            <div className="absolute left-1/2 top-1/2 size-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06] xl:size-[310px]" />
            <div className="absolute left-1/2 top-1/2 size-[190px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05] xl:size-[225px]" />

            {/* LEFT FLOATING CARD */}
            <div className="absolute left-[2%] top-[17%] z-10 w-[120px] -rotate-12 rounded-[22px] border border-white/15 bg-white/[0.08] p-2 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-2xl xl:w-[140px]">
              <div className="aspect-square overflow-hidden rounded-[15px] bg-[#e8edf5]">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=85"
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex items-center justify-between px-1 pb-0.5 pt-2.5">
                <span className="text-[10px] font-medium text-white/90">
                  Sound
                </span>
                <ArrowUpRight size={12} className="text-white/40" />
              </div>
            </div>

            {/* CENTER FLOATING CARD */}
            <div className="absolute left-1/2 top-[5%] z-20 w-[155px] -translate-x-1/2 rotate-[-3deg] rounded-[25px] border border-white/20 bg-white/[0.10] p-2.5 shadow-[0_30px_90px_rgba(0,0,0,0.30)] backdrop-blur-2xl xl:w-[180px]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] bg-[#dfe7f2]">
                <img
                  src="https://images.unsplash.com/photo-1503602642458-232111445657?w=400&q=85"
                  alt=""
                  className="h-full w-full object-cover"
                />

                <div className="absolute left-2 top-2 flex size-7 items-center justify-center rounded-full border border-white/40 bg-white/70 text-[#080d18] backdrop-blur-xl">
                  <Sparkles size={13} strokeWidth={1.8} />
                </div>
              </div>

              <div className="flex items-center justify-between px-1 pb-0.5 pt-3">
                <span className="text-[11px] font-medium text-white/90">
                  Living
                </span>
                <ArrowUpRight size={13} className="text-[#A9C5FF]" />
              </div>
            </div>

            {/* RIGHT FLOATING CARD */}
            <div className="absolute bottom-[8%] right-[1%] z-10 w-[120px] rotate-12 rounded-[22px] border border-white/15 bg-white/[0.08] p-2 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-2xl xl:w-[140px]">
              <div className="aspect-square overflow-hidden rounded-[15px] bg-[#e8edf5]">
                <img
                  src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=85"
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex items-center justify-between px-1 pb-0.5 pt-2.5">
                <span className="text-[10px] font-medium text-white/90">
                  Time
                </span>
                <ArrowUpRight size={12} className="text-white/40" />
              </div>
            </div>

            {/* FLOATING ACCENTS */}
            <div className="absolute left-[9%] bottom-[15%] size-1.5 rounded-full bg-[#A9C5FF] shadow-[0_0_20px_#A9C5FF]" />
            <div className="absolute right-[12%] top-[8%] size-1 rounded-full bg-white/70 shadow-[0_0_15px_rgba(255,255,255,0.5)]" />

            {/* GLASS HIGHLIGHTS */}
            <div className="absolute bottom-[4%] left-[30%] h-px w-24 bg-gradient-to-r from-transparent via-[#A9C5FF]/40 to-transparent" />
          </div>

          {/* HEADLINE */}
          <div className="relative">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#A9C5FF]/15 bg-[#A9C5FF]/[0.06] px-3.5 py-2 backdrop-blur-xl">
              <Zap size={12} fill="#A9C5FF" className="text-[#A9C5FF]" />

              <span className="text-[10px] font-medium tracking-[0.04em] text-[#A9C5FF]">
                YOUR NEXT FAVORITE FIND AWAITS
              </span>
            </div>

            <h1 className="max-w-[620px] text-[clamp(2.8rem,4.8vw,5.2rem)] font-semibold leading-[1.04] tracking-[-0.065em] text-white">
              Discover more.
              <br />
              <span className="bg-gradient-to-r from-[#A9C5FF] via-[#d1e0ff] to-[#89aaff] bg-clip-text text-transparent">
                Wait less.
              </span>
            </h1>

            <p className="mt-6 max-w-[430px] text-[13px] leading-[1.8] text-white/50 sm:text-[15px]">
              Trending products, unexpected discoveries, and things you&apos;ll
              wonder how you ever lived without. Your next favorite find
              starts here.
            </p>
          </div>
        </div>

        {/* BOTTOM BRAND STRIP */}
        <div className="relative z-10 flex items-center justify-between gap-4 border-t border-white/10 pt-6">
          <span className="text-[11px] font-medium tracking-[-0.01em] text-white/35">
            The things you didn&apos;t know you needed.
          </span>

          <div className="flex items-center gap-1.5">
            <div className="size-1 rounded-full bg-[#A9C5FF]" />
            <div className="size-1 rounded-full bg-[#A9C5FF]/40" />
            <div className="size-1 rounded-full bg-[#A9C5FF]/20" />
          </div>
        </div>
      </div>

      {/* RIGHT — SIGN-IN FORM */}
      <div className="relative flex min-w-0 flex-col justify-center overflow-hidden bg-[#f7f9fc]">

        {/* SOFT BACKGROUND ACCENTS */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -right-[20%] -top-[30%] size-[500px] rounded-full bg-[#dce7ff]/35 blur-[100px]" />
          <div className="absolute -bottom-[30%] -left-[20%] size-[500px] rounded-full bg-[#e3eaff]/30 blur-[100px]" />
        </div>

        {/* FORM */}
        <div className="relative z-10 w-full">
          <SignInForm />
        </div>
      </div>
    </section>
  );
}