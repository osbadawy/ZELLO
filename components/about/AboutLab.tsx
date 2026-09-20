"use client";

import { useState } from "react";
import Link from "next/link";

type LabMode = {
  id: string;
  number: string;
  title: string;
  eyebrow: string;
  headline: string;
  description: string;
  examples: string[];
  stages: string[];
  output: string;
  href: string | null;
  linkLabel: string | null;
};

const LAB_MODES: LabMode[] = [
  {
    id: "build",
    number: "01",
    title: "BUILD",
    eyebrow: "DIGITAL SYSTEMS",
    headline: "IDEAS BECOME INFRASTRUCTURE.",
    description:
      "We turn ambitious business ideas into working digital products. From customer-facing experiences to the complicated systems behind them, we build software designed around how a business actually operates.",
    examples: [
      "CUSTOM SOFTWARE",
      "BUSINESS PLATFORMS",
      "AUTOMATION",
      "CONNECTED WORKFLOWS",
      "AI-ASSISTED TOOLS",
      "INTEGRATIONS",
    ],
    stages: [
      "UNDERSTAND THE PROBLEM",
      "DESIGN THE SYSTEM",
      "BUILD THE PRODUCT",
      "TEST & EVOLVE",
    ],
    output: "SOFTWARE THAT MAKES AN IDEA USABLE.",
    href: "/system",
    linkLabel: "EXPLORE OUR SYSTEMS ↗",
  },
  {
    id: "sell",
    number: "02",
    title: "SELL",
    eyebrow: "OBJECTS & COMMERCE",
    headline: "THE PHYSICAL WORLD IS OUR PLAYGROUND.",
    description:
      "We explore products that make everyday life more interesting, useful, or enjoyable. Hardware, technology, and objects for the home all belong here. Commerce is also a place to try new ways of reaching people and building businesses.",
    examples: [
      "CONSUMER TECHNOLOGY",
      "HARDWARE",
      "HOUSEHOLD OBJECTS",
      "PRODUCT DISCOVERY",
      "DIGITAL COMMERCE",
      "NEW BUSINESS MODELS",
    ],
    stages: [
      "FIND SOMETHING INTERESTING",
      "QUESTION ITS VALUE",
      "EXPLORE THE EXPERIENCE",
      "BRING IT TO PEOPLE",
    ],
    output: "OBJECTS WORTH A CLOSER LOOK.",
    href: "/shop",
    linkLabel: "EXPLORE THE SHOP ↗",
  },
  {
    id: "test",
    number: "03",
    title: "TEST",
    eyebrow: "THE EXPERIMENTAL MINDSET",
    headline: "CURIOSITY IS A WORKING METHOD.",
    description:
      "Not every idea needs to become a company or a product. Sometimes the point is to get our hands on new technology, explore a household object, investigate what makes it useful, and share what we discover.",
    examples: [
      "EMERGING TECHNOLOGY",
      "PRODUCT REVIEWS",
      "HANDS-ON EXPLORATION",
      "PROTOTYPES",
      "USER EXPERIENCE",
      "UNEXPECTED DISCOVERIES",
    ],
    stages: [
      "GET CURIOUS",
      "TRY IT OURSELVES",
      "QUESTION THE ASSUMPTIONS",
      "SHARE WHAT WE LEARN",
    ],
    output: "A BETTER UNDERSTANDING OF WHAT IS POSSIBLE.",
    href: null,
    linkLabel: null,
  },
  {
    id: "rethink",
    number: "04",
    title: "RETHINK",
    eyebrow: "NEW BUSINESS MODELS",
    headline: "THE WAY THINGS WORK IS NOT FIXED.",
    description:
      "Technology changes what businesses can do. Creative thinking changes what they choose to do with it. We are interested in the space where new digital capabilities meet new commercial models—and where an unusual experiment can become an entirely new direction.",
    examples: [
      "UNCONVENTIONAL IDEAS",
      "PLATFORM MODELS",
      "DIGITAL-FIRST BUSINESSES",
      "NEW CUSTOMER EXPERIENCES",
      "SCALABLE OPERATIONS",
      "FUTURE OPPORTUNITIES",
    ],
    stages: [
      "CHALLENGE THE DEFAULT",
      "CONNECT DIFFERENT IDEAS",
      "MAKE A SMALL EXPERIMENT",
      "FOLLOW THE RESULTS",
    ],
    output: "A DIRECTION WE COULD NOT SEE BEFORE.",
    href: null,
    linkLabel: null,
  },
];

export default function AboutLab() {
  const [activeId, setActiveId] = useState("build");

  const activeMode =
    LAB_MODES.find((mode) => mode.id === activeId) ??
    LAB_MODES[0];

  return (
    <section
      id="the-lab"
      aria-labelledby="about-lab-title"
      className="scroll-mt-24 border-b-2 border-[#1c242b] bg-white"
    >
      {/* SECTION INTRO */}

      <div className="flex flex-col justify-between gap-8 border-b-2 border-[#1c242b] p-6 sm:p-10 lg:flex-row lg:items-end lg:p-14">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#2f6fed]">
            02 / THE LAB INDEX
          </span>

          <h2
            id="about-lab-title"
            className="mt-5 text-[clamp(42px,6vw,88px)] leading-[0.95] font-bold tracking-[-0.085em]"
          >
            ONE LAB.
            <br />
            <span className="text-[#2f6fed]">
              MANY DIRECTIONS.
            </span>
          </h2>
        </div>

        <p className="max-w-[350px] text-[13px] leading-[1.8] text-[#526477]">
          We do not believe an interesting idea has to
          fit a single industry, format, or business
          model. Explore the different ways we bring
          ideas into the world.
        </p>
      </div>

      {/* MODE SELECTOR */}

      <div className="grid grid-cols-2 gap-[2px] bg-[#1c242b] lg:grid-cols-4">
        {LAB_MODES.map((mode) => {
          const selected = mode.id === activeId;

          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => setActiveId(mode.id)}
              aria-pressed={selected}
              className={[
                "group flex min-h-[160px] flex-col justify-between p-5 text-left transition-colors duration-300 sm:p-7",
                selected
                  ? "bg-[#1c242b] text-white"
                  : "bg-white text-[#1c242b] hover:bg-[#eaf0ff]",
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <span
                  className={[
                    "font-mono text-[10px]",
                    selected
                      ? "text-[#78a7ff]"
                      : "text-[#526477]",
                  ].join(" ")}
                >
                  {mode.number} / 04
                </span>

                <span
                  className={[
                    "grid size-8 place-items-center border text-lg transition-transform group-hover:rotate-45",
                    selected
                      ? "border-[#78a7ff] bg-[#2f6fed] text-white"
                      : "border-[#1c242b] bg-white",
                  ].join(" ")}
                >
                  ↗
                </span>
              </div>

              <span className="text-[clamp(26px,3vw,46px)] leading-none font-bold tracking-[-0.07em]">
                {mode.title}
                <span className="text-[#2f6fed]">.</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* ACTIVE MODE */}

      <div
        key={activeMode.id}
        className="grid lg:grid-cols-[1.05fr_0.95fr]"
      >
        {/* MAIN DESCRIPTION */}

        <div className="flex min-w-0 flex-col justify-between p-6 sm:p-10 lg:p-14">
          <div>
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.12em] text-[#2f6fed]">
              <span className="size-2 bg-[#2f6fed]" />
              {activeMode.eyebrow}
            </div>

            <h3 className="mt-9 max-w-[700px] text-[clamp(34px,4.5vw,66px)] leading-[1.03] font-bold tracking-[-0.075em]">
              {activeMode.headline}
            </h3>

            <p className="mt-8 max-w-[580px] text-[14px] leading-[1.9] text-[#526477] sm:text-[16px]">
              {activeMode.description}
            </p>

            <div className="mt-10 flex flex-wrap gap-2">
              {activeMode.examples.map((example) => (
                <span
                  key={example}
                  className="border border-[#1c242b] bg-[#f3f5f7] px-3 py-2 font-mono text-[9px] uppercase tracking-[0.07em]"
                >
                  {example}
                </span>
              ))}
            </div>
          </div>

          {activeMode.href && activeMode.linkLabel && (
            <Link
              href={activeMode.href}
              className="mt-12 inline-flex min-h-12 w-fit items-center justify-center border-2 border-[#1c242b] bg-[#2f6fed] px-5 text-[11px] font-bold uppercase tracking-[0.07em] text-white transition-colors hover:bg-[#1c242b]"
            >
              {activeMode.linkLabel}
            </Link>
          )}
        </div>

        {/* WORKFLOW DIAGRAM */}

        <div className="flex min-w-0 flex-col border-t-2 border-[#1c242b] bg-[#101419] text-white lg:border-t-0 lg:border-l-2">
          <div className="flex items-center justify-between border-b border-white/20 p-5 font-mono text-[10px] uppercase tracking-[0.1em] text-white/60 sm:p-7">
            <span>EXPERIMENT PATH / {activeMode.number}</span>
            <span className="size-2 bg-[#2f6fed] shadow-[0_0_12px_#2f6fed]" />
          </div>

          <div
            aria-live="polite"
            className="flex flex-1 flex-col justify-center p-5 sm:p-8 lg:p-10"
          >
            <div className="relative space-y-3">
              {activeMode.stages.map((stage, index) => (
                <div key={stage}>
                  <div className="group flex min-h-[86px] items-center gap-5 border border-white/25 bg-[#19222e] p-5 transition-colors hover:border-[#78a7ff] hover:bg-[#223248]">
                    <span className="font-mono text-[10px] text-[#78a7ff]">
                      0{index + 1}
                    </span>

                    <span className="flex-1 text-[12px] font-semibold tracking-[0.06em] sm:text-[14px]">
                      {stage}
                    </span>

                    <span className="font-mono text-[12px] text-white/35 transition-colors group-hover:text-[#78a7ff]">
                      ↗
                    </span>
                  </div>

                  {index !== activeMode.stages.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="ml-[34px] h-5 w-px bg-[#78a7ff]/50"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 border-l-2 border-[#2f6fed] bg-[#2f6fed]/10 p-5">
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#78a7ff]">
                POSSIBLE OUTPUT / NOT A PREDETERMINED RESULT
              </span>

              <p className="mt-3 text-[15px] font-bold leading-[1.4] tracking-[-0.03em]">
                {activeMode.output}
              </p>
            </div>
          </div>

          <div className="border-t border-white/20 px-5 py-4 font-mono text-[9px] uppercase tracking-[0.1em] text-white/40 sm:px-8">
            EVERY EXPERIMENT STARTS WITH A QUESTION.
          </div>
        </div>
      </div>
    </section>
  );
}