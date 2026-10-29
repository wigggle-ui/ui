import TableOfContents from "./components/toc";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <div className="relative mx-auto max-w-4xl gap-12 md:grid md:max-w-7xl md:grid-cols-[auto_1fr]">
    <div className="w-full space-y-6">{children}</div>
    <div className="sticky top-20 right-0 left-0 hidden h-max min-w-60 shrink-0 flex-col gap-2 md:flex">
      <TableOfContents />
    </div>
  </div>
);

export default Layout;
