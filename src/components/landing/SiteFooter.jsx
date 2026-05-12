import React from "react";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/translations";

export default function SiteFooter() {
  const { lang } = useLang();
  const tx = t[lang];
  const rights =
    lang === "es" ? "Todos los derechos reservados" : "All Rights Reserved";

  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 font-body text-sm text-muted-foreground lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div>© Daniel Astudillo Estrella · {rights}</div>
        <div className="flex flex-wrap gap-6">
          <a href="#music" className="transition hover:text-primary">
            {tx.nav_music}
          </a>
          <a href="#editions" className="transition hover:text-primary">
            {tx.nav_editions}
          </a>
          <a href="#order" className="transition hover:text-primary">
            {tx.nav_order}
          </a>
        </div>
      </div>
    </footer>
  );
}
