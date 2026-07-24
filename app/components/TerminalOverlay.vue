<script setup lang="ts">
const { open } = useTerminal();
const { projects } = useProjects();
const { toggle: toggleTheme, set: setTheme, isDark } = useTheme();
const router = useRouter();
const gh = `https://github.com/${useRuntimeConfig().public.githubUser}`;

type LineType = "in" | "out" | "err" | "sys" | "accent" | "muted";
type Line = { type: LineType; text: string };
const lines = ref<Line[]>([]);
const input = ref("");
const inputEl = ref<HTMLInputElement | null>(null);
const bodyEl = ref<HTMLElement | null>(null);
const history = ref<string[]>([]);
const busy = ref(false);
let hIdx = -1;

const banner = [
  { type: "accent" as const, text: "elytrya - interactive shell  v2.0" },
  {
    type: "muted" as const,
    text: "type 'help' for commands · tab to autocomplete · 'exit' to close",
  },
];

function print(text: string, type: LineType = "out") {
  lines.value.push({ type, text });
}

function scrollBottom() {
  nextTick(() => {
    if (bodyEl.value) bodyEl.value.scrollTop = bodyEl.value.scrollHeight;
  });
}

type Command = {
  desc: string;
  hidden?: boolean;
  run: (args: string[]) => void;
};

const commands: Record<string, Command> = {
  help: {
    desc: "show this list",
    run() {
      print("available commands", "sys");
      const visible = Object.entries(commands).filter(([, c]) => !c.hidden);
      for (const [name, c] of visible) {
        print(`  ${name.padEnd(11)}${c.desc}`);
      }
      print("there might be a few hidden ones too …", "muted");
    },
  },
  whoami: {
    desc: "who is elytrya",
    run() {
      print("elytrya - developer from russia.", "accent");
      print("i build telegram bots, clis and minecraft mods.");
      print("mostly python, java & typescript. creator of onevnl.");
    },
  },
  about: {
    desc: "a little neofetch-style card",
    run() {
      const info = [
        ["user", "elytrya"],
        ["role", "bots · tools · mods"],
        ["stack", "python · java · typescript"],
        ["theme", isDark.value ? "dark" : "light"],
        ["projects", String((projects.value ?? []).length)],
        ["web", "elytrya.icu"],
      ];
      const art = ["   /\\_/\\  ", "  ( o.o ) ", "   > ^ <  "];
      const max = Math.max(info.length, art.length);
      for (let i = 0; i < max; i++) {
        const a = (art[i] ?? "          ").padEnd(10);
        const kv = info[i] ? `${info[i]![0].padEnd(9)} ${info[i]![1]}` : "";
        print(`${a}${kv}`, i < art.length ? "accent" : "out");
      }
    },
  },
  projects: {
    desc: "list my projects",
    run() {
      const list = projects.value ?? [];
      if (!list.length) {
        print("no projects loaded.", "err");
        return;
      }
      for (const p of list) {
        const stars = p.stars ? `  ★ ${p.stars}` : "";
        print(`  ${p.name.padEnd(16)} ${p.url}${stars}`);
      }
      print("tip: 'open <name>' to jump to a project page", "muted");
    },
  },
  open: {
    desc: "open a project page (open <name>)",
    run(args) {
      const name = (args[0] || "").toLowerCase();
      if (!name) {
        print("usage: open <project-name>", "err");
        return;
      }
      const list = projects.value ?? [];
      const match = list.find((p) => p.name.toLowerCase() === name);
      if (!match) {
        print(`no project named '${name}'. try 'projects'.`, "err");
        return;
      }
      print(`opening ${match.name} …`, "sys");
      open.value = false;
      router.push(`/projects/${match.name}`);
    },
  },
  contact: {
    desc: "how to reach me",
    run() {
      print("discord  elytrya__");
      print(`github   ${gh}`);
    },
  },
  social: {
    desc: "my links",
    run() {
      print(`github   ${gh}`);
      print("discord  https://discord.com/users/elytrya__");
      print("web      https://elytrya.icu");
    },
  },
  github: {
    desc: "open my github",
    run() {
      print("opening github …", "sys");
      window.open(gh, "_blank", "noopener");
    },
  },
  theme: {
    desc: "toggle theme (theme dark|light)",
    run(args) {
      const a = (args[0] || "").toLowerCase();
      if (a === "dark" || a === "light") {
        setTheme(a);
        print(`theme -> ${a}`, "sys");
      } else {
        toggleTheme();
        print("theme toggled", "sys");
      }
    },
  },
  echo: {
    desc: "print some text",
    run(args) {
      print(args.join(" ") || "");
    },
  },
  date: {
    desc: "current date & time",
    run() {
      print(new Date().toString());
    },
  },
  history: {
    desc: "show command history",
    run() {
      if (!history.value.length) {
        print("no history yet.", "muted");
        return;
      }
      history.value.forEach((h, i) =>
        print(`  ${String(i + 1).padStart(3)}  ${h}`),
      );
    },
  },
  blog: {
    desc: "open the devlog",
    run() {
      print("opening /blog …", "sys");
      open.value = false;
      router.push("/blog");
    },
  },
  clear: {
    desc: "clear the screen",
    run() {
      lines.value = [];
    },
  },
  exit: {
    desc: "close the terminal",
    run() {
      open.value = false;
    },
  },

  sudo: {
    desc: "",
    hidden: true,
    run(args) {
      const cmd = args.join(" ");
      print(
        `elytrya is not in the sudoers file. this incident will be reported.${cmd ? ` (${cmd})` : ""}`,
        "err",
      );
    },
  },
  coffee: {
    desc: "",
    hidden: true,
    run() {
      [
        "      ( (",
        "       ) )",
        "    ........",
        "    |      |]",
        "    \\      /",
        "     `----'",
        "brewing … ☕  stay caffeinated.",
      ].forEach((l) => print(l, "accent"));
    },
  },
  matrix: {
    desc: "",
    hidden: true,
    run() {
      const chars = "01アカサタナハマヤラワン";
      for (let r = 0; r < 6; r++) {
        let row = "";
        for (let c = 0; c < 42; c++) {
          row += chars[Math.floor(Math.random() * chars.length)];
        }
        print(row, "accent");
      }
      print("wake up, elytrya …", "muted");
    },
  },
  hack: {
    desc: "",
    hidden: true,
    run() {
      const steps = [
        "initializing exploit …",
        "bypassing firewall …",
        "accessing mainframe …",
        "downloading the internet …",
        "just kidding :) never trust a fake hacker terminal.",
      ];
      busy.value = true;
      steps.forEach((s, i) =>
        setTimeout(() => {
          print(s, i === steps.length - 1 ? "sys" : "muted");
          scrollBottom();
          if (i === steps.length - 1) busy.value = false;
        }, i * 420),
      );
    },
  },
  crt: {
    desc: "toggle retro crt mode (crt on|off)",
    run(args) {
      const root = document.documentElement;
      const a = (args[0] || "").toLowerCase();
      const on =
        a === "on"
          ? true
          : a === "off"
            ? false
            : !root.classList.contains("crt-mode");
      root.classList.toggle("crt-mode", on);
      if (on) {
        print("crt / retro mode engaged. welcome to 1984.", "accent");
        print("run 'crt off' to go back to the future.", "muted");
      } else {
        print("crt mode disabled.", "sys");
      }
    },
  },
};

const commandNames = Object.keys(commands);

function run(raw: string) {
  const cmd = raw.trim();
  print(`❯ ${cmd}`, "in");
  if (!cmd) return;
  history.value.push(cmd);
  hIdx = history.value.length;
  const [name, ...args] = cmd.split(/\s+/);
  const key = name.toLowerCase();
  const entry = commands[key];
  if (entry) {
    entry.run(args);
    return;
  }
  print(`command not found: ${name}`, "err");
  const near = commandNames.find(
    (n) => !commands[n]!.hidden && (n.startsWith(key) || key.startsWith(n)),
  );
  if (near) print(`did you mean '${near}'?`, "muted");
  else print("type 'help' to see what's available.", "muted");
}

function submit() {
  if (busy.value) return;
  run(input.value);
  input.value = "";
  scrollBottom();
}

function complete() {
  const q = input.value.trim().toLowerCase();
  if (!q || q.includes(" ")) return;
  const matches = commandNames.filter(
    (n) => !commands[n]!.hidden && n.startsWith(q),
  );
  if (!matches.length) return;
  if (matches.length === 1) {
    input.value = matches[0]!;
    return;
  }
  let prefix = matches[0]!;
  for (const m of matches) {
    while (!m.startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  if (prefix.length > q.length) input.value = prefix;
  print(`❯ ${q}`, "in");
  print(matches.join("   "), "muted");
  scrollBottom();
}

function onInputKey(e: KeyboardEvent) {
  if (e.key === "Tab") {
    e.preventDefault();
    complete();
  } else if (e.key === "l" && e.ctrlKey) {
    e.preventDefault();
    lines.value = [];
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    if (hIdx > 0) {
      hIdx--;
      input.value = history.value[hIdx] ?? "";
    }
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    if (hIdx < history.value.length - 1) {
      hIdx++;
      input.value = history.value[hIdx] ?? "";
    } else {
      hIdx = history.value.length;
      input.value = "";
    }
  }
}

function onGlobalKey(e: KeyboardEvent) {
  const el = e.target as HTMLElement | null;
  const typing =
    !!el &&
    (el.tagName === "INPUT" ||
      el.tagName === "TEXTAREA" ||
      el.isContentEditable);
  if (e.key === "`" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
    e.preventDefault();
    open.value = !open.value;
  } else if (e.key === "Escape" && open.value) {
    open.value = false;
  }
}

onMounted(() => window.addEventListener("keydown", onGlobalKey));
onBeforeUnmount(() => window.removeEventListener("keydown", onGlobalKey));

watch(open, async (v) => {
  if (!v) return;
  if (!lines.value.length) banner.forEach((b) => print(b.text, b.type));
  await nextTick();
  inputEl.value?.focus();
  scrollBottom();
});
</script>

<template>
  <Teleport to="body">
    <Transition name="term">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
        @click.self="open = false"
      >
        <div
          class="absolute inset-0 bg-background/60 backdrop-blur-sm"
          @click="open = false"
        />
        <div
          class="term-panel relative flex h-[58vh] w-full max-w-[600px] flex-col overflow-hidden rounded-xl border border-border bg-card font-mono text-[13px] text-foreground/85 shadow-2xl shadow-black/30"
          @click="inputEl?.focus()"
        >
          <div
            class="flex items-center gap-2 border-b border-border px-4 py-2.5"
          >
            <span class="text-brand">❯_</span>
            <span class="text-[11px] tracking-[0.08em] text-muted-foreground/70"
              >elytrya - shell</span
            >
            <button
              type="button"
              class="ml-auto text-muted-foreground/60 transition-colors hover:text-foreground"
              aria-label="close"
              @click="open = false"
            >
              <Icon name="lucide:x" class="text-[15px]" />
            </button>
          </div>

          <div
            ref="bodyEl"
            class="thin-scroll flex-1 overflow-y-auto px-4 py-3 leading-relaxed"
          >
            <p
              v-for="(l, i) in lines"
              :key="i"
              class="term-line whitespace-pre-wrap break-words"
              :class="{
                'text-brand': l.type === 'in',
                'text-rose-400': l.type === 'err',
                'text-foreground/70': l.type === 'out',
                'font-semibold text-brand': l.type === 'accent',
                'text-sky-400': l.type === 'sys',
                'text-muted-foreground/60': l.type === 'muted',
              }"
            >
              {{ l.text }}
            </p>

            <div class="flex items-center gap-2">
              <span class="text-brand">❯</span>
              <input
                ref="inputEl"
                v-model="input"
                type="text"
                autocomplete="off"
                autocapitalize="off"
                spellcheck="false"
                :disabled="busy"
                class="term-caret w-full bg-transparent caret-brand outline-none disabled:opacity-50"
                @keydown="onInputKey"
                @keydown.enter.prevent="submit"
              />
            </div>
          </div>

          <div
            class="flex items-center gap-3 border-t border-border px-4 py-1.5 text-[10px] tracking-[0.06em] text-muted-foreground/50"
          >
            <span><kbd>tab</kbd> complete</span>
            <span><kbd>↑↓</kbd> history</span>
            <span><kbd>ctrl+l</kbd> clear</span>
            <span class="ml-auto"><kbd>esc</kbd> close</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
kbd {
  border-radius: 4px;
  border: 1px solid hsl(var(--border));
  padding: 0 4px;
  font-family: inherit;
}

.term-enter-active,
.term-leave-active {
  transition: opacity 0.2s ease;
}
.term-enter-from,
.term-leave-to {
  opacity: 0;
}
.term-enter-active .term-panel,
.term-leave-active .term-panel {
  transition:
    transform 0.22s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.22s ease;
}
.term-enter-from .term-panel,
.term-leave-to .term-panel {
  transform: translateY(12px) scale(0.98);
  opacity: 0;
}

.term-line {
  animation: term-line-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes term-line-in {
  from {
    opacity: 0;
    transform: translateX(-5px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .term-enter-active,
  .term-leave-active,
  .term-enter-active .term-panel,
  .term-leave-active .term-panel,
  .term-line {
    transition: none;
    animation: none;
  }
}
</style>
