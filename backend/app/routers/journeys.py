import uuid
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, HTTPException, Depends

from app.schemas import JourneyCreate, JourneyUpdate, JourneyOut, JourneyDetail, EvidenceOut, MilestoneOut
from app.services.supabase_service import (
    SupabaseService,
    _memory_journeys,
    _memory_evidence,
    _memory_milestones
)

router = APIRouter(prefix="/api/journeys", tags=["Journeys"])

@router.post("", response_model=JourneyOut, status_code=201)
async def create_journey(
    payload: JourneyCreate,
    user_id: str = Depends(SupabaseService.get_current_user_id)
):
    journey_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc)

    new_journey = {
        "id": journey_id,
        "user_id": user_id,
        "title": payload.title.strip(),
        "category": payload.category.strip(),
        "duration_days": payload.duration_days,
        "description": payload.description or "",
        "created_at": now.isoformat(),
        "is_active": True,
        "current_day": 1,
        "evidence_count": 0,
        "milestone_count": 0
    }

    client = await SupabaseService.get_supabase_client()
    if client:
        try:
            res = await client.post("/journeys", json=new_journey)
            if res.status_code in [200, 201]:
                data = res.json()[0]
                return JourneyOut(**data)
        except Exception:
            pass  # fallback to memory store

    _memory_journeys[journey_id] = new_journey
    _memory_evidence[journey_id] = []
    _memory_milestones[journey_id] = []

    return JourneyOut(**new_journey)

@router.get("", response_model=List[JourneyOut])
async def list_journeys(
    user_id: str = Depends(SupabaseService.get_current_user_id)
):
    client = await SupabaseService.get_supabase_client()
    if client:
        try:
            res = await client.get(f"/journeys?user_id=eq.{user_id}&order=created_at.desc")
            if res.status_code == 200:
                data = res.json()
                return [JourneyOut(**j) for j in data]
        except Exception:
            pass

    # Memory fallback
    user_journeys = [
        JourneyOut(**j) for j in _memory_journeys.values()
        if j.get("user_id") == user_id and j.get("is_active", True)
    ]
    user_journeys.sort(key=lambda x: x.created_at, reverse=True)
    return user_journeys

@router.get("/{journey_id}", response_model=JourneyDetail)
async def get_journey_detail(
    journey_id: str,
    user_id: str = Depends(SupabaseService.get_current_user_id)
):
    client = await SupabaseService.get_supabase_client()
    if client:
        try:
            res = await client.get(f"/journeys?id=eq.{journey_id}&user_id=eq.{user_id}")
            if res.status_code == 200 and res.json():
                j_data = res.json()[0]
                ev_res = await client.get(f"/evidence?journey_id=eq.{journey_id}&order=day_number.asc")
                evidence_list = [EvidenceOut(**e) for e in ev_res.json()] if ev_res.status_code == 200 else []
                ms_res = await client.get(f"/milestones?journey_id=eq.{journey_id}&order=day_number.asc")
                milestones_list = [MilestoneOut(**m) for m in ms_res.json()] if ms_res.status_code == 200 else []
                
                j_data["evidence"] = evidence_list
                j_data["milestones"] = milestones_list
                j_data["evidence_count"] = len(evidence_list)
                j_data["milestone_count"] = len(milestones_list)
                j_data["latest_evidence"] = evidence_list[-1] if evidence_list else None
                return JourneyDetail(**j_data)
        except Exception:
            pass

    # Memory fallback
    if journey_id not in _memory_journeys:
        raise HTTPException(status_code=404, detail="Journey not found.")

    journey = _memory_journeys[journey_id]
    if journey.get("user_id") != user_id:
        raise HTTPException(status_code=403, detail="Forbidden: You do not own this Journey.")

    evidence_items = _memory_evidence.get(journey_id, [])
    evidence_items.sort(key=lambda x: x.get("day_number", 0))
    evidence_models = [EvidenceOut(**e) for e in evidence_items]

    milestone_items = _memory_milestones.get(journey_id, [])
    milestone_models = [MilestoneOut(**m) for m in milestone_items]

    detail = dict(journey)
    detail["evidence"] = evidence_models
    detail["milestones"] = milestone_models
    detail["evidence_count"] = len(evidence_models)
    detail["milestone_count"] = len(milestone_models)
    detail["latest_evidence"] = evidence_models[-1] if evidence_models else None

    return JourneyDetail(**detail)

@router.delete("/{journey_id}")
async def delete_journey(
    journey_id: str,
    user_id: str = Depends(SupabaseService.get_current_user_id)
):
    if journey_id in _memory_journeys:
        if _memory_journeys[journey_id].get("user_id") != user_id:
            raise HTTPException(status_code=403, detail="Forbidden: You do not own this Journey.")
        del _memory_journeys[journey_id]
        _memory_evidence.pop(journey_id, None)
        _memory_milestones.pop(journey_id, None)
        return {"success": True, "message": "Journey archived."}

    raise HTTPException(status_code=404, detail="Journey not found.")
