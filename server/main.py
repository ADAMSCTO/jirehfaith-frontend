# server/main.py
from fastapi import FastAPI
from server.donations.stripe_checkout import router as stripe_donate_router

app = FastAPI(title="JirehFaith Donations API")

# Routers
app.include_router(stripe_donate_router, tags=["donations"])

@app.get("/healthz")
def healthz():
    return {"ok": True}
