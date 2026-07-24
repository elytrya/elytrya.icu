import { Redis } from "@upstash/redis";

let redis: Redis | null = null;
let redisChecked = false;

function getRedis(): Redis | null {
  if (redisChecked) return redis;
  redisChecked = true;
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    redis = new Redis({ url, token });
  }
  return redis;
}

export default defineEventHandler(async (event) => {
  const isNewVisitor = !getCookie(event, "elytrya_vid");
  if (isNewVisitor) {
    const id =
      globalThis.crypto?.randomUUID?.() ??
      Math.random().toString(36).slice(2) + Date.now().toString(36);
    setCookie(event, "elytrya_vid", id, {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      sameSite: "lax",
    });
  }

  setHeader(event, "cache-control", "no-store");

  const client = getRedis();
  if (client) {
    const total = await client.incr("views:total");
    const unique = isNewVisitor
      ? await client.incr("views:unique")
      : ((await client.get<number>("views:unique")) ?? 0);
    return { total, unique };
  }

  const storage = useStorage("db");
  let total = (await storage.getItem<number>("views:total")) ?? 0;
  total += 1;
  await storage.setItem("views:total", total);

  let unique = (await storage.getItem<number>("views:unique")) ?? 0;
  if (isNewVisitor) {
    unique += 1;
    await storage.setItem("views:unique", unique);
  }

  return { total, unique };
});
