import React from "react";
import { motion } from "framer-motion";

const COVER_FRONT =
  "https://media.base44.com/images/public/user_6970ab0e6ab454a747b1106c/7fb9d9309_holagringogreenstripe.png";

const singles = [
  "Hola Gringo",
  "Mexico City Blues",
  "Mercado de Colores",
  "La Noche de Oaxaca",
];

export default function FeaturedVisual() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-6 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="overflow-hidden rounded-[2rem] border border-border/40 bg-foreground shadow-2xl"
      >
        <div className="grid items-center lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5 px-8 py-12 lg:px-14 lg:py-16">
            <div className="font-body text-xs font-semibold uppercase tracking-[0.24em] text-primary-foreground/50">
              Featured Singles
            </div>
            <h2 className="font-display text-4xl font-black tracking-tight text-accent md:text-5xl">
              La Inoficial
            </h2>
            <ul className="space-y-1.5">
              {singles.map((s) => (
                <li key={s} className="flex items-center gap-2 font-body text-sm text-primary-foreground/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
            <p className="max-w-md font-body text-sm leading-8 text-primary-foreground/60">
              A warm, cinematic arrival — the doorway into the journey behind the album.
              Music and lyrics by Daniel Astudillo Estrella.
            </p>
          </div>
          <img
            src={COVER_FRONT}
            alt="La Inoficial – Featured Visual"
            className="h-full w-full object-cover"
          />
        </div>
      </motion.div>
    </section>
  );
}