<script setup lang="ts">
const { projects } = useProjects();
const { t } = useLocale();
</script>

<template>
  <section id="work">
    <div class="mx-auto max-w-[760px] px-7 py-11">
      <p
        v-reveal
        class="mb-6 font-mono text-[11px] tracking-[0.14em] text-muted-foreground/50"
      >
        {{ t("work.label") }}
      </p>

      <div>
        <NuxtLink
          v-for="(p, i) in projects"
          :key="p.url"
          v-reveal="i * 55"
          :to="`/projects/${p.name}`"
          class="group flex items-baseline justify-between gap-6 py-[18px]"
          :class="i !== 0 ? 'border-t border-border/60' : ''"
        >
          <div class="min-w-0">
            <div
              class="flex items-center gap-1.5 text-[18px] font-semibold lowercase tracking-[-0.02em]"
            >
              <span
                class="underline-offset-[3px] group-hover:text-brand group-hover:underline"
                >{{ p.name }}</span
              >
              <Icon
                name="lucide:arrow-up-right"
                class="text-[15px] text-muted-foreground/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand"
              />
            </div>
            <p
              class="mt-1 line-clamp-2 max-w-[46ch] text-sm text-muted-foreground"
            >
              {{ p.description }}
            </p>
          </div>
          <div
            class="shrink-0 whitespace-nowrap text-right font-mono text-xs lowercase leading-5 text-muted-foreground/50"
          >
            <span v-if="p.language">{{ p.language }}</span>
            <br v-if="p.language && (p.stars ?? 0) > 0" />
            <span v-if="(p.stars ?? 0) > 0">★ {{ p.stars }}</span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
