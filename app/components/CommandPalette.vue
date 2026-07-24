<script setup lang="ts">
const { open } = useCommandPalette();
const { open: termOpen } = useTerminal();
const { t, toggle: toggleLang } = useLocale();
const { toggle: toggleTheme } = useTheme();
const router = useRouter();
const route = useRoute();

const query = ref("");
const active = ref(0);
const inputEl = ref<HTMLInputElement | null>(null);

const discord = "elytrya__";
const gh = `https://github.com/${useRuntimeConfig().public.githubUser}`;

type Cmd = {
  id: string;
  group: "nav" | "actions";
  icon: string;
  label: () => string;
  keywords?: string;
  run: () => void | Promise<void>;
  defer?: boolean;
};

function goSection(hash: string) {
  const doScroll = () => {
    if (hash === "#top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document
      .querySelector(hash)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  if (route.path !== "/") {
    router.push("/").then(() => setTimeout(doScroll, 80));
  } else {
    doScroll();
  }
}

async function copyDiscord() {
  try {
    await navigator.clipboard.writeText(discord);
  } catch {}
}

const commands: Cmd[] = [
  {
    id: "top",
    group: "nav",
    icon: "lucide:arrow-up",
    label: () => t("cmd.top"),
    keywords: "home top наверх главная",
    run: () => goSection("#top"),
  },
  {
    id: "work",
    group: "nav",
    icon: "lucide:folder-git-2",
    label: () => t("cmd.work"),
    keywords: "projects work проекты",
    run: () => goSection("#work"),
  },
  {
    id: "about",
    group: "nav",
    icon: "lucide:user",
    label: () => t("cmd.about"),
    keywords: "about обо мне",
    run: () => goSection("#about"),
  },
  {
    id: "contact",
    group: "nav",
    icon: "lucide:at-sign",
    label: () => t("cmd.contact"),
    keywords: "contact контакты",
    run: () => goSection("#contact"),
  },
  {
    id: "blog",
    group: "nav",
    icon: "lucide:newspaper",
    label: () => t("cmd.blog"),
    keywords: "devlog blog блог",
    run: () => router.push("/blog"),
  },
  {
    id: "theme",
    group: "actions",
    icon: "lucide:sun-moon",
    label: () => t("cmd.theme"),
    keywords: "dark light тема",
    run: () => toggleTheme(),
    defer: true,
  },
  {
    id: "lang",
    group: "actions",
    icon: "lucide:languages",
    label: () => t("cmd.lang"),
    keywords: "language язык ru en",
    run: () => toggleLang(),
    defer: true,
  },
  {
    id: "discord",
    group: "actions",
    icon: "ic:baseline-discord",
    label: () => t("cmd.discord"),
    keywords: "discord ник копировать",
    run: () => copyDiscord(),
  },
  {
    id: "github",
    group: "actions",
    icon: "lucide:github",
    label: () => t("cmd.github"),
    keywords: "github код",
    run: () => window.open(gh, "_blank", "noopener"),
  },
  {
    id: "terminal",
    group: "actions",
    icon: "lucide:terminal",
    label: () => t("cmd.terminal"),
    keywords: "terminal терминал shell",
    run: () => {
      open.value = false;
      termOpen.value = true;
    },
    defer: true,
  },
];

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return commands;
  return commands.filter((c) =>
    `${c.label()} ${c.keywords ?? ""} ${c.id}`.toLowerCase().includes(q),
  );
});

const groups = computed(() =>
  [
    {
      key: "nav",
      label: t("cmd.group.nav"),
      items: filtered.value.filter((c) => c.group === "nav"),
    },
    {
      key: "actions",
      label: t("cmd.group.actions"),
      items: filtered.value.filter((c) => c.group === "actions"),
    },
  ].filter((g) => g.items.length),
);

watch(filtered, () => (active.value = 0));

function flatIndex(cmd: Cmd) {
  return filtered.value.indexOf(cmd);
}

function itemDelay(cmd: Cmd) {
  return flatIndex(cmd) * 22;
}
function headerDelay(g: { items: Cmd[] }) {
  const first = g.items[0];
  return first ? Math.max(0, flatIndex(first) * 22 - 12) : 0;
}

async function runActive() {
  const cmd = filtered.value[active.value];
  if (!cmd) return;
  if (cmd.defer) {
    open.value = false;
    window.setTimeout(() => cmd.run(), 210);
    return;
  }
  await cmd.run();
  open.value = false;
}

function onKeydown(e: KeyboardEvent) {
  const mod = e.metaKey || e.ctrlKey;
  if (mod && e.key.toLowerCase() === "k") {
    e.preventDefault();
    open.value = !open.value;
    return;
  }
  if (!open.value) return;
  const len = filtered.value.length;
  if (e.key === "Escape") {
    open.value = false;
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    active.value = len ? (active.value + 1) % len : 0;
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    active.value = len ? (active.value - 1 + len) % len : 0;
  } else if (e.key === "Enter") {
    e.preventDefault();
    runActive();
  }
}

onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));

watch(open, async (v) => {
  if (!v) return;
  query.value = "";
  active.value = 0;
  await nextTick();
  inputEl.value?.focus();
});
</script>

<template>
  <Teleport to="body">
    <Transition name="cmd">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[14vh]"
        @click.self="open = false"
      >
        <div
          class="absolute inset-0 bg-background/60 backdrop-blur-sm"
          @click="open = false"
        />
        <div
          class="cmd-panel relative w-full max-w-[560px] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/30"
        >
          <div class="flex items-center gap-3 border-b border-border px-4">
            <Icon
              name="lucide:search"
              class="text-[16px] text-muted-foreground"
            />
            <input
              ref="inputEl"
              v-model="query"
              type="text"
              :placeholder="t('cmd.placeholder')"
              class="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
            />
            <kbd
              class="hidden rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground/60 sm:block"
              >esc</kbd
            >
          </div>

          <div class="max-h-[52vh] overflow-y-auto p-2">
            <div :key="query" class="cmd-results">
              <template v-for="g in groups" :key="g.key">
                <div
                  class="cmd-row px-2 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground/50"
                  :style="{ animationDelay: headerDelay(g) + 'ms' }"
                >
                  {{ g.label }}
                </div>
                <button
                  v-for="c in g.items"
                  :key="c.id"
                  type="button"
                  class="cmd-row flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition-colors"
                  :class="
                    flatIndex(c) === active
                      ? 'bg-secondary text-foreground'
                      : 'text-foreground/80 hover:bg-secondary/60'
                  "
                  :style="{ animationDelay: itemDelay(c) + 'ms' }"
                  @mousemove="active = flatIndex(c)"
                  @click="runActive"
                >
                  <Icon
                    :name="c.icon"
                    class="text-[16px] text-muted-foreground"
                  />
                  <span>{{ c.label() }}</span>
                </button>
              </template>

              <div
                v-if="!filtered.length"
                class="cmd-row px-3 py-6 text-center text-sm text-muted-foreground"
              >
                {{ t("cmd.empty") }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.cmd-enter-active,
.cmd-leave-active {
  transition: opacity 0.2s ease;
}
.cmd-enter-from,
.cmd-leave-to {
  opacity: 0;
}
.cmd-enter-active .cmd-panel,
.cmd-leave-active .cmd-panel {
  transition:
    transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.2s ease;
}
.cmd-enter-from .cmd-panel,
.cmd-leave-to .cmd-panel {
  transform: translateY(-8px) scale(0.98);
  opacity: 0;
}

.cmd-row {
  animation: cmd-row-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes cmd-row-in {
  from {
    opacity: 0;
    transform: translateY(6px) scale(0.985);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cmd-enter-active,
  .cmd-leave-active,
  .cmd-enter-active .cmd-panel,
  .cmd-leave-active .cmd-panel,
  .cmd-row {
    transition: none;
    animation: none;
  }
}
</style>
