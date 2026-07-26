import type { AiRequestContext } from '../shared/ai-request.types';
import type { AiAgentOutputEnvelope } from '../shared/ai-output-contract.types';
import type { AiWarning } from '../shared/ai-result.types';
import type { AiSpeechToTextProvider, AiNoiseFilter, AiLanguageDetector } from './voice-stt.interface';
import type { AiTextToSpeechProvider, AiVoiceProfileSelector, AiSpeechOutputFormatter } from './voice-tts.interface';
import type {
  AiInterruptionEvent,
  AiInterruptionPolicy,
  AiNoiseHandlingPolicy,
  AiSpeechRecognitionResult,
  AiSpeechSynthesisResult,
  AiVoiceConfig,
  AiVoiceLanguage,
  AiVoiceSessionContext,
  AiVoiceStreamState,
} from './voice.types';

/**
 * End-to-end voice conversation pipeline for KSP Intelligence OS.
 *
 * Orchestrates the full voice interaction cycle:
 * Speech → STT → Translation → AI Orchestrator → Response → TTS → Speech
 *
 * Architecture only — no runtime implementation.
 */

// ---------------------------------------------------------------------------
// Pipeline Capabilities
// ---------------------------------------------------------------------------

export interface AiVoicePipelineCapabilities {
  supportedLanguages: readonly AiVoiceLanguage[];
  supportsStreaming: boolean;
  supportsInterruption: boolean;
  supportsNoiseHandling: boolean;
  supportsAutoLanguageDetection: boolean;
  supportsTranslation: boolean;
  supportsCodeSwitching: boolean;
  maxConcurrentSessions: number;
}

// ---------------------------------------------------------------------------
// Pipeline Dependencies
// ---------------------------------------------------------------------------

export interface AiVoicePipelineDependencies {
  sttProvider: AiSpeechToTextProvider;
  ttsProvider: AiTextToSpeechProvider;
  noiseFilter: AiNoiseFilter;
  languageDetector: AiLanguageDetector;
  voiceProfileSelector: AiVoiceProfileSelector;
  speechOutputFormatter: AiSpeechOutputFormatter;
  // Translation and orchestrator are referenced by interface but live in their own modules.
  // They are injected at construction time.
}

// ---------------------------------------------------------------------------
// Voice Conversation State
// ---------------------------------------------------------------------------

export interface AiVoiceConversationState {
  session: AiVoiceSessionContext;
  streamState: AiVoiceStreamState;
  currentNoisePolicy: AiNoiseHandlingPolicy;
  currentInterruptionPolicy: AiInterruptionPolicy;
  lastRecognitionResult?: AiSpeechRecognitionResult;
  lastSynthesisResult?: AiSpeechSynthesisResult;
  lastAgentOutput?: AiAgentOutputEnvelope;
  pendingInterruption?: AiInterruptionEvent;
  errorCount: number;
  consecutiveNoSpeechCount: number;
}

// ---------------------------------------------------------------------------
// Voice Turn
// ---------------------------------------------------------------------------

/**
 * A single voice conversation turn: officer speaks → system responds.
 */
export interface AiVoiceTurnRequest {
  sessionContext: AiVoiceSessionContext;
  requestContext: AiRequestContext;
  audioData?: ArrayBuffer;
  textOverride?: string;
  preferredLanguage?: AiVoiceLanguage;
}

export interface AiVoiceTurnResult {
  turnId: string;
  recognition: AiSpeechRecognitionResult;
  translatedText?: string;
  agentOutput: AiAgentOutputEnvelope;
  spokenResponseText: string;
  synthesis: AiSpeechSynthesisResult;
  audioResponseStreamId: string;
  languageUsed: AiVoiceLanguage;
  responseLanguage: AiVoiceLanguage;
  wasTranslated: boolean;
  wasInterrupted: boolean;
  turnDurationMs: number;
  warnings: AiWarning[];
}

// ---------------------------------------------------------------------------
// Voice Pipeline Interface
// ---------------------------------------------------------------------------

/**
 * Primary voice pipeline interface.
 * Manages the full lifecycle of a voice conversation session.
 */
export interface AiVoicePipeline {
  readonly capabilities: AiVoicePipelineCapabilities;
  readonly config: AiVoiceConfig;

  startSession(
    userId: string,
    requestContext: AiRequestContext,
    language?: AiVoiceLanguage,
  ): Promise<AiVoiceSessionContext>;

  processTurn(request: AiVoiceTurnRequest): Promise<AiVoiceTurnResult>;

  handleInterruption(
    session: AiVoiceSessionContext,
    event: AiInterruptionEvent,
  ): Promise<AiVoiceConversationState>;

  getSessionState(voiceSessionId: string): Promise<AiVoiceConversationState | null>;

  endSession(voiceSessionId: string): Promise<AiVoiceSessionSummary>;
}

export interface AiVoiceSessionSummary {
  voiceSessionId: string;
  chatSessionId?: string;
  totalTurns: number;
  totalDurationMs: number;
  languagesUsed: readonly AiVoiceLanguage[];
  translationCount: number;
  interruptionCount: number;
  averageRecognitionConfidence: number;
  errorCount: number;
  endedAt: string;
}

// ---------------------------------------------------------------------------
// Voice Event Bus
// ---------------------------------------------------------------------------

/**
 * Event types emitted during voice conversation.
 * These can drive UI updates, metrics, and logging.
 */
export type AiVoicePipelineEventType =
  | 'session_started'
  | 'session_ended'
  | 'listening_started'
  | 'listening_stopped'
  | 'recognition_interim'
  | 'recognition_final'
  | 'translation_completed'
  | 'agent_processing_started'
  | 'agent_processing_completed'
  | 'synthesis_started'
  | 'synthesis_completed'
  | 'interruption_detected'
  | 'interruption_handled'
  | 'language_switched'
  | 'noise_environment_changed'
  | 'error_occurred'
  | 'no_speech_detected';

export interface AiVoicePipelineEvent {
  eventType: AiVoicePipelineEventType;
  voiceSessionId: string;
  timestamp: string;
  details: Record<string, unknown>;
}

export interface AiVoicePipelineEventHandler {
  onEvent(event: AiVoicePipelineEvent): void;
}
