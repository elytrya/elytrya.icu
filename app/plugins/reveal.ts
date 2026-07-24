export default defineNuxtPlugin((nuxtApp) => {
  let io: IntersectionObserver | null = null;

  const reduce =
    import.meta.client &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (import.meta.client && !reduce) {
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("reveal-in");
            io?.unobserve(e.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
    );
  }

  nuxtApp.vueApp.directive("reveal", {
    getSSRProps() {
      return { class: "reveal" };
    },
    mounted(el: HTMLElement, binding) {
      el.classList.add("reveal");
      if (reduce || !io) {
        el.classList.add("reveal-in");
        return;
      }
      if (typeof binding.value === "number") {
        el.style.transitionDelay = `${binding.value}ms`;
      }
      io.observe(el);
    },
    unmounted(el: HTMLElement) {
      io?.unobserve(el);
    },
  });
});
