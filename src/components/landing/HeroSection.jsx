import React, { useState } from "react";
import { motion } from "framer-motion";
import { Disc3, Download, Package } from "lucide-react";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/translations";

const COVER_FRONT = "https://media.base44.com/images/public/user_6970ab0e6ab454a747b1106c/67fd0813d_lainoficialmexico.png";
const COVER_BACK = "https://media.base44.com/images/public/user_6970ab0e6ab454a747b1106c/7fb9d9309_holagringogreenstripe.png";

export default function HeroSection() {
  const [showBack, setShowBack] = useState(false);
  const { lang } = useLang();
  const tx = t[lang];

  const formats = [
    { label: "Digital Download", sub: tx.hero_format_digital_sub, icon: "💿" },
    { label: "CD Edition", sub: tx.hero_format_cd_sub, icon: "📀" },
    { label: lang === "en" ? "Limited Vinyl" : "Vinilo Limitado", sub: tx.hero_format_vinyl_sub, icon: "🎵" },
  ];

  return (
    <section id="home" className="relative overflow-hidden">
      <div className="pointer-events-none absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-accent/30 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-[360px] w-[360px] rounded-full bg-primary/10 blur-[100px]" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-24">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 font-body text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground shadow-sm">
            <Disc3 className="h-3.5 w-3.5" />
            {tx.hero_badge}
          </div>

          <div className="space-y-4">
            <h1 className="font-display text-5xl font-black leading-[0.92] tracking-tight text-primary sm:text-6xl lg:text-7xl">
              La Inoficial
            </h1>
            <p className="max-w-lg font-display text-xl italic leading-relaxed text-foreground/70 sm:text-2xl">
              {tx.hero_subtitle}
            </p>
            <p className="max-w-lg font-body text-base leading-8 text-muted-foreground">
              {tx.hero_body}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <a href="#order" className="inline-flex items-center gap-2 rounded-2xl bg-primary px-7 py-3.5 font-body text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:shadow-xl hover:shadow-primary/30">
              <Download className="h-4 w-4" />
              {tx.hero_cta_order}
            </a>
            <a href="#editions" className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-7 py-3.5 font-body text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary">
              <Package className="h-4 w-4" />
              {tx.hero_cta_editions}
            </a>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {formats.map((f) => (
              <div key={f.label} className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm backdrop-blur">
                <div className="text-lg">{f.icon}</div>
                <div className="mt-1 font-body text-sm font-semibold text-foreground">{f.label}</div>
                <div className="font-body text-xs text-muted-foreground">{f.sub}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.15 }} className="relative">
          <div className="group relative cursor-pointer overflow-hidden rounded-[2rem] border border-border bg-card p-3 shadow-2xl transition-transform hover:scale-[1.01]" onClick={() => setShowBack(!showBack)}>
            <img
              src={showBack ? COVER_BACK : COVER_FRONT}
              alt="La Inoficial"
              className="aspect-square w-full rounded-[1.5rem] object-cover transition-all duration-700"
            />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-foreground/70 px-4 py-2.5 text-center font-body text-xs font-medium text-primary-foreground backdrop-blur-md">
              {showBack ? tx.hero_cover_back : tx.hero_cover_front}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}