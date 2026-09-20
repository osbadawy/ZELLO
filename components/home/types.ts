
export type ProductCategory = "carry" | "home" | "tech";

export type ProductVisual = "bag" | "lamp" | "speaker" | "watch";

export type Product = {
  id: string;
  category: ProductCategory;
  label: string;
  series: string;
  status: "IN STOCK" | "LOW STOCK";
  name: string;
  description: string;
  price: number;
  visual: ProductVisual;
  tone: string;
};

export type CartItem = Product & {
  quantity: number;
};

export type CategoryFilter = {
  id: "all" | ProductCategory;
  label: string;
};