import Link from "next/link";

import SystemHero from "./SystemHero";
import SystemExplorer from "./SystemExplorer";
import SystemBuilder from "./SystemBuilder";


export default function SystemPageClient() {
  return (
    <div className="w-full bg-[#f3f5f7] text-[#1c242b]">
      <SystemHero />

      {/* CAPABILITIES STRIP */}

      <section className="mx-auto grid w-[calc(100%-20px)] max-w-[1440px] grid-cols-2 gap-[2px] border-x-2 border-b-2 border-[#1c242b] bg-[#1c242b] sm:w-[calc(100%-32px)] lg:grid-cols-4">
        {[
          ["01", "CUSTOM SOFTWARE"],
          ["02", "CONNECTED DATA"],
          ["03", "PROCESS AUTOMATION"],
          ["04", "AI & INTELLIGENCE"],
        ].map(([number, label]) => (
          <div
            key={number}
            className="flex min-h-[135px] flex-col justify-between bg-white p-5 sm:p-7"
          >
            <span className="font-mono text-[10px] text-[#2f6fed]">
              {number} / 04
            </span>

            <h2 className="max-w-[220px] text-[15px] font-bold leading-[1.1] tracking-[-0.04em] sm:text-[19px]">
              {label}
            </h2>
          </div>
        ))}
      </section>

      <SystemExplorer />

      <SystemBuilder />

      {/* CLOSING CTA */}

      <section className="mx-auto w-[calc(100%-20px)] max-w-[1440px] border-x-2 border-b-2 border-[#1c242b] bg-[#2f6fed] text-white sm:w-[calc(100%-32px)]">
        <div
          className="flex flex-col justify-between gap-10 p-6 sm:p-10 lg:flex-row lg:items-end lg:p-14"
        >
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/70">
              PENTA LABS / BUILD SOMETHING BIGGER
            </span>

            <h2 className="mt-6 text-[clamp(42px,6.2vw,90px)] leading-[0.94] font-bold tracking-[-0.085em]">
              IF IT DOESN&apos;T
              <br />
              EXIST,
              <br />
              WE CAN BUILD IT.
            </h2>
          </div>

          <Link
            href="#builder"
            className="inline-flex min-h-14 shrink-0 items-center justify-center border-2 border-white bg-[#1c242b] px-6 text-[11px] font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-white hover:text-[#1c242b]"
          >
            DESIGN YOUR SYSTEM ↗
          </Link>
        </div>
      </section>
    </div>
  );
}