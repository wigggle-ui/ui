import TableOfContents from "./components/toc";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <div className="relative mx-auto max-w-4xl gap-12 lg:grid lg:max-w-7xl lg:grid-cols-[auto_1fr]">
    <div className="w-full space-y-6">{children}</div>
    <div className="sticky top-20 right-0 left-0 hidden h-max min-w-60 shrink-0 flex-col gap-2 lg:flex">
      <TableOfContents />
    </div>
  </div>
);

export default Layout;
