import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/translations";

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, setLang } = useLang();
  const tx = t[lang];

  const navLinks = [
    { label: tx.nav_home, to: "/#home" },
    { label: tx.nav_music, to: "/#music" },
    { label: tx.nav_lyrics, to: "/#lyrics" },
    { label: tx.nav_editions, to: "/#editions" },
    { label: tx.nav_order, to: "/#order" },
    { label: tx.nav_terms, to: "/terms" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link to="/#home" className="group">
          <div className="font-display text-2xl font-black tracking-[0.14em] text-primary">
            HOLA GRINGO
          </div>
          <div className="font-body text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
            Mexico · Soundtrack
          </div>
        </Link>

        <nav className="hidden gap-8 font-body text-sm font-medium md:flex">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className="text-foreground/70 transition-colors hover:text-primary">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Language switcher */}
          <div className="flex items-center rounded-full border border-border bg-card overflow-hidden font-body text-xs font-semibold">
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1.5 transition ${lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("es")}
              className={`px-3 py-1.5 transition ${lang === "es" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              ES
            </button>
          </div>

          <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border/40 bg-background md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3 font-body text-sm font-medium text-foreground/80 transition hover:bg-secondary"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
