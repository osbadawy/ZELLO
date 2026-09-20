import Link from "next/link";

import AboutHero from "./AboutHero";
import AboutLab from "./AboutLab";

const PRINCIPLES = [
  {
    number: "01",
    title: "STAY CURIOUS.",
    description:
      "The most interesting ideas rarely arrive fully formed. We make room to explore them before deciding what they should become.",
  },
  {
    number: "02",
    title: "MAKE IT REAL.",
    description:
      "A thought becomes more valuable when it meets the real world. We like working prototypes, tangible objects, useful software, and ideas people can actually experience.",
  },
  {
    number: "03",
    title: "QUESTION THE DEFAULT.",
    description:
      "A business model, a familiar workflow, or an everyday product can always be reconsidered. We are interested in what changes when someone asks: why not differently?",
  },
  {
    number: "04",
    title: "FOLLOW THE DISCOVERY.",
    description:
      "Not every experiment leads where we expect. Sometimes the original idea changes completely. That possibility is part of why we started.",
  },
];

export default function AboutPage() {
  return (
    <div className="w-full bg-[#f3f5f7] text-[#1c242b]">
      <AboutHero />

      {/* ORIGIN STORY */}

      <section
        id="our-story"
        aria-labelledby="about-story-title"
        className="mx-auto grid w-[calc(100%-20px)] max-w-[1440px] scroll-mt-24 border-x-2 border-b-2 border-[#1c242b] bg-white sm:w-[calc(100%-32px)] lg:grid-cols-[0.38fr_0.62fr]"
      >
        <div className="flex min-h-[270px] flex-col justify-between border-b-2 border-[#1c242b] bg-[#e8efff] p-6 sm:p-10 lg:border-r-2 lg:border-b-0">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#2f6fed]">
            01 / HOW IT STARTED
          </span>

          <p className="text-[clamp(40px,4vw,68px)] leading-[1] font-bold tracking-[-0.08em]">
            AN IDEA.
            <br />
            <span className="text-[#2f6fed]">
              NOT A BOX.
            </span>
          </p>

          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#526477]">
            PENTA LABS / THE BEGINNING
          </span>
        </div>

        <div className="p-6 sm:p-10 lg:p-14">
          <h2
            id="about-story-title"
            className="text-[clamp(34px,4.4vw,64px)] leading-[1.04] font-bold tracking-[-0.075em]"
          >
            WE DIDN&apos;T START WITH
            <br />
            ONE THING TO SELL.
          </h2>

          <div className="mt-9 max-w-[680px] space-y-6 text-[14px] leading-[1.9] text-[#526477] sm:text-[16px]">
            <p>
              Penta Labs was started by{" "}
              <strong className="font-semibold text-[#1c242b]">
                Omar Badawy and Mohamed Desouky
              </strong>{" "}
              as an experiment in what happens when
              creative digital innovation meets the
              ambition to build new kinds of businesses.
            </p>

            <p>
              The starting point wasn&apos;t a single
              product, industry, or fixed destination.
              It was the desire to try new and
              innovative ways of building and selling—
              and to see where those experiments could
              take us.
            </p>

            <p>
              That curiosity moves between the digital
              and physical worlds. One day, it might
              become a software system for a company.
              Another day, it might mean exploring new
              technology, reviewing an everyday object,
              or questioning how a familiar product
              could reach people in a different way.
            </p>

            <p className="font-medium text-[#1c242b]">
              Different outputs. The same instinct:
              experiment, create, and keep asking
              what&apos;s possible.
            </p>
          </div>
        </div>
      </section>

      {/* TWO WORLDS */}

      <section
        aria-labelledby="about-worlds-title"
        className="mx-auto w-[calc(100%-20px)] max-w-[1440px] border-x-2 border-b-2 border-[#1c242b] bg-white sm:w-[calc(100%-32px)]"
      >
        <div className="border-b-2 border-[#1c242b] p-6 sm:p-10">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#2f6fed]">
            THE SPACE WE WORK IN
          </span>

          <h2
            id="about-worlds-title"
            className="mt-5 text-[clamp(36px,5vw,72px)] leading-[0.98] font-bold tracking-[-0.075em]"
          >
            WE BUILD SOFTWARE.
            <br />
            <span className="text-[#2f6fed]">
              WE SELL HARDWARE.
            </span>
          </h2>

          <p className="mt-6 max-w-[600px] text-[14px] leading-[1.8] text-[#526477]">
            And we are just as interested in what
            happens between the two.
          </p>
        </div>

        <div className="grid gap-[2px] bg-[#1c242b] lg:grid-cols-2">
          {/* DIGITAL */}

          <article className="group flex min-h-[420px] flex-col justify-between bg-white p-6 transition-colors duration-300 hover:bg-[#101419] hover:text-white sm:p-10">
            <div className="flex items-start justify-between gap-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#2f6fed]">
                001 / DIGITAL
              </span>

              <span className="text-3xl text-[#2f6fed]">
                ↗
              </span>
            </div>

            <div className="my-12">
              <div
                aria-hidden="true"
                className="mb-8 grid h-[100px] max-w-[250px] grid-cols-3 gap-2"
              >
                <div className="border border-[#2f6fed] bg-[#2f6fed]/10" />
                <div className="col-span-2 border border-[#2f6fed] bg-[#2f6fed]/20" />
                <div className="col-span-2 border border-[#2f6fed] bg-[#2f6fed]/10" />
                <div className="border border-[#2f6fed] bg-[#2f6fed]/30" />
              </div>

              <h3 className="text-[clamp(38px,4vw,64px)] leading-[0.95] font-bold tracking-[-0.075em]">
                SYSTEMS
                <br />
                THAT WORK.
              </h3>

              <p className="mt-6 max-w-[420px] text-[13px] leading-[1.8] text-[#526477] transition-colors group-hover:text-white/65">
                Custom software, digital experiences,
                connected infrastructure, and new
                ways for businesses to operate.
              </p>
            </div>

            <Link
              href="/system"
              className="flex min-h-12 items-center justify-between border-t border-[#1c242b]/30 pt-4 font-mono text-[10px] font-bold tracking-[0.08em] transition-colors group-hover:border-white/30 hover:text-[#78a7ff]"
            >
              EXPLORE CUSTOM SYSTEMS
              <span>↗</span>
            </Link>
          </article>

          {/* PHYSICAL */}

          <article className="group flex min-h-[420px] flex-col justify-between bg-white p-6 transition-colors duration-300 hover:bg-[#101419] hover:text-white sm:p-10">
            <div className="flex items-start justify-between gap-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#2f6fed]">
                002 / PHYSICAL
              </span>

              <span className="text-3xl text-[#2f6fed]">
                ↗
              </span>
            </div>

            <div className="my-12">
              <div
                aria-hidden="true"
                className="relative mb-8 h-[100px] max-w-[250px]"
              >
                <div className="absolute top-0 left-0 size-[76px] border border-[#2f6fed] bg-[#2f6fed]/10" />
                <div className="absolute top-3 left-10 size-[76px] border border-[#2f6fed] bg-[#2f6fed]/20" />
                <div className="absolute top-6 left-20 size-[76px] border border-[#2f6fed] bg-[#2f6fed]/30" />
              </div>

              <h3 className="text-[clamp(38px,4vw,64px)] leading-[0.95] font-bold tracking-[-0.075em]">
                OBJECTS
                <br />
                WORTH TRYING.
              </h3>

              <p className="mt-6 max-w-[420px] text-[13px] leading-[1.8] text-[#526477] transition-colors group-hover:text-white/65">
                Hardware, emerging technology, and
                household items that spark curiosity,
                solve problems, or simply make life
                more interesting.
              </p>
            </div>

            <Link
              href="/shop"
              className="flex min-h-12 items-center justify-between border-t border-[#1c242b]/30 pt-4 font-mono text-[10px] font-bold tracking-[0.08em] transition-colors group-hover:border-white/30 hover:text-[#78a7ff]"
            >
              EXPLORE THE SHOP
              <span>↗</span>
            </Link>
          </article>
        </div>
      </section>

      {/* INTERACTIVE LAB INDEX */}

      <div className="mx-auto w-[calc(100%-20px)] max-w-[1440px] border-x-2 sm:w-[calc(100%-32px)]">
        <AboutLab />
      </div>

      {/* FOUNDERS */}

      <section
        aria-labelledby="about-founders-title"
        className="mx-auto w-[calc(100%-20px)] max-w-[1440px] border-x-2 border-b-2 border-[#1c242b] bg-white sm:w-[calc(100%-32px)]"
      >
        <div className="border-b-2 border-[#1c242b] p-6 sm:p-10 lg:p-14">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#2f6fed]">
            03 / THE PEOPLE WHO STARTED IT
          </span>

          <h2
            id="about-founders-title"
            className="mt-5 text-[clamp(44px,6vw,88px)] leading-[0.94] font-bold tracking-[-0.085em]"
          >
            TWO FOUNDERS.
            <br />
            <span className="text-[#2f6fed]">
              AN OPEN QUESTION.
            </span>
          </h2>

          <p className="mt-7 max-w-[630px] text-[14px] leading-[1.8] text-[#526477]">
            Penta Labs started with Omar and Mohamed
            wanting to explore what could happen when
            creative ideas are given the freedom to
            become something real.
          </p>
        </div>

        <div className="grid gap-[2px] bg-[#1c242b] md:grid-cols-2">
          {[
            {
              number: "01",
              name: "OMAR BADAWY",
              initials: "OB",
            },
            {
              number: "02",
              name: "MOHAMED DESOUKY",
              initials: "MD",
            },
          ].map((founder) => (
            <article
              key={founder.number}
              className="group flex min-h-[290px] flex-col justify-between bg-[#f3f5f7] p-6 transition-colors duration-300 hover:bg-[#e8efff] sm:p-10"
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#526477]">
                  FOUNDER / {founder.number}
                </span>

                <span className="font-mono text-[10px] text-[#2f6fed]">
                  P/L
                </span>
              </div>

              <div className="flex items-end justify-between gap-4">
                <h3 className="text-[clamp(35px,4vw,64px)] leading-[0.94] font-bold tracking-[-0.075em]">
                  {founder.name}
                  <span className="text-[#2f6fed]">
                    .
                  </span>
                </h3>

                <span className="hidden shrink-0 font-mono text-[44px] leading-none text-[#2f6fed]/25 sm:block">
                  {founder.initials}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* PRINCIPLES */}

      <section
        aria-labelledby="about-principles-title"
        className="mx-auto w-[calc(100%-20px)] max-w-[1440px] border-x-2 border-b-2 border-[#1c242b] bg-white sm:w-[calc(100%-32px)]"
      >
        <div className="border-b-2 border-[#1c242b] p-6 sm:p-10">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#2f6fed]">
            04 / HOW WE THINK
          </span>

          <h2
            id="about-principles-title"
            className="mt-5 text-[clamp(40px,5.5vw,78px)] leading-[0.95] font-bold tracking-[-0.08em]"
          >
            THE MINDSET
            <br />
            <span className="text-[#2f6fed]">
              BEHIND THE LAB.
            </span>
          </h2>
        </div>

        <div className="grid gap-[2px] bg-[#1c242b] sm:grid-cols-2">
          {PRINCIPLES.map((principle) => (
            <article
              key={principle.number}
              className="group flex min-h-[260px] flex-col justify-between bg-white p-6 transition-colors duration-300 hover:bg-[#101419] hover:text-white sm:p-9"
            >
              <span className="font-mono text-[10px] text-[#2f6fed]">
                {principle.number} / 04
              </span>

              <div className="mt-12">
                <h3 className="text-[clamp(26px,3vw,44px)] leading-[1.05] font-bold tracking-[-0.06em]">
                  {principle.title}
                </h3>

                <p className="mt-5 max-w-[470px] text-[13px] leading-[1.8] text-[#526477] transition-colors group-hover:text-white/65">
                  {principle.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FINAL MANIFESTO */}

      <section className="mx-auto w-[calc(100%-20px)] max-w-[1440px] border-x-2 border-b-2 border-[#1c242b] bg-[#101419] text-white sm:w-[calc(100%-32px)]">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
          <div className="flex min-h-[480px] flex-col justify-between p-6 sm:p-10 lg:p-14">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#78a7ff]">
              PENTA LABS / AN OPEN-ENDED EXPERIMENT
            </span>

            <h2 className="my-14 text-[clamp(43px,6vw,88px)] leading-[0.98] font-bold tracking-[-0.085em]">
              CREATIVITY
              <br />
              IS THE
              <br />
              <span className="text-[#2f6fed]">
                SEED.
              </span>
            </h2>

            <p className="max-w-[500px] text-[14px] leading-[1.9] text-white/65 sm:text-[16px]">
              We create the conditions for ideas to
              grow. Some become software. Some become
              products. Some become entirely new
              businesses. And some simply teach us
              something we did not know before.
            </p>
          </div>

          <div className="flex flex-col justify-between border-t-2 border-white/20 bg-[#19222e] p-6 sm:p-10 lg:border-t-0 lg:border-l-2 lg:border-white/20 lg:p-14">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#78a7ff]">
                THE PART WE LOVE MOST
              </span>

              <p className="mt-10 text-[clamp(28px,3.5vw,48px)] leading-[1.12] font-bold tracking-[-0.065em]">
                WE NEVER KNOW EXACTLY WHAT WILL GROW
                FROM IT.
              </p>
            </div>

            <div className="mt-14 space-y-3">
              <Link
                href="/system"
                className="flex min-h-14 items-center justify-between border-2 border-white bg-[#2f6fed] px-5 text-[11px] font-bold uppercase tracking-[0.07em] transition-colors hover:bg-white hover:text-[#1c242b]"
              >
                BUILD WITH PENTA LABS
                <span>↗</span>
              </Link>

              <Link
                href="/shop"
                className="flex min-h-14 items-center justify-between border border-white/40 px-5 text-[11px] font-bold uppercase tracking-[0.07em] transition-colors hover:border-white hover:bg-white hover:text-[#1c242b]"
              >
                EXPLORE WHAT WE SELL
                <span>↗</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}