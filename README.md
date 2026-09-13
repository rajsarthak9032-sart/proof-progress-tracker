# Proof — See the progress you couldn't see.

> **Competition-grade mobile application built for RevenueCat Shipaton 2026.**
> *A personal museum of craft, transforming small chronological evidence into undeniable proof of growth.*

---

## 1. Product Overview

Most people quit learning a craft, developing a skill, or building ambitious projects because gradual day-to-day improvement is invisible. Traditional habit trackers treat creative work like checkboxes and number streaks. 

**Proof is different.** Proof does not track streaks or guilt-trip users with empty habit loops. Proof is a **personal museum of progress**.

### The Core Emotional Flow
```
START
  ↓
Capture Evidence (Photos, Reflections, Prompt Sparks)
  ↓
Time Passes
  ↓
Time Travel (Scrub through your chronological transformation)
  ↓
See the earlier version of yourself
  ↓
Realize how much changed
  ↓
Create a Proof Story
  ↓
Share with the world
```

Proof faithfully implements the **Google Stitch "Luminous Alabaster"** design system: warm architectural linen canvas (`#FAF9F6`), obsidian ink typography (`#161616`), squircle continuous curvature (`rounded-2xl`, `rounded-3xl`), double-drop diffused glass elevation, and the living **Aurora Continuum** accent spectrum (`#FF6B4A` → `#E11D48` → `#6366F1`).

---

## 2. Architecture

```
Mobile App (Expo / React Native / TypeScript)
    ↓
FastAPI Backend (Python)
    ↓
Supabase (Postgres Database / Auth / Private Storage)  +  Hugging Face Inference (Qwen)
```

- **Frontend**: React Native with Expo 57, TypeScript, Expo Router, React Native Reanimated, and Gesture Handler.
- **Backend**: FastAPI (Python 3.11+) with Pydantic v2 schemas and validation.
- **Database & Storage**: Supabase Postgres with strict Row Level Security (RLS) and private storage bucket policies.
- **AI Progress Insights**: Server-side inference via Hugging Face model `Qwen/Qwen3-4B-Instruct-2507`. Truthful metadata flag `ai_used: true/false` and deterministic fallback engine. *No direct client calls to Hugging Face.*
- **Monetization**: Official RevenueCat React Native SDK (`react-native-purchases`), entitlement `proof_pro`, products `proof_monthly` and `proof_annual`.

---

## 3. Folder Structure

```
stitch_proof_visual_progress_tracker/
├── frontend/                          # Expo Mobile Application
│   ├── app/                           # Expo Router Screens
│   │   ├── _layout.tsx                # Root layout & providers
│   │   ├── (auth)/
│   │   │   ├── onboarding.tsx         # Stitch Onboarding (Day 01->30 ray card)
│   │   │   └── login.tsx              # Supabase Auth sign-in / sign-up
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx            # Floating glass navigation bar
│   │   │   ├── index.tsx              # Home / Journeys overview
│   │   │   ├── time-travel.tsx        # Signature Time Travel Hero experience
│   │   │   ├── stories.tsx            # Proof Stories retrospective viewer
│   │   │   └── profile.tsx            # Profile & RevenueCat Pro status
│   │   ├── journey/
│   │   │   ├── create.tsx             # 2-Step intention & horizon creator
│   │   │   └── [id].tsx               # Journey Detail & evidence timeline
│   │   ├── evidence/
│   │   │   └── add.tsx                # Capture proof, prompt sparks & reflection
│   │   ├── compare/
│   │   │   └── [id].tsx               # Draggable Before / After split viewer
│   │   ├── paywall.tsx                # RevenueCat Pro membership upgrade
│   │   └── index.tsx                  # Root redirect
│   ├── src/
│   │   ├── components/                # Reusable Luminous Alabaster UI
│   │   │   ├── Button.tsx             # Aurora gradient & Obsidian buttons
│   │   │   ├── Card.tsx               # Level 1 & Level 2 elevation cards
│   │   │   ├── EvidenceCard.tsx       # 4:5 portrait media card
│   │   │   ├── TimeTravelSlider.tsx   # Dual-ring Aurora thumb & haptic notches
│   │   │   ├── BeforeAfterSlider.tsx  # Draggable hairline comparison slider
│   │   │   ├── FloatingNavBar.tsx     # Suspended glass pill with center Retrospect
│   │   │   ├── EmptyState.tsx         # Quiet museum aesthetic
│   │   │   ├── LoadingState.tsx       # Luminous skeleton loaders
│   │   │   ├── ErrorState.tsx         # Retryable feedback cards
│   │   │   └── ProofHeader.tsx        # Top bar with interlocking rings glyph
│   │   ├── context/
│   │   │   ├── AuthContext.tsx        # Supabase Auth + Demo Mode
│   │   │   └── PurchasesContext.tsx   # RevenueCat entitlement provider
│   │   ├── services/
│   │   │   ├── api.ts                 # FastAPI client service
│   │   │   ├── supabase.ts            # Supabase client with AsyncStorage
│   │   │   ├── purchases.ts           # Official react-native-purchases wrapper
│   │   │   └── demoData.ts            # Isolated "Learning Digital Art" dataset
│   │   └── theme/
│   │       ├── colors.ts              # Luminous Alabaster color tokens
│   │       ├── typography.ts          # Plus Jakarta Sans, Inter, JetBrains Mono
│   │       └── shadows.ts             # Double-drop glass elevation styles
│   ├── package.json
│   └── app.json
│
├── backend/                           # FastAPI API Service
│   ├── app/
│   │   ├── main.py                    # App entry point, CORS & exception handler
│   │   ├── config.py                  # Pydantic Settings
│   │   ├── schemas.py                 # Request & response domain schemas
│   │   ├── prompts.py                 # Guarded system prompts for Qwen
│   │   ├── routers/
│   │   │   ├── health.py              # Health check endpoint
│   │   │   ├── journeys.py            # Journeys CRUD & ownership validation
│   │   │   ├── evidence.py            # Chronological timeline & captures
│   │   │   ├── ai.py                  # AI progress insights
│   │   │   ├── stories.py             # Proof story synthesis
│   │   │   └── subscriptions.py       # RevenueCat webhooks & limits
│   │   └── services/
│   │       ├── ai_service.py          # Hugging Face inference + deterministic fallback
│   │       └── supabase_service.py    # Supabase JWT & data service
│   ├── migrations/
│   │   └── 001_initial_schema.sql     # Supabase Postgres schema & RLS policies
│   ├── tests/
│   │   └── test_api.py                # Pytest test suite (11 unit tests)
│   ├── requirements.txt
│   └── pytest.ini
│
└── stitch_proof_visual_progress_tracker/ # Google Stitch visual source of truth
```

---

## 4. Shipaton 2026 Compliance

| Requirement | Implementation Details | Verified Status |
| :--- | :--- | :--- |
| **Monetization SDK** | Official `react-native-purchases` SDK integrated in `frontend/src/services/purchases.ts`. | **COMPLIANT** |
| **Required Entitlement** | `proof_pro` checked via `customerInfo.entitlements.active['proof_pro']`. | **COMPLIANT** |
| **Required Products** | `proof_monthly` and `proof_annual`. | **COMPLIANT** |
| **Purchase & Restore** | Real `purchasePackage(pkg)` and `restorePurchases()` wired to SDK. | **COMPLIANT** |
| **Source of Truth** | Pro status is derived strictly from RevenueCat customerInfo, never a local boolean. | **COMPLIANT** |
| **Free vs Pro Gating** | Free tier: 1 active Journey, basic timeline, limited AI. Pro tier: unlimited Journeys, advanced Time Travel, advanced Before/After, and AI insights. | **COMPLIANT** |
| **AI Architecture** | Server-side through FastAPI. Truthful `ai_used: true/false` flag. Grounded in user reflections; never invents achievements. | **COMPLIANT** |
| **Demo Mode Isolation**| Explicit "Explore Demo" mode. Clearly demarcated with `DEMO` badge. Completely isolated from real user data. | **COMPLIANT** |
| **No Fake Features** | No simulated purchase successes, no invented traction, no false claims. | **COMPLIANT** |

> **Testing Notice**: Local development testing without active App Store / Google Play store billing will report:  
> `NOT VERIFIED — REQUIRES NATIVE STORE / REVENUECAT TEST ENVIRONMENT`  
> In a native standalone build with sandbox testers, RevenueCat connects directly to the App Store / Play Store sandbox.

---

## 5. Setup & Local Development

### Prerequisites
- Node.js `v20+` or `v24+`
- Python `3.11+` or `3.14+`
- npm `10+`

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Create `.env` from `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Run the backend server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   API interactive documentation will be available at `http://localhost:8000/docs`.

5. Run the test suite:
   ```bash
   python -m pytest tests -v
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` from `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Run the TypeScript verification:
   ```bash
   npx tsc --noEmit
   ```
5. Run the frontend domain test suite:
   ```bash
   npx -y tsx scripts/test-domain.ts
   ```
6. Start Expo development server:
   ```bash
   npm run web    # or npm run android / npm run ios
   ```

---

## 6. Supabase Setup & Security

1. In the Supabase Dashboard, open the **SQL Editor**.
2. Run the SQL script from `backend/migrations/001_initial_schema.sql`:
   - Creates `journeys`, `evidence`, `milestones`, `proof_stories`, and `user_subscriptions` tables.
   - Enforces **Row Level Security (RLS)** on all tables. Users can only SELECT, INSERT, UPDATE, and DELETE their own records.
   - Creates the private storage bucket `evidence-media` with path-based RLS (`auth.uid() = foldername`).
3. Copy your **Supabase URL** and **Anon Key** into `frontend/.env`.
4. Copy your **Supabase Service Role Key** and **JWT Secret** into `backend/.env`.
   - *Never expose `SUPABASE_SERVICE_ROLE_KEY` to the mobile client.*

---

## 7. Hugging Face AI Inference & Truthfulness

Proof uses model **`Qwen/Qwen3-4B-Instruct-2507`** via Hugging Face Inference API for progress pattern recognition.

### Guardrails
- Input to AI is restricted strictly to user-recorded reflections and chronological dates.
- AI is instructed never to invent dates, statistics, or achievements.
- If `HF_TOKEN` is unset, rate-limited, or network fails:
  - The deterministic progress engine automatically generates structured, grounded insights based on the evidence progression.
  - The API truthfully responds with:
    ```json
    {
      "ai_used": false,
      "model_name": "deterministic_fallback_engine"
    }
    ```
  - When Qwen successfully analyzes the data:
    ```json
    {
      "ai_used": true,
      "model_name": "Qwen/Qwen3-4B-Instruct-2507"
    }
    ```

---

## 8. RevenueCat Configuration

1. In the **RevenueCat Dashboard**:
   - Create a project named `Proof`.
   - Create an Entitlement named `proof_pro`.
   - Create an Offering named `default`.
   - Add two packages:
     - Monthly package with Product ID `proof_monthly`.
     - Annual package with Product ID `proof_annual`.
2. Copy your RevenueCat Public API Keys into `frontend/.env`:
   - `EXPO_PUBLIC_REVENUECAT_APPLE_KEY`
   - `EXPO_PUBLIC_REVENUECAT_GOOGLE_KEY`
3. In RevenueCat Integrations, configure Webhooks pointing to:
   - `https://your-api-domain.com/api/subscriptions/webhook`
   - Set authorization header matching `REVENUECAT_WEBHOOK_AUTH_HEADER` in `backend/.env`.

---

## 9. Competition Demo Instructions

1. **Launch App**: Open Proof in Expo (or web preview).
2. **Onboarding**:
   - Drag the center divider on the **Day 01 -> Day 30 split-view ray card** to see the chair evolution.
   - Observe the 3 value proposition pillars.
   - Tap **"Explore an interactive demo"**.
3. **Home Screen**:
   - See the active **"Learning Digital Art"** card showing Day 30 of 30, with 5 key waypoints and 12 evidence entries.
   - Tap **"Scrub in Time Travel"**.
4. **Time Travel Screen (Signature Experience)**:
   - Drag the **Timeline Scrubber** across waypoints (Day 1, 7, 15, 23, 30).
   - Observe the smooth transition: image updates, journal quote updates, and **Proof AI Lens** dynamically highlights the chromatic shift.
   - Tap the **Zoom toggle** to inspect the 4K bioluminescent artwork.
   - Tap **"Compare with Day 1 Canvas"**.
5. **Before / After Screen**:
   - Drag the comparison hairline handle across the screen to reveal the difference between the tentative Day 1 gesture drawing and the Day 30 sanctuary masterpiece.
   - Inspect the metrics grid: Span (30 Days), Logged (12 Entries), Pivots (4 Milestones), Effort (18.5 Hrs).
   - Tap **"Generate Proof Story"**.
6. **Proof Story Screen**:
   - Scroll through the vertical connecting retrospective spine: Genesis (Day 1), Tonal Study (Day 7), Lighting Pivot (Day 15), Breakthrough (Day 30).
   - See the celebratory culmination: *"Look how far you've come."*
   - Tap **"Share My Proof Story"** to copy the shareable link.
7. **Monetization & Free/Pro Limits**:
   - Navigate to Profile. See the Proof Pro card and free/pro tier badge.
   - Tap **"Upgrade to Proof Pro"** to inspect the full Shipaton 2026 paywall with monthly and annual plan selectors.

---

## 10. WHERE EVERYTHING LIVES

| Component | Location | Purpose |
| :--- | :--- | :--- |
| **Frontend UI** | `frontend/app/` | Complete Expo Router mobile screens matching Stitch design |
| **Design System** | `frontend/src/theme/` & `src/components/` | Luminous Alabaster colors, typography, elevation, and widgets |
| **Backend API** | `backend/app/` | FastAPI REST API with validation, schemas, and routers |
| **AI Analysis** | `backend/app/services/ai_service.py` | Qwen inference + truthful fallback engine |
| **AI Token** | `backend/.env` (`HF_TOKEN`) | Server-side secret (never exposed to client) |
| **Database** | `backend/migrations/001_initial_schema.sql` | Supabase Postgres schema with Row Level Security |
| **Evidence Storage** | Supabase Storage (`evidence-media`) | Private bucket for photo uploads |
| **RevenueCat** | `frontend/src/services/purchases.ts` & `backend/app/routers/subscriptions.py` | Official SDK monetization, `proof_pro` entitlement |
| **Isolated Demo** | `frontend/src/services/demoData.ts` | Competition demo dataset for Learning Digital Art |
| **Tests** | `backend/tests/` & `frontend/scripts/` | Automated pytest suite and TypeScript type checks |

## 11. Vercel Deployment

### Prerequisites
- Vercel account (free tier works)
- Vercel CLI installed globally or via `npx`
- The frontend builds with `npx expo export -p web` (already configured)

### Deploy from CLI
```bash
cd frontend
npx vercel
```
Follow the prompts to link the project. The `vercel.json` in `frontend/` configures the build command, output directory, and SPA rewrites.

### Deploy from Git (Recommended)
1. Push this repository to GitHub/GitLab/Bitbucket.
2. In Vercel dashboard, click **New Project** and import the repository.
3. Set **Root Directory** to `frontend/`.
4. Vercel will auto-detect the Expo framework and use the `vercel.json` configuration.
5. Add the following **Environment Variables** in Vercel Project Settings (all are client-safe `EXPO_PUBLIC_*` keys):

| Variable | Description | Required |
|----------|-------------|----------|
| `EXPO_PUBLIC_API_URL` | Your deployed FastAPI backend URL (e.g., `https://api.yourdomain.com`). If not set, the app runs in demo mode with local fallback. | No (demo works without) |
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL (from Supabase Dashboard → Settings → API). | Yes for auth/database |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon public key (safe for client). | Yes for auth/database |
| `EXPO_PUBLIC_REVENUECAT_APPLE_KEY` | RevenueCat public Apple API key (from RevenueCat Dashboard). | Yes for in-app purchases on iOS/web |
| `EXPO_PUBLIC_REVENUECAT_GOOGLE_KEY` | RevenueCat public Google API key. | Yes for in-app purchases on Android/web |

> **Note:** Never expose `SUPABASE_SERVICE_ROLE_KEY`, `HF_TOKEN`, or `REVENUECAT_WEBHOOK_AUTH_HEADER` to the Vercel frontend environment. Those are server-side secrets and belong only in the backend deployment (if you deploy the FastAPI backend separately).

### Local Production Test
```bash
cd frontend
npx expo export -p web
npx serve dist
```
Open the provided local URL to verify the production build.

### Static Rendering & Dynamic Routes
The app uses Expo static rendering (`web.output: static`). Known routes are pre-rendered to HTML. Dynamic routes (e.g., `/journey/123`) fall back to the SPA entry point (`index.html`) via the Vercel rewrite rule, allowing client-side navigation to handle them.

### Limitations
- The FastAPI backend is not deployed to Vercel (it requires a Python server runtime). Deploy it separately (e.g., Render, Railway, Fly.io) and set `EXPO_PUBLIC_API_URL` accordingly.
- RevenueCat web purchases are not fully supported by the native SDK; the paywall will show a notice on web. Native iOS/Android builds retain full RevenueCat functionality.
- Image capture on web uses the browser file picker / camera API via `expo-image-picker` (web-compatible).
