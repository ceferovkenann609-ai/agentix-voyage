import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { LegalPage, type LegalSection } from "../components/site/LegalPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Agentix" },
      { name: "description", content: "How Agentix collects, uses, and protects your data across our AI automation services." },
      { property: "og:title", content: "Privacy Policy — Agentix" },
      { property: "og:description", content: "How Agentix collects, uses, and protects your data across our AI automation services." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrivacyPage,
});

const AZ: LegalSection[] = [
  {
    heading: "Topladığımız məlumatlar",
    body: [
      "Xidmətlərimizdən istifadə etdiyiniz zaman iki əsas kateqoriyada məlumat toplayırıq: bilavasitə təqdim etdiyiniz məlumatlar (ad, e-poçt, şirkət adı, telefon nömrəsi, mesaj mətni, demo sorğuları) və avtomatik toplanan texniki məlumatlar (IP ünvanı, brauzer tipi, cihaz məlumatları, səhifə baxışları, sessiya müddəti).",
      "AI agentlərini konfiqurasiya edərkən müştəri kontekstindəki sənədlər, məhsul kataloqları və inteqrasiya açarları yalnız sizin yönləndirməniz əsasında emal olunur.",
    ],
  },
  {
    heading: "Kukilər (Cookies) və izləmə",
    body: [
      "Sayt işini təmin etmək üçün zəruri kukilərdən, tərcih kukilərindən (dil seçimi kimi) və anonimləşdirilmiş analitika kukilərindən istifadə edirik.",
      "Brauzer parametrlərindən kukiləri istənilən vaxt söndürə bilərsiniz; bu halda saytın bəzi funksiyaları məhdudlaşa bilər.",
    ],
  },
  {
    heading: "Məlumatların istifadəsi",
    body: [
      "Topladığımız məlumatlardan xidmətləri təqdim etmək və təkmilləşdirmək, sorğularınıza cavab vermək, təhlükəsizlik və fırıldaqçılığın qarşısını almaq, qanuni öhdəliklərimizi yerinə yetirmək üçün istifadə edirik.",
      "Şəxsi məlumatlarınızı üçüncü tərəflərə satmırıq. Yalnız etibarlı emalçılar (host, e-poçt, analitika) ilə müqavilə əsasında paylaşırıq.",
    ],
  },
  {
    heading: "İstifadəçi hüquqları",
    body: [
      "Sizin haqqınızda saxladığımız məlumatlara giriş tələb etmək, düzəliş, silinmə, emalın məhdudlaşdırılması və məlumatların köçürülməsi hüquqlarınız var.",
      "GDPR, Azərbaycan Respublikası Şəxsi Məlumatlar Qanunu və digər aidiyyəti tənzimləmələr çərçivəsində sorğuları 30 gün ərzində cavablandırırıq.",
    ],
  },
  {
    heading: "Məlumatların saxlanılması və təhlükəsizlik",
    body: [
      "Məlumatlar ən aşağı zəruri müddət ərzində saxlanılır. Ötürmə zamanı TLS 1.2+, saxlanma zamanı AES-256 şifrələmə tətbiq olunur.",
      "Rol əsaslı giriş, iki mərhələli autentifikasiya və audit qeydləri ilə daxili girişi məhdudlaşdırırıq.",
    ],
  },
  {
    heading: "Əlaqə",
    body: [
      "Bu siyasət və ya məlumatlarınız barədə hər hansı sual üçün hello@agentix.ai ünvanı ilə əlaqə saxlayın. Sorğunuza 5 iş günü ərzində cavab veririk.",
    ],
  },
];

const EN: LegalSection[] = [
  {
    heading: "Information we collect",
    body: [
      "We collect two categories of information when you use our services: information you provide directly (name, email, company, phone number, message content, demo requests) and technical information collected automatically (IP address, browser type, device details, page views, session duration).",
      "When configuring AI agents, documents, product catalogs and integration keys inside your customer context are processed only under your direction.",
    ],
  },
  {
    heading: "Cookies and tracking",
    body: [
      "We use strictly necessary cookies to operate the site, preference cookies (such as language selection), and anonymized analytics cookies to understand usage.",
      "You can disable cookies at any time in your browser settings; some functionality may be limited as a result.",
    ],
  },
  {
    heading: "How we use data",
    body: [
      "We use the information we collect to deliver and improve our services, respond to your requests, secure the platform against abuse, and comply with our legal obligations.",
      "We do not sell your personal data. We share it only with trusted processors (hosting, email, analytics) bound by written data processing agreements.",
    ],
  },
  {
    heading: "Your rights",
    body: [
      "You have the right to access, rectify, delete, restrict, or port the personal data we hold about you, and to object to certain processing.",
      "We respond to verified requests within 30 days under GDPR, the Azerbaijani Personal Data Law, and other applicable regulations.",
    ],
  },
  {
    heading: "Retention and security",
    body: [
      "Data is retained only for as long as necessary for the purposes described here. We enforce TLS 1.2+ in transit and AES-256 at rest.",
      "Access is restricted through role-based controls, mandatory two-factor authentication and audit logging.",
    ],
  },
  {
    heading: "Contact",
    body: [
      "For any question about this policy or your data, contact hello@agentix.ai. We reply to verified requests within 5 business days.",
    ],
  },
];

function PrivacyPage() {
  const { i18n } = useTranslation();
  const isAz = i18n.resolvedLanguage !== "en";
  return (
    <LegalPage
      eyebrow={isAz ? "Məxfilik" : "Privacy"}
      title={isAz ? "Məxfilik Siyasəti" : "Privacy Policy"}
      intro={
        isAz
          ? "Agentix sizin məxfiliyinizə hörmət edir. Bu siyasət hansı məlumatları topladığımızı, onlardan necə istifadə etdiyimizi və hüquqlarınızı izah edir."
          : "Agentix respects your privacy. This policy explains what data we collect, how we use it, and the rights you have."
      }
      updated={isAz ? "Son yenilənmə: Yanvar 2026" : "Last updated: January 2026"}
      sections={isAz ? AZ : EN}
      contactLabel={isAz ? "Məxfilik sualları" : "Privacy inquiries"}
    />
  );
}
