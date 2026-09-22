"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  ImageOff,
  Layers3,
  PackageX,
  Star,
  Tags,
} from "lucide-react";

type ProductIssue = {
  id: string;
  name: string;
  slug: string;
  issues: string[];
};

type HealthData = {
  totalActiveProducts: number;
  missingImages: number;
  missingVariants: number;
  missingRatings: number;
  missingCategories: number;
  unavailableStock: number;
  productsNeedingAttention: ProductIssue[];
};

export default function CatalogHealth() {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadHealth() {
      try {
        const response = await fetch("/api/admin/dashboard/catalog", {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) throw new Error("Unable to load catalog health.");

        const result: HealthData = await response.json();

        setData(result);
      } catch (error) {
        if (controller.signal.aborted) return;

        setError(error instanceof Error ? error.message : "Unable to load catalog health.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadHealth();

    return () => controller.abort();
  }, []);

  const checks = [
    {
      label: "Missing product images",
      value: data?.missingImages ?? 0,
      icon: ImageOff,
      color: "#A9C5FF",
    },
    {
      label: "Missing product variants",
      value: data?.missingVariants ?? 0,
      icon: Layers3,
      color: "#C3ADFF",
    },
    {
      label: "Missing overall ratings",
      value: data?.missingRatings ?? 0,
      icon: Star,
      color: "#E8C59B",
    },
    {
      label: "Missing categories",
      value: data?.missingCategories ?? 0,
      icon: Tags,
      color: "#86E0C1",
    },
    {
      label: "No available supplier stock",
      value: data?.unavailableStock ?? 0,
      icon: PackageX,
      color: "#F4A8A8",
    },
  ];

  const totalIssues = checks.reduce((sum, check) => sum + check.value, 0);

  return (
    <section
      aria-labelledby="catalog-health-title"
      className="relative isolate overflow-hidden rounded-[30px] border border-white/[0.10] bg-white/[0.045] p-6 shadow-[0_16px_60px_rgba(0,0,0,0.12)] backdrop-blur-2xl sm:p-8"
    >
      {/* AMBIENT GLOW */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 -z-10 size-[350px] rounded-full bg-[#86E0C1]/[0.035] blur-[100px]" />

      {/* HEADER */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-xl border border-[#86E0C1]/15 bg-[#86E0C1]/10">
              <CheckCircle2 size={15} className="text-[#86E0C1]" />
            </span>

            <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#86E0C1]/75">
              Catalog intelligence
            </span>
          </div>

          <h2 id="catalog-health-title" className="text-[23px] font-semibold tracking-[-0.045em] text-white">
            Catalog health
          </h2>

          <p className="mt-2 text-[12px] leading-relaxed text-white/40">
            Identify missing information and potential fulfillment issues.
          </p>
        </div>

        <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]">
          <AlertCircle size={17} className="text-white/50" />
        </div>
      </div>

      {error && (
        <div role="alert" className="mb-6 rounded-xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-[12px] text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-28 rounded-2xl bg-white/[0.05]" />
          <div className="h-56 rounded-2xl bg-white/[0.05]" />
          <div className="h-36 rounded-2xl bg-white/[0.05]" />
        </div>
      ) : data ? (
        <>
          {/* HEALTH SUMMARY */}
          <div className="mb-8 flex items-center justify-between gap-5 rounded-[22px] border border-white/[0.08] bg-white/[0.035] p-5">
            <div>
              <span className="text-[11px] text-white/45">
                Catalog issues
              </span>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-[clamp(2.8rem,5vw,4rem)] font-semibold leading-none tracking-[-0.07em] text-white">
                  {totalIssues}
                </span>

                <span className="text-[12px] text-white/35">
                  detected
                </span>
              </div>

              <p className="mt-3 text-[11px] text-white/35">
                Across {data.totalActiveProducts} active products
              </p>
            </div>

            <div className={`flex size-[70px] items-center justify-center rounded-full border ${totalIssues > 0 ? "border-[#E8C59B]/20 bg-[#E8C59B]/10" : "border-[#86E0C1]/20 bg-[#86E0C1]/10"}`}>
              {totalIssues > 0 ? (
                <AlertCircle size={28} strokeWidth={1.5} className="text-[#E8C59B]" />
              ) : (
                <CheckCircle2 size={28} strokeWidth={1.5} className="text-[#86E0C1]" />
              )}
            </div>
          </div>

          {/* HEALTH CHECKS */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-white/85">
                Health checks
              </h3>

              <span className="text-[10px] text-white/35">
                Active products only
              </span>
            </div>

            <div className="space-y-2">
              {checks.map((check) => {
                const Icon = check.icon;

                return (
                  <div
                    key={check.label}
                    className="group flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3.5 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.045]"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.04]">
                      <Icon size={16} strokeWidth={1.7} style={{ color: check.color }} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium text-white/65">
                        {check.label}
                      </p>
                    </div>

                    <span className={`text-[15px] font-semibold tabular-nums ${check.value > 0 ? "text-white" : "text-[#86E0C1]"}`}>
                      {check.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PRODUCTS NEEDING ATTENTION */}
          <div className="mt-8 border-t border-white/[0.08] pt-7">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-[13px] font-semibold text-white/85">
                  Products needing attention
                </h3>

                <p className="mt-1 text-[11px] text-white/35">
                  Recently added products with catalog issues
                </p>
              </div>

              <ArrowUpRight size={16} className="text-white/30" />
            </div>

            {data.productsNeedingAttention.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 px-4 py-7 text-center">
                <CheckCircle2 size={22} className="mx-auto mb-3 text-[#86E0C1]" />

                <p className="text-[12px] font-medium text-white/70">
                  Your catalog looks good.
                </p>

                <p className="mt-1 text-[11px] text-white/35">
                  No missing information detected.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {data.productsNeedingAttention.map((product) => (
                  <div
                    key={product.id}
                    className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 transition-colors hover:border-white/[0.12] hover:bg-white/[0.045]"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <span className="size-1.5 shrink-0 rounded-full bg-[#E8C59B]" />

                      <p className="min-w-0 flex-1 truncate text-[12px] font-medium text-white/85">
                        {product.name}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {product.issues.map((issue) => (
                        <span
                          key={issue}
                          className="rounded-full border border-[#E8C59B]/15 bg-[#E8C59B]/[0.07] px-2.5 py-1 text-[10px] text-[#E8C59B]/85"
                        >
                          {issue}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* INVENTORY NOTE */}
          <p className="mt-6 text-[10px] leading-relaxed text-white/30">
            Supplier availability is based on your stored inventory data and may
            differ from live supplier stock.
          </p>
        </>
      ) : null}
    </section>
  );
}