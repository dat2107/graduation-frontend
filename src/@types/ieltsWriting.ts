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

/** Teacher-side task shape — identical to IeltsWritingTaskRes from BE */
export type IeltsWritingTaskManage = IeltsWritingTask

/** Matches BE: CreateIeltsWritingTaskReq */
export interface CreateIeltsWritingTaskRequest {
  title: string
  promptText: string
  taskType: IeltsWritingTaskType
  promptImageUrl?: string
  topic?: string
  timeLimitMinutes?: number
  minWords?: number
  sampleAnswer?: string
  sampleBand?: number
}

/** Matches BE: UpdateIeltsWritingTaskReq — all fields optional (partial update) */
export interface UpdateIeltsWritingTaskRequest {
  title?: string
  promptText?: string
  taskType?: IeltsWritingTaskType
  promptImageUrl?: string
  topic?: string
  timeLimitMinutes?: number
  minWords?: number
  sampleAnswer?: string
  sampleBand?: number
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
