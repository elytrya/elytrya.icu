<script setup lang="ts">
const { t } = useLocale();

const { data: posts } = await useAsyncData("blog-list", () =>
  queryCollection("blog").order("date", "DESC").all(),
);

useHead({ title: "elytrya - devlog" });

function fmt(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
</script>

<template>
  <section>
    <div class="mx-auto max-w-[760px] px-7 py-16">
      <p
        class="mb-2 font-mono text-[11px] tracking-[0.14em] text-muted-foreground/50"
      >
        {{ t("blog.label") }}
      </p>
      <div class="flex items-end justify-between gap-4">
        <h1 class="text-3xl font-semibold tracking-tight">
          {{ t("blog.title") }}
        </h1>
        <a
          href="/rss.xml"
          class="inline-flex shrink-0 items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-brand"
        >
          <Icon name="lucide:rss" class="text-[13px]" />
          rss
        </a>
      </div>
      <p class="mt-3 max-w-[52ch] text-muted-foreground">
        {{ t("blog.intro") }}
      </p>

      <div v-if="posts && posts.length" class="mt-10">
        <NuxtLink
          v-for="(p, i) in posts"
          :key="p.path"
          :to="p.path"
          class="group block py-5"
          :class="i !== 0 ? 'border-t border-border/60' : ''"
        >
          <div class="flex items-baseline justify-between gap-6">
            <span
              class="text-lg font-semibold tracking-[-0.01em] underline-offset-[3px] group-hover:text-brand group-hover:underline"
              >{{ p.title }}</span
            >
            <span
              class="shrink-0 whitespace-nowrap font-mono text-xs text-muted-foreground/50"
              >{{ fmt(p.date) }}</span
            >
          </div>
          <p class="mt-1 max-w-[56ch] text-sm text-muted-foreground">
            {{ p.description }}
          </p>
        </NuxtLink>
      </div>
      <p v-else class="mt-10 text-muted-foreground">{{ t("blog.empty") }}</p>

      <NuxtLink
        to="/"
        class="mt-12 inline-block font-mono text-xs text-muted-foreground transition-colors hover:text-brand"
        >{{ t("blog.home") }}</NuxtLink
      >
    </div>
  </section>
</template>
