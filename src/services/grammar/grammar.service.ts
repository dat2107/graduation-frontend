import ApiService from '@/services/ApiService'
import type { BaseResponse } from '@/@types/user'
import type {
  GrammarTopic,
  GrammarLesson,
  GrammarLessonDetail,
  GrammarSubmitResult,
  GrammarProgress,
} from '@/@types/grammar'

export const GrammarService = {
  /** GET /api/grammar/topics — danh sách chủ đề ngữ pháp */
  async getTopics(level?: string) {
    const res = await ApiService.fetchData<undefined, BaseResponse<GrammarTopic[]>>({
      url: '/api/grammar/topics',
      method: 'GET',
      params: level ? { level } : {},
    })
    return res.data
  },

  /** GET /api/grammar/lessons — danh sách bài học */
  async getLessons(params?: { topicId?: number; level?: string }) {
    const res = await ApiService.fetchData<undefined, BaseResponse<GrammarLesson[]>>({
      url: '/api/grammar/lessons',
      method: 'GET',
      params: params ?? {},
    })
    return res.data
  },

  /** GET /api/grammar/lessons/:id — chi tiết bài học kèm bài tập */
  async getLessonDetail(id: number) {
    const res = await ApiService.fetchData<undefined, BaseResponse<GrammarLessonDetail>>({
      url: `/api/grammar/lessons/${id}`,
      method: 'GET',
    })
    return res.data
  },

  /** POST /api/grammar/lessons/:id/submit — nộp bài tập */
  async submitExercises(id: number, answers: Record<number, string>) {
    const res = await ApiService.fetchData<
      { answers: Record<number, string> },
      BaseResponse<GrammarSubmitResult>
    >({
      url: `/api/grammar/lessons/${id}/submit`,
      method: 'POST',
      data: { answers },
    })
    return res.data
  },

  /** GET /api/grammar/progress — tiến độ tổng */
  async getUserProgress() {
    const res = await ApiService.fetchData<undefined, BaseResponse<GrammarProgress>>({
      url: '/api/grammar/progress',
      method: 'GET',
    })
    return res.data
  },
}
