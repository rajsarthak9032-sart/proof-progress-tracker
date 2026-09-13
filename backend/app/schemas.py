from datetime import datetime, timezone
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field, HttpUrl

# --- Journey Schemas ---
class JourneyBase(BaseModel):
    title: str = Field(..., min_length=2, max_length=120, description="Title of the journey")
    category: str = Field(..., description="Category: Art, Coding, Music, Writing, Fitness, Language, Other")
    duration_days: int = Field(30, ge=1, le=365, description="Intended horizon in days (e.g. 7, 30, 90)")
    description: Optional[str] = Field(None, max_length=500)

class JourneyCreate(JourneyBase):
    pass

class JourneyUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=120)
    category: Optional[str] = None
    duration_days: Optional[int] = Field(None, ge=1, le=365)
    description: Optional[str] = None
    is_active: Optional[bool] = None

class MilestoneOut(BaseModel):
    id: str
    journey_id: str
    day_number: int
    title: str
    description: str
    reached_at: datetime
    is_completed: bool = True

class EvidenceOut(BaseModel):
    id: str
    journey_id: str
    day_number: int
    image_url: str
    reflection: Optional[str] = None
    prompt_spark: Optional[str] = None
    metrics_tag: Optional[str] = None
    captured_at: datetime
    order_index: int

class JourneyOut(JourneyBase):
    id: str
    user_id: str
    created_at: datetime
    is_active: bool = True
    current_day: int = 1
    evidence_count: int = 0
    milestone_count: int = 0
    latest_evidence: Optional[EvidenceOut] = None

class JourneyDetail(JourneyOut):
    evidence: List[EvidenceOut] = []
    milestones: List[MilestoneOut] = []

# --- Evidence Creation Schema ---
class EvidenceCreate(BaseModel):
    journey_id: str
    day_number: int = Field(..., ge=1, le=365)
    image_url: str = Field(..., description="Public or signed storage URL for the evidence image")
    reflection: Optional[str] = Field(None, max_length=1000)
    prompt_spark: Optional[str] = Field(None, max_length=100)
    metrics_tag: Optional[str] = Field(None, max_length=50)

# --- AI Insight Schemas ---
class AIInsightEntryInput(BaseModel):
    day_number: int
    reflection: str
    metrics_tag: Optional[str] = None
    captured_at: Optional[str] = None

class AIInsightsRequest(BaseModel):
    journey_id: str
    journey_title: str
    category: str
    duration_days: int
    entries: List[AIInsightEntryInput]

class AIInsightsResponse(BaseModel):
    ai_used: bool = Field(..., description="Truthful flag indicating if Hugging Face Qwen inference was used")
    model_name: str
    journey_title: str
    grounded_entries_count: int
    key_shift: str
    growth_trajectory: str
    observations: List[str]
    sentiment_summary: str
    generated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# --- Proof Story Schemas ---
class ProofStoryChapter(BaseModel):
    day_number: int
    title: str
    image_url: str
    badge_label: str
    narrative: str

class ProofStorySynthesisRequest(BaseModel):
    journey_id: str

class ProofStoryOut(BaseModel):
    id: str
    journey_id: str
    title: str
    total_days: int
    hours_invested: float
    captures_count: int
    mastery_delta: str
    chapters: List[ProofStoryChapter]
    culmination_quote: str
    created_at: datetime

# --- Subscription & RevenueCat Schemas ---
class SubscriptionStatus(BaseModel):
    is_pro: bool = False
    entitlement_active: bool = False
    entitlement_id: str = "proof_pro"
    expiration_date: Optional[datetime] = None
    active_product_id: Optional[str] = None
    source: str = "revenuecat"

class RevenueCatWebhookPayload(BaseModel):
    api_version: Optional[str] = None
    event: Dict[str, Any] = {}
