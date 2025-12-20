import Link from "next/link";

const pageLinks = [
  { href: "#introduction", label: "Introduction" },
  { href: "#what-is-a-widget?", label: "What is a Widget?" },
  { href: "#installation", label: "Installation" },
  { href: "#usage", label: "Usage" },
  { href: "#widget.tsx", label: "Widget.tsx" },
  { href: "#api-reference", label: "API Reference" },
  { href: "#sub-components", label: "Sub Components" },
];

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="overflow-none relative flex items-start justify-center gap-x-6 px-6 text-start">
      <div className="sticky top-28 hidden h-[calc(100vh-131px)] w-[284px] space-y-2 md:flex md:shrink-0 md:flex-col">
        <h2>On this page</h2>
        {pageLinks.map((el) => (
          <Link
            className="hover:text-foreground text-muted-foreground transition-colors duration-300"
            key={el.href}
            href={el.href}
          >
            {el.label}
          </Link>
        ))}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
