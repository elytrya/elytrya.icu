export function useCodetime() {
  const display = ref("");
  const loaded = ref(false);
  const failed = ref(false);

  const CACHE_KEY = "codetime:cache";
  const CACHE_TTL = 90_000;

  let raf = 0;
  let baseMs = 0;
  let startPerf = 0;

  function parseToMs(msg: string): number {
    let total = 0;
    let found = false;
    const re =
      /([\d.,]+)\s*(days?|hrs?|hours?|mins?|minutes?|secs?|seconds?|[dhms])/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(msg)) !== null) {
      const n = parseFloat(m[1].replace(/,/g, ""));
      if (Number.isNaN(n)) continue;
      found = true;
      const u = m[2].toLowerCase();
      if (u.startsWith("d")) total += n * 86_400_000;
      else if (u.startsWith("h")) total += n * 3_600_000;
      else if (u.startsWith("s")) total += n * 1_000;
      else total += n * 60_000;
    }
    if (!found) {
      const n = parseFloat(msg.replace(/[^\d.]/g, ""));
      if (!Number.isNaN(n)) total = n * 3_600_000;
    }
    return total;
  }

  function fmt(ms: number): string {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const mm = String(Math.floor(totalSec / 60) % 60).padStart(2, "0");
    const ss = String(totalSec % 60).padStart(2, "0");
    const mmm = String(Math.floor(ms % 1000)).padStart(3, "0");
    return `${h}h ${mm}m ${ss}s ${mmm}ms`;
  }

  function loop() {
    display.value = fmt(baseMs + (performance.now() - startPerf));
    raf = requestAnimationFrame(loop);
  }

  function readCache(): boolean {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return false;
      const cached = JSON.parse(raw) as { baseMs: number; at: number };
      const age = Date.now() - cached.at;
      if (age >= 0 && age < CACHE_TTL && cached.baseMs > 0) {
        baseMs = cached.baseMs + age;
        return true;
      }
    } catch {}
    return false;
  }

  function writeCache() {
    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ baseMs, at: Date.now() }),
      );
    } catch {}
  }

  onMounted(async () => {
    const usedCache = readCache();

    if (!usedCache) {
      try {
        const res = await $fetch<{ message?: string | null }>("/api/codetime");
        if (res && res.message) {
          baseMs = parseToMs(res.message);
          writeCache();
        } else {
          failed.value = true;
        }
      } catch {
        failed.value = true;
      }
    }

    if (failed.value && baseMs === 0) {
      display.value = "-";
    } else {
      startPerf = performance.now();
      loop();
    }
    loaded.value = true;
  });

  onBeforeUnmount(() => cancelAnimationFrame(raf));

  return { display, loaded, failed };
}
