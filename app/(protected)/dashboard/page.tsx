import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ArrowUpRight, LayoutDashboard, ShieldCheck, Sparkles } from "lucide-react";

import { auth } from "@/lib/auth/auth";

import ProductOverview from "@/components/dashboard/ProductOverview";
import ProductRatings from "@/components/dashboard/ProductRatings";
import CatalogHealth from "@/components/dashboard/CatalogHealth";

export default async function DashboardPage() {
const session = await auth.api.getSession({
  headers: await headers(),
});

if (!session) redirect("/sign-in");

const role = String(
  (session.user as typeof session.user & { role?: string | null }).role ?? "",
).trim().toUpperCase();

if (role !== "ADMIN") notFound();

const firstName = session.user.name?.trim().split(/\s+/)[0] || "Admin";

  return (
    <main className="relative isolate min-h-[calc(100svh-76px)] overflow-hidden bg-[#080d18] text-white">

      {/* BACKGROUND ATMOSPHERE */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-[20%] -top-[350px] size-[800px] rounded-full bg-[#315aa8]/[0.13] blur-[150px]" />
        <div className="absolute -right-[20%] top-[20%] size-[700px] rounded-full bg-[#608bff]/[0.07] blur-[150px]" />
        <div className="absolute bottom-0 left-[25%] size-[650px] rounded-full bg-[#315aa8]/[0.05] blur-[150px]" />
      </div>

      <div className="mx-auto w-full max-w-[1600px] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">

        {/* HEADER */}
        <header className="mb-10 flex flex-col justify-between gap-7 border-b border-white/[0.08] pb-9 lg:mb-12 lg:flex-row lg:items-end">

          <div>
            <div className="mb-5 flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06]">
                <LayoutDashboard size={13} className="text-[#A9C5FF]" />
              </span>

              <span className="text-[11px] font-medium tracking-[0.08em] text-white/45">
                QUICKSHIPGO / ADMIN
              </span>

              <span className="mx-1 text-white/20">/</span>

              <span className="text-[11px] font-medium text-[#A9C5FF]">
                Overview
              </span>
            </div>

            <h1 className="text-[clamp(2.5rem,4vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.065em]">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-[#A9C5FF] via-[#dce8ff] to-[#86aaff] bg-clip-text text-transparent">
                {firstName}.
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-white/45 sm:text-[14px]">
              Your entire product catalog at a glance. Track performance,
              discover opportunities, and keep your store running smoothly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 backdrop-blur-xl">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-30" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </span>

              <span className="text-[11px] font-medium text-white/65">
                Admin workspace
              </span>

              <ShieldCheck size={13} className="text-emerald-400/80" />
            </div>

            <a
              href="/"
              className="group inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 bg-white px-4 text-[11px] font-semibold text-[#080d18] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#dce8ff]"
            >
              View storefront

              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        </header>

        {/* OVERVIEW */}
        <ProductOverview />

        {/* RATINGS AND CATALOG HEALTH */}
        <div className="mt-6 grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <ProductRatings />
          <CatalogHealth />
        </div>

        {/* FOOTER */}
        <footer className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] pt-6">
          <span className="text-[11px] font-medium tracking-[-0.03em] text-white/35">
            quickshipgo<span className="text-[#A9C5FF]">.</span>
          </span>

          <span className="text-[10px] text-white/25">
            Your products. Your insights. Your store.
          </span>
        </footer>
      </div>
    </main>
  );
}