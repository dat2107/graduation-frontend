import ApiService from '@/services/ApiService'
import type { BaseResponse } from '@/@types/user'
import type { WritingSubmission, SubmitWritingRequest, QuickCheckRequest, QuickCheckResponse } from '@/@types/writing'

export const WritingService = {
  async submit(data: SubmitWritingRequest) {
    const res = await ApiService.fetchData<
      SubmitWritingRequest,
      BaseResponse<WritingSubmission>
    >({
      url: '/api/writing-check/submit',
      method: 'POST',
      data,
    })
    return res.data
  },

  async getSubmission(submissionId: number) {
    const res = await ApiService.fetchData<
      undefined,
      BaseResponse<WritingSubmission>
    >({
      url: `/api/writing-check/${submissionId}`,
      method: 'GET',
    })
    return res.data
  },

  async getHistory() {
    const res = await ApiService.fetchData<
      undefined,
      BaseResponse<WritingSubmission[]>
    >({
      url: '/api/writing-check/history',
      method: 'GET',
    })
    return res.data
  },

  async quickCheck(data: QuickCheckRequest) {
    const res = await ApiService.fetchData<
      QuickCheckRequest,
      BaseResponse<QuickCheckResponse>
    >({
      url: '/api/writing-check/quick-check',
      method: 'POST',
      data,
    })
    return res.data
  },
}
