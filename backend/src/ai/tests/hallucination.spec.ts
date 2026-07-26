import { describe, it, expect } from 'vitest';
import { OutputGuard } from '../core/security/output-guard';
import type { AiStandardOutputContract } from '../shared/ai-output-contract.types';
import type { typeofAiGraphState } from '../core/workflow/state';

describe('Hallucination & Output Guards Suite', () => {
  it('should downgrade confidence and add warning when high confidence but zero citations are provided', () => {
    const payload: AiStandardOutputContract = {
      summary: 'Suspect is guilty.',
      reasoning: ['Because I said so'],
      evidence: [],
      confidence: 0.95, // High confidence
      citations: [], // Zero citations
      recommendations: [],
      relatedCases: [],
      legalSections: [],
      graph: {},
      analytics: {},
      warnings: [],
      metadata: {}
    };

    const state: any = { evidence: [] };
    
    const result = OutputGuard.verifyOutput(payload, state);
    
    expect(result.isSafe).toBe(true);
    expect(result.modifiedPayload.confidence).toBe(0.4);
    expect(result.modifiedPayload.warnings).toContainEqual(expect.stringContaining('HALLUCINATION_RISK'));
  });

  it('should warn when cited sources do not exist in the retrieved RAG evidence', () => {
    const payload: AiStandardOutputContract = {
      summary: 'Based on the FIR...',
      reasoning: [],
      evidence: [],
      confidence: 0.85,
      citations: ['FIR-999'], // Fake citation
      recommendations: [],
      relatedCases: [],
      legalSections: [],
      graph: {},
      analytics: {},
      warnings: [],
      metadata: {}
    };

    const state: any = { 
      evidence: [{
        sourceAgent: 'legal',
        facts: ['Real fact'],
        citations: ['FIR-111'] // Only FIR-111 was retrieved
      }] 
    };
    
    const result = OutputGuard.verifyOutput(payload, state);
    
    expect(result.isSafe).toBe(true);
    expect(result.modifiedPayload.warnings.some(w => w.includes('HALLUCINATION_RISK') && w.includes('FIR-999'))).toBe(true);
  });

  it('should block unsafe content completely', () => {
    const payload: AiStandardOutputContract = {
      summary: 'Instructions for bomb making are as follows...',
      reasoning: [],
      evidence: [],
      confidence: 0.9,
      citations: ['FIR-111'],
      recommendations: [],
      relatedCases: [],
      legalSections: [],
      graph: {},
      analytics: {},
      warnings: [],
      metadata: {}
    };

    const result = OutputGuard.verifyOutput(payload, {} as any);
    
    expect(result.isSafe).toBe(false);
    expect(result.modifiedPayload.summary).toContain('SECURITY VIOLATION');
    expect(result.modifiedPayload.warnings).toContain('SECURITY_BLOCK');
  });
});
