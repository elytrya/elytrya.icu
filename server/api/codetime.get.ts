export default defineEventHandler(async (event) => {
  const cfg = useRuntimeConfig(event).public;
  const url = (cfg.codetimeEndpoint || cfg.codetimeShield) as string;
  try {
    const data = await $fetch<{ message?: string } | string>(url, {
      headers: { accept: "application/json" },
    });
    const message = typeof data === "string" ? data : (data?.message ?? null);
    setHeader(event, "cache-control", "public, max-age=300");
    return { message };
  } catch {
    return { message: null };
  }
});
