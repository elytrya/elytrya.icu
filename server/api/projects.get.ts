import { projects as fallback, excludedRepos, type Project } from "~/data/projects";

type GithubRepo = {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
  archived: boolean;
  topics?: string[];
};

export default defineCachedEventHandler(
  async (): Promise<Project[]> => {
    const config = useRuntimeConfig();
    const user = config.public.githubUser;
    const token = (config as { githubToken?: string }).githubToken;

    const excluded = new Set(excludedRepos.map((n) => n.toLowerCase()));

    const byStars = (a: Project, b: Project) =>
      (b.stars ?? 0) - (a.stars ?? 0) || a.name.localeCompare(b.name);

    try {
      const repos = await $fetch<GithubRepo[]>(
        `https://api.github.com/users/${user}/repos`,
        {
          params: { per_page: 100, sort: "updated" },
          headers: {
            Accept: "application/vnd.github+json",
            "User-Agent": "elytrya-icu",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const meta = Object.fromEntries(
        fallback.map((p) => [p.name.toLowerCase(), p]),
      );

      const mapped = repos
        .filter(
          (r) => !r.fork && !r.archived && !excluded.has(r.name.toLowerCase()),
        )
        .map<Project>((r) => {
          const m = meta[r.name.toLowerCase()];
          return {
            name: r.name,
            description: r.description || m?.description || "no description yet.",
            language: r.language || m?.language,
            stars: r.stargazers_count,
            url: r.html_url,
            tags:
              m?.tags ??
              ([r.language, ...(r.topics ?? [])]
                .filter(Boolean)
                .slice(0, 3) as string[]),
            featured: m?.featured,
          };
        })
        .sort(byStars);

      if (mapped.length) return mapped;
    } catch {}

    return fallback
      .filter((p) => !excluded.has(p.name.toLowerCase()))
      .sort(byStars);
  },
  {
    name: "github-projects",
    maxAge: 60 * 60,
    getKey: () => "projects",
  },
);
