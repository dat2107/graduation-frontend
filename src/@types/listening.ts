export type WordLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
export type ListeningQuestionType = 'comprehension' | 'dictation'

export interface ListeningTopic {
  id: number
  name: string
  description: string
  level: WordLevel
  emoji: string
  lessonCount: number
  completedCount: number
}

export interface ListeningLesson {
  id: number
  title: string
  description: string
  level: WordLevel
  orderIndex: number
  questionCount: number
  durationSeconds: number | null
  completed: boolean
  score: number | null
}

export interface ListeningQuestionOption {
  optionKey: string
  optionText: string
}

export interface ListeningQuestion {
  id: number
  orderIndex: number
  type: ListeningQuestionType
  questionText: string
  audioStartTime: number | null
  audioEndTime: number | null
  options: ListeningQuestionOption[]
}

export interface ListeningLessonDetail {
  id: number
  title: string
  description: string
  audioUrl: string | null
  transcript: string
  durationSeconds: number | null
  level: WordLevel
  questionCount: number
  questions: ListeningQuestion[]
}

export interface ListeningAnswerDetail {
  questionId: number
  questionText: string
  selectedAnswer: string
  correctAnswer: string
  isCorrect: boolean
  explanation: string
}

export interface ListeningSubmitResult {
  lessonId: number
  totalQuestions: number
  correctCount: number
  score: number
  xpEarned: number
  completed: boolean
  details: ListeningAnswerDetail[]
  completedAt: string
}

export interface ListeningProgress {
  totalLessons: number
  completedLessons: number
  averageScore: number
  totalQuestionsDone: number
  totalListeningMinutes: number
}
