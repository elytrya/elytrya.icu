<script setup lang="ts">
const { t } = useLocale();
const route = useRoute();

const { data: doc } = await useAsyncData(`blog-${route.path}`, () =>
  queryCollection("blog").path(route.path).first(),
);

if (!doc.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Post not found",
    fatal: true,
  });
}

useHead(() => ({
  title: doc.value ? `${doc.value.title} - elytrya` : "elytrya - devlog",
  meta: doc.value?.description
    ? [{ name: "description", content: doc.value.description }]
    : [],
}));

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
    <article class="mx-auto max-w-[720px] px-7 py-16">
      <NuxtLink
        to="/blog"
        class="font-mono text-xs text-muted-foreground transition-colors hover:text-brand"
        >{{ t("blog.back") }}</NuxtLink
      >
      <h1 class="mt-6 text-[clamp(26px,4vw,36px)] font-semibold tracking-tight">
        {{ doc?.title }}
      </h1>
      <div class="mt-2 font-mono text-xs text-muted-foreground/50">
        {{ fmt(doc?.date) }}
      </div>
      <div class="prose-elytrya mt-8">
        <ContentRenderer v-if="doc" :value="doc" />
      </div>
    </article>
  </section>
</template>
