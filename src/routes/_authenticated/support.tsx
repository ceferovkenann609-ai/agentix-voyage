import { createFileRoute, Link } from "@tanstack/react-router";
import { LifeBuoy, Mail, MessageSquare, BookOpen, ExternalLink, Clock } from "lucide-react";
import { openSupportChat } from "@/lib/support-chat";

export const Route = createFileRoute("/_authenticated/support")({
  head: () => ({
    meta: [
      { title: "Dəstək — Agentix" },
      {
        name: "description",
        content:
          "Agentix dəstək komandası ilə canlı çat, e-poçt və sənədləşmə vasitəsilə əlaqə saxlayın.",
      },
      { property: "og:title", content: "Dəstək — Agentix" },
      {
        property: "og:description",
        content: "Agentix müştəriləri üçün canlı çat, e-poçt dəstəyi və texniki sənədləşmə.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SupportPage,
});

function SupportPage() {
  return (
    <div className="min-h-screen bg-[#07090C] text-white pt-28 pb-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <LifeBuoy className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="uppercase tracking-[6px] text-cyan-400 font-semibold text-xs">DƏSTƏK</p>
            <h1 className="text-3xl font-bold">Necə köməklik göstərə bilərik?</h1>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {/* Live chat — opens the Agentix chat widget in place, no redirect */}
          <div className="glass rounded-2xl p-6 flex flex-col">
            <div className="h-11 w-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-cyan-300" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Canlı çat</h3>
            <p className="mt-2 text-sm text-muted-foreground flex-1">
              Agentix AI köməkçisi sualınızı dərhal cavablandırır və ehtiyac olduqda müraciətinizi
              dəstək komandasına yönləndirir.
            </p>
            <button
              type="button"
              onClick={openSupportChat}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300 hover:text-cyan-200"
            >
              Çatı aç <MessageSquare className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="glass rounded-2xl p-6 flex flex-col">
            <div className="h-11 w-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Mail className="h-5 w-5 text-cyan-300" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">E-poçt dəstəyi</h3>
            <p className="mt-2 text-sm text-muted-foreground flex-1">
              Müraciətinizi əlaqə formu ilə göndərin. Hər müraciət qeydə alınır və hesabınıza
              bağlanır.
            </p>
            <Link
              to="/contact"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300 hover:text-cyan-200"
            >
              Əlaqə formu <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="glass rounded-2xl p-6 flex flex-col">
            <div className="h-11 w-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-cyan-300" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Xidmət məlumatları</h3>
            <p className="mt-2 text-sm text-muted-foreground flex-1">
              Hər AI xidmətinin imkanları, inteqrasiyaları və tətbiq mərhələləri xidmət
              səhifələrində izah olunur.
            </p>
            <Link
              to="/services"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300 hover:text-cyan-200"
            >
              Xidmətlərə keç <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Real request history — user's own contact submissions + demo bookings */}
        <div className="mt-10 glass rounded-2xl p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Inbox className="h-4 w-4 text-cyan-300" />
              <h2 className="text-lg font-semibold">Müraciət tarixçəniz</h2>
            </div>
            <span className="text-xs text-white/40">{requests.length} müraciət</span>
          </div>

          {requestsQuery.isLoading ? (
            <div className="mt-6 flex items-center gap-2 text-sm text-white/50">
              <Loader2 className="h-4 w-4 animate-spin text-cyan-300" /> Müraciətlər yüklənir…
            </div>
          ) : requestsQuery.isError ? (
            <div className="mt-6 flex items-center gap-2 text-sm text-red-200">
              <AlertTriangle className="h-4 w-4" /> Müraciət tarixçəsi yüklənə bilmədi.
            </div>
          ) : requests.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Hələ müraciət göndərməmisiniz. Əlaqə formu və ya demo sorğusu göndərdikdən sonra
              tarixçə burada görünəcək.
            </p>
          ) : (
            <div className="mt-4 divide-y divide-white/5">
              {requests.map((r) => (
                <div key={`${r.kind}-${r.id}`} className="flex items-start justify-between gap-4 py-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                          r.kind === "demo"
                            ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-200"
                            : "border-white/10 bg-white/[0.04] text-white/60"
                        }`}
                      >
                        {r.kind === "demo" ? "Demo" : "Əlaqə"}
                      </span>
                      <p className="truncate font-medium">{r.subject}</p>
                    </div>
                    {r.message && (
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.message}</p>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-white/40">
                    {r.createdAt.toLocaleDateString("az-AZ", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>


        <div className="mt-10 glass rounded-2xl p-6">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-cyan-300" />
            <h2 className="text-lg font-semibold">Dəstək qaydaları</h2>
          </div>
          <div className="mt-4 divide-y divide-white/5">
            {[
              {
                q: "Dəstək hansı saatlarda işləyir?",
                a: "İş günləri 09:00–19:00 (Bakı vaxtı). Bu saatlardan kənarda göndərilən müraciətlər növbəti iş günü sıraya alınır.",
              },
              {
                q: "Müraciətimə necə cavab verilir?",
                a: "Canlı çat AI köməkçisi ilə dərhal başlayır. İnsan mütəxəssis tələb olunan hallarda müraciət e-poçt üzərindən davam edir.",
              },
              {
                q: "Fərdi inteqrasiya tələb edə bilərəmmi?",
                a: "Bəli. Demo sifariş edin — komanda tələbi qiymətləndirir və tətbiq planını sizinlə birlikdə hazırlayır.",
              },
              {
                q: "Texniki problemi necə bildirim?",
                a: "Çatda və ya əlaqə formunda problemin baş verdiyi səhifəni, vaxtı və gördüyünüz mesajı qeyd edin — bu, araşdırmanı sürətləndirir.",
              },
            ].map((f) => (
              <div key={f.q} className="py-4">
                <p className="font-medium">{f.q}</p>
                <p className="mt-1 text-sm text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
