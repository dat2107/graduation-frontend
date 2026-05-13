import ApiService from '@/services/ApiService'
import type { BaseResponse } from '@/@types/user'
import type {
  ListeningTopic,
  ListeningLesson,
  ListeningLessonDetail,
  ListeningSubmitResult,
  ListeningProgress,
  ListeningTopicManage,
  ListeningLessonManage,
  CreateListeningTopicRequest,
  UpdateListeningTopicRequest,
  CreateListeningLessonRequest,
  UpdateListeningLessonRequest,
} from '@/@types/listening'
import type { PageResponse } from '@/@types/user'

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

  // ─── Teacher Management ──────────────────────────────────────────────────

  /** GET /api/listening/manage/topics */
  async getTopicsForManage(params: { page?: number; size?: number; search?: string; level?: string }) {
    const res = await ApiService.fetchData<null, BaseResponse<PageResponse<ListeningTopicManage>>>({
      url: '/api/listening/manage/topics',
      method: 'GET',
      params,
    })
    return res.data
  },

  /** POST /api/listening/manage/topics */
  async createTopic(data: CreateListeningTopicRequest) {
    const res = await ApiService.fetchData<CreateListeningTopicRequest, BaseResponse<ListeningTopicManage>>({
      url: '/api/listening/manage/topics',
      method: 'POST',
      data,
    })
    return res.data
  },

  /** PUT /api/listening/manage/topics/:id */
  async updateTopic(id: number, data: UpdateListeningTopicRequest) {
    const res = await ApiService.fetchData<UpdateListeningTopicRequest, BaseResponse<ListeningTopicManage>>({
      url: `/api/listening/manage/topics/${id}`,
      method: 'PUT',
      data,
    })
    return res.data
  },

  /** DELETE /api/listening/manage/topics/:id */
  async deleteTopic(id: number) {
    const res = await ApiService.fetchData<null, BaseResponse<null>>({
      url: `/api/listening/manage/topics/${id}`,
      method: 'DELETE',
    })
    return res.data
  },

  /** GET /api/listening/manage/topics/:topicId/lessons */
  async getLessonsForManage(topicId: number, params: { page?: number; size?: number; search?: string }) {
    const res = await ApiService.fetchData<null, BaseResponse<PageResponse<ListeningLessonManage>>>({
      url: `/api/listening/manage/topics/${topicId}/lessons`,
      method: 'GET',
      params,
    })
    return res.data
  },

  /** POST /api/listening/manage/topics/:topicId/lessons */
  async createLesson(topicId: number, data: CreateListeningLessonRequest) {
    const res = await ApiService.fetchData<CreateListeningLessonRequest, BaseResponse<ListeningLessonManage>>({
      url: `/api/listening/manage/topics/${topicId}/lessons`,
      method: 'POST',
      data,
    })
    return res.data
  },

  /** PUT /api/listening/manage/lessons/:lessonId */
  async updateLesson(lessonId: number, data: UpdateListeningLessonRequest) {
    const res = await ApiService.fetchData<UpdateListeningLessonRequest, BaseResponse<ListeningLessonManage>>({
      url: `/api/listening/manage/lessons/${lessonId}`,
      method: 'PUT',
      data,
    })
    return res.data
  },

  /** DELETE /api/listening/manage/lessons/:lessonId */
  async deleteLesson(lessonId: number) {
    const res = await ApiService.fetchData<null, BaseResponse<null>>({
      url: `/api/listening/manage/lessons/${lessonId}`,
      method: 'DELETE',
    })
    return res.data
  },
}
