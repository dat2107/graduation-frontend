import { Response, Server } from 'miragejs'
import { quizList, quizQuestions } from '../data/quizData'

export default function quizFakeApi(server: Server, apiPrefix: string) {
  // GET /api/quiz — danh sách bài kiểm tra
  server.get(`${apiPrefix}/api/quiz`, (_, request) => {
    const level = request.queryParams.level || ''
    const topic = request.queryParams.topic || ''
    let filtered = [...quizList]
    if (level) filtered = filtered.filter((q) => q.level === level)
    if (topic) filtered = filtered.filter((q) => q.topic === topic)
    return {
      status: 200,
      message: 'Success',
      data: filtered,
      timestamp: Date.now(),
    }
  })

  // GET /api/quiz/:id — chi tiết quiz kèm câu hỏi
  server.get(`${apiPrefix}/api/quiz/:id`, (_, request) => {
    const { id } = request.params
    const quiz = quizList.find((q) => q.id === id)
    if (!quiz) {
      return new Response(
        404,
        {},
        { status: 404, message: 'Không tìm thấy bài kiểm tra', data: null, timestamp: Date.now() },
      )
    }
    return {
      status: 200,
      message: 'Success',
      data: { ...quiz, questions: quizQuestions[id] ?? [] },
      timestamp: Date.now(),
    }
  })

  // POST /api/quiz/:id/submit — nộp bài và lấy kết quả
  server.post(`${apiPrefix}/api/quiz/:id/submit`, (_, request) => {
    const { id } = request.params
    const body = JSON.parse(request.requestBody) as { answers: Record<string, string>; timeTakenSeconds: number }
    const questions = quizQuestions[id] ?? []

    let correct = 0
    const details = questions.map((q) => {
      const selected = body.answers[q.id]
      const isCorrect = selected === q.correctOptionId
      if (isCorrect) correct++
      return {
        questionId: q.id,
        questionText: q.questionText,
        selectedOptionId: selected ?? null,
        correctOptionId: q.correctOptionId,
        isCorrect,
        explanation: q.explanation,
      }
    })

    const score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0

    return {
      status: 200,
      message: 'Nộp bài thành công',
      data: {
        quizId: id,
        totalQuestions: questions.length,
        correctAnswers: correct,
        score,
        timeTakenSeconds: body.timeTakenSeconds,
        xpEarned: Math.round(score / 10) * 5,
        details,
        completedAt: new Date().toISOString(),
      },
      timestamp: Date.now(),
    }
  })

  // GET /api/quiz/history — lịch sử làm bài
  server.get(`${apiPrefix}/api/quiz/history`, () => ({
    status: 200,
    message: 'Success',
    data: [
      { quizId: 'q001', title: 'Từ vựng A1 — Gia đình & Bạn bè', score: 80, completedAt: '2026-04-17T10:30:00Z' },
      { quizId: 'q001', title: 'Từ vựng A1 — Gia đình & Bạn bè', score: 70, completedAt: '2026-04-15T14:00:00Z' },
      { quizId: 'q003', title: 'Ngữ pháp — Thì Hiện tại đơn', score: 70, completedAt: '2026-04-12T09:00:00Z' },
    ],
    timestamp: Date.now(),
  }))
}
