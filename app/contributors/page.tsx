import Image from "next/image";
import Link from "next/link";

import { ExternalLink } from "@/components/animate-ui/icons/external-link";
import CountUp from "@/components/count-up";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import type { GitHubRepositoryStats } from "@/lib/github-repository";
import { getCachedGitHubRepositoryStats } from "@/lib/github-repository";

const REPOSITORY =
  process.env.GITHUB_REPOSITORY ?? "https://github.com/wigggle-ui/ui";
const formatNumber = new Intl.NumberFormat("en");
const formatCount = (count: number, singular: string, plural: string): string =>
  `${formatNumber.format(count)} ${count === 1 ? singular : plural}`;

type RepositoryResult =
  | { ok: true; stats: GitHubRepositoryStats }
  | { ok: false; message: string };

const loadRepositoryStats = async (): Promise<RepositoryResult> => {
  try {
    return {
      ok: true,
      stats: await getCachedGitHubRepositoryStats(REPOSITORY),
    };
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
      ok: false,
    };
  }
};

const StatCard = ({
  label,
  value,
  showExternalLink = false,
}: {
  label: string;
  value: string;
  showExternalLink?: boolean;
}) => (
  <li className="p-1">
    <div className="flex min-h-28 flex-col items-center justify-center gap-3 px-3">
      <h2 className="text-muted-foreground flex items-center justify-center gap-2 font-mono text-sm font-medium tracking-wide uppercase">
        {label}
        {showExternalLink && (
          <ExternalLink
            className="size-4.5"
            animateOnHover
            animation="default"
          />
        )}
      </h2>
      <CountUp
        from={0}
        to={Number(value)}
        mode="roll"
        easing="expo"
        format="standard"
        direction="up"
        duration={1.5}
        delay={0}
        trigger="view"
        replayOnHover
        className="text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl"
      />
    </div>
  </li>
);

const CountBadge = ({
  count,
  singular,
  plural,
}: {
  count: number;
  singular: string;
  plural: string;
}) => (
  <span className="bg-muted rounded-full px-2.5 py-0.5 text-sm">
    {formatCount(count, singular, plural)}
  </span>
);

const RepositoryStats = ({ result }: { result: RepositoryResult }) => {
  if (!result.ok) {
    return (
      <p
        className="border-destructive/40 bg-destructive/5 rounded-xl border p-4 text-sm"
        role="alert"
      >
        Repository statistics could not be loaded: {result.message}
      </p>
    );
  }

  const { stats } = result;
  return (
    <div className="space-y-6">
      <PageHeader title="Contributors">
        A little proof that people care about.
      </PageHeader>
      <hr />
      <ul
        aria-label="Repository totals"
        className="grid grid-cols-2 items-center gap-6 md:grid-cols-4"
      >
        <StatCard label="Stars" value={formatNumber.format(stats.totalStars)} />
        <StatCard
          label="Contributors"
          value={formatNumber.format(stats.totalContributors)}
        />
        <StatCard
          label="Commits"
          value={formatNumber.format(stats.totalCommits)}
        />
        <Link
          aria-label={`${formatCount(stats.openIssues, "open issue", "open issues")} — view GitHub issues`}
          className="group focus-visible:ring-ring rounded-xl focus-visible:ring-2 focus-visible:outline-none"
          href={`${stats.repository.url}/issues`}
          rel="noopener noreferrer"
          target="_blank"
        >
          <StatCard
            label="Open Issues"
            value={formatNumber.format(stats.openIssues)}
            showExternalLink
          />
        </Link>
      </ul>
      <hr />
      <div className="space-y-2">
        <h2
          className="text-2xl font-semibold tracking-tight"
          id="sponsorship-heading"
        >
          Credit due where it&apos;s due.
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          Weirdos who make Wigggle UI possible.
        </p>
      </div>
      <div className="space-y-6">
        <hr />
        <section aria-labelledby="contributors-heading">
          {stats.contributors.length > 0 ? (
            <ol className="grid list-none grid-cols-2 gap-6 py-2 lg:grid-cols-3">
              {stats.contributors.map((contributor) => (
                <li key={contributor.id}>
                  <Link
                    className="border-border group hover:bg-accent/50 focus-visible:ring-ring flex size-full flex-col items-center justify-center gap-4 rounded-2xl border p-6 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                    href={contributor.profileUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Image
                      alt={contributor.name}
                      className="size-24 shrink-0 rounded-full border object-cover"
                      height={96}
                      src={contributor.avatarUrl}
                      width={96}
                    />
                    <span className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1">
                      <span className="block truncate">{contributor.name}</span>
                      <span className="flex flex-wrap gap-1.5">
                        <CountBadge
                          count={contributor.commits}
                          singular="commit"
                          plural="commits"
                        />
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-muted-foreground text-center">
              Prolly some issue with GitHub&apos;s API, maybe you can take a
              look at the repo itself...
            </p>
          )}
        </section>
        <hr />
        <div className="space-y-6 p-8 text-center">
          <p className="text-muted-foreground mx-auto max-w-2xl">
            There&apos;s always room for another widget. Build something new,
            improve what&apos;s already here, or fix something that could work
            better. Have an idea? Open an issue. We&apos;d love to see it.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="sm" asChild>
              <Link
                href={stats.repository.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                View the repository
              </Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link
                href={`${stats.repository.url}/issues`}
                rel="noopener noreferrer"
                target="_blank"
              >
                Browse open issues
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const metadata = {
  description: "See the contributors and activity behind Wigggle UI.",
  title: "Contributors",
};

const Page = async () => {
  const result = await loadRepositoryStats();

  return (
    <main className="mx-auto max-w-7xl">
      <RepositoryStats result={result} />
    </main>
  );
};

export default Page;
