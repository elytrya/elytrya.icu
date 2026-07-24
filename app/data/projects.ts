export type Project = {
  name: string;
  description: string;
  language?: string;
  stars?: number;
  url: string;
  tags?: string[];
  featured?: boolean;
};

export const projects: Project[] = [
  {
    name: "mahiru-ai",
    description:
      "a “living” virtual girl in telegram - own personality, memory and moods. talks anime, manga & games, downloads chapters and checks steam prices.",
    language: "Python",
    stars: 1,
    url: "https://github.com/elytrya/mahiru-ai",
    tags: ["ai", "telegram", "python"],
    featured: true,
  },
  {
    name: "lib-downloader",
    description:
      "cli tool to download manga, manhwa and light-novel chapters from the mangalib.me family of sites.",
    language: "Python",
    stars: 1,
    url: "https://github.com/elytrya/lib-downloader",
    tags: ["cli", "python"],
  },
  {
    name: "BoostyBridge",
    description:
      "minecraft server plugin that integrates with boosty - auto-grants perks and rewards to players who subscribe.",
    language: "Java",
    stars: 5,
    url: "https://github.com/elytrya/BoostyBridge",
    tags: ["minecraft", "java"],
    featured: true,
  },
  {
    name: "Musicly",
    description:
      "client-server minecraft mod to play music from spotify, youtube, soundcloud & yandex music in-game. streams, tts and multi-format audio.",
    stars: 1,
    url: "https://github.com/elytrya/Musicly",
    tags: ["minecraft", "audio"],
  },
  {
    name: "Elytrya",
    description:
      "about me - the profile repo and home base for links, identity and the elytrya.icu presence.",
    stars: 0,
    url: "https://github.com/elytrya/Elytrya",
    tags: ["profile"],
  },
  {
    name: "WedexClient",
    description:
      "a client project - part of the ongoing tooling and experiments across the elytrya ecosystem.",
    stars: 0,
    url: "https://github.com/elytrya/WedexClient",
    tags: ["client"],
  },
];

export const excludedRepos: string[] = ["Elytrya", "WedexClient"];