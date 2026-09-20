import type { Metadata } from "next";

import SystemPageClient from "@/components/system/SystemPageClient";

export const metadata: Metadata = {
  title: "Custom Business Systems | Penta Labs",
  description:
    "Explore custom software, connected operations, commerce infrastructure, AI-assisted workflows, and enterprise platforms designed around your business.",
};

export default function SystemPage() {
  return <SystemPageClient />;
}