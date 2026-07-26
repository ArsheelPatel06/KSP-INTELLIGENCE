import type {
  AiAudioFormat,
  AiInterruptionPolicy,
  AiNoiseHandlingPolicy,
  AiVadConfig,
  AiVoiceConfig,
  AiVoiceLanguage,
  AiVoiceProfile,
} from './voice.types';
import type { AiVoicePipelineCapabilities } from './voice-pipeline.interface';
import type { AiSpeechFormattingOptions } from './voice-tts.interface';
import type { AiSttDomainBoostEntry } from './voice-stt.interface';

/**
 * Default configurations and constants for the Voice AI layer.
 *
 * Architecture only — no runtime implementation.
 */

// ---------------------------------------------------------------------------
// Supported Languages
// ---------------------------------------------------------------------------

export const AI_VOICE_SUPPORTED_LANGUAGES: readonly AiVoiceLanguage[] = ['en-IN', 'kn-IN'] as const;

// ---------------------------------------------------------------------------
// Default Audio Formats
// ---------------------------------------------------------------------------

export const AI_VOICE_DEFAULT_INPUT_FORMAT: AiAudioFormat = {
  encoding: 'pcm_s16le',
  sampleRateHz: 16000,
  channels: 1,
  bitDepth: 16,
};

export const AI_VOICE_DEFAULT_OUTPUT_FORMAT: AiAudioFormat = {
  encoding: 'ogg_opus',
  sampleRateHz: 24000,
  channels: 1,
};

// ---------------------------------------------------------------------------
// Default VAD Configuration
// ---------------------------------------------------------------------------

export const AI_VOICE_DEFAULT_VAD: AiVadConfig = {
  enabled: true,
  silenceThresholdMs: 1500,
  speechThresholdMs: 250,
  energyThresholdDb: -35,
  aggressiveness: 'medium',
};

// ---------------------------------------------------------------------------
// Default Voice Configuration
// ---------------------------------------------------------------------------

export const AI_VOICE_DEFAULT_CONFIG: AiVoiceConfig = {
  defaultLanguage: 'en-IN',
  fallbackLanguage: 'kn-IN',
  inputFormat: AI_VOICE_DEFAULT_INPUT_FORMAT,
  outputFormat: AI_VOICE_DEFAULT_OUTPUT_FORMAT,
  vad: AI_VOICE_DEFAULT_VAD,
  maxUtteranceDurationMs: 60000,
  maxSilenceDurationMs: 5000,
  streamingEnabled: true,
  interimResultsEnabled: true,
  autoLanguageDetection: true,
  translationEnabled: true,
};

// ---------------------------------------------------------------------------
// Voice Profiles
// ---------------------------------------------------------------------------

export const AI_VOICE_PROFILES: readonly AiVoiceProfile[] = [
  {
    profileId: 'en-in-male-professional',
    language: 'en-IN',
    gender: 'male',
    name: 'English Professional Male',
    description: 'Clear, professional Indian English voice suitable for investigation briefings and legal outputs.',
    defaultRate: 'medium',
    defaultPitch: 'medium',
    suitableFor: ['investigation', 'legal', 'briefing', 'conversational'],
  },
  {
    profileId: 'en-in-female-professional',
    language: 'en-IN',
    gender: 'female',
    name: 'English Professional Female',
    description: 'Clear, professional Indian English voice suitable for alert notifications and dashboard summaries.',
    defaultRate: 'medium',
    defaultPitch: 'medium',
    suitableFor: ['alert', 'briefing', 'conversational'],
  },
  {
    profileId: 'kn-in-male-professional',
    language: 'kn-IN',
    gender: 'male',
    name: 'Kannada Professional Male',
    description: 'Clear Kannada voice for field officers conducting investigations in the local language.',
    defaultRate: 'medium',
    defaultPitch: 'medium',
    suitableFor: ['investigation', 'legal', 'conversational'],
  },
  {
    profileId: 'kn-in-female-professional',
    language: 'kn-IN',
    gender: 'female',
    name: 'Kannada Professional Female',
    description: 'Clear Kannada voice suitable for alerts and investigation guidance for field officers.',
    defaultRate: 'medium',
    defaultPitch: 'medium',
    suitableFor: ['alert', 'briefing', 'conversational'],
  },
] as const;

// ---------------------------------------------------------------------------
// Noise Handling Presets
// ---------------------------------------------------------------------------

export const AI_VOICE_NOISE_POLICIES: readonly AiNoiseHandlingPolicy[] = [
  {
    environment: 'quiet_office',
    enableNoiseReduction: false,
    enableAgc: true,
    enableEchoCancellation: false,
    vadAggressiveness: 'low',
    minConfidenceThreshold: 0.7,
    retryOnLowConfidence: false,
    maxRetries: 0,
    description: 'Standard office environment with minimal background noise.',
  },
  {
    environment: 'police_station',
    enableNoiseReduction: true,
    enableAgc: true,
    enableEchoCancellation: true,
    vadAggressiveness: 'medium',
    minConfidenceThreshold: 0.6,
    retryOnLowConfidence: true,
    maxRetries: 1,
    description: 'Busy police station with ambient chatter, phones, and equipment noise.',
  },
  {
    environment: 'traffic',
    enableNoiseReduction: true,
    enableAgc: true,
    enableEchoCancellation: false,
    vadAggressiveness: 'high',
    minConfidenceThreshold: 0.5,
    retryOnLowConfidence: true,
    maxRetries: 2,
    description: 'Outdoor traffic environment with vehicle noise and wind.',
  },
  {
    environment: 'crowd',
    enableNoiseReduction: true,
    enableAgc: true,
    enableEchoCancellation: true,
    vadAggressiveness: 'high',
    minConfidenceThreshold: 0.5,
    retryOnLowConfidence: true,
    maxRetries: 2,
    description: 'Crowded area with multiple conversations and public noise.',
  },
  {
    environment: 'vehicle',
    enableNoiseReduction: true,
    enableAgc: true,
    enableEchoCancellation: false,
    vadAggressiveness: 'medium',
    minConfidenceThreshold: 0.55,
    retryOnLowConfidence: true,
    maxRetries: 1,
    description: 'Inside a patrol vehicle with engine and road noise.',
  },
  {
    environment: 'outdoor_field',
    enableNoiseReduction: true,
    enableAgc: true,
    enableEchoCancellation: false,
    vadAggressiveness: 'high',
    minConfidenceThreshold: 0.5,
    retryOnLowConfidence: true,
    maxRetries: 2,
    description: 'Outdoor field visit with wind, distant traffic, and environmental noise.',
  },
  {
    environment: 'indoor_meeting',
    enableNoiseReduction: false,
    enableAgc: true,
    enableEchoCancellation: true,
    vadAggressiveness: 'low',
    minConfidenceThreshold: 0.7,
    retryOnLowConfidence: false,
    maxRetries: 0,
    description: 'Indoor meeting room with controlled acoustics.',
  },
  {
    environment: 'unknown',
    enableNoiseReduction: true,
    enableAgc: true,
    enableEchoCancellation: true,
    vadAggressiveness: 'medium',
    minConfidenceThreshold: 0.55,
    retryOnLowConfidence: true,
    maxRetries: 1,
    description: 'Unclassified environment — applies moderate noise handling as default.',
  },
] as const;

// ---------------------------------------------------------------------------
// Interruption Policy Defaults
// ---------------------------------------------------------------------------

export const AI_VOICE_DEFAULT_INTERRUPTION_POLICY: AiInterruptionPolicy = {
  mode: 'allow_barge_in',
  allowDuringSpeech: true,
  minSpeechBeforeInterruptMs: 500,
  resumeAfterInterrupt: false,
  criticalOutputTypes: ['legal_recommendation', 'review_warning', 'escalation_alert'],
  description: 'Allow officers to interrupt system speech by speaking. Critical legal outputs block interruption.',
};

export const AI_VOICE_CRITICAL_INTERRUPTION_POLICY: AiInterruptionPolicy = {
  mode: 'ignore_during_critical',
  allowDuringSpeech: false,
  minSpeechBeforeInterruptMs: 0,
  resumeAfterInterrupt: true,
  criticalOutputTypes: ['legal_recommendation', 'review_warning', 'escalation_alert', 'risk_score'],
  description: 'Do not allow interruptions during critical legal or risk outputs. Resume after delivery.',
};

// ---------------------------------------------------------------------------
// Pipeline Capabilities
// ---------------------------------------------------------------------------

export const AI_VOICE_PIPELINE_CAPABILITIES: AiVoicePipelineCapabilities = {
  supportedLanguages: AI_VOICE_SUPPORTED_LANGUAGES,
  supportsStreaming: true,
  supportsInterruption: true,
  supportsNoiseHandling: true,
  supportsAutoLanguageDetection: true,
  supportsTranslation: true,
  supportsCodeSwitching: true,
  maxConcurrentSessions: 50,
};

// ---------------------------------------------------------------------------
// Speech Output Formatting Defaults
// ---------------------------------------------------------------------------

export const AI_VOICE_DEFAULT_SPEECH_FORMATTING: AiSpeechFormattingOptions = {
  maxDurationSeconds: 45,
  includeConfidence: true,
  includeReviewWarning: true,
  includeFollowUpQuestions: true,
  includeRecommendations: true,
  maxRecommendations: 3,
  condensationLevel: 'standard',
};

// ---------------------------------------------------------------------------
// Domain-Specific Phrase Boosting
// ---------------------------------------------------------------------------

export const AI_VOICE_DOMAIN_BOOST_ENTRIES: readonly AiSttDomainBoostEntry[] = [
  {
    category: 'legal_sections',
    phrases: ['IPC', 'BNS', 'BNSS', 'CrPC', 'section', 'subsection', 'act', 'punishment'],
    boostWeight: 1.5,
  },
  {
    category: 'police_ranks',
    phrases: ['DGP', 'IGP', 'SP', 'DSP', 'Inspector', 'SI', 'ASI', 'PSI', 'Constable', 'SHO'],
    boostWeight: 1.3,
  },
  {
    category: 'case_identifiers',
    phrases: ['FIR', 'crime number', 'case number', 'chargesheet', 'complainant', 'accused', 'witness'],
    boostWeight: 1.4,
  },
  {
    category: 'geographic',
    phrases: ['district', 'station', 'jurisdiction', 'Bengaluru', 'Mysuru', 'Hubli', 'Dharwad', 'Mangalore', 'Belgaum'],
    boostWeight: 1.2,
  },
  {
    category: 'crime_types',
    phrases: ['burglary', 'robbery', 'theft', 'murder', 'assault', 'fraud', 'dowry', 'kidnapping', 'dacoity'],
    boostWeight: 1.3,
  },
] as const;

// ---------------------------------------------------------------------------
// Voice Defaults Bundle
// ---------------------------------------------------------------------------

export const AI_VOICE_DEFAULTS = {
  config: AI_VOICE_DEFAULT_CONFIG,
  profiles: AI_VOICE_PROFILES,
  noisePolicies: AI_VOICE_NOISE_POLICIES,
  interruptionPolicy: AI_VOICE_DEFAULT_INTERRUPTION_POLICY,
  pipelineCapabilities: AI_VOICE_PIPELINE_CAPABILITIES,
  speechFormatting: AI_VOICE_DEFAULT_SPEECH_FORMATTING,
  domainBoost: AI_VOICE_DOMAIN_BOOST_ENTRIES,
} as const;
