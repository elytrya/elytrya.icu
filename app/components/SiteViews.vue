<script setup lang="ts">
const { t } = useLocale();
const { total, unique } = useViews();

const totalFmt = computed(() =>
  total.value == null ? "" : total.value.toLocaleString("en-US"),
);
const uniqueFmt = computed(() =>
  unique.value == null ? "" : unique.value.toLocaleString("en-US"),
);
</script>

<template>
  <span
    v-if="total !== null"
    class="inline-flex items-center gap-3 tabular-nums"
  >
    <span class="inline-flex items-center gap-1.5">
      <Icon name="lucide:eye" class="text-[13px]" />
      {{ totalFmt }} {{ t("views.label") }}
    </span>
    <span
      v-if="unique !== null"
      class="inline-flex items-center gap-1.5 text-muted-foreground/70"
    >
      <Icon name="lucide:user-round" class="text-[13px]" />
      {{ uniqueFmt }} {{ t("views.unique") }}
    </span>
  </span>
</template>
