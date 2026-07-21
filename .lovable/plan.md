
# Agentix Premium Upgrade Plan

Goal: keep every page, route, component, and animation that exists today, and lift the whole site to a premium AI-automation brand with a new color identity and full Azerbaijani localization.

## 1. Audit (already scanned)

Existing surface I will preserve:
- Routes: `/`, `/services`, `/services/{ai-chatbots,voice-ai,lead-generation,customer-support,workflow-automation,crm-integration}`, `/services/$slug`, `/solutions`, `/solutions/$industry`, `/pricing`, `/about`, `/contact`, `/book-demo`, `/demo`, `/login`.
- Shared chrome: `Navbar`, `Footer`, `AIChatWidget`, `__root` shell, fonts (Space Grotesk + Inter).
- Sections on Home: hero, stats, services grid, timeline, features, testimonials, FAQ, CTA — all stay.
- Interactive demos on every service page — stay, only restyled.

Nothing gets deleted or simplified.

## 2. New brand tokens (src/styles.css)

Replace the purple-dominant tokens with:

```text
--bg           #07090C   graphite, not pure black
--bg-elev      #0B0F14   card base
--surface      rgba(255,255,255,0.03) glass fill
--border       rgba(120,220,255,0.08) subtle cyan hairline
--border-glow  rgba(0,220,255,0.35) hover / focus
--primary      #22D3EE   electric cyan
--primary-2    #0EA5E9   mid cyan
--secondary    #1E3A8A   deep blue
--accent       #10B981   emerald
--text         #E6EDF3
--text-muted   #8A97A8
--brand-gradient  linear-gradient(135deg,#22D3EE 0%,#0EA5E9 55%,#1E3A8A 100%)
--glow-cyan    0 0 40px rgba(34,211,238,0.25)
```

- `bg-brand-gradient` utility repointed to the new gradient (all existing usages inherit automatically).
- Add `.glass`, `.glass-card`, `.border-glow`, `.btn-glass` utilities via `@utility` so components can adopt without prop churn.
- Purple-specific classes in `Footer` top border, hero orbs, etc. swapped to cyan/blue/emerald equivalents.
- No new gradient soup — flat graphite surfaces with one accent glow per card.

## 3. Typography & spacing pass

- Keep Space Grotesk (display) + Inter (body).
- Tighten heading tracking (`tracking-tight`), lift body line-height to 1.65.
- Standardize section rhythm: `py-24 md:py-32`, container `max-w-7xl px-6`.
- Card radius unified at `rounded-2xl`, hero/panels `rounded-3xl`.
- Buttons: unified `btn-primary` (cyan glass + glow) and `btn-ghost` (hairline border) — applied across Navbar CTA, Hero, CTA sections, Book Demo, Contact.

## 4. i18n (AZ default, EN secondary)

- Add `react-i18next` + `i18next` (client-only, no SSR fetch).
- `src/i18n/index.ts` initializes with `az` default, `en` fallback, language persisted in `localStorage`.
- Two resource files: `src/i18n/locales/az.json`, `src/i18n/locales/en.json`. Namespaces: `common`, `nav`, `home`, `services`, `solutions`, `pricing`, `about`, `contact`, `demo`, `footer`, plus one per service page.
- Copy is rewritten as marketing copy in AZ (not literal), EN kept polished.
- Every user-facing string in `Navbar`, `Footer`, `Home`, `Services`, all `services.*` pages, `Solutions`, `Pricing`, `About`, `Contact`, `BookDemo`, `Login`, `AIChatWidget`, FAQs, CTA blocks is replaced with `t("…")`.
- `<LanguageSwitcher />` in Navbar (AZ | EN pill, cyan active state). Also surfaced in Footer.
- `<html lang>` in `__root` becomes dynamic via a small effect hook.
- SEO `head()` per route reads titles/descriptions from the active language via a helper (`getMeta(routeKey, lang)`).

## 5. Per-page polish (no structural changes)

Home
- Hero: swap purple orbs for cyan/emerald blobs, refined headline hierarchy, primary CTA "Demo sifariş et" + ghost "Xidmətlərə bax".
- Stats: monochrome cards with cyan digit glow.
- Services grid: keep cursor-glow cards, recolor to cyan hover, tighter copy.
- Testimonials/FAQ: glass cards, emerald check accents.
- Final CTA: single deep-blue slab with cyan halo.

Services + service detail pages
- Reuse `ServicePageShell` styling tokens; recolor accent chips per service (cyan for chatbots, emerald for CRM, deep blue for voice, etc.) so pages feel individual but on-brand.
- Interactive demos keep behavior; only palette + border-glow tokens change.

Solutions & Solutions/$industry
- Industry cards get emerald ROI badges, cyan icon frames.

Pricing
- Calculator background switched to graphite, sliders/tracks use cyan, "Most popular" ribbon uses gradient.

About
- Values/team cards tokenized; add mission line in AZ.

Book Demo & Contact
- Real form state (name/email/company/phone/service/message), inline validation, loading + success states already partly present — extended and translated.
- Trust row (SLA, GDPR, response < 24h) under form.

Navbar
- Sticky glass, cyan underline on active link, language switcher + Login (ghost) + "Demo al" (primary).
- Mobile: slide-in drawer with same items (already present pattern, restyled).

Footer
- Recolor top hairline to cyan, keep 4-column structure, translate all links, add language switcher + locale-aware address line.

AIChatWidget
- Recolor bubble to cyan gradient, translate prompts.

## 6. Micro-interactions & states

- Global focus ring: `focus-visible:ring-2 ring-cyan-400/60`.
- Buttons: 150ms scale + glow on hover, `active:scale-[0.98]`.
- Cards: `hover:border-cyan-400/30` + soft shadow.
- Loading: shared `<Spinner />` (cyan) and skeleton shimmer utility for demos.
- Respect `prefers-reduced-motion` on all Framer/keyframe animations.

## 7. Responsiveness & a11y sweep

- Every section reviewed at `sm/md/lg`; grids collapse to single column on mobile with preserved spacing.
- Replace `h-screen` with `h-dvh` where used in heroes.
- Add `aria-label` to icon-only buttons (language switcher, socials, chat widget toggle, mobile menu).
- Ensure alt text on any decorative SVG marked `aria-hidden`.

## 8. Delivery order (single pass)

1. Install `i18next react-i18next` and scaffold `src/i18n/*` with full AZ + EN dictionaries.
2. Rewrite `src/styles.css` tokens + utilities.
3. Update `__root.tsx` (i18n provider, dynamic lang, meta helper).
4. Update `Navbar` + new `LanguageSwitcher`, `Footer`.
5. Update `Home` sections in place.
6. Update `Services` index + 6 service detail components (palette + t()).
7. Update `Solutions`, `Solutions/$industry`, `Pricing` (+ `PricingCalculator`), `About`, `Contact`, `BookDemo`, `Login`, `AIChatWidget`.
8. Verify build, then spot-check `/`, `/services/ai-chatbots`, `/pricing`, `/contact` in the preview.

## Technical notes

- `react-i18next` runs client-side; for SSR head titles I resolve the initial language on the server from an `Accept-Language`-agnostic default (`az`) and hydrate. Route `head()` uses a plain map keyed by route + lang; no server function required.
- No new dependencies beyond `i18next` + `react-i18next`.
- No schema, no backend, no route file renames — `routeTree.gen.ts` untouched.
- Existing `bg-brand-gradient` / `text-gradient` classes keep their names; only their CSS variables change, so no component churn for gradients.

Approve and I'll execute in the order above.
