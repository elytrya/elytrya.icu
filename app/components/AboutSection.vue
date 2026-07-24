<script setup lang="ts">
const { t } = useLocale();
const stats = [
  { n: "6+", k: "about.projects" as const },
  { n: "4", k: "about.langs" as const },
  { n: "’23", k: "about.since" as const },
];
</script>

<template>
  <section id="about">
    <div class="mx-auto max-w-[760px] px-7 py-11">
      <p
        v-reveal
        class="mb-6 font-mono text-[11px] tracking-[0.14em] text-muted-foreground/50"
      >
        {{ t("about.label") }}
      </p>
      <p
        v-reveal="60"
        class="max-w-[56ch] text-[clamp(16px,1.7vw,18px)] leading-relaxed text-foreground/80"
      >
        {{ t("about.body") }}
      </p>
      <div v-reveal="120" class="mt-8 flex gap-11">
        <div v-for="s in stats" :key="s.k">
          <div class="text-2xl font-semibold">{{ s.n }}</div>
          <div
            class="mt-1 font-mono text-[11px] tracking-[0.1em] text-muted-foreground/50"
          >
            {{ t(s.k) }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
