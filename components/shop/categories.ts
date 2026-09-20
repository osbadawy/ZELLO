import type { ProductVisual } from "@/components/home/types";

export type ShopCategoryId =
  | "all"
  | "tech"
  | "carry"
  | "home"
  | "audio"
  | "lighting"
  | "wearables";

export type ShopCategory = {
  id: ShopCategoryId;
  number: string;
  name: string;
  subtitle: string;
  description: string;
  visual: ProductVisual;
  productIds: string[] | null;
  layout: "featured" | "standard" | "wide";
  background: string;
  accent: string;
};

export const SHOP_CATEGORIES: ShopCategory[] = [
  {
    id: "tech",
    number: "001",
    name: "TECH",
    subtitle: "THE NEXT UTILITY",
    description:
      "Considered technology for the everyday. Less noise, more possibility.",
    visual: "speaker",
    productIds: [
      "signal-speaker",
      "orbit-watch",
    ],
    layout: "featured",
    background:
      "bg-[radial-gradient(ellipse_at_75%_65%,#314a83_0%,#171e31_38%,#080b10_78%)]",
    accent: "#a9bfff",
  },
  {
    id: "carry",
    number: "002",
    name: "CARRY",
    subtitle: "MOVE DIFFERENT",
    description:
      "Essential equipment for wherever the day takes you.",
    visual: "bag",
    productIds: ["field-pack-01"],
    layout: "standard",
    background:
      "bg-[radial-gradient(ellipse_at_80%_75%,#466683_0%,#172431_48%,#0b1016_100%)]",
    accent: "#a9d9f3",
  },
  {
    id: "home",
    number: "003",
    name: "HOME",
    subtitle: "YOUR SPACE, REIMAGINED",
    description:
      "Objects that make everyday spaces feel more intentional.",
    visual: "lamp",
    productIds: ["afterglow-lamp"],
    layout: "standard",
    background:
      "bg-[radial-gradient(ellipse_at_75%_80%,#685477_0%,#292337_42%,#0b0c13_100%)]",
    accent: "#e9c6f4",
  },
  {
    id: "all",
    number: "004",
    name: "ALL OBJECTS.",
    subtitle: "THE COMPLETE COLLECTION",
    description:
      "A curated selection of objects designed to make the everyday better.",
    visual: "bag",
    productIds: null,
    layout: "wide",
    background:
      "bg-[linear-gradient(110deg,#10161e_0%,#172536_48%,#25364c_100%)]",
    accent: "#b6caff",
  },
  {
    id: "audio",
    number: "005",
    name: "AUDIO",
    subtitle: "FEEL THE FREQUENCY",
    description:
      "A better soundtrack for everything you do.",
    visual: "speaker",
    productIds: ["signal-speaker"],
    layout: "standard",
    background:
      "bg-[radial-gradient(ellipse_at_65%_70%,#414389_0%,#1b1b3d_46%,#0b0c19_100%)]",
    accent: "#babaff",
  },
  {
    id: "lighting",
    number: "006",
    name: "LIGHTING",
    subtitle: "SET THE ATMOSPHERE",
    description:
      "A different perspective on everyday illumination.",
    visual: "lamp",
    productIds: ["afterglow-lamp"],
    layout: "standard",
    background:
      "bg-[radial-gradient(ellipse_at_75%_75%,#6c497d_0%,#30233e_45%,#0e0b15_100%)]",
    accent: "#f3c2ef",
  },
  {
    id: "wearables",
    number: "007",
    name: "WEARABLES",
    subtitle: "DESIGNED TO MOVE",
    description:
      "Intelligent essentials that move with you.",
    visual: "watch",
    productIds: ["orbit-watch"],
    layout: "standard",
    background:
      "bg-[radial-gradient(ellipse_at_70%_75%,#376b76_0%,#19323b_45%,#091217_100%)]",
    accent: "#a5e4e6",
  },
];