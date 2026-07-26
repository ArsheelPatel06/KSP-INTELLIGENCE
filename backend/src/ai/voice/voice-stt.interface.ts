import type { AiWarning } from '../shared/ai-result.types';
import type {
  AiAudioChunk,
  AiAudioFormat,
  AiNoiseProfile,
  AiSpeechRecognitionResult,
  AiVoiceLanguage,
} from './voice.types';

/**
 * Speech-to-Text provider interfaces for KSP Intelligence OS.
 *
 * Covers single-utterance recognition, streaming recognition,
 * noise filtering, and automatic language detection (Kannada/English).
 *
 * Architecture only — no runtime implementation.
 */

// ---------------------------------------------------------------------------
// STT Provider
// ---------------------------------------------------------------------------

export interface AiSpeechToTextRequest {
  requestId: string;
  language: AiVoiceLanguage;
  alternateLanguages?: readonly AiVoiceLanguage[];
  audioFormat: AiAudioFormat;
  enableInterimResults: boolean;
  enableWordTimings: boolean;
  enableAutoLanguageDetection: boolean;
  maxAlternatives: number;
  noiseProfile?: AiNoiseProfile;
  contextHints?: readonly string[];
  domainBoost?: readonly AiSttDomainBoostEntry[];
}

/**
 * Domain-specific phrase boosting for police/legal terminology.
 * Helps the STT model recognize field-specific vocabulary better.
 */
export interface AiSttDomainBoostEntry {
  category: 'legal_sections' | 'police_ranks' | 'case_identifiers' | 'geographic' | 'crime_types' | 'custom';
  phrases: readonly string[];
  boostWeight: number;
}

/**
 * Primary STT provider interface.
 * Supports both single-utterance and streaming recognition.
 */
export interface AiSpeechToTextProvider {
  readonly supportedLanguages: readonly AiVoiceLanguage[];
  readonly supportsStreaming: boolean;
  readonly supportsAutoLanguageDetection: boolean;

  recognize(
    audio: ArrayBuffer,
    request: AiSpeechToTextRequest,
  ): Promise<AiSpeechRecognitionResult>;

  startStreamingRecognition(
    request: AiSpeechToTextRequest,
    handler: AiSpeechToTextStreamHandler,
  ): Promise<AiSttStreamControl>;

  healthCheck(): Promise<boolean>;
}

// ---------------------------------------------------------------------------
// Streaming STT
// ---------------------------------------------------------------------------

/**
 * Control handle returned when streaming recognition starts.
 */
export interface AiSttStreamControl {
  streamId: string;
  sendAudioChunk(chunk: AiAudioChunk): Promise<void>;
  endStream(): Promise<AiSpeechRecognitionResult>;
  cancelStream(): Promise<void>;
}

/**
 * Callback handler for streaming recognition events.
 */
export interface AiSpeechToTextStreamHandler {
  onInterimResult(result: AiSpeechRecognitionResult): void;
  onFinalResult(result: AiSpeechRecognitionResult): void;
  onEndOfSpeech(streamId: string): void;
  onError(streamId: string, error: AiSttStreamError): void;
  onLanguageDetected?(streamId: string, language: AiVoiceLanguage, confidence: number): void;
  onNoiseDetected?(streamId: string, profile: AiNoiseProfile): void;
}

export interface AiSttStreamError {
  code: string;
  message: string;
  isRetryable: boolean;
  streamId: string;
}

// ---------------------------------------------------------------------------
// Noise Filter
// ---------------------------------------------------------------------------

/**
 * Preprocesses audio chunks for noise reduction before STT.
 * This runs on the audio pipeline before sending to the STT provider.
 */
export interface AiNoiseFilter {
  readonly supportedEnvironments: readonly AiNoiseProfile['environment'][];

  detectNoiseProfile(audioSample: ArrayBuffer, format: AiAudioFormat): Promise<AiNoiseProfile>;

  filterChunk(
    chunk: AiAudioChunk,
    noiseProfile: AiNoiseProfile,
  ): Promise<AiFilteredAudioResult>;
}

export interface AiFilteredAudioResult {
  chunk: AiAudioChunk;
  noiseReduced: boolean;
  estimatedSnrImprovement: number;
  warnings: AiWarning[];
}

// ---------------------------------------------------------------------------
// Language Detection
// ---------------------------------------------------------------------------

/**
 * Detects the spoken language when the officer hasn't specified one.
 * Critical for Karnataka field scenarios where officers may switch
 * between Kannada and English mid-conversation.
 */
export interface AiLanguageDetector {
  readonly supportedLanguages: readonly AiVoiceLanguage[];

  detectLanguage(
    audio: ArrayBuffer,
    format: AiAudioFormat,
    candidates: readonly AiVoiceLanguage[],
  ): Promise<AiLanguageDetectionResult>;
}

export interface AiLanguageDetectionResult {
  detectedLanguage: AiVoiceLanguage;
  confidence: number;
  alternativeLanguages: ReadonlyArray<{
    language: AiVoiceLanguage;
    confidence: number;
  }>;
  isCodeSwitched: boolean;
  warnings: AiWarning[];
}
