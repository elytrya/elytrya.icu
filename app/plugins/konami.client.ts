export default defineNuxtPlugin(() => {
  if (import.meta.server) return;

  const sequence = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ];
  let idx = 0;
  let active = false;

  const reduced = () =>
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const colors = [
    "hsl(var(--brand))",
    "#22c55e",
    "#38bdf8",
    "#eab308",
    "#f472b6",
    "#a855f7",
  ];

  function rain(count = 90) {
    for (let i = 0; i < count; i++) {
      const bit = document.createElement("span");
      bit.className = "confetti-rain";
      bit.style.left = `${Math.random() * 100}vw`;
      bit.style.background = colors[i % colors.length]!;
      const dur = 2.4 + Math.random() * 2.2;
      bit.style.animationDuration = `${dur}s`;
      bit.style.animationDelay = `${Math.random() * 1.2}s`;
      bit.style.opacity = `${0.7 + Math.random() * 0.3}`;
      if (Math.random() > 0.5) bit.style.borderRadius = "9999px";
      document.body.appendChild(bit);
      setTimeout(() => bit.remove(), (dur + 1.4) * 1000);
    }
  }

  function toast(text: string) {
    const el = document.createElement("div");
    el.className = "egg-toast";
    el.textContent = text;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }

  function fire() {
    if (active) return;
    active = true;
    if (!reduced()) {
      rain();
      const root = document.documentElement;
      root.classList.add("party-mode");
      setTimeout(() => root.classList.remove("party-mode"), 8000);
    }
    setTimeout(() => (active = false), 8000);
  }

  function onKey(e: KeyboardEvent) {
    const el = e.target as HTMLElement | null;
    const typing =
      !!el &&
      (el.tagName === "INPUT" ||
        el.tagName === "TEXTAREA" ||
        el.isContentEditable);
    if (typing) return;
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === sequence[idx]) {
      idx++;
      if (idx === sequence.length) {
        idx = 0;
        fire();
      }
    } else {
      idx = key === sequence[0] ? 1 : 0;
    }
  }

  window.addEventListener("keydown", onKey);
});
