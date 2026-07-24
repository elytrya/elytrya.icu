<script setup lang="ts">
const { t } = useLocale();
const route = useRoute();
const config = useRuntimeConfig();
const user = config.public.githubUser;
const name = computed(() => String(route.params.name));

type RepoDetail = {
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  topics: string[];
  homepage: string | null;
  defaultBranch: string;
  readmeHtml: string;
};

const { data: repo, error } = await useAsyncData<RepoDetail>(
  `repo-${name.value}`,
  () => $fetch<RepoDetail>(`/api/repo/${name.value}`),
  { watch: [name] },
);

if (error.value || !repo.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Repository not found",
    fatal: true,
  });
}

useHead(() => ({
  title: repo.value ? `${repo.value.name} - elytrya` : "elytrya",
  meta: repo.value?.description
    ? [{ name: "description", content: repo.value.description }]
    : [],
}));

const readmeEl = ref<HTMLElement | null>(null);

function enhanceReadme() {
  const el = readmeEl.value;
  const r = repo.value;
  if (!el || !r) return;

  const branch = r.defaultBranch || "HEAD";
  const rawBase = `https://raw.githubusercontent.com/${user}/${r.name}/${branch}/`;
  const blobBase = `https://github.com/${user}/${r.name}/blob/${branch}/`;

  el.querySelectorAll("a.anchor, svg.octicon, .octicon-link").forEach((n) =>
    n.remove(),
  );

  el.querySelectorAll("img").forEach((img) => {
    const src = img.getAttribute("src") || "";
    if (src && !/^(https?:)?\/\//.test(src) && !src.startsWith("data:")) {
      img.setAttribute("src", rawBase + src.replace(/^\.?\//, ""));
    }
    img.setAttribute("loading", "lazy");
  });

  el.querySelectorAll("a").forEach((a) => {
    const href = a.getAttribute("href") || "";
    if (href.startsWith("#")) return;
    if (href && !/^(https?:|mailto:)/.test(href)) {
      a.setAttribute("href", blobBase + href.replace(/^\.?\//, ""));
    }
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener noreferrer");
  });
}

onMounted(() => nextTick(enhanceReadme));
watch(
  () => repo.value?.readmeHtml,
  () => nextTick(enhanceReadme),
);
</script>

<template>
  <section>
    <article class="mx-auto max-w-[760px] px-7 py-16">
      <NuxtLink
        to="/#work"
        class="font-mono text-xs text-muted-foreground transition-colors hover:text-brand"
        >{{ t("project.back") }}</NuxtLink
      >

      <div class="mt-6 flex items-start justify-between gap-6">
        <div class="min-w-0">
          <h1
            class="text-[clamp(26px,4vw,36px)] font-semibold lowercase tracking-tight"
          >
            {{ repo?.name }}
          </h1>
          <p
            v-if="repo?.description"
            class="mt-2 max-w-[56ch] text-muted-foreground"
          >
            {{ repo.description }}
          </p>
        </div>
        <a
          :href="repo?.url"
          target="_blank"
          rel="noopener"
          class="inline-flex shrink-0 items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-brand"
        >
          <Icon name="lucide:github" class="text-[14px]" />
          github
        </a>
      </div>

      <div
        class="mt-4 flex flex-wrap items-center gap-4 font-mono text-[13px] text-muted-foreground/60"
      >
        <span v-if="repo?.language">{{ repo.language }}</span>
        <span>★ {{ repo?.stars ?? 0 }}</span>
        <span v-if="(repo?.forks ?? 0) > 0">⑂ {{ repo?.forks }}</span>
        <a
          v-if="repo?.homepage"
          :href="repo.homepage"
          target="_blank"
          rel="noopener"
          class="transition-colors hover:text-brand"
          >{{ repo.homepage }}</a
        >
      </div>

      <template v-if="repo?.readmeHtml">
        <div
          class="mt-12 flex items-center justify-between gap-4 border-t border-border/60 pt-6"
        >
          <span
            class="font-mono text-[11px] tracking-[0.14em] text-muted-foreground/50"
            >readme.md</span
          >
          <a
            :href="repo?.url"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground/60 transition-colors hover:text-brand"
          >
            {{ t("project.viewOnGithub") }}
            <Icon name="lucide:arrow-up-right" class="text-[12px]" />
          </a>
        </div>
        <div
          ref="readmeEl"
          class="prose-elytrya mt-6"
          v-html="repo.readmeHtml"
        />
      </template>
      <p v-else class="mt-10 text-muted-foreground">
        {{ t("project.noReadme") }}
      </p>
    </article>
  </section>
</template>
