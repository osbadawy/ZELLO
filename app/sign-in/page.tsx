import type { Metadata } from "next";

import SignInForm from "@/components/auth/SignInForm";

export const metadata: Metadata = {
  title: "Sign In | Penta Labs",
  description: "Sign in to your Penta Labs account.",
};

export default function SignInPage() {
  return (
    <section className="grid min-h-[calc(100svh-76px)] w-full border-b-2 border-[#1c242b] lg:grid-cols-[0.95fr_1.05fr]">
      {/* LEFT — BRAND PANEL */}

      <div className="relative isolate flex min-h-[480px] flex-col justify-between overflow-hidden border-b-2 border-[#1c242b] bg-[#101419] p-6 text-white sm:p-10 lg:min-h-0 lg:border-r-2 lg:border-b-0 lg:p-14">
        {/* BLUEPRINT BACKGROUND */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-55"
          style={{
            backgroundImage: `
              linear-gradient(rgba(120,167,255,0.09) 1px, transparent 1px),
              linear-gradient(90deg, rgba(120,167,255,0.09) 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[18%] left-[12%] size-[70%] rounded-full bg-[#2f6fed]/15 blur-[100px]"
        />

        {/* TOP LABEL */}

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/65">
            PENTA LABS / ACCESS TERMINAL
          </span>

          <span className="flex items-center gap-2 font-mono text-[10px] text-[#78a7ff]">
            <span className="size-1.5 bg-[#2f6fed] shadow-[0_0_10px_#2f6fed]" />
            SYSTEM ONLINE
          </span>
        </div>

        {/* CENTRAL VISUAL */}

        <div className="relative z-10 my-14 flex flex-1 flex-col justify-center">
          <div
            aria-hidden="true"
            className="relative mb-12 grid aspect-square w-full max-w-[390px] place-items-center self-center"
          >
            <div className="absolute inset-[5%] border border-[#78a7ff]/20" />
            <div className="absolute inset-[16%] rotate-45 border border-[#78a7ff]/30" />
            <div className="absolute inset-[27%] border border-[#78a7ff]/30" />

            <div className="absolute top-1/2 left-0 h-px w-full bg-[#78a7ff]/20" />
            <div className="absolute top-0 left-1/2 h-full w-px bg-[#78a7ff]/20" />

            <div className="relative grid aspect-square w-[43%] place-items-center border-2 border-[#78a7ff] bg-[#2f6fed] shadow-[0_0_80px_rgba(47,111,237,0.28)]">
              <span className="pr-2 text-[clamp(80px,11vw,150px)] leading-none font-black tracking-[-0.12em]">
                P<span className="text-[#c4d8ff]">/</span>
              </span>
            </div>

            <span className="absolute top-[2%] left-[2%] font-mono text-[9px] text-white/45">
              P/L — 001
            </span>

            <span className="absolute right-[2%] bottom-[2%] font-mono text-[9px] text-white/45">
              ACCESS / 01
            </span>
          </div>

          <h2 className="max-w-[620px] text-[clamp(39px,4.8vw,78px)] leading-[0.98] font-bold tracking-[-0.085em]">
            IDEAS.
            <br />
            OBJECTS.
            <br />
            <span className="text-[#78a7ff]">
              POSSIBILITIES.
            </span>
          </h2>

          <p className="mt-7 max-w-[450px] text-[13px] leading-[1.8] text-white/60 sm:text-[15px]">
            A place where software, hardware, and experimentation
            come together. Welcome back to the lab.
          </p>
        </div>

        {/* BOTTOM STRIP */}

        <div className="relative z-10 grid grid-cols-3 gap-3 border-t border-white/20 pt-5 font-mono text-[9px] uppercase tracking-[0.08em] text-white/55">
          <span>01 / EXPLORE</span>
          <span>02 / EXPERIMENT</span>
          <span>03 / DISCOVER</span>
        </div>
      </div>

      {/* RIGHT — SIGN-IN FORM */}

      <SignInForm />
    </section>
  );
}