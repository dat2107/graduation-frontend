import ApiService from '@/services/ApiService'
import type { BaseResponse } from '@/@types/user'
import type {
  IeltsTest,
  IeltsTestDetail,
  IeltsHistoryItem,
  IeltsSubmitResult,
  IeltsSubmitRequest,
} from '@/@types/ielts'

export const IeltsService = {
  /** GET /api/ielts-practice/tests — danh sách bài thi IELTS */
  async getTests(params?: { skill?: string; level?: string }) {
    const res = await ApiService.fetchData<undefined, BaseResponse<IeltsTest[]>>({
      url: '/api/ielts-practice/tests',
      method: 'GET',
      params: params ?? {},
    })
    return res.data
  },

  /** GET /api/ielts-practice/tests/:id — chi tiết bài thi kèm câu hỏi */
  async getTestDetail(id: number) {
    const res = await ApiService.fetchData<undefined, BaseResponse<IeltsTestDetail>>({
      url: `/api/ielts-practice/tests/${id}`,
      method: 'GET',
    })
    return res.data
  },

  /** POST /api/ielts-practice/tests/:id/submit — nộp bài */
  async submitTest(id: number, data: IeltsSubmitRequest) {
    const res = await ApiService.fetchData<IeltsSubmitRequest, BaseResponse<IeltsSubmitResult>>({
      url: `/api/ielts-practice/tests/${id}/submit`,
      method: 'POST',
      data,
    })
    return res.data
  },

  /** GET /api/ielts-practice/history — lịch sử làm bài */
  async getHistory() {
    const res = await ApiService.fetchData<undefined, BaseResponse<IeltsHistoryItem[]>>({
      url: '/api/ielts-practice/history',
      method: 'GET',
    })
    return res.data
  },
}
