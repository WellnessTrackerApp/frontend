import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { enUS, pl } from "date-fns/locale";

import enLng from "./locales/en/en.json";
import plLng from "./locales/pl/pl.json";
import { format } from "date-fns";

export type SupportedLanguage = "pl" | "en";

const resources = {
  en: {
    translation: enLng,
  },
  pl: {
    translation: plLng,
  },
};

const savedLng = localStorage.getItem("language") || "en";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: "en",
    lng: savedLng,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

i18n.services.formatter?.add("date", (value, lng, options) => {
  if (value instanceof Date) {
    const locale = lng === "pl" ? pl : enUS;
    return format(value, options.fmt || "dd.MM.yyyy", { locale });
  }
  return value;
});

export default i18n;
