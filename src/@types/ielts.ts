// ─── IELTS Practice Types ─────────────────────────────────────────────────────

export type IeltsSkill = 'reading' | 'listening'
export type IeltsDifficulty = 'easy' | 'medium' | 'hard'
export type IeltsQuestionType = 'multiple_choice' | 'true_false' | 'fill_in_blank'

export interface IeltsOption {
  optionKey: string
  optionText: string
}

export interface IeltsQuestion {
  id: number
  orderIndex: number
  questionType: IeltsQuestionType
  questionText: string
  passage: string | null
  options: IeltsOption[]
}

export interface IeltsTest {
  id: number
  title: string
  description: string
  skill: IeltsSkill
  level: string
  questionCount: number
  durationMinutes: number
  difficulty: IeltsDifficulty
  audioUrl: string | null
  completedCount: number
  bestScore: number | null
}

export interface IeltsTestDetail extends IeltsTest {
  questions: IeltsQuestion[]
}

export interface IeltsSubmitRequest {
  answers: Record<number, string> // questionId → selectedOptionKey or fill-in text
  timeTakenSeconds: number
}

export interface IeltsAnswerDetail {
  questionId: number
  selectedAnswer: string | null
  correctAnswer: string
  isCorrect: boolean
  /** Fallback: backend (Lombok/Jackson) may serialize the boolean as `correct` */
  correct?: boolean
  explanation: string
}

export interface IeltsSubmitResult {
  testId: number
  totalQuestions: number
  correctCount: number
  score: number
  timeTakenSeconds: number
  xpEarned: number
  details: IeltsAnswerDetail[]
  completedAt: string
}

export interface IeltsHistoryItem {
  testId: number
  title: string
  skill: IeltsSkill
  score: number
  completedAt: string
}
