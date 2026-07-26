import type {
  AiGlossaryCategory,
  AiTermPreservationRule,
  AiTranslationLanguagePair,
} from './translation.types';

/**
 * Default configurations and constants for the Translation layer.
 *
 * Architecture only — no runtime implementation.
 */

// ---------------------------------------------------------------------------
// Supported Language Pairs
// ---------------------------------------------------------------------------

export const AI_TRANSLATION_SUPPORTED_PAIRS: readonly AiTranslationLanguagePair[] = [
  {
    direction: { source: 'en-IN', target: 'kn-IN' },
    supported: true,
    qualityTier: 'high',
    notes: 'Primary translation path for investigation output delivery to field officers.',
  },
  {
    direction: { source: 'kn-IN', target: 'en-IN' },
    supported: true,
    qualityTier: 'high',
    notes: 'Primary translation path for field officer input to the AI orchestrator.',
  },
] as const;

// ---------------------------------------------------------------------------
// Legal Term Preservation Rules
// ---------------------------------------------------------------------------

export const AI_TRANSLATION_PRESERVATION_RULES: readonly AiTermPreservationRule[] = [
  {
    category: 'legal_section',
    alwaysPreserve: true,
    transliterate: false,
    description: 'IPC/BNS sections must remain strictly untranslated to avoid ambiguity. e.g., "IPC 302" should not be translated.',
  },
  {
    category: 'act_code',
    alwaysPreserve: true,
    transliterate: false,
    description: 'Act abbreviations like "BNS", "BNSS", "CrPC" must remain untranslated.',
  },
  {
    category: 'case_identifier',
    alwaysPreserve: true,
    transliterate: false,
    description: 'Case numbers, Crime Numbers, and FIR Numbers must remain exactly as entered.',
  },
  {
    category: 'fir_number',
    alwaysPreserve: true,
    transliterate: false,
    description: 'Specific FIR Number formatting (e.g., 0012/2026) must remain untouched.',
  },
  {
    category: 'person_name',
    alwaysPreserve: false,
    transliterate: true,
    description: 'Names should be transliterated phonetically, not translated literally.',
  },
  {
    category: 'place_name',
    alwaysPreserve: false,
    transliterate: true,
    description: 'Locations should be transliterated. Known district names may map to established Kannada spellings.',
  },
  {
    category: 'police_rank',
    alwaysPreserve: false,
    transliterate: false,
    description: 'Ranks like "Inspector" or "Superintendent" can use established Kannada equivalents or acronyms (e.g., SP, DSP).',
  },
  {
    category: 'phone_number',
    alwaysPreserve: true,
    transliterate: false,
    description: 'Numeric phone numbers must remain as digits.',
  },
  {
    category: 'vehicle_number',
    alwaysPreserve: true,
    transliterate: false,
    description: 'Vehicle registration numbers (e.g., KA-01-AB-1234) must remain strictly as written.',
  },
  {
    category: 'date_reference',
    alwaysPreserve: false,
    transliterate: false,
    description: 'Dates should be translated to the locale-appropriate format but maintain the exact day/month/year meaning.',
  },
  {
    category: 'numeric_value',
    alwaysPreserve: true,
    transliterate: false,
    description: 'Currency amounts, ages, and quantities should remain numeric.',
  },
] as const;

// ---------------------------------------------------------------------------
// Glossary Categories
// ---------------------------------------------------------------------------

export const AI_GLOSSARY_CATEGORIES: readonly AiGlossaryCategory[] = [
  'legal_term',
  'police_term',
  'crime_type',
  'procedural_term',
  'geographic_term',
  'rank_title',
  'evidence_term',
  'administrative_term',
] as const;

// ---------------------------------------------------------------------------
// Translation Quality Thresholds
// ---------------------------------------------------------------------------

export const AI_TRANSLATION_QUALITY_THRESHOLDS = {
  highConfidenceMin: 0.9,
  mediumConfidenceMin: 0.75,
  reviewRecommendedThreshold: 0.7,
} as const;
