import type { AiTool, AiToolContract } from './tool.types';

export interface TranslateToolInput {
  text: string;
  sourceLanguage?: string;
  targetLanguage: string;
  preserveLegalTerms?: boolean;
}

export interface TranslateToolOutput {
  translatedText: string;
  detectedSourceLanguage?: string;
  preservedTerms?: string[];
}

export interface TranslateToolContract extends AiToolContract<TranslateToolInput, TranslateToolOutput> {
  readonly name: 'translate';
  readonly category: 'communication';
}

export interface TranslateTool extends AiTool<TranslateToolInput, TranslateToolOutput> {
  readonly contract: TranslateToolContract;
}

export interface SpeechToTextToolInput {
  audioReferenceId?: string;
  audioUrl?: string;
  language?: string;
  diarizationEnabled?: boolean;
}

export interface SpeechSegment {
  speaker?: string;
  startMs?: number;
  endMs?: number;
  text: string;
}

export interface SpeechToTextToolOutput {
  transcript: string;
  language?: string;
  segments?: SpeechSegment[];
}

export interface SpeechToTextToolContract extends AiToolContract<SpeechToTextToolInput, SpeechToTextToolOutput> {
  readonly name: 'speechToText';
  readonly category: 'communication';
}

export interface SpeechToTextTool extends AiTool<SpeechToTextToolInput, SpeechToTextToolOutput> {
  readonly contract: SpeechToTextToolContract;
}

export interface TextToSpeechToolInput {
  text: string;
  language: string;
  voice?: string;
  outputFormat?: 'mp3' | 'wav';
}

export interface TextToSpeechToolOutput {
  audioReferenceId: string;
  audioUrl?: string;
  durationMs?: number;
  format: 'mp3' | 'wav';
}

export interface TextToSpeechToolContract extends AiToolContract<TextToSpeechToolInput, TextToSpeechToolOutput> {
  readonly name: 'textToSpeech';
  readonly category: 'communication';
}

export interface TextToSpeechTool extends AiTool<TextToSpeechToolInput, TextToSpeechToolOutput> {
  readonly contract: TextToSpeechToolContract;
}
