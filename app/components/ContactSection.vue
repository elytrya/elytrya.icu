<script setup lang="ts">
const { t } = useLocale();
const handle = "elytrya__";
const copied = ref(false);

async function copyHandle() {
  try {
    await navigator.clipboard.writeText(handle);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1600);
  } catch {
    copied.value = false;
  }
}
</script>

<template>
  <section id="contact">
    <div class="mx-auto max-w-[760px] px-7 py-11">
      <p
        v-reveal
        class="mb-6 font-mono text-[11px] tracking-[0.14em] text-muted-foreground/50"
      >
        {{ t("contact.label") }}
      </p>
      <p
        v-reveal="60"
        class="max-w-[22ch] text-[clamp(18px,2.4vw,26px)] font-semibold tracking-[-0.02em]"
      >
        {{ t("contact.title") }}
      </p>

      <div v-reveal="120" class="mt-8">
        <button
          type="button"
          :aria-label="handle"
          class="group inline-flex items-center gap-2.5 rounded-full border border-border bg-card/60 px-5 py-2.5 text-sm font-medium transition-[color,border-color,transform] duration-200 ease-out hover:border-brand hover:text-brand active:scale-[0.96]"
          @click="copyHandle"
        >
          <span
            class="relative inline-flex h-4 w-4 items-center justify-center"
          >
            <Transition name="copy-icon" mode="out-in">
              <Icon
                :key="copied ? 'check' : 'copy'"
                :name="copied ? 'lucide:check' : 'lucide:copy'"
                class="absolute text-[16px]"
                :class="
                  copied
                    ? 'text-brand'
                    : 'text-muted-foreground group-hover:text-brand'
                "
              />
            </Transition>
          </span>
          <Transition name="copy-label" mode="out-in">
            <span :key="copied ? 'copied' : 'handle'">{{
              copied ? t("contact.copied") : "@" + handle
            }}</span>
          </Transition>
        </button>
        <p class="mt-3 font-mono text-xs text-muted-foreground/50">
          {{ t("contact.hint") }}
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.copy-icon-enter-active {
  transition:
    opacity 0.2s ease,
    transform 0.24s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.copy-icon-leave-active {
  transition:
    opacity 0.12s ease,
    transform 0.12s ease;
}
.copy-icon-enter-from,
.copy-icon-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

.copy-label-enter-active,
.copy-label-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}
.copy-label-enter-from {
  opacity: 0;
  transform: translateY(5px);
}
.copy-label-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

@media (prefers-reduced-motion: reduce) {
  .copy-icon-enter-active,
  .copy-icon-leave-active,
  .copy-label-enter-active,
  .copy-label-leave-active {
    transition: none;
  }
}
</style>
