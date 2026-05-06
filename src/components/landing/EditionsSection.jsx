import React from "react";
import { motion } from "framer-motion";
import { Star, Zap, Check } from "lucide-react";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/translations";
import { getStripePaymentLink } from "@/lib/stripeLinks";

const COVER_FRONT = "https://media.base44.com/images/public/user_6970ab0e6ab454a747b1106c/67fd0813d_lainoficialmexico.png";

// iPhone mockup — black aesthetic with QR code
function IphoneMockup({ instantLabel }) {
  return (
    <div className="flex justify-center py-4">
      <div className="relative w-40 h-72 rounded-[2.6rem] shadow-2xl"
        style={{ background: "linear-gradient(160deg, #2a2a2a, #111, #222)", border: "2px solid #3a3a3a" }}>
        <div className="absolute -left-[3px] top-16 w-[3px] h-5 rounded-l-full bg-zinc-700" />
        <div className="absolute -left-[3px] top-24 w-[3px] h-7 rounded-l-full bg-zinc-700" />
        <div className="absolute -right-[3px] top-20 w-[3px] h-8 rounded-r-full bg-zinc-700" />
        <div className="absolute inset-[5px] rounded-[2.2rem] overflow-hidden" style={{ background: "#0f0f0f" }}>
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-10 h-[9px] rounded-full bg-black z-20 border border-zinc-800" />
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[78%]">
            <div className="aspect-square rounded-lg overflow-hidden shadow-lg">
              <img src={COVER_FRONT} alt="La Inoficial" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="absolute top-[52%] left-0 right-0 px-3 text-center">
            <div className="font-body text-[10px] font-bold text-white">La Inoficial</div>
            <div className="font-body text-[8px] text-zinc-400">Daniel Astudillo Estrella</div>
          </div>
          <div className="absolute top-[61%] left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded p-0.5">
            <svg viewBox="0 0 21 21" className="w-full h-full" fill="none">
              <rect width="21" height="21" fill="white"/>
              <rect x="1" y="1" width="7" height="7" rx="1" fill="black"/>
              <rect x="2" y="2" width="5" height="5" rx="0.5" fill="white"/>
              <rect x="3" y="3" width="3" height="3" fill="black"/>
              <rect x="13" y="1" width="7" height="7" rx="1" fill="black"/>
              <rect x="14" y="2" width="5" height="5" rx="0.5" fill="white"/>
              <rect x="15" y="3" width="3" height="3" fill="black"/>
              <rect x="1" y="13" width="7" height="7" rx="1" fill="black"/>
              <rect x="2" y="14" width="5" height="5" rx="0.5" fill="white"/>
              <rect x="3" y="15" width="3" height="3" fill="black"/>
              <rect x="9" y="1" width="1" height="1" fill="black"/>
              <rect x="11" y="1" width="1" height="1" fill="black"/>
              <rect x="9" y="3" width="2" height="1" fill="black"/>
              <rect x="9" y="5" width="1" height="1" fill="black"/>
              <rect x="11" y="5" width="1" height="1" fill="black"/>
              <rect x="9" y="7" width="1" height="2" fill="black"/>
              <rect x="11" y="7" width="1" height="1" fill="black"/>
              <rect x="13" y="9" width="1" height="2" fill="black"/>
              <rect x="15" y="9" width="2" height="1" fill="black"/>
              <rect x="18" y="9" width="2" height="1" fill="black"/>
              <rect x="9" y="9" width="2" height="2" fill="black"/>
              <rect x="1" y="9" width="1" height="2" fill="black"/>
              <rect x="3" y="9" width="2" height="1" fill="black"/>
              <rect x="6" y="9" width="2" height="2" fill="black"/>
              <rect x="9" y="13" width="2" height="1" fill="black"/>
              <rect x="13" y="13" width="1" height="2" fill="black"/>
              <rect x="15" y="14" width="2" height="1" fill="black"/>
              <rect x="18" y="13" width="2" height="2" fill="black"/>
              <rect x="11" y="15" width="2" height="2" fill="black"/>
              <rect x="15" y="16" width="1" height="2" fill="black"/>
              <rect x="17" y="17" width="2" height="2" fill="black"/>
              <rect x="9" y="17" width="1" height="2" fill="black"/>
            </svg>
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <div className="rounded-xl py-1.5 text-center font-body text-[8px] font-bold text-white uppercase tracking-wide"
              style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }}>
              ⬇ {instantLabel}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CdVisual() {
  return (
    <div className="flex justify-center py-4">
      <div className="relative w-36 h-40 rounded-sm shadow-2xl"
        style={{ background: "linear-gradient(160deg, rgba(220,230,240,0.9), rgba(180,200,215,0.85))", border: "1.5px solid rgba(200,215,225,0.95)" }}>
        <div className="absolute left-0 top-0 bottom-0 w-[5px] rounded-l-sm"
          style={{ background: "linear-gradient(to right, rgba(255,255,255,0.6), transparent)" }} />
        <div className="absolute inset-[4px] rounded-sm overflow-hidden">
          <img src={COVER_FRONT} alt="CD Edition" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 rounded-sm pointer-events-none"
          style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 50%, rgba(255,255,255,0.08) 100%)" }} />
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full shadow-lg z-10 flex items-center justify-center"
          style={{ background: "conic-gradient(from 0deg, #c0c0c0, #e8e8e8, #a0a0a0, #d8d8d8, #b0b0b0, #e0e0e0, #c0c0c0)" }}>
          <div className="absolute inset-0 rounded-full opacity-40"
            style={{ background: "conic-gradient(from 0deg, rgba(255,0,0,0.3), rgba(255,165,0,0.3), rgba(255,255,0,0.3), rgba(0,255,0,0.3), rgba(0,0,255,0.3), rgba(238,130,238,0.3), rgba(255,0,0,0.3))" }} />
          <div className="absolute w-[85%] h-[85%] rounded-full border border-white/20" />
          <div className="absolute w-[65%] h-[65%] rounded-full border border-white/20" />
          <div className="w-5 h-5 rounded-full bg-white border border-zinc-300 z-10" />
        </div>
      </div>
    </div>
  );
}

function VinylVisual() {
  return (
    <div className="flex justify-center py-4">
      <div
        className="w-40 h-40 rounded-xl overflow-hidden shadow-2xl border border-white/10"
        style={{ transform: "rotate(-5deg)", boxShadow: "6px 8px 30px rgba(0,0,0,0.5)" }}
      >
        <img src={COVER_FRONT} alt="Vinyl Sleeve" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}

export default function EditionsSection() {
  const { lang } = useLang();
  const tx = t[lang];

  const editions = [
    {
      id: "digital",
      title: tx.digital_title,
      price: tx.digital_price,
      headline: tx.digital_headline,
      bullets: tx.digital_bullets,
      note: tx.digital_note,
      cta: tx.digital_cta,
      paymentLink: getStripePaymentLink("digital"),
      featured: true,
      badge: tx.digital_badge,
      badgeIcon: <Zap className="h-3 w-3" />,
      visual: <IphoneMockup instantLabel={tx.digital_cta} />,
    },
    {
      id: "cd",
      title: tx.cd_title,
      price: tx.cd_price,
      headline: tx.cd_headline,
      bullets: tx.cd_bullets,
      note: tx.cd_note,
      cta: tx.cd_cta,
      paymentLink: getStripePaymentLink("cd"),
      featured: false,
      badge: null,
      visual: <CdVisual />,
    },
    {
      id: "vinyl",
      title: tx.vinyl_title,
      price: tx.vinyl_price,
      headline: tx.vinyl_headline,
      bullets: tx.vinyl_bullets,
      note: tx.vinyl_note,
      cta: tx.vinyl_cta,
      paymentLink: getStripePaymentLink("vinyl"),
      featured: false,
      badge: tx.vinyl_badge,
      badgeIcon: <Star className="h-3 w-3" />,
      visual: <VinylVisual />,
    },
  ];

  return (
    <section id="editions" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="font-body text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            {tx.editions_label}
          </div>
          <h2 className="mt-3 font-display text-4xl font-black tracking-tight text-foreground md:text-5xl">
            {tx.editions_headline}
          </h2>
        </div>
        <p className="max-w-md font-body text-sm leading-7 text-muted-foreground">
          {tx.editions_body}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {editions.map((ed, i) => (
          <motion.article
            key={ed.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`relative overflow-hidden rounded-[2rem] border p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
              ed.featured
                ? "border-primary/30 bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground"
            }`}
          >
            {ed.badge && (
              <div className="absolute right-5 top-5 flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">
                {ed.badgeIcon}
                {ed.badge}
              </div>
            )}

            <div className={ed.featured ? "opacity-90" : ""}>{ed.visual}</div>

            <div className="mt-2 font-body text-xs font-semibold uppercase tracking-[0.2em] opacity-60">
              {ed.title}
            </div>

            <div className="mt-2 font-display text-4xl font-black tracking-tight">
              {ed.price}
            </div>

            <p className={`mt-3 font-body text-sm font-semibold ${ed.featured ? "text-primary-foreground" : "text-foreground"}`}>
              {ed.headline}
            </p>

            <ul className={`mt-3 space-y-1.5 font-body text-xs leading-6 ${ed.featured ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
              {ed.bullets.map((b, idx) => {
                const isDigitalBonus = !ed.featured && (b.toLowerCase().includes("instant digital download") || b.toLowerCase().includes("descarga digital"));
                return (
                  <li key={idx} className={`flex items-start gap-2 ${isDigitalBonus ? "text-red-500 font-semibold" : ""}`}>
                    {isDigitalBonus
                      ? <span className="mt-0.5 shrink-0 font-bold">+</span>
                      : <Check className="h-3 w-3 mt-1 shrink-0 opacity-70" />
                    }
                    {b}
                  </li>
                );
              })}
            </ul>

            <div className={`mt-5 rounded-2xl px-4 py-3 font-body text-xs leading-6 ${
              ed.featured
                ? "bg-primary-foreground/10 text-primary-foreground/75"
                : "bg-secondary text-muted-foreground"
            }`}>
              {ed.note}
            </div>

            <a
              href={ed.paymentLink || "#order"}
              target={ed.paymentLink ? "_blank" : undefined}
              rel={ed.paymentLink ? "noreferrer" : undefined}
              aria-disabled={!ed.paymentLink}
              title={!ed.paymentLink ? tx.stripe_link_missing : undefined}
              onClick={!ed.paymentLink ? (event) => event.preventDefault() : undefined}
              className={`mt-6 inline-block w-full rounded-2xl px-5 py-3.5 text-center font-body text-sm font-semibold transition ${
                ed.featured
                  ? "bg-primary-foreground text-primary shadow-lg hover:shadow-xl"
                  : "border border-border bg-card hover:border-primary hover:text-primary"
              } ${!ed.paymentLink ? "cursor-not-allowed opacity-50" : ""}`}
            >
              {ed.cta}
            </a>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
