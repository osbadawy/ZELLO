import type { Metadata } from "next";

import {
  Geist,
  Geist_Mono,
} from "next/font/google";

import StoreLayout from "@/components/home/StoreLayout";
import { PageTransitionProvider, TileTransitionProvider } from "@/components/UI/tileTransition/PageTransitionProvider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Penta Labs",
  description: "Useful objects for modern living.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <PageTransitionProvider>
        <StoreLayout>{children}</StoreLayout>
        </PageTransitionProvider>
      </body>
    </html>
  );
}