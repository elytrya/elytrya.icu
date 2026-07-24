<script setup lang="ts">
const { locale } = useLocale();
useTheme();

useHead({
  htmlAttrs: {
    lang: locale,
  },
});
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <TheHeader />
    <main>
      <Transition name="lang" mode="out-in">
        <div :key="locale">
          <slot />
        </div>
      </Transition>
    </main>
    <AppDivider />
    <TheFooter />

    <ClientOnly>
      <CommandPalette />
      <TerminalOverlay />
    </ClientOnly>
  </div>
</template>
