"use client";

import {
  useEffect,
  useRef,
  type RefObject,
} from "react";

type HeroParticlesProps = {
  parentRef: RefObject<HTMLDivElement | null>;
};

type Particle = {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  radius: number;
};

export default function HeroParticles({
  parentRef,
}: HeroParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = parentRef.current;

    if (!canvas || !parent) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const mouse = {
      x: -1000,
      y: -1000,
      active: false,
    };

    let width = 0;
    let height = 0;
    let animationFrame = 0;

    let particles: Particle[] = [];

    const PARTICLE_COLOR = "47, 111, 237";

    const CONNECTION_DISTANCE = 110;
    const MOUSE_RADIUS = 145;

    /* -----------------------------------------
       INITIALIZE PARTICLES
    ----------------------------------------- */

    function createParticles() {
      const count = Math.min(
        85,
        Math.max(
          25,
          Math.floor((width * height) / 10000),
        ),
      );

      particles = Array.from(
        { length: count },
        (): Particle => {
          const x = Math.random() * width;
          const y = Math.random() * height;

          return {
            x,
            y,
            originX: x,
            originY: y,

            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2,

            radius: Math.random() * 1.2 + 0.7,
          };
        },
      );
    }

    /* -----------------------------------------
       RESIZE CANVAS
    ----------------------------------------- */

    function resizeCanvas() {
      if (!canvas || !ctx) return;

      const rect = parent!.getBoundingClientRect();

      width = rect.width;
      height = rect.height;

      const dpr = Math.min(
        window.devicePixelRatio || 1,
        2,
      );

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      createParticles();
    }

    /* -----------------------------------------
       MOUSE INTERACTION
    ----------------------------------------- */

    function handlePointerMove(event: PointerEvent) {
      if (event.pointerType === "touch") return;

      const rect = parent!.getBoundingClientRect();

      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
      mouse.active = true;
    }

    function handlePointerLeave() {
      mouse.active = false;
    }

    /* -----------------------------------------
       PARTICLE MOVEMENT
    ----------------------------------------- */

    function updateParticles() {
      for (const particle of particles) {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Keep particles within the canvas.

        if (
          particle.x < 0 ||
          particle.x > width
        ) {
          particle.vx *= -1;

          particle.x = Math.max(
            0,
            Math.min(width, particle.x),
          );
        }

        if (
          particle.y < 0 ||
          particle.y > height
        ) {
          particle.vy *= -1;

          particle.y = Math.max(
            0,
            Math.min(height, particle.y),
          );
        }

        if (!mouse.active) continue;

        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;

        const distance = Math.sqrt(
          dx * dx + dy * dy,
        );

        if (
          distance < MOUSE_RADIUS &&
          distance > 0
        ) {
          const force =
            (MOUSE_RADIUS - distance) /
            MOUSE_RADIUS;

          const angle = Math.atan2(dy, dx);

          particle.x +=
            Math.cos(angle) * force * 1.8;

          particle.y +=
            Math.sin(angle) * force * 1.8;
        }
      }
    }

    /* -----------------------------------------
       BACKGROUND GRID
    ----------------------------------------- */

    function drawGrid() {
      if (!ctx) return;

      const spacing = 48;

      ctx.lineWidth = 0.5;

      ctx.strokeStyle = "rgba(28, 36, 43, 0.035)";

      ctx.beginPath();

      for (
        let x = 0;
        x <= width;
        x += spacing
      ) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }

      for (
        let y = 0;
        y <= height;
        y += spacing
      ) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }

      ctx.stroke();
    }

    /* -----------------------------------------
       PARTICLE CONNECTIONS
    ----------------------------------------- */

    function drawConnections() {
      if (!ctx) return;

      for (
        let i = 0;
        i < particles.length;
        i++
      ) {
        const a = particles[i];

        for (
          let j = i + 1;
          j < particles.length;
          j++
        ) {
          const b = particles[j];

          const dx = a.x - b.x;
          const dy = a.y - b.y;

          const distance = Math.sqrt(
            dx * dx + dy * dy,
          );

          if (
            distance > CONNECTION_DISTANCE
          ) {
            continue;
          }

          const proximity =
            1 - distance / CONNECTION_DISTANCE;

          let opacity =
            proximity * 0.13;

          let lineWidth = 0.6;

          if (mouse.active) {
            const distanceA = Math.hypot(
              a.x - mouse.x,
              a.y - mouse.y,
            );

            const distanceB = Math.hypot(
              b.x - mouse.x,
              b.y - mouse.y,
            );

            const mouseDistance = Math.min(
              distanceA,
              distanceB,
            );

            if (
              mouseDistance < MOUSE_RADIUS
            ) {
              const interaction =
                1 -
                mouseDistance /
                  MOUSE_RADIUS;

              opacity += interaction * 0.35;

              lineWidth += interaction * 0.5;
            }
          }

          ctx.beginPath();

          ctx.strokeStyle = `rgba(${PARTICLE_COLOR}, ${opacity})`;

          ctx.lineWidth = lineWidth;

          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);

          ctx.stroke();
        }
      }
    }

    /* -----------------------------------------
       DRAW PARTICLES
    ----------------------------------------- */

    function drawParticles() {
      if (!ctx) return;

      for (const particle of particles) {
        let radius = particle.radius;
        let opacity = 0.35;

        if (mouse.active) {
          const distance = Math.hypot(
            particle.x - mouse.x,
            particle.y - mouse.y,
          );

          if (distance < MOUSE_RADIUS) {
            const interaction =
              1 - distance / MOUSE_RADIUS;

            radius += interaction * 1.5;

            opacity += interaction * 0.6;
          }
        }

        ctx.beginPath();

        ctx.arc(
          particle.x,
          particle.y,
          radius,
          0,
          Math.PI * 2,
        );

        ctx.fillStyle = `rgba(${PARTICLE_COLOR}, ${opacity})`;

        ctx.fill();
      }
    }

    /* -----------------------------------------
       CURSOR GLOW
    ----------------------------------------- */

    function drawMouseGlow() {
      if (!ctx || !mouse.active) return;

      const gradient =
        ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          180,
        );

      gradient.addColorStop(
        0,
        "rgba(47, 111, 237, 0.065)",
      );

      gradient.addColorStop(
        0.5,
        "rgba(47, 111, 237, 0.025)",
      );

      gradient.addColorStop(
        1,
        "rgba(47, 111, 237, 0)",
      );

      ctx.fillStyle = gradient;

      ctx.beginPath();

      ctx.arc(
        mouse.x,
        mouse.y,
        180,
        0,
        Math.PI * 2,
      );

      ctx.fill();
    }

    /* -----------------------------------------
       RENDER LOOP
    ----------------------------------------- */

    function render() {
      if (!ctx) return;

      ctx.clearRect(
        0,
        0,
        width,
        height,
      );

      drawGrid();

      if (!reducedMotion) {
        updateParticles();
      }

      drawConnections();
      drawMouseGlow();
      drawParticles();

      if (!reducedMotion) {
        animationFrame =
          requestAnimationFrame(render);
      }
    }

    /* -----------------------------------------
       INITIALIZATION
    ----------------------------------------- */

    resizeCanvas();
    render();

    const resizeObserver =
      new ResizeObserver(() => {
        resizeCanvas();
        if (reducedMotion) render();
      });

    resizeObserver.observe(parent);

    if (!reducedMotion) {
      parent.addEventListener(
        "pointermove",
        handlePointerMove,
      );

      parent.addEventListener(
        "pointerleave",
        handlePointerLeave,
      );
    }

    /* -----------------------------------------
       CLEANUP
    ----------------------------------------- */

    return () => {
      cancelAnimationFrame(animationFrame);

      resizeObserver.disconnect();

      parent.removeEventListener(
        "pointermove",
        handlePointerMove,
      );

      parent.removeEventListener(
        "pointerleave",
        handlePointerLeave,
      );
    };
  }, [parentRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  );
}