const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <div className="grid min-h-0 w-full gap-6 overflow-hidden">{children}</div>
);

export default Layout;
