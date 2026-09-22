"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Award, Sparkles, Star } from "lucide-react";

type RatingValues = {
  dailyUseRating: number | null;
  reliabilityRating: number | null;
  qualityRating: number | null;
  recommendRating: number | null;
  overallRating: number | null;
};

type RatedProduct = RatingValues & {
  id: string;
  name: string;
  slug: string;
};

type RatingsData = {
  ratedProducts: number;
  totalActiveProducts: number;
  averages: RatingValues;
  topProducts: RatedProduct[];
};

const ratingCategories = [
  { key: "dailyUseRating", label: "Daily use", color: "#A9C5FF" },
  { key: "reliabilityRating", label: "Reliability", color: "#86E0C1" },
  { key: "qualityRating", label: "Quality", color: "#C3ADFF" },
  { key: "recommendRating", label: "Recommendation", color: "#E8C59B" },
  { key: "overallRating", label: "Overall", color: "#FFFFFF" },
] as const;

function RatingBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number | null;
  color: string;
}) {
  return (
    <div>
      <div className="mb-2.5 flex items-center justify-between gap-4">
        <span className="text-[12px] text-white/55">
          {label}
        </span>

        <span className="text-[12px] font-semibold tabular-nums text-white/90">
          {value != null ? value.toFixed(1) : "—"}

          <span className="ml-1 font-normal text-white/30">
            / 10
          </span>
        </span>
      </div>

      <div className="h-[5px] overflow-hidden rounded-full bg-white/[0.08]">
        <div
          className="h-full rounded-full transition-[width] duration-700"
          style={{
            width: `${Math.max(0, Math.min(100, (value ?? 0) * 10))}%`,
            backgroundColor: color,
            boxShadow: `0 0 15px ${color}40`,
          }}
        />
      </div>
    </div>
  );
}

export default function ProductRatings() {
  const [data, setData] = useState<RatingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadRatings() {
      try {
        const response = await fetch("/api/admin/dashboard/ratings", {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) throw new Error("Unable to load product ratings.");

        const result: RatingsData = await response.json();

        setData(result);
      } catch (error) {
        if (controller.signal.aborted) return;

        setError(error instanceof Error ? error.message : "Unable to load ratings.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadRatings();

    return () => controller.abort();
  }, []);

  const ratingCoverage = data?.totalActiveProducts
    ? Math.round((data.ratedProducts / data.totalActiveProducts) * 100)
    : 0;

  return (
    <section
      aria-labelledby="product-ratings-title"
      className="relative isolate overflow-hidden rounded-[30px] border border-white/[0.10] bg-white/[0.045] p-6 shadow-[0_16px_60px_rgba(0,0,0,0.12)] backdrop-blur-2xl sm:p-8"
    >
      {/* AMBIENT GLOW */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 -z-10 size-[400px] rounded-full bg-[#608bff]/[0.07] blur-[100px]" />

      {/* HEADER */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-xl border border-[#A9C5FF]/15 bg-[#A9C5FF]/10">
              <Star size={15} className="text-[#A9C5FF]" />
            </span>

            <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#A9C5FF]/75">
              Product intelligence
            </span>
          </div>

          <h2 id="product-ratings-title" className="text-[23px] font-semibold tracking-[-0.045em] text-white">
            Product ratings
          </h2>

          <p className="mt-2 text-[12px] leading-relaxed text-white/40">
            Understand the strengths of your curated collection.
          </p>
        </div>

        <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]">
          <Sparkles size={17} className="text-white/50" />
        </div>
      </div>

      {error && (
        <div role="alert" className="mb-6 rounded-xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-[12px] text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-5 animate-pulse">
          <div className="h-28 rounded-2xl bg-white/[0.05]" />
          <div className="h-48 rounded-2xl bg-white/[0.05]" />
          <div className="h-40 rounded-2xl bg-white/[0.05]" />
        </div>
      ) : data ? (
        <>
          {/* RATING SUMMARY */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-6 rounded-[22px] border border-white/[0.08] bg-[#A9C5FF]/[0.045] p-5">
            <div>
              <span className="text-[11px] text-white/45">
                Average overall rating
              </span>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-[clamp(2.8rem,5vw,4rem)] font-semibold leading-none tracking-[-0.07em] text-white">
                  {data.averages.overallRating?.toFixed(1) ?? "—"}
                </span>

                <span className="text-[16px] text-white/35">
                  / 10
                </span>
              </div>

              <p className="mt-3 text-[11px] text-white/35">
                {data.ratedProducts} rated active products
              </p>
            </div>

            <div className="flex size-20 items-center justify-center rounded-full border border-[#A9C5FF]/20 bg-[#A9C5FF]/10">
              <Award size={33} strokeWidth={1.3} className="text-[#A9C5FF]" />
            </div>
          </div>

          {/* CATEGORY BREAKDOWN */}
          <div>
            <div className="mb-5 flex items-center justify-between gap-3">
              <h3 className="text-[13px] font-semibold text-white/85">
                Rating breakdown
              </h3>

              <span className="text-[10px] text-white/35">
                Average scores
              </span>
            </div>

            <div className="space-y-5">
              {ratingCategories.map((category) => (
                <RatingBar
                  key={category.key}
                  label={category.label}
                  value={data.averages[category.key]}
                  color={category.color}
                />
              ))}
            </div>
          </div>

          {/* TOP RATED PRODUCTS */}
          <div className="mt-9 border-t border-white/[0.08] pt-7">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-[13px] font-semibold text-white/85">
                  Highest-rated products
                </h3>

                <p className="mt-1 text-[11px] text-white/35">
                  Ranked by overall product rating
                </p>
              </div>

              <ArrowUpRight size={16} className="text-white/30" />
            </div>

            {data.topProducts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 px-5 py-8 text-center">
                <Star size={20} className="mx-auto mb-3 text-white/25" />

                <p className="text-[12px] text-white/45">
                  No rated products yet.
                </p>

                <p className="mt-1 text-[11px] text-white/30">
                  Add ratings to your products to see them here.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {data.topProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="group flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.05]"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.05] text-[11px] font-semibold text-white/50">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-medium text-white/85">
                        {product.name}
                      </p>

                      <p className="mt-1 text-[10px] text-white/30">
                        Overall product score
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#A9C5FF]/15 bg-[#A9C5FF]/[0.08] px-3 py-1.5">
                      <Star size={11} fill="#A9C5FF" className="text-[#A9C5FF]" />

                      <span className="text-[12px] font-semibold tabular-nums text-white">
                        {product.overallRating?.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* COVERAGE */}
          <div className="mt-7 flex items-center justify-between gap-4 border-t border-white/[0.08] pt-5">
            <span className="text-[11px] text-white/40">
              Overall rating coverage
            </span>

            <span className="text-[11px] font-medium tabular-nums text-[#A9C5FF]">
              {ratingCoverage}%
            </span>
          </div>
        </>
      ) : null}
    </section>
  );
}