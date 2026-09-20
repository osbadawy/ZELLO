import type { Metadata } from "next";

import AboutPage from "@/components/about/AboutPage";

export const metadata: Metadata = {
  title: "About Penta Labs",
  description:
    "Founded by Omar Badawy and Mohamed Desouky, Penta Labs explores new ways of building and selling through custom software, hardware, emerging technology, and creative business experiments.",
};

export default function Page() {
  return <AboutPage />;
}