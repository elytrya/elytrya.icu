export function useViews() {
  const total = ref<number | null>(null);
  const unique = ref<number | null>(null);

  onMounted(async () => {
    try {
      const res = await $fetch<{ total: number; unique: number }>("/api/views");
      total.value = res.total;
      unique.value = res.unique;
    } catch {
      total.value = null;
      unique.value = null;
    }
  });

  return { total, unique };
}
