import pytest
from src.ai_service.ai_router import AIRouter

@pytest.fixture
def router(tmp_path):
    config = tmp_path / "config.json"
    config.write_text('{"token_budget":500,"highend_threshold":100}')
    return AIRouter(str(config))

def test_analyze_job_basic(router):
    job = {"description": "Short desc"}
    result = router.analyze_job(job)
    assert "roi" in result and "mode" in result
    assert result["mode"] in ("highend", "costefficient")

def test_generate_proposal(router):
    job = {"title": "Test", "description": "desc"}
    user = {"name": "Tester"}
    proposal = router.generate_proposal(job, user)
    assert isinstance(proposal, str)
    assert "Test" in proposal or "Tester" in proposal
