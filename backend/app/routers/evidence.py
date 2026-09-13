import uuid
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, HTTPException, Depends

from app.schemas import EvidenceCreate, EvidenceOut, MilestoneOut
from app.services.supabase_service import (
    SupabaseService,
    _memory_journeys,
    _memory_evidence,
    _memory_milestones
)

router = APIRouter(prefix="/api/evidence", tags=["Evidence"])

@router.post("", response_model=EvidenceOut, status_code=201)
async def add_evidence(
    payload: EvidenceCreate,
    user_id: str = Depends(SupabaseService.get_current_user_id)
):
    journey_id = payload.journey_id
    if journey_id not in _memory_journeys:
        raise HTTPException(status_code=404, detail="Journey not found.")

    journey = _memory_journeys[journey_id]
    if journey.get("user_id") != user_id:
        raise HTTPException(status_code=403, detail="Forbidden: You do not own this Journey.")

    evidence_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc)
    existing_evidence = _memory_evidence.setdefault(journey_id, [])
    order_index = len(existing_evidence) + 1

    new_evidence = {
        "id": evidence_id,
        "journey_id": journey_id,
        "day_number": payload.day_number,
        "image_url": payload.image_url,
        "reflection": payload.reflection,
        "prompt_spark": payload.prompt_spark,
        "metrics_tag": payload.metrics_tag or f"ENTRY #{order_index}",
        "captured_at": now.isoformat(),
        "order_index": order_index
    }

    existing_evidence.append(new_evidence)
    # Sort chronologically by day number
    existing_evidence.sort(key=lambda x: x.get("day_number", 0))

    # Update journey current day and count
    journey["current_day"] = max(journey.get("current_day", 1), payload.day_number)
    journey["evidence_count"] = len(existing_evidence)

    # Automatically record meaningful milestones if applicable
    milestones = _memory_milestones.setdefault(journey_id, [])
    if len(existing_evidence) == 1:
        milestones.append({
            "id": str(uuid.uuid4()),
            "journey_id": journey_id,
            "day_number": payload.day_number,
            "title": "First Evidence Captured",
            "description": f"Day {payload.day_number} foundation logged into the visual record.",
            "reached_at": now.isoformat(),
            "is_completed": True
        })
    elif payload.day_number >= 7 and not any(m.get("title") == "7-Day Cadence" for m in milestones):
        milestones.append({
            "id": str(uuid.uuid4()),
            "journey_id": journey_id,
            "day_number": payload.day_number,
            "title": "7-Day Cadence",
            "description": "One full week of documented iteration and craft.",
            "reached_at": now.isoformat(),
            "is_completed": True
        })
    elif payload.day_number >= 30 and not any(m.get("title") == "30-Day Series Completion" for m in milestones):
        milestones.append({
            "id": str(uuid.uuid4()),
            "journey_id": journey_id,
            "day_number": payload.day_number,
            "title": "30-Day Series Completion",
            "description": "A full 30-day transformation documented with undeniable proof.",
            "reached_at": now.isoformat(),
            "is_completed": True
        })

    journey["milestone_count"] = len(milestones)

    return EvidenceOut(**new_evidence)

@router.get("/journey/{journey_id}", response_model=List[EvidenceOut])
async def get_journey_timeline(
    journey_id: str,
    user_id: str = Depends(SupabaseService.get_current_user_id)
):
    if journey_id not in _memory_journeys:
        raise HTTPException(status_code=404, detail="Journey not found.")

    journey = _memory_journeys[journey_id]
    if journey.get("user_id") != user_id:
        raise HTTPException(status_code=403, detail="Forbidden: You do not own this Journey.")

    items = _memory_evidence.get(journey_id, [])
    items.sort(key=lambda x: x.get("day_number", 0))
    return [EvidenceOut(**e) for e in items]
