import ApiService from '@/services/ApiService'
import type { BaseResponse } from '@/@types/user'
import type {
  ListeningTopic,
  ListeningLesson,
  ListeningLessonDetail,
  ListeningSubmitResult,
  ListeningProgress,
} from '@/@types/listening'

export const ListeningService = {
  /** GET /api/listening/topics */
  async getTopics(level?: string) {
    const res = await ApiService.fetchData<undefined, BaseResponse<ListeningTopic[]>>({
      url: '/api/listening/topics',
      method: 'GET',
      params: level ? { level } : {},
    })
    return res.data
  },

  /** GET /api/listening/lessons */
  async getLessons(params?: { topicId?: number; level?: string }) {
    const res = await ApiService.fetchData<undefined, BaseResponse<ListeningLesson[]>>({
      url: '/api/listening/lessons',
      method: 'GET',
      params: params ?? {},
    })
    return res.data
  },

  /** GET /api/listening/lessons/:id */
  async getLessonDetail(id: number) {
    const res = await ApiService.fetchData<undefined, BaseResponse<ListeningLessonDetail>>({
      url: `/api/listening/lessons/${id}`,
      method: 'GET',
    })
    return res.data
  },

  /** POST /api/listening/lessons/:id/submit */
  async submitAnswers(id: number, answers: Record<number, string>) {
    const res = await ApiService.fetchData<
      { answers: Record<number, string> },
      BaseResponse<ListeningSubmitResult>
    >({
      url: `/api/listening/lessons/${id}/submit`,
      method: 'POST',
      data: { answers },
    })
    return res.data
  },

  /** GET /api/listening/progress */
  async getUserProgress() {
    const res = await ApiService.fetchData<undefined, BaseResponse<ListeningProgress>>({
      url: '/api/listening/progress',
      method: 'GET',
    })
    return res.data
  },
}
