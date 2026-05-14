import ApiService from '@/services/ApiService'
import type { BaseResponse } from '@/@types/user'
import type {
  IeltsSpeakingTest,
  IeltsSpeakingTestDetail,
  IeltsSpeakingSession,
  IeltsSpeakingHistory,
  IeltsSpeakingResponseItem,
} from '@/@types/ieltsSpeaking'

export const IeltsSpeakingService = {
  async getTests() {
    const res = await ApiService.fetchData<undefined, BaseResponse<IeltsSpeakingTest[]>>({
      url: '/api/ielts-speaking/tests',
      method: 'GET',
    })
    return res.data
  },

  async getTest(testId: number) {
    const res = await ApiService.fetchData<undefined, BaseResponse<IeltsSpeakingTestDetail>>({
      url: `/api/ielts-speaking/tests/${testId}`,
      method: 'GET',
    })
    return res.data
  },

  async startSession(testId: number) {
    const res = await ApiService.fetchData<{ testId: number }, BaseResponse<IeltsSpeakingSession>>({
      url: '/api/ielts-speaking/sessions/start',
      method: 'POST',
      data: { testId },
    })
    return res.data
  },

  async submitResponse(sessionId: number, questionId: number, audio: Blob, durationSeconds: number) {
    const formData = new FormData()
    formData.append('audio', audio, 'response.webm')
    formData.append('durationSeconds', String(durationSeconds))
    const res = await ApiService.fetchData<FormData, BaseResponse<IeltsSpeakingResponseItem>>({
      url: `/api/ielts-speaking/sessions/${sessionId}/respond/${questionId}`,
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  async finishSession(sessionId: number) {
    const res = await ApiService.fetchData<undefined, BaseResponse<IeltsSpeakingSession>>({
      url: `/api/ielts-speaking/sessions/${sessionId}/finish`,
      method: 'POST',
    })
    return res.data
  },

  async getSession(sessionId: number) {
    const res = await ApiService.fetchData<undefined, BaseResponse<IeltsSpeakingSession>>({
      url: `/api/ielts-speaking/sessions/${sessionId}`,
      method: 'GET',
    })
    return res.data
  },

  async getHistory() {
    const res = await ApiService.fetchData<undefined, BaseResponse<IeltsSpeakingHistory[]>>({
      url: '/api/ielts-speaking/history',
      method: 'GET',
    })
    return res.data
  },
}
