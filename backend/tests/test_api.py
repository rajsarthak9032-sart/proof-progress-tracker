import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.supabase_service import _memory_journeys, _memory_evidence, _memory_milestones
from app.services.ai_service import AIService
from app.schemas import AIInsightsRequest, AIInsightEntryInput

client = TestClient(app)

@pytest.fixture(autouse=True)
def clean_memory_store():
    _memory_journeys.clear()
    _memory_evidence.clear()
    _memory_milestones.clear()
    yield

# 1. Health Check
def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "Proof API" in data["app"]

# 2. Journey CRUD & Validation
def test_create_journey_success():
    payload = {
        "title": "Learning Digital Art",
        "category": "Art",
        "duration_days": 30,
        "description": "Daily digital painting practice."
    }
    response = client.post("/api/journeys", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Learning Digital Art"
    assert data["category"] == "Art"
    assert data["duration_days"] == 30
    assert data["evidence_count"] == 0
    assert "id" in data

def test_create_journey_invalid_title():
    # Title too short (< 2 chars)
    payload = {
        "title": "A",
        "category": "Art",
        "duration_days": 30
    }
    response = client.post("/api/journeys", json=payload)
    assert response.status_code == 422

def test_create_journey_invalid_duration():
    # Duration > 365
    payload = {
        "title": "Learning Piano",
        "category": "Music",
        "duration_days": 500
    }
    response = client.post("/api/journeys", json=payload)
    assert response.status_code == 422

def test_list_journeys():
    client.post("/api/journeys", json={"title": "Journey 1", "category": "Art", "duration_days": 7})
    client.post("/api/journeys", json={"title": "Journey 2", "category": "Coding", "duration_days": 30})

    response = client.get("/api/journeys")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2

def test_get_journey_detail_not_found():
    response = client.get("/api/journeys/non-existent-uuid")
    assert response.status_code == 404

# 3. Evidence CRUD & Chronological Timeline Ordering
def test_add_evidence_and_timeline_ordering():
    # Create a journey first
    j_res = client.post("/api/journeys", json={"title": "Pottery", "category": "Art", "duration_days": 30})
    journey_id = j_res.json()["id"]

    # Add evidence out of chronological order (Day 15, then Day 1, then Day 7)
    ev_15 = client.post("/api/evidence", json={
        "journey_id": journey_id,
        "day_number": 15,
        "image_url": "https://example.com/day15.jpg",
        "reflection": "Glaze experiment."
    })
    assert ev_15.status_code == 201

    ev_1 = client.post("/api/evidence", json={
        "journey_id": journey_id,
        "day_number": 1,
        "image_url": "https://example.com/day1.jpg",
        "reflection": "First centering of clay."
    })
    assert ev_1.status_code == 201

    ev_7 = client.post("/api/evidence", json={
        "journey_id": journey_id,
        "day_number": 7,
        "image_url": "https://example.com/day7.jpg",
        "reflection": "Throwing cylindrical vases."
    })
    assert ev_7.status_code == 201

    # Fetch timeline - verify strictly ordered by day_number: 1, 7, 15
    timeline_res = client.get(f"/api/evidence/journey/{journey_id}")
    assert timeline_res.status_code == 200
    timeline = timeline_res.json()
    assert len(timeline) == 3
    assert timeline[0]["day_number"] == 1
    assert timeline[1]["day_number"] == 7
    assert timeline[2]["day_number"] == 15

    # Check journey detail reflects latest evidence (Day 15) and count = 3
    detail_res = client.get(f"/api/journeys/{journey_id}")
    assert detail_res.status_code == 200
    detail = detail_res.json()
    assert detail["evidence_count"] == 3
    assert detail["current_day"] == 15
    assert detail["latest_evidence"]["day_number"] == 15

# 4. User Ownership & Access Control
def test_ownership_enforcement():
    # Insert journey under user-1
    _memory_journeys["j-user-1"] = {
        "id": "j-user-1",
        "user_id": "other-user-9999",
        "title": "Private Journey",
        "category": "Art",
        "duration_days": 30,
        "is_active": True,
        "created_at": "2026-01-01T00:00:00"
    }

    # Current client default user is dev-user-0000-0000-0000
    response = client.get("/api/journeys/j-user-1")
    assert response.status_code == 403

    # Attempt to add evidence to someone else's journey
    add_ev_res = client.post("/api/evidence", json={
        "journey_id": "j-user-1",
        "day_number": 1,
        "image_url": "https://example.com/hack.jpg"
    })
    assert add_ev_res.status_code == 403

# 5. AI Insights Fallback & Truthfulness
@pytest.mark.asyncio
async def test_ai_deterministic_fallback():
    req = AIInsightsRequest(
        journey_id="j-test",
        journey_title="Learning Digital Art",
        category="Art",
        duration_days=30,
        entries=[
            AIInsightEntryInput(day_number=1, reflection="Rough pencil gesture drawings.", metrics_tag="Day 1"),
            AIInsightEntryInput(day_number=15, reflection="Began experimenting with volumetric lighting.", metrics_tag="Day 15"),
            AIInsightEntryInput(day_number=30, reflection="Finished bioluminescent sanctuary concept.", metrics_tag="Day 30")
        ]
    )

    # Calling AIService directly (HF token is unset in test env)
    result = await AIService.analyze_journey_progress(req)

    # Must be truthful
    assert result.ai_used is False
    assert result.grounded_entries_count == 3
    assert len(result.observations) >= 2
    assert "Day 1" in result.observations[0] or "baseline" in result.observations[0]
    assert "Gesture & Form" in result.growth_trajectory

# 6. Proof Story Synthesis
def test_proof_story_synthesis():
    j_res = client.post("/api/journeys", json={"title": "Acoustic Guitar", "category": "Music", "duration_days": 30})
    j_id = j_res.json()["id"]

    # Add 2 evidence entries
    client.post("/api/evidence", json={"journey_id": j_id, "day_number": 1, "image_url": "https://example.com/g1.jpg", "reflection": "First chords."})
    client.post("/api/evidence", json={"journey_id": j_id, "day_number": 14, "image_url": "https://example.com/g14.jpg", "reflection": "Canon in D."})

    synth_res = client.post("/api/stories/synthesize", json={"journey_id": j_id})
    assert synth_res.status_code == 200
    story = synth_res.json()
    assert story["captures_count"] == 2
    assert len(story["chapters"]) == 2
    assert story["chapters"][0]["badge_label"] == "RAW SKETCH"

# 7. Subscriptions & Tier Limits
def test_free_tier_limits():
    # Initial limits: 0 active journeys
    res = client.get("/api/subscriptions/limits")
    assert res.status_code == 200
    limits = res.json()
    assert limits["tier"] == "free"
    assert limits["max_active_journeys"] == 1
    assert limits["can_create_journey"] is True

    # Create 1 journey
    client.post("/api/journeys", json={"title": "First Journey", "category": "Art", "duration_days": 7})

    # Now free user reaches 1/1 limit
    res_after = client.get("/api/subscriptions/limits")
    limits_after = res_after.json()
    assert limits_after["active_journeys_count"] == 1
    assert limits_after["can_create_journey"] is False
