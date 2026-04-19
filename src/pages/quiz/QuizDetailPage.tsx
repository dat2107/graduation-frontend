import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Group,
  Loader,
  Progress,
  RingProgress,
  Stack,
  Text,
  ThemeIcon,
  Title,
  UnstyledButton,
} from '@mantine/core'
import {
  IconAlertCircle,
  IconArrowLeft,
  IconCheck,
  IconClock,
  IconFlame,
  IconListCheck,
  IconRefresh,
  IconTrophy,
  IconX,
} from '@tabler/icons-react'
import { useNavigate, useParams } from 'react-router-dom'
import { QuizService } from '@/services/quiz/quiz.service'
import type { QuizDetail, QuizQuestion, QuizResult } from '@/@types/quiz'

// ─── Timer hook ───────────────────────────────────────────────────────────────

function useTimer() {
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const ref = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = useCallback(() => {
    setRunning(true)
    ref.current = setInterval(() => setSeconds((s) => s + 1), 1000)
  }, [])

  const stop = useCallback(() => {
    setRunning(false)
    if (ref.current) clearInterval(ref.current)
  }, [])

  const reset = useCallback(() => {
    stop()
    setSeconds(0)
  }, [stop])

  useEffect(() => () => { if (ref.current) clearInterval(ref.current) }, [])

  const format = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const ss = (s % 60).toString().padStart(2, '0')
    return `${m}:${ss}`
  }

  return { seconds, running, start, stop, reset, format }
}

// ─── Option Button ────────────────────────────────────────────────────────────

function OptionButton({
  option, selected, correct, revealed, onClick,
}: {
  option: { id: string; text: string }
  selected: boolean
  correct: boolean
  revealed: boolean
  onClick: () => void
}) {
  let bg = 'var(--mantine-color-gray-0)'
  let border = '1px solid var(--mantine-color-gray-3)'
  let textColor = 'var(--mantine-color-dark-6)'

  if (revealed) {
    if (correct) { bg = 'var(--mantine-color-green-1)'; border = '2px solid var(--mantine-color-green-5)'; textColor = 'var(--mantine-color-green-8)' }
    else if (selected && !correct) { bg = 'var(--mantine-color-red-1)'; border = '2px solid var(--mantine-color-red-5)'; textColor = 'var(--mantine-color-red-8)' }
  } else if (selected) {
    bg = 'var(--mantine-color-blue-1)'; border = '2px solid var(--mantine-color-blue-5)'; textColor = 'var(--mantine-color-blue-8)'
  }

  return (
    <UnstyledButton
      onClick={revealed ? undefined : onClick}
      style={{
        padding: '12px 16px',
        borderRadius: 'var(--mantine-radius-md)',
        background: bg,
        border,
        color: textColor,
        cursor: revealed ? 'default' : 'pointer',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        transition: 'all 0.15s ease',
        fontWeight: selected || (revealed && correct) ? 600 : 400,
      }}
    >
      {revealed && correct && <IconCheck size={16} color="var(--mantine-color-green-6)" />}
      {revealed && selected && !correct && <IconX size={16} color="var(--mantine-color-red-6)" />}
      {!revealed && (
        <Box
          style={{
            width: 24, height: 24, borderRadius: '50%',
            background: selected ? 'var(--mantine-color-blue-5)' : 'var(--mantine-color-gray-2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: selected ? 'white' : 'inherit', flexShrink: 0,
          }}
        >
          {option.id.toUpperCase()}
        </Box>
      )}
      <Text size="sm" style={{ flex: 1 }}>{option.text}</Text>
    </UnstyledButton>
  )
}

// ─── Result Screen ────────────────────────────────────────────────────────────

function ResultScreen({
  result, quiz, onRetry, onBack,
}: {
  result: QuizResult
  quiz: QuizDetail
  onRetry: () => void
  onBack: () => void
}) {
  const pct = result.score
  const ringColor = pct >= 80 ? 'green' : pct >= 60 ? 'yellow' : 'red'
  const mins = Math.floor(result.timeTakenSeconds / 60)
  const secs = result.timeTakenSeconds % 60
  const timeStr = mins > 0 ? `${mins}p ${secs}s` : `${secs}s`

  return (
    <Stack gap="lg" p="md" maw={640} mx="auto">
      {/* Score */}
      <Card withBorder radius="md" p="lg">
        <Stack align="center" gap="md">
          <ThemeIcon size={64} radius="50%" color={ringColor} variant="light">
            <IconTrophy size={32} />
          </ThemeIcon>
          <div style={{ textAlign: 'center' }}>
            <Title order={3}>{pct >= 80 ? '🎉 Xuất sắc!' : pct >= 60 ? '👍 Tốt lắm!' : '💪 Cố lên!'}</Title>
            <Text c="dimmed" size="sm" mt={4}>{quiz.title}</Text>
          </div>
          <RingProgress
            size={120} thickness={10}
            sections={[{ value: pct, color: ringColor }]}
            label={<Text ta="center" fw={800} size="lg">{pct}%</Text>}
          />
          <SimpleStats correct={result.correctAnswers} total={result.totalQuestions} time={timeStr} xp={result.xpEarned} />
        </Stack>
      </Card>

      {/* Answer review */}
      <Stack gap="sm">
        <Title order={4}>📋 Xem lại đáp án</Title>
        {result.details.map((d, i) => (
          <Card key={d.questionId} withBorder radius="md" p="md"
            style={{ borderLeft: `4px solid var(--mantine-color-${d.isCorrect ? 'green' : 'red'}-5)` }}>
            <Group gap="xs" mb={8} align="flex-start">
              <ThemeIcon size="sm" color={d.isCorrect ? 'green' : 'red'} variant="light" radius="xl">
                {d.isCorrect ? <IconCheck size={12} /> : <IconX size={12} />}
              </ThemeIcon>
              <Text size="sm" fw={500} style={{ flex: 1 }}>
                {i + 1}. {d.questionText}
              </Text>
            </Group>
            {!d.isCorrect && d.selectedOptionId && (
              <Text size="xs" c="red" mb={4}>
                Bạn chọn: {quiz.questions[i]?.options.find(o => o.id === d.selectedOptionId)?.text}
              </Text>
            )}
            {!d.isCorrect && (
              <Text size="xs" c="green" mb={4}>
                Đáp án đúng: {quiz.questions[i]?.options.find(o => o.id === d.correctOptionId)?.text}
              </Text>
            )}
            <Alert color="blue" variant="light" p="xs" radius="sm">
              <Text size="xs">💡 {d.explanation}</Text>
            </Alert>
          </Card>
        ))}
      </Stack>

      <Group>
        <Button variant="light" leftSection={<IconArrowLeft size={16} />} onClick={onBack}>
          Về danh sách
        </Button>
        <Button leftSection={<IconRefresh size={16} />} onClick={onRetry}>
          Làm lại
        </Button>
      </Group>
    </Stack>
  )
}

function SimpleStats({ correct, total, time, xp }: { correct: number; total: number; time: string; xp: number }) {
  return (
    <Group gap="xl">
      <Stack gap={0} align="center">
        <Text fw={700} size="lg">{correct}/{total}</Text>
        <Text size="xs" c="dimmed">Câu đúng</Text>
      </Stack>
      <Stack gap={0} align="center">
        <Group gap={4}>
          <IconClock size={14} />
          <Text fw={700} size="lg">{time}</Text>
        </Group>
        <Text size="xs" c="dimmed">Thời gian</Text>
      </Stack>
      <Stack gap={0} align="center">
        <Group gap={4}>
          <IconFlame size={14} color="orange" />
          <Text fw={700} size="lg" c="orange">+{xp}</Text>
        </Group>
        <Text size="xs" c="dimmed">XP</Text>
      </Stack>
    </Group>
  )
}

// ─── Quiz Taking Screen ───────────────────────────────────────────────────────

function QuizScreen({
  quiz, onDone,
}: {
  quiz: QuizDetail
  onDone: (result: QuizResult) => void
}) {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [revealed, setRevealed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const timer = useTimer()

  useEffect(() => { timer.start() }, [])  // eslint-disable-line

  const question: QuizQuestion = quiz.questions[current]
  const selected = answers[question.id]
  const isLast = current === quiz.questions.length - 1
  const progress = Math.round(((current + (revealed ? 1 : 0)) / quiz.questions.length) * 100)

  const handleSelect = (optionId: string) => {
    if (revealed) return
    setAnswers((prev) => ({ ...prev, [question.id]: optionId }))
    setRevealed(true)
  }

  const handleNext = () => {
    if (!isLast) {
      setCurrent((c) => c + 1)
      setRevealed(false)
    }
  }

  const handleSubmit = async () => {
    if (submitting) return
    setSubmitting(true)
    timer.stop()
    try {
      const res = await QuizService.submitQuiz(quiz.id, { answers, timeTakenSeconds: timer.seconds })
      if (res?.status === 200 && res.data) onDone(res.data)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Stack gap="lg" maw={640} mx="auto">
      {/* Progress header */}
      <Box>
        <Group justify="space-between" mb={6}>
          <Text size="sm" c="dimmed">Câu {current + 1} / {quiz.questions.length}</Text>
          <Group gap={4}>
            <IconClock size={14} color="var(--mantine-color-gray-6)" />
            <Text size="sm" c="dimmed" ff="monospace">{timer.format(timer.seconds)}</Text>
          </Group>
        </Group>
        <Progress value={progress} size="sm" radius="xl" color="blue" />
      </Box>

      {/* Question */}
      <Card withBorder radius="md" p="lg">
        <Stack gap="xs" mb="lg">
          <Group gap={8}>
            <Badge size="xs" color="blue" variant="light">{question.type === 'true_false' ? 'Đúng / Sai' : 'Trắc nghiệm'}</Badge>
            <Badge size="xs" color="gray" variant="light">Câu {current + 1}</Badge>
          </Group>
          <Text fw={600} size="md">{question.questionText}</Text>
        </Stack>

        <Stack gap="xs">
          {question.options.map((opt) => (
            <OptionButton
              key={opt.id}
              option={opt}
              selected={selected === opt.id}
              correct={opt.id === question.correctOptionId}
              revealed={revealed}
              onClick={() => handleSelect(opt.id)}
            />
          ))}
        </Stack>

        {/* Explanation after reveal */}
        {revealed && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            color="blue"
            variant="light"
            radius="md"
            mt="md"
            p="sm"
          >
            <Text size="sm">💡 {question.explanation}</Text>
          </Alert>
        )}

        {/* Unanswered hint */}
        {!revealed && (
          <Text size="xs" c="dimmed" ta="center" mt="md">Chọn đáp án để tiếp tục</Text>
        )}
      </Card>

      {/* Navigation */}
      {revealed && (
        <Group justify="flex-end">
          {isLast ? (
            <Button
              size="md"
              leftSection={<IconCheck size={18} />}
              loading={submitting}
              onClick={handleSubmit}
              color="green"
            >
              Nộp bài ({Object.keys(answers).length}/{quiz.questions.length} câu)
            </Button>
          ) : (
            <Button size="md" onClick={handleNext} rightSection={<Text>→</Text>}>
              Câu tiếp theo
            </Button>
          )}
        </Group>
      )}
    </Stack>
  )
}

// ─── Intro Screen ─────────────────────────────────────────────────────────────

function IntroScreen({ quiz, onStart }: { quiz: QuizDetail; onStart: () => void }) {
  return (
    <Stack gap="lg" maw={480} mx="auto" align="center" py="xl">
      <Text size="4rem" lh={1}>{quiz.emoji}</Text>
      <div style={{ textAlign: 'center' }}>
        <Title order={3}>{quiz.title}</Title>
        <Text c="dimmed" mt={8}>{quiz.description}</Text>
      </div>
      <Card withBorder radius="md" p="lg" w="100%">
        <Stack gap="sm">
          {[
            { label: 'Số câu hỏi', value: `${quiz.questionCount} câu` },
            { label: 'Thời gian tham khảo', value: `${quiz.durationMinutes} phút` },
            { label: 'Chủ đề', value: quiz.topic },
            { label: 'Trình độ', value: quiz.level },
          ].map((row) => (
            <Group key={row.label} justify="space-between">
              <Text size="sm" c="dimmed">{row.label}</Text>
              <Text size="sm" fw={600}>{row.value}</Text>
            </Group>
          ))}
          {quiz.bestScore !== null && (
            <>
              <Divider />
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Điểm tốt nhất</Text>
                <Badge color={quiz.bestScore >= 80 ? 'green' : 'yellow'} variant="filled">
                  {quiz.bestScore}%
                </Badge>
              </Group>
            </>
          )}
        </Stack>
      </Card>
      <Button size="lg" leftSection={<IconListCheck size={20} />} onClick={onStart} fullWidth>
        Bắt đầu làm bài
      </Button>
    </Stack>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type Screen = 'intro' | 'quiz' | 'result'

export default function QuizDetailPage() {
  const { quizId } = useParams<{ quizId: string }>()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState<QuizDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [screen, setScreen] = useState<Screen>('intro')
  const [result, setResult] = useState<QuizResult | null>(null)

  useEffect(() => {
    if (!quizId) return
    const fetch = async () => {
      setLoading(true)
      const res = await QuizService.getQuizDetail(quizId)
      if (res?.status === 200 && res.data) setQuiz(res.data)
      setLoading(false)
    }
    fetch()
  }, [quizId])

  if (loading) return <Group justify="center" mt="xl"><Loader /></Group>

  if (!quiz) {
    return (
      <Stack align="center" py="xl">
        <Text c="dimmed">Không tìm thấy bài kiểm tra</Text>
        <Button variant="light" onClick={() => navigate('/quiz')}>Quay lại</Button>
      </Stack>
    )
  }

  return (
    <Stack gap="md" p="md">
      {/* Back nav */}
      {screen !== 'quiz' && (
        <Group>
          <ActionIcon variant="subtle" onClick={() => navigate('/quiz')}>
            <IconArrowLeft size={18} />
          </ActionIcon>
          <Text c="dimmed" size="sm">Kiểm tra / </Text>
          <Text size="sm" fw={500} lineClamp={1}>{quiz.title}</Text>
        </Group>
      )}

      {screen === 'intro' && (
        <IntroScreen quiz={quiz} onStart={() => setScreen('quiz')} />
      )}

      {screen === 'quiz' && (
        <QuizScreen
          quiz={quiz}
          onDone={(r) => { setResult(r); setScreen('result') }}
        />
      )}

      {screen === 'result' && result && (
        <ResultScreen
          result={result}
          quiz={quiz}
          onRetry={() => { setResult(null); setScreen('intro') }}
          onBack={() => navigate('/quiz')}
        />
      )}
    </Stack>
  )
}
