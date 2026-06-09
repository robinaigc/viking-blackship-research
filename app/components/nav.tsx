"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { LanguageToggle, LocalizedText } from "./language";

export const navItemClassName =
  "text-sm text-zinc-400 duration-200 hover:text-zinc-100";

const links = [
  { label: "Home", zh: "首页", href: "/" },
  { label: "Analysis", zh: "分析", href: "/analysis" },
  { label: "Products", zh: "产品", href: "/products" },
  { label: "About", zh: "关于", href: "/about" },
  { label: "Subscribe", zh: "订阅", href: "/subscribe" },
];

export const Navigation: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const [isIntersecting, setIntersecting] = useState(true);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting),
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <header ref={ref}>
      <div
        className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur duration-200 ${
          isIntersecting
            ? "bg-zinc-900/0 border-transparent"
            : "bg-zinc-900/80 border-zinc-800"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between gap-6 p-6">
          <Link
            href="/"
            className="text-sm font-medium tracking-wide text-zinc-300 duration-200 hover:text-zinc-100"
          >
            Viking Blackship
          </Link>
          <nav className="flex flex-nowrap justify-end gap-4 sm:gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={navItemClassName}
              >
                <LocalizedText en={link.label} zh={link.zh} />
              </Link>
            ))}
            <LanguageToggle className={navItemClassName} />
          </nav>
        </div>
      </div>
    </header>
  );
};
