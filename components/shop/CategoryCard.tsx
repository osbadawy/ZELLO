import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { ShopCategory } from "./categories";

type CategoryCardProps = {
  category: ShopCategory;
  productCount: number;
};

type VisualType = ShopCategory["visual"] | "couch";

type ThemeConfig = {
  panel: string;
  orb: string;
  chip: string;
  accent: string;
  tint: string;
  iconBg: string;
};

function getTheme(category: ShopCategory, visualType: VisualType): ThemeConfig {
  if (category.id === "all") {
    return {
      panel: "from-[#e4e9f2] via-[#ccd8ea] to-[#95aacf]",
      orb: "bg-[#7fa2ff]/25",
      chip: "bg-white/45 text-[#3c4a63]",
      accent: "bg-[#A9C5FF]",
      tint: "from-[#8fb3ff]/18 via-[#6f8dff]/10 to-transparent",
      iconBg: "bg-[#eaf1ff]",
    };
  }

  if (visualType === "couch") {
    return {
      panel: "from-[#edf2ec] via-[#d3e0d1] to-[#a8c1b1]",
      orb: "bg-[#86c3a1]/25",
      chip: "bg-white/42 text-[#415249]",
      accent: "bg-[#9dd0b2]",
      tint: "from-[#9bd3b4]/20 via-[#8ec5a6]/10 to-transparent",
      iconBg: "bg-[#edf8f0]",
    };
  }

  if (visualType === "lamp") {
    return {
      panel: "from-[#f0eee8] via-[#e4ddd1] to-[#cbbfae]",
      orb: "bg-[#e1c18b]/24",
      chip: "bg-white/42 text-[#5b5040]",
      accent: "bg-[#e4c289]",
      tint: "from-[#edd1a0]/18 via-[#e2bd78]/10 to-transparent",
      iconBg: "bg-[#fff8ec]",
    };
  }

  if (visualType === "speaker") {
    return {
      panel: "from-[#dde7f4] via-[#b9cade] to-[#8099b8]",
      orb: "bg-[#88b4ff]/25",
      chip: "bg-white/42 text-[#3d4f67]",
      accent: "bg-[#A9C5FF]",
      tint: "from-[#8cb7ff]/18 via-[#7fa2ff]/10 to-transparent",
      iconBg: "bg-[#eef5ff]",
    };
  }

  if (visualType === "watch") {
    return {
      panel: "from-[#ebecef] via-[#d5dbe4] to-[#a0aec4]",
      orb: "bg-[#9db7e8]/25",
      chip: "bg-white/42 text-[#495468]",
      accent: "bg-[#b8c8ef]",
      tint: "from-[#bfd1ff]/18 via-[#9eb4dd]/10 to-transparent",
      iconBg: "bg-[#f2f5fb]",
    };
  }

  return {
    panel: "from-[#e3e8f1] via-[#c7d2e3] to-[#90a4c2]",
    orb: "bg-[#8aa9ff]/25",
    chip: "bg-white/42 text-[#3e5069]",
    accent: "bg-[#A9C5FF]",
    tint: "from-[#8fb3ff]/18 via-[#6f8dff]/10 to-transparent",
    iconBg: "bg-[#edf3ff]",
  };
}

function CategoryFigure({
  type,
  className = "",
}: {
  type: VisualType;
  className?: string;
}) {
  return (
    <div className={`relative h-full w-full ${className}`}>
      {type === "bag" && (
        <div className="relative mx-auto h-full w-full">
          <div className="absolute left-1/2 top-[16%] h-[15%] w-[22%] -translate-x-1/2 rounded-t-full border-[5px] border-b-0 border-[#3b4f63]" />
          <div className="absolute left-1/2 top-[27%] h-[50%] w-[42%] -translate-x-1/2 overflow-hidden rounded-[18px] bg-[linear-gradient(135deg,#41576d,#24394c_55%,#112031)] shadow-[0_18px_32px_rgba(13,24,36,0.22)]">
            <div className="absolute inset-y-0 left-0 w-[34%] bg-white/[0.07]" />
            <div className="absolute bottom-[13%] left-1/2 flex h-[22%] w-[58%] -translate-x-1/2 items-center justify-center rounded-[14px] border border-white/[0.12] bg-white/[0.05]">
              <span className="text-[clamp(10px,1vw,12px)] font-semibold tracking-[0.06em] text-white/72">
                ZELLO
              </span>
            </div>
          </div>
        </div>
      )}

      {type === "couch" && (
        <div className="relative mx-auto h-full w-full">
          <div className="absolute left-1/2 top-[23%] h-[24%] w-[66%] -translate-x-1/2 rounded-[30px] bg-[linear-gradient(180deg,#dce4df,#b5cdbd)] shadow-[0_18px_32px_rgba(31,53,39,0.16)]" />
          <div className="absolute left-[17%] top-[25%] h-[20%] w-[28%] rounded-[22px] bg-white/28" />
          <div className="absolute right-[17%] top-[25%] h-[20%] w-[28%] rounded-[22px] bg-white/18" />
          <div className="absolute left-1/2 top-[42%] h-[18%] w-[74%] -translate-x-1/2 rounded-[24px] bg-[linear-gradient(180deg,#324652,#1d2d37)] shadow-[0_22px_34px_rgba(13,24,36,0.18)]" />
          <div className="absolute left-[13%] top-[41%] h-[24%] w-[15%] rounded-[20px] bg-[linear-gradient(180deg,#e5eee7,#becfc3)]" />
          <div className="absolute right-[13%] top-[41%] h-[24%] w-[15%] rounded-[20px] bg-[linear-gradient(180deg,#e5eee7,#becfc3)]" />
          <div className="absolute left-[23%] top-[58%] h-[7%] w-[4%] rounded-b-md bg-[#506578]" />
          <div className="absolute right-[23%] top-[58%] h-[7%] w-[4%] rounded-b-md bg-[#506578]" />
        </div>
      )}

      {type === "lamp" && (
        <div className="relative mx-auto h-full w-full">
          <div className="absolute left-1/2 top-[20%] h-[16%] w-[16%] -translate-x-1/2 rounded-full bg-white/35 blur-[36px]" />
          <div className="absolute left-1/2 top-[17%] h-[24%] w-[52%] -translate-x-1/2 overflow-hidden rounded-t-[999px] rounded-b-[18px] bg-[linear-gradient(180deg,#f4f3ef,#d3d1c8)] shadow-[0_16px_28px_rgba(75,67,48,0.14)]">
            <div className="absolute bottom-0 left-[8%] h-[10%] w-[84%] rounded-full bg-black/6" />
          </div>
          <div className="absolute left-1/2 top-[39%] h-[28%] w-[4.5%] -translate-x-1/2 rounded-full bg-[linear-gradient(90deg,#90a3b6,#f4f6f8,#8ca0b1)]" />
          <div className="absolute left-1/2 top-[66%] h-[7%] w-[28%] -translate-x-1/2 rounded-t-full bg-[linear-gradient(180deg,#bac3cc,#93a1af)]" />
        </div>
      )}

      {type === "speaker" && (
        <div className="relative mx-auto h-full w-full">
          <div className="absolute left-1/2 top-[18%] h-[54%] w-[42%] -translate-x-1/2 overflow-hidden rounded-[34px] bg-[linear-gradient(180deg,#30475b,#1e3346_55%,#122233)] shadow-[0_22px_36px_rgba(13,24,36,0.24)]">
            <div className="absolute left-[13%] top-[14%] h-[58%] w-[74%] rounded-full border-[6px] border-[#5b7692]" />
            <div className="absolute left-[24%] top-[25%] h-[36%] w-[52%] rounded-full border border-white/14 bg-[radial-gradient(circle_at_center,#4c6a86_0%,#263b4f_42%,#142435_75%)]" />
            <div className="absolute left-[35%] top-[36%] h-[14%] w-[30%] rounded-full bg-white/10" />
            <div className="absolute bottom-[11%] left-1/2 h-[4px] w-[4px] -translate-x-1/2 rounded-full bg-[#A9C5FF]" />
            <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 text-[clamp(8px,1vw,10px)] font-semibold tracking-[0.08em] text-white/65">
              ZELLO
            </div>
          </div>
        </div>
      )}

      {type === "watch" && (
        <div className="relative mx-auto h-full w-full">
          <div className="absolute left-1/2 top-[8%] h-[28%] w-[18%] -translate-x-1/2 rounded-t-[28px] bg-[linear-gradient(90deg,#4f6579,#273c4f,#52677b)]" />
          <div className="absolute left-1/2 top-[56%] h-[28%] w-[18%] -translate-x-1/2 rounded-b-[28px] bg-[linear-gradient(90deg,#4f6579,#273c4f,#52677b)]" />
          <div className="absolute left-1/2 top-[28%] flex h-[36%] w-[40%] -translate-x-1/2 items-center justify-center rounded-[32px] bg-[linear-gradient(180deg,#dce4ec,#9eaebe)] shadow-[0_18px_30px_rgba(13,24,36,0.2)]">
            <div className="relative flex h-[88%] w-[88%] flex-col items-center justify-center rounded-[26px] bg-[linear-gradient(180deg,#122131,#09131f)]">
              <span className="text-[clamp(19px,2.1vw,34px)] font-semibold tracking-[-0.08em] text-white">
                12:08
              </span>
              <span className="mt-1 text-[clamp(6px,0.7vw,9px)] font-medium uppercase tracking-[0.18em] text-[#A9C5FF]">
                MON 08
              </span>
              <span className="absolute bottom-[12%] size-[3px] rounded-full bg-[#A9C5FF]" />
            </div>
          </div>
          <div className="absolute left-[69%] top-[40%] h-[8%] w-[2.6%] rounded-r-full bg-[#b8c8d9]" />
        </div>
      )}
    </div>
  );
}

export default function CategoryCard({
  category,
  productCount,
}: CategoryCardProps) {
  const isFeatured = category.layout === "featured";
  const isWide = category.layout === "wide";
  const isAll = category.id === "all";
  const visualType: VisualType = category.id === "home" ? "couch" : category.visual;
  const theme = getTheme(category, visualType);

  const href = category.id === "all" ? "/shop" : `/shop/${category.id}`;

  const spanClass = isFeatured
    ? "sm:col-span-2 lg:col-span-7 lg:row-span-2"
    : isWide
      ? "sm:col-span-2 lg:col-span-5 lg:row-span-2"
      : "lg:col-span-4 lg:row-span-2";

  return (
    <Link
      href={href}
      aria-label={`Explore ${category.name}`}
      className={`group relative isolate flex min-h-[380px] min-w-0 flex-col overflow-hidden rounded-[30px] border border-white/[0.12] bg-white/[0.045] text-white shadow-[0_12px_42px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-500 ease-out hover:-translate-y-1 hover:border-white/[0.25] hover:bg-white/[0.065] hover:shadow-[0_24px_70px_rgba(0,0,0,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A9C5FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080E18] ${spanClass}`}
    >
      <div
        aria-hidden="true"
        className={`absolute inset-0 bg-gradient-to-br ${theme.tint}`}
      />

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -right-[14%] top-[6%] h-[54%] w-[54%] rounded-full blur-[75px] transition-transform duration-700 group-hover:scale-110 ${theme.orb}`}
      />

      <div className="relative z-10 flex h-full flex-col">
        <div className="relative flex-1 overflow-hidden rounded-b-[28px] rounded-t-[30px]">
          <div
            className={`absolute inset-x-0 top-0 h-[68%] bg-gradient-to-br ${theme.panel}`}
          />

          <div className="absolute inset-x-0 top-0 h-[68%] bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.55),transparent_62%)]" />

          <div className="absolute inset-x-0 top-0 h-[68%] bg-gradient-to-b from-white/[0.10] via-transparent to-[#08111f]/10" />

          <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 pt-4 sm:px-5 sm:pt-5">
            <span className={`inline-flex min-h-7 items-center rounded-full border border-white/35 px-3 text-[10px] font-semibold tracking-[-0.01em] shadow-[0_2px_8px_rgba(255,255,255,0.08)] backdrop-blur-xl ${theme.chip}`}>
              {category.number} / {category.id.toUpperCase()}
            </span>

            <span
              className={`flex size-10 items-center justify-center rounded-full border border-white/30 text-[#243548] shadow-[0_4px_14px_rgba(0,0,0,0.05)] transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${theme.iconBg}`}
            >
              <ArrowUpRight size={17} strokeWidth={1.8} />
            </span>
          </div>

          {!isAll ? (
            <div
              className={`absolute left-1/2 top-[18%] z-[2] w-[80%] -translate-x-1/2 transition-transform duration-500 group-hover:scale-[1.03] ${
                isFeatured ? "h-[52%]" : isWide ? "h-[50%]" : "h-[48%]"
              }`}
            >
              <CategoryFigure type={visualType} />
            </div>
          ) : (
            <div className="absolute inset-x-[8%] top-[16%] z-[2] grid h-[48%] grid-cols-3 items-end gap-2 transition-transform duration-500 group-hover:scale-[1.03] sm:gap-3">
              <CategoryFigure type="bag" className="translate-y-4" />
              <CategoryFigure type="speaker" />
              <CategoryFigure type="watch" className="translate-y-2" />
            </div>
          )}

          <div className="absolute bottom-[calc(32%-14px)] left-4 z-10 sm:left-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-3 py-1.5 text-[10px] font-medium tracking-[0.01em] text-white/78 backdrop-blur-xl">
              <span className={`size-1.5 rounded-full ${theme.accent}`} />
              {category.subtitle}
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-[3] bg-[#08111f]/88 p-5 backdrop-blur-2xl sm:p-6">
            <div className="mb-2 flex items-center gap-2">
              <span className={`size-1.5 rounded-full ${theme.accent}`} />
              <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-white/45">
                {isFeatured ? "Featured collection" : "Explore category"}
              </span>
            </div>

            <h3
              className={`font-semibold tracking-[-0.05em] text-white ${
                isFeatured
                  ? "text-[clamp(2rem,3.4vw,3rem)] leading-[1.03]"
                  : isWide
                    ? "text-[clamp(1.75rem,2.8vw,2.6rem)] leading-[1.05]"
                    : "text-[clamp(1.55rem,2vw,2.1rem)] leading-[1.08]"
              }`}
            >
              {category.name}
            </h3>

            <p
              className={`mt-3 text-[12px] leading-[1.7] tracking-[-0.01em] text-white/45 ${
                isFeatured ? "max-w-[460px] sm:text-[13px]" : "max-w-[320px]"
              }`}
            >
              {category.description}
            </p>

            <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/[0.08] pt-4">
              <div>
                <span className="mb-1 block text-[10px] font-medium text-white/30">
                  Products
                </span>
                <span className="text-[14px] font-semibold tracking-[-0.02em] text-white">
                  {String(productCount).padStart(2, "0")}
                </span>
              </div>

              <span className="inline-flex items-center gap-2 text-[11px] font-medium text-white/70 transition-all duration-300 group-hover:gap-3 group-hover:text-white">
                Explore
                <ArrowUpRight size={14} strokeWidth={1.7} />
              </span>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
        </div>
      </div>
    </Link>
  );
}