export type Theme = "system" | "light" | "dark";

export function useTheme() {
  const mode = useCookie<Theme>("theme", {
    default: () => "system",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });

  const isDark = useState<boolean>(
    "theme-is-dark",
    () => mode.value === "dark",
  );

  function compute(): boolean {
    if (mode.value === "system") {
      return (
        import.meta.client &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    }
    return mode.value === "dark";
  }

  function apply() {
    const dark = compute();
    isDark.value = dark;
    if (import.meta.client) {
      document.documentElement.classList.toggle("dark", dark);
    }
  }

  function set(next: Theme) {
    mode.value = next;
    apply();
  }

  function toggle() {
    set(isDark.value ? "light" : "dark");
  }

  if (import.meta.client) {
    watch(mode, apply);
    onMounted(() => {
      apply();
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const onChange = () => {
        if (mode.value === "system") apply();
      };
      mq.addEventListener("change", onChange);
      onBeforeUnmount(() => mq.removeEventListener("change", onChange));
    });
  }

  return { mode, isDark, toggle, set };
}
