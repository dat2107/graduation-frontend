// ─── Vocabulary Types ─────────────────────────────────────────────────────────

export type WordLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
export type WordStatus = 'new' | 'learning' | 'mastered'
export type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'phrase'

export interface VocabWord {
  id: string
  word: string
  phonetic: string
  partOfSpeech: PartOfSpeech
  meaning: string
  example: string
  audioUrl: string | null
  level: WordLevel
  status: WordStatus
}

export interface VocabSet {
  id: string
  name: string
  description: string
  level: WordLevel
  topic: string
  emoji: string
  wordCount: number
  learnedCount: number
  masteredCount: number
}

export interface VocabSetDetail extends VocabSet {
  words: VocabWord[]
}

export interface FlashcardReviewRequest {
  wordId: string
  quality: 0 | 1 | 2 | 3  // 0=Quên, 1=Khó, 2=Được, 3=Dễ
}

export interface FlashcardReviewResponse {
  wordId: string
  quality: number
  newInterval: number
  nextReviewDate: string
  xpEarned: number
}

export interface VocabProgress {
  totalWords: number
  learnedWords: number
  masteredWords: number
  newWords: number
  reviewDueToday: number
  currentStreak: number
  longestStreak: number
  weeklyActivity: number[]
}
