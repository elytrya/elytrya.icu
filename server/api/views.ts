export default defineEventHandler(async (event) => {
  const storage = useStorage("db");

  let total = (await storage.getItem<number>("views:total")) ?? 0;
  total += 1;
  await storage.setItem("views:total", total);

  let unique = (await storage.getItem<number>("views:unique")) ?? 0;
  const existing = getCookie(event, "elytrya_vid");
  if (!existing) {
    unique += 1;
    await storage.setItem("views:unique", unique);
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
  return { total, unique };
});
