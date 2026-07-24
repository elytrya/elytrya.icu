<script setup lang="ts">
const { t } = useLocale();
const repo = useRuntimeConfig().public.repoUrl as string;
const { open: cmdOpen } = useCommandPalette();
</script>

<template>
  <footer>
    <div
      class="mx-auto flex max-w-[760px] flex-col gap-3 px-7 py-9 font-mono text-[11px] tracking-[0.04em] text-muted-foreground/50 sm:flex-row sm:items-center sm:justify-between"
    >
      <span class="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
        <a class="underline decoration-dashed underline-offset-4" href="https://github.com/elytrya">elytrya</a>
        <span class="hidden h-3 w-px bg-border sm:inline-block" />
        <SiteViews />
      </span>
      <span class="inline-flex items-center gap-3">
        <button
          type="button"
          aria-label="command palette"
          class="inline-flex items-center gap-1 transition-colors hover:text-brand"
          @click="cmdOpen = true"
        >
          <Icon name="lucide:command" class="text-[12px]" />
          K
        </button>
        <span class="h-3 w-px bg-border" />
        <a
          :href="repo"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-1.5 transition-colors hover:text-brand"
        >
          <Icon name="lucide:github" class="text-[13px]" />
          {{ t("footer.source") }}
        </a>
      </span>
    </div>
  </footer>
</template>
