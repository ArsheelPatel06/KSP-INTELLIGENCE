import type { AiWarning } from '../shared/ai-result.types';
import type { AiStandardOutputContract } from '../shared/ai-output-contract.types';
import type {
  AiAudioChunk,
  AiSpeechSynthesisRequest,
  AiSpeechSynthesisResult,
  AiVoiceLanguage,
  AiVoiceProfile,
} from './voice.types';

/**
 * Text-to-Speech provider interfaces for KSP Intelligence OS.
 *
 * Covers full-text synthesis, streaming synthesis, voice profile selection,
 * and AI output condensation for speech-friendly delivery.
 *
 * Architecture only — no runtime implementation.
 */

// ---------------------------------------------------------------------------
// TTS Provider
// ---------------------------------------------------------------------------

/**
 * Primary TTS provider interface.
 * Supports both full-text and streaming synthesis.
 */
export interface AiTextToSpeechProvider {
  readonly supportedLanguages: readonly AiVoiceLanguage[];
  readonly availableProfiles: readonly AiVoiceProfile[];
  readonly supportsStreaming: boolean;
  readonly supportsSsml: boolean;

  synthesize(request: AiSpeechSynthesisRequest): Promise<AiTtsSynthesisOutput>;

  startStreamingSynthesis(
    request: AiSpeechSynthesisRequest,
    handler: AiTtsStreamHandler,
  ): Promise<AiTtsStreamControl>;

  healthCheck(): Promise<boolean>;
}

export interface AiTtsSynthesisOutput {
  result: AiSpeechSynthesisResult;
  audioData: ArrayBuffer;
}

// ---------------------------------------------------------------------------
// Streaming TTS
// ---------------------------------------------------------------------------

export interface AiTtsStreamControl {
  streamId: string;
  pause(): Promise<void>;
  resume(): Promise<void>;
  cancel(): Promise<void>;
  getProgress(): Promise<AiTtsStreamProgress>;
}

export interface AiTtsStreamProgress {
  streamId: string;
  totalCharacters: number;
  synthesizedCharacters: number;
  elapsedMs: number;
  estimatedRemainingMs: number;
}

export interface AiTtsStreamHandler {
  onAudioChunk(chunk: AiAudioChunk): void;
  onComplete(result: AiSpeechSynthesisResult): void;
  onError(streamId: string, error: AiTtsStreamError): void;
  onInterrupted?(streamId: string, progressPercent: number): void;
}

export interface AiTtsStreamError {
  code: string;
  message: string;
  isRetryable: boolean;
  streamId: string;
}

// ---------------------------------------------------------------------------
// Voice Profile Selection
// ---------------------------------------------------------------------------

/**
 * Selects the appropriate voice profile based on language, context, and user preference.
 */
export interface AiVoiceProfileSelector {
  selectProfile(
    language: AiVoiceLanguage,
    context: AiVoiceProfileSelectionContext,
  ): Promise<AiVoiceProfile>;

  listProfiles(language?: AiVoiceLanguage): Promise<readonly AiVoiceProfile[]>;
}

export interface AiVoiceProfileSelectionContext {
  userPreferredVoiceId?: string;
  urgency?: 'low' | 'normal' | 'high' | 'critical';
  outputMode?: 'investigation' | 'legal' | 'alert' | 'briefing' | 'conversational';
  gender?: AiVoiceProfile['gender'];
}

// ---------------------------------------------------------------------------
// Speech Output Formatter
// ---------------------------------------------------------------------------

/**
 * Converts the structured AI output contract into speech-friendly condensed text.
 *
 * The full JSON output contract includes sections like evidence arrays, graph data,
 * analytics items, and legal citations that are too verbose for spoken delivery.
 * This formatter produces a concise, naturally spoken version while preserving
 * critical information like confidence, review requirements, and key recommendations.
 */
export interface AiSpeechOutputFormatter {
  formatForSpeech(
    output: AiStandardOutputContract,
    language: AiVoiceLanguage,
    options?: AiSpeechFormattingOptions,
  ): Promise<AiSpeechFormattedOutput>;
}

export interface AiSpeechFormattingOptions {
  maxDurationSeconds?: number;
  includeConfidence: boolean;
  includeReviewWarning: boolean;
  includeFollowUpQuestions: boolean;
  includeRecommendations: boolean;
  maxRecommendations?: number;
  condensationLevel: 'brief' | 'standard' | 'detailed';
}

export interface AiSpeechFormattedOutput {
  spokenText: string;
  ssml?: string;
  language: AiVoiceLanguage;
  estimatedDurationMs: number;
  sectionsIncluded: readonly string[];
  sectionsOmitted: readonly string[];
  warnings: AiWarning[];
}
