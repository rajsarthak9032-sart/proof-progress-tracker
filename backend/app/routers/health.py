from fastapi import APIRouter
from app.config import settings

router = APIRouter(tags=["Health"])

@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "environment": settings.ENVIRONMENT,
        "ai_model": settings.HF_MODEL,
        "hf_configured": bool(settings.HF_TOKEN),
        "supabase_configured": bool(settings.SUPABASE_URL)
    }
