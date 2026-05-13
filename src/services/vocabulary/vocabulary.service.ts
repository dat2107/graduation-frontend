import ApiService from '@/services/ApiService'
import type { BaseResponse, PageResponse } from '@/@types/user'
import type {
  CreateVocabTopicRequest,
  CreateVocabWordRequest,
  FlashcardReviewRequest,
  FlashcardReviewResponse,
  UpdateVocabTopicRequest,
  UpdateVocabWordRequest,
  VocabProgress,
  VocabSet,
  VocabSetDetail,
  VocabTopicManage,
  VocabWordManage,
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

  // ─── Teacher Management ──────────────────────────────────────────────────

  /** GET /api/vocabulary/manage/topics */
  async getTopicsForManage(params: { page?: number; size?: number; search?: string; level?: string }) {
    const res = await ApiService.fetchData<null, BaseResponse<PageResponse<VocabTopicManage>>>({
      url: '/api/vocabulary/manage/topics',
      method: 'GET',
      params,
    })
    return res.data
  },

  /** POST /api/vocabulary/manage/topics */
  async createTopic(data: CreateVocabTopicRequest) {
    const res = await ApiService.fetchData<CreateVocabTopicRequest, BaseResponse<VocabTopicManage>>({
      url: '/api/vocabulary/manage/topics',
      method: 'POST',
      data,
    })
    return res.data
  },

  /** PUT /api/vocabulary/manage/topics/:id */
  async updateTopic(id: number, data: UpdateVocabTopicRequest) {
    const res = await ApiService.fetchData<UpdateVocabTopicRequest, BaseResponse<VocabTopicManage>>({
      url: `/api/vocabulary/manage/topics/${id}`,
      method: 'PUT',
      data,
    })
    return res.data
  },

  /** DELETE /api/vocabulary/manage/topics/:id */
  async deleteTopic(id: number) {
    const res = await ApiService.fetchData<null, BaseResponse<null>>({
      url: `/api/vocabulary/manage/topics/${id}`,
      method: 'DELETE',
    })
    return res.data
  },

  /** GET /api/vocabulary/manage/topics/:topicId/words */
  async getWordsForManage(topicId: number, params: { page?: number; size?: number; search?: string }) {
    const res = await ApiService.fetchData<null, BaseResponse<PageResponse<VocabWordManage>>>({
      url: `/api/vocabulary/manage/topics/${topicId}/words`,
      method: 'GET',
      params,
    })
    return res.data
  },

  /** POST /api/vocabulary/manage/topics/:topicId/words */
  async createWord(topicId: number, data: CreateVocabWordRequest) {
    const res = await ApiService.fetchData<CreateVocabWordRequest, BaseResponse<VocabWordManage>>({
      url: `/api/vocabulary/manage/topics/${topicId}/words`,
      method: 'POST',
      data,
    })
    return res.data
  },

  /** PUT /api/vocabulary/manage/words/:wordId */
  async updateWord(wordId: number, data: UpdateVocabWordRequest) {
    const res = await ApiService.fetchData<UpdateVocabWordRequest, BaseResponse<VocabWordManage>>({
      url: `/api/vocabulary/manage/words/${wordId}`,
      method: 'PUT',
      data,
    })
    return res.data
  },

  /** DELETE /api/vocabulary/manage/words/:wordId */
  async deleteWord(wordId: number) {
    const res = await ApiService.fetchData<null, BaseResponse<null>>({
      url: `/api/vocabulary/manage/words/${wordId}`,
      method: 'DELETE',
    })
    return res.data
  },
}
