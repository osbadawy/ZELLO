"use client";

import {
  useMemo,
  useState,
} from "react";


const INDUSTRIES = [
  "SELECT AN INDUSTRY",
  "RETAIL & COMMERCE",
  "LOGISTICS & SUPPLY CHAIN",
  "MANUFACTURING & INDUSTRIAL",
  "PROFESSIONAL SERVICES",
  "HEALTHCARE SERVICES",
  "FINANCIAL SERVICES",
  "SPORTS & ENTERTAINMENT",
  "OTHER",
] as const;

const CAPABILITIES = [
  {
    id: "portal",
    number: "01",
    name: "CUSTOMER PORTAL",
    description: "Accounts, dashboards, onboarding, and services.",
  },
  {
    id: "operations",
    number: "02",
    name: "OPERATIONS ENGINE",
    description: "Workflows, approvals, assignments, and automation.",
  },
  {
    id: "data",
    number: "03",
    name: "DATA INFRASTRUCTURE",
    description: "Connected databases, records, and reporting layers.",
  },
  {
    id: "integrations",
    number: "04",
    name: "THIRD-PARTY INTEGRATIONS",
    description: "Connect external platforms and business tools.",
  },
  {
    id: "intelligence",
    number: "05",
    name: "AI & INTELLIGENCE",
    description: "Search, recommendations, and AI-assisted workflows.",
  },
  {
    id: "commerce",
    number: "06",
    name: "COMMERCE & PAYMENTS",
    description: "Orders, checkout, pricing, and payment integrations.",
  },
  {
    id: "mobile",
    number: "07",
    name: "MOBILE EXPERIENCE",
    description: "Customer-facing or internal mobile applications.",
  },
  {
    id: "admin",
    number: "08",
    name: "ADMIN CONTROL CENTER",
    description: "Permissions, administration, monitoring, and oversight.",
  },
] as const;

export default function SystemBuilder() {
  const [industry, setIndustry] =
    useState<string>(INDUSTRIES[0]);

  const [selectedCapabilities, setSelectedCapabilities] =
    useState<string[]>([
      "operations",
      "data",
      "admin",
    ]);

  const [requirement, setRequirement] =
    useState("");

  const [copied, setCopied] =
    useState(false);

  const selectedItems = useMemo(
    () =>
      CAPABILITIES.filter((capability) =>
        selectedCapabilities.includes(
          capability.id,
        ),
      ),
    [selectedCapabilities],
  );

  const brief = useMemo(() => {
    return [
      "PENTA LABS / CUSTOM SYSTEM BRIEF",
      "",
      `INDUSTRY: ${industry}`,
      "",
      "REQUESTED CAPABILITIES:",
      selectedItems.length > 0
        ? selectedItems
            .map(
              (item, index) =>
                `${index + 1}. ${item.name}`,
            )
            .join("\n")
        : "To be determined",
      "",
      "PROJECT REQUIREMENTS:",
      requirement.trim() ||
        "To be discussed during discovery.",
      "",
      "This brief describes an initial concept. Final scope,",
      "technical architecture, timeline, and commercial",
      "terms would be established during project discovery.",
    ].join("\n");
  }, [industry, selectedItems, requirement]);

  function toggleCapability(id: string) {
    setCopied(false);

    setSelectedCapabilities((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(brief);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2200);
    } catch {
      const textarea =
        document.getElementById(
          "system-generated-brief",
        ) as HTMLTextAreaElement | null;

      textarea?.focus();
      textarea?.select();
    }
  }

  const emailHref =
    `mailto:?subject=${encodeURIComponent(
      "Custom System Enquiry / Penta Labs",
    )}&body=${encodeURIComponent(brief)}`;

  return (
    <section
      id="builder"
      aria-labelledby="system-builder-title"
      className="mx-auto w-[calc(100%-20px)] max-w-[1440px] scroll-mt-28 border-x-2 border-b-2 border-[#1c242b] bg-white sm:w-[calc(100%-32px)]"
    >
      {/* INTRO */}

      <div
        className="flex flex-col justify-between gap-8 border-b-2 border-[#1c242b] p-6 sm:p-10 lg:flex-row lg:items-end"
      >
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#2f6fed]">
            02 / CUSTOM ARCHITECTURE
          </span>

          <h2
            id="system-builder-title"
            className="mt-5 text-[clamp(38px,5.8vw,82px)] leading-[0.95] font-bold tracking-[-0.08em]"
          >
            YOUR BUSINESS.
            <br />
            <span className="text-[#2f6fed]">
              YOUR SYSTEM.
            </span>
          </h2>
        </div>

        <p className="max-w-[390px] text-[13px] leading-[1.8] text-[#526477]">
          Start with the capabilities you need.
          We can shape them into a connected,
          custom-built operating environment.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
        {/* CONFIGURATOR */}

        <div
          className="min-w-0 border-b-2 border-[#1c242b] p-5 sm:p-8 lg:border-r-2 lg:border-b-0 lg:p-10"
        >
          <label
            htmlFor="system-industry"
            className="block font-mono text-[10px] font-bold uppercase tracking-[0.12em]"
          >
            01 / YOUR INDUSTRY
          </label>

          <select
            id="system-industry"
            value={industry}
            onChange={(event) => {
              setIndustry(event.target.value);
              setCopied(false);
            }}
            className="mt-4 min-h-12 w-full border-2 border-[#1c242b] bg-white px-4 font-mono text-[11px] outline-none focus:border-[#2f6fed]"
          >
            {INDUSTRIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <div className="mt-10 flex items-center justify-between gap-3">
            <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.12em]">
              02 / REQUIRED CAPABILITIES
            </h3>

            <span className="font-mono text-[10px] text-[#2f6fed]">
              {String(selectedItems.length).padStart(
                2,
                "0",
              )}{" "}
              SELECTED
            </span>
          </div>

          <div className="mt-4 grid gap-[2px] bg-[#1c242b] sm:grid-cols-2">
            {CAPABILITIES.map((capability) => {
              const selected =
                selectedCapabilities.includes(
                  capability.id,
                );

              return (
                <button
                  key={capability.id}
                  type="button"
                  onClick={() =>
                    toggleCapability(
                      capability.id,
                    )
                  }
                  aria-pressed={selected}
                  className={[
                    "group flex min-h-[135px] flex-col justify-between gap-4 p-4 text-left transition-colors",
                    selected
                      ? "bg-[#1c242b] text-white"
                      : "bg-[#f0f3f7] text-[#1c242b] hover:bg-[#e4ecff]",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={[
                        "font-mono text-[10px]",
                        selected
                          ? "text-[#78a7ff]"
                          : "text-[#526477]",
                      ].join(" ")}
                    >
                      {capability.number}
                    </span>

                    <span
                      className={[
                        "grid size-6 place-items-center border text-[12px]",
                        selected
                          ? "border-[#78a7ff] bg-[#2f6fed] text-white"
                          : "border-[#1c242b] bg-white",
                      ].join(" ")}
                    >
                      {selected ? "✓" : "+"}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-[12px] font-bold">
                      {capability.name}
                    </h4>

                    <p
                      className={[
                        "mt-2 text-[11px] leading-[1.5]",
                        selected
                          ? "text-white/60"
                          : "text-[#526477]",
                      ].join(" ")}
                    >
                      {capability.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <label
            htmlFor="system-requirement"
            className="mt-10 block font-mono text-[10px] font-bold uppercase tracking-[0.12em]"
          >
            03 / WHAT SHOULD YOUR SYSTEM DO?
          </label>

          <textarea
            id="system-requirement"
            value={requirement}
            onChange={(event) => {
              setRequirement(event.target.value);
              setCopied(false);
            }}
            rows={5}
            placeholder="Describe the workflows, teams, integrations, or operational challenges you want to connect..."
            className="mt-4 w-full resize-y border-2 border-[#1c242b] bg-[#f0f3f7] p-4 text-[13px] leading-[1.7] outline-none placeholder:text-[#768390] focus:border-[#2f6fed]"
          />
        </div>

        {/* LIVE PROJECT BRIEF */}

        <div
          className="flex min-w-0 flex-col bg-[#101419] text-white"
        >
          <div className="flex items-center justify-between gap-3 border-b border-white/15 p-5 font-mono text-[10px] uppercase tracking-[0.1em] sm:p-7">
            <span>PROJECT / LIVE PREVIEW</span>

            <span className="size-2 rounded-full bg-[#2f6fed] shadow-[0_0_12px_#2f6fed]" />
          </div>

          <div className="flex-1 p-5 sm:p-8">
            <span className="font-mono text-[10px] tracking-[0.12em] text-[#78a7ff]">
              CUSTOM SYSTEM / 001
            </span>

            <h3 className="mt-5 text-[clamp(29px,3.5vw,48px)] leading-[1] font-bold tracking-[-0.07em]">
              BUILT AROUND
              <br />
              YOUR OPERATION.
            </h3>

            <div className="mt-9 border-y border-white/15 py-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/40">
                SELECTED INDUSTRY
              </span>

              <p className="mt-3 text-[13px] font-semibold">
                {industry}
              </p>
            </div>

            <div className="border-b border-white/15 py-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/40">
                SYSTEM MODULES
              </span>

              <div className="mt-4 flex flex-wrap gap-2">
                {selectedItems.length > 0 ? (
                  selectedItems.map((item, index) => (
                    <span
                      key={item.id}
                      className="border border-[#78a7ff]/50 bg-[#2f6fed]/15 px-3 py-2 font-mono text-[10px] text-[#d6e4ff]"
                    >
                      {String(index + 1).padStart(
                        2,
                        "0",
                      )}{" "}
                      / {item.name}
                    </span>
                  ))
                ) : (
                  <p className="text-[12px] text-white/45">
                    Select capabilities to assemble
                    your system.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-7">
              <label
                htmlFor="system-generated-brief"
                className="block font-mono text-[10px] uppercase tracking-[0.1em] text-white/40"
              >
                GENERATED PROJECT BRIEF
              </label>

              <textarea
                id="system-generated-brief"
                value={brief}
                readOnly
                rows={13}
                className="mt-4 w-full resize-y border border-white/20 bg-white/5 p-4 font-mono text-[11px] leading-[1.8] text-white/75 outline-none focus:border-[#78a7ff]"
              />
            </div>
          </div>

          <div className="grid gap-[2px] border-t border-white/20 bg-white/20 sm:grid-cols-2">
            <button
              type="button"
              onClick={copyBrief}
              className="min-h-14 bg-[#2f6fed] px-5 font-mono text-[10px] font-bold tracking-[0.08em] text-white transition-colors hover:bg-[#2456bb]"
            >
              {copied
                ? "✓ BRIEF COPIED"
                : "COPY PROJECT BRIEF ↗"}
            </button>

            <a
              href={emailHref}
              className="flex min-h-14 items-center justify-center bg-[#19222e] px-5 text-center font-mono text-[10px] font-bold tracking-[0.08em] text-white transition-colors hover:bg-[#24364b]"
            >
              OPEN EMAIL DRAFT ↗
            </a>
          </div>

          <p className="px-5 py-4 font-mono text-[9px] leading-[1.6] text-white/40 sm:px-7">
            This generates a project brief locally.
            It does not submit an enquiry or
            estimate implementation costs.
          </p>
        </div>
      </div>
    </section>
  );
}