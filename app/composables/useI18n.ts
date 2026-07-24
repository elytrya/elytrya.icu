import { messages, type Locale, type MsgKey } from "~/data/i18n";

export function useLocale() {
  const locale = useCookie<Locale>("locale", {
    default: () => "en",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });

  const setLocale = (l: Locale) => {
    locale.value = l;
  };
  const toggle = () => setLocale(locale.value === "ru" ? "en" : "ru");

  const t = (key: MsgKey): string =>
    messages[locale.value]?.[key] ?? messages.en[key] ?? key;

  return { locale, setLocale, toggle, t };
}
