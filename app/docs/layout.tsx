import TableOfContents from "./components/toc";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <div className="relative mx-auto grid max-w-7xl grid-cols-[auto_1fr] gap-12">
    <div className="w-full space-y-6">{children}</div>
    <div className="sticky top-20 right-0 left-0 flex h-max min-w-60 shrink-0 flex-col gap-2">
      <TableOfContents />
    </div>
  </div>
);

export default Layout;
