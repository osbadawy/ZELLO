"use client";

import { useCallback, useState } from "react";

type FloatingCard = {
  id: string;
  name: string;
  image: string;
};

type FloatingInstance = {
  key: number;
  product: FloatingCard;
  x: number;
  drift: number;
  rotation: number;
  duration: number;
  delay: number;
};

const products: FloatingCard[] = [
  {
    id: "01",
    name: "Sound",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=85",
  },
  {
    id: "02",
    name: "Time",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&q=85",
  },
  {
    id: "03",
    name: "Living",
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?w=500&q=85",
  },
  {
    id: "04",
    name: "Essentials",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=85",
  },
  {
    id: "05",
    name: "Tech",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&q=85",
  },
  {
    id: "06",
    name: "Photography",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=85",
  },
  {
    id: "07",
    name: "Audio",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=85",
  },
  {
    id: "08",
    name: "Lighting",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=85",
  },
  {
    id: "09",
    name: "Workspace",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=85",
  },
  {
    id: "10",
    name: "Travel",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=85",
  },
  {
    id: "11",
    name: "Style",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500&q=85",
  },
  {
    id: "12",
    name: "Design",
    image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=500&q=85",
  },
];

const CARD_COUNT = 8;

const randomBetween = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

const initialCards: FloatingInstance[] = Array.from(
  { length: CARD_COUNT },
  (_, index) => ({
    key: index,
    product: products[index % products.length],
    x: 5 + ((index * 17) % 75),
    drift: 0,
    rotation: 0,
    duration: 15 + (index % 4),
    delay: index * 1.8,
  }),
);

export default function HeroFloatingCards() {
  const [cards, setCards] = useState<FloatingInstance[]>(initialCards);

  const respawnCard = useCallback((key: number) => {
    setCards((current) =>
      current.map((card) => {
        if (card.key !== key) return card;

        return {
          ...card,
          x: randomBetween(2, 82),
          drift: randomBetween(-65, 65),
          rotation: randomBetween(-8, 8),
        };
      }),
    );
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[2] hidden overflow-hidden xl:block"
    >
      {cards.map((card) => (
        <div
          key={card.key}
          className="hero-floating-card pointer-events-none absolute top-full w-[145px] 2xl:w-[175px]"
          style={
            {
              left: `${card.x}%`,
              "--drift": `${card.drift}px`,
              "--rotation": `${card.rotation}deg`,
              animationDuration: `${card.duration}s`,
              animationDelay: `${card.delay}s`,
            } as React.CSSProperties
          }
          onAnimationStart={() => respawnCard(card.key)}
          onAnimationIteration={() => respawnCard(card.key)}
        >
          {/* GLASS CARD */}
          <div className="relative overflow-hidden rounded-[24px] border border-white/20 bg-white/[0.09] p-2 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-2xl backdrop-saturate-150">

            {/* GLASS HIGHLIGHT */}
            <div className="pointer-events-none absolute inset-x-5 top-0 z-10 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />

            {/* PRODUCT IMAGE */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-[17px] bg-white/10">
              <img
                src={card.product.image}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />
            </div>

            {/* PRODUCT INFORMATION */}
            <div className="flex items-center justify-between px-1.5 pb-1 pt-3">
              <span className="text-[11px] font-medium tracking-[-0.01em] text-white/85">
                {card.product.name}
              </span>

              <span className="text-[10px] font-medium text-white/35">
                {card.product.id}
              </span>
            </div>
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes heroFloatUp {
          0% {
            transform: translate3d(0, 0, 0) rotate(-3deg);
            opacity: 0;
          }

          8% {
            opacity: 1;
          }

          25% {
            transform: translate3d(
              calc(var(--drift) * 0.25),
              calc(-25svh - 25%),
              0
            ) rotate(2deg);
            opacity: 1;
          }

          50% {
            transform: translate3d(
              calc(var(--drift) * 0.5),
              calc(-50svh - 50%),
              0
            ) rotate(var(--rotation));
            opacity: 1;
          }

          75% {
            transform: translate3d(
              calc(var(--drift) * 0.75),
              calc(-75svh - 75%),
              0
            ) rotate(-2deg);
            opacity: 1;
          }

          92% {
            opacity: 1;
          }

          100% {
            transform: translate3d(
              var(--drift),
              calc(-100svh - 100%),
              0
            ) rotate(3deg);
            opacity: 0;
          }
        }

        .hero-floating-card {
          animation-name: heroFloatUp;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-fill-mode: backwards;
          will-change: transform, opacity;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-floating-card {
            animation: none;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}