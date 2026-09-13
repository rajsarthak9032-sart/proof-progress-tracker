import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.routers import health, journeys, evidence, ai, stories, subscriptions

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("proof-api")

app = FastAPI(
    title="Proof API",
    description="See the progress you couldn't see. Visual progress tracking engine for RevenueCat Shipaton 2026.",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handler to prevent leaking raw traces
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.method} {request.url}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal error occurred. Please retry your request."}
    )

# Include Routers
app.include_router(health.router)
app.include_router(journeys.router)
app.include_router(evidence.router)
app.include_router(ai.router)
app.include_router(stories.router)
app.include_router(subscriptions.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
