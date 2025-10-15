# server/donations/stripe_checkout.py
"""
FastAPI router to create a Stripe Checkout Session for donations.

Env:
  STRIPE_SECRET_KEY = sk_live_... or sk_test_...
  DOMAIN_PUBLIC_URL = https://yourdomain.com  (used for success/cancel URLs)
  MOCK_STRIPE = 1 (optional; if set, returns a fake checkout URL for local wiring)

Route:
  POST /donate/stripe/checkout
Body:
  {
    "amount_cents": 5000,      # 100..1_000_000 (=$1..$10,000)
    "currency": "usd",
    "cover_fees": true,
    "metadata": {"source":"jirehfaith-web"}
  }
Response:
  { "id": "cs_test_...", "url": "https://checkout.stripe.com/..." }  # or mock URL when MOCK_STRIPE=1
"""
import os
import stripe
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter()
stripe.api_key = os.environ.get("STRIPE_SECRET_KEY", "")

class CreateSessionIn(BaseModel):
    amount_cents: int = Field(..., ge=100, le=1_000_000)
    currency: str = "usd"
    cover_fees: bool = True
    metadata: dict = {}

@router.post("/donate/stripe/checkout")
def create_session(data: CreateSessionIn):
    mock = os.environ.get("MOCK_STRIPE", "").strip().lower() in ("1", "true", "yes")

    domain = os.environ.get("DOMAIN_PUBLIC_URL", "").rstrip("/")
    success_url = f"{domain}/success" if domain else "http://localhost:3000/success"
    cancel_url  = f"{domain}/donate"  if domain else "http://localhost:3000/donate"

    # --- Mock mode: return a fake session so frontend can be wired/tested without Stripe
    if mock:
        fake_amount = data.amount_cents
        fake_url = f"{cancel_url}?mock=1&next={success_url}&amount_cents={fake_amount}"
        return {"id": "cs_test_mock_000", "url": fake_url}

    if not stripe.api_key:
        raise HTTPException(status_code=500, detail="Stripe not configured")

    try:
        # NOTE: If you want to truly gross-up when cover_fees=True, compute a higher amount
        # before calling Stripe. For now we accept the posted amount_cents.
        session = stripe.checkout.Session.create(
            mode="payment",
            line_items=[{
                "price_data": {
                    "currency": data.currency,
                    "product_data": {"name": "Donation"},
                    "unit_amount": data.amount_cents,
                },
                "quantity": 1,
            }],
            submit_type="donate",
            allow_promotion_codes=False,
            automatic_tax={"enabled": False},
            billing_address_collection="auto",
            success_url=success_url,
            cancel_url=cancel_url,
            metadata=data.metadata,
        )
        return {"id": session.id, "url": session.url}
    except stripe.error.StripeError as se:
        raise HTTPException(status_code=400, detail=str(se))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
