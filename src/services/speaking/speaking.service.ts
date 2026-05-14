import ApiService from '@/services/ApiService'
import type { BaseResponse } from '@/@types/user'
import type { SpeakingTopic, SpeakingSubmission } from '@/@types/speaking'

export const SpeakingService = {
  async getTopics(params?: { promptType?: string; difficulty?: string }) {
    const res = await ApiService.fetchData<undefined, BaseResponse<SpeakingTopic[]>>({
      url: '/api/speaking/topics',
      method: 'GET',
      params: params ?? {},
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
