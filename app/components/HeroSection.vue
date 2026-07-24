<script setup lang="ts">
const config = useRuntimeConfig();
const user = config.public.githubUser;
const avatar = `https://github.com/${user}.png?size=240`;
const gh = `https://github.com/${user}`;
const site = (config.public.siteUrl as string) || "https://elytrya.icu";
const imgOk = ref(true);
const { t } = useLocale();
const { display, loaded } = useCodetime();

const tilt = reactive({ rx: 0, ry: 0 });
function onTilt(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement;
  const r = el.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width - 0.5;
  const py = (e.clientY - r.top) / r.height - 0.5;
  tilt.rx = -py * 24;
  tilt.ry = px * 24;
}
function resetTilt() {
  tilt.rx = 0;
  tilt.ry = 0;
}
const tiltStyle = computed(() => ({
  transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
}));

const squishing = ref(false);
function squish() {
  squishing.value = false;
  requestAnimationFrame(() => (squishing.value = true));
}

type Social = {
  label: string;
  href?: string;
  icon: string;
  self?: boolean;
  copy?: string;
};
const socials: Social[] = [
  { label: "github", href: gh, icon: "lucide:github" },
  { label: "discord", copy: "elytrya__", icon: "ic:baseline-discord" },
  { label: "elytrya.icu", href: site, icon: "lucide:globe", self: true },
];

const copiedDiscord = ref(false);
async function copyDiscord(handle: string) {
  try {
    await navigator.clipboard.writeText(handle);
    copiedDiscord.value = true;
    setTimeout(() => (copiedDiscord.value = false), 1600);
  } catch {
    copiedDiscord.value = false;
  }
}

const hereOpen = ref(false);
const shaking = ref(false);
const shared = ref(false);
let hideTimer: ReturnType<typeof setTimeout> | undefined;

function prefersReducedMotion() {
  return (
    import.meta.client &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function burstConfetti(anchor?: EventTarget | null) {
  if (import.meta.server || prefersReducedMotion()) return;
  const el = anchor as HTMLElement | null;
  const rect = el?.getBoundingClientRect();
  const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
  const cy = rect ? rect.top + rect.height / 2 : 120;
  const colors = [
    "hsl(var(--brand))",
    "#22c55e",
    "#38bdf8",
    "#eab308",
    "#f472b6",
  ];
  const n = 18;
  for (let i = 0; i < n; i++) {
    const bit = document.createElement("span");
    bit.className = "confetti-bit";
    const angle = (Math.PI * 2 * i) / n + Math.random() * 0.6;
    const dist = 55 + Math.random() * 75;
    bit.style.left = `${cx}px`;
    bit.style.top = `${cy}px`;
    bit.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
    bit.style.setProperty("--dy", `${Math.sin(angle) * dist - 40}px`);
    bit.style.background = colors[i % colors.length]!;
    bit.style.animationDelay = `${Math.random() * 40}ms`;
    document.body.appendChild(bit);
    setTimeout(() => bit.remove(), 950);
  }
}

function onSelfClick(e: MouseEvent) {
  e.preventDefault();
  hereOpen.value = true;
  shaking.value = false;
  requestAnimationFrame(() => (shaking.value = true));
  burstConfetti(e.currentTarget);
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => (hereOpen.value = false), 4500);
}

async function shareSite() {
  const coarse =
    import.meta.client && window.matchMedia("(pointer: coarse)").matches;
  if (coarse && typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({
        title: "elytrya",
        text: "elytrya - bots, tools & mods",
        url: site,
      });
    } catch {}
    return;
  }
  try {
    await navigator.clipboard.writeText(site);
    shared.value = true;
    setTimeout(() => (shared.value = false), 1600);
  } catch {
    shared.value = false;
  }
}

onBeforeUnmount(() => clearTimeout(hideTimer));
</script>

<template>
  <section class="relative flex min-h-[92vh] items-center overflow-hidden">
    <div class="relative mx-auto w-full max-w-[760px] px-7 py-24">
      <div class="animate-fade-up flex items-center gap-4">
        <div
          class="shrink-0 [perspective:600px]"
          @mousemove="onTilt"
          @mouseleave="resetTilt"
        >
          <NuxtImg
            v-if="imgOk"
            :src="avatar"
            :style="tiltStyle"
            :class="[
              'h-16 w-16 cursor-pointer select-none rounded-full object-cover shadow-[0_0_0_1px_hsl(var(--border)),0_12px_36px_-14px_hsl(var(--brand)/0.6)] transition-transform duration-150 will-change-transform',
              squishing ? 'animate-squish' : '',
            ]"
            alt="elytrya"
            width="64"
            height="64"
            sizes="64px"
            loading="eager"
            decoding="async"
            referrerpolicy="no-referrer"
            draggable="false"
            @click="squish"
            @animationend="squishing = false"
            @error="imgOk = false"
          />
          <div
            v-else
            class="h-16 w-16 rounded-full bg-muted shadow-[0_0_0_1px_hsl(var(--border))]"
          />
        </div>
        <div class="min-w-0">
          <div class="text-lg font-semibold leading-tight">elytrya</div>
          <a
            :href="gh"
            target="_blank"
            rel="noopener"
            class="font-mono text-xs text-muted-foreground transition-colors hover:text-brand"
            >@elytrya {{ t("hero.loc") }}</a
          >
        </div>
        <span
          class="ml-auto flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-muted-foreground"
        >
          {{ t("hero.status") }}
        </span>
      </div>

      <h1
        class="animate-fade-up mt-12 max-w-[17ch] text-[clamp(38px,6vw,60px)] font-semibold leading-[1.06] tracking-[-0.03em]"
        style="animation-delay: 0.08s"
      >
        {{ t("hero.title") }}
      </h1>
      <p
        class="animate-fade-up mt-6 max-w-[52ch] text-[clamp(16px,1.7vw,19px)] leading-relaxed text-muted-foreground"
        style="animation-delay: 0.14s"
      >
        {{ t("hero.bio") }}
      </p>

      <div class="animate-fade-up mt-12" style="animation-delay: 0.2s">
        <div
          class="flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] text-muted-foreground/70"
        >
          <Icon name="lucide:code-xml" class="text-[14px] text-brand" />
          {{ t("hero.codetime") }}
        </div>
        <div
          class="mt-2.5 font-mono text-[clamp(28px,4.6vw,46px)] font-semibold leading-none tabular-nums tracking-tight"
        >
          <template v-if="loaded">{{ display }}</template>
          <span
            v-else
            class="inline-block h-[0.85em] w-[8ch] animate-pulse rounded bg-muted align-middle"
          />
        </div>
      </div>

      <div
        class="animate-fade-up mt-10 flex flex-wrap gap-2.5 text-sm"
        style="animation-delay: 0.26s"
      >
        <template v-for="s in socials" :key="s.label">
          <button
            v-if="s.self"
            type="button"
            :class="[
              'group inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-4 py-2 transition-all hover:-translate-y-0.5 hover:border-brand hover:text-brand',
              shaking ? 'animate-shake' : '',
            ]"
            @animationend="shaking = false"
            @click="onSelfClick"
          >
            <Icon
              :name="s.icon"
              class="text-[15px] text-muted-foreground transition-colors group-hover:text-brand"
            />
            {{ s.label }}
            <Icon
              name="lucide:arrow-up-right"
              class="text-[13px] text-muted-foreground/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand"
            />
          </button>
          <button
            v-else-if="s.copy"
            type="button"
            :aria-label="s.copy"
            class="group inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-4 py-2 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-brand hover:text-brand active:scale-[0.96]"
            @click="copyDiscord(s.copy)"
          >
            <Icon
              :name="s.icon"
              class="text-[15px] text-muted-foreground transition-colors group-hover:text-brand"
            />
            <Transition name="share-label" mode="out-in">
              <span :key="copiedDiscord ? 'copied' : 'label'">{{
                copiedDiscord ? t("contact.copied") : s.label
              }}</span>
            </Transition>
            <span
              class="relative inline-flex h-[13px] w-[13px] items-center justify-center"
            >
              <Transition name="share-icon" mode="out-in">
                <Icon
                  :key="copiedDiscord ? 'check' : 'copy'"
                  :name="copiedDiscord ? 'lucide:check' : 'lucide:copy'"
                  class="absolute text-[13px] text-muted-foreground/40 group-hover:text-brand"
                />
              </Transition>
            </span>
          </button>
          <a
            v-else
            :href="s.href"
            target="_blank"
            rel="noopener"
            class="group inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-4 py-2 transition-all hover:-translate-y-0.5 hover:border-brand hover:text-brand"
          >
            <Icon
              :name="s.icon"
              class="text-[15px] text-muted-foreground transition-colors group-hover:text-brand"
            />
            {{ s.label }}
            <Icon
              name="lucide:arrow-up-right"
              class="text-[13px] text-muted-foreground/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand"
            />
          </a>
        </template>
      </div>

      <Transition name="toast">
        <div
          v-if="hereOpen"
          class="mt-4 inline-flex items-center gap-3 rounded-full border border-brand/40 bg-card/70 py-2 pl-4 pr-2 shadow-lg shadow-black/10 backdrop-blur"
        >
          <span class="text-sm">{{ t("share.here") }}</span>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-brand-foreground transition-transform duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.94]"
            @click="shareSite"
          >
            <span
              class="relative inline-flex h-[14px] w-[14px] items-center justify-center"
            >
              <Transition name="share-icon" mode="out-in">
                <Icon
                  :key="shared ? 'check' : 'share'"
                  :name="shared ? 'lucide:check' : 'lucide:share-2'"
                  class="absolute text-[14px]"
                />
              </Transition>
            </span>
            <Transition name="share-label" mode="out-in">
              <span :key="shared ? 'copied' : 'btn'">{{
                shared ? t("share.copied") : t("share.btn")
              }}</span>
            </Transition>
          </button>
        </div>
      </Transition>
    </div>
  </section>
</template>

<style scoped>
.share-icon-enter-active {
  transition:
    opacity 0.2s ease,
    transform 0.24s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.share-icon-leave-active {
  transition:
    opacity 0.12s ease,
    transform 0.12s ease;
}
.share-icon-enter-from,
.share-icon-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
.share-label-enter-active,
.share-label-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}
.share-label-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.share-label-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
@media (prefers-reduced-motion: reduce) {
  .share-icon-enter-active,
  .share-icon-leave-active,
  .share-label-enter-active,
  .share-label-leave-active {
    transition: none;
  }
}
</style>
