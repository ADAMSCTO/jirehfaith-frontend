// === DONATE THANK-YOU PAGE — FULL FILE (uses next/link) ===
// src/app/donate/thank-you/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Thank You — JirehFaith",
  description: "Donation confirmation page for JirehFaith supporters.",
};

export default function ThankYouPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 text-white">
      <h1 className="text-3xl font-bold mb-3" style={{ color: "var(--brand-gold)" }}>
        Thank you for your gift!
      </h1>

      <p className="text-base opacity-90">
        We’ve received your donation. A receipt will be sent to your email shortly.
      </p>

      <div className="mt-6 space-y-2 text-sm opacity-85">
        <p>If you don’t see the email, please check your spam or promotions folder.</p>
        <p>May the Lord bless you and keep you.</p>
      </div>

      <div className="mt-8 flex gap-3 flex-wrap">
        <Link
          href="/"
          className="inline-block rounded-lg border border-[var(--brand-gold)] px-4 py-2 text-[var(--brand-gold)] hover:bg-[var(--brand-gold)] hover:text-black transition focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[var(--brand-gold)]"
          aria-label="Return to Home"
        >
          Home
        </Link>
        <Link
          href="/donate"
          className="inline-block rounded-lg border border-[var(--brand-gold)] px-4 py-2 text-[var(--brand-gold)] hover:bg-[var(--brand-gold)] hover:text-black transition focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[var(--brand-gold)]"
          aria-label="Back to Donate"
        >
          Back to Donate
        </Link>
      </div>
    </main>
  );
}
// === END THANK-YOU PAGE ===
