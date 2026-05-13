import type { EnglishLevel, AiProvider } from './chat'

export interface WritingSubmission {
  id: number
  title: string | null
  content: string
  englishLevel: EnglishLevel
  aiProvider: AiProvider
  model: string
  grammarScore: number | null
  vocabularyScore: number | null
  coherenceScore: number | null
  taskResponseScore: number | null
  overallScore: number | null
  feedback: string | null
  correctedText: string | null
  createdAt: string
}

export interface SubmitWritingRequest {
  title?: string
  content: string
  englishLevel: EnglishLevel
}

export interface QuickCheckRequest {
  content: string
  englishLevel: EnglishLevel
}

export interface WritingError {
  original: string
  correction: string
  type: 'GRAMMAR' | 'SPELLING' | 'VOCABULARY' | 'PUNCTUATION'
  explanation: string
}

export interface QuickCheckResponse {
  errors: WritingError[]
  suggestions: string[]
}
