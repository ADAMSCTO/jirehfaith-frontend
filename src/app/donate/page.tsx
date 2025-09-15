"use client";

import { PAYMENT_LINKS } from "@/lib/payments";

type Btn = {
  key: "stripe" | "paypal" | "applepay" | "googlepay";
  label: string;
};

const BUTTONS: Btn[] = [
  { key: "stripe", label: "Donate with Stripe" },
  { key: "paypal", label: "Donate with PayPal" },
  { key: "applepay", label: "Donate with Apple Pay" },
  { key: "googlepay", label: "Donate with Google Pay" },
];

export default function DonatePage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 text-white">
      <h1
        className="text-3xl font-bold mb-3"
        style={{ color: "var(--brand-gold)" }}
      >
        Support JirehFaith
      </h1>
      <p className="text-base mb-6">
        Choose a provider below to make a donation. Thank you for fueling this
        ministry.
      </p>

            <div className="grid gap-3">
        {BUTTONS.map(({ key, label }) => {
          const raw = PAYMENT_LINKS[key];
          const enabled = raw && raw !== "#";
          const href = enabled ? raw : undefined;

          return (
            <a
              key={key}
              href={href}
              onClick={enabled ? undefined : (e) => e.preventDefault()}
              aria-disabled={enabled ? undefined : "true"}
              className={
                "w-full rounded-xl border px-4 py-3 text-left transition " +
                (enabled ? "hover:shadow" : "opacity-60 cursor-not-allowed")
              }
              target={enabled ? "_blank" : undefined}
              rel={enabled ? "noopener noreferrer" : undefined}
              title={enabled ? undefined : "This method isn’t available yet."}
            >
              {label}
              {!enabled ? " (coming soon)" : ""}
            </a>
          );
        })}
      </div>

      <p className="text-xs mt-4 opacity-80">
        If a button is disabled, that method isn’t available yet.
      </p>
    </main>
  );
}
