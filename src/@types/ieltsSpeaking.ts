export type IeltsSpeakingPart = 'PART_1' | 'PART_2' | 'PART_3'
export type IeltsSpeakingSessionStatus = 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'

export interface IeltsSpeakingTest {
  id: number
  title: string
  description: string
  topic: string
  questionCount: number
  createdAt: string
}

export interface IeltsSpeakingQuestion {
  id: number
  part: IeltsSpeakingPart
  questionText: string
  cueCardText: string | null
  orderIndex: number
  prepTimeSeconds: number
}

export interface IeltsSpeakingTestDetail extends IeltsSpeakingTest {
  questions: IeltsSpeakingQuestion[]
}

export interface IeltsSpeakingResponseItem {
  id: number
  questionText: string
  part: IeltsSpeakingPart
  transcript: string | null
  durationSeconds: number
  orderIndex: number
}

export interface IeltsSpeakingSession {
  id: number
  testTitle: string
  status: IeltsSpeakingSessionStatus
  fluencyCoherenceBand: number | null
  lexicalResourceBand: number | null
  grammaticalRangeBand: number | null
  pronunciationBand: number | null
  overallBand: number | null
  aiFeedback: string | null
  responses: IeltsSpeakingResponseItem[]
  createdAt: string
  completedAt: string | null
}

export interface IeltsSpeakingHistory {
  sessionId: number
  testTitle: string
  overallBand: number | null
  status: IeltsSpeakingSessionStatus
  createdAt: string
}

// ─── Teacher Management ─────────────────────────────────────────────────────

/** Teacher list-row shape — identical to IeltsSpeakingTestRes from BE */
export type IeltsSpeakingTestManage = IeltsSpeakingTest

/** Question item payload used when creating/updating a test */
export interface IeltsSpeakingQuestionItem {
  part: IeltsSpeakingPart
  questionText: string
  cueCardText?: string | null
  orderIndex: number
  prepTimeSeconds?: number
}

/** Matches BE: CreateIeltsSpeakingTestReq */
export interface CreateIeltsSpeakingTestRequest {
  title: string
  description?: string
  topic?: string
  questions: IeltsSpeakingQuestionItem[]
}

/**
 * Matches BE: UpdateIeltsSpeakingTestReq
 * All fields optional (partial, null-aware). If `questions` is provided,
 * BE performs a FULL replacement of the test's question list.
 */
export interface UpdateIeltsSpeakingTestRequest {
  title?: string
  description?: string
  topic?: string
  questions?: IeltsSpeakingQuestionItem[]
}
