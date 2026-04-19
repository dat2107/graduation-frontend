import { Response, Server } from 'miragejs'
import { vocabularySets, vocabularyWords } from '../data/vocabularyData'

export default function vocabularyFakeApi(server: Server, apiPrefix: string) {
  // GET /api/vocabulary/sets — danh sách bộ từ vựng
  server.get(`${apiPrefix}/api/vocabulary/sets`, (_, request) => {
    const level = request.queryParams.level || ''
    const filtered = level ? vocabularySets.filter((s) => s.level === level) : vocabularySets
    return {
      status: 200,
      message: 'Success',
      data: filtered,
      timestamp: Date.now(),
    }
  })

  // GET /api/vocabulary/sets/:id — chi tiết bộ từ kèm danh sách từ
  server.get(`${apiPrefix}/api/vocabulary/sets/:id`, (_, request) => {
    const { id } = request.params
    const set = vocabularySets.find((s) => s.id === id)
    if (!set) {
      return new Response(
        404,
        {},
        { status: 404, message: 'Không tìm thấy bộ từ', data: null, timestamp: Date.now() },
      )
    }
    return {
      status: 200,
      message: 'Success',
      data: { ...set, words: vocabularyWords[id] ?? [] },
      timestamp: Date.now(),
    }
  })

  // POST /api/vocabulary/flashcard/review — ghi nhận kết quả ôn flashcard
  server.post(`${apiPrefix}/api/vocabulary/flashcard/review`, (_, request) => {
    const body = JSON.parse(request.requestBody)
    // quality: 0=Quên, 1=Khó, 2=Được, 3=Dễ
    const intervalDays = [0, 1, 3, 7][body.quality as number] ?? 1
    return {
      status: 200,
      message: 'Đã ghi nhận kết quả ôn tập',
      data: {
        wordId: body.wordId,
        quality: body.quality,
        newInterval: intervalDays,
        nextReviewDate: new Date(Date.now() + intervalDays * 86400000).toISOString(),
        xpEarned: body.quality >= 2 ? 10 : 5,
      },
      timestamp: Date.now(),
    }
  })

  // GET /api/vocabulary/user-progress — tổng hợp tiến độ học từ vựng
  server.get(`${apiPrefix}/api/vocabulary/user-progress`, () => ({
    status: 200,
    message: 'Success',
    data: {
      totalWords: 74,
      learnedWords: 21,
      masteredWords: 14,
      newWords: 53,
      reviewDueToday: 6,
      currentStreak: 7,
      longestStreak: 23,
      weeklyActivity: [3, 8, 5, 12, 6, 9, 7],   // từ học mỗi ngày trong tuần
    },
    timestamp: Date.now(),
  }))
}
