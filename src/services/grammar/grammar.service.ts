import ApiService from '@/services/ApiService'
import type { BaseResponse } from '@/@types/user'
import type {
  GrammarTopic,
  GrammarLesson,
  GrammarLessonDetail,
  GrammarSubmitResult,
  GrammarProgress,
  GrammarTopicManage,
  GrammarLessonManage,
  CreateGrammarTopicRequest,
  UpdateGrammarTopicRequest,
  CreateGrammarLessonRequest,
  UpdateGrammarLessonRequest,
} from '@/@types/grammar'
import type { PageResponse } from '@/@types/user'

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

  // ─── Teacher Management ──────────────────────────────────────────────────

  /** GET /api/grammar/manage/topics */
  async getTopicsForManage(params: { page?: number; size?: number; search?: string; level?: string }) {
    const res = await ApiService.fetchData<null, BaseResponse<PageResponse<GrammarTopicManage>>>({
      url: '/api/grammar/manage/topics',
      method: 'GET',
      params,
    })
    return res.data
  },

  /** POST /api/grammar/manage/topics */
  async createTopic(data: CreateGrammarTopicRequest) {
    const res = await ApiService.fetchData<CreateGrammarTopicRequest, BaseResponse<GrammarTopicManage>>({
      url: '/api/grammar/manage/topics',
      method: 'POST',
      data,
    })
    return res.data
  },

  /** PUT /api/grammar/manage/topics/:id */
  async updateTopic(id: number, data: UpdateGrammarTopicRequest) {
    const res = await ApiService.fetchData<UpdateGrammarTopicRequest, BaseResponse<GrammarTopicManage>>({
      url: `/api/grammar/manage/topics/${id}`,
      method: 'PUT',
      data,
    })
    return res.data
  },

  /** DELETE /api/grammar/manage/topics/:id */
  async deleteTopic(id: number) {
    const res = await ApiService.fetchData<null, BaseResponse<null>>({
      url: `/api/grammar/manage/topics/${id}`,
      method: 'DELETE',
    })
    return res.data
  },

  /** GET /api/grammar/manage/topics/:topicId/lessons */
  async getLessonsForManage(topicId: number, params: { page?: number; size?: number; search?: string }) {
    const res = await ApiService.fetchData<null, BaseResponse<PageResponse<GrammarLessonManage>>>({
      url: `/api/grammar/manage/topics/${topicId}/lessons`,
      method: 'GET',
      params,
    })
    return res.data
  },

  /** POST /api/grammar/manage/topics/:topicId/lessons */
  async createLesson(topicId: number, data: CreateGrammarLessonRequest) {
    const res = await ApiService.fetchData<CreateGrammarLessonRequest, BaseResponse<GrammarLessonManage>>({
      url: `/api/grammar/manage/topics/${topicId}/lessons`,
      method: 'POST',
      data,
    })
    return res.data
  },

  /** PUT /api/grammar/manage/lessons/:lessonId */
  async updateLesson(lessonId: number, data: UpdateGrammarLessonRequest) {
    const res = await ApiService.fetchData<UpdateGrammarLessonRequest, BaseResponse<GrammarLessonManage>>({
      url: `/api/grammar/manage/lessons/${lessonId}`,
      method: 'PUT',
      data,
    })
    return res.data
  },

  /** DELETE /api/grammar/manage/lessons/:lessonId */
  async deleteLesson(lessonId: number) {
    const res = await ApiService.fetchData<null, BaseResponse<null>>({
      url: `/api/grammar/manage/lessons/${lessonId}`,
      method: 'DELETE',
    })
    return res.data
  },
}
