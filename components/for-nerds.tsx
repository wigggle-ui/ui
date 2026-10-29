import { cn } from "cn";

import { siteConfig } from "@/config/site";
import { userConfig } from "@/config/user";
import { totalWidgetCount } from "@/config/widgets";
import { getBuildInfo, getStack } from "@/lib/build-info";
import type { BuildInfo } from "@/lib/build-info";

const Field = ({
  className,
  label,
  children,
}: {
  className?: string;
  label: string;
  children: React.ReactNode;
}) => (
  <div
    className={cn("bg-background flex min-w-0 flex-col gap-1 py-3", className)}
  >
    <dt className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
      {label}
    </dt>
    <dd className="text-base">{children}</dd>
  </div>
);

const BuildValue = ({ build }: { build: BuildInfo }) => {
  if (!build.commitShortSha) {
    return <span className="text-muted-foreground">unavailable</span>;
  }

  return (
    <>
      {build.commitUrl ? (
        <a
          className="link-underline"
          href={build.commitUrl}
          target="_blank"
          rel="noopener"
        >
          {build.commitShortSha}
        </a>
      ) : (
        build.commitShortSha
      )}

      {build.environment !== "production" && (
        <span className="text-muted-foreground">
          {" "}
          ({build.environment === "development" ? "local" : build.environment})
        </span>
      )}
    </>
  );
};

const ForNerds = () => {
  const build = getBuildInfo();
  const stack = getStack();

  return (
    <div>
      <div className="relative space-y-4">
        <dl className="grid grid-cols-3 md:grid-cols-4">
          <Field label="Crafted by">
            <a
              className="link-underline"
              href={userConfig.website}
              target="_blank"
              rel="noopener"
            >
              {userConfig.displayName}
            </a>
          </Field>

          <Field label="Build">
            <BuildValue build={build} />
          </Field>

          <Field label="Widgets">{totalWidgetCount}</Field>

          <Field label="Deployed on">
            <span className="font-sans" aria-hidden>
              {" "}
              ▲{" "}
            </span>
            <span className="sr-only">Vercel</span>
          </Field>

          <Field label="Source code">
            <a
              className="link-underline"
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener"
            >
              GitHub
            </a>
          </Field>

          <Field label="License">
            <a
              className="link-underline"
              href={siteConfig.license.url}
              target="_blank"
              rel="noopener"
            >
              {siteConfig.license.name}
            </a>
          </Field>

          <Field label="Typeface">
            <a
              className="link-underline"
              href={siteConfig.typeface.url}
              target="_blank"
              rel="noopener"
            >
              {siteConfig.typeface.name}
            </a>
          </Field>

          <Field label="Analytics">
            <ul className="flex flex-col gap-0.5">
              <li>
                <a
                  className="link-underline"
                  href={siteConfig.analytics.url}
                  target="_blank"
                  rel="noopener"
                >
                  OpenPanel
                </a>
              </li>
            </ul>
          </Field>

          <Field className="col-span-4" label="Stack">
            <ul className="grid grid-cols-2 gap-y-2 md:grid-cols-4">
              {stack.map((entry) => (
                <li className="flex gap-2" key={entry}>
                  {entry}
                </li>
              ))}
            </ul>
          </Field>
        </dl>
      </div>
    </div>
  );
};

export default ForNerds;
