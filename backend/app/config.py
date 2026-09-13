import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APP_NAME: str = "Proof API"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    # Supabase Configuration
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    SUPABASE_JWT_SECRET: str = ""

    # Hugging Face Inference API
    HF_TOKEN: str = ""
    HF_MODEL: str = "Qwen/Qwen3-4B-Instruct-2507"
    HF_API_TIMEOUT_SECONDS: float = 15.0

    # RevenueCat Webhook Secret / Verification
    REVENUECAT_WEBHOOK_AUTH_HEADER: str = ""

    # Security & CORS
    CORS_ORIGINS: List[str] = ["*"]
    AUTH_SECRET: str = "proof-local-dev-secret-key-32-chars-minimum"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
