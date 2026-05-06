import React, { useState } from "react";
import { Music, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/translations";
import { tracks } from "@/lib/trackData";

function TrackModal({ track, onClose, lang }) {
  const tx = t[lang];
  if (!track) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-[2rem] border border-border bg-card shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-[2rem] border-b border-border bg-card/95 backdrop-blur px-8 py-5">
            <div>
              <div className="font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">La Inoficial</div>
              <div className="font-display text-xl font-black text-foreground">{track.title}</div>
            </div>
            <button onClick={onClose} className="rounded-full border border-border p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-6 p-8 sm:grid-cols-[auto_1fr]">
            {/* Track cover */}
            <img src={track.cover} alt={track.title} className="w-28 h-28 rounded-2xl object-cover shadow-md border border-border" />

            <div className="space-y-1">
              <div className="font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">{tx.modal_description}</div>
              <p className="font-body text-sm leading-7 text-foreground">
                {lang === "en" ? track.description_en : track.description_es}
              </p>
            </div>
          </div>

          {/* Lyrics */}
          <div className="px-8 pb-6">
            <div className="mb-3 font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">{tx.modal_lyrics}</div>
            <div className="rounded-2xl bg-secondary/60 px-6 py-5 font-body text-sm leading-8 text-foreground whitespace-pre-line">
              {track.lyrics}
            </div>
          </div>

          {/* Production notes */}
          <div className="px-8 pb-8">
            <div className="mb-3 font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">{tx.modal_notes}</div>
            <p className="font-body text-sm leading-7 text-muted-foreground italic">
              {lang === "en" ? track.notes_en : track.notes_es}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function TracklistSection() {
  const { lang } = useLang();
  const tx = t[lang];
  const [selectedTrack, setSelectedTrack] = useState(null);

  return (
    <section id="music" className="border-y border-border/50 bg-card/50">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="mb-12 max-w-2xl">
          <div className="font-body text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            {tx.tracklist_label}
          </div>
          <h2 className="mt-3 font-display text-4xl font-black tracking-tight text-foreground md:text-5xl">
            {tx.tracklist_headline}
          </h2>
          <p className="mt-4 font-body text-base leading-8 text-muted-foreground">
            {tx.tracklist_body}
          </p>
          <p className="mt-2 font-body text-xs text-muted-foreground/60 italic">{tx.tracklist_click}</p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map((track, i) => (
            <motion.button
              key={track.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              onClick={() => setSelectedTrack(track)}
              className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-card px-5 py-4 shadow-sm transition hover:border-primary/30 hover:shadow-md text-left w-full cursor-pointer"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-body text-xs font-bold text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-body text-sm font-medium text-foreground">
                {track.title}
              </span>
              <Music className="ml-auto h-4 w-4 text-muted-foreground/40 transition group-hover:text-primary" />
            </motion.button>
          ))}
        </div>
      </div>

      {selectedTrack && (
        <TrackModal track={selectedTrack} onClose={() => setSelectedTrack(null)} lang={lang} />
      )}
    </section>
  );
}