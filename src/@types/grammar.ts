export type WordLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
export type GrammarExerciseType = 'fill_in_blank' | 'multiple_choice' | 'sentence_order'

export interface GrammarTopic {
  id: number
  name: string
  description: string
  level: WordLevel
  emoji: string
  lessonCount: number
  completedCount: number
}

export interface GrammarLesson {
  id: number
  title: string
  summary: string
  level: WordLevel
  orderIndex: number
  exerciseCount: number
  completed: boolean
  score: number | null
}

export interface GrammarExerciseOption {
  optionKey: string
  optionText: string
}

export interface GrammarExercise {
  id: number
  orderIndex: number
  type: GrammarExerciseType
  questionText: string
  options: GrammarExerciseOption[]
}

export interface GrammarLessonDetail {
  id: number
  title: string
  summary: string
  content: string
  level: WordLevel
  exerciseCount: number
  exercises: GrammarExercise[]
}

export interface GrammarAnswerDetail {
  exerciseId: number
  questionText: string
  selectedAnswer: string
  correctAnswer: string
  isCorrect: boolean
  explanation: string
}

export interface GrammarSubmitResult {
  lessonId: number
  totalQuestions: number
  correctCount: number
  score: number
  xpEarned: number
  completed: boolean
  details: GrammarAnswerDetail[]
  completedAt: string
}

export interface GrammarProgress {
  totalLessons: number
  completedLessons: number
  averageScore: number
  totalExercisesDone: number
}
