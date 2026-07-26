import type { AiStandardOutputContract } from '../../shared/ai-output-contract.types';
import type { typeofAiGraphState } from '../workflow/state';

export class OutputGuard {
  private static UNSAFE_TERMS = [
    /bomb\s*making/i,
    /bribe/i,
    /kill/i // Basic examples, could be expanded based on rules
  ];

  /**
   * Scans the finalized AI output payload for unsafe or severely hallucinatory patterns.
   */
  public static verifyOutput(payload: AiStandardOutputContract, state: typeofAiGraphState): { isSafe: boolean; modifiedPayload: AiStandardOutputContract } {
    const textToCheck = `${payload.summary} ${payload.reasoning.join(' ')} ${payload.evidence.join(' ')}`;

    // 1. Unsafe Term Detection
    for (const term of this.UNSAFE_TERMS) {
      if (term.test(textToCheck)) {
        // Block and override payload
        payload.summary = 'SECURITY VIOLATION: The generated response was blocked because it violated safety policies.';
        payload.reasoning = [];
        payload.evidence = [];
        payload.confidence = 0;
        payload.warnings.push('SECURITY_BLOCK');
        return { isSafe: false, modifiedPayload: payload };
      }
    }

    // 2. Hallucination Safeguard (Basic Rule: High confidence but NO citations)
    if (payload.confidence > 0.8 && payload.citations.length === 0) {
      payload.warnings.push('HALLUCINATION_RISK: The model expressed high confidence but provided zero citations to source evidence.');
      payload.confidence = 0.4; // Downgrade confidence
    }

    // 3. Hallucination Safeguard: Verify generated citations exist in retrieved evidence
    if (state.evidence && state.evidence.length > 0 && payload.citations.length > 0) {
      const allRetrievedCitations = state.evidence.flatMap(e => e.citations || []);
      const hallucinatoryCitations = payload.citations.filter(c => !allRetrievedCitations.includes(c));
      
      if (hallucinatoryCitations.length > 0) {
        payload.warnings.push(`HALLUCINATION_RISK: The model cited sources that were not in the retrieved evidence: ${hallucinatoryCitations.join(', ')}`);
        // We could optionally strip them from payload.citations
      }
    }

    return { isSafe: true, modifiedPayload: payload };
  }
}
