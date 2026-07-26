import type { AiWarning } from '../shared/ai-result.types';
import type {
  AiStreamingTranslationChunk,
  AiTranslationGlossary,
  AiTranslationGlossaryEntry,
  AiTranslationLanguage,
  AiTranslationRequest,
  AiTranslationResult,
} from './translation.types';

/**
 * Translation provider interfaces for KSP Intelligence OS.
 *
 * Covers text translation, streaming translation, language detection,
 * domain-specific glossary management, and post-processing for
 * legal term accuracy.
 *
 * Architecture only — no runtime implementation.
 */

// ---------------------------------------------------------------------------
// Translation Provider
// ---------------------------------------------------------------------------

/**
 * Primary translation provider interface.
 * Supports single text, streaming, and language detection.
 */
export interface AiTranslationProvider {
  readonly supportedLanguages: readonly AiTranslationLanguage[];
  readonly supportsStreaming: boolean;
  readonly supportsAutoDetection: boolean;

  translate(request: AiTranslationRequest): Promise<AiTranslationResult>;

  translateStreaming(
    request: AiTranslationRequest,
    handler: AiStreamingTranslationHandler,
  ): Promise<AiTranslationStreamControl>;

  detectLanguage(
    text: string,
    candidates: readonly AiTranslationLanguage[],
  ): Promise<AiTextLanguageDetectionResult>;

  healthCheck(): Promise<boolean>;
}

export interface AiTranslationStreamControl {
  streamId: string;
  sendTextChunk(text: string, isFinal: boolean): Promise<void>;
  endStream(): Promise<AiTranslationResult>;
  cancelStream(): Promise<void>;
}

export interface AiStreamingTranslationHandler {
  onChunk(chunk: AiStreamingTranslationChunk): void;
  onComplete(result: AiTranslationResult): void;
  onError(streamId: string, error: AiTranslationStreamError): void;
}

export interface AiTranslationStreamError {
  code: string;
  message: string;
  isRetryable: boolean;
  streamId: string;
}

export interface AiTextLanguageDetectionResult {
  detectedLanguage: AiTranslationLanguage;
  confidence: number;
  alternatives: ReadonlyArray<{
    language: AiTranslationLanguage;
    confidence: number;
  }>;
  isCodeMixed: boolean;
  warnings: AiWarning[];
}

// ---------------------------------------------------------------------------
// Legal Glossary
// ---------------------------------------------------------------------------

/**
 * Domain-specific glossary for police and legal terminology.
 *
 * This ensures that translations of legal terms, police ranks,
 * crime types, and procedural language remain accurate and consistent
 * across Kannada and English.
 */
export interface AiLegalGlossaryProvider {
  getGlossary(glossaryId: string): Promise<AiTranslationGlossary | null>;

  listGlossaries(
    sourceLanguage?: AiTranslationLanguage,
    targetLanguage?: AiTranslationLanguage,
  ): Promise<readonly AiTranslationGlossary[]>;

  lookupTerm(
    term: string,
    sourceLanguage: AiTranslationLanguage,
    targetLanguage: AiTranslationLanguage,
  ): Promise<AiTranslationGlossaryEntry | null>;

  searchTerms(
    query: string,
    glossaryId?: string,
  ): Promise<readonly AiTranslationGlossaryEntry[]>;
}

// ---------------------------------------------------------------------------
// Post-Processor
// ---------------------------------------------------------------------------

/**
 * Post-processes translated text to restore preserved terms
 * and validate legal accuracy.
 *
 * After translation, certain terms (section numbers, act codes, case IDs)
 * that were placeholder-protected need to be restored. This interface also
 * validates that no legal terminology was incorrectly translated.
 */
export interface AiTranslationPostProcessor {
  restorePreservedTerms(
    translatedText: string,
    placeholderMap: ReadonlyMap<string, string>,
  ): string;

  validateLegalAccuracy(
    sourceText: string,
    translatedText: string,
    sourceLanguage: AiTranslationLanguage,
    targetLanguage: AiTranslationLanguage,
  ): Promise<AiTranslationValidationResult>;
}

export interface AiTranslationValidationResult {
  isValid: boolean;
  issues: readonly AiTranslationIssue[];
  warnings: AiWarning[];
}

export interface AiTranslationIssue {
  issueType: 'term_mistranslated' | 'section_altered' | 'identifier_changed' | 'meaning_shifted';
  sourceFragment: string;
  translatedFragment: string;
  suggestion?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}
