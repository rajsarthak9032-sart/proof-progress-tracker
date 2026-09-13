import logging
from typing import Dict, Any
from fastapi import APIRouter, Header, HTTPException, Depends

from app.schemas import SubscriptionStatus, RevenueCatWebhookPayload
from app.config import settings
from app.services.supabase_service import SupabaseService, _memory_journeys

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/subscriptions", tags=["Subscriptions"])

# In-memory subscription status mapping: user_id -> SubscriptionStatus
_user_subscriptions: Dict[str, SubscriptionStatus] = {}

@router.get("/status", response_model=SubscriptionStatus)
async def get_subscription_status(
    user_id: str = Depends(SupabaseService.get_current_user_id)
):
    """
    Returns user subscription entitlement status.
    In production, this is synced with RevenueCat webhooks.
    """
    status = _user_subscriptions.get(user_id)
    if not status:
        status = SubscriptionStatus(
            is_pro=False,
            entitlement_active=False,
            entitlement_id="proof_pro",
            source="revenuecat"
        )
    return status

@router.get("/limits")
async def get_tier_limits(
    user_id: str = Depends(SupabaseService.get_current_user_id)
):
    """
    Returns feature allowances based on RevenueCat entitlement status.
    Free tier: 1 active journey, basic timeline, limited AI insights, limited stories.
    Pro tier: Unlimited journeys, advanced AI insights, unlimited stories, advanced comparison & scrub.
    """
    status = await get_subscription_status(user_id)
    active_journeys_count = sum(1 for j in _memory_journeys.values() if j.get("user_id") == user_id and j.get("is_active", True))

    if status.is_pro:
        return {
            "tier": "pro",
            "is_pro": True,
            "max_active_journeys": 9999,
            "active_journeys_count": active_journeys_count,
            "can_create_journey": True,
            "advanced_time_travel": True,
            "advanced_before_after": True,
            "advanced_ai_insights": True,
            "unlimited_stories": True,
            "premium_export": True
        }
    else:
        return {
            "tier": "free",
            "is_pro": False,
            "max_active_journeys": 1,
            "active_journeys_count": active_journeys_count,
            "can_create_journey": active_journeys_count < 1,
            "advanced_time_travel": False,
            "advanced_before_after": False,
            "advanced_ai_insights": False,
            "unlimited_stories": False,
            "premium_export": False
        }

@router.post("/webhook")
async def revenuecat_webhook(
    payload: RevenueCatWebhookPayload,
    authorization: str = Header(None)
):
    """
    Secure endpoint receiving real-time webhook events from RevenueCat.
    Updates server-side entitlement records when subscriptions are purchased, renewed, or expired.
    """
    if settings.REVENUECAT_WEBHOOK_AUTH_HEADER:
        if authorization != settings.REVENUECAT_WEBHOOK_AUTH_HEADER:
            raise HTTPException(status_code=401, detail="Unauthorized webhook signature.")

    event = payload.event
    event_type = event.get("type")
    app_user_id = event.get("app_user_id")
    entitlements = event.get("entitlement_ids", [])
    product_id = event.get("product_id")

    logger.info(f"RevenueCat webhook received: {event_type} for user {app_user_id}")

    if app_user_id:
        has_pro = "proof_pro" in entitlements or event_type in ["INITIAL_PURCHASE", "RENEWAL"]
        is_revoked = event_type in ["CANCELLATION", "EXPIRATION"]

        _user_subscriptions[app_user_id] = SubscriptionStatus(
            is_pro=has_pro and not is_revoked,
            entitlement_active=has_pro and not is_revoked,
            entitlement_id="proof_pro",
            active_product_id=product_id,
            source="revenuecat_webhook"
        )

    return {"status": "received", "event_type": event_type}
