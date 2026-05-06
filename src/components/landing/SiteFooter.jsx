import React from "react";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 font-body text-sm text-muted-foreground lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div>© Daniel Astudillo Estrella · All Rights Reserved</div>
        <div className="flex flex-wrap gap-6">
          <a href="#music" className="transition hover:text-primary">
            Música
          </a>
          <a href="#editions" className="transition hover:text-primary">
            Editionen
          </a>
          <a href="#order" className="transition hover:text-primary">
            Bestellung
          </a>
        </div>
      </div>
    </footer>
  );
}