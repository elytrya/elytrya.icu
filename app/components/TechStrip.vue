<script setup lang="ts">
const { t } = useLocale();
const stack = [
  { name: "python", icon: "simple-icons:python", color: "#3776AB" },
  { name: "java", icon: "ri:java-line", color: "#E76F00" },
  { name: "kotlin", icon: "simple-icons:kotlin", color: "#7F52FF" },
  { name: "typescript", icon: "simple-icons:typescript", color: "#3178C6" },
  { name: "vue / nuxt", icon: "simple-icons:nuxtdotjs", color: "#00DC82" },
  { name: "tailwind", icon: "simple-icons:tailwindcss", color: "#06B6D4" },
  { name: "fastapi", icon: "simple-icons:fastapi", color: "#009688" },
  { name: "fastly", icon: "simple-icons:fastly", color: "#FF282D" },
];
</script>

<template>
  <section>
    <div class="mx-auto max-w-[760px] px-7 py-11">
      <p
        v-reveal
        class="mb-6 font-mono text-[11px] tracking-[0.14em] text-muted-foreground/50"
      >
        {{ t("stack.label") }}
      </p>
      <div class="flex flex-wrap gap-2.5">
        <span
          v-for="(s, i) in stack"
          :key="s.name"
          v-reveal="i * 45"
          :style="{ '--tc': s.color }"
          class="group inline-flex items-center gap-2 rounded-lg border border-border bg-card/50 px-3 py-2 font-mono text-[13px] text-foreground/80 transition-colors hover:border-[color:var(--tc)] hover:text-foreground"
        >
          <Icon
            :name="s.icon"
            class="text-[15px] text-muted-foreground transition-colors group-hover:text-[color:var(--tc)]"
          />
          {{ s.name }}
        </span>
      </div>
    </div>
  </section>
</template>
