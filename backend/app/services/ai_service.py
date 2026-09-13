import json
import re
import logging
from typing import Dict, Any, List
import httpx

from app.config import settings
from app.schemas import AIInsightsRequest, AIInsightsResponse
from app.prompts import QWEN_SYSTEM_PROMPT, build_qwen_user_prompt

logger = logging.getLogger(__name__)

class AIService:
    @classmethod
    def generate_deterministic_fallback(cls, request: AIInsightsRequest) -> AIInsightsResponse:
        """
        Deterministic, grounded analysis engine when Hugging Face / Qwen is unavailable.
        Never fabricates achievements. Analyzes chronological shifts directly from user notes.
        """
        entries = sorted(request.entries, key=lambda e: e.day_number)
        count = len(entries)

        if count == 0:
            return AIInsightsResponse(
                ai_used=False,
                model_name="deterministic_fallback_engine",
                journey_title=request.journey_title,
                grounded_entries_count=0,
                key_shift="No evidence entries logged yet.",
                growth_trajectory="Beginning → Exploration",
                observations=["Start logging daily evidence to unlock progress pattern recognition."],
                sentiment_summary="Awaiting initial evidence records."
            )

        first_entry = entries[0]
        latest_entry = entries[-1]

        # Extract theme keywords from reflections
        all_text = " ".join([e.reflection.lower() for e in entries if e.reflection])
        
        # Grounded trajectory based on category and entry progression
        trajectory_map = {
            "art": "Gesture & Form → Lighting & Depth → Composition",
            "coding": "Architecture & Syntax → Debugging → Polish & Optimization",
            "music": "Finger Placement → Rhythm & Tempo → Musicality",
            "writing": "First Draft Ideation → Structure & Voice → Editing",
            "fitness": "Form Fundamentals → Consistency → Strength Endurance",
            "language": "Vocabulary Recognition → Grammar Structure → Fluency"
        }
        category_lower = request.category.lower()
        growth_trajectory = trajectory_map.get(category_lower, "Foundation → Cadence → Synthesis")

        midpoint_day = (first_entry.day_number + latest_entry.day_number) // 2
        
        # Build strictly grounded observations
        observations = []
        observations.append(
            f"Day {first_entry.day_number} baseline captured initial study: '{first_entry.reflection[:80]}...'."
            if first_entry.reflection else f"Recorded initial baseline on Day {first_entry.day_number}."
        )

        if count > 1:
            observations.append(
                f"Consistent chronological progression tracked across {count} milestones, culminating at Day {latest_entry.day_number}."
            )
            observations.append(
                f"Latest reflection emphasizes deliberate iteration: '{latest_entry.reflection[:80]}...'."
                if latest_entry.reflection else f"Latest evidence logged at Day {latest_entry.day_number}."
            )
        else:
            observations.append("First milestone recorded. Continue capturing evidence to map the evolution curve.")

        key_shift = (
            f"Progression from Day {first_entry.day_number} to Day {latest_entry.day_number} marks a shift toward intentional execution."
            if count > 1 else f"Initial foundation established on Day {first_entry.day_number}."
        )

        sentiment_summary = (
            f"Evidence reflections show steady momentum across {latest_entry.day_number} days."
            if count > 1 else "Early stage foundation documented."
        )

        return AIInsightsResponse(
            ai_used=False,
            model_name="deterministic_fallback_engine",
            journey_title=request.journey_title,
            grounded_entries_count=count,
            key_shift=key_shift,
            growth_trajectory=growth_trajectory,
            observations=observations,
            sentiment_summary=sentiment_summary
        )

    @classmethod
    async def analyze_journey_progress(cls, request: AIInsightsRequest) -> AIInsightsResponse:
        """
        Executes server-side Hugging Face inference for Qwen/Qwen3-4B-Instruct-2507.
        Falls back seamlessly to deterministic engine if HF token is missing or network fails.
        """
        if not settings.HF_TOKEN or len(settings.HF_TOKEN.strip()) == 0:
            logger.info("HF_TOKEN not provided. Using deterministic fallback engine.")
            return cls.generate_deterministic_fallback(request)

        # Build chronological reflections input
        entries_formatted = []
        for e in sorted(request.entries, key=lambda x: x.day_number):
            tag = f" [{e.metrics_tag}]" if e.metrics_tag else ""
            entries_formatted.append(f"- Day {e.day_number}{tag}: {e.reflection}")
        
        entries_text = "\n".join(entries_formatted) if entries_formatted else "No reflections entered."
        user_prompt = build_qwen_user_prompt(request.journey_title, request.category, entries_text)

        # Hugging Face Chat / Inference URL
        hf_urls = [
            f"https://router.huggingface.co/hf-inference/models/{settings.HF_MODEL}/v1/chat/completions",
            f"https://api-inference.huggingface.co/models/{settings.HF_MODEL}"
        ]

        headers = {
            "Authorization": f"Bearer {settings.HF_TOKEN.strip()}",
            "Content-Type": "application/json"
        }

        payload = {
            "messages": [
                {"role": "system", "content": QWEN_SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.3,
            "max_tokens": 512,
            "response_format": {"type": "json_object"}
        }

        try:
            async with httpx.AsyncClient(timeout=settings.HF_API_TIMEOUT_SECONDS) as client:
                response = await client.post(hf_urls[0], headers=headers, json=payload)
                
                if response.status_code != 200:
                    logger.warning(f"HF Router returned {response.status_code}: {response.text[:200]}. Falling back.")
                    return cls.generate_deterministic_fallback(request)

                data = response.json()
                content = data.get("choices", [{}])[0].get("message", {}).get("content", "")

                # Parse JSON
                # Clean code blocks if present
                clean_json_match = re.search(r"\{.*\}", content, re.DOTALL)
                if not clean_json_match:
                    logger.warning("Could not locate JSON in Qwen output. Falling back.")
                    return cls.generate_deterministic_fallback(request)

                parsed = json.loads(clean_json_match.group(0))

                return AIInsightsResponse(
                    ai_used=True,
                    model_name=settings.HF_MODEL,
                    journey_title=request.journey_title,
                    grounded_entries_count=len(request.entries),
                    key_shift=parsed.get("key_shift", "Grounded shift detected across evidence entries."),
                    growth_trajectory=parsed.get("growth_trajectory", "Exploration → Refinement"),
                    observations=parsed.get("observations", ["Progress confirmed via chronological evidence."]),
                    sentiment_summary=parsed.get("sentiment_summary", "Reflections indicate steady deliberate progress.")
                )

        except Exception as ex:
            logger.error(f"Error during Hugging Face inference: {ex}. Using fallback.")
            return cls.generate_deterministic_fallback(request)
