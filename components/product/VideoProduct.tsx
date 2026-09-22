"use client";

import { ArrowUpRight, Play } from "lucide-react";

type Props = {
  instagramVideoUrl: string | null;
  productName: string;
};

function getInstagramEmbedUrl(value: string): string | null {
  try {
    const url = new URL(value);

    if (
      url.protocol !== "https:" ||
      !/(^|\.)instagram\.com$/.test(url.hostname.toLowerCase())
    ) {
      return null;
    }

    const segments = url.pathname.split("/").filter(Boolean);
    const type = segments[0]?.toLowerCase();
    const shortcode = segments[1];

    if (
      !["reel", "p", "tv"].includes(type) ||
      !shortcode ||
      !/^[a-zA-Z0-9_-]+$/.test(shortcode)
    ) {
      return null;
    }

    return `https://www.instagram.com/${type}/${shortcode}/embed/`;
  } catch {
    return null;
  }
}

export default function VideoProduct({
  instagramVideoUrl,
  productName,
}: Props) {
  if (!instagramVideoUrl) return null;

  const embedUrl = getInstagramEmbedUrl(instagramVideoUrl);
  if (!embedUrl) return null;

  return (
    <section aria-labelledby="product-video-title" className="w-full">
      <div className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <Play size={13} className="fill-[#A9C5FF] text-[#A9C5FF]" />

          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#A9C5FF]/75">
            See it in action
          </span>
        </div>

        <h2
          id="product-video-title"
          className="text-[clamp(2rem,4vw,3.6rem)] font-semibold leading-[1.1] tracking-[-0.06em] text-white"
        >
          Product in motion<span className="text-[#A9C5FF]">.</span>
        </h2>
      </div>

      <div className="relative flex w-full flex-col items-center overflow-hidden rounded-[30px] border border-white/[0.10] bg-white/[0.025] px-4 py-10 sm:px-8 sm:py-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 size-[650px] -translate-x-1/2 rounded-full bg-[#7197ff]/[0.06] blur-[120px]"
        />

        {/* FIXED-HEIGHT CROP — NO MORE EMPTY SPACE BELOW THE VIDEO */}
        <div className="relative z-10 h-[690px] w-full max-w-[630px] overflow-hidden rounded-[24px] border border-white/[0.12] bg-[#080E18] shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
          <iframe
            src={embedUrl}
            title={`${productName} Instagram video`}
            loading="lazy"
            scrolling="no"
            allow="encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute -top-[90px] left-0 h-[1300px] w-[calc(100%+18px)] border-0 bg-white"
          />
        </div>
      </div>
    </section>
  );
}