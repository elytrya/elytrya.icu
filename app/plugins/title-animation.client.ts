export default defineNuxtPlugin(() => {
  const route = useRoute();
  const text = "elytrya.icu";
  const caret = "▌";

  let timer: ReturnType<typeof setTimeout> | undefined;
  let running = false;

  const reduced = () =>
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  function stop() {
    running = false;
    if (timer) clearTimeout(timer);
    timer = undefined;
  }

  function start() {
    if (running) return;
    running = true;

    if (reduced()) {
      document.title = text;
      return;
    }

    let i = 0;
    let phase: "typing" | "holding" | "deleting" = "typing";
    let blink = 0;

    const tick = () => {
      if (!running) return;
      if (phase === "typing") {
        i++;
        document.title = text.slice(0, i) + caret;
        if (i >= text.length) {
          phase = "holding";
          blink = 0;
        }
        timer = setTimeout(tick, 130);
      } else if (phase === "holding") {
        blink++;
        document.title = text + (blink % 2 ? "" : caret);
        if (blink >= 8) phase = "deleting";
        timer = setTimeout(tick, 420);
      } else {
        i--;
        document.title = text.slice(0, Math.max(0, i)) + caret;
        if (i <= 0) {
          phase = "typing";
          timer = setTimeout(tick, 500);
          return;
        }
        timer = setTimeout(tick, 70);
      }
    };
    tick();
  }

  watch(
    () => route.path,
    (path) => {
      if (path === "/") start();
      else stop();
    },
    { immediate: true },
  );
});
