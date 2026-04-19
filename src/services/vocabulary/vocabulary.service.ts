import ApiService from '@/services/ApiService'
import type { BaseResponse } from '@/@types/user'
import type {
  VocabSet,
  VocabSetDetail,
  FlashcardReviewRequest,
  FlashcardReviewResponse,
  VocabProgress,
} from '@/@types/vocabulary'

export const VocabularyService = {
  /** GET /api/vocabulary/sets — danh sách bộ từ vựng */
  async getSets(level?: string) {
    const res = await ApiService.fetchData<undefined, BaseResponse<VocabSet[]>>({
      url: '/api/vocabulary/sets',
      method: 'GET',
      params: level ? { level } : {},
    })
    return res.data
  },

  /** GET /api/vocabulary/sets/:id — chi tiết bộ từ kèm danh sách từ */
  async getSetDetail(id: string) {
    const res = await ApiService.fetchData<undefined, BaseResponse<VocabSetDetail>>({
      url: `/api/vocabulary/sets/${id}`,
      method: 'GET',
    })
    return res.data
  },

  /** POST /api/vocabulary/flashcard/review — ghi nhận kết quả ôn flashcard */
  async reviewFlashcard(data: FlashcardReviewRequest) {
    const res = await ApiService.fetchData<FlashcardReviewRequest, BaseResponse<FlashcardReviewResponse>>({
      url: '/api/vocabulary/flashcard/review',
      method: 'POST',
      data,
    })
    return res.data
  },

  /** GET /api/vocabulary/user-progress — tổng hợp tiến độ học */
  async getUserProgress() {
    const res = await ApiService.fetchData<undefined, BaseResponse<VocabProgress>>({
      url: '/api/vocabulary/user-progress',
      method: 'GET',
    })
    return res.data
  },
}
