import Link from "next/link";
import InteractiveExperiment from "./InteractiveExperiment";

export default function AboutHero() {
  return (
    <section className="grid min-h-[calc(100svh-76px)] w-full border-b-2 border-[#1c242b] bg-white text-[#1c242b] lg:grid-cols-[1.15fr_0.85fr]">
      {/* MAIN STATEMENT */}

      <div className="flex min-w-0 flex-col justify-between p-6 sm:p-10 lg:p-14">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em]">
          <span className="size-2 bg-[#2f6fed]" />
          PENTA LABS / ABOUT THE EXPERIMENT
        </div>

        <div className="my-14">
          <p className="mb-8 max-w-[540px] font-mono text-[11px] uppercase leading-[1.8] tracking-[0.13em] text-[#526477]">
            SOFTWARE. HARDWARE. IDEAS THAT DON&apos;T FIT
            NEATLY INTO EITHER CATEGORY.
          </p>

          <h1 className="text-[clamp(56px,7.7vw,132px)] leading-[0.88] font-bold tracking-[-0.095em]">
            WHAT
            <br />
            IF WE
            <br />
            <span className="text-[#2f6fed]">
              TRIED?
            </span>
          </h1>

          <p className="mt-10 max-w-[540px] text-[15px] leading-[1.8] text-[#526477] sm:text-[17px]">
            Penta Labs began with a simple idea: make
            room for the things worth trying. New ways
            of building. New ways of selling. New
            technologies, unexpected objects, and
            business models that challenge what comes
            next.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="#our-story"
            className="inline-flex min-h-12 items-center justify-center border-2 border-[#1c242b] bg-[#2f6fed] px-5 text-[11px] font-bold uppercase tracking-[0.08em] text-white shadow-[4px_4px_0_#1c242b] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#1c242b]"
          >
            GET TO KNOW US ↘
          </Link>

          <Link
            href="#the-lab"
            className="inline-flex min-h-12 items-center justify-center border-2 border-[#1c242b] bg-white px-5 text-[11px] font-bold uppercase tracking-[0.08em] transition-colors hover:bg-[#1c242b] hover:text-white"
          >
            ENTER THE LAB ↗
          </Link>
        </div>
      </div>

      {/* VISUAL STATEMENT */}

      <div className="h-screen w-full">
        <InteractiveExperiment />
      </div>
    </section>
  );
}