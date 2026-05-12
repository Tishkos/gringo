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
        <div className="rounded-full bg-emerald-600 px-6 py-3 font-body text-sm font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-emerald-600/25 md:text-base">
          {tx.checkout_label}
        </div>

        <div className="mt-8 flex h-28 w-28 items-center justify-center rounded-full bg-emerald-600 text-white shadow-2xl shadow-emerald-600/30 ring-8 ring-emerald-100 md:h-32 md:w-32">
          {state.status === "loading" ? (
            <Loader2 className="h-12 w-12 animate-spin md:h-14 md:w-14" />
          ) : (
            <CheckCircle2 className="h-14 w-14 md:h-16 md:w-16" />
          )}
        </div>

        <h1 className="mt-8 font-display text-5xl font-black tracking-tight text-emerald-700 md:text-7xl">
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
            <p className="mt-6 max-w-2xl font-body text-lg font-semibold leading-8 text-foreground md:text-xl md:leading-9">
              {tx.checkout_body}
            </p>

            <div className="mt-10 rounded-[2rem] border-2 border-emerald-200 bg-white p-6 shadow-2xl shadow-emerald-900/10">
              <QRCodeSVG value={downloadUrl} size={232} includeMargin />
            </div>

            <p className="mt-5 max-w-xl font-body text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">
              {tx.checkout_once_note}
            </p>

            <a
              href={downloadUrl}
              className="mt-9 inline-flex items-center justify-center gap-3 rounded-full bg-emerald-600 px-10 py-5 font-body text-lg font-black uppercase tracking-[0.08em] text-white shadow-2xl shadow-emerald-600/30 transition hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-emerald-700/35"
            >
              <Download className="h-6 w-6" />
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
