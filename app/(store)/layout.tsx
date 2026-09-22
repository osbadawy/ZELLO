import type { ReactNode } from "react";

import StoreLayout from "@/components/home/StoreLayout";

export default function StoreGroupLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <StoreLayout>{children}</StoreLayout>;
}