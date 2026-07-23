import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import az from "./locales/az.json";
import en from "./locales/en.json";

function readableFallback(key: string) {
  const leaf = key.split(".").pop() ?? key;
  return leaf
    .replace(/([A-Z])/g, " $1")
    .replace(/[-_]/g, " ")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

i18n.use(initReactI18next).init({
  resources: { az: { translation: az }, en: { translation: en } },
  lng: "az",
  fallbackLng: "en",
  supportedLngs: ["az", "en"],
  cleanCode: true,
  lowerCaseLng: true,
  interpolation: { escapeValue: false },
  returnNull: false,
  returnEmptyString: false,
  missingKeyNoValueFallbackToKey: false,
  parseMissingKeyHandler: readableFallback,
});


if (typeof window !== "undefined") {
  i18n.on("languageChanged", (lng) => {
    window.localStorage.setItem("agentix-lang", lng);
    document.documentElement.lang = lng;
  });
  document.documentElement.lang = i18n.language;
}

export default i18n;
