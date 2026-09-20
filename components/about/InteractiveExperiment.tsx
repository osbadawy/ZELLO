"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type ExperimentMode = "IMPULSE" | "ORBIT" | "SIGNAL";
type Point = { x: number; y: number };
type TrailPoint = Point & { id: number };
type SignalStamp = Point & { id: number };

const MODES: Array<{
  id: ExperimentMode;
  label: string;
  description: string;
  color: string;
}> = [
  { id: "IMPULSE", label: "IMPULSE", description: "Drag the mark to draw a persistent path through the field.", color: "#78a7ff" },
  { id: "ORBIT", label: "ORBIT", description: "Watch the frame morph into a circular system that finds its rhythm.", color: "#b992ff" },
  { id: "SIGNAL", label: "SIGNAL", description: "Click anywhere on the scope to spawn a signal for a moment.", color: "#63e6be" },
];

const PARTICLES = [
  { left: 14, top: 18, size: 3, delay: "0s" },
  { left: 28, top: 72, size: 2, delay: "-1.2s" },
  { left: 78, top: 20, size: 4, delay: "-2.8s" },
  { left: 87, top: 62, size: 2, delay: "-3.7s" },
  { left: 63, top: 83, size: 3, delay: "-4.5s" },
  { left: 8, top: 46, size: 2, delay: "-5.2s" },
  { left: 47, top: 9, size: 2, delay: "-6.1s" },
  { left: 91, top: 38, size: 3, delay: "-7s" },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function createSignalPath(seed: number) {
  const points = Array.from({ length: 25 }, (_, index) => {
    const x = (index / 24) * 100;
    const wave = Math.sin(index * 1.35 + seed) * 12 + Math.sin(index * 3.1 + seed * 0.4) * 4;
    const spike = index === 8 || index === 17 ? -28 : 0;
    return `${x},${50 + wave + spike}`;
  });
  return points.join(" ");
}

export default function InteractiveExperiment() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ pointerId: number; offsetX: number; offsetY: number } | null>(null);
  const signalTimers = useRef<number[]>([]);
  const [mode, setMode] = useState<ExperimentMode>("IMPULSE");
  const [position, setPosition] = useState<Point>({ x: 50, y: 50 });
  const [pointer, setPointer] = useState<Point>({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [isSettled, setIsSettled] = useState(false);
  const [iteration, setIteration] = useState(1);
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [signals, setSignals] = useState<SignalStamp[]>([]);
  const [signalSeed, setSignalSeed] = useState(0);

  const activeMode = useMemo(() => MODES.find((item) => item.id === mode) ?? MODES[0], [mode]);

  const updateFromPointer = useCallback((clientX: number, clientY: number) => {
    const field = fieldRef.current;
    if (!field) return;
    const bounds = field.getBoundingClientRect();
    const x = clamp(((clientX - bounds.left) / bounds.width) * 100, 8, 92);
    const y = clamp(((clientY - bounds.top) / bounds.height) * 100, 10, 90);
    setPointer({ x, y });
    return { x, y };
  }, []);

  const addTrailPoint = useCallback((point: Point) => {
    setTrail((current) => {
      const last = current[current.length - 1];
      if (last && Math.hypot(last.x - point.x, last.y - point.y) < 1.3) return current;
      return [...current, { ...point, id: Date.now() + current.length }].slice(-180);
    });
  }, []);

  const randomize = useCallback(() => {
    const next = { x: Math.round(16 + Math.random() * 68), y: Math.round(18 + Math.random() * 64) };
    setPosition(next);
    if (mode === "IMPULSE") addTrailPoint(next);
    setIteration((value) => value + 1);
    setIsSettled(false);
  }, [addTrailPoint, mode]);

  const reset = useCallback(() => {
    setMode("IMPULSE");
    setPosition({ x: 50, y: 50 });
    setPointer({ x: 50, y: 50 });
    setIteration(1);
    setTrail([]);
    setSignals([]);
    setSignalSeed(0);
    setIsSettled(false);
  }, []);

  const spawnSignal = useCallback((point: Point) => {
    const id = Date.now() + Math.random();
    setSignals((current) => [...current, { ...point, id }].slice(-12));
    const timer = window.setTimeout(() => {
      setSignals((current) => current.filter((signal) => signal.id !== id));
    }, 900);
    signalTimers.current.push(timer);
  }, []);

  useEffect(() => {
    return () => signalTimers.current.forEach((timer) => window.clearTimeout(timer));
  }, []);

  useEffect(() => {
    if (mode !== "ORBIT" || isDragging) return;
    const interval = window.setInterval(() => {
      const time = Date.now() / 1100;
      setPosition({ x: 50 + Math.cos(time) * 29, y: 50 + Math.sin(time) * 24 });
    }, 32);
    return () => window.clearInterval(interval);
  }, [mode, isDragging]);

  const handleFieldPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const nextPointer = updateFromPointer(event.clientX, event.clientY);
    if (!nextPointer || !dragRef.current) return;
    const nextPosition = {
      x: clamp(nextPointer.x - dragRef.current.offsetX, 8, 92),
      y: clamp(nextPointer.y - dragRef.current.offsetY, 10, 90),
    };
    setPosition(nextPosition);
    if (mode === "IMPULSE") addTrailPoint(nextPosition);
  };

  const handleFieldClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (mode !== "SIGNAL") return;
    const nextPoint = updateFromPointer(event.clientX, event.clientY);
    if (!nextPoint) return;
    setSignalSeed((value) => value + 1);
    spawnSignal(nextPoint);
  };

  const handleLogoPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const bounds = event.currentTarget.getBoundingClientRect();
    const field = fieldRef.current?.getBoundingClientRect();
    if (!field) return;
    dragRef.current = {
      pointerId: event.pointerId,
      offsetX: ((event.clientX - bounds.left - bounds.width / 2) / field.width) * 100,
      offsetY: ((event.clientY - bounds.top - bounds.height / 2) / field.height) * 100,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
    setIsSettled(false);
    if (mode === "IMPULSE") addTrailPoint(position);
  };

  const finishDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    dragRef.current = null;
    setIsDragging(false);
    setIsSettled(true);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const handleLogoKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const step = event.shiftKey ? 8 : 4;
    let next: Point | null = null;
    if (event.key === "ArrowUp") next = { ...position, y: clamp(position.y - step, 10, 90) };
    if (event.key === "ArrowDown") next = { ...position, y: clamp(position.y + step, 10, 90) };
    if (event.key === "ArrowLeft") next = { ...position, x: clamp(position.x - step, 8, 92) };
    if (event.key === "ArrowRight") next = { ...position, x: clamp(position.x + step, 8, 92) };
    if (next) {
      event.preventDefault();
      setPosition(next);
      if (mode === "IMPULSE") addTrailPoint(next);
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      randomize();
    }
  };

  const signalPath = createSignalPath(signalSeed);

  return (
    <section className="relative isolate flex h-full min-h-0 w-full flex-col overflow-hidden border-t-2 border-[#1c242b] bg-[#101419] text-white lg:min-h-0 lg:border-t-0 lg:border-l-2">
      <style jsx>{`
        @keyframes experimentFloat {
          0%, 100% { transform: translate3d(0, 0, 0); opacity: .35; }
          50% { transform: translate3d(0, -10px, 0); opacity: .95; }
        }
        @keyframes experimentOrbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes experimentScan {
          0% { transform: translateX(-110%); opacity: 0; }
          20%, 80% { opacity: .55; }
          100% { transform: translateX(110%); opacity: 0; }
        }
        @keyframes signalFade {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(.25); }
          18% { opacity: 1; }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.8); }
        }
        @keyframes signalLogo {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(.35) rotate(-12deg); }
          22% { opacity: 1; transform: translate(-50%, -50%) scale(1.08) rotate(0deg); }
          72% { opacity: 1; transform: translate(-50%, -50%) scale(1) rotate(0deg); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(.75) rotate(8deg); }
        }
        .experiment-particle { animation: experimentFloat 4.5s ease-in-out infinite; animation-delay: var(--particle-delay); }
        .experiment-orbit { animation: experimentOrbit 18s linear infinite; }
        .experiment-scan { animation: experimentScan 3.6s ease-in-out infinite; }
        .signal-ripple { animation: signalFade .9s ease-out forwards; }
        .signal-logo { animation: signalLogo .9s ease-out forwards; }
        @media (prefers-reduced-motion: reduce) {
          .experiment-particle, .experiment-orbit, .experiment-scan, .signal-ripple, .signal-logo { animation: none; }
        }
      `}</style>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-50" style={{ backgroundImage: "linear-gradient(rgba(120,167,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(120,167,255,0.1) 1px,transparent 1px)", backgroundSize: "32px 32px" }} />

      <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-white/20 p-5 font-mono text-[10px] tracking-[0.12em] text-white/60 sm:p-6">
        <div>
          <span>EXPERIMENT / {String(iteration).padStart(3, "0")}</span>
          <span className="ml-3 text-white/30">PENTA LAB / {activeMode.label}</span>
        </div>
        <div className="flex items-center gap-2" style={{ color: activeMode.color }}>
          <span className="size-2 rounded-full shadow-[0_0_14px_currentColor]" style={{ backgroundColor: activeMode.color }} />
          <span>{isDragging ? "REPOSITIONING" : isSettled ? "NEW STATE FOUND" : mode === "SIGNAL" ? "SCOPE LISTENING" : "READY TO EXPLORE"}</span>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-6 sm:px-8 sm:py-8 lg:px-10">
        <div
          ref={fieldRef}
          onPointerMove={handleFieldPointerMove}
          onPointerLeave={() => setPointer({ x: 50, y: 50 })}
          onClick={handleFieldClick}
          className={`relative grid aspect-[1.18/1] w-full max-w-[720px] place-items-center touch-none select-none overflow-hidden border transition-[border-color,background,box-shadow] duration-500 ${mode === "SIGNAL" ? "cursor-crosshair" : ""}`}
          style={{
            borderColor: `${activeMode.color}66`,
            background: `radial-gradient(circle at ${pointer.x}% ${pointer.y}%, ${activeMode.color}1c, transparent 34%), #101419`,
            boxShadow: `inset 0 0 100px ${activeMode.color}0d`,
          }}
        >
          {mode === "IMPULSE" && (
            <>
              <div className="absolute inset-[6%] border border-white/15" />
              <div className="absolute inset-[15%] rotate-45 border border-white/10" />
              <div className="absolute inset-[25%] border border-white/15" />
              <div className="absolute left-0 top-1/2 h-px w-full bg-white/15" />
              <div className="absolute left-1/2 top-0 h-full w-px bg-white/15" />
              <div className="absolute inset-[9%] rounded-full border border-dashed opacity-30" style={{ borderColor: activeMode.color }} />
              {trail.length > 1 && (
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
                  <polyline points={trail.map((point) => `${point.x},${point.y}`).join(" ")} fill="none" stroke={activeMode.color} strokeWidth="0.65" vectorEffect="non-scaling-stroke" opacity=".95" />
                  {trail.slice(-1).map((point) => <circle key={point.id} cx={point.x} cy={point.y} r="1.2" fill={activeMode.color} />)}
                </svg>
              )}
            </>
          )}

          {mode === "ORBIT" && (
            <>
              <div className="absolute inset-[10%] rounded-full border border-dashed opacity-55" style={{ borderColor: activeMode.color }} />
              <div className="absolute inset-[22%] rounded-full border border-dotted opacity-45" style={{ borderColor: activeMode.color }} />
              <div className="experiment-orbit absolute inset-[16%] rounded-full border border-white/20" style={{ borderTopColor: activeMode.color, borderRightColor: activeMode.color }} />
              <div className="absolute left-1/2 top-1/2 h-[80%] w-px -translate-x-1/2 -translate-y-1/2 bg-white/10" />
              <div className="absolute left-1/2 top-1/2 h-px w-[80%] -translate-x-1/2 -translate-y-1/2 bg-white/10" />
              <div className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ backgroundColor: activeMode.color, boxShadow: `0 0 28px ${activeMode.color}` }} />
            </>
          )}

          {mode === "SIGNAL" && (
            <>
              <div className="absolute inset-[8%] border border-white/15" />
              <div className="absolute left-[8%] right-[8%] top-1/2 border-t border-dashed border-white/20" />
              <div className="absolute bottom-[8%] left-[8%] right-[8%] border-t border-white/20" />
              <div className="absolute left-[8%] top-[8%] bottom-[8%] border-l border-white/20" />
              <div className="absolute right-[8%] top-[8%] bottom-[8%] border-l border-white/20" />
              <div className="absolute left-[8%] right-[8%] top-[26%] border-t border-white/10" />
              <div className="absolute left-[8%] right-[8%] top-[74%] border-t border-white/10" />
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-[8%] h-[84%] w-[84%] overflow-visible">
                <polyline points={signalPath} fill="none" stroke={activeMode.color} strokeWidth="0.75" vectorEffect="non-scaling-stroke" opacity=".9" />
                <polyline points={signalPath} fill="none" stroke={activeMode.color} strokeWidth="3" vectorEffect="non-scaling-stroke" opacity=".12" />
              </svg>
              <span className="absolute left-[10%] top-[10%] font-mono text-[8px] tracking-[0.14em]" style={{ color: activeMode.color }}>OSC / 01</span>
              <span className="absolute right-[10%] top-[10%] font-mono text-[8px] text-white/40">CLICK TO PING</span>
            </>
          )}

          {PARTICLES.map((particle, index) => (
            <span key={index} aria-hidden="true" className="experiment-particle absolute rounded-full" style={{ left: `${particle.left}%`, top: `${particle.top}%`, width: particle.size, height: particle.size, backgroundColor: activeMode.color, boxShadow: `0 0 10px ${activeMode.color}`, ["--particle-delay" as string]: particle.delay }} />
          ))}

          {mode === "SIGNAL" && signals.map((signal) => (
            <div key={signal.id} className="pointer-events-none absolute" style={{ left: `${signal.x}%`, top: `${signal.y}%` }}>
              <span className="signal-ripple absolute left-0 top-0 block size-14 rounded-full border" style={{ borderColor: activeMode.color }} />
              <span className="signal-logo absolute left-0 top-0 grid aspect-square w-16 place-items-center border-2 text-white" style={{ borderColor: activeMode.color, backgroundColor: activeMode.color, boxShadow: `0 0 45px ${activeMode.color}88` }}>
                <span className="grid size-8 place-items-center border-2 border-[#1c242b] bg-[#2f6fed] text-xl font-bold leading-none tracking-[-0.16em] shadow-[3px_3px_0_#1c242b]">P/</span>
              </span>
            </div>
          ))}

          {mode !== "SIGNAL" && (
            <button
              type="button"
              aria-label="Penta Labs logo. Drag to draw. Use arrow keys to move. Press Enter to randomize."
              onPointerDown={handleLogoPointerDown}
              onPointerMove={(event) => {
                if (dragRef.current) handleFieldPointerMove(event as unknown as React.PointerEvent<HTMLDivElement>);
              }}
              onPointerUp={finishDrag}
              onPointerCancel={finishDrag}
              onKeyDown={handleLogoKeyDown}
              className="group absolute grid aspect-square w-[25%] min-w-[116px] place-items-center border-2 text-white outline-none transition-[left,top,transform,box-shadow] duration-300 focus-visible:ring-4 focus-visible:ring-[#78a7ff]/40"
              style={{ left: `${position.x}%`, top: `${position.y}%`, transform: `translate(-50%, -50%) rotate(${(pointer.x - 50) * 0.08}deg) scale(${isDragging ? 1.08 : 1})`, borderColor: activeMode.color, backgroundColor: activeMode.color, boxShadow: `0 0 ${isDragging ? 90 : 65}px ${activeMode.color}40, 6px 6px 0 #1c242b`, cursor: isDragging ? "grabbing" : "grab" }}
            >
              <span className="grid size-[46%] place-items-center border-2 border-[#1c242b] bg-[#2f6fed] text-[clamp(26px,5vw,56px)] font-bold leading-none tracking-[-0.16em] transition-transform duration-300 group-hover:scale-110">P/</span>
              <span className="absolute bottom-[8%] font-mono text-[8px] tracking-[0.16em] text-white/70">PENTA LABS</span>
            </button>
          )}

          <span className="absolute left-[2.5%] top-[2.5%] font-mono text-[9px] text-white/50">X / {Math.round(position.x).toString().padStart(3, "0")}</span>
          <span className="absolute bottom-[2.5%] right-[2.5%] font-mono text-[9px] text-white/50">Y / {Math.round(position.y).toString().padStart(3, "0")}</span>
          <span className="absolute bottom-[2.5%] left-[2.5%] font-mono text-[9px] text-white/35">{mode === "SIGNAL" ? `${signals.length} ACTIVE PINGS` : mode === "IMPULSE" ? `${trail.length} TRAIL POINTS` : "ORBIT LOCKED"}</span>
        </div>

        <div className="mt-4 flex w-full max-w-[720px] flex-wrap items-center justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.12em] text-white/45">
          <span>{activeMode.description}</span>
          <span>{mode === "SIGNAL" ? "CLICK FRAME / SPAWN LOGO" : "DRAG / CLICK / KEYS"}</span>
        </div>
      </div>

      <div className="relative border-t border-white/20">
        <div className="grid grid-cols-3 border-b border-white/15">
          {MODES.map((item, index) => (
            <button key={item.id} type="button" onClick={() => { setMode(item.id); setIsSettled(false); setIteration((value) => value + 1); }} className="border-r border-white/20 p-4 text-left transition-colors last:border-r-0 hover:bg-white/5 sm:p-6" style={{ color: mode === item.id ? item.color : undefined }} aria-pressed={mode === item.id}>
              <span className="font-mono text-[10px]">0{index + 1}</span>
              <p className="mt-3 text-[10px] font-semibold tracking-[0.05em] sm:text-xs">{item.label}</p>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-6">
          <div className="font-mono text-[9px] uppercase tracking-[0.1em] text-white/40">{isSettled ? "A POSSIBILITY HAS BEEN RECORDED." : mode === "SIGNAL" ? "THE SCOPE IS LISTENING." : "NO FIXED OUTCOME. JUST POSSIBILITY."}</div>
          <div className="flex gap-2">
            <button type="button" onClick={randomize} className="border border-white/20 px-3 py-2 font-mono text-[9px] tracking-[0.1em] text-white/70 transition hover:border-white/60 hover:text-white">RANDOMIZE</button>
            <button type="button" onClick={reset} className="border px-3 py-2 font-mono text-[9px] tracking-[0.1em] transition hover:bg-white/10" style={{ borderColor: activeMode.color, color: activeMode.color }}>RESET</button>
          </div>
        </div>
      </div>
    </section>
  );
}