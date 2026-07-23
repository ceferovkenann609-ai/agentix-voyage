import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import az from "./locales/az.json";
import en from "./locales/en.json";

const stored =
  typeof window !== "undefined" ? window.localStorage.getItem("agentix-lang") : null;

i18n.use(initReactI18next).init({
  resources: { az: { translation: az }, en: { translation: en } },
  lng: stored ?? "az",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  returnNull: false,
  returnEmptyString: false,
  parseMissingKeyHandler: (key) => {
    const leaf = key.split(".").pop() ?? key;
    return leaf.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()).trim();
  },
});


if (typeof window !== "undefined") {
  i18n.on("languageChanged", (lng) => {
    window.localStorage.setItem("agentix-lang", lng);
    document.documentElement.lang = lng;
  });
  document.documentElement.lang = i18n.language;
}

export default i18n;
