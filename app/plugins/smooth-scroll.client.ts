export default defineNuxtPlugin(() => {
  if (import.meta.server) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const coarse = window.matchMedia("(pointer: coarse)");
  if (reduce.matches || coarse.matches) return;

  const ease = 0.09;
  let target = window.scrollY;
  let current = window.scrollY;
  let running = false;
  let raf = 0;

  const maxScroll = () =>
    Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const clamp = (v: number) => Math.max(0, Math.min(v, maxScroll()));

  function loop() {
    current += (target - current) * ease;
    if (Math.abs(target - current) < 0.4) {
      current = target;
      running = false;
      window.scrollTo(0, Math.round(current));
      return;
    }
    window.scrollTo(0, current);
    raf = requestAnimationFrame(loop);
  }

  function onWheel(e: WheelEvent) {
    if (e.ctrlKey) return;
    if (e.deltaMode !== 0) return;
    e.preventDefault();
    if (!running) current = target = window.scrollY;
    target = clamp(target + e.deltaY);
    if (!running) {
      running = true;
      raf = requestAnimationFrame(loop);
    }
  }

  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("resize", () => {
    target = clamp(target);
  });

  if (reduce.addEventListener) {
    reduce.addEventListener("change", (ev) => {
      if (ev.matches) {
        cancelAnimationFrame(raf);
        running = false;
        window.removeEventListener("wheel", onWheel);
      }
    });
  }
});
