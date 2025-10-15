Perfect—let’s simplify to a clean, skimmable outline. We’ll do a full replacement so your notes stay tidy.

**Command (open file):**

```bash
notepad "$(pwd -W)\MISSION5_Donations_Comparison.md"
```

**Paste this FULL REPLACEMENT and save:**

---

# Mission 5 — Donations Platforms (quick notes)

*Last updated: Oct 14, 2025 (PT). US-focused unless noted. Citations to be added after we lock picks.*

## What matters

* Fees: base %, per-txn ¢, intl add-ons, platform fees, donor-covers-fees option
* Payouts: timing, holds, instant options
* Risk: disputes/chargeback fee, fraud tools
* Recurring + receipts: native support, donor portal
* Wallets: Apple Pay / Google Pay / PayPal / Venmo / Cash App Pay / ACH
* Integration: hosted page/link, embeddable widget, or full API
* Fit for JirehFaith stack: Next.js static export + API; quick CTA support

---

## Stripe (processor)

* **Fees:** ~2.9% + $0.30 (nonprofit discount typically lower)
* **Payouts:** ~2 business days (after first-payout hold)
* **Risk:** $15 dispute fee; Stripe Radar
* **Recurring:** Yes (Stripe Billing)
* **Wallets:** Apple Pay, Google Pay, Link, ACH; Cash App Pay
* **Integrations:** Hosted Checkout or Elements/API
* **When to use:** Lowest dev friction + strong wallets + nonprofit pricing
Awesome. Let’s lock **Stripe** with fresh, cited details.

**Command (open file to append):**

```bash
notepad "$(pwd -W)\MISSION5_Donations_Comparison.md"
```

**Paste this *below* the Stripe section and save:**

---

### Stripe — verified details (sources locked 2025-10-14)

* **Nonprofit discount:** Stripe offers discounted fees for eligible 501(c)(3) nonprofits; apply via support (common US charity rate often cited as **~2.2% + $0.30**, AMEX may differ). ([Stripe Support][1])
* **Standard online card fees (baseline):** US reference point widely known as **2.9% + $0.30**; nonprofit approval can lower this. (Exact rate varies; confirm after Stripe approval.) ([Stripe Support][1])
* **Payout timing:** First payout typically **7–14 days** after first successful charge; then ongoing US payouts are commonly **~2 business days** (manual payouts doc also notes “typically arrive within 2 business days”). ([Stripe Support][2])
* **Disputes/chargebacks:** **$15 dispute fee** per chargeback (US). In 2025 Stripe introduced an **additional $15 “countered dispute” fee** if you choose to fight a dispute; refundable if you win. ([Stripe][3])
* **Fraud tools:** **Stripe Radar** included; advanced controls available (part of Stripe stack). ([Stripe][3])
* **Recurring donations:** Supported via **Stripe Billing** / recurring payments guides. ([Stripe Docs][4])
* **Wallets:** **Apple Pay** and **Google Pay** supported across Checkout/Elements; Express Checkout Element aggregates wallets. ([Stripe Docs][5])

> ✅ Conclusion (Stripe): Strong default for JirehFaith if we want nonprofit pricing, fast US payouts after ramp, robust wallets (Apple/Google Pay, Link), and a direct API/Elements path or hosted Checkout for speed.

---

Reply **“stripe locked”** and I’ll move to **PayPal/Braintree** with the same treatment (fees, payouts, disputes, wallets) and citations.

[1]: https://support.stripe.com/questions/fee-discount-for-nonprofit-organizations?utm_source=chatgpt.com "Fee discount for nonprofit organizations"
[2]: https://support.stripe.com/questions/where-is-my-payout-faq-for-late-and-missing-payouts?utm_source=chatgpt.com "Where is my payout? FAQ for late and missing payouts"
[3]: https://stripe.com/resources/more/chargebacks-101?utm_source=chatgpt.com "Chargebacks 101: What they are and how businesses can ..."
[4]: https://docs.stripe.com/recurring-payments?utm_source=chatgpt.com "Recurring payments"
[5]: https://docs.stripe.com/apple-pay?utm_source=chatgpt.com "Apple Pay"

## PayPal / Braintree (processor + checkout)

* **Fees:** PayPal Checkout ~2.89% + $0.49; charity ~1.99% + $0.49; intl add-ons
* **Payouts:** Balance instantly; bank transfer std/instant
* **Risk:** Dispute fee (tiered)
* **Recurring:** Yes (subscriptions)
* **Wallets:** PayPal, Venmo (US), Apple Pay / Google Pay via Braintree/SDK
* **Integrations:** JS SDK buttons; Braintree cards+wallets APIs
* **When to use:** Max donor familiarity (PayPal/Venmo) + quick go-live

Great—next we’ll lock **PayPal / Braintree** with fresh sources.

**Command (open file to append):**

```bash
notepad "$(pwd -W)\MISSION5_Donations_Comparison.md"
```

**Paste this *below* the PayPal / Braintree section and save:**

---

### PayPal / Braintree — verified details (sources locked 2025-10-14)

* **Charity rate (PayPal):** Confirmed charities: **1.99% + $0.49** per donation; standard business online **2.89% + $0.49** if not on charity program. ([PayPal][1])
* **Payouts / availability:** Funds appear in **PayPal balance immediately**; **Standard bank transfer 1–3 business days (free)**; **Instant transfer minutes (fee applies)**. ([PayPal][2])
* **Disputes/chargebacks:** PayPal assesses a **dispute fee**; fee tier depends on your **dispute rate** (Standard vs. High-Volume). ([PayPal][3])
* **Braintree charity pricing (cards):** For verified 501(c)(3), **2.19% + $0.29**; +**1%** non-USD; +**1%** if card issued outside US; **chargeback $15**; Venmo **3.49% + $0.49**; ACH **0.75%** (cap $5). ([Braintree][4])
* **Wallets via Braintree:** **Apple Pay** and **Google Pay** supported for web and mobile; enable in Control Panel and integrate via JS SDK; can also accept **PayPal via Google Pay** when both are enabled. ([Braintree Docs][5])

> ✅ Conclusion (PayPal/Braintree): Best when donor familiarity with **PayPal/Venmo** matters, and when you want **Apple/Google Pay** under the same umbrella using Braintree—with attractive **charity pricing** available on Braintree cards.

---

Reply **“paypal locked”** and I’ll proceed to **Square** with the same treatment and sources.

[1]: https://www.paypal.com/us/digital-wallet/send-receive-money/giving?utm_source=chatgpt.com "Donate Money | Give to Causes You Believe in"
[2]: https://www.paypal.com/us/cshelp/article/how-do-i-get-money-out-of-my-paypal-account-help394?utm_source=chatgpt.com "How do I get money out of my PayPal account?"
[3]: https://www.paypal.com/us/cshelp/article/what-is-the-paypal-dispute-fee-and-why-was-i-charged-one-help349?utm_source=chatgpt.com "What is the PayPal Dispute Fee and why was I charged one?"
[4]: https://www.braintreepayments.com/braintree-pricing?utm_source=chatgpt.com "PayPal Braintree Fees & Pricing"
[5]: https://developers.braintreepayments.com/guides/apple-pay/overview?utm_source=chatgpt.com "Overview"

## Square (processor)

* **Fees:** Online/API ~2.9% + $0.30; Links/Invoices can differ
* **Payouts:** Next business day; instant/same-day options
* **Risk:** No extra chargeback fee (generally)
* **Recurring:** Subscriptions / Recurring Invoices
* **Wallets:** Apple Pay, Google Pay (Web Payments SDK)
* **Integrations:** Payment Links or Web Payments SDK + Payments API
* **When to use:** Simple setup; predictable payouts; no dispute fee policy
**Command (open file to append Square):**

```bash
notepad "$(pwd -W)\MISSION5_Donations_Comparison.md"
```

**Paste this *below* the Square section and save:**

---

### Square — verified details (sources locked 2025-10-14)

* **Online/API fees (US):** **2.9% + $0.30** for Online Store / eCommerce API; **Payment Links / Invoices ~3.3% + $0.30** (ACH for invoices often **1%** with $1 min). ([Square][1])
* **Payout timing:** **Standard next-business-day** to bank if taken before **5 PM PT**; instant/same-day options available (fee applies). ([Square][2])
* **Disputes/chargebacks:** **No additional dispute fee**; Square covers the dispute-management fee when they challenge on your behalf. ([Square][3])
* **Recurring donations:** **Square Subscriptions** available, **$0/month**, transactions at online rates; can be used for **donations/memberships**. ([Square][4])
* **Wallets:** **Apple Pay** and **Google Pay** supported via **Web Payments SDK** (HTTPS required). Cash App Pay also supported in SDK scenarios. ([Square][5])

> ✅ Conclusion (Square): Simple pricing, **next-day deposits**, and **no dispute fee** are attractive. Good fit if we want a quick launch (Payment Links) or a customizable Web Payments SDK with Apple/Google Pay.

---

Reply **“square locked”** and I’ll move on to **Donorbox** with verified fees/behavior and sources.

[1]: https://squareup.com/us/en/pricing?utm_source=chatgpt.com "Square Processing Fees, Plans, and Software Pricing"
[2]: https://squareup.com/help/us/en/article/3807-deposit-options-with-square?utm_source=chatgpt.com "Set up and edit transfer options"
[3]: https://squareup.com/help/us/en/article/3882-payment-disputes-walkthrough?utm_source=chatgpt.com "Manage payment disputes | Square Support Center - US"
[4]: https://squareup.com/us/en/subscriptions?utm_source=chatgpt.com "Subscription Management - Subscription Billing"
[5]: https://developer.squareup.com/docs/web-payments/apple-pay?utm_source=chatgpt.com "Take an Apple Pay Payment"

## Donorbox (platform on Stripe/PayPal)

* **Fees:** Platform fee stack (varies by feature) + Stripe/PayPal processing
* **Payouts:** Follow connected Stripe/PayPal accounts
* **Risk:** Processor rules apply
* **Recurring:** Strong donor portal + CRM-style features
* **Wallets:** Apple/Google Pay (via Stripe), PayPal/Venmo, etc.
* **Integrations:** Hosted pages, embeddable forms/widgets
* **When to use:** Need donor UX + CRM quickly; ok with platform fee

**Command (open file to append Donorbox):**

```bash
notepad "$(pwd -W)\MISSION5_Donations_Comparison.md"
```

**Paste this *below* the Donorbox section and save:**

---

### Donorbox — verified details (sources locked 2025-10-14)

* **What it is:** Donorbox is a fundraising **platform**; payments are processed by your connected **Stripe and/or PayPal** accounts. Donorbox **never holds funds**; payouts follow the underlying processor’s schedule. ([Donorbox][1])
* **Platform fee (US):** **Standard plan: 2.95%** platform fee; **Premium: as low as 1.6%** for most features (Events/Memberships/Peer-to-Peer can be higher). Processing fees from **Stripe/PayPal apply separately** (only one processor fee per txn). ([Donorbox][2])
* **Wallets & pay methods:** Via Stripe/PayPal connections Donorbox supports **Apple Pay, Google Pay, Amazon Pay, Cash App Pay, Link by Stripe, Revolut Pay,** SEPA/ACH and others; **PayPal and Venmo** available when PayPal is connected. (Availability varies by region/processor.) ([Donorbox][3])
* **Recurring & donor experience:** Native **recurring donations**, **automatic tax receipts**, **year-end receipts**, and a **Donor Portal** where supporters can pause/change/cancel and download receipts. ([Donorbox][4])
* **Wallet setup notes:** Apple/Google Pay typically enabled via Stripe; hosted forms auto-support many wallets, embedded forms may require extra steps (e.g., Apple Pay domain association). **Stripe Link** is available on hosted forms (embedded coming). ([Donorbox][5])

> ✅ Conclusion (Donorbox): Fastest path to a polished donation flow + donor portal/CRM on top of your own Stripe/PayPal. Trade-off is the **platform fee** layered on top of processor fees.

---

Reply **“donorbox locked”** and I’ll proceed to **Givebutter** with verified, cited details.

[1]: https://donorbox.zendesk.com/hc/en-us/articles/360020292372-How-do-I-add-Stripe-and-or-PayPal-to-my-donation-forms?utm_source=chatgpt.com "How do I add Stripe and/or PayPal to my donation forms?"
[2]: https://donorbox.org/pricing?utm_source=chatgpt.com "Donorbox Pricing - Best Donation Software - Start for Free ..."
[3]: https://donorbox.zendesk.com/hc/en-us/articles/19527478056852-What-payment-methods-does-Donorbox-support?utm_source=chatgpt.com "What payment methods does Donorbox support?"
[4]: https://donorbox.org/features?utm_source=chatgpt.com "Unbox the power of donor-friendly fundraising features"
[5]: https://donorbox.org/nonprofit-blog/accept-apple-pay-donations?utm_source=chatgpt.com "How to Accept Apple Pay Donations with Donorbox"

## Givebutter (fundraising platform)

* **Fees:** Tip-based by default (org can opt to absorb fees); processor fees if tips off
* **Payouts:** Standard to bank; instant options may exist
* **Risk:** Processor rules apply
* **Recurring:** Yes, plus campaigns/events/teams
* **Wallets:** Cards, ACH, Apple/Google Pay, PayPal, Venmo (varies by setup)
* **Integrations:** Hosted pages, embeddable buttons/widgets
* **When to use:** Fast launch, rich campaigns, $0 software with tips on

**Command (open file to append Givebutter):**

```bash
notepad "$(pwd -W)\MISSION5_Donations_Comparison.md"
```

**Paste this *below* the Givebutter section and save:**

---

### Givebutter — verified details (sources locked 2025-10-14)

* **Pricing model:** Two modes —
  **Tips ON (Givebutter Guarantee):** org pays **$0 platform** and **$0 processing**; donors can tip, and Givebutter states they’ll cover costs even if donors don’t. ([Givebutter][1])
  **Tips OFF:** **3% platform fee** + payment processing; you can ask/require donors to cover or absorb it. ([Givebutter Help Center][2])
* **Payouts:** Standard payouts **free**; **instant payout** available for eligible accounts at **1.75%** of payout balance; Wallet transfers before **1pm ET** typically same-day to bank. ([Givebutter Help Center][3])
* **Methods & wallets:** Accepts **cards, ACH**, and via integrations **Venmo, PayPal, Apple Pay, Google Pay** (campaign-type dependent). ([G2][4])
* **Notes/caveats:** Funds generally pend **2–3 business days** before available to withdraw. Some reviewers note fee complexity at higher volumes if tips are off. ([Givebutter][5])

> ✅ Conclusion (Givebutter): Rich fundraising features and $0-cost path **if** tips are enabled; otherwise, budget for **3% platform + processor**. Strong donor-facing UX and quick payouts.

---

Reply **“givebutter locked”** and I’ll append **Zeffy** next.

[1]: https://givebutter.com/pricing?utm_source=chatgpt.com "Givebutter Fees & Pricing: How Is Givebutter Free?"
[2]: https://help.givebutter.com/en/articles/1512762-givebutter-standard-pricing-explained?utm_source=chatgpt.com "Givebutter Standard pricing explained"
[3]: https://help.givebutter.com/en/articles/1761146-how-to-withdraw-funds?utm_source=chatgpt.com "How to withdraw funds"
[4]: https://www.g2.com/products/givebutter/pricing?utm_source=chatgpt.com "Givebutter Pricing 2025"
[5]: https://givebutter.com/nonprofit-payment-processing?utm_source=chatgpt.com "Free Payment Processing for Nonprofits | Card Processing"

## Zeffy (100% free to nonprofits via donor tips)

* **Fees:** $0 processing for org; donor can add optional tip
* **Payouts:** Standard transfer schedule
* **Risk:** Processor rules behind the scenes
* **Recurring:** Yes; donor management tools included
* **Wallets:** Cards + wallets (varies by region)
* **Integrations:** Hosted forms/pages, embeddable widgets
* **When to use:** Minimize org fees; comfortable relying on donor tips

**Command (open file to append Zeffy):**

```bash
notepad "$(pwd -W)\MISSION5_Donations_Comparison.md"
```

**Paste this *below* the Zeffy section and save:**

---

### Zeffy — verified details (sources locked 2025-10-14)

* **Zero-fee model:** Zeffy states it **covers all Stripe processing fees**, so nonprofits receive **100% of donations**; donors can **optionally tip** Zeffy (not required). ([Zeffy Support][1])
* **Payout schedule:** **Weekly or monthly** payouts to your bank; default weekly. Docs note Friday initiation → funds Monday (weekly) after **1–3 day processing** for anti-fraud checks. ([Zeffy Support][2])
* **Methods & wallets:** Zeffy indicates multiple payment methods (varies by region); details live in payments/payouts help center. ([Zeffy Support][3])
* **Positioning:** Blog and help center emphasize **no platform or upgrade fees** and that Zeffy is a **B-Corp**; zero-fee narrative contrasted with industry norm fees (2.9% + $0.30). *(Marketing claims; we’ll still model donor-tip sensitivity in cost examples.)* ([Zeffy][4])

> ✅ Conclusion (Zeffy): If donor tipping remains high enough, Zeffy can yield **true $0 cost to the org** while keeping UX simple. We’ll include a sensitivity table (tip % assumptions) in our cost examples.

---

Reply **“zeffy locked”** and I’ll append **Tithely** next (fees, wallets incl. Apple/Google Pay, deposits) with citations.

[1]: https://support.zeffy.com/how-is-zeffy-free?utm_source=chatgpt.com "Zeffy really is free: No fees. No catch."
[2]: https://support.zeffy.com/how-often/-when-do-i-get-my-payout?utm_source=chatgpt.com "Payout schedules, amounts and reports"
[3]: https://support.zeffy.com/payments-and-payouts?utm_source=chatgpt.com "Payments and Payouts"
[4]: https://www.zeffy.com/home/free-online-fundraising-platform?utm_source=chatgpt.com "How is Zeffy 100% Free?"

## Tithe.ly (ministry-focused)

* **Fees:** Platform + processing schedule (cards/ACH); donor-covers-fees option
* **Payouts:** Regular cadence for churches/ministries
* **Risk:** Standard dispute handling
* **Recurring:** Strong recurring + text-to-give + church tools
* **Wallets:** Cards, ACH; Apple/Google Pay (check plan)
* **Integrations:** Hosted giving pages, site plugins, app
* **When to use:** Church-specific features (text-to-give, fund designations)

**Command (open file to append Tithely):**

```bash
notepad "$(pwd -W)\MISSION5_Donations_Comparison.md"
```

**Paste this *below* the Tithely section and save:**

---

### Tithely — verified details (sources locked 2025-10-14)

* **Fees (US):** **2.9% + $0.30** per card donation; **3.5% + $0.30** for AmEx; **ACH 1% + $0.30**. No monthly fee for Giving. ([help.tithe.ly][1])
* **Payouts/deposits:** Default **weekly (Wednesdays)**; cards settle with ~**2-business-day** delay; **ACH up to 10 business days**. Recent update (Oct 2025) notes deposits arrive consistently on scheduled day. ([help.tithe.ly][2])
* **Wallets:** **Apple Pay** and **Google Pay** supported (Tithely Giving app + supported flows). ([help.tithe.ly][3])
* **Donor-covers-fees:** **Cover the Fees™** lets donors offset fees so the church receives the intended full amount. ([help.tithe.ly][4])
* **Card-present (optional):** Tithely Pay rates: **2.6% + $0.10** (card present/contactless), **2.9% + $0.30** keyed. ([help.tithe.ly][5])

> ✅ **Conclusion (Tithely):** Ministry-focused stack (recurring, statements, funds, text-to-give) with **Apple/Google Pay** and **Cover the Fees™**. Fees are in the Stripe/PayPal ballpark; weekly deposits and ACH timing are the main operational considerations.

---

Reply **“tithely locked”** and I’ll open a small Notepad to start the **comparison table skeleton** before we run the cost examples.

[1]: https://help.tithe.ly/hc/en-us/articles/7442621160087-Tithely-Transaction-Fees-and-Subscription-Pricing?utm_source=chatgpt.com "Tithely Transaction Fees and Subscription Pricing"
[2]: https://help.tithe.ly/hc/en-us/articles/7279090109719-How-Often-Are-Funds-Deposited-to-the-Bank?utm_source=chatgpt.com "How Often Are Funds Deposited to the Bank?"
[3]: https://help.tithe.ly/hc/en-us/articles/24424858543767-How-to-Add-Apple-Pay-to-Tithely-Give?utm_source=chatgpt.com "How to Add Apple Pay to Tithely Give"
[4]: https://help.tithe.ly/hc/en-us/articles/7278954678935--Cover-the-Fees-Explained?utm_source=chatgpt.com "\"Cover the Fees™\" Explained"
[5]: https://help.tithe.ly/hc/en-us/articles/7369545691031-Tithely-Pay-Pricing-and-Fees?utm_source=chatgpt.com "Tithely Pay Pricing and Fees"

---

## Next steps (Mission 5 flow)

1. Lock fee lines + add citations for each (official pricing/help pages).
2. Build **comparison table** + **$10 / $50 / $100** net-to-org examples (donor covers fees: on/off).
3. Recommend primary + fallback and show **CTA button** choices (hosted vs API) + code snippet.

---

Reply **“done”** and I’ll proceed with Step 1 (Stripe fees/payouts/disputes) using fresh sources and append them cleanly under each provider.
