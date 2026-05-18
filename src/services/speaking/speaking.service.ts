import ApiService from '@/services/ApiService'
import type { BaseResponse } from '@/@types/user'
import type {
  CreateSpeakingTopicRequest,
  SpeakingSubmission,
  SpeakingTopic,
  SpeakingTopicManage,
  UpdateSpeakingTopicRequest,
} from '@/@types/speaking'

export const SpeakingService = {
  async getTopics(params?: { promptType?: string; difficulty?: string }) {
    const res = await ApiService.fetchData<undefined, BaseResponse<SpeakingTopic[]>>({
      url: '/api/speaking/topics',
      method: 'GET',
      params: params ?? {},
    })
    return res.data
  },

  // ─── Teacher Management ──────────────────────────────────────────────────

  /** POST /api/speaking/topics — Tạo chủ đề mới (TEACHER/ADMIN) */
  async createTopic(data: CreateSpeakingTopicRequest) {
    const res = await ApiService.fetchData<CreateSpeakingTopicRequest, BaseResponse<SpeakingTopicManage>>({
      url: '/api/speaking/topics',
      method: 'POST',
      data,
    })
    return res.data
  },

  /** PUT /api/speaking/topics/:topicId — Cập nhật (partial, chỉ field non-null) */
  async updateTopic(topicId: number, data: UpdateSpeakingTopicRequest) {
    const res = await ApiService.fetchData<UpdateSpeakingTopicRequest, BaseResponse<SpeakingTopicManage>>({
      url: `/api/speaking/topics/${topicId}`,
      method: 'PUT',
      data,
    })
    return res.data
  },

  /** DELETE /api/speaking/topics/:topicId — Xóa (lỗi nếu có submissions) */
  async deleteTopic(topicId: number) {
    const res = await ApiService.fetchData<null, BaseResponse<null>>({
      url: `/api/speaking/topics/${topicId}`,
      method: 'DELETE',
    })
    return res.data
  },

  async getTopic(topicId: number) {
    const res = await ApiService.fetchData<undefined, BaseResponse<SpeakingTopic>>({
      url: `/api/speaking/topics/${topicId}`,
      method: 'GET',
    })
    return res.data
  },

  async submit(topicId: number, audio: Blob) {
    const formData = new FormData()
    formData.append('audio', audio, 'recording.webm')
    const res = await ApiService.fetchData<FormData, BaseResponse<SpeakingSubmission>>({
      url: `/api/speaking/submit/${topicId}`,
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  async getSubmission(id: number) {
    const res = await ApiService.fetchData<undefined, BaseResponse<SpeakingSubmission>>({
      url: `/api/speaking/${id}`,
      method: 'GET',
    })
    return res.data
  },

  async getHistory() {
    const res = await ApiService.fetchData<undefined, BaseResponse<SpeakingSubmission[]>>({
      url: '/api/speaking/history',
      method: 'GET',
    })
    return res.data
  },
}
