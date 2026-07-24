import { Redis as UpstashRedis } from "@upstash/redis";
import IORedis from "ioredis";

let rest: UpstashRedis | null = null;
let restChecked = false;
function getRest(): UpstashRedis | null {
  if (restChecked) return rest;
  restChecked = true;
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) rest = new UpstashRedis({ url, token });
  return rest;
}

let tcp: IORedis | null = null;
let tcpChecked = false;
function getTcp(): IORedis | null {
  if (tcpChecked) return tcp;
  tcpChecked = true;
  const url = process.env.REDIS_URL || process.env.KV_URL;
  if (url) {
    tcp = new IORedis(url, {
      maxRetriesPerRequest: 3,
      lazyConnect: false,
    });
  }
  return tcp;
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

  const restClient = getRest();
  if (restClient) {
    const total = await restClient.incr("views:total");
    const unique = isNewVisitor
      ? await restClient.incr("views:unique")
      : ((await restClient.get<number>("views:unique")) ?? 0);
    return { total, unique };
  }

  const tcpClient = getTcp();
  if (tcpClient) {
    const total = await tcpClient.incr("views:total");
    const unique = isNewVisitor
      ? await tcpClient.incr("views:unique")
      : Number((await tcpClient.get("views:unique")) ?? 0);
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
