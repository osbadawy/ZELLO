"use client";

import { useEffect, useId, useMemo, useState } from "react";

import {
  SYSTEMS,
  SYSTEM_CATEGORIES,
  type SystemCategory,
  type SystemDefinition,
} from "./systemData";

type Filter = "ALL" | SystemCategory;
type LayoutName =
  | "default"
  | "zigzag"
  | "hub"
  | "route"
  | "ledger"
  | "funnel"
  | "field"
  | "dashboard";
type NodeShape = "square" | "rounded" | "pill" | "cut" | "hex" | "circle";
type ConnectorStyle = "straight" | "elbow" | "curve" | "route" | "dashed";
type SystemId = (typeof SYSTEMS)[number]["id"];

type SystemVisual = {
  accent: string;
  accentBright: string;
  accentSoft: string;
  background: string;
  node: string;
  nodeAlt: string;
  stroke: string;
  mutedStroke: string;
  grid: string;
  layout: LayoutName;
  shape: NodeShape;
  connector: ConnectorStyle;
  eyebrow: string;
  badge: string;
};

const SYSTEM_VISUALS: Record<SystemId, SystemVisual> = {
  "enterprise-operations": {
    accent: "#2f6fed",
    accentBright: "#9dbdff",
    accentSoft: "#18366f",
    background: "#101419",
    node: "#19222e",
    nodeAlt: "#162b4d",
    stroke: "#7890ae",
    mutedStroke: "#42546b",
    grid: "rgba(120,167,255,0.08)",
    layout: "default",
    shape: "square",
    connector: "straight",
    eyebrow: "CONTROLLED / MODULAR",
    badge: "OPS GRID",
  },
  "commerce-infrastructure": {
    accent: "#f08a45",
    accentBright: "#ffd0a8",
    accentSoft: "#67351f",
    background: "#171311",
    node: "#2b211d",
    nodeAlt: "#4b2a1c",
    stroke: "#b77a55",
    mutedStroke: "#65483c",
    grid: "rgba(240,138,69,0.09)",
    layout: "zigzag",
    shape: "rounded",
    connector: "route",
    eyebrow: "TRANSACTION / VELOCITY",
    badge: "COMMERCE FLOW",
  },
  "ai-intelligence": {
    accent: "#b477ff",
    accentBright: "#e1c5ff",
    accentSoft: "#4b2879",
    background: "#151119",
    node: "#241a31",
    nodeAlt: "#382250",
    stroke: "#a98acb",
    mutedStroke: "#5d4a72",
    grid: "rgba(180,119,255,0.09)",
    layout: "hub",
    shape: "hex",
    connector: "curve",
    eyebrow: "CONTEXT / REASONING",
    badge: "NEURAL LOOP",
  },
  "logistics-command": {
    accent: "#e8b44f",
    accentBright: "#ffe5a0",
    accentSoft: "#604b1f",
    background: "#161512",
    node: "#29261d",
    nodeAlt: "#443919",
    stroke: "#b59b5d",
    mutedStroke: "#655b3d",
    grid: "rgba(232,180,79,0.08)",
    layout: "route",
    shape: "circle",
    connector: "route",
    eyebrow: "MOVEMENT / RESPONSE",
    badge: "LIVE ROUTE",
  },
  "financial-workflows": {
    accent: "#35c9a2",
    accentBright: "#a9ffe5",
    accentSoft: "#145d4e",
    background: "#0e1717",
    node: "#172725",
    nodeAlt: "#173f38",
    stroke: "#65b39e",
    mutedStroke: "#3f6860",
    grid: "rgba(53,201,162,0.08)",
    layout: "ledger",
    shape: "cut",
    connector: "elbow",
    eyebrow: "LEDGER / CONTROL",
    badge: "AUDIT READY",
  },
  "customer-platform": {
    accent: "#ef6d9a",
    accentBright: "#ffc0d3",
    accentSoft: "#6d2d49",
    background: "#181116",
    node: "#2b1b26",
    nodeAlt: "#50253b",
    stroke: "#b47791",
    mutedStroke: "#674555",
    grid: "rgba(239,109,154,0.08)",
    layout: "funnel",
    shape: "pill",
    connector: "curve",
    eyebrow: "JOURNEY / RELATIONSHIP",
    badge: "CUSTOMER LOOP",
  },
  "industrial-monitoring": {
    accent: "#8bd450",
    accentBright: "#d8ffae",
    accentSoft: "#3c5e25",
    background: "#121713",
    node: "#202b21",
    nodeAlt: "#304b2b",
    stroke: "#82a56e",
    mutedStroke: "#4e6548",
    grid: "rgba(139,212,80,0.08)",
    layout: "field",
    shape: "cut",
    connector: "dashed",
    eyebrow: "FIELD / TELEMETRY",
    badge: "SITE MONITOR",
  },
  "analytics-control": {
    accent: "#48c7e8",
    accentBright: "#b8f3ff",
    accentSoft: "#185467",
    background: "#10171b",
    node: "#18272d",
    nodeAlt: "#1a4655",
    stroke: "#6fa8b7",
    mutedStroke: "#42616b",
    grid: "rgba(72,199,232,0.09)",
    layout: "dashboard",
    shape: "square",
    connector: "elbow",
    eyebrow: "SIGNALS / DECISIONS",
    badge: "CONTROL TOWER",
  },
  "business-systems": {
    accent: "#ff6b35",
    accentBright: "#ffd0bd",
    accentSoft: "#71301d",
    background: "#181311",
    node: "#2b201c",
    nodeAlt: "#4d2b20",
    stroke: "#bd8067",
    mutedStroke: "#67483d",
    grid: "rgba(255,107,53,0.09)",
    layout: "default",
    shape: "rounded",
    connector: "elbow",
    eyebrow: "PEOPLE / PROCESS / PERFORMANCE",
    badge: "BUSINESS OS",
  },
  "ai-automation": {
    accent: "#00c896",
    accentBright: "#b0ffe8",
    accentSoft: "#12624f",
    background: "#0e1716",
    node: "#172622",
    nodeAlt: "#1b4b3d",
    stroke: "#62b69f",
    mutedStroke: "#3e6b60",
    grid: "rgba(0,200,150,0.09)",
    layout: "hub",
    shape: "hex",
    connector: "curve",
    eyebrow: "SIGNAL / AGENT / ACTION",
    badge: "AUTOMATION LOOP",
  },
  "custom-payments": {
    accent: "#ffcf33",
    accentBright: "#fff1a6",
    accentSoft: "#6d5615",
    background: "#171611",
    node: "#29261a",
    nodeAlt: "#4f4218",
    stroke: "#b8a65d",
    mutedStroke: "#675f3b",
    grid: "rgba(255,207,51,0.09)",
    layout: "ledger",
    shape: "cut",
    connector: "route",
    eyebrow: "AUTHORIZE / SETTLE / RECONCILE",
    badge: "PAYMENT RAIL",
  },
};

const BASE_NODE_POSITIONS = [
  { x: 20, y: 40 },
  { x: 150, y: 40 },
  { x: 280, y: 40 },
  { x: 95, y: 158 },
  { x: 225, y: 158 },
];

const NODE_LAYOUTS: Record<LayoutName, Array<{ x: number; y: number }>> = {
  default: BASE_NODE_POSITIONS,
  zigzag: [
    { x: 18, y: 26 },
    { x: 150, y: 92 },
    { x: 282, y: 26 },
    { x: 65, y: 168 },
    { x: 235, y: 168 },
  ],
  hub: [
    { x: 150, y: 16 },
    { x: 25, y: 95 },
    { x: 150, y: 95 },
    { x: 275, y: 95 },
    { x: 150, y: 174 },
  ],
  route: [
    { x: 150, y: 12 },
    { x: 25, y: 82 },
    { x: 275, y: 82 },
    { x: 55, y: 168 },
    { x: 245, y: 168 },
  ],
  ledger: [
    { x: 20, y: 40 },
    { x: 150, y: 40 },
    { x: 280, y: 40 },
    { x: 20, y: 158 },
    { x: 280, y: 158 },
  ],
  funnel: [
    { x: 20, y: 28 },
    { x: 150, y: 52 },
    { x: 280, y: 76 },
    { x: 70, y: 166 },
    { x: 230, y: 166 },
  ],
  field: [
    { x: 20, y: 30 },
    { x: 150, y: 30 },
    { x: 280, y: 30 },
    { x: 82, y: 164 },
    { x: 218, y: 164 },
  ],
  dashboard: [
    { x: 150, y: 16 },
    { x: 20, y: 98 },
    { x: 150, y: 98 },
    { x: 280, y: 98 },
    { x: 150, y: 178 },
  ],
};

const CONNECTIONS = [
  [0, 1],
  [1, 2],
  [1, 3],
  [1, 4],
  [3, 4],
] as const;

function clampText(value: string, max = 15) {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

function center(position: { x: number; y: number }) {
  return { x: position.x + 50, y: position.y + 29 };
}

function connectorPath(
  a: { x: number; y: number },
  b: { x: number; y: number },
  style: ConnectorStyle,
) {
  const start = center(a);
  const end = center(b);

  if (style === "elbow") {
    const middleX = Math.round((start.x + end.x) / 2);
    return `M${start.x} ${start.y} H${middleX} V${end.y} H${end.x}`;
  }

  if (style === "curve") {
    const bend = Math.max(22, Math.abs(end.x - start.x) * 0.3);
    return `M${start.x} ${start.y} C${start.x + bend} ${start.y}, ${end.x - bend} ${end.y}, ${end.x} ${end.y}`;
  }

  if (style === "route") {
    const middleY = Math.round((start.y + end.y) / 2);
    return `M${start.x} ${start.y} V${middleY} H${end.x} V${end.y}`;
  }

  return `M${start.x} ${start.y} L${end.x} ${end.y}`;
}

function hexPoints(width: number, height: number) {
  const cut = 9;
  return `${cut},0 ${width - cut},0 ${width},${cut} ${width},${height - cut} ${width - cut},${height} ${cut},${height} 0,${height - cut} 0,${cut}`;
}

function cutCornerPoints(width: number, height: number) {
  const cut = 7;
  return `${cut},0 ${width},0 ${width},${height - cut} ${width - cut},${height} 0,${height} 0,${cut}`;
}

function SystemNodeShape({
  visual,
  active,
}: {
  visual: SystemVisual;
  active: boolean;
}) {
  const fill = active ? visual.accent : visual.node;
  const stroke = active ? visual.accentBright : visual.stroke;

  if (visual.shape === "hex") {
    return <polygon points={hexPoints(100, 58)} fill={fill} stroke={stroke} strokeWidth={active ? 2 : 1} />;
  }

  if (visual.shape === "cut") {
    return <polygon points={cutCornerPoints(100, 58)} fill={fill} stroke={stroke} strokeWidth={active ? 2 : 1} />;
  }

  return (
    <rect
      width="100"
      height="58"
      rx={visual.shape === "rounded" ? 8 : visual.shape === "pill" ? 29 : visual.shape === "circle" ? 22 : 0}
      fill={fill}
      stroke={stroke}
      strokeWidth={active ? 2 : 1}
    />
  );
}

function SystemDiagram({
  system,
  activeIndex,
  onSelect,
  isRunning,
}: {
  system: SystemDefinition;
  activeIndex: number;
  onSelect: (index: number) => void;
  isRunning: boolean;
}) {
  const visual = SYSTEM_VISUALS[system.id as SystemId];
  const diagramId = useId().replace(/:/g, "");
  const positions = NODE_LAYOUTS[visual.layout];

  return (
    <div
      className="relative overflow-hidden border-b border-white/15 p-4 sm:p-7"
      style={{ backgroundColor: visual.background }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage: `linear-gradient(${visual.grid} 1px,transparent 1px),linear-gradient(90deg,${visual.grid} 1px,transparent 1px)`,
          backgroundSize: visual.layout === "ledger" ? "18px 18px" : "25px 25px",
        }}
      />

      <div className="pointer-events-none absolute right-5 top-5 select-none font-mono text-[9px] tracking-[0.18em]" style={{ color: visual.accent, opacity: 0.7 }}>
        {visual.badge}
      </div>

      {visual.layout === "dashboard" && (
        <div className="pointer-events-none absolute bottom-5 right-6 flex items-end gap-1 opacity-50">
          {[18, 31, 12, 42, 26, 52].map((height, index) => (
            <span key={index} className="w-1" style={{ height, backgroundColor: visual.accent }} />
          ))}
        </div>
      )}

      {visual.layout === "field" && (
        <div className="pointer-events-none absolute bottom-5 left-5 size-10 rounded-full border opacity-50" style={{ borderColor: visual.accent }}>
          <span className="absolute left-1/2 top-0 h-full border-l" style={{ borderColor: visual.accent }} />
          <span className="absolute left-0 top-1/2 w-full border-t" style={{ borderColor: visual.accent }} />
        </div>
      )}

      <div className="relative mb-6 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] tracking-[0.08em] text-white/50">
        <span style={{ color: visual.accentBright }}>INTERACTIVE ARCHITECTURE / {system.number}</span>
        <span className="flex items-center gap-2">
          <span
            className={`size-1.5 rounded-full ${isRunning ? "animate-pulse" : ""}`}
            style={{ backgroundColor: isRunning ? visual.accent : "rgba(255,255,255,.4)" }}
          />
          {isRunning ? "FLOW ACTIVE" : "FLOW IDLE"}
        </span>
      </div>

      <div className="relative mx-auto max-w-[660px]">
        <svg
          viewBox="0 0 400 248"
          role="img"
          aria-label={`${system.name} architecture showing five interconnected modules`}
          className="hidden w-full sm:block"
        >
          <defs>
            <filter id={`glow-${diagramId}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <pattern id={`ledger-${diagramId}`} width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M0 0H8" stroke={visual.accent} strokeOpacity=".16" />
            </pattern>
          </defs>

          {visual.layout === "ledger" && (
            <rect x="5" y="8" width="390" height="222" fill={`url(#ledger-${diagramId})`} opacity=".45" />
          )}

          {visual.layout === "hub" && (
            <circle cx="200" cy="124" r="72" fill="none" stroke={visual.accent} strokeOpacity=".16" strokeDasharray="2 6" />
          )}

          {visual.layout === "route" && (
            <path d="M42 124 C100 66 300 66 358 124 C300 182 100 182 42 124Z" fill="none" stroke={visual.accent} strokeOpacity=".14" strokeDasharray="3 7" />
          )}

          {CONNECTIONS.map(([start, end]) => {
            const a = positions[start];
            const b = positions[end];
            const isActive = activeIndex === start || activeIndex === end;
            const path = connectorPath(a, b, visual.connector);

            return (
              <g key={`${start}-${end}`}>
                <path
                  d={path}
                  fill="none"
                  stroke={isActive ? visual.accentBright : visual.mutedStroke}
                  strokeWidth={isActive ? 2 : 1}
                  strokeDasharray={visual.connector === "dashed" || isRunning ? "5 5" : undefined}
                  className="transition-[stroke,stroke-width] duration-300"
                />
                {isRunning && isActive && (
                  <circle r="3.5" fill={visual.accentBright} filter={`url(#glow-${diagramId})`}>
                    <animateMotion dur="1.2s" repeatCount="indefinite" path={path} />
                  </circle>
                )}
              </g>
            );
          })}

          {system.modules.map((module, index) => {
            const position = positions[index];
            const active = activeIndex === index;
            return (
              <g
                key={module.id}
                role="button"
                tabIndex={0}
                aria-label={`Select ${module.name}`}
                transform={`translate(${position.x} ${position.y})`}
                className="cursor-pointer outline-none"
                onClick={() => onSelect(index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(index);
                  }
                }}
              >
                <SystemNodeShape visual={visual} active={active} />
                <rect width="4" height="58" fill={visual.accent} opacity={active ? 1 : 0.6} />
                <text x="11" y="17" fill={active ? visual.accentBright : visual.stroke} fontFamily="monospace" fontSize="8">
                  {String(index + 1).padStart(2, "0")}
                </text>
                <text x="50" y="37" fill="white" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="8">
                  {clampText(module.name)}
                </text>
                {active && <circle cx="88" cy="12" r="3" fill={visual.accentBright} />}
              </g>
            );
          })}

          <path
            d={visual.layout === "hub" ? "M200 204V238" : "M275 216V238H200"}
            stroke={visual.accent}
            strokeWidth="1"
            fill="none"
            strokeDasharray="4 5"
          />
          <text x="200" y="246" fill={visual.accentBright} fontFamily="monospace" fontSize="7" textAnchor="middle" opacity=".8">
            OUTPUT / {visual.badge}
          </text>
        </svg>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {system.modules.map((module, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={module.id}
                type="button"
                onClick={() => onSelect(index)}
                aria-pressed={isActive}
                className="min-h-[92px] min-w-0 border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{
                  borderColor: isActive ? visual.accentBright : `${visual.stroke}88`,
                  backgroundColor: isActive ? visual.accent : visual.node,
                  color: "white",
                  outlineColor: visual.accentBright,
                  borderRadius: visual.shape === "pill" ? 999 : visual.shape === "rounded" ? 8 : 0,
                }}
              >
                <span className="font-mono text-[9px] text-white/60">0{index + 1} / 05</span>
                <span className="mt-3 block break-words text-[10px] font-bold leading-[1.4] sm:text-[11px]">
                  {module.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function SystemExplorer() {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [selectedId, setSelectedId] = useState(SYSTEMS[0].id);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const visibleSystems = useMemo(
    () => (filter === "ALL" ? SYSTEMS : SYSTEMS.filter((system) => system.category === filter)),
    [filter],
  );

  const selectedSystem = SYSTEMS.find((system) => system.id === selectedId) ?? SYSTEMS[0];
  const activeModule = selectedSystem.modules[activeIndex] ?? selectedSystem.modules[0];
  const visual = SYSTEM_VISUALS[selectedSystem.id as SystemId];

  useEffect(() => {
    if (!isRunning) return;
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % selectedSystem.modules.length);
    }, 850);
    return () => window.clearInterval(interval);
  }, [isRunning, selectedSystem.id, selectedSystem.modules.length]);

  function selectSystem(system: SystemDefinition) {
    setSelectedId(system.id);
    setActiveIndex(0);
    setIsRunning(false);
  }

  function selectFilter(nextFilter: Filter) {
    setFilter(nextFilter);
    const firstSystem = nextFilter === "ALL" ? SYSTEMS[0] : SYSTEMS.find((system) => system.category === nextFilter);
    if (firstSystem) selectSystem(firstSystem);
  }

  return (
    <section
      id="explorer"
      aria-labelledby="system-explorer-title"
      className="mx-auto w-[calc(100%-20px)] max-w-[1440px] scroll-mt-28 border-x-2 border-b-2 border-[#1c242b] bg-white sm:w-[calc(100%-32px)]"
    >
      <div className="flex flex-col justify-between gap-8 border-b-2 border-[#1c242b] p-6 sm:p-10 lg:flex-row lg:items-end">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#2f6fed]">01 / SYSTEM DIRECTORY</span>
          <h2 id="system-explorer-title" className="mt-5 text-[clamp(38px,5.8vw,82px)] font-bold leading-[0.95] tracking-[-0.08em]">
            COMPLEXITY
            <br />
            <span className="text-[#2f6fed]">IS THE POINT.</span>
          </h2>
        </div>
        <p className="max-w-[390px] text-[13px] leading-[1.8] text-[#526477]">
          Explore some of the architectures we can design. Select a system, inspect its components, and see how the workflow moves through connected modules.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b-2 border-[#1c242b] bg-[#e9eef5] p-4 sm:p-6">
        {SYSTEM_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => selectFilter(category)}
            aria-pressed={filter === category}
            className={`min-h-10 border border-[#1c242b] px-3 font-mono text-[10px] font-bold tracking-[0.06em] transition-colors ${filter === category ? "bg-[#1c242b] text-white" : "bg-white text-[#1c242b] hover:bg-[#d9e5ff]"}`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[0.38fr_0.62fr]">
        <div className="border-b-2 border-[#1c242b] lg:border-b-0 lg:border-r-2">
          <div className="flex items-center justify-between border-b border-[#1c242b] px-5 py-4 font-mono text-[10px] uppercase tracking-[0.1em]">
            <span>SELECT AN ARCHITECTURE</span>
            <span>{visibleSystems.length.toString().padStart(2, "0")}</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-1">
            {visibleSystems.map((system) => {
              const isSelected = system.id === selectedId;
              const systemVisual = SYSTEM_VISUALS[system.id as SystemId];
              return (
                <button
                  key={system.id}
                  type="button"
                  onClick={() => selectSystem(system)}
                  aria-pressed={isSelected}
                  className={`group flex min-h-[105px] items-center gap-4 border-b border-[#1c242b]/20 px-5 py-5 text-left transition-colors last:border-b-0 sm:border-r lg:border-r-0 ${isSelected ? "text-white" : "bg-white hover:bg-[#edf3ff]"}`}
                  style={isSelected ? { backgroundColor: systemVisual.background } : undefined}
                >
                  <span className="font-mono text-[10px]" style={{ color: isSelected ? systemVisual.accentBright : systemVisual.accent }}>
                    {system.number}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-bold leading-[1.3]">{system.name}</span>
                    <span className={`mt-2 block font-mono text-[9px] tracking-[0.08em] ${isSelected ? "text-white/55" : "text-[#65717d]"}`}>
                      {system.category} / {systemVisual.badge}
                    </span>
                  </span>
                  <span className="text-lg transition-transform group-hover:translate-x-1" style={{ color: isSelected ? systemVisual.accentBright : "#1c242b" }}>↗</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="min-w-0 bg-[#101419] text-white">
          <div className="border-b border-white/15 p-5 sm:p-8" style={{ borderTop: `3px solid ${visual.accent}` }}>
            <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] tracking-[0.1em]" style={{ color: visual.accentBright }}>
              <span>SYSTEM / {selectedSystem.number}</span>
              <span>{visual.eyebrow}</span>
            </div>
            <h3 className="mt-6 text-[clamp(26px,3.1vw,46px)] font-bold leading-[1.05] tracking-[-0.06em]">{selectedSystem.headline}</h3>
            <p className="mt-5 max-w-[560px] text-[13px] leading-[1.8] text-white/60">{selectedSystem.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {selectedSystem.applications.map((application) => (
                <span key={application} className="border px-2.5 py-2 font-mono text-[9px] uppercase tracking-[0.05em] text-white/70" style={{ borderColor: `${visual.stroke}99` }}>
                  {application}
                </span>
              ))}
            </div>
          </div>

          <SystemDiagram
            system={selectedSystem}
            activeIndex={activeIndex}
            onSelect={(index) => {
              setIsRunning(false);
              setActiveIndex(index);
            }}
            isRunning={isRunning}
          />

          <div aria-live="polite" className="grid border-b border-white/15 sm:grid-cols-[1fr_auto]">
            <div className="p-5 sm:p-7">
              <div className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: visual.accentBright }}>{activeModule.role}</div>
              <h4 className="mt-3 text-[25px] font-bold tracking-[-0.06em]">{activeModule.name}</h4>
              <p className="mt-3 max-w-[500px] text-[12px] leading-[1.8] text-white/60">{activeModule.description}</p>
            </div>
            <div className="flex items-end p-5 pt-0 sm:p-7">
              <button
                type="button"
                onClick={() => setIsRunning((current) => !current)}
                className="min-h-12 w-full border px-5 font-mono text-[10px] font-bold tracking-[0.08em] text-white transition-colors sm:w-auto"
                style={{ borderColor: visual.accentBright, backgroundColor: visual.accent }}
              >
                {isRunning ? "■ STOP FLOW" : "▶ RUN FLOW"}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 font-mono text-[9px] uppercase tracking-[0.08em] text-white/40 sm:px-7">
            <span>INTERACTIVE CONCEPT / NOT A LIVE DEPLOYMENT</span>
            <span>{String(activeIndex + 1).padStart(2, "0")} / {String(selectedSystem.modules.length).padStart(2, "0")} MODULES</span>
          </div>
        </div>
      </div>
    </section>
  );
}