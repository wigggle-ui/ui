import { siteConfig } from "@/config/site";

const SiteFooter = () => (
  <footer className="bg-background border-border flex h-12 w-screen items-center justify-center border-t">
    <span className="text-muted-foreground text-sm">
      Built by{" "}
      <a
        href={siteConfig.links.twitter}
        target="_blank"
        rel="noreferrer"
        className="hover:text-foreground font-medium transition-colors duration-300"
      >
        Henil Shah
      </a>
      . The source code is available on{" "}
      <a
        href={siteConfig.links.github}
        target="_blank"
        rel="noreferrer"
        className="hover:text-foreground font-medium transition-colors duration-300"
      >
        GitHub
      </a>
      .
    </span>
  </footer>
);

export default SiteFooter;
