import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { LegalPage, type LegalSection } from "../components/site/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — Agentix" },
      { name: "description", content: "The terms that govern access to and use of Agentix AI automation services." },
      { property: "og:title", content: "Terms of Use — Agentix" },
      { property: "og:description", content: "The terms that govern access to and use of Agentix AI automation services." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TermsPage,
});

const AZ: LegalSection[] = [
  {
    heading: "Xidmətdən istifadə",
    body: [
      "Agentix veb-saytına və məhsullarına daxil olmaqla bu şərtləri qəbul etmiş sayılırsınız. Xidmətlərdən yalnız qanuni məqsədlər üçün və tətbiq olunan qanunvericiliyə uyğun istifadə etmək öhdəliyi daşıyırsınız.",
      "Şirkət istənilən zaman xidmətlərin funksionallığını dəyişmək, yeniləmək və ya dayandırmaq hüququnu özündə saxlayır.",
    ],
  },
  {
    heading: "İstifadəçi öhdəlikləri",
    body: [
      "Hesab məlumatlarınızın məxfiliyini qorumaq, doğru və aktual məlumat təqdim etmək və üçüncü tərəflərin hüquqlarını pozan məzmun yükləməmək sizin məsuliyyətinizdir.",
      "Xidmətdən avtomatlaşdırılmış zərərli hərəkətlər, spam, təhlükəsizlik testləri (icazəsiz) və ya rəqabət kəşfiyyatı üçün istifadə qadağandır.",
    ],
  },
  {
    heading: "İntellektual mülkiyyət",
    body: [
      "Agentix brendi, loqotipləri, mətnləri, dizayn, kod və AI modelləri şirkətə və ya onun lisenziya verənlərinə məxsusdur və müvafiq qanunvericiliklə qorunur.",
      "Xidmətə yüklədiyiniz məzmun sizin mülkiyyətinizdə qalır; siz Agentix-ə həmin məzmunu yalnız xidmətləri təqdim etmək məqsədilə emal etmək üçün məhdud lisenziya verirsiniz.",
    ],
  },
  {
    heading: "Ödənişlər və abunəliklər",
    body: [
      "Ödənişli planlar sifariş anındakı qiymət və şərtlərə əsasən verilir. Abunəlik avtomatik yenilənir və ləğv edilənə qədər davam edir.",
      "Geri qaytarma və ya kredit siyasətinin təfərrüatları müqavilədə göstərilir.",
    ],
  },
  {
    heading: "Məsuliyyətin məhdudlaşdırılması",
    body: [
      "Xidmətlər “olduğu kimi” əsasında təqdim olunur. Qanunla icazə verilən maksimum həddə qədər Agentix dolayı, təsadüfi, xüsusi və ya nəticə etibarilə yaranan zərərlərə görə məsuliyyət daşımır.",
      "Ümumi məsuliyyət son 12 ayda Agentix-ə ödənilən məbləğlə məhdudlaşır.",
    ],
  },
  {
    heading: "Ləğv və dayandırma",
    body: [
      "Bu şərtləri pozan hesabları xəbərdarlıq olunmadan dayandırmaq və ya ləğv etmək hüququnu saxlayırıq. Siz istənilən vaxt hesabınızı bağlaya bilərsiniz.",
    ],
  },
  {
    heading: "Əlaqə",
    body: [
      "Bu şərtlərlə bağlı suallar üçün hello@agentix.ai ünvanı ilə əlaqə saxlayın.",
    ],
  },
];

const EN: LegalSection[] = [
  {
    heading: "Use of the service",
    body: [
      "By accessing the Agentix website and products, you agree to these terms. You must use the services only for lawful purposes and in compliance with all applicable laws.",
      "We may modify, update, or discontinue any functionality at any time without prior notice.",
    ],
  },
  {
    heading: "User responsibilities",
    body: [
      "You are responsible for keeping your account credentials secure, providing accurate information, and not uploading content that infringes on the rights of others.",
      "You may not use the service for automated abuse, spam, unauthorized security testing, or competitive intelligence gathering.",
    ],
  },
  {
    heading: "Intellectual property",
    body: [
      "The Agentix brand, logos, copy, design, source code, and AI models are owned by Agentix or its licensors and are protected by applicable law.",
      "Content you upload to the service remains yours; you grant Agentix a limited license to process that content solely to deliver the service to you.",
    ],
  },
  {
    heading: "Fees and subscriptions",
    body: [
      "Paid plans are billed at the price and cadence set at the time of purchase. Subscriptions renew automatically and continue until cancelled.",
      "Refund and credit terms are defined in your order form or agreement.",
    ],
  },
  {
    heading: "Limitation of liability",
    body: [
      "The services are provided on an “as is” basis. To the maximum extent permitted by law, Agentix is not liable for indirect, incidental, special, or consequential damages.",
      "Our total aggregate liability is limited to the amount paid to Agentix in the preceding 12 months.",
    ],
  },
  {
    heading: "Termination",
    body: [
      "We may suspend or terminate accounts that violate these terms, with or without notice. You may close your account at any time.",
    ],
  },
  {
    heading: "Contact",
    body: [
      "For any question about these terms, contact hello@agentix.ai.",
    ],
  },
];

function TermsPage() {
  const { i18n } = useTranslation();
  const isAz = i18n.resolvedLanguage !== "en";
  return (
    <LegalPage
      eyebrow={isAz ? "Şərtlər" : "Terms"}
      title={isAz ? "İstifadə Şərtləri" : "Terms of Use"}
      intro={
        isAz
          ? "Bu şərtlər Agentix xidmətlərindən istifadəni tənzimləyir. Xidmətlərdən istifadə edərək aşağıdakı qaydaları qəbul etmiş olursunuz."
          : "These terms govern your use of the Agentix services. By using the services you accept the rules set out below."
      }
      updated={isAz ? "Son yenilənmə: Yanvar 2026" : "Last updated: January 2026"}
      sections={isAz ? AZ : EN}
      contactLabel={isAz ? "Hüquqi suallar" : "Legal inquiries"}
    />
  );
}
