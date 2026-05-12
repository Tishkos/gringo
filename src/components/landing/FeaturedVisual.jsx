import React from "react";
import { motion } from "framer-motion";
import { Music2 } from "lucide-react";

const COVER_FRONT =
  "https://media.base44.com/images/public/user_6970ab0e6ab454a747b1106c/7fb9d9309_holagringogreenstripe.png";

const singles = [
  "Hola Gringo",
  "Gol para México",
  "Guadalajara",
  "No One Believes in Tomorrow",
];

export default function FeaturedVisual() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-10 pt-14 lg:px-10 lg:pt-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="overflow-hidden rounded-[2rem] border border-border/40 bg-foreground text-primary-foreground shadow-2xl"
      >
        <div className="grid lg:grid-cols-[1fr_0.9fr]">
          <div className="flex flex-col justify-center px-8 py-12 sm:px-10 lg:px-14 lg:py-16">
            <div className="flex items-center gap-3 font-body text-xs font-semibold uppercase tracking-[0.24em] text-primary-foreground/50">
              <Music2 className="h-4 w-4 text-accent" />
              Featured Singles
            </div>

            <ul className="mt-8 divide-y divide-primary-foreground/10 border-y border-primary-foreground/10">
              {singles.map((single, index) => (
                <li
                  key={single}
                  className="grid grid-cols-[2.5rem_1fr] items-center gap-4 py-4 font-body text-sm text-primary-foreground/78"
                >
                  <span className="font-display text-lg font-black text-accent/80">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="break-words font-semibold">{single}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <h2 className="max-w-xl font-display text-4xl font-black tracking-tight text-accent md:text-5xl">
                La Inoficial
              </h2>
              <p className="mt-4 max-w-xl font-body text-base leading-8 text-primary-foreground/70">
                A cinematic arrival. Unforgettable Mexico. At the beginning of the biggest adventure of a lifetime.
              </p>
            </div>
          </div>

          <div className="relative order-first min-h-[320px] overflow-hidden lg:order-none">
            <img
              src={COVER_FRONT}
              alt="La Inoficial featured visual"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-6 pb-6 pt-16">
              <div className="font-body text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                Hola Gringo Soundtrack
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
