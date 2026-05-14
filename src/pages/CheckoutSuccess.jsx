import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle2, Download, Home, Loader2, MailCheck } from "lucide-react";
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
      <section className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-5 py-8 text-center">
        <div className="rounded-full bg-emerald-600 px-4 py-2 font-body text-xs font-black uppercase tracking-[0.16em] text-white shadow-xl shadow-emerald-600/25 md:text-sm">
          {tx.checkout_label}
        </div>

        <div className="mt-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-600 text-white shadow-2xl shadow-emerald-600/30 ring-4 ring-emerald-100 md:h-24 md:w-24">
          {state.status === "loading" ? (
            <Loader2 className="h-9 w-9 animate-spin md:h-10 md:w-10" />
          ) : (
            <CheckCircle2 className="h-10 w-10 md:h-12 md:w-12" />
          )}
        </div>

        <h1 className="mt-5 font-display text-3xl font-black tracking-tight text-emerald-700 md:text-5xl">
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
            <p className="mt-3 max-w-lg font-body text-sm font-semibold leading-6 text-foreground md:text-base md:leading-7">
              {tx.checkout_body}
            </p>

            <div className="mt-4 rounded-2xl border-2 border-emerald-200 bg-white p-3 shadow-2xl shadow-emerald-900/10">
              <QRCodeSVG value={downloadUrl} size={152} includeMargin />
            </div>

            <p className="mt-3 max-w-lg font-body text-xs font-bold uppercase tracking-[0.1em] text-emerald-700">
              {tx.checkout_once_note}
            </p>

            <a
              href={downloadUrl}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-7 py-3.5 font-body text-sm font-black uppercase tracking-[0.08em] text-white shadow-2xl shadow-emerald-600/30 transition hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-emerald-700/35 md:text-base"
            >
              <Download className="h-5 w-5" />
              {tx.checkout_download}
            </a>

            <div className="mt-4 flex max-w-lg items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-left shadow-lg shadow-emerald-900/5">
              <MailCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
              <p className="font-body text-xs font-bold leading-5 text-emerald-900">
                {tx.checkout_email_note}
              </p>
            </div>
          </>
        )}

        <Link
          to="/"
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2 font-body text-xs font-semibold text-foreground transition hover:border-primary hover:text-primary"
        >
          <Home className="h-4 w-4" />
          {tx.checkout_return_home}
        </Link>
      </section>
    </main>
  );
}
