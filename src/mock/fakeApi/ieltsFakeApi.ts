import type { Server } from 'miragejs'
import { ieltsTestList, ieltsQuestions, ieltsHistoryData } from '@/mock/data/ieltsData'
import type { MockIeltsQuestion } from '@/mock/data/ieltsData'

export default function ieltsFakeApi(server: Server, apiPrefix: string) {
  // ── GET /api/ielts-practice/tests ─────────────────────────────────────────
  server.get(`${apiPrefix}/ielts-practice/tests`, (_, request) => {
    const skill = request.queryParams?.skill
    const level = request.queryParams?.level

    let tests = [...ieltsTestList]
    if (skill) tests = tests.filter((t) => t.skill === skill)
    if (level) tests = tests.filter((t) => t.level === level)

    return { status: 200, message: 'OK', data: tests, timestamp: Date.now() }
  })

  // ── GET /api/ielts-practice/tests/:id ─────────────────────────────────────
  server.get(`${apiPrefix}/ielts-practice/tests/:id`, (_, request) => {
    const id = Number(request.params.id)
    const test = ieltsTestList.find((t) => t.id === id)
    if (!test) return { status: 404, message: 'Test not found', data: null, timestamp: Date.now() }

    const questions = (ieltsQuestions[id] ?? []).map(({ correctAnswer, explanation, ...q }) => q)

    return {
      status: 200,
      message: 'OK',
      data: { ...test, questions },
      timestamp: Date.now(),
    }
  })

  // ── POST /api/ielts-practice/tests/:id/submit ────────────────────────────
  server.post(`${apiPrefix}/ielts-practice/tests/:id/submit`, (_, request) => {
    const id = Number(request.params.id)
    const body = JSON.parse(request.requestBody)
    const answers: Record<string, string> = body.answers ?? {}
    const timeTakenSeconds: number = body.timeTakenSeconds ?? 0

    const questions: MockIeltsQuestion[] = ieltsQuestions[id] ?? []
    if (questions.length === 0) {
      return { status: 404, message: 'Test not found', data: null, timestamp: Date.now() }
    }

    let correctCount = 0
    const details = questions.map((q) => {
      const userAnswer = answers[String(q.id)] ?? ''
      let isCorrect = false

      if (q.questionType === 'fill_in_blank') {
        const acceptedAnswers = q.correctAnswer.split('|').map((a) => a.trim().toLowerCase())
        isCorrect = acceptedAnswers.includes(userAnswer.trim().toLowerCase())
      } else {
        isCorrect = userAnswer === q.correctAnswer
      }

      if (isCorrect) correctCount++

      return {
        questionId: q.id,
        selectedAnswer: userAnswer || null,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
      }
    })

    const score = Math.round((correctCount / questions.length) * 100)
    const xpEarned = Math.round(score / 10) * 5

    return {
      status: 200,
      message: 'OK',
      data: {
        testId: id,
        totalQuestions: questions.length,
        correctCount,
        score,
        timeTakenSeconds,
        xpEarned,
        details,
        completedAt: new Date().toISOString(),
      },
      timestamp: Date.now(),
    }
  })

  // ── GET /api/ielts-practice/history ───────────────────────────────────────
  server.get(`${apiPrefix}/ielts-practice/history`, () => {
    return { status: 200, message: 'OK', data: ieltsHistoryData, timestamp: Date.now() }
  })
}
