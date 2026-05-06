import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle2, Download, Home, Loader2 } from "lucide-react";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/translations";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export default function CheckoutSuccess() {
  const { lang } = useLang();
  const tx = t[lang];
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [state, setState] = useState({
    status: "loading",
    data: null,
    error: null,
  });

  const checkoutUrl = useMemo(() => {
    if (!sessionId) return null;
    return `${API_BASE_URL}/api/checkout/session/${encodeURIComponent(sessionId)}`;
  }, [sessionId]);

  useEffect(() => {
    if (!checkoutUrl) {
      setState({ status: "missing", data: null, error: null });
      return;
    }

    let isMounted = true;

    async function confirmCheckout() {
      try {
        const response = await fetch(checkoutUrl);
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.error || "Checkout confirmation failed");
        }

        if (isMounted) {
          setState({ status: "ready", data: payload, error: null });
        }
      } catch (error) {
        if (isMounted) {
          setState({ status: "error", data: null, error });
        }
      }
    }

    confirmCheckout();

    return () => {
      isMounted = false;
    };
  }, [checkoutUrl]);

  const downloadUrl = state.data?.downloadUrl;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="font-body text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          {tx.checkout_label}
        </div>

        <div className="mt-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
          {state.status === "loading" ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            <CheckCircle2 className="h-8 w-8" />
          )}
        </div>

        <h1 className="mt-6 font-display text-4xl font-black tracking-tight md:text-5xl">
          {state.status === "ready" ? tx.checkout_title : tx.checkout_loading}
        </h1>

        {state.status === "missing" && (
          <p className="mt-4 max-w-xl font-body text-sm leading-7 text-muted-foreground">
            {tx.checkout_missing}
          </p>
        )}

        {state.status === "error" && (
          <p className="mt-4 max-w-xl font-body text-sm leading-7 text-muted-foreground">
            {tx.checkout_error}
          </p>
        )}

        {state.status === "loading" && (
          <p className="mt-4 max-w-xl font-body text-sm leading-7 text-muted-foreground">
            {tx.checkout_loading}
          </p>
        )}

        {state.status === "ready" && downloadUrl && (
          <>
            <p className="mt-4 max-w-xl font-body text-sm leading-7 text-muted-foreground">
              {tx.checkout_body}
            </p>

            <div className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-lg">
              <QRCodeSVG value={downloadUrl} size={196} includeMargin />
            </div>

            <p className="mt-4 font-body text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {tx.checkout_once_note}
            </p>

            <a
              href={downloadUrl}
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 font-body text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:shadow-xl"
            >
              <Download className="h-4 w-4" />
              {tx.checkout_download}
            </a>
          </>
        )}

        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-5 py-3 font-body text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
        >
          <Home className="h-4 w-4" />
          {tx.checkout_return_home}
        </Link>
      </section>
    </main>
  );
}
