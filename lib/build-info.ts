import { siteConfig } from "@/config/site";
import { userConfig } from "@/config/user";

import packageJson from "../package.json";

/**
 * Reads the Vercel deployment environment variables, which are server-side
 * only — do not import this from a client component. Set them in `.env.local`
 * to exercise the non-development rendering.
 */

const SHORT_SHA_LENGTH = 7;

export type BuildEnvironment = "production" | "preview" | "development";

export interface BuildInfo {
  commitShortSha: string | null;
  /** Null while running locally, where HEAD is often unpushed. */
  commitUrl: string | null;
  environment: BuildEnvironment;
  /** YYYY-MM-DD, in the site owner's time zone. */
  date: string;
}

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  day: "2-digit",
  month: "2-digit",
  timeZone: userConfig.timeZone,
  year: "numeric",
});

/** Stamped by `next.config.ts` at build time. */
const BUILD_DATE = dateFormatter.format(
  process.env.BUILD_TIMESTAMP
    ? new Date(process.env.BUILD_TIMESTAMP)
    : new Date()
);

const resolveEnvironment = (): BuildEnvironment => {
  const vercelEnv = process.env.VERCEL_ENV;
  return vercelEnv === "production" || vercelEnv === "preview"
    ? vercelEnv
    : "development";
};

export const getBuildInfo = (): BuildInfo => {
  const environment = resolveEnvironment();
  const commitSha = process.env.VERCEL_GIT_COMMIT_SHA;

  return {
    commitShortSha: commitSha?.slice(0, SHORT_SHA_LENGTH) ?? null,
    commitUrl:
      commitSha && environment !== "development"
        ? `${siteConfig.links.github}/commit/${commitSha}`
        : null,
    date: BUILD_DATE,
    environment,
  };
};

const STACK_DEPENDENCIES = [
  "react",
  "next",
  "shadcn",
  "radix-ui",
  "@base-ui/react",
  "lucide-react",
  "motion",
  "@next/mdx",
  "tailwindcss",
  "typescript",
  "ultracite",
];

const declaredVersions: Record<string, string | undefined> = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
};

/** The stack in npm spec form: `["next@16.3.0", …]`. */
export const getStack = (): string[] =>
  STACK_DEPENDENCIES.flatMap((dependency) => {
    // Drops the range prefix, so `^4.3.3` reads as a version.
    const version = declaredVersions[dependency]?.replace(/^[^\d]*/u, "");
    return version ? [`${dependency}@${version}`] : [];
  });
