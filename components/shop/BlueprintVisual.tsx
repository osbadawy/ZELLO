import type { ShopCategory } from "./categories";

export type BlueprintType =
  | ShopCategory["visual"]
  | "couch";

type BlueprintVisualProps = {
  type: BlueprintType;
};

export default function BlueprintVisual({
  type,
}: BlueprintVisualProps) {
  const outline = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const detail = {
    ...outline,
    strokeWidth: 0.85,
    opacity: 0.65,
  };

  const measurements: Record<
    BlueprintType,
    {
      width: string;
      height: string;
      detail: string;
    }
  > = {
    bag: {
      width: "W / 280",
      height: "H / 420",
      detail: "SECTION 01",
    },
    couch: {
      width: "W / 2200",
      height: "H / 820",
      detail: "SECTION 02",
    },
    lamp: {
      width: "W / 240",
      height: "H / 480",
      detail: "SECTION 03",
    },
    speaker: {
      width: "W / 190",
      height: "H / 230",
      detail: "SECTION 04",
    },
    watch: {
      width: "W / 160",
      height: "H / 160",
      detail: "SECTION 05",
    },
  };

  const measurement = measurements[type];

  const drawClass = [
    "fill-none stroke-current",
    "[stroke-dasharray:1]",
    "[stroke-dashoffset:1]",
    "transition-[stroke-dashoffset]",
    "duration-[1100ms] ease-out",
    "group-hover:[stroke-dashoffset:0]",
    "group-focus-visible:[stroke-dashoffset:0]",
    "motion-reduce:transition-none",
  ].join(" ");

  return (
    <svg
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full overflow-visible"
      aria-hidden="true"
    >
      {/* REFERENCE AXES */}

      <g
        {...detail}
        strokeDasharray="3 7"
        className="opacity-20 transition-opacity duration-500 group-hover:opacity-40"
      >
        <path d="M200 24V376" />
        <path d="M24 200H376" />
      </g>

      {/* CORNER REFERENCE MARKS */}

      <g {...detail} opacity="0.45">
        <path d="M24 44V24H44" />
        <path d="M356 24H376V44" />
        <path d="M24 356V376H44" />
        <path d="M356 376H376V356" />
      </g>

      {/* BAG */}

      {type === "bag" && (
        <>
          <g {...outline}>
            <path d="M113 135H287L302 320H98L113 135Z" />

            <path d="M143 135V104C143 72 257 72 257 104V135" />

            <path d="M157 135V108C157 88 243 88 243 108V135" />

            <path d="M113 163H287" />

            <rect
              x="130"
              y="181"
              width="140"
              height="105"
              rx="3"
            />

            <path d="M130 212H270" />

            <path d="M152 181V286M248 181V286" />

            <path d="M163 232H237V265H163V232Z" />

            <path d="M117 302H283" />
          </g>

          <g {...detail}>
            <path d="M130 181L152 212" />
            <path d="M270 181L248 212" />
            <path d="M163 248H237" />
            <path d="M184 232V265M216 232V265" />
            <path d="M113 135L130 163" />
            <path d="M287 135L270 163" />
          </g>
        </>
      )}

      {/* HOME — COUCH */}

      {type === "couch" && (
        <>
          <g {...outline}>
            {/* BACKREST */}

            <path d="M91 177V136C91 120 104 109 120 109H280C296 109 309 120 309 136V177" />

            <path d="M105 175V140C105 129 113 122 124 122H276C287 122 295 129 295 140V175" />

            {/* LEFT AND RIGHT BACK CUSHIONS */}

            <path d="M200 124V173" />
            <path d="M112 146Q154 136 194 149" />
            <path d="M206 149Q248 136 288 146" />

            {/* SEAT CUSHIONS */}

            <path d="M101 175H299L316 233H84L101 175Z" />

            <path d="M200 176V233" />

            <path d="M112 185H191L194 221H101L112 185Z" />
            <path d="M209 185H288L299 221H206L209 185Z" />

            {/* LEFT ARMREST */}

            <path d="M85 154H109C118 154 124 161 124 170V230H72V169C72 161 77 154 85 154Z" />

            <path d="M76 172H120" />

            {/* RIGHT ARMREST */}

            <path d="M291 154H315C323 154 328 161 328 169V230H276V170C276 161 282 154 291 154Z" />

            <path d="M280 172H324" />

            {/* BASE */}

            <path d="M77 232H323V282H77V232Z" />

            <path d="M88 282H312" />

            {/* LEGS */}

            <path d="M102 282V303H121L128 282" />
            <path d="M272 282L279 303H298V282" />
          </g>

          <g {...detail}>
            <path d="M200 233V282" />
            <path d="M91 244H309" />
            <path d="M91 270H309" />
            <path d="M84 232L77 244" />
            <path d="M316 232L323 244" />
            <path d="M112 185L101 221" />
            <path d="M288 185L299 221" />
          </g>
        </>
      )}

      {/* LAMP */}

      {type === "lamp" && (
        <>
          <g {...outline}>
            <path d="M120 150Q200 45 280 150Z" />
            <path d="M125 150H275" />

            <path d="M140 150Q200 185 260 150" />

            <path d="M185 170H215V295H185V170Z" />

            <path d="M165 295H235V310H165V295Z" />

            <path d="M150 310H250V325H150V310Z" />

            <path d="M200 65V45" />

            <path d="M165 145L200 100L235 145" />
          </g>

          <g {...detail}>
            <path d="M180 145L200 120L220 145" />
            <path d="M175 325H225" />
            <path d="M120 150L65 230" />
            <path d="M280 150L335 230" />
          </g>
        </>
      )}

      {/* SPEAKER */}

      {type === "speaker" && (
        <>
          <g {...outline}>
            <rect
              x="105"
              y="85"
              width="190"
              height="230"
              rx="8"
            />

            <rect
              x="115"
              y="95"
              width="170"
              height="210"
              rx="4"
            />

            <circle cx="200" cy="205" r="75" />
            <circle cx="200" cy="205" r="62" />
            <circle cx="200" cy="205" r="44" />
            <circle cx="200" cy="205" r="23" />
            <circle cx="200" cy="205" r="7" />

            <circle cx="145" cy="120" r="5" />
            <circle cx="255" cy="120" r="5" />

            <path d="M125 285H275" />
          </g>

          <g {...detail}>
            <circle cx="200" cy="205" r="94" strokeDasharray="3 6" />

            <path d="M200 111V299" />
            <path d="M106 205H294" />
            <path d="M130 105H270" />
          </g>
        </>
      )}

      {/* WATCH */}

      {type === "watch" && (
        <>
          <g {...outline}>
            <path d="M160 45H240L250 125H150L160 45Z" />

            <path d="M150 275H250L240 355H160L150 275Z" />

            <rect
              x="120"
              y="120"
              width="160"
              height="160"
              rx="36"
            />

            <rect
              x="135"
              y="135"
              width="130"
              height="130"
              rx="24"
            />

            <circle cx="200" cy="200" r="48" />
            <circle cx="200" cy="200" r="4" />

            <path d="M200 200V165" />
            <path d="M200 200L225 215" />

            <path d="M280 165H292V195H280" />
          </g>

          <g {...detail}>
            <path d="M170 60H230" />
            <path d="M170 340H230" />

            <path d="M200 151V160" />
            <path d="M200 240V249" />

            <path d="M151 200H160" />
            <path d="M240 200H249" />
          </g>
        </>
      )}

      {/* ANIMATED MEASUREMENT LINES */}

      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="square"
        className="text-[#183454] transition-colors duration-500 group-hover:text-[#78a7ff]"
      >
        {/* VERTICAL DIMENSION */}

        <path
          pathLength={1}
          d="M69 76V324"
          className={drawClass}
        />

        <path
          pathLength={1}
          d="M61 76H78M61 324H78"
          className={drawClass}
        />

        <path
          pathLength={1}
          d="M64 81L74 71M64 329L74 319"
          className={drawClass}
        />

        {/* HORIZONTAL DIMENSION */}

        <path
          pathLength={1}
          d="M90 343H310"
          className={drawClass}
        />

        <path
          pathLength={1}
          d="M90 335V351M310 335V351"
          className={drawClass}
        />

        <path
          pathLength={1}
          d="M85 348L95 338M305 348L315 338"
          className={drawClass}
        />

        {/* CALLOUT */}

        <path
          pathLength={1}
          d="M275 122L328 83H371"
          className={drawClass}
        />

        {/* DETAIL CIRCLE */}

        <circle
          pathLength={1}
          cx="275"
          cy="122"
          r="4"
          className={drawClass}
        />
      </g>

      {/* ANIMATED MEASUREMENT LABELS */}

      <g
        fill="currentColor"
        fontSize="9"
        fontFamily="monospace"
        letterSpacing="1"
        className="text-[#183454] opacity-0 transition-all delay-300 duration-500 group-hover:text-[#78a7ff] group-hover:opacity-100 group-focus-visible:text-[#78a7ff] group-focus-visible:opacity-100 motion-reduce:transition-none"
      >
        <text
          x="50"
          y="200"
          textAnchor="middle"
          transform="rotate(-90 50 200)"
        >
          {measurement.height}
        </text>

        <text
          x="200"
          y="366"
          textAnchor="middle"
        >
          {measurement.width}
        </text>

        <text
          x="369"
          y="73"
          textAnchor="end"
        >
          {measurement.detail}
        </text>
      </g>
    </svg>
  );
}
