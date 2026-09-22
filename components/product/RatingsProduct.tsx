"use client";

import {
  CheckCircle2,
  Heart,
  ShieldCheck,
  Sparkles,
  Star,
  ThumbsUp,
} from "lucide-react";

import type { ProductDetail } from "./ProductDetailsClient";

type Props = {
  product: ProductDetail;
};

type RatingBarProps = {
  label: string;
  value: number | null;
  icon: typeof Star;
  color: string;
};

function RatingBar({
  label,
  value,
  icon: Icon,
  color,
}: RatingBarProps) {
  const percentage =
    value === null ? 0 : Math.max(0, Math.min(value, 10)) * 10;

  return (
    <div className="rounded-[22px] border border-white/[0.08] bg-white/[0.035] p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.05]">
            <Icon
              size={17}
              strokeWidth={1.6}
              style={{ color }}
            />
          </div>

          <span className="text-[12px] font-medium text-white/65">
            {label}
          </span>
        </div>

        <div className="shrink-0 text-right">
          {value === null ? (
            <span className="text-[11px] text-white/30">
              Not rated
            </span>
          ) : (
            <span className="text-[23px] font-semibold leading-none tracking-[-0.055em] text-white">
              {value.toFixed(1)}
              <span className="ml-1 text-[12px] font-normal text-white/35">
                /10
              </span>
            </span>
          )}
        </div>
      </div>

      <div
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={10}
        aria-valuenow={value === null ? undefined : value}
        aria-valuetext={value === null ? "Not rated" : `${value} out of 10`}
        className="h-[7px] w-full overflow-hidden rounded-full bg-white/[0.09]"
      >
        <div
          className="h-full rounded-full transition-[width] duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            background: color,
          }}
        />
      </div>

      <div
        aria-hidden="true"
        className="mt-2 flex justify-between text-[10px] font-medium text-white/25"
      >
        <span>0</span>
        <span>10</span>
      </div>
    </div>
  );
}

export default function RatingsProduct({ product }: Props) {
  const ratings = [
    {
      label: "Daily use",
      value: product.dailyUseRating,
      icon: Heart,
      color: "#A9C5FF",
    },
    {
      label: "Reliability",
      value: product.reliabilityRating,
      icon: ShieldCheck,
      color: "#86E0C1",
    },
    {
      label: "Quality",
      value: product.qualityRating,
      icon: Sparkles,
      color: "#C3ADFF",
    },
    {
      label: "Recommendation",
      value: product.recommendRating,
      icon: ThumbsUp,
      color: "#E8C59B",
    },
  ];

  const hasRatings = ratings.some((rating) => rating.value !== null);

  if (!hasRatings) return null;

  return (
    <section aria-labelledby="product-ratings-title">
      {/* HEADER */}
      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Star size={13} className="text-[#A9C5FF]" />

            <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#A9C5FF]/75">
              Product assessment
            </span>
          </div>

          <h2
            id="product-ratings-title"
            className="text-[clamp(2rem,4vw,3.6rem)] font-semibold leading-[1.1] tracking-[-0.06em] text-white"
          >
            The details matter<span className="text-[#A9C5FF]">.</span>
          </h2>
        </div>

        <span className="inline-flex items-center gap-2 text-[11px] text-white/40">
          <CheckCircle2 size={14} className="text-[#A9C5FF]/70" />
          Individual ratings · 0–10 scale
        </span>
      </div>

      {/* RATING CARDS */}
      <div className="relative overflow-hidden rounded-[30px] border border-white/[0.10] bg-white/[0.025] p-4 backdrop-blur-xl sm:p-6 lg:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-28 -top-40 size-[450px] rounded-full bg-[#7197ff]/[0.045] blur-[100px]"
        />

        <div className="relative grid gap-3 sm:grid-cols-2 sm:gap-4">
          {ratings.map((rating) => (
            <RatingBar
              key={rating.label}
              label={rating.label}
              value={rating.value}
              icon={rating.icon}
              color={rating.color}
            />
          ))}
        </div>
      </div>
    </section>
  );
}