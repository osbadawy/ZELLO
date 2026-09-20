"use client";

type FloatingCard = {
  id: string;
  name: string;
  image: string;
  position: string;
  delay: string;
  duration: string;
};

const cards: FloatingCard[] = [
  {
    id: "01",
    name: "Sound",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=85",
    position: "left-[3%] top-[12%]",
    delay: "0s",
    duration: "7s",
  },
  {
    id: "02",
    name: "Time",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30c?w=500&q=85",
    position: "right-[4%] top-[16%]",
    delay: "-2s",
    duration: "8s",
  },
  {
    id: "03",
    name: "Living",
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?w=500&q=85",
    position: "left-[5%] bottom-[10%]",
    delay: "-4s",
    duration: "9s",
  },
  {
    id: "04",
    name: "Essentials",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=85",
    position: "right-[5%] bottom-[9%]",
    delay: "-1s",
    duration: "7.5s",
  },
];

export default function HeroFloatingCards() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[2] hidden overflow-hidden xl:block"
    >
      {cards.map((card) => (
        <div
          key={card.id}
          className={`hero-floating-card absolute w-[145px] 2xl:w-[175px] ${card.position}`}
          style={{
            animationDelay: card.delay,
            animationDuration: card.duration,
          }}
        >
          <div className="relative overflow-hidden rounded-[24px] border border-white/20 bg-white/[0.09] p-2 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-2xl backdrop-saturate-150">

            {/* Glass highlight */}
            <div className="pointer-events-none absolute inset-x-5 top-0 z-10 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />

            {/* Product image */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-[17px] bg-white/10">
              <img
                src={card.image}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />
            </div>

            {/* Product information */}
            <div className="flex items-center justify-between px-1.5 pb-1 pt-3">
              <span className="text-[11px] font-medium tracking-[-0.01em] text-white/85">
                {card.name}
              </span>

              <span className="text-[10px] font-medium text-white/35">
                {card.id}
              </span>
            </div>
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes heroFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(-2deg);
          }

          50% {
            transform: translate3d(0, -16px, 0) rotate(2deg);
          }
        }

        .hero-floating-card {
          animation-name: heroFloat;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          will-change: transform;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-floating-card {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}