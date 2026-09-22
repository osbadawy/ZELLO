"use client";

import React, { useState, type ReactNode } from "react";
import Link from "next/link";
import { Sidebar, SidebarBody, SidebarLink } from "./sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type NavDashProps = {
  children: ReactNode;
};

export function NavDash({ children }: NavDashProps) {
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-[#A9C5FF]" stroke={1.7} />
      ),
    },
    {
      label: "Profile",
      href: "#",
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-white/60" stroke={1.7} />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-white/60" stroke={1.7} />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-white/60" stroke={1.7} />
      ),
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-svh w-full min-w-0 flex-col overflow-hidden bg-[#080d18] md:flex-row">

      {/* SIDEBAR */}
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 border-r border-white/[0.08] bg-[#0b1322] px-3 py-6 text-white">

          {/* TOP SECTION */}
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">

            {open ? <Logo /> : <LogoIcon />}

            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>

          {/* BOTTOM PROFILE */}
          <div className="border-t border-white/[0.08] pt-4">
            <SidebarLink
              link={{
                label: "Administrator",
                href: "#",
                icon: (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#A9C5FF]/20 bg-[#A9C5FF]/10">
                    <IconUserBolt
                      size={17}
                      stroke={1.7}
                      className="text-[#A9C5FF]"
                    />
                  </div>
                ),
              }}
            />
          </div>

        </SidebarBody>
      </Sidebar>

      {/* DASHBOARD CONTENT — INDEPENDENT VERTICAL SCROLL */}
      <div className="relative flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#080d18]">

        <div className="h-full min-h-0 w-full min-w-0 overflow-x-hidden overflow-y-auto overscroll-contain">

          <div className="min-h-full w-full min-w-0 border-l border-white/[0.06] bg-[#080d18] md:rounded-tl-[28px]">

            {children}

          </div>

        </div>

      </div>

    </div>
  );
}

/* ============================================================
   BRAND LOGO
============================================================ */

export const Logo = () => {
  return (
    <Link
      href="/dashboard"
      className="group relative z-20 flex items-center gap-3 px-2 py-1"
    >
      <LogoSymbol />

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="whitespace-pre text-[17px] font-semibold tracking-[-0.055em] text-white"
      >
        quickshipgo<span className="text-[#A9C5FF]">.</span>
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="/dashboard"
      aria-label="quickshipgo Dashboard"
      className="group relative z-20 flex items-center py-1"
    >
      <LogoSymbol />
    </Link>
  );
};

/* ============================================================
   LOGO SYMBOL
============================================================ */

function LogoSymbol() {
  return (
    <div className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-all duration-300 group-hover:border-white/30 group-hover:bg-white/[0.12]">

      <svg
        width="25"
        height="25"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:scale-110"
      >
        <path
          d="M3 11H10M2 16H8M3 21H10"
          stroke="#A9C5FF"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        <path
          d="M11 10.5L20 5.5L29 10.5V21.5L20 26.5L11 21.5V10.5Z"
          stroke="white"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        <path
          d="M11 10.5L20 15.5L29 10.5M20 15.5V26.5"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M15 20H24M21 17L24 20L21 23"
          stroke="#A9C5FF"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div className="pointer-events-none absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

    </div>
  );
}