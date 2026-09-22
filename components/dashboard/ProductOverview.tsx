"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Boxes, Layers3, PackageCheck, Star } from "lucide-react";

type OverviewData = {
  totalProducts: number;
  categoriesAvailable: number;
  unitsSold: number;
  averageRating: number | null;
  ratedProducts: number;
};

const numberFormatter = new Intl.NumberFormat("en-US");

export default function ProductOverview() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadOverview() {
      try {
        const response = await fetch("/api/admin/dashboard/overview", {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) throw new Error("Unable to load product overview.");

        const result: OverviewData = await response.json();
        setData(result);
      } catch (error) {
        if (controller.signal.aborted) return;
        setError(error instanceof Error ? error.message : "Unable to load dashboard.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadOverview();

    return () => controller.abort();
  }, []);

  const stats = [
    {
      label: "Total products",
      href: "/dashboard/products",
      value: data ? numberFormatter.format(data.totalProducts) : "—",
      description: "Products in your catalog",
      icon: Boxes,
      accent: "#A9C5FF",
      glow: "bg-[#608bff]/10",
      iconBackground: "bg-[#A9C5FF]/10",
    },
    {
      label: "Categories available",
      href: "/dashboard/categories",
      value: data ? numberFormatter.format(data.categoriesAvailable) : "—",
      description: "Active product categories",
      icon: Layers3,
      accent: "#86E0C1",
      glow: "bg-[#55c9a6]/10",
      iconBackground: "bg-[#86E0C1]/10",
    },
    {
      label: "Units sold",
      href: "/dashboard/sale",
      value: data ? numberFormatter.format(data.unitsSold) : "—",
      description: "Units in paid orders",
      icon: PackageCheck,
      accent: "#E8C59B",
      glow: "bg-[#e8b980]/10",
      iconBackground: "bg-[#E8C59B]/10",
    },
    {
      label: "Average rating",
      href: "/dashboard/ratings",
      value: data?.averageRating != null ? data.averageRating.toFixed(1) : "—",
      suffix: data?.averageRating != null ? "/10" : "",
      description: data ? `${data.ratedProducts} active products rated` : "Overall product score",
      icon: Star,
      accent: "#C3ADFF",
      glow: "bg-[#a78bfa]/10",
      iconBackground: "bg-[#C3ADFF]/10",
    },
  ];

  return (
    <section aria-labelledby="product-overview-title">
      <div className="mb-4 flex items-center justify-between">
        <h2 id="product-overview-title" className="text-[12px] font-medium text-white/50">
          Product overview
        </h2>

        <span className="text-[10px] text-white/30">
          {loading ? "Loading..." : error ? "Unavailable" : "Catalog summary"}
        </span>
      </div>

      {error && (
        <div role="alert" className="mb-4 rounded-2xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-[12px] text-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Link
              key={stat.label}
              href={stat.href}
              aria-label={`View ${stat.label.toLowerCase()}`}
              className="group relative isolate block min-h-[185px] overflow-hidden rounded-[26px] border border-white/[0.10] bg-white/[0.045] p-6 shadow-[0_12px_50px_rgba(0,0,0,0.10)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.18] hover:bg-white/[0.065] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A9C5FF]"
            >
              <div aria-hidden="true" className={`pointer-events-none absolute -right-12 -top-12 -z-10 size-40 rounded-full blur-[65px] ${stat.glow}`} />

              <div className="flex items-start justify-between gap-4">
                <div className={`flex size-10 items-center justify-center rounded-2xl border border-white/[0.08] ${stat.iconBackground}`}>
                  <Icon size={18} strokeWidth={1.7} style={{ color: stat.accent }} />
                </div>

                <ArrowUpRight size={15} className="text-white/20 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/60" />
              </div>

              <div className="mt-7">
                <p className="text-[12px] font-medium text-white/50">
                  {stat.label}
                </p>

                <div className="mt-2 flex items-baseline gap-1.5">
                  {loading ? (
                    <div className="h-10 w-20 animate-pulse rounded-lg bg-white/10" />
                  ) : (
                    <>
                      <span className="text-[clamp(2rem,2.7vw,2.75rem)] font-semibold leading-none tracking-[-0.06em] text-white">
                        {stat.value}
                      </span>

                      {stat.suffix && (
                        <span className="text-[13px] font-medium text-white/35">
                          {stat.suffix}
                        </span>
                      )}
                    </>
                  )}
                </div>

                <p className="mt-3 text-[11px] text-white/35">
                  {stat.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}