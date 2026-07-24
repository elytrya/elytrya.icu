<script setup lang="ts">
const config = useRuntimeConfig();
const gh = `https://github.com/${config.public.githubUser}`;
const { t, toggle } = useLocale();
const { isDark, toggle: toggleTheme } = useTheme();

const route = useRoute();
const showProgress = computed(() => route.path.startsWith("/blog"));

const scrolled = ref(false);
const progress = ref(0);
function onScroll() {
  const el = document.documentElement;
  scrolled.value = window.scrollY > 8;
  const max = el.scrollHeight - el.clientHeight;
  progress.value = max > 0 ? Math.min(1, window.scrollY / max) : 0;
}
onMounted(() => {
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onScroll);
});
</script>

<template>
  <header
    class="sticky top-0 z-30 border-b bg-background/80 backdrop-blur transition-colors"
    :class="scrolled ? 'border-border' : 'border-transparent'"
  >
    <div
      class="mx-auto flex h-16 max-w-[760px] items-center justify-between px-7"
    >
      <NuxtLink to="/" class="text-[15px] font-semibold tracking-tight">
        elytrya<span class="text-brand">.</span>
      </NuxtLink>
      <div class="flex items-center gap-4">
        <NuxtLink
          to="/blog"
          class="font-mono text-xs text-muted-foreground transition-colors hover:text-brand"
        >
          {{ t("nav.blog") }}
        </NuxtLink>
        <span class="h-3.5 w-px bg-border" />
        <button
          type="button"
          class="font-mono text-xs text-muted-foreground transition-colors hover:text-brand"
          @click="toggle"
        >
          {{ t("lang.toggle") }}
        </button>
        <span class="h-3.5 w-px bg-border" />
        <button
          type="button"
          aria-label="toggle theme"
          class="flex text-muted-foreground transition-colors hover:text-brand"
          @click="toggleTheme"
        >
          <Icon
            :name="isDark ? 'lucide:sun' : 'lucide:moon'"
            class="text-[15px]"
          />
        </button>
        <span class="h-3.5 w-px bg-border" />
        <a
          :href="gh"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground transition-colors hover:text-brand"
        >
          github
          <Icon name="lucide:arrow-up-right" class="text-[13px]" />
        </a>
      </div>
    </div>
    <div
      v-if="showProgress"
      class="absolute bottom-0 left-0 h-px bg-brand/70 transition-[width] duration-150 ease-out"
      :style="{ width: progress * 100 + '%' }"
    />
  </header>
</template>
