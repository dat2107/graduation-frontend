export type SpeakingPromptType = 'READ_ALOUD' | 'DESCRIBE_IMAGE' | 'FREE_SPEAK' | 'ANSWER_QUESTION'
export type SpeakingDifficulty = 'EASY' | 'MEDIUM' | 'HARD'

export interface SpeakingTopic {
  id: number
  title: string
  promptText: string
  promptType: SpeakingPromptType
  difficulty: SpeakingDifficulty
  imageUrl: string | null
  category: string
  createdAt: string
}

export interface SpeakingSubmission {
  id: number
  topicId: number
  topicTitle: string
  promptType: SpeakingPromptType
  transcript: string
  pronunciationScore: number
  fluencyScore: number
  contentScore: number
  grammarScore: number
  overallScore: number
  aiFeedback: string
  aiProvider: string
  model: string
  createdAt: string
}
