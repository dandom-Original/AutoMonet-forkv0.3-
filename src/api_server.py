import os
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import jwt
import httpx
from datetime import datetime

app = FastAPI(title="AutoMonet API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"]
)

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "changeme")

async def supabase_request(method, path, token, **kwargs):
    url = f"{SUPABASE_URL}/rest/v1/{path}"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    timeout = httpx.Timeout(10.0, connect=5.0)
    async with httpx.AsyncClient(timeout=timeout) as client:
        resp = await client.request(method, url, headers=headers, **kwargs)
        if resp.status_code >= 400:
            raise HTTPException(status_code=resp.status_code, detail=resp.text)
        return resp.json()

def verify_jwt(authorization: str = Header(...)):
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise
        payload = jwt.decode(token, SUPABASE_JWT_SECRET, algorithms=["HS256"])
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or missing token")

class Job(BaseModel):
    id: str
    title: str
    description: str
    budget: float
    skills: List[str]
    source: str
    status: Optional[str] = "new"

class Proposal(BaseModel):
    id: str
    job_id: str
    content: str
    status: str
    submitted_at: Optional[str] = None
    earnings: Optional[float] = None

class SettingsModel(BaseModel):
    profile: dict
    jobPreferences: dict
    aiSettings: dict
    platformSettings: dict
    systemSettings: dict

class LLMRequest(BaseModel):
    task_type: str
    force_high_quality: bool = False

@app.get("/jobs", response_model=List[Job])
async def get_jobs(user=Depends(verify_jwt)):
    data = await supabase_request("GET", f"job_opportunities?user_id=eq.{user['sub']}", SUPABASE_KEY)
    return data

@app.get("/proposals", response_model=List[Proposal])
async def get_proposals(user=Depends(verify_jwt)):
    data = await supabase_request("GET", f"proposals?user_id=eq.{user['sub']}", SUPABASE_KEY)
    return data

@app.post("/proposals", response_model=Proposal)
async def create_proposal(proposal: Proposal, user=Depends(verify_jwt)):
    from src.ai_service.llm_router import getLLMRouter
    router = getLLMRouter()
    budget = router.getBudgetStatus()
    if budget['daily']['remaining'] < 0.5:
        raise HTTPException(status_code=402, detail="Daily budget exhausted")
    payload = proposal.dict()
    payload['user_id'] = user['sub']
    data = await supabase_request("POST", "proposals", SUPABASE_KEY, json=[payload])
    return data[0]

@app.get("/settings", response_model=SettingsModel)
async def get_settings(user=Depends(verify_jwt)):
    data = await supabase_request("GET", f"user_settings?user_id=eq.{user['sub']}", SUPABASE_KEY)
    if not data:
        raise HTTPException(status_code=404, detail="Settings not found")
    return data[0]

@app.put("/settings", response_model=SettingsModel)
async def update_settings(settings: SettingsModel, user=Depends(verify_jwt)):
    data = await supabase_request("PATCH", f"user_settings?user_id=eq.{user['sub']}", SUPABASE_KEY, json=settings.dict())
    return data[0]

@app.post("/llm/select")
async def select_llm(req: LLMRequest, user=Depends(verify_jwt)):
    from src.ai_service.llm_router import getLLMRouter
    router = getLLMRouter()
    result = router.selectBestModel(req.task_type, {"input":500, "output":1500}, req.force_high_quality)
    return result

@app.get("/analytics")
async def get_analytics(user=Depends(verify_jwt)):
    data = await supabase_request("GET", f"earnings_forecast?user_id=eq.{user['sub']}", SUPABASE_KEY)
    return {"forecasts": data, "updated_at": datetime.utcnow().isoformat()}

@app.get("/health")
async def health():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}

if __name__ == "__main__":
    uvicorn.run("src.api_server:app", host="0.0.0.0", port=8000, reload=True)
