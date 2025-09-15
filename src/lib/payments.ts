export type Provider = 'stripe' | 'paypal' | 'applepay' | 'googlepay';

// Only accept https:// values (empty otherwise)
const httpsOrEmpty = (v: string | undefined) => {
  const val = (v ?? '').trim();
  return val.startsWith('https://') ? val : '';
};

// Direct references so Next.js can inline them client-side
const STRIPE = httpsOrEmpty(process.env.NEXT_PUBLIC_STRIPE_LINK);
const PAYPAL = httpsOrEmpty(process.env.NEXT_PUBLIC_PAYPAL_LINK);
const APPLEPAY = httpsOrEmpty(process.env.NEXT_PUBLIC_APPLEPAY_LINK);
const GOOGLEPAY = httpsOrEmpty(process.env.NEXT_PUBLIC_GOOGLEPAY_LINK);

export const PAYMENT_LINKS: Record<Provider, string> = {
  stripe: STRIPE || '#',
  paypal: PAYPAL || '#',
  applepay: APPLEPAY || '#',
  googlepay: GOOGLEPAY || '#',
};

