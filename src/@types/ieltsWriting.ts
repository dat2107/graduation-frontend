export type IeltsWritingTaskType = 'TASK_1' | 'TASK_2'

export interface IeltsWritingTask {
  id: number
  title: string
  promptText: string
  promptImageUrl: string | null
  taskType: IeltsWritingTaskType
  topic: string
  timeLimitMinutes: number
  minWords: number
  sampleAnswer: string | null
  sampleBand: number | null
  createdAt: string
}

export interface IeltsWritingSubmission {
  id: number
  taskId: number
  taskTitle: string
  taskType: IeltsWritingTaskType
  content: string
  wordCount: number
  timeSpentSeconds: number | null
  taskAchievementBand: number
  coherenceCohesionBand: number
  lexicalResourceBand: number
  grammaticalRangeBand: number
  overallBand: number
  aiFeedback: string
  aiProvider: string
  model: string
  createdAt: string
}

export interface SubmitIeltsWritingRequest {
  taskId: number
  content: string
  timeSpentSeconds?: number
}
