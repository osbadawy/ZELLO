"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

type NodeStatus = "online" | "warning" | "standby";
type NodeKind = "input" | "core" | "data" | "service" | "interface";

type ArchitectureNode = {
  id: string;
  label: string;
  detail: string;
  layer: string;
  kind: NodeKind;
  status: NodeStatus;
  x: number;
  y: number;
  width: number;
  height: number;
  metric: string;
};

type ArchitectureEdge = {
  id: string;
  source: string;
  target: string;
  label?: string;
  tone?: "default" | "hot" | "muted";
};

type GameState = "ready" | "running" | "failed" | "complete";

const nodes: ArchitectureNode[] = [
  {
    id: "event-gateway",
    label: "EVENT GATEWAY",
    detail: "Receives external events and converts them into normalized system messages.",
    layer: "LAYER 01 / INPUT",
    kind: "input",
    status: "online",
    x: 395,
    y: 24,
    width: 210,
    height: 56,
    metric: "18.4k events/min",
  },
  {
    id: "webhooks",
    label: "WEBHOOKS",
    detail: "Inbound webhooks from partner systems.",
    layer: "INPUT",
    kind: "input",
    status: "online",
    x: 52,
    y: 116,
    width: 150,
    height: 54,
    metric: "99.98% healthy",
  },
  {
    id: "scheduler",
    label: "SCHEDULER",
    detail: "Time-based jobs and recurring automations.",
    layer: "INPUT",
    kind: "input",
    status: "online",
    x: 224,
    y: 116,
    width: 150,
    height: 54,
    metric: "42 active jobs",
  },
  {
    id: "message-bus",
    label: "MESSAGE BUS",
    detail: "Buffers and routes events between independent services.",
    layer: "CORE",
    kind: "core",
    status: "online",
    x: 425,
    y: 116,
    width: 150,
    height: 54,
    metric: "2.1 ms latency",
  },
  {
    id: "identity",
    label: "IDENTITY",
    detail: "Authentication, authorization, and tenant boundaries.",
    layer: "CONTROL",
    kind: "service",
    status: "online",
    x: 626,
    y: 116,
    width: 150,
    height: 54,
    metric: "0 denied spikes",
  },
  {
    id: "policy-engine",
    label: "POLICY ENGINE",
    detail: "Evaluates business rules before work is dispatched.",
    layer: "CONTROL",
    kind: "service",
    status: "warning",
    x: 828,
    y: 116,
    width: 150,
    height: 54,
    metric: "3 rules delayed",
  },
  {
    id: "ingestion",
    label: "INGESTION",
    detail: "Validates, batches, and enriches incoming payloads.",
    layer: "LAYER 02 / PROCESS",
    kind: "core",
    status: "online",
    x: 48,
    y: 224,
    width: 156,
    height: 58,
    metric: "4.8k/sec",
  },
  {
    id: "normalizer",
    label: "NORMALIZER",
    detail: "Creates one canonical shape from many source formats.",
    layer: "PROCESS",
    kind: "core",
    status: "online",
    x: 230,
    y: 224,
    width: 156,
    height: 58,
    metric: "12 schemas",
  },
  {
    id: "orchestrator",
    label: "CORE ORCHESTRATOR",
    detail: "Coordinates the system: selects tools, routes work, and manages retries.",
    layer: "LAYER 03 / CONTROL PLANE",
    kind: "core",
    status: "online",
    x: 405,
    y: 208,
    width: 260,
    height: 86,
    metric: "99.97% uptime",
  },
  {
    id: "feature-flags",
    label: "FEATURE FLAGS",
    detail: "Controls progressive rollout and experiments.",
    layer: "CONTROL",
    kind: "service",
    status: "standby",
    x: 724,
    y: 224,
    width: 156,
    height: 58,
    metric: "8 experiments",
  },
  {
    id: "primary-db",
    label: "PRIMARY DB",
    detail: "Transactional source of truth for operational records.",
    layer: "LAYER 04 / DATA",
    kind: "data",
    status: "online",
    x: 38,
    y: 356,
    width: 158,
    height: 58,
    metric: "64% utilized",
  },
  {
    id: "cache",
    label: "CACHE",
    detail: "Low-latency reads for hot state and session data.",
    layer: "DATA",
    kind: "data",
    status: "online",
    x: 222,
    y: 356,
    width: 158,
    height: 58,
    metric: "91% hit rate",
  },
  {
    id: "vector-index",
    label: "VECTOR INDEX",
    detail: "Semantic retrieval layer for contextual system memory.",
    layer: "DATA",
    kind: "data",
    status: "online",
    x: 406,
    y: 356,
    width: 158,
    height: 58,
    metric: "8.2m vectors",
  },
  {
    id: "telemetry",
    label: "TELEMETRY",
    detail: "Logs, traces, and system health signals.",
    layer: "OBSERVABILITY",
    kind: "service",
    status: "online",
    x: 590,
    y: 356,
    width: 158,
    height: 58,
    metric: "240 spans/sec",
  },
  {
    id: "secrets",
    label: "SECRETS VAULT",
    detail: "Encrypted credentials and rotating service keys.",
    layer: "SECURITY",
    kind: "service",
    status: "online",
    x: 774,
    y: 356,
    width: 158,
    height: 58,
    metric: "12 keys rotated",
  },
  {
    id: "api-layer",
    label: "API LAYER",
    detail: "Stable public contracts for product and partner clients.",
    layer: "LAYER 05 / DELIVERY",
    kind: "interface",
    status: "online",
    x: 88,
    y: 492,
    width: 174,
    height: 58,
    metric: "1.2k req/sec",
  },
  {
    id: "workflow-engine",
    label: "WORKFLOWS",
    detail: "Long-running business processes and human approvals.",
    layer: "DELIVERY",
    kind: "interface",
    status: "online",
    x: 304,
    y: 492,
    width: 174,
    height: 58,
    metric: "76 running",
  },
  {
    id: "agent-runtime",
    label: "AGENT RUNTIME",
    detail: "Tool-using agents that execute bounded actions.",
    layer: "DELIVERY",
    kind: "interface",
    status: "warning",
    x: 520,
    y: 492,
    width: 174,
    height: 58,
    metric: "2 retries queued",
  },
  {
    id: "analytics",
    label: "ANALYTICS",
    detail: "Decision-ready metrics for teams and operators.",
    layer: "DELIVERY",
    kind: "interface",
    status: "online",
    x: 736,
    y: 492,
    width: 174,
    height: 58,
    metric: "36 dashboards",
  },
  {
    id: "command-center",
    label: "COMMAND CENTER",
    detail: "The operator surface for seeing, steering, and debugging the whole system.",
    layer: "LAYER 06 / USER INTERFACE",
    kind: "interface",
    status: "online",
    x: 380,
    y: 590,
    width: 240,
    height: 54,
    metric: "LIVE",
  },
];

const edges: ArchitectureEdge[] = [
  { id: "webhooks-gateway", source: "webhooks", target: "event-gateway", label: "events" },
  { id: "scheduler-gateway", source: "scheduler", target: "event-gateway", label: "jobs" },
  { id: "bus-gateway", source: "message-bus", target: "event-gateway", label: "route" },
  { id: "identity-gateway", source: "identity", target: "event-gateway", label: "auth" },
  { id: "policy-gateway", source: "policy-engine", target: "event-gateway", label: "rules" },
  { id: "gateway-ingestion", source: "event-gateway", target: "ingestion", label: "fan-out" },
  { id: "gateway-normalizer", source: "event-gateway", target: "normalizer", label: "payload" },
  { id: "gateway-orchestrator", source: "event-gateway", target: "orchestrator", label: "dispatch", tone: "hot" },
  { id: "ingestion-normalizer", source: "ingestion", target: "normalizer" },
  { id: "normalizer-orchestrator", source: "normalizer", target: "orchestrator", label: "canonical" },
  { id: "identity-orchestrator", source: "identity", target: "orchestrator", label: "principal" },
  { id: "policy-orchestrator", source: "policy-engine", target: "orchestrator", label: "decision" },
  { id: "flags-orchestrator", source: "feature-flags", target: "orchestrator", label: "rollout" },
  { id: "orchestrator-db", source: "orchestrator", target: "primary-db", label: "write" },
  { id: "orchestrator-cache", source: "orchestrator", target: "cache", label: "read" },
  { id: "orchestrator-vector", source: "orchestrator", target: "vector-index", label: "retrieve", tone: "hot" },
  { id: "orchestrator-telemetry", source: "orchestrator", target: "telemetry", label: "trace" },
  { id: "secrets-orchestrator", source: "secrets", target: "orchestrator", label: "credentials" },
  { id: "db-api", source: "primary-db", target: "api-layer" },
  { id: "cache-api", source: "cache", target: "api-layer" },
  { id: "vector-agent", source: "vector-index", target: "agent-runtime", label: "context" },
  { id: "telemetry-analytics", source: "telemetry", target: "analytics", label: "signals" },
  { id: "orchestrator-workflows", source: "orchestrator", target: "workflow-engine", label: "execute", tone: "hot" },
  { id: "orchestrator-agent", source: "orchestrator", target: "agent-runtime", label: "tools", tone: "hot" },
  { id: "orchestrator-analytics", source: "orchestrator", target: "analytics", label: "measure" },
  { id: "api-command", source: "api-layer", target: "command-center" },
  { id: "workflow-command", source: "workflow-engine", target: "command-center" },
  { id: "agent-command", source: "agent-runtime", target: "command-center" },
  { id: "analytics-command", source: "analytics", target: "command-center" },
  { id: "telemetry-orchestrator", source: "telemetry", target: "orchestrator", label: "feedback", tone: "muted" },
];

const statusColor: Record<NodeStatus, string> = {
  online: "#63e6be",
  warning: "#ffcf66",
  standby: "#8291a8",
};

const kindFill: Record<NodeKind, string> = {
  input: "#162231",
  core: "#1b4fc1",
  data: "#172331",
  service: "#1b2632",
  interface: "#202b36",
};

const kindStroke: Record<NodeKind, string> = {
  input: "#6685a9",
  core: "#8cb0ff",
  data: "#6587ab",
  service: "#7590ab",
  interface: "#8b9bb0",
};

function findNode(id: string) {
  return nodes.find((node) => node.id === id)!;
}

function getConnectorPath(source: ArchitectureNode, target: ArchitectureNode) {
  const sourceCenter = { x: source.x + source.width / 2, y: source.y + source.height / 2 };
  const targetCenter = { x: target.x + target.width / 2, y: target.y + target.height / 2 };
  const dx = targetCenter.x - sourceCenter.x;
  const dy = targetCenter.y - sourceCenter.y;
  const sourceScale = Math.min(
    source.width / 2 / Math.max(Math.abs(dx), 1),
    source.height / 2 / Math.max(Math.abs(dy), 1),
  );
  const targetScale = Math.min(
    target.width / 2 / Math.max(Math.abs(dx), 1),
    target.height / 2 / Math.max(Math.abs(dy), 1),
  );
  const start = {
    x: sourceCenter.x + dx * sourceScale,
    y: sourceCenter.y + dy * sourceScale,
  };
  const end = {
    x: targetCenter.x - dx * targetScale,
    y: targetCenter.y - dy * targetScale,
  };
  const bend = Math.max(26, Math.min(70, Math.abs(end.y - start.y) * 0.42));
  const direction = end.y >= start.y ? 1 : -1;
  return `M ${start.x} ${start.y} C ${start.x} ${start.y + bend * direction}, ${end.x} ${end.y - bend * direction}, ${end.x} ${end.y}`;
}

export default function InteractiveArchitecture() {
  const diagramId = useId().replace(/:/g, "");
  const [selectedId, setSelectedId] = useState("event-gateway");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeEdgeId, setActiveEdgeId] = useState("gateway-ingestion");
  const [isLive, setIsLive] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [filter, setFilter] = useState<"all" | NodeKind>("all");
  const [gameState, setGameState] = useState<GameState>("ready");
  const [progressIndex, setProgressIndex] = useState(-1);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [gameMessage, setGameMessage] = useState("Boot the system, then connect the highlighted modules in order.");
  const dragRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);

  const gamePath = [
    "event-gateway",
    "ingestion",
    "normalizer",
    "orchestrator",
    "vector-index",
    "agent-runtime",
    "command-center",
  ];
  const nextNodeId = gamePath[progressIndex + 1];
  const isGameComplete = gameState === "complete";
  const selectedNode = findNode(selectedId);
  const connectedNodeIds = useMemo(() => {
    const ids = new Set([selectedId]);
    edges.forEach((edge) => {
      if (edge.source === selectedId) ids.add(edge.target);
      if (edge.target === selectedId) ids.add(edge.source);
    });
    return ids;
  }, [selectedId]);

  const completedEdgeIds = useMemo(() => {
    const completed = new Set<string>();
    for (let index = 1; index <= progressIndex; index += 1) {
      const edge = edges.find(
        (candidate) =>
          candidate.source === gamePath[index - 1] && candidate.target === gamePath[index],
      );
      if (edge) completed.add(edge.id);
    }
    return completed;
  }, [progressIndex]);

  useEffect(() => {
    if (!isLive || isGameComplete) return;
    const interval = window.setInterval(() => {
      setActiveEdgeId((current) => {
        const index = edges.findIndex((edge) => edge.id === current);
        return edges[(index + 1) % edges.length].id;
      });
    }, 1200);
    return () => window.clearInterval(interval);
  }, [isLive, isGameComplete]);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const resetGame = () => {
    setGameState("ready");
    setProgressIndex(-1);
    setWrongAttempts(0);
    setSelectedId("event-gateway");
    setGameMessage("Boot the system, then connect the highlighted modules in order.");
    setActiveEdgeId("gateway-ingestion");
  };

  const handleNodeGameClick = (nodeId: string) => {
    setSelectedId(nodeId);
    if (gameState === "ready") {
      setGameState("running");
    }
    if (gameState === "failed" || gameState === "complete") return;

    const expectedNodeId = gamePath[progressIndex + 1];
    if (nodeId === expectedNodeId) {
      const nextIndex = progressIndex + 1;
      const previousNodeId = gamePath[nextIndex - 1];
      const edge = edges.find(
        (candidate) =>
          candidate.source === previousNodeId && candidate.target === nodeId,
      );
      if (edge) setActiveEdgeId(edge.id);
      setProgressIndex(nextIndex);
      if (nextIndex === gamePath.length - 1) {
        setGameState("complete");
        setGameMessage("System active. Every critical pathway is connected.");
      } else {
        setGameMessage(`${findNode(nodeId).label} connected. Find the next highlighted module.`);
      }
      return;
    }

    setWrongAttempts((attempts) => attempts + 1);
    setGameState("failed");
    setGameMessage(`Connection rejected. ${findNode(nodeId).label} is not the next required module.`);
  };

  const handlePointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
    if (event.target !== event.currentTarget) return;
    dragRef.current = { x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!dragRef.current) return;
    const dx = event.clientX - dragRef.current.x;
    const dy = event.clientY - dragRef.current.y;
    setPan({ x: dragRef.current.panX + dx / 2, y: dragRef.current.panY + dy / 2 });
  };

  const handlePointerUp = (event: React.PointerEvent<SVGSVGElement>) => {
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const visibleNodes = filter === "all" ? nodes : nodes.filter((node) => node.kind === filter);
  const visibleNodeIds = new Set(visibleNodes.map((node) => node.id));
  const visibleEdges = edges.filter(
    (edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target),
  );
  const isNextNode = (nodeId: string) => nodeId === nextNodeId && gameState !== "complete" && gameState !== "failed";

  return (
    <section className="relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#101419] text-white">
      <style jsx>{`
        @keyframes architectureDash {
          to { stroke-dashoffset: -28; }
        }
        @keyframes architecturePacket {
          0% { offset-distance: 0%; opacity: 0; }
          12% { opacity: 1; }
          88% { opacity: 1; }
          100% { offset-distance: 100%; opacity: 0; }
        }
        .architecture-dash { animation: architectureDash 1.1s linear infinite; }
        .architecture-packet { offset-rotate: 0deg; animation: architecturePacket 1.7s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .architecture-dash, .architecture-packet { animation: none; }
        }
      `}</style>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-45"
        style={{
          backgroundImage:
            "linear-gradient(rgba(137,175,255,0.09) 1px,transparent 1px),linear-gradient(90deg,rgba(137,175,255,0.09) 1px,transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-white/15 p-5 font-mono text-[10px] tracking-[0.12em] text-white/60 sm:p-6">
        <div>
          <span>FIG. 01 / SYSTEM ACTIVATION PROTOCOL</span>
          <span className="ml-3 text-white/30">{nodes.length} NODES / {edges.length} LINKS</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`size-2 rounded-full ${isGameComplete ? "bg-[#63e6be] shadow-[0_0_14px_#63e6be]" : gameState === "failed" ? "bg-[#ff7f7f]" : "bg-[#ffcf66]"}`} />
          <span>{isGameComplete ? "SYSTEM ACTIVE" : gameState === "failed" ? "CONNECTION ERROR" : "AWAITING INPUT"}</span>
        </div>
      </div>

      <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-3 sm:px-6">
        <div className="flex flex-wrap gap-1.5">
          {(["all", "input", "core", "data", "service", "interface"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] transition ${
                filter === item
                  ? "border-[#78a7ff] bg-[#2f6fed]/20 text-[#bcd2ff]"
                  : "border-white/15 text-white/45 hover:border-white/40 hover:text-white/80"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Zoom out"
            onClick={() => setZoom((value) => Math.max(0.7, Number((value - 0.1).toFixed(1))))}
            className="grid size-7 place-items-center border border-white/15 font-mono text-sm text-white/70 transition hover:border-[#78a7ff] hover:text-white"
          >
            −
          </button>
          <button
            type="button"
            onClick={resetView}
            className="h-7 border border-white/15 px-2 font-mono text-[9px] tracking-[0.1em] text-white/55 transition hover:border-[#78a7ff] hover:text-white"
          >
            {Math.round(zoom * 100)}% / RESET
          </button>
          <button
            type="button"
            aria-label="Zoom in"
            onClick={() => setZoom((value) => Math.min(1.6, Number((value + 0.1).toFixed(1))))}
            className="grid size-7 place-items-center border border-white/15 font-mono text-sm text-white/70 transition hover:border-[#78a7ff] hover:text-white"
          >
            +
          </button>
        </div>
      </div>

      <div className="relative min-h-[530px] flex-1 overflow-hidden p-2 sm:p-4">
        <svg
          viewBox="0 0 1000 660"
          role="img"
          aria-label="Interactive connected operations architecture diagram"
          className="h-full min-h-[520px] w-full cursor-grab active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onClick={() => {
            if (!dragRef.current) setSelectedId("orchestrator");
          }}
        >
          <defs>
            <linearGradient id={`system-line-${diagramId}`} x1="0" x2="1">
              <stop offset="0%" stopColor="#526b88" />
              <stop offset="55%" stopColor="#5f8fe9" />
              <stop offset="100%" stopColor="#2f6fed" />
            </linearGradient>
            <filter id={`system-glow-${diagramId}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          <g transform={`translate(${pan.x} ${pan.y}) scale(${zoom})`}>
            <g fill="none" stroke={`url(#system-line-${diagramId})`} strokeWidth="1.25" opacity="0.72">
              {visibleEdges.map((edge) => {
                const source = findNode(edge.source);
                const target = findNode(edge.target);
                const path = getConnectorPath(source, target);
                const isActive = activeEdgeId === edge.id;
                const isCompleted = completedEdgeIds.has(edge.id);
                const isConnected = connectedNodeIds.has(edge.source) && connectedNodeIds.has(edge.target);
                return (
                  <g key={edge.id} opacity={selectedId && !isConnected && hoveredId ? 0.16 : 1}>
                    <path
                      d={path}
                      stroke={isCompleted ? "#63e6be" : edge.tone === "hot" ? "#78a7ff" : edge.tone === "muted" ? "#536275" : `url(#system-line-${diagramId})`}
                      strokeWidth={isCompleted ? 2.8 : isActive ? 2.8 : isConnected ? 2 : 1.15}
                      strokeDasharray={isCompleted ? "none" : isActive ? "7 6" : edge.tone === "muted" ? "3 7" : "none"}
                      className={!isCompleted && isActive ? "architecture-dash" : undefined}
                      filter={isActive || isCompleted ? `url(#system-glow-${diagramId})` : undefined}
                    />
                    {isActive && !isCompleted && (
                      <circle r="5" fill="#bcd2ff" filter={`url(#system-glow-${diagramId})`}>
                        <animateMotion dur="1.6s" repeatCount="indefinite" path={path} />
                      </circle>
                    )}
                    {edge.label && (isActive || isConnected) && (
                      <text
                        x={(source.x + source.width / 2 + target.x + target.width / 2) / 2}
                        y={(source.y + source.height / 2 + target.y + target.height / 2) / 2}
                        fill="#9cb8dd"
                        fontSize="8"
                        fontFamily="monospace"
                        textAnchor="middle"
                        className="pointer-events-none"
                      >
                        {edge.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>

            <g>
              {visibleNodes.map((node) => {
                const isSelected = selectedId === node.id;
                const isHovered = hoveredId === node.id;
                const isNeighbor = connectedNodeIds.has(node.id);
                const dimmed = Boolean(hoveredId) && !isHovered && !isNeighbor;
                const isNext = isNextNode(node.id);
                const isCompleted = progressIndex >= gamePath.indexOf(node.id);
                const nodeColor = isCompleted ? "#63e6be" : statusColor[node.status];
                return (
                  <g
                    key={node.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`${node.label}. ${node.detail}`}
                    transform={`translate(${node.x} ${node.y})`}
                    className="cursor-pointer outline-none"
                    opacity={dimmed ? 0.25 : 1}
                    onMouseEnter={() => setHoveredId(node.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleNodeGameClick(node.id);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedId(node.id);
                      }
                    }}
                  >
                    <rect
                      x={-3}
                      y={-3}
                      width={node.width + 6}
                      height={node.height + 6}
                      fill="none"
                      stroke={isNext ? "#ffcf66" : isCompleted ? "#63e6be" : "transparent"}
                      strokeWidth={isNext ? 2 : 1}
                      strokeDasharray={isNext ? "4 5" : "none"}
                      className={isNext ? "architecture-dash" : undefined}
                    />
                    <rect
                      width={node.width}
                      height={node.height}
                      fill={isCompleted ? "#174b43" : kindFill[node.kind]}
                      stroke={isNext ? "#ffcf66" : isCompleted ? "#63e6be" : isSelected || isHovered ? "#bcd2ff" : kindStroke[node.kind]}
                      strokeWidth={isNext || isSelected ? 2 : 1}
                      rx={node.kind === "core" ? 2 : 0}
                    />
                    <rect width={4} height={node.height} fill={nodeColor} opacity="0.9" />
                    <circle cx={node.width - 13} cy={13} r={isNext ? 5 : isSelected ? 4 : 3} fill={isNext ? "#ffcf66" : nodeColor} />
                    {isNext && (
                      <text x={node.width - 22} y={node.height - 9} fill="#ffcf66" fontSize="8" fontFamily="monospace" textAnchor="end">
                        NEXT
                      </text>
                    )}
                    <text x={14} y={17} fill="#9bb3d0" fontSize="7.5" fontFamily="monospace" letterSpacing="1">
                      {node.layer}
                    </text>
                    <text x={14} y={node.height / 2 + 6} fill="white" fontSize={node.width > 220 ? 13 : 10.5} fontFamily="monospace" fontWeight="700">
                      {node.label}
                    </text>
                    <text x={14} y={node.height - 9} fill="#b5c5d8" fontSize="8" fontFamily="monospace">
                      {node.metric}
                    </text>
                  </g>
                );
              })}
            </g>
          </g>
        </svg>

        <div className="pointer-events-none absolute bottom-5 left-5 font-mono text-[9px] uppercase tracking-[0.12em] text-white/35 sm:left-8">
          {gameState === "failed" ? "Press retry to reconnect the sequence" : gameState === "complete" ? "All pathways connected / system active" : "Click the highlighted node to connect the next module"}
        </div>
      </div>

      <div className="relative grid border-t border-white/15 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div className="border-b border-white/15 p-5 lg:border-b-0 lg:border-r sm:p-6">
          <div className="mb-3 flex items-center justify-between">
            <div className="font-mono text-[10px] tracking-[0.13em] text-[#78a7ff]">SYSTEM ACTIVATION GAME</div>
            <span className={`font-mono text-[9px] ${gameState === "complete" ? "text-[#63e6be]" : gameState === "failed" ? "text-[#ff7f7f]" : "text-[#ffcf66]"}`}>
              {gameState === "complete" ? "ACTIVE" : `${Math.max(progressIndex + 1, 0)} / ${gamePath.length}`}
            </span>
          </div>
          <h2 className="font-mono text-lg font-semibold tracking-tight text-white">{isGameComplete ? "SYSTEM ACTIVE" : "CONNECT THE SYSTEM"}</h2>
          <p className={`mt-2 max-w-xl text-sm leading-relaxed ${gameState === "failed" ? "text-[#ffb2b2]" : gameState === "complete" ? "text-[#9af3d0]" : "text-white/55"}`}>
            {gameMessage}
          </p>
          <div className="mt-4 flex flex-wrap gap-2 font-mono text-[9px] uppercase tracking-[0.1em] text-white/55">
            <span className="border border-white/15 px-2 py-1">{selectedNode.label}</span>
            <span className="border border-white/15 px-2 py-1">{wrongAttempts} ERRORS</span>
          </div>
        </div>

        <div className="border-b border-white/15 p-5 sm:p-6 lg:border-b-0 lg:border-r">
          <div className="font-mono text-[10px] tracking-[0.13em] text-[#78a7ff]">GAME CONTROLS</div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => setIsLive((value) => !value)}
              className={`flex-1 border px-3 py-2 font-mono text-[10px] tracking-[0.1em] transition ${isLive ? "border-[#63e6be] bg-[#63e6be]/10 text-[#9af3d0]" : "border-white/20 text-white/60 hover:border-white/50 hover:text-white"}`}
            >
              {isLive ? "PAUSE SIGNALS" : "RESUME SIGNALS"}
            </button>
            <button
              type="button"
              onClick={resetGame}
              className="border border-white/20 px-3 py-2 font-mono text-[10px] tracking-[0.1em] text-white/60 transition hover:border-[#ffcf66] hover:text-white"
            >
              RETRY
            </button>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden bg-white/10">
            <div className="h-full bg-[#63e6be] transition-all duration-500" style={{ width: `${Math.max(0, (progressIndex + 1) / gamePath.length) * 100}%` }} />
          </div>
          <div className="mt-2 flex justify-between font-mono text-[9px] text-white/45">
            <span>{isGameComplete ? "ALL PATHWAYS ONLINE" : "ACTIVATION PROGRESS"}</span>
            <span>{Math.round(Math.max(0, (progressIndex + 1) / gamePath.length) * 100)}%</span>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="font-mono text-[10px] tracking-[0.13em] text-[#78a7ff]">OPERATING MODEL</div>
          <div className="mt-4 grid grid-cols-3">
            {[['01', 'STRATEGY'], ['02', 'ARCHITECTURE'], ['03', 'EXECUTION']].map(([number, label]) => (
              <div key={number} className="border-r border-white/15 px-2 first:pl-0 last:border-r-0">
                <div className="font-mono text-[10px] text-[#78a7ff]">{number}</div>
                <div className="mt-2 text-[9px] font-semibold tracking-[0.06em] text-white/75">{label}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-2 font-mono text-[9px] text-white/40">
            <span className="size-2 rounded-full bg-[#63e6be]" /> ONLINE
            <span className="ml-2 size-2 rounded-full bg-[#ffcf66]" /> DEGRADED
            <span className="ml-2 size-2 rounded-full bg-[#8291a8]" /> STANDBY
          </div>
        </div>
      </div>
    </section>
  );
}