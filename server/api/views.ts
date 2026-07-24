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
  if (url)
    tcp = new IORedis(url, { maxRetriesPerRequest: 3, lazyConnect: false });
  return tcp;
}

const TOTAL_KEY = "views:total";
const UNIQUE_SET = "views:unique_set";

export default defineEventHandler(async (event) => {
  let vid = getCookie(event, "elytrya_vid");
  if (!vid) {
    vid =
      globalThis.crypto?.randomUUID?.() ??
      Math.random().toString(36).slice(2) + Date.now().toString(36);
    setCookie(event, "elytrya_vid", vid, {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      sameSite: "lax",
    });
  }

  setHeader(event, "cache-control", "no-store");

  const restClient = getRest();
  if (restClient) {
    const total = await restClient.incr(TOTAL_KEY);
    await restClient.sadd(UNIQUE_SET, vid);
    const unique = await restClient.scard(UNIQUE_SET);
    return { total, unique };
  }

  const tcpClient = getTcp();
  if (tcpClient) {
    const total = await tcpClient.incr(TOTAL_KEY);
    await tcpClient.sadd(UNIQUE_SET, vid);
    const unique = await tcpClient.scard(UNIQUE_SET);
    return { total, unique };
  }

  const storage = useStorage("db");
  let total = (await storage.getItem<number>(TOTAL_KEY)) ?? 0;
  total += 1;
  await storage.setItem(TOTAL_KEY, total);

  const ids = (await storage.getItem<string[]>("views:unique_ids")) ?? [];
  if (!ids.includes(vid)) {
    ids.push(vid);
    await storage.setItem("views:unique_ids", ids);
  }

  return { total, unique: ids.length };
});
