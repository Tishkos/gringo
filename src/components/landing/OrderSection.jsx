import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Truck, Zap } from "lucide-react";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/translations";

const COVER_FRONT = "https://media.base44.com/images/public/user_6970ab0e6ab454a747b1106c/67fd0813d_lainoficialmexico.png";

export default function OrderSection() {
  const { lang } = useLang();
  const tx = t[lang];

  return (
    <section id="order" className="border-t border-border/50 bg-card/50">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="mb-12 max-w-2xl">
          <div className="font-body text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            {tx.order_label}
          </div>
          <h2 className="mt-3 font-display text-4xl font-black tracking-tight text-foreground md:text-5xl">
            {tx.order_headline}
          </h2>
          <p className="mt-4 font-body text-base leading-8 text-muted-foreground">
            {tx.order_body}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.45fr_0.55fr]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-[2rem] border border-border bg-card p-3 shadow-lg"
          >
            <img
              src={COVER_FRONT}
              alt="La Inoficial – Album Cover"
              className="aspect-square w-full rounded-[1.5rem] object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-[2rem] border border-border bg-card p-8 shadow-lg"
          >
            <div className="font-display text-xl font-bold tracking-tight text-foreground">
              {tx.order_summary}
            </div>

            <div className="mt-6 space-y-0 divide-y divide-border">
              <div className="flex items-center justify-between py-5">
                <div>
                  <div className="font-body text-sm font-semibold text-foreground">{tx.digital_title}</div>
                  <div className="font-body text-xs text-muted-foreground">{tx.digital_sub_note}</div>
                </div>
                <div className="font-display text-lg font-bold text-foreground">{tx.digital_price}</div>
              </div>

              <div className="flex items-center justify-between py-5">
                <div>
                  <div className="font-body text-sm font-semibold text-foreground">{tx.cd_title}</div>
                  <div className="font-body text-xs text-muted-foreground">{tx.cd_sub_note}</div>
                </div>
                <div className="font-display text-lg font-bold text-foreground">{tx.cd_price}</div>
              </div>

              <div className="flex items-center justify-between py-5">
                <div>
                  <div className="font-body text-sm font-semibold text-foreground">{tx.vinyl_title}</div>
                  <div className="font-body text-xs text-muted-foreground">{tx.vinyl_sub_note}</div>
                </div>
                <div className="font-display text-lg font-bold text-foreground">{tx.vinyl_price}</div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 font-body text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                {tx.trust_payment}
              </div>
              <div className="flex items-center gap-2 font-body text-xs text-muted-foreground">
                <Truck className="h-4 w-4 text-primary" />
                {tx.trust_shipping}
              </div>
              <div className="flex items-center gap-2 font-body text-xs text-muted-foreground">
                <Zap className="h-4 w-4 text-primary" />
                {tx.trust_download}
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <button className="rounded-2xl bg-primary px-4 py-3.5 font-body text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:shadow-xl">
                {tx.btn_buy_digital}
              </button>
              <button className="rounded-2xl border border-border bg-card px-4 py-3.5 font-body text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary">
                {tx.btn_order_cd}
              </button>
              <button className="rounded-2xl border border-border bg-card px-4 py-3.5 font-body text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary">
                {tx.btn_order_vinyl}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}