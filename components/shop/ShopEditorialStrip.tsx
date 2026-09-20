import Link from "next/link";

export default function ShopEditorialStrip() {
  return (
    <section  className="mx-auto w-[calc(100%-20px)] max-w-[1440px] border-x-2 border-b-2 border-[#1c242b] bg-[#101214] text-white sm:w-[calc(100%-32px)]">
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="p-6 sm:p-10 lg:p-14">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/45">
            PENTA LABS / THE PHILOSOPHY
          </span>

          <h2 className="mt-10 text-[clamp(40px,6vw,84px)] leading-[1.05] font-bold tracking-[-0.085em]">
            LESS NOISE.
            <br />

            <span className="text-[#2f6fed]">
              MORE SIGNAL.
            </span>
          </h2>
        </div>

        <div className="flex flex-col justify-end border-t border-white/20 p-6 sm:p-10 lg:border-t-0 lg:border-l">
          <p className="max-w-[350px] text-[13px] leading-[1.7] text-white/60">
            A curated collection of modern
            essentials. Designed to make the
            useful feel considered.
          </p>

          <Link
            href="/#system"
            className="mt-8 flex items-center justify-between border-t border-white/30 pt-4 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors hover:text-[#78a7ff]"
          >
            DISCOVER OUR SYSTEM

            <span>↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
