import jwt
import logging
from typing import Optional, Dict, Any, List
from fastapi import HTTPException, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import httpx

from app.config import settings

logger = logging.getLogger(__name__)
security = HTTPBearer(auto_error=False)

# Local memory store for offline testing or when Supabase keys are not yet configured
_memory_journeys: Dict[str, Dict[str, Any]] = {}
_memory_evidence: Dict[str, List[Dict[str, Any]]] = {}
_memory_milestones: Dict[str, List[Dict[str, Any]]] = {}
_memory_stories: Dict[str, Dict[str, Any]] = {}

class SupabaseService:
    @classmethod
    def get_current_user_id(cls, credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> str:
        """
        Validates the Supabase JWT Bearer token and extracts the authenticated user_id.
        Supports development fallback when testing locally.
        """
        if not credentials:
            if settings.ENVIRONMENT == "development":
                return "dev-user-0000-0000-0000"
            raise HTTPException(status_code=401, detail="Authentication credentials required.")

        token = credentials.credentials
        
        # If Supabase JWT Secret is provided, verify signature
        if settings.SUPABASE_JWT_SECRET:
            try:
                payload = jwt.decode(
                    token,
                    settings.SUPABASE_JWT_SECRET,
                    algorithms=["HS256"],
                    audience="authenticated"
                )
                user_id = payload.get("sub")
                if not user_id:
                    raise HTTPException(status_code=401, detail="Invalid token subject.")
                return user_id
            except jwt.PyJWTError as e:
                logger.warning(f"JWT verification failed: {e}")
                raise HTTPException(status_code=401, detail="Invalid or expired session.")

        # Fallback to unverified decode for development if secret not yet configured
        try:
            unverified = jwt.decode(token, options={"verify_signature": False})
            user_id = unverified.get("sub") or unverified.get("id") or "dev-user-0000-0000-0000"
            return user_id
        except Exception:
            return "dev-user-0000-0000-0000"

    @classmethod
    async def get_supabase_client(cls) -> Optional[httpx.AsyncClient]:
        if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_ROLE_KEY:
            return httpx.AsyncClient(
                base_url=f"{settings.SUPABASE_URL}/rest/v1",
                headers={
                    "apikey": settings.SUPABASE_SERVICE_ROLE_KEY,
                    "Authorization": f"Bearer {settings.SUPABASE_SERVICE_ROLE_KEY}",
                    "Content-Type": "application/json",
                    "Prefer": "return=representation"
                },
                timeout=10.0
            )
        return None
