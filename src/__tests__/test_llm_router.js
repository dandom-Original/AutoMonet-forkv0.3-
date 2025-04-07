import { describe, it, expect } from 'vitest';
import { getLLMRouter } from '../ai_service/llm_router.js';

describe('LLM Router', () => {
  const router = getLLMRouter();

  it('selects a model for proposal generation', () => {
    const result = router.selectBestModel('PROPOSAL_GENERATION', {input:500, output:1500}, false);
    expect(result).toHaveProperty('modelId');
    expect(result).toHaveProperty('provider');
    expect(result.estimatedCost).toBeGreaterThanOrEqual(0);
  });

  it('falls back to cheaper model if budget low', () => {
    router.budgetTracking.daily.used = router.budgetTracking.daily.limit - 0.5;
    const result = router.selectBestModel('JOB_FILTERING', {input:100, output:200}, false);
    expect(result.estimatedCost).toBeLessThan(1);
  });
});
