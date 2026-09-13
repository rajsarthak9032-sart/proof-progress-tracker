from fastapi import APIRouter, HTTPException, Depends

from app.schemas import AIInsightsRequest, AIInsightsResponse
from app.services.ai_service import AIService
from app.services.supabase_service import SupabaseService, _memory_journeys

router = APIRouter(prefix="/api/ai", tags=["AI Insights"])

@router.post("/insights", response_model=AIInsightsResponse)
async def generate_ai_insights(
    payload: AIInsightsRequest,
    user_id: str = Depends(SupabaseService.get_current_user_id)
):
    """
    Analyzes chronological evidence reflections using Hugging Face Qwen/Qwen3-4B-Instruct-2507.
    Grounded strictly in user reflections. Never invents statistics.
    Returns truthful ai_used flag (True if HF was called, False if deterministic fallback).
    """
    journey = _memory_journeys.get(payload.journey_id)
    if journey and journey.get("user_id") != user_id:
        raise HTTPException(status_code=403, detail="Forbidden: You do not own this Journey.")

    insights = await AIService.analyze_journey_progress(payload)
    return insights
