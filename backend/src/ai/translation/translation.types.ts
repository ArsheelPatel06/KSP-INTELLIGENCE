import type { AiWarning } from '../shared/ai-result.types';
import type { AiVoiceLanguage } from '../voice/voice.types';

/**
 * Translation types for KSP Intelligence OS.
 *
 * Covers language pairs, translation requests/results,
 * legal term preservation, quality metrics, and glossary contracts.
 *
 * Architecture only — no runtime implementation.
 */

// ---------------------------------------------------------------------------
// Translation Languages
// ---------------------------------------------------------------------------

export type AiTranslationLanguage = AiVoiceLanguage;

export interface AiTranslationDirection {
  source: AiTranslationLanguage;
  target: AiTranslationLanguage;
}

export interface AiTranslationLanguagePair {
  direction: AiTranslationDirection;
  supported: boolean;
  qualityTier: 'high' | 'medium' | 'experimental';
  notes?: string;
}

// ---------------------------------------------------------------------------
// Translation Request / Result
// ---------------------------------------------------------------------------

export interface AiTranslationRequest {
  requestId: string;
  text: string;
  sourceLanguage?: AiTranslationLanguage;
  targetLanguage: AiTranslationLanguage;
  autoDetectSource: boolean;
  preserveLegalTerms: boolean;
  preserveIdentifiers: boolean;
  glossaryId?: string;
  context?: AiTranslationContext;
}

export interface AiTranslationContext {
  domain: 'investigation' | 'legal' | 'analytics' | 'general';
  caseMasterId?: bigint;
  agentSource?: string;
}

export interface AiTranslationResult {
  requestId: string;
  translatedText: string;
  sourceLanguage: AiTranslationLanguage;
  detectedSourceLanguage?: AiTranslationLanguage;
  targetLanguage: AiTranslationLanguage;
  quality: AiTranslationQuality;
  preservedTerms: readonly AiPreservedTerm[];
  warnings: AiWarning[];
}

// ---------------------------------------------------------------------------
// Translation Quality
// ---------------------------------------------------------------------------

export interface AiTranslationQuality {
  confidence: number;
  sourceDetectionConfidence?: number;
  glossaryHitCount: number;
  preservedTermCount: number;
  estimatedAccuracy: 'high' | 'medium' | 'low';
  reviewRecommended: boolean;
}

// ---------------------------------------------------------------------------
// Legal Term Preservation
// ---------------------------------------------------------------------------

/**
 * Rules for preserving domain-specific terms during translation.
 * Legal section numbers, act codes, case IDs, FIR numbers, and
 * police terminology must remain untranslated to avoid ambiguity.
 */
export type AiPreservedTermCategory =
  | 'legal_section'
  | 'act_code'
  | 'case_identifier'
  | 'fir_number'
  | 'person_name'
  | 'place_name'
  | 'police_rank'
  | 'phone_number'
  | 'vehicle_number'
  | 'date_reference'
  | 'numeric_value';

export interface AiPreservedTerm {
  original: string;
  category: AiPreservedTermCategory;
  position: number;
  length: number;
  preservationReason: string;
}

export interface AiTermPreservationRule {
  category: AiPreservedTermCategory;
  pattern?: string;
  alwaysPreserve: boolean;
  transliterate: boolean;
  description: string;
}

// ---------------------------------------------------------------------------
// Glossary
// ---------------------------------------------------------------------------

export interface AiTranslationGlossaryEntry {
  sourceText: string;
  targetText: string;
  sourceLanguage: AiTranslationLanguage;
  targetLanguage: AiTranslationLanguage;
  category: AiGlossaryCategory;
  isApproved: boolean;
  notes?: string;
}

export type AiGlossaryCategory =
  | 'legal_term'
  | 'police_term'
  | 'crime_type'
  | 'procedural_term'
  | 'geographic_term'
  | 'rank_title'
  | 'evidence_term'
  | 'administrative_term';

export interface AiTranslationGlossary {
  glossaryId: string;
  name: string;
  description: string;
  sourceLanguage: AiTranslationLanguage;
  targetLanguage: AiTranslationLanguage;
  entryCount: number;
  categories: readonly AiGlossaryCategory[];
  lastUpdatedAt: string;
}

// ---------------------------------------------------------------------------
// Streaming Translation
// ---------------------------------------------------------------------------

export interface AiStreamingTranslationChunk {
  chunkId: string;
  sequenceNumber: number;
  sourceText: string;
  translatedText: string;
  isFinal: boolean;
  preservedTerms: readonly AiPreservedTerm[];
}
