'use client';

import {
  useEffect,
  useRef,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react';

type ParticleFieldProps = {
  className?: string;
  style?: CSSProperties;
  background?: string;
  particleColor?: string;
  density?: number;
  speed?: number;
  interactionRadius?: number;
  interactionStrength?: number;
  opacity?: number;
};

type Particle = {
  baseX: number;
  row: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
};

type Pointer = {
  x: number;
  y: number;
  active: boolean;
};

const DEFAULT_BACKGROUND = '#bcae9e';
const DEFAULT_PARTICLE_COLOR = '#fffaf0';

/**
 * A flowing, fabric-like particle field inspired by fine woven mesh.
 *
 * The component is intentionally self-contained: it uses one canvas and does
 * not require a particle library. It can be placed behind a hero, inside a
 * card, or used as a full-width visual section.
 */
export default function PentaLabsParticleField({
  className = '',
  style,
  background = DEFAULT_BACKGROUND,
  particleColor = DEFAULT_PARTICLE_COLOR,
  density = 0.00022,
  speed = 0.7,
  interactionRadius = 150,
  interactionStrength = 1,
  opacity = 0.82,
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef<Pointer>({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return;

    const host = canvas.parentElement;
    if (!host) return;

    let animationFrame = 0;
    let destroyed = false;
    let width = 1;
    let height = 1;
    let devicePixelRatio = 1;
    let columns = 0;
    let rows = 0;
    let particles: Particle[] = [];
    let time = 0;
    let lastTime = performance.now();

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );

    const clamp = (value: number, min: number, max: number): number =>
      Math.max(min, Math.min(max, value));

    const mulberry32 = (seed: number) => {
      return () => {
        let value = (seed += 0x6d2b79f5);
        value = Math.imul(value ^ (value >>> 15), value | 1);
        value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
        return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
      };
    };

    const random = mulberry32(22091926);

    const resize = () => {
      const bounds = host.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * devicePixelRatio);
      canvas.height = Math.floor(height * devicePixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

      // The density is scaled by area, while the row/column ratio keeps the
      // particles looking like a fine woven sheet instead of a cloud.
      const targetCount = clamp(
        Math.round(width * height * density),
        2800,
        30000,
      );
      const aspectRatio = width / Math.max(height, 1);
      columns = clamp(Math.round(Math.sqrt(targetCount * aspectRatio * 2.2)), 70, 260);
      rows = clamp(Math.round(targetCount / columns), 28, 150);

      const nextParticles: Particle[] = [];
      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const normalizedRow = row / Math.max(rows - 1, 1);
          const normalizedX = column / Math.max(columns - 1, 1);
          const edgeFade = Math.sin(normalizedRow * Math.PI);

          nextParticles.push({
            baseX: normalizedX,
            row: normalizedRow,
            x: normalizedX * width,
            y: height * 0.56,
            vx: 0,
            vy: 0,
            size: 0.55 + random() * 0.55,
            alpha: (0.34 + random() * 0.54) * edgeFade,
          });
        }
      }
      particles = nextParticles;
    };

    const getRibbonPoint = (
      normalizedX: number,
      normalizedRow: number,
      currentTime: number,
    ) => {
      const x = normalizedX * width;
      const horizontal = normalizedX - 0.5;
      const rowFromCenter = normalizedRow - 0.5;

      // Broad silhouette: the ribbon enters higher on the left and settles
      // lower on the right, matching the diagonal fabric flow in the reference.
      const centerLine =
        height * 0.53 +
        horizontal * height * 0.19 +
        Math.sin(normalizedX * 8.4 + currentTime * 0.48) * height * 0.045 +
        Math.sin(normalizedX * 20.5 - currentTime * 0.2) * height * 0.018;

      const widthEnvelope =
        height *
        (0.22 +
          Math.sin(normalizedX * Math.PI) * 0.16 +
          Math.sin(normalizedX * 5.2 + 0.9) * 0.025);

      // Fold field: several frequencies create overlapping raised and recessed
      // bands without requiring a texture or image asset.
      const foldA = Math.sin(normalizedX * 17.5 - currentTime * 0.58 + normalizedRow * 3.8);
      const foldB = Math.sin(normalizedX * 35.0 + currentTime * 0.34 + normalizedRow * 8.5);
      const foldC = Math.cos(normalizedX * 9.2 + normalizedRow * 13.0 - currentTime * 0.28);
      const folds = (foldA * 0.58 + foldB * 0.22 + foldC * 0.2) * height * 0.027;

      // Rows compress and expand subtly, giving the mesh a woven, dimensional
      // look instead of a perfectly flat rectangular grid.
      const rowWarp =
        rowFromCenter * widthEnvelope +
        Math.sin(normalizedX * 13.4 + normalizedRow * 4.2 - currentTime * 0.45) *
          height *
          0.014;

      const y = centerLine + rowWarp + folds;
      const frontLight = 0.72 + (1 - Math.abs(rowFromCenter) * 1.7) * 0.28;

      return { x, y, frontLight };
    };

    const draw = (now: number) => {
      if (destroyed) return;

      const elapsed = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const motionScale = prefersReducedMotion.matches ? 0.08 : 1;
      time += elapsed * speed * motionScale;

      context.fillStyle = background;
      context.fillRect(0, 0, width, height);

      const pointer = pointerRef.current;
      const radius = interactionRadius;
      const radiusSquared = radius * radius;

      for (const particle of particles) {
        const target = getRibbonPoint(particle.baseX, particle.row, time);
        const dx = target.x - particle.x;
        const dy = target.y - particle.y;

        // Spring the particle toward the animated ribbon target.
        particle.vx += dx * 0.036;
        particle.vy += dy * 0.036;

        if (pointer.active) {
          const pointerDx = particle.x - pointer.x;
          const pointerDy = particle.y - pointer.y;
          const distanceSquared = pointerDx * pointerDx + pointerDy * pointerDy;

          if (distanceSquared < radiusSquared && distanceSquared > 0.01) {
            const distance = Math.sqrt(distanceSquared);
            const force =
              Math.pow(1 - distance / radius, 2) * interactionStrength;
            particle.vx += (pointerDx / distance) * force * 1.8;
            particle.vy += (pointerDy / distance) * force * 1.8;
          }
        }

        particle.vx *= 0.84;
        particle.vy *= 0.84;
        particle.x += particle.vx;
        particle.y += particle.vy;

        const depth = clamp(target.frontLight, 0.45, 1.12);
        const distanceFromTarget = Math.hypot(dx, dy);
        const glow = clamp(1 - distanceFromTarget / 80, 0, 1);
        const pointSize = particle.size * (1.8 + depth * 0.8 + glow * 0.35);
        const pointAlpha = clamp(particle.alpha * depth * opacity, 0, 1);

        context.fillStyle = particleColor;
        context.globalAlpha = pointAlpha;
        context.fillRect(particle.x, particle.y, pointSize, pointSize);
      }

      context.globalAlpha = 1;
      animationFrame = window.requestAnimationFrame(draw);
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    canvas.addEventListener('pointerleave', handlePointerLeave);

    resize();
    animationFrame = window.requestAnimationFrame(draw);

    return () => {
      destroyed = true;
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      canvas.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [background, density, interactionRadius, interactionStrength, opacity, particleColor, speed]);

  const handlePointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const bounds = canvas.getBoundingClientRect();
    pointerRef.current = {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
      active: true,
    };
  };

  return (
    <div
      className={`penta-particle-field ${className}`.trim()}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '420px',
        overflow: 'hidden',
        background,
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        onPointerMove={handlePointerMove}
        aria-label="Interactive flowing particle field"
        role="img"
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          touchAction: 'none',
        }}
      />
    </div>
  );
}