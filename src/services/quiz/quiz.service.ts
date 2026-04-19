import ApiService from '@/services/ApiService'
import type { BaseResponse } from '@/@types/user'
import type { Quiz, QuizDetail, QuizHistoryItem, QuizResult, QuizSubmitRequest } from '@/@types/quiz'

export const QuizService = {
  /** GET /api/quiz — danh sách bài kiểm tra */
  async getQuizList(params?: { level?: string; topic?: string }) {
    const res = await ApiService.fetchData<undefined, BaseResponse<Quiz[]>>({
      url: '/api/quiz',
      method: 'GET',
      params: params ?? {},
    })
    return res.data
  },

  /** GET /api/quiz/:id — chi tiết quiz kèm câu hỏi */
  async getQuizDetail(id: string) {
    const res = await ApiService.fetchData<undefined, BaseResponse<QuizDetail>>({
      url: `/api/quiz/${id}`,
      method: 'GET',
    })
    return res.data
  },

  /** POST /api/quiz/:id/submit — nộp bài */
  async submitQuiz(id: string, data: QuizSubmitRequest) {
    const res = await ApiService.fetchData<QuizSubmitRequest, BaseResponse<QuizResult>>({
      url: `/api/quiz/${id}/submit`,
      method: 'POST',
      data,
    })
    return res.data
  },

  /** GET /api/quiz/history — lịch sử làm bài */
  async getHistory() {
    const res = await ApiService.fetchData<undefined, BaseResponse<QuizHistoryItem[]>>({
      url: '/api/quiz/history',
      method: 'GET',
    })
    return res.data
  },
}
