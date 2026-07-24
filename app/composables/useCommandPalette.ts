export function useCommandPalette() {
  const open = useState<boolean>("cmdk-open", () => false);
  return { open };
}
