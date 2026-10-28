"use client";

import Link from "next/link";

import { useActiveSection } from "@/hooks/use-active-heading";

const links = [
  ["introduction", "Introduction"],
  ["widget", "Widget"],
  ["installation", "Installation"],
  ["usage", "Usage"],
  ["base-widget", "Base Widget"],
  ["api-reference", "API Reference"],
  ["sub-components", "Sub Components"],
] as const;

const ids = links.map(([id]) => id);

const TableOfContents = () => {
  const { activeId, setActiveId } = useActiveSection(ids);

  return (
    <nav className="sticky top-20 flex h-max min-w-60 flex-col gap-2">
      {links.map(([id, label]) => (
        <Link
          key={id}
          href={`#${id}`}
          onClick={() => setActiveId(id)}
          aria-current={activeId === id ? "location" : undefined}
          className={`text-sm transition-colors ${
            activeId === id
              ? "text-foreground font-medium"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
};

export default TableOfContents;
