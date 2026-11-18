import { unstable_cache } from "next/cache";

const API = "https://api.github.com";
const API_VERSION = "2022-11-28";
const REPOSITORY_STATS_CACHE_SECONDS = 60 * 60;

interface GitHubUser {
  id: number;
  login: string;
  avatarUrl: string;
  profileUrl: string;
}

export interface GitHubRepositoryContributor extends GitHubUser {
  name: string;
  commits: number;
  mergedPullRequests: number;
}

export interface GitHubRepositoryStats {
  repository: { owner: string; name: string; url: string };
  totalStars: number;
  totalContributors: number;
  totalCommits: number;
  openIssues: number;
  openPullRequests: number;
  contributors: GitHubRepositoryContributor[];
}

export interface GitHubRepositoryStatsOptions {
  repository: string;
  token?: string;
  signal?: AbortSignal;
  fetcher?: typeof fetch;
}

export class GitHubApiError extends Error {
  readonly status: number;
  readonly rateLimitReset: string | null;

  constructor(status: number, message: string, rateLimitReset: string | null) {
    super(`GitHub API request failed (${status}): ${message}`);
    this.name = "GitHubApiError";
    this.status = status;
    this.rateLimitReset = rateLimitReset;
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const parseUser = (value: unknown): GitHubUser | null => {
  if (!isRecord(value)) {
    return null;
  }

  const { id, login, avatar_url, html_url } = value;
  return typeof id === "number" &&
    typeof login === "string" &&
    typeof avatar_url === "string" &&
    typeof html_url === "string"
    ? { avatarUrl: avatar_url, id, login, profileUrl: html_url }
    : null;
};

const parseRepository = (
  input: string
): GitHubRepositoryStats["repository"] => {
  const value = input.trim();
  const url = value.includes("://")
    ? new URL(value)
    : new URL(`https://github.com/${value}`);
  const [owner, rawName] = url.pathname.split("/").filter(Boolean);
  const name = rawName?.replace(/\.git$/u, "");

  if (
    url.protocol !== "https:" ||
    url.hostname !== "github.com" ||
    !owner ||
    !name ||
    url.pathname.split("/").filter(Boolean).length !== 2
  ) {
    throw new Error('Provide a GitHub URL or "owner/repository".');
  }

  return { name, owner, url: `https://github.com/${owner}/${name}` };
};

const createApiClient = (
  token: string | undefined,
  signal: AbortSignal | undefined,
  fetcher: typeof fetch
) => {
  const request = async (url: URL): Promise<Response> => {
    const response = await fetcher(url, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": API_VERSION,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      signal,
    });

    if (!response.ok) {
      const body: unknown = await response.json();
      const message =
        isRecord(body) && typeof body.message === "string"
          ? body.message
          : "Unexpected error response.";
      throw new GitHubApiError(
        response.status,
        message,
        response.headers.get("x-ratelimit-reset")
      );
    }

    return response;
  };

  const get = async (path: string): Promise<unknown> => {
    const response = await request(new URL(path, API));
    return response.json();
  };

  const pages = async function* pages(path: string): AsyncGenerator<unknown> {
    let url: URL | null = new URL(path, API);

    while (url) {
      // Pagination is sequential because each next URL comes from the response.
      // oxlint-disable-next-line no-await-in-loop
      const response = await request(url);

      // oxlint-disable-next-line no-await-in-loop
      const body: unknown = await response.json();
      if (!Array.isArray(body)) {
        throw new TypeError("GitHub API returned an unexpected response.");
      }
      for (const item of body) {
        yield item;
      }

      const nextLink = response.headers
        .get("link")
        ?.match(/<[^>]+>;\s*rel="next"/u)?.[0];
      const next: string | undefined = nextLink?.slice(
        1,
        nextLink.indexOf(">")
      );
      url = next ? new URL(next) : null;
      if (url && url.origin !== API) {
        throw new Error("GitHub API returned an invalid pagination URL.");
      }
    }
  };

  return { get, pages };
};

const collectCommits = async (
  pages: ReturnType<typeof createApiClient>["pages"],
  path: string,
  contributors: Map<number, GitHubRepositoryContributor>
): Promise<number> => {
  let total = 0;
  // Pages are yielded sequentially to avoid buffering the entire commit history.
  // oxlint-disable-next-line no-await-in-loop
  for await (const commit of pages(path)) {
    if (!isRecord(commit)) {
      continue;
    }
    total += 1;
    const user = parseUser(commit.author);
    if (user) {
      const contributor = contributors.get(user.id) ?? {
        ...user,
        commits: 0,
        mergedPullRequests: 0,
        name: user.login,
      };
      contributor.commits += 1;
      contributors.set(user.id, contributor);
    }
  }
  return total;
};

const collectMergedPullRequests = async (
  pages: ReturnType<typeof createApiClient>["pages"],
  path: string,
  contributors: Map<number, GitHubRepositoryContributor>
): Promise<void> => {
  for await (const pullRequest of pages(path)) {
    if (!isRecord(pullRequest) || typeof pullRequest.merged_at !== "string") {
      continue;
    }
    const user = parseUser(pullRequest.user);
    if (user) {
      const contributor = contributors.get(user.id) ?? {
        ...user,
        commits: 0,
        mergedPullRequests: 0,
        name: user.login,
      };
      contributor.mergedPullRequests += 1;
      contributors.set(user.id, contributor);
    }
  }
};

/**
 * Fetch repository totals and contributors, sorted by commits descending.
 * Commit and pull-request counts include only the default branch and merged PRs.
 */
export const getGitHubRepositoryStats = async ({
  repository: input,
  token,
  signal,
  fetcher = globalThis.fetch,
}: GitHubRepositoryStatsOptions): Promise<GitHubRepositoryStats> => {
  const repository = parseRepository(input);
  const base = `/repos/${encodeURIComponent(repository.owner)}/${encodeURIComponent(repository.name)}`;
  const api = createApiClient(token?.trim() || undefined, signal, fetcher);
  const contributors = new Map<number, GitHubRepositoryContributor>();
  const [metadata, totalCommits] = await Promise.all([
    api.get(base),
    collectCommits(api.pages, `${base}/commits?per_page=100`, contributors),
    collectMergedPullRequests(
      api.pages,
      `${base}/pulls?state=closed&per_page=100`,
      contributors
    ),
  ]);

  if (!isRecord(metadata) || typeof metadata.stargazers_count !== "number") {
    throw new TypeError("GitHub API returned an invalid repository response.");
  }

  let openIssues = 0;
  let openPullRequests = 0;

  for await (const issue of api.pages(
    `${base}/issues?state=open&per_page=100`
  )) {
    if (isRecord(issue)) {
      if ("pull_request" in issue) {
        openPullRequests += 1;
      } else {
        openIssues += 1;
      }
    }
  }

  const sortedContributors = [...contributors.values()].toSorted(
    (first, second) =>
      second.commits - first.commits ||
      second.mergedPullRequests - first.mergedPullRequests ||
      first.login.localeCompare(second.login)
  );

  return {
    contributors: sortedContributors,
    openIssues,
    openPullRequests,
    repository,
    totalCommits,
    totalContributors: sortedContributors.length,
    totalStars: metadata.stargazers_count,
  };
};

export const getCachedGitHubRepositoryStats = unstable_cache(
  async (repository: string): Promise<GitHubRepositoryStats> =>
    await getGitHubRepositoryStats({
      repository,
      token: process.env.GITHUB_TOKEN,
    }),
  ["github-repository-stats"],
  { revalidate: REPOSITORY_STATS_CACHE_SECONDS }
);
