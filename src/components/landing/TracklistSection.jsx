import React, { useEffect, useRef, useState } from "react";
import { Music, Pause, Play } from "lucide-react";
import { motion } from "framer-motion";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/translations";
import { tracks } from "@/lib/trackData";

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
};

export default function TracklistSection() {
  const { lang } = useLang();
  const tx = t[lang];
  const audioRef = useRef(null);
  const [activeTrackId, setActiveTrackId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playback, setPlayback] = useState({ currentTime: 0, duration: 15 });

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const playTrack = async (track) => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      const audio = audioRef.current;

      if (activeTrackId === track.id && !audio.paused) {
        audio.pause();
        setIsPlaying(false);
        return;
      }

      if (activeTrackId === track.id && audio.paused) {
        await audio.play();
        setIsPlaying(true);
        return;
      }

      audio.pause();
      audio.src = track.previewSrc;
      audio.currentTime = 0;
      audio.onloadedmetadata = () => {
        setPlayback({
          currentTime: audio.currentTime,
          duration: audio.duration || 15,
        });
      };
      audio.ontimeupdate = () => {
        setPlayback({
          currentTime: audio.currentTime,
          duration: audio.duration || 15,
        });
      };
      audio.onended = () => {
        setActiveTrackId(null);
        setIsPlaying(false);
        setPlayback({ currentTime: 0, duration: 15 });
      };

      setActiveTrackId(track.id);
      setPlayback({ currentTime: 0, duration: 15 });
      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("Audio preview playback failed:", error);
      setActiveTrackId(null);
      setIsPlaying(false);
    }
  };

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
          <p className="mt-2 font-body text-xs text-muted-foreground/60 italic">
            {tx.tracklist_click}
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map((track, index) => {
            const isActive = activeTrackId === track.id;
            const Icon = isActive && isPlaying ? Pause : Play;
            const progress =
              isActive && playback.duration
                ? Math.min(100, (playback.currentTime / playback.duration) * 100)
                : 0;
            const currentTime = isActive ? playback.currentTime : 0;
            const duration = isActive ? playback.duration : 15;

            return (
              <motion.button
                key={track.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04 }}
                onClick={() => playTrack(track)}
                className={`group flex w-full cursor-pointer flex-col gap-3 rounded-2xl border px-5 py-4 text-left shadow-sm transition hover:border-primary/30 hover:shadow-md ${
                  isActive
                    ? "border-primary/40 bg-primary/10"
                    : "border-border/60 bg-card"
                }`}
              >
                <span className="flex w-full items-center gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-body text-xs font-bold text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-body text-sm font-medium text-foreground">
                      {track.title}
                    </span>
                    <span className="mt-1 block font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/60">
                      {isActive && isPlaying ? tx.tracklist_playing : tx.tracklist_preview}
                    </span>
                  </span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition group-hover:border-primary group-hover:text-primary">
                    {track.previewSrc ? (
                      <Icon className="h-4 w-4" />
                    ) : (
                      <Music className="h-4 w-4" />
                    )}
                  </span>
                </span>

                <span className="grid w-full grid-cols-[1fr_auto] items-center gap-3 pl-12">
                  <span className="h-1.5 overflow-hidden rounded-full bg-border/70">
                    <span
                      className="block h-full rounded-full bg-primary transition-[width]"
                      style={{ width: `${progress}%` }}
                    />
                  </span>
                  <span className="font-body text-[11px] tabular-nums text-muted-foreground/70">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
