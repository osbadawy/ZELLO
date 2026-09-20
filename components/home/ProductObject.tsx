import type { ProductVisual } from "./types";

type ProductObjectProps = {
  type: ProductVisual;
};

export default function ProductObject({ type }: ProductObjectProps) {
  switch (type) {
    /* =====================================================
       BAG
    ===================================================== */

    case "bag":
      return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">

          {/* FLOOR SHADOW */}
          <div className="absolute bottom-[13%] left-1/2 h-[7%] w-[48%] -translate-x-1/2 rounded-full bg-[#263544]/20 blur-xl" />

          {/* BAG BODY */}
          <div className="relative mt-[10%] aspect-[0.82] w-[43%] rounded-[12%] bg-gradient-to-br from-[#394b5a] via-[#253747] to-[#101d2a] shadow-[12px_20px_35px_rgba(24,39,54,0.28),inset_2px_2px_3px_rgba(255,255,255,0.18)]">

            {/* BAG HANDLE */}
            <div className="absolute -top-[16%] left-1/2 h-[30%] w-[48%] -translate-x-1/2 rounded-t-full border-[5px] border-b-0 border-[#314657] shadow-[inset_0_2px_3px_rgba(255,255,255,0.1)]" />

            {/* SURFACE REFLECTION */}
            <div className="pointer-events-none absolute inset-[2px] rounded-[12%] bg-gradient-to-r from-white/[0.12] via-transparent to-black/10" />

            {/* FRONT POCKET */}
            <div className="absolute inset-x-[13%] bottom-[12%] h-[27%] rounded-xl border border-white/[0.10] bg-gradient-to-b from-white/[0.05] to-black/[0.10]" />

            {/* BRAND DETAIL */}
            <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 text-[clamp(7px,0.8vw,11px)] font-semibold tracking-[0.08em] text-white/70">
              ZELLO
            </div>
          </div>
        </div>
      );

    /* =====================================================
       LAMP
    ===================================================== */

    case "lamp":
      return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">

          {/* AMBIENT GLOW */}
          <div className="absolute left-1/2 top-[26%] size-[55%] -translate-x-1/2 rounded-full bg-white/55 blur-[45px]" />

          {/* FLOOR SHADOW */}
          <div className="absolute bottom-[12%] left-1/2 h-[6%] w-[45%] -translate-x-1/2 rounded-full bg-[#506578]/20 blur-xl" />

          {/* LAMP */}
          <div className="relative mt-[12%] flex h-[53%] w-[34%] flex-col items-center">

            {/* LAMP SHADE */}
            <div className="relative z-10 h-[30%] w-[150%] rounded-t-[100%] rounded-b-[18%] bg-gradient-to-r from-[#c9d3dc] via-[#f8fafc] to-[#a9b9c7] shadow-[0_8px_20px_rgba(50,65,80,0.12),inset_0_-6px_10px_rgba(100,120,140,0.10)]">

              <div className="absolute inset-x-[8%] bottom-0 h-[12%] rounded-full bg-[#aabac8]/40" />
            </div>

            {/* STEM */}
            <div className="h-[58%] w-[15%] bg-gradient-to-r from-[#9baebb] via-[#f5f7fa] to-[#a2b3c2] shadow-[3px_0_8px_rgba(50,65,80,0.08)]" />

            {/* BASE */}
            <div className="h-[7%] w-[95%] rounded-t-full rounded-b-lg bg-gradient-to-r from-[#9caebb] via-[#e9eff4] to-[#92a5b5] shadow-[0_6px_12px_rgba(40,55,70,0.15)]" />
          </div>
        </div>
      );

    /* =====================================================
       SPEAKER
    ===================================================== */

    case "speaker":
      return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">

          {/* AMBIENT GLOW */}
          <div className="absolute left-1/2 top-[20%] size-[60%] -translate-x-1/2 rounded-full bg-white/20 blur-[45px]" />

          {/* FLOOR SHADOW */}
          <div className="absolute bottom-[13%] left-1/2 h-[7%] w-[45%] -translate-x-1/2 rounded-full bg-[#263544]/20 blur-xl" />

          {/* SPEAKER BODY */}
          <div className="relative aspect-[0.82] w-[43%] overflow-hidden rounded-[25%] border border-white/[0.15] bg-gradient-to-br from-[#435769] via-[#263847] to-[#142330] shadow-[10px_18px_35px_rgba(24,39,54,0.28),inset_2px_2px_4px_rgba(255,255,255,0.12)]">

            {/* METALLIC EDGE */}
            <div className="absolute inset-[3px] rounded-[24%] border border-white/[0.06]" />

            {/* SPEAKER GRILLE */}
            <div className="absolute left-1/2 top-[41%] flex aspect-square w-[70%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[5px] border-[#52697b] bg-gradient-to-br from-[#263847] to-[#0e1b27] shadow-[inset_0_4px_15px_rgba(0,0,0,0.45),0_2px_5px_rgba(255,255,255,0.08)]">

              {/* INNER DRIVER */}
              <div className="flex aspect-square w-[67%] items-center justify-center rounded-full border border-white/[0.12] bg-gradient-to-br from-[#344c60] to-[#152635] shadow-[inset_0_3px_10px_rgba(0,0,0,0.35)]">
                <div className="aspect-square w-[55%] rounded-full bg-gradient-to-br from-[#566e82] to-[#1b3042] shadow-[inset_0_2px_5px_rgba(255,255,255,0.12)]" />
              </div>
            </div>

            {/* STATUS LIGHT */}
            <div className="absolute bottom-[16%] left-1/2 size-[4px] -translate-x-1/2 rounded-full bg-[#A9C5FF] shadow-[0_0_8px_#A9C5FF]" />

            {/* BRAND */}
            <div className="absolute bottom-[7%] left-1/2 -translate-x-1/2 text-[clamp(6px,0.7vw,9px)] font-medium tracking-[0.12em] text-white/50">
              ZELLO
            </div>
          </div>
        </div>
      );

    /* =====================================================
       WATCH
    ===================================================== */

    case "watch":
      return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">

          {/* FLOOR SHADOW */}
          <div className="absolute bottom-[15%] left-1/2 h-[7%] w-[48%] -translate-x-1/2 rounded-full bg-[#263544]/20 blur-xl" />

          {/* WATCH ASSEMBLY */}
          <div className="relative flex aspect-square w-[46%] items-center justify-center">

            {/* TOP STRAP */}
            <div className="absolute bottom-[78%] left-1/2 h-[62%] w-[39%] -translate-x-1/2 rounded-t-[35%] bg-gradient-to-r from-[#344555] via-[#526678] to-[#293b4b] shadow-[inset_2px_0_3px_rgba(255,255,255,0.08)]" />

            {/* BOTTOM STRAP */}
            <div className="absolute left-1/2 top-[78%] h-[62%] w-[39%] -translate-x-1/2 rounded-b-[35%] bg-gradient-to-r from-[#344555] via-[#526678] to-[#293b4b] shadow-[inset_2px_0_3px_rgba(255,255,255,0.08)]" />

            {/* WATCH BODY */}
            <div className="relative z-10 flex aspect-square w-[83%] items-center justify-center rounded-[30%] border-[5px] border-[#a3b3c0] bg-gradient-to-br from-[#e6edf2] via-[#b6c5d0] to-[#879ba9] shadow-[8px_12px_24px_rgba(24,39,54,0.25),inset_2px_2px_4px_rgba(255,255,255,0.5)]">

              {/* DISPLAY */}
              <div className="relative flex size-full flex-col items-center justify-center overflow-hidden rounded-[27%] bg-gradient-to-br from-[#172a3b] via-[#091522] to-[#050d17]">

                {/* DISPLAY REFLECTION */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.12] via-transparent to-transparent" />

                {/* TIME */}
                <span className="relative text-[clamp(12px,2vw,25px)] font-medium tracking-[-0.065em] text-white">
                  12:08
                </span>

                {/* DATE */}
                <span className="relative mt-1 text-[clamp(4px,0.6vw,8px)] font-medium uppercase tracking-[0.12em] text-[#A9C5FF]/80">
                  MON 08
                </span>

                {/* STATUS DOT */}
                <div className="absolute bottom-[12%] left-1/2 size-[3px] -translate-x-1/2 rounded-full bg-[#A9C5FF]" />
              </div>
            </div>

            {/* SIDE BUTTON */}
            <div className="absolute -right-[1%] top-[35%] h-[15%] w-[5%] rounded-r-md bg-gradient-to-r from-[#879aa9] to-[#d6e1e9]" />
          </div>
        </div>
      );
  }
}