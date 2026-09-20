import Link from "next/link";

import BlueprintVisual, { type BlueprintType } from "./BlueprintVisual";
import type { ShopCategory } from "./categories";


type CategoryCardProps = {
  category: ShopCategory;
  productCount: number;
};

export default function CategoryCard({
  category,
  productCount,
}: CategoryCardProps) {
  const isFeatured =
    category.layout === "featured";

  const isWide =
    category.layout === "wide";

  const isHome =
    category.id === "home";

  const href =
    category.id === "all"
      ? "/shop"
      : `/shop/${category.id}`;

  const visualType: BlueprintType =
    isHome ? "couch" : category.visual;

  return (
    <Link
      href={href}
      aria-label={`Explore ${category.name}`}
      className={[
        "group relative isolate flex min-w-0 flex-col",
        "min-h-[420px] bg-white text-[#1c242b]",
        "transition-[background-color,color] duration-500 ease-out",
        "hover:bg-[#101214] hover:text-white",
        "focus-visible:bg-[#101214] focus-visible:text-white",
        "focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#2f6fed]",
        isFeatured
          ? "sm:col-span-2 lg:row-span-2 lg:min-h-[850px]"
          : "",
        isWide
          ? "sm:col-span-2 lg:col-span-3"
          : "",
      ].join(" ")}
    >
      {/* BACKGROUND BLUEPRINT GRID */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* LIGHT GRID */}

        <div
          className="absolute inset-0 opacity-100 transition-opacity duration-500 group-hover:opacity-0 group-focus-visible:opacity-0"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(24,52,84,0.07) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(24,52,84,0.07) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "28px 28px",
          }}
        />

        {/* DARK HOVER GRID */}

        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(120,167,255,0.08) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(120,167,255,0.08) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "28px 28px",
          }}
        />

        {/* LARGE TECHNICAL GRID */}

        <div
          className="absolute inset-0 opacity-40 transition-opacity duration-500 group-hover:opacity-70"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(24,52,84,0.12) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(24,52,84,0.12) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "140px 140px",
          }}
        />

        {/* BLUE GLOW — APPEARS ON HOVER */}

        <div className="absolute top-[5%] right-[-10%] h-[75%] w-[85%] rounded-full bg-[#2f6fed]/0 blur-[90px] transition-colors duration-700 group-hover:bg-[#2f6fed]/15 group-focus-visible:bg-[#2f6fed]/15" />

        {/* BLUEPRINT PRODUCT DRAWING */}

        {isWide ? (
          <div className="absolute top-[1%] right-[1%] flex h-[73%] w-[95%] items-center justify-end opacity-55 transition-opacity duration-500 group-hover:opacity-90 group-focus-visible:opacity-90 sm:w-[76%] lg:w-[62%]">
            <div className="grid h-full w-full grid-cols-3 items-center gap-1 text-[#183454] transition-colors duration-500 group-hover:text-white/85 group-focus-visible:text-white/85">
              <BlueprintVisual type="bag" />

              <BlueprintVisual type="couch" />

              <BlueprintVisual type="watch" />
            </div>
          </div>
        ) : (
          <div
            className={[
              "absolute text-[#183454]",
              "opacity-55 transition-[color,opacity,transform] duration-700",
              "group-hover:scale-[1.04] group-hover:text-white/85 group-hover:opacity-90",
              "group-focus-visible:text-white/85 group-focus-visible:opacity-90",
              isFeatured
                ? "top-[7%] right-[2%] h-[67%] w-[87%]"
                : "top-[3%] right-[1%] h-[72%] w-[83%]",
            ].join(" ")}
          >
            <BlueprintVisual type={visualType} />
          </div>
        )}

        {/* LIGHT CONTENT FADE */}

        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 via-30% to-transparent opacity-100 transition-opacity duration-500 group-hover:opacity-0 group-focus-visible:opacity-0" />

        {/* DARK CONTENT FADE */}

        <div className="absolute inset-0 bg-gradient-to-t from-[#101214] via-[#101214]/90 via-30% to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />

        {/* HOVER BORDER */}

        <div className="absolute inset-0 border border-transparent transition-colors duration-500 group-hover:border-[#2f6fed]/60 group-focus-visible:border-[#2f6fed]/60" />
      </div>

      {/* TOP INFORMATION */}

      <div className="relative z-10 flex w-full items-start justify-between gap-4 p-6 sm:p-7">
        <div className="flex min-w-0 flex-col gap-2">
          <span className="font-mono text-[10px] tracking-[0.14em] text-[#526477] transition-colors duration-500 group-hover:text-white/65 group-focus-visible:text-white/65">
            P/L — {category.number}
          </span>

          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#526477] transition-colors duration-500 group-hover:text-white/45 group-focus-visible:text-white/45">
            CATEGORY / {category.id}
          </span>
        </div>

        <span className="flex size-10 shrink-0 items-center justify-center border border-[#1c242b] bg-white text-lg text-[#1c242b] transition-[background-color,border-color,color,transform] duration-500 group-hover:rotate-45 group-hover:border-[#2f6fed] group-hover:bg-[#2f6fed] group-hover:text-white group-focus-visible:rotate-45 group-focus-visible:border-[#2f6fed] group-focus-visible:bg-[#2f6fed] group-focus-visible:text-white">
          ↗
        </span>
      </div>

      {/* FEATURED LABEL */}

      {isFeatured && (
        <div className="relative z-10 mx-6 mt-4 hidden w-fit border border-[#1c242b]/30 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.15em] text-[#526477] transition-colors duration-500 group-hover:border-white/30 group-hover:text-white/60 group-focus-visible:border-white/30 group-focus-visible:text-white/60 sm:mx-7 sm:block">
          FEATURED COLLECTION / 001
        </div>
      )}

      {/* CATEGORY CONTENT */}

      <div className="relative z-10 mt-auto w-full min-w-0 p-6 pt-20 sm:p-7 sm:pt-24">
        {/* SUBTITLE */}

        <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[#526477] transition-colors duration-500 group-hover:text-white/65 group-focus-visible:text-white/65">
          <span className="size-1.5 shrink-0 rounded-full bg-[#183454] transition-[background-color,box-shadow] duration-500 group-hover:bg-[#2f6fed] group-hover:shadow-[0_0_12px_rgba(47,111,237,0.9)] group-focus-visible:bg-[#2f6fed]" />

          {category.subtitle}
        </div>

        {/* CATEGORY NAME */}

        <h3
          className={[
            "max-w-full break-words font-bold",
            "tracking-[-0.065em]",
            "transition-colors duration-500",
            isFeatured
              ? "text-[clamp(46px,6vw,94px)] leading-[1.02]"
              : isWide
                ? "text-[clamp(38px,5vw,72px)] leading-[1.05]"
                : "text-[clamp(30px,3vw,45px)] leading-[1.05]",
          ].join(" ")}
        >
          {category.name}
        </h3>

        {/* DESCRIPTION */}

        <p
          className={[
            "mt-4 max-w-[320px] text-[12px] leading-[1.7]",
            "text-[#526477] transition-colors duration-500",
            "group-hover:text-white/65 group-focus-visible:text-white/65",
            isFeatured
              ? "sm:max-w-[420px] sm:text-[14px]"
              : "",
          ].join(" ")}
        >
          {category.description}
        </p>

        {/* BOTTOM INFORMATION */}

        <div className="mt-8 flex w-full flex-wrap items-center justify-between gap-4 border-t border-[#1c242b]/20 pt-5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors duration-500 group-hover:border-white/25 group-focus-visible:border-white/25">
          <span className="text-[#526477] transition-colors duration-500 group-hover:text-white/50 group-focus-visible:text-white/50">
            {String(productCount).padStart(
              2,
              "0",
            )}{" "}
            OBJECTS
          </span>

          <span className="flex items-center gap-3 text-[#183454] transition-[color,gap] duration-300 group-hover:gap-5 group-hover:text-[#78a7ff] group-focus-visible:gap-5 group-focus-visible:text-[#78a7ff]">
            EXPLORE

            <span>↗</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
