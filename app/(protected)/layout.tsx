import type { ReactNode } from "react";

import { NavDash } from "@/components/UI/NavDash";

export default function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <NavDash>{children}</NavDash>;
}