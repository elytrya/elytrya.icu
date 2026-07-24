export function useTerminal() {
  const open = useState<boolean>("terminal-open", () => false);
  return { open };
}
