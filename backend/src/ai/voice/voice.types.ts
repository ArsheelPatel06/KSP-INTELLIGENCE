import type { AiWarning } from '../shared/ai-result.types';

/**
 * Voice AI core types for KSP Intelligence OS.
 *
 * Covers language support, audio formats, speech recognition results,
 * speech synthesis, noise handling, streaming, interruption policies,
 * and voice session context.
 *
 * Architecture only — no runtime implementation.
 */

// ---------------------------------------------------------------------------
// Language
// ---------------------------------------------------------------------------

/**
 * Supported voice languages.
 * en-IN: English (India) — primary interface language for officers.
 * kn-IN: Kannada — Karnataka state language for field officers.
 */
export type AiVoiceLanguage = 'en-IN' | 'kn-IN';

export interface AiLanguagePair {
  source: AiVoiceLanguage;
  target: AiVoiceLanguage;
}

// ---------------------------------------------------------------------------
// Audio Format and Streaming
// ---------------------------------------------------------------------------

export type AiAudioEncoding = 'pcm_s16le' | 'pcm_f32le' | 'wav' | 'ogg_opus' | 'mp3' | 'flac' | 'webm_opus';

export interface AiAudioFormat {
  encoding: AiAudioEncoding;
  sampleRateHz: number;
  channels: 1 | 2;
  bitDepth?: 16 | 24 | 32;
}

export interface AiAudioChunk {
  chunkId: string;
  sequenceNumber: number;
  data: ArrayBuffer;
  format: AiAudioFormat;
  durationMs: number;
  timestampMs: number;
  isFinal: boolean;
}

export interface AiAudioStream {
  streamId: string;
  format: AiAudioFormat;
  startedAt: string;
  totalDurationMs?: number;
  totalChunks?: number;
}

// ---------------------------------------------------------------------------
// Voice Activity Detection (VAD)
// ---------------------------------------------------------------------------

export interface AiVadConfig {
  enabled: boolean;
  silenceThresholdMs: number;
  speechThresholdMs: number;
  energyThresholdDb: number;
  aggressiveness: 'low' | 'medium' | 'high';
}

// ---------------------------------------------------------------------------
// Speech-to-Text Results
// ---------------------------------------------------------------------------

export interface AiSpeechWordTiming {
  word: string;
  startMs: number;
  endMs: number;
  confidence: number;
}

export interface AiSpeechAlternative {
  transcript: string;
  confidence: number;
  wordTimings?: AiSpeechWordTiming[];
}

export interface AiSpeechRecognitionResult {
  resultId: string;
  streamId?: string;
  language: AiVoiceLanguage;
  detectedLanguage?: AiVoiceLanguage;
  transcript: string;
  confidence: number;
  alternatives: AiSpeechAlternative[];
  isFinal: boolean;
  isInterim: boolean;
  durationMs: number;
  wordTimings?: AiSpeechWordTiming[];
  warnings: AiWarning[];
}

// ---------------------------------------------------------------------------
// Text-to-Speech
// ---------------------------------------------------------------------------

export type AiVoiceGender = 'male' | 'female' | 'neutral';
export type AiSpeechRate = 'x-slow' | 'slow' | 'medium' | 'fast' | 'x-fast';
export type AiSpeechPitch = 'x-low' | 'low' | 'medium' | 'high' | 'x-high';

export interface AiVoiceProfile {
  profileId: string;
  language: AiVoiceLanguage;
  gender: AiVoiceGender;
  name: string;
  description: string;
  defaultRate: AiSpeechRate;
  defaultPitch: AiSpeechPitch;
  suitableFor: readonly string[];
}

export interface AiSpeechSynthesisRequest {
  requestId: string;
  text: string;
  language: AiVoiceLanguage;
  voiceProfile?: string;
  rate?: AiSpeechRate;
  pitch?: AiSpeechPitch;
  outputFormat: AiAudioFormat;
  ssml?: string;
  emphasisTerms?: readonly string[];
}

export interface AiSpeechSynthesisResult {
  requestId: string;
  audioStreamId: string;
  language: AiVoiceLanguage;
  voiceProfileUsed: string;
  durationMs: number;
  characterCount: number;
  warnings: AiWarning[];
}

// ---------------------------------------------------------------------------
// Noise Handling
// ---------------------------------------------------------------------------

export type AiNoiseEnvironment =
  | 'quiet_office'
  | 'police_station'
  | 'traffic'
  | 'crowd'
  | 'vehicle'
  | 'outdoor_field'
  | 'indoor_meeting'
  | 'unknown';

export interface AiNoiseProfile {
  environment: AiNoiseEnvironment;
  estimatedSnrDb?: number;
  backgroundNoiseLevel: 'low' | 'medium' | 'high' | 'extreme';
  detectedAt?: string;
}

export interface AiNoiseHandlingPolicy {
  environment: AiNoiseEnvironment;
  enableNoiseReduction: boolean;
  enableAgc: boolean;
  enableEchoCancellation: boolean;
  vadAggressiveness: AiVadConfig['aggressiveness'];
  minConfidenceThreshold: number;
  retryOnLowConfidence: boolean;
  maxRetries: number;
  description: string;
}

// ---------------------------------------------------------------------------
// Streaming
// ---------------------------------------------------------------------------

export type AiVoiceStreamEventType =
  | 'stream_begin'
  | 'audio_chunk'
  | 'interim_result'
  | 'final_result'
  | 'end_of_speech'
  | 'stream_end'
  | 'stream_error'
  | 'interrupted'
  | 'language_detected'
  | 'noise_detected';

export interface AiVoiceStreamEvent {
  eventType: AiVoiceStreamEventType;
  streamId: string;
  timestamp: string;
  sequenceNumber: number;
  payload?: unknown;
}

export type AiVoiceStreamState =
  | 'idle'
  | 'listening'
  | 'processing'
  | 'speaking'
  | 'interrupted'
  | 'error'
  | 'closed';

// ---------------------------------------------------------------------------
// Interruption Handling
// ---------------------------------------------------------------------------

export type AiInterruptionMode = 'allow_barge_in' | 'queue_after_response' | 'ignore_during_critical';

export interface AiInterruptionPolicy {
  mode: AiInterruptionMode;
  allowDuringSpeech: boolean;
  minSpeechBeforeInterruptMs: number;
  resumeAfterInterrupt: boolean;
  criticalOutputTypes: readonly string[];
  description: string;
}

export interface AiInterruptionEvent {
  eventId: string;
  streamId: string;
  interruptedAt: string;
  reason: 'user_speech_detected' | 'manual_stop' | 'timeout' | 'error';
  speechProgressPercent: number;
  willResume: boolean;
}

// ---------------------------------------------------------------------------
// Voice Session Context
// ---------------------------------------------------------------------------

export interface AiVoiceSessionContext {
  voiceSessionId: string;
  chatSessionId?: string;
  userId: string;
  language: AiVoiceLanguage;
  alternateLanguage?: AiVoiceLanguage;
  noiseEnvironment: AiNoiseEnvironment;
  interruptionPolicy: AiInterruptionPolicy;
  streamState: AiVoiceStreamState;
  activeCaseMasterId?: bigint;
  turnCount: number;
  startedAt: string;
  lastActivityAt: string;
}

// ---------------------------------------------------------------------------
// Voice Configuration
// ---------------------------------------------------------------------------

export interface AiVoiceConfig {
  defaultLanguage: AiVoiceLanguage;
  fallbackLanguage: AiVoiceLanguage;
  inputFormat: AiAudioFormat;
  outputFormat: AiAudioFormat;
  vad: AiVadConfig;
  maxUtteranceDurationMs: number;
  maxSilenceDurationMs: number;
  streamingEnabled: boolean;
  interimResultsEnabled: boolean;
  autoLanguageDetection: boolean;
  translationEnabled: boolean;
}
