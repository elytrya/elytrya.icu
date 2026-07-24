export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxtjs/tailwindcss",
    "@nuxt/content",
  ],

  components: [{ path: "~/components", pathPrefix: false }],

  tailwindcss: {
    cssPath: ["~/assets/css/tailwind.css", { injectPosition: "first" }],
    configPath: "tailwind.config.ts",
  },

  icon: {
    mode: "css",
    cssLayer: "base",
  },

  image: {
    provider: "passthrough",
    providers: {
      passthrough: {
        provider: "~/providers/passthrough.ts",
      },
    },
    domains: ["github.com", "avatars.githubusercontent.com"],
  },

  content: {
    experimental: { nativeSqlite: true },
  },

  nitro: {
    storage: {
      db: { driver: "fs", base: "./.data/db" },
      cache: { driver: "fs", base: "./.data/cache" },
    },
  },

  runtimeConfig: {
    githubToken: "",
    public: {
      githubUser: "elytrya",
      siteUrl: "https://elytrya.icu",
      repoUrl: "https://github.com/elytrya/elytrya.icu",
      codetimeEndpoint: "https://codetime.dev/v3/users/shield?uid=25338",
      codetimeShield:
        "https://shields.jannchie.com/endpoint?style=flat&color=0284c7&url=https%3A%2F%2Fcodetime.dev%2Fv3%2Fusers%2Fshield%3Fuid%3D25338",
    },
  },

  app: {
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "page", mode: "out-in" },
    head: {
      title: "elytrya - bots, tools & mods",
      htmlAttrs: { lang: "en" },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "elytrya - developer from russia building telegram bots, clis and minecraft mods. creator of onevnl.",
        },
        { name: "theme-color", content: "#0f1315" },
        { property: "og:title", content: "elytrya - bots, tools & mods" },
        {
          property: "og:description",
          content:
            "developer building bots, tools and mods that do the boring parts.",
        },
        { property: "og:type", content: "website" },
      ],
      script: [
        {
          innerHTML:
            "(function(){try{var m=document.cookie.match(/(?:^|; )theme=([^;]+)/);var t=m?decodeURIComponent(m[1]):'system';var d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();",
          tagPosition: "head",
        },
      ],
      link: [
        { rel: "icon", href: "/favicon.ico" },
        {
          rel: "alternate",
          type: "application/rss+xml",
          title: "elytrya - devlog",
          href: "/rss.xml",
        },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap",
        },
      ],
    },
  },
});
