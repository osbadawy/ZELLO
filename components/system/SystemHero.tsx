"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import InteractiveArchitecture from "./InteractiveArchitecture";

export default function SystemHero() {
  const [navbarHeight, setNavbarHeight] = useState(0);

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
      style={{
        minHeight: `calc(100svh - ${navbarHeight}px)`,
      }}
      className="grid w-full grid-cols-1 border-b-2 border-[#1c242b] lg:grid-cols-[1.15fr_0.85fr]"
    >
      {/* EDITORIAL INTRO */}

      <div className="flex min-w-0 flex-col justify-between bg-white p-6 sm:p-10 lg:p-12 xl:p-14">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em]">
          <span className="size-2 shrink-0 bg-[#2f6fed]" />

          PENTA LABS / SYSTEM DIVISION
        </div>

        <div className="my-12 lg:my-8">
          <p className="mb-7 max-w-[520px] font-mono text-[11px] uppercase tracking-[0.15em] text-[#65717d]">
            CUSTOM SOFTWARE / CONNECTED INFRASTRUCTURE /
            COMPLEX BUSINESS OPERATIONS
          </p>

          <h1 className="text-[clamp(48px,6vw,108px)] leading-[0.92] font-bold tracking-[-0.095em]">
            WE BUILD
            <br />

            <span className="text-[#2f6fed]">
              SYSTEMS
            </span>

            <br />
            THAT RUN
            <br />
            BUSINESS.
          </h1>

          <p className="mt-8 max-w-[520px] text-[14px] leading-[1.8] text-[#526477] sm:text-[16px]">
            Not another disconnected tool. We design
            the software, workflows, integrations,
            and interfaces that connect an entire
            operation.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="#explorer"
            className="inline-flex min-h-12 items-center justify-center border-2 border-[#1c242b] bg-[#2f6fed] px-5 text-[11px] font-bold uppercase tracking-[0.08em] text-white shadow-[4px_4px_0_#1c242b] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#1c242b]"
          >
            EXPLORE SYSTEMS ↘
          </Link>

          <Link
            href="#builder"
            className="inline-flex min-h-12 items-center justify-center border-2 border-[#1c242b] bg-white px-5 text-[11px] font-bold uppercase tracking-[0.08em] transition-colors hover:bg-[#1c242b] hover:text-white"
          >
            DESIGN YOUR OWN ↗
          </Link>
        </div>
      </div>

      {/* INTERACTIVE ARCHITECTURE */}

      <div className="min-h-[420px] min-w-0 border-t-2 border-[#1c242b] lg:min-h-0 lg:border-t-0 lg:border-l-2">
        <InteractiveArchitecture />
      </div>
    </section>
  );
}