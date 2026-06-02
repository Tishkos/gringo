import React, { useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  CheckCircle2,
  Copy,
  Download,
  Loader2,
  LogOut,
  Plus,
  QrCode,
  RefreshCw,
  ShieldCheck,
  XCircle,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

function formatDate(value) {
  if (!value) return "Never";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function safeFileName(value) {
  return String(value || "marketing-qr")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload?.error || "Request failed.");
  }

  return payload;
}

function StatTile({ label, value }) {
  return (
    <div className="rounded-md border border-border bg-card px-4 py-3">
      <p className="font-body text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-display text-3xl font-black text-foreground">{value}</p>
    </div>
  );
}

function QrCodeCard({ code, copiedToken, onCopy, onDownload, onView }) {
  const isUsed = code.downloads >= code.maxDownloads;
  const qrId = `qr-${code.token}`;

  return (
    <article className="grid gap-4 rounded-md border border-border bg-card p-4 shadow-sm md:grid-cols-[160px_minmax(0,1fr)]">
      <div 
        className="flex items-center justify-center rounded-md border border-border bg-white p-2 cursor-pointer hover:opacity-85 hover:border-primary/50 transition-all shadow-sm"
        onClick={() => onView(code)}
        title="Click to view full screen"
      >
        <QRCodeSVG
          id={qrId}
          value={code.downloadUrl}
          size={132}
          includeMargin
          bgColor="#ffffff"
          fgColor="#1f130e"
          level="M"
        />
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate font-body text-base font-black text-foreground">
              {code.campaignName}
            </h2>
            <p className="mt-1 break-all font-mono text-xs text-muted-foreground">
              {code.token.slice(0, 16)}...
            </p>
          </div>

          <span
            className={`inline-flex items-center gap-1 rounded-md px-2 py-1 font-body text-xs font-black uppercase tracking-[0.1em] ${
              isUsed
                ? "bg-red-100 text-red-800"
                : "bg-emerald-100 text-emerald-800"
            }`}
          >
            {isUsed ? <XCircle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
            {isUsed ? "Used" : "Ready"}
          </span>
        </div>

        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="font-body text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
              Downloads
            </dt>
            <dd className="mt-1 font-body font-bold text-foreground">
              {code.downloads}/{code.maxDownloads}
            </dd>
          </div>
          <div>
            <dt className="font-body text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
              Created
            </dt>
            <dd className="mt-1 font-body text-foreground">{formatDate(code.createdAt)}</dd>
          </div>
          <div>
            <dt className="font-body text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
              Expires
            </dt>
            <dd className="mt-1 font-body text-foreground">{formatDate(code.expiresAt)}</dd>
          </div>
        </dl>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => onCopy(code)}>
            <Copy className="h-4 w-4" />
            {copiedToken === code.token ? "Copied" : "Copy link"}
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={() => onDownload(code, qrId)}>
            <Download className="h-4 w-4" />
            SVG
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={() => onView(code)}>
            <Maximize2 className="h-4 w-4" />
            Full Screen
          </Button>
        </div>
      </div>
    </article>
  );
}

export default function Admin() {
  const [session, setSession] = useState({
    status: "loading",
    authenticated: false,
    configured: false,
    email: "director@gringo.media",
  });
  const [loginForm, setLoginForm] = useState({
    email: "director@gringo.media",
    password: "",
  });
  const [generatorForm, setGeneratorForm] = useState({
    campaignName: "Marketing",
    quantity: 1,
  });
  const [codes, setCodes] = useState([]);
  const [totals, setTotals] = useState({ total: 0, available: 0, used: 0 });
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedToken, setCopiedToken] = useState(null);
  const [activeQr, setActiveQr] = useState(null);

  const newestCodes = useMemo(() => codes.slice(0, 24), [codes]);

  async function refreshCodes() {
    setIsRefreshing(true);

    try {
      const payload = await apiFetch("/api/admin/marketing-qr-codes");
      setCodes(payload.codes || []);
      setTotals(payload.totals || { total: 0, available: 0, used: 0 });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsRefreshing(false);
    }
  }

  async function loadSession() {
    try {
      const payload = await apiFetch("/api/admin/session");
      setSession({
        status: "ready",
        authenticated: payload.authenticated,
        configured: payload.configured,
        email: payload.email || "director@gringo.media",
      });
      setLoginForm((current) => ({
        ...current,
        email: payload.email || current.email,
      }));

      if (payload.authenticated) {
        await refreshCodes();
      }
    } catch (error) {
      setSession((current) => ({ ...current, status: "ready" }));
      setMessage({ type: "error", text: error.message });
    }
  }

  useEffect(() => {
    loadSession();
  }, []);

  async function handleLogin(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const payload = await apiFetch("/api/admin/login", {
        method: "POST",
        body: JSON.stringify(loginForm),
      });
      setSession({
        status: "ready",
        authenticated: true,
        configured: true,
        email: payload.email,
      });
      setLoginForm((current) => ({ ...current, password: "" }));
      await refreshCodes();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLogout() {
    setIsSubmitting(true);

    try {
      await apiFetch("/api/admin/logout", { method: "POST" });
      setSession((current) => ({ ...current, authenticated: false }));
      setCodes([]);
      setTotals({ total: 0, available: 0, used: 0 });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGenerate(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const payload = await apiFetch("/api/admin/marketing-qr-codes", {
        method: "POST",
        body: JSON.stringify({
          campaignName: generatorForm.campaignName,
          quantity: generatorForm.quantity,
        }),
      });
      setMessage({
        type: "success",
        text: `${payload.codes?.length || 0} QR code${payload.codes?.length === 1 ? "" : "s"} generated.`,
      });
      await refreshCodes();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCopy(code) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code.downloadUrl);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = code.downloadUrl;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopiedToken(code.token);
      window.setTimeout(() => setCopiedToken(null), 1600);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  }

  function handleDownload(code, qrId) {
    const svg = document.getElementById(qrId);

    if (!svg) {
      setMessage({ type: "error", text: "QR code is not ready yet." });
      return;
    }

    const svgText = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${safeFileName(code.campaignName)}-${code.token.slice(0, 8)}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  if (session.status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-5 text-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </main>
    );
  }

  if (!session.authenticated) {
    return (
      <main className="min-h-screen bg-background px-5 py-10 text-foreground">
        <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md flex-col justify-center">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-body text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
                Hola Gringo
              </p>
              <h1 className="font-display text-4xl font-black text-foreground">
                Admin
              </h1>
            </div>
          </div>

          <form className="rounded-md border border-border bg-card p-5 shadow-sm" onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  autoComplete="username"
                  value={loginForm.email}
                  onChange={(event) =>
                    setLoginForm((current) => ({ ...current, email: event.target.value }))
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  value={loginForm.password}
                  onChange={(event) =>
                    setLoginForm((current) => ({ ...current, password: event.target.value }))
                  }
                  required
                />
              </div>

              {message && (
                <p
                  className={`rounded-md border px-3 py-2 font-body text-sm ${
                    message.type === "error"
                      ? "border-red-200 bg-red-50 text-red-800"
                      : "border-emerald-200 bg-emerald-50 text-emerald-800"
                  }`}
                >
                  {message.text}
                </p>
              )}

              {!session.configured && (
                <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 font-body text-sm text-amber-900">
                  Admin password is not configured on the server.
                </p>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting || !session.configured}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                Sign in
              </Button>
            </div>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground md:px-8">
      <section className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-body text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
              Hola Gringo
            </p>
            <h1 className="font-display text-4xl font-black text-foreground md:text-5xl">
              QR Admin
            </h1>
            <p className="mt-1 font-body text-sm text-muted-foreground">
              {session.email}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={refreshCodes} disabled={isRefreshing}>
              {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Refresh
            </Button>
            <Button type="button" variant="secondary" onClick={handleLogout} disabled={isSubmitting}>
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </header>

        <section className="mt-6 grid gap-3 sm:grid-cols-3">
          <StatTile label="Total" value={totals.total} />
          <StatTile label="Ready" value={totals.available} />
          <StatTile label="Used" value={totals.used} />
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          <form className="h-fit rounded-md border border-border bg-card p-5 shadow-sm" onSubmit={handleGenerate}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                <QrCode className="h-5 w-5" />
              </div>
              <h2 className="font-body text-lg font-black text-foreground">Generate QR</h2>
            </div>

            <div className="mt-5 grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="campaign-name">Campaign</Label>
                <Input
                  id="campaign-name"
                  value={generatorForm.campaignName}
                  maxLength={80}
                  onChange={(event) =>
                    setGeneratorForm((current) => ({
                      ...current,
                      campaignName: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="qr-quantity">Quantity</Label>
                <Input
                  id="qr-quantity"
                  type="number"
                  min="1"
                  max="100"
                  value={generatorForm.quantity}
                  onChange={(event) =>
                    setGeneratorForm((current) => ({
                      ...current,
                      quantity: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              {message && (
                <p
                  className={`rounded-md border px-3 py-2 font-body text-sm ${
                    message.type === "error"
                      ? "border-red-200 bg-red-50 text-red-800"
                      : "border-emerald-200 bg-emerald-50 text-emerald-800"
                  }`}
                >
                  {message.text}
                </p>
              )}

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Generate
              </Button>
            </div>
          </form>

          <div className="grid gap-3">
            {newestCodes.length === 0 ? (
              <div className="flex min-h-[280px] items-center justify-center rounded-md border border-dashed border-border bg-card p-8 text-center">
                <div>
                  <QrCode className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-3 font-body text-sm font-bold text-muted-foreground">
                    No marketing QR codes yet.
                  </p>
                </div>
              </div>
            ) : (
              newestCodes.map((code) => (
                <QrCodeCard
                  key={code.token}
                  code={code}
                  copiedToken={copiedToken}
                  onCopy={handleCopy}
                  onDownload={handleDownload}
                  onView={setActiveQr}
                />
              ))
            )}
          </div>
        </section>
      </section>

      {activeQr && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setActiveQr(null)}
        >
          <div 
            className="relative w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl text-center flex flex-col items-center gap-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              type="button" 
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-full hover:bg-secondary/50"
              onClick={() => setActiveQr(null)}
            >
              <XCircle className="h-6 w-6" />
            </button>

            <div className="space-y-1 mt-2">
              <p className="font-body text-xs font-bold uppercase tracking-[0.16em] text-primary">
                Hola Gringo
              </p>
              <h3 className="font-display text-2xl font-black text-foreground">
                {activeQr.campaignName}
              </h3>
              <p className="font-mono text-xs text-muted-foreground select-all mt-1">
                {activeQr.token}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-border shadow-inner mt-4 flex justify-center items-center">
              <QRCodeSVG
                id={`qr-modal-${activeQr.token}`}
                value={activeQr.downloadUrl}
                size={280}
                level="H"
                bgColor="#ffffff"
                fgColor="#1f130e"
                includeMargin
              />
            </div>

            <p className="text-sm font-body text-muted-foreground break-all max-w-sm mt-2">
              Scan to download album or visit:<br />
              <a href={activeQr.downloadUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                {activeQr.downloadUrl}
              </a>
            </p>

            <div className="mt-4 flex w-full gap-2">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1" 
                onClick={() => handleCopy(activeQr)}
              >
                <Copy className="h-4 w-4" />
                {copiedToken === activeQr.token ? "Copied Link" : "Copy Link"}
              </Button>
              <Button 
                type="button" 
                variant="default" 
                className="flex-1" 
                onClick={() => handleDownload(activeQr, `qr-modal-${activeQr.token}`)}
              >
                <Download className="h-4 w-4" />
                Download SVG
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
