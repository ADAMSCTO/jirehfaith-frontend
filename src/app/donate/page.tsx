// === DONATE PAGE v3 — FULL FILE (Stripe USD + PayPal redirect) ===
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Script from "next/script";
import { getLang, onLangChange, preloadCurrentLang, t, type Lang } from "@/lib/i18n";

declare global {
  interface Window {
    paypal?: any;
    [key: string]: any;
    NEXT_PUBLIC_API_BASE?: string;
    NEXT_PUBLIC_PAYPAL_CLIENT_ID?: string;
  }
}

// ---- Config -----------------------------------------------------------------
const API_BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE) ||
  (typeof window !== "undefined" && (window as any).NEXT_PUBLIC_API_BASE) ||
  "http://127.0.0.1:8081";

const RAW_PAYPAL_CLIENT_ID =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) ||
  (typeof window !== "undefined" && (window as any).NEXT_PUBLIC_PAYPAL_CLIENT_ID) ||
  "";

const PP_NS = "paypal_jf";

// Build absolute URL to backend
function api(path: string) {
  return `${String(API_BASE).replace(/\/$/, "")}${path}`;
}

// Safe i18n helper
function tr(key: string, lang: Lang, fallback: string) {
  const val = t(key, lang);
  if (!val) return fallback;
  return val === key ? fallback : val;
}

type Preset = { label: string; cents: number };
const PRESETS: Preset[] = [
  { label: "$5", cents: 500 },
  { label: "$10", cents: 1000 },
  { label: "$25", cents: 2500 },
  { label: "$50", cents: 5000 },
];

// ---- Brand Icons -------------------------------------------------------------
function VisaIcon() {
  return (
    <svg viewBox="0 0 48 32" width="48" height="32" aria-label="Visa" role="img" className="inline-block align-[-0.2em] mx-1">
      <rect width="48" height="32" rx="4" fill="#1a1f71" />
      <text x="50%" y="58%" textAnchor="middle" fontSize="12" fill="#ffffff" fontFamily="Arial, Helvetica, sans-serif">VISA</text>
    </svg>
  );
}
function MastercardIcon() {
  return (
    <svg viewBox="0 0 48 32" width="48" height="32" aria-label="Mastercard" role="img" className="inline-block align-[-0.2em] mx-1">
      <rect width="48" height="32" rx="4" fill="#ffffff" />
      <circle cx="20" cy="16" r="8" fill="#eb001b" />
      <circle cx="28" cy="16" r="8" fill="#f79e1b" />
      <path d="M24 8 a8 8 0 0 0 0 16 a8 8 0 0 0 0 -16z" fill="#ff5f00" />
    </svg>
  );
}
function AmexIcon() {
  return (
    <svg viewBox="0 0 48 32" width="48" height="32" aria-label="American Express" role="img" className="inline-block align-[-0.2em] mx-1">
      <rect width="48" height="32" rx="4" fill="#2e77bc" />
      <text x="50%" y="58%" textAnchor="middle" fontSize="9.5" fill="#ffffff" fontFamily="Arial, Helvetica, sans-serif">AMEX</text>
    </svg>
  );
}
function DiscoverIcon() {
  return (
    <svg viewBox="0 0 48 32" width="48" height="32" aria-label="Discover" role="img" className="inline-block align-[-0.2em] mx-1">
      <rect width="48" height="32" rx="4" fill="#000000" />
      <circle cx="31" cy="16" r="8.5" fill="#f47216" />
    </svg>
  );
}
function StripeLockup() {
  return (
    <span className="ml-3 flex items-center gap-2" aria-hidden="true">
      <svg viewBox="0 0 60 24" width="60" height="24" className="opacity-90">
        <title>Stripe</title>
        <rect width="60" height="24" rx="4" fill="#635bff" />
        <text x="50%" y="60%" textAnchor="middle" fontSize="11" fill="#ffffff" fontFamily="Arial, Helvetica, sans-serif">
          STRIPE
        </text>
      </svg>
      <VisaIcon />
      <MastercardIcon />
      <AmexIcon />
      <DiscoverIcon />
    </span>
  );
}

// -----------------------------------------------------------------------------

export default function DonatePage() {
  const [lang, setLang] = useState<Lang>("en");
  const [amountCents, setAmountCents] = useState<number>(PRESETS[0].cents);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [coverFees, setCoverFees] = useState<boolean>(true);
  const [busy, setBusy] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // PayPal
  const [ppClientId, setPpClientId] = useState<string>("");
  const [paypalReady, setPaypalReady] = useState<boolean>(false);
  const paypalDivRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const current = getLang();
    setLang(current);
    preloadCurrentLang();
    const unsub = onLangChange((l) => setLang(l));
    return () => unsub();
  }, []);

  // Decide PayPal client id (support sandbox via ?pp=sandbox or #pp=sandbox)
  useEffect(() => {
    let cid = RAW_PAYPAL_CLIENT_ID;
    try {
      const u = new URL(window.location.href);
      if (u.searchParams.get("pp") === "sandbox" || u.hash.includes("pp=sandbox")) {
        cid = "sb";
      }
    } catch {}
    setPpClientId(cid);
  }, []);

  // Effective amount in cents (preset or custom)
  const effectiveCents = useMemo(() => {
    const v = customAmount.trim();
    if (!v) return amountCents;
    const normalized = v.replace(/[$,\s]/g, "");
    const num = Number(normalized);
    if (!isFinite(num) || num <= 0) return amountCents;
    return Math.round(num * 100);
  }, [customAmount, amountCents]);

  // ---------------- Stripe Checkout ----------------
  async function handleStripeCheckout() {
    try {
      setBusy(true);
      setError("");
      const res = await fetch(api("/donate/stripe/checkout"), {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          amount_cents: effectiveCents,
          currency: "USD", // <-- normalized to uppercase
          cover_fees: coverFees,
          metadata: { source: "donation-page" },
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      if (!data?.url) throw new Error("Missing Checkout URL");
      window.location.href = data.url;
    } catch (e: any) {
      setError(typeof e?.message === "string" ? e.message : "Checkout failed");
    } finally {
      setBusy(false);
    }
  }

  // ---------------- PayPal Smart Buttons (static SDK via next/script) ---------
  function handlePaypalSdkLoad() {
    try {
      const ns = (window as any)[PP_NS];
      setPaypalReady(!!ns?.Buttons);
    } catch {
      setPaypalReady(false);
    }
  }

  // Render buttons once ready
  useEffect(() => {
    if (!paypalReady || !(window as any)[PP_NS]?.Buttons || !paypalDivRef.current) return;

    const btn = (window as any)[PP_NS].Buttons({
      style: { layout: "horizontal", height: 42, label: "donate", shape: "rect", color: "gold", tagline: false },
      createOrder: async () => {
        // Guard tiny amounts
        if (effectiveCents < 50) {
          throw new Error("Minimum amount is $0.50");
        }
        const res = await fetch(api("/donate/paypal/create"), {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify({ amount_cents: effectiveCents, currency: "USD", metadata: { source: "donation-page" } }),
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        return data?.id;
      },
      onApprove: async (data: any) => {
        try {
          setBusy(true);
          setError("");
          const res = await fetch(api("/donate/paypal/capture"), {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify({ order_id: data?.orderID }),
          });
          if (!res.ok) throw new Error(await res.text());
          // On success, take donor to the Thank You page
          await res.json(); // consume JSON (optional)
          window.location.href = "/donate/thank-you";
        } catch (e: any) {
          setError(typeof e?.message === "string" ? e.message : "PayPal capture failed");
        } finally {
          setBusy(false);
        }
      },
      onError: (err: any) => setError(`PayPal error: ${String(err?.message || err)}`),
    });

    try {
      paypalDivRef.current.innerHTML = "";
      btn.render(paypalDivRef.current);
    } catch {}
  }, [paypalReady, effectiveCents]);

  // Build SDK src when we have a client id
  const paypalSdkSrc =
    ppClientId
      ? `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(ppClientId)}&components=buttons&currency=USD&intent=capture&commit=true&enable-funding=venmo&disable-funding=card,paylater`
      : "";

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 text-white">
      {/* Static PayPal SDK (namespaced) */}
      {paypalSdkSrc && (
        <Script
          src={paypalSdkSrc}
          strategy="afterInteractive"
          data-namespace={PP_NS}
          crossOrigin="anonymous"
          onLoad={handlePaypalSdkLoad}
          onError={() => setPaypalReady(false)}
        />
      )}

      <h1 className="text-3xl font-bold mb-3 text-[var(--brand-gold)]">
        {tr("donate.title", lang, "Support JirehFaith")}
      </h1>

      <p className="text-base mb-6">{tr("donate.lead", lang, "Your gift helps us advance the Mission.")}</p>

      {/* Amounts */}
      <section className="mb-5">
        <label className="block text-sm mb-2">
          {tr("donate.amountLabel", lang, "Choose an amount")}
        </label>

        <div className="flex flex-wrap gap-2 mb-3">
          {PRESETS.map((p) => {
            const isActive = effectiveCents === p.cents && !customAmount;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setAmountCents(p.cents);
                  setCustomAmount("");
                }}
                className={[
                  "rounded-xl px-3 py-2 text-sm",
                  isActive
                    ? "font-semibold border border-[var(--brand-gold)] bg-[var(--brand-gold)] text-black shadow-sm"
                    : "border border-white/25 text-white bg-white/5 hover:bg-white/10",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/50 focus-visible:ring-offset-black transition",
                ].join(" ")}
                aria-pressed={isActive ? "true" : "false"}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm" htmlFor="custom">
            {tr("donate.customAmount", lang, "Or enter a custom amount")}
          </label>
          <input
            id="custom"
            inputMode="decimal"
            placeholder="$"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="flex-1 rounded-lg bg-black/20 border border-white/25 px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            aria-label={tr("donate.customAmount", lang, "Or enter a custom amount")}
          />
        </div>

        <div className="mt-3 flex items-center gap-2">
          <input
            id="cover"
            type="checkbox"
            checked={coverFees}
            onChange={(e) => setCoverFees(e.target.checked)}
            className="h-4 w-4"
          />
          <label htmlFor="cover" className="text-sm">
            {tr("donate.coverFees", lang, "Add a little extra to cover processing fees")}
          </label>
        </div>
      </section>

      {/* Buttons */}
      <div className="grid gap-3">
        {/* Stripe */}
        <button
          onClick={handleStripeCheckout}
          disabled={busy || effectiveCents < 50}
          className={[
            "w-full rounded-xl border px-4 py-3 text-left transition",
            "flex items-center justify-between",
            "border-white/25 bg-white/5 hover:bg-white/10 hover:shadow",
            busy || effectiveCents < 50 ? "opacity-60 cursor-not-allowed" : "",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/60 focus-visible:ring-offset-black",
          ].join(" ")}
          aria-busy={busy ? "true" : undefined}
          aria-label="Donate with Stripe"
        >
          <span>{busy ? tr("donate.processing", lang, "Processing…") : tr("donate.stripe", lang, "Pay with Stripe")}</span>
          <StripeLockup />
        </button>

        {/* Wallets note under Stripe */}
        <p className="text-xs opacity-80 -mt-1">
          {tr("donate.walletsNote", lang, "Apple Pay / Google Pay available on eligible devices at checkout.")}
        </p>

        {/* PayPal (Smart Buttons only; no fallback/extra buttons) */}
        <div className="max-w-xl">
          <div
            ref={paypalDivRef}
            className="rounded-xl border border-white/25 px-3 py-2 bg-white/5 flex items-center justify-center min-h-[56px]"
            aria-busy={!paypalReady ? "true" : undefined}
          >
            {!paypalReady && <span className="text-sm opacity-80">{tr("donate.loadingPaypal", lang, "Loading PayPal…")}</span>}
          </div>
        </div>
      </div>

      {!!error && (
        <p className="mt-4 text-sm text-red-300" role="alert">
          {error}
        </p>
      )}

      <p className="text-xs mt-4 opacity-80">
        {tr("donate.note", lang, "Donations are processed securely. Thank you for your generosity!")}
      </p>
      <p className="text-xs mt-1 opacity-80">
        {tr("donate.receiptNote", lang, "A receipt will be emailed to you after payment.")}
      </p>
    </main>
  );
}
// === END DONATE PAGE v3 ===
