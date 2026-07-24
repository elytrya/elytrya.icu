<script setup lang="ts">
import type { Project } from "~/data/projects";

const props = defineProps<{ project: Project }>();

const langColors: Record<string, string> = {
  Python: "#3572A5",
  Java: "#b07219",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Kotlin: "#A97BFF",
  Vue: "#41b883",
  Go: "#00ADD8",
  Rust: "#dea584",
};

const langColor = computed(() =>
  props.project.language
    ? (langColors[props.project.language] ?? "#8b8b8b")
    : "#8b8b8b",
);
</script>

<template>
  <a
    :href="project.url"
    target="_blank"
    rel="noopener"
    class="group relative flex min-h-[210px] flex-col rounded-[14px] border border-border bg-card p-[26px] transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:bg-secondary"
  >
    <div class="mb-3.5 flex items-center justify-between">
      <h3 class="text-xl font-bold tracking-tight">{{ project.name }}</h3>
      <span
        class="text-muted-foreground/50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
        >↗</span
      >
    </div>

    <p class="flex-1 text-[14.5px] leading-relaxed text-muted-foreground">
      {{ project.description }}
    </p>

    <div v-if="project.tags?.length" class="mt-[18px] flex flex-wrap gap-2">
      <Badge v-for="t in project.tags" :key="t" variant="accent">{{ t }}</Badge>
    </div>

    <div
      class="mt-4 flex items-center gap-4 font-mono text-[13px] text-muted-foreground/60"
    >
      <span v-if="project.language" class="inline-flex items-center gap-2">
        <span
          class="h-2.5 w-2.5 rounded-full"
          :style="{ background: langColor }"
        />
        {{ project.language }}
      </span>
      <span>★ {{ project.stars ?? 0 }}</span>
    </div>
  </a>
</template>
