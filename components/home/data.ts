import type { Product, CategoryFilter } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: "field-pack-01",
    category: "carry",
    label: "01 / CARRY",
    series: "FIELD PACK",
    status: "IN STOCK",
    name: "Field Pack 01",
    description: "Modular carry system for your daily coordinates.",
    price: 68,
    visual: "bag",
    tone: "visual-one",
  },
  {
    id: "afterglow-lamp",
    category: "home",
    label: "02 / HOME",
    series: "AFTERGLOW",
    status: "IN STOCK",
    name: "Afterglow Lamp",
    description: "Soft light, hard silhouette. USB-C powered.",
    price: 42,
    visual: "lamp",
    tone: "visual-two",
  },
  {
    id: "signal-speaker",
    category: "tech",
    label: "03 / TECH",
    series: "SIGNAL SERIES",
    status: "LOW STOCK",
    name: "Signal Speaker",
    description: "Portable sound in a compact aluminum shell.",
    price: 54,
    visual: "speaker",
    tone: "visual-three",
  },
  {
    id: "orbit-watch",
    category: "tech",
    label: "04 / TECH",
    series: "ORBIT SERIES",
    status: "IN STOCK",
    name: "Orbit Watch",
    description: "Timekeeping with a readable future-facing display.",
    price: 89,
    visual: "watch",
    tone: "visual-four",
  },
];

export const CATEGORY_FILTERS: CategoryFilter[] = [
  { id: "all", label: "All / 04" },
  { id: "carry", label: "Carry" },
  { id: "home", label: "Home" },
  { id: "tech", label: "Tech" },
];