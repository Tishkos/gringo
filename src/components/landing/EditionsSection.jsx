import React from "react";
import { motion } from "framer-motion";
import { Star, Zap, Check, Download, Disc3, Music, Shield, ArrowRight } from "lucide-react";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/translations";
import { getStripePaymentLink } from "@/lib/stripeLinks";

const editionCovers = {
  digital: "/covers/digital-edition-transparent.png",
  cd: "/covers/cd-edition-transparent.png",
  vinyl: "/covers/vinyl-edition-transparent.png",
  qr: "/covers/qr.png",
};

/* ─────────────────────────────────────────────────────────────────────
   Digital Included Banner — communicates QR = free digital download
───────────────────────────────────────────────────────────────────── */
function DigitalIncludedBanner({ featured }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border px-3.5 py-2.5 ${
        featured
          ? "border-primary-foreground/20 bg-primary-foreground/10"
          : "border-border bg-muted/40"
      }`}
    >
      {/* QR code thumbnail */}
      <div
        className={`shrink-0 rounded-xl p-1.5 ${
          featured ? "bg-primary-foreground/15" : "bg-card"
        }`}
      >
        <img
          src={editionCovers.qr}
          alt="QR code for digital download"
          className="h-8 w-8 rounded object-contain"
        />
      </div>

      {/* Label */}
      <div className="min-w-0 flex-1">
        <p
          className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
            featured ? "text-primary-foreground/50" : "text-muted-foreground/70"
          }`}
        >
          Also included
        </p>
        <p
          className={`text-xs font-bold leading-tight ${
            featured ? "text-primary-foreground" : "text-foreground"
          }`}
        >
          Instant digital download
        </p>
      </div>

      {/* Download icon */}
      <Download
        className={`h-4 w-4 shrink-0 ${
          featured ? "text-primary-foreground/50" : "text-muted-foreground/50"
        }`}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Cover Image — fixed h-52 so all three cards are identical in height
───────────────────────────────────────────────────────────────────── */
function CoverImage({ src, alt }) {
  return (
    <div className="flex h-52 w-full items-center justify-center">
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-contain drop-shadow-xl"
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Edition Card
───────────────────────────────────────────────────────────────────── */
function EditionCard({ ed, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={`relative flex flex-col overflow-visible rounded-[2rem] border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
        ed.featured
          ? "border-primary/30 bg-primary text-primary-foreground shadow-lg shadow-primary/20"
          : "border-border bg-card text-foreground shadow-sm"
      }`}
    >
      {/* ── Badge ── */}
      {ed.badge && (
        <div className="absolute left-1/2 top-0 z-30 -translate-x-1/2 -translate-y-1/2">
          <span className="flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-md ring-2 ring-background">
            {ed.badgeIcon}
            {ed.badge}
          </span>
        </div>
      )}

      {/* ── Cover zone ── */}
      <div
        className={`overflow-hidden rounded-t-[2rem] px-8 pb-0 pt-9 ${
          ed.featured ? "bg-primary" : "bg-muted/30"
        }`}
      >
        <CoverImage src={ed.coverSrc} alt={ed.coverAlt} />
      </div>

      {/* ── Hairline ── */}
      <div
        className={`mx-6 h-px ${
          ed.featured ? "bg-primary-foreground/15" : "bg-border"
        }`}
      />

      {/* ── Body ── */}
      <div className="flex flex-1 flex-col gap-4 px-7 py-6">

        {/* Title + price row */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p
              className={`text-[10px] font-semibold uppercase tracking-[0.22em] ${
                ed.featured ? "text-primary-foreground/50" : "text-muted-foreground"
              }`}
            >
              {ed.title}
            </p>
            <p className="mt-0.5 font-display text-3xl font-black tracking-tight">
              {ed.price}
            </p>
          </div>

          {/* Edition icon pill */}
          <div
            className={`mt-1 shrink-0 rounded-xl p-2.5 ${
              ed.featured ? "bg-primary-foreground/15" : "bg-muted"
            }`}
          >
            {ed.icon}
          </div>
        </div>

        {/* Headline */}
        <p
          className={`font-body text-sm font-semibold leading-snug ${
            ed.featured ? "text-primary-foreground" : "text-foreground"
          }`}
        >
          {ed.headline}
        </p>

        {/* Bullets */}
        <ul className="space-y-2">
          {ed.bullets.map((b, idx) => {
            const isBonus =
              !ed.featured &&
              (b.toLowerCase().includes("instant digital download") ||
                b.toLowerCase().includes("descarga digital"));
            return (
              <li
                key={idx}
                className={`flex items-start gap-2 font-body text-xs leading-5 ${
                  isBonus
                    ? "font-semibold text-red-500"
                    : ed.featured
                    ? "text-primary-foreground/75"
                    : "text-muted-foreground"
                }`}
              >
                {isBonus ? (
                  <span className="mt-0.5 shrink-0 font-bold">+</span>
                ) : (
                  <Check
                    className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
                      ed.featured
                        ? "text-primary-foreground/60"
                        : "text-muted-foreground/50"
                    }`}
                  />
                )}
                {b}
              </li>
            );
          })}
        </ul>

        {/* Digital download included banner */}
        {ed.hasDigital && <DigitalIncludedBanner featured={ed.featured} />}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Note */}
        <div
          className={`rounded-2xl px-4 py-3 font-body text-[11px] leading-5 ${
            ed.featured
              ? "bg-primary-foreground/10 text-primary-foreground/65"
              : "bg-muted/60 text-muted-foreground"
          }`}
        >
          {ed.note}
        </div>

        {/* CTA button */}
        <a
          href={ed.paymentLink || "#order"}
          target={ed.paymentLink ? "_blank" : undefined}
          rel={ed.paymentLink ? "noreferrer" : undefined}
          aria-disabled={!ed.paymentLink}
          title={!ed.paymentLink ? ed.stripeLinkMissing : undefined}
          onClick={!ed.paymentLink ? (e) => e.preventDefault() : undefined}
          className={`group inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-5 text-center font-body text-sm font-bold tracking-wide transition-all duration-200 active:scale-[0.98] ${
            ed.featured
              ? "bg-primary-foreground text-primary shadow-md hover:opacity-90 hover:shadow-lg"
              : "border border-border bg-card hover:border-primary hover:text-primary"
          } ${!ed.paymentLink ? "cursor-not-allowed opacity-50" : ""}`}
        >
          {ed.cta}
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </a>

        <p
          className={`mt-2.5 flex items-center justify-center gap-1.5 font-body text-[10px] ${
            ed.featured ? "text-primary-foreground/60" : "text-muted-foreground/60"
          }`}
        >
          <Shield className="h-3 w-3" />
          Secure checkout · Instant delivery
        </p>
      </div>
    </motion.article>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Section
───────────────────────────────────────────────────────────────────── */
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
      icon: <Zap className="h-4 w-4 opacity-75" />,
      coverSrc: editionCovers.digital,
      coverAlt: "Digital edition cover",
      hasDigital: false,
      stripeLinkMissing: tx.stripe_link_missing,
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
      icon: <Disc3 className="h-4 w-4 opacity-75" />,
      coverSrc: editionCovers.cd,
      coverAlt: "CD edition cover",
      hasDigital: true,
      stripeLinkMissing: tx.stripe_link_missing,
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
      icon: <Music className="h-4 w-4 opacity-75" />,
      coverSrc: editionCovers.vinyl,
      coverAlt: "Vinyl edition cover",
      hasDigital: true,
      stripeLinkMissing: tx.stripe_link_missing,
    },
  ];

  return (
    <section id="editions" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">

      {/* Header */}
      <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-body text-xs font-semibold uppercase tracking-[0.26em] text-muted-foreground">
            {tx.editions_label}
          </p>
          <h2 className="mt-3 font-display text-4xl font-black tracking-tight text-foreground md:text-5xl">
            {tx.editions_headline}
          </h2>
        </div>
        <p className="max-w-md font-body text-sm leading-7 text-muted-foreground">
          {tx.editions_body}
        </p>
      </div>

      {/* Cards */}
      <div className="grid items-stretch gap-5 lg:grid-cols-3">
        {editions.map((ed, i) => (
          <EditionCard key={ed.id} ed={ed} index={i} />
        ))}
      </div>
    </section>
  );
}
