"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { usePageTransition } from "./PageTransitionProvider";

type PageTransitionLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

export default function PageTransitionLink({
  href,
  replace,
  onClick,
  ...props
}: PageTransitionLinkProps) {
  const { navigate } = usePageTransition();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;

    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.currentTarget.target === "_blank" ||
      event.currentTarget.hasAttribute("download")
    ) {
      return;
    }

    const destination = new URL(href, window.location.href);
    if (destination.origin !== window.location.origin) return;

    if (
      destination.pathname === window.location.pathname &&
      destination.search === window.location.search
    ) {
      return;
    }

    event.preventDefault();
    navigate(
      `${destination.pathname}${destination.search}${destination.hash}`,
      replace,
    );
  }

  return (
    <Link
      {...props}
      href={href}
      replace={replace}
      onClick={handleClick}
    />
  );
}