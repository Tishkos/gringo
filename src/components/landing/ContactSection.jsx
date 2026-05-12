import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageCircle, ChevronDown } from "lucide-react";
import { useLang } from "@/lib/LanguageContext";

const CONTACT_EMAIL = "astudilloestrella@gmail.com";
const WHATSAPP_URL = "https://wa.me/36704066713";

export default function ContactSection() {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);

  const content = {
    en: {
      label: "Contact & Collaboration",
      headline: "Get in Touch",
      collab_title: "Collaboration Requests",
      collab_body: "For partnerships, media, licensing, or creative collaborations, please get in touch directly.",
      collab_note: "All music, lyrics, and masters are fully owned by the artist.",
      btn_contact: "Contact",
      btn_email: "Send Email",
      btn_whatsapp: "WhatsApp",
    },
    es: {
      label: "Contacto y colaboración",
      headline: "Contáctanos",
      collab_title: "Solicitudes de colaboración",
      collab_body: "Para colaboraciones, medios, licencias o proyectos creativos, por favor contacta directamente.",
      collab_note: "Toda la música, las letras y los masters pertenecen al artista.",
      btn_contact: "Contacto",
      btn_email: "Enviar email",
      btn_whatsapp: "WhatsApp",
    },
  };

  const tx = content[lang];

  return (
    <section id="contact" className="border-t border-border/50 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">

          {/* Left — contact button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <div className="font-body text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                {tx.label}
              </div>
              <h2 className="mt-3 font-display text-4xl font-black tracking-tight text-foreground md:text-5xl">
                {tx.headline}
              </h2>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setOpen(!open)}
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-7 py-3.5 font-body text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:shadow-xl"
              >
                {tx.btn_contact}
                <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
              </button>

              {open && (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-6 py-3 font-body text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
                  >
                    <Mail className="h-4 w-4" />
                    {tx.btn_email}
                  </a>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-6 py-3 font-body text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {tx.btn_whatsapp}
                  </a>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right — collaboration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-[2rem] border border-border bg-card p-8 shadow-sm"
          >
            <div className="font-display text-xl font-bold tracking-tight text-foreground">
              {tx.collab_title}
            </div>
            <p className="mt-4 font-body text-sm leading-8 text-muted-foreground">
              {tx.collab_body}
            </p>
            <p className="mt-3 font-body text-xs leading-7 text-muted-foreground/70 italic">
              {tx.collab_note}
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
