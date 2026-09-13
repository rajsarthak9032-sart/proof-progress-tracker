import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends

from app.schemas import ProofStorySynthesisRequest, ProofStoryOut, ProofStoryChapter
from app.services.supabase_service import SupabaseService, _memory_journeys, _memory_evidence, _memory_stories

router = APIRouter(prefix="/api/stories", tags=["Proof Stories"])

@router.post("/synthesize", response_model=ProofStoryOut)
async def synthesize_proof_story(
    payload: ProofStorySynthesisRequest,
    user_id: str = Depends(SupabaseService.get_current_user_id)
):
    journey_id = payload.journey_id
    journey = _memory_journeys.get(journey_id)
    if not journey:
        raise HTTPException(status_code=404, detail="Journey not found.")
    
    if journey.get("user_id") != user_id:
        raise HTTPException(status_code=403, detail="Forbidden: You do not own this Journey.")

    evidence_items = _memory_evidence.get(journey_id, [])
    if not evidence_items:
        raise HTTPException(status_code=400, detail="At least one evidence capture is required to create a Proof Story.")

    evidence_items.sort(key=lambda x: x.get("day_number", 0))

    chapters = []
    chapter_titles = ["The Starting Point", "First Realization", "The Technique Pivot", "The Breakthrough"]
    badge_labels = ["RAW SKETCH", "TONAL STUDY", "VOLUMETRIC", "MASTERPIECE"]

    for idx, ev in enumerate(evidence_items[:4]):
        title = chapter_titles[min(idx, len(chapter_titles) - 1)]
        badge = badge_labels[min(idx, len(badge_labels) - 1)]
        chapters.append(
            ProofStoryChapter(
                day_number=ev.get("day_number", idx + 1),
                title=title,
                image_url=ev.get("image_url", ""),
                badge_label=badge,
                narrative=ev.get("reflection") or "Documented moment of deliberate practice."
            )
        )

    story_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc)
    total_days = max(ev.get("day_number", 1) for ev in evidence_items)
    estimated_hours = round(len(evidence_items) * 1.5, 1)

    story = ProofStoryOut(
        id=story_id,
        journey_id=journey_id,
        title=f"{journey.get('title')} Retrospective",
        total_days=total_days,
        hours_invested=estimated_hours,
        captures_count=len(evidence_items),
        mastery_delta=f"+{min(92, len(evidence_items) * 18)}%",
        chapters=chapters,
        culmination_quote="From tentative initial marks to deliberate mastery. Look how far you've come.",
        created_at=now
    )

    _memory_stories[story_id] = story.model_dump()
    return story

@router.get("/{story_id}", response_model=ProofStoryOut)
async def get_proof_story(
    story_id: str,
    user_id: str = Depends(SupabaseService.get_current_user_id)
):
    if story_id not in _memory_stories:
        raise HTTPException(status_code=404, detail="Proof Story not found.")
    
    return ProofStoryOut(**_memory_stories[story_id])
