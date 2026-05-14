import ApiService from '@/services/ApiService'
import type { BaseResponse } from '@/@types/user'
import type { IeltsWritingTask, IeltsWritingSubmission, SubmitIeltsWritingRequest } from '@/@types/ieltsWriting'

export const IeltsWritingService = {
  async getTasks(params?: { taskType?: string; topic?: string }) {
    const res = await ApiService.fetchData<undefined, BaseResponse<IeltsWritingTask[]>>({
      url: '/api/ielts-writing/tasks',
      method: 'GET',
      params: params ?? {},
    })
    return res.data
  },

  async getTask(taskId: number) {
    const res = await ApiService.fetchData<undefined, BaseResponse<IeltsWritingTask>>({
      url: `/api/ielts-writing/tasks/${taskId}`,
      method: 'GET',
    })
    return res.data
  },

  async submit(data: SubmitIeltsWritingRequest) {
    const res = await ApiService.fetchData<SubmitIeltsWritingRequest, BaseResponse<IeltsWritingSubmission>>({
      url: '/api/ielts-writing/submit',
      method: 'POST',
      data,
    })
    return res.data
  },

  async getSubmission(id: number) {
    const res = await ApiService.fetchData<undefined, BaseResponse<IeltsWritingSubmission>>({
      url: `/api/ielts-writing/${id}`,
      method: 'GET',
    })
    return res.data
  },

  async getHistory() {
    const res = await ApiService.fetchData<undefined, BaseResponse<IeltsWritingSubmission[]>>({
      url: '/api/ielts-writing/history',
      method: 'GET',
    })
    return res.data
  },
}
