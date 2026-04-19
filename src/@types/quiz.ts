// ─── Quiz Types ───────────────────────────────────────────────────────────────

export type QuizLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
export type QuizDifficulty = 'easy' | 'medium' | 'hard'
export type QuestionType = 'multiple_choice' | 'true_false'

export interface QuizOption {
  id: string
  text: string
}

export interface QuizQuestion {
  id: string
  quizId: string
  order: number
  type: QuestionType
  questionText: string
  options: QuizOption[]
  correctOptionId: string
  explanation: string
}

export interface Quiz {
  id: string
  title: string
  description: string
  topic: string
  level: QuizLevel
  emoji: string
  questionCount: number
  durationMinutes: number
  difficulty: QuizDifficulty
  completedCount: number
  bestScore: number | null
}

export interface QuizDetail extends Quiz {
  questions: QuizQuestion[]
}

export interface QuizSubmitRequest {
  answers: Record<string, string>  // questionId → selectedOptionId
  timeTakenSeconds: number
}

export interface QuizAnswerDetail {
  questionId: string
  questionText: string
  selectedOptionId: string | null
  correctOptionId: string
  isCorrect: boolean
  explanation: string
}

export interface QuizResult {
  quizId: string
  totalQuestions: number
  correctAnswers: number
  score: number
  timeTakenSeconds: number
  xpEarned: number
  details: QuizAnswerDetail[]
  completedAt: string
}

export interface QuizHistoryItem {
  quizId: string
  title: string
  score: number
  completedAt: string
}
