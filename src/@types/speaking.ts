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

/** Teacher-side topic shape — identical to SpeakingTopicRes from BE */
export type SpeakingTopicManage = SpeakingTopic

/** Matches BE: CreateSpeakingTopicReq */
export interface CreateSpeakingTopicRequest {
  title: string
  promptText: string
  promptType: SpeakingPromptType
  difficulty: SpeakingDifficulty
  imageUrl?: string
  category?: string
}

/** Matches BE: UpdateSpeakingTopicReq — all fields optional (partial update) */
export interface UpdateSpeakingTopicRequest {
  title?: string
  promptText?: string
  promptType?: SpeakingPromptType
  difficulty?: SpeakingDifficulty
  imageUrl?: string
  category?: string
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
