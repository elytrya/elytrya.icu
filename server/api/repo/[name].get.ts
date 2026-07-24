import { projects as fallback, excludedRepos } from "~/data/projects";

type GithubRepoDetail = {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics?: string[];
  homepage?: string | null;
  default_branch: string;
};

export default defineCachedEventHandler(
  async (event) => {
    const name = getRouterParam(event, "name");
    if (!name) {
      throw createError({ statusCode: 400, statusMessage: "Missing repo name" });
    }

    const excluded = new Set(excludedRepos.map((n) => n.toLowerCase()));
    if (excluded.has(name.toLowerCase())) {
      throw createError({
        statusCode: 404,
        statusMessage: "Repository not found",
      });
    }

    const config = useRuntimeConfig();
    const user = config.public.githubUser;
    const token = (config as { githubToken?: string }).githubToken;

    const baseHeaders: Record<string, string> = {
      "User-Agent": "elytrya-icu",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const local = fallback.find(
      (p) => p.name.toLowerCase() === name.toLowerCase(),
    );

    let repo: GithubRepoDetail | null = null;
    try {
      repo = await $fetch<GithubRepoDetail>(
        `https://api.github.com/repos/${user}/${name}`,
        { headers: { ...baseHeaders, Accept: "application/vnd.github+json" } },
      );
    } catch {
      repo = null;
    }

    if (!repo && !local) {
      throw createError({
        statusCode: 404,
        statusMessage: "Repository not found",
      });
    }

    const branch = repo?.default_branch ?? "HEAD";

    let readmeHtml = "";
    try {
      readmeHtml = await $fetch<string>(
        `https://api.github.com/repos/${user}/${repo?.name ?? name}/readme`,
        {
          headers: {
            ...baseHeaders,
            Accept: "application/vnd.github.html+json",
          },
        },
      );
    } catch {
      readmeHtml = "";
    }

    return {
      name: repo?.name ?? local!.name,
      description: repo?.description ?? local?.description ?? null,
      url: repo?.html_url ?? local?.url ?? `https://github.com/${user}/${name}`,
      language: repo?.language ?? local?.language ?? null,
      stars: repo?.stargazers_count ?? local?.stars ?? 0,
      forks: repo?.forks_count ?? 0,
      topics: repo?.topics ?? [],
      homepage: repo?.homepage || null,
      defaultBranch: branch,
      readmeHtml,
    };
  },
  {
    name: "github-repo",
    maxAge: 60 * 60,
    getKey: (event) => getRouterParam(event, "name") || "unknown",
  },
);
