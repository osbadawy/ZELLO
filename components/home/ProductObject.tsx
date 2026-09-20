import type { ProductVisual } from "./types";

type ProductObjectProps = { type: ProductVisual };

export default function ProductObject({ type }: ProductObjectProps) {
  switch (type) {
    case "bag":
      return (
        <div aria-hidden="true" className="absolute top-1/2 left-1/2 aspect-[0.82] w-[43%] -translate-x-1/2 -translate-y-[48%] -rotate-[7deg] border-[3px] border-[#1c242b] bg-[linear-gradient(120deg,#26323b,#667581)] shadow-[9px_9px_0_rgba(28,36,43,0.22)]">
          <div className="absolute -top-[15%] left-[26%] h-[18%] w-[48%] rounded-t-[20px] border-[3px] border-b-0 border-[#1c242b]" />
          <span className="absolute bottom-[13%] left-[17%] border-2 border-[#1c242b] bg-[#2f6fed] p-1 font-mono text-[10px]">01</span>
        </div>
      );
    case "lamp":
      return (
        <div aria-hidden="true" className="absolute top-1/2 left-1/2 h-[58%] w-[33%] -translate-x-1/2 -translate-y-1/2 border-[3px] border-[#1c242b] bg-[linear-gradient(90deg,#e9edf0,#aab8c2)] shadow-[9px_9px_0_rgba(28,36,43,0.2)]">
          <div className="absolute -top-[24%] left-1/2 aspect-[1.2] w-[120%] -translate-x-1/2 rounded-t-[50%] rounded-b-[8%] border-[3px] border-[#1c242b] bg-[#f5f7f8] shadow-[inset_0_-11px_0_rgba(28,36,43,0.1)]" />
          <span className="absolute bottom-[13%] left-1/4 border-2 border-[#1c242b] bg-[#b8c4ce] px-[5px] py-[3px] font-mono text-[10px]">ON</span>
        </div>
      );
    case "speaker":
      return (
        <div aria-hidden="true" className="absolute top-1/2 left-1/2 aspect-[0.9] w-[48%] -translate-x-1/2 -translate-y-1/2 border-[3px] border-[#1c242b] bg-[#586873] shadow-[9px_9px_0_rgba(28,36,43,0.2)]">
          <div className="absolute top-[15%] left-[15%] aspect-square w-[70%] rounded-full border-4 border-dotted border-[#b8c4ce] shadow-[inset_0_0_0_10px_#2f3b45,inset_0_0_0_14px_#2f6fed]" />
          <span className="absolute bottom-[9%] left-[14%] font-mono text-[8px] text-white">AUDIO / 03</span>
        </div>
      );
    case "watch":
      return (
        <div aria-hidden="true" className="absolute top-1/2 left-1/2 aspect-[1.28] w-[44%] -translate-x-1/2 -translate-y-1/2 border-[3px] border-[#1c242b] bg-[#d3dbe1] shadow-[9px_9px_0_rgba(28,36,43,0.2)]">
          <div className="absolute inset-[17%] grid place-items-center border-2 border-[#1c242b] bg-[#25313a] font-mono text-[clamp(10px,1.3vw,17px)] text-[#91bfa7] shadow-[inset_0_0_20px_rgba(184,196,206,0.25)]">12:08</div>
          <div className="absolute top-[23%] -left-[24%] h-[55%] w-[22%] border-[3px] border-r-0 border-[#1c242b] bg-[#2f6fed]" />
        </div>
      );
  }
}
