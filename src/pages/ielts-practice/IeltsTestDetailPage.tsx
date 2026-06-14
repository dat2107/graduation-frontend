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
  Paper,
  Progress,
  RingProgress,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  UnstyledButton,
} from '@mantine/core'
import {
  IconAlertCircle,
  IconArrowLeft,
  IconBook,
  IconCheck,
  IconClock,
  IconFlame,
  IconHeadphones,
  IconListCheck,
  IconPlayerPlay,
  IconPlayerPause,
  IconRefresh,
  IconTrophy,
  IconX,
} from '@tabler/icons-react'
import { useNavigate, useParams } from 'react-router-dom'
import { IeltsService } from '@/services/ielts/ielts.service'
import type { IeltsTestDetail, IeltsQuestion, IeltsSubmitResult } from '@/@types/ielts'

// ─── Timer hook ──────────────────────────────────────────────────────────────

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

// ─── Audio Player ────────────────────────────────────────────────────────────

function AudioPlayer({ url }: { url: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [useTTS, setUseTTS] = useState(false)

  useEffect(() => {
    if (!url || url.includes('example.com') || url.includes('soundhelix.com')) {
      setUseTTS(true)
    }
  }, [url])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || useTTS) return
    const onError = () => setUseTTS(true)
    audio.addEventListener('error', onError)
    return () => audio.removeEventListener('error', onError)
  }, [useTTS])

  const toggle = () => {
    if (useTTS) {
      // TTS not applicable for IELTS listening without transcript at this level
      // The test questions are self-contained, so we just show a message
      return
    }
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setPlaying(!playing)
  }

  const handleTimeUpdate = () => {
    if (!audioRef.current) return
    const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100
    setProgress(isNaN(pct) ? 0 : pct)
  }

  if (useTTS) {
    return (
      <Paper withBorder radius="md" p="md" bg="violet.0">
        <Group gap="sm">
          <ActionIcon size="lg" radius="xl" color="gray" variant="light" disabled>
            <IconHeadphones size={18} />
          </ActionIcon>
          <Stack gap={4} style={{ flex: 1 }}>
            <Text size="xs" fw={500} c="violet">
              Audio chua san sang
            </Text>
            <Text size="xs" c="dimmed">
              Giao vien chua upload audio cho bai nay. Ban co the lam bai dua tren cau hoi.
            </Text>
          </Stack>
        </Group>
      </Paper>
    )
  }

  return (
    <Paper withBorder radius="md" p="md" bg="violet.0">
      <Group gap="sm">
        <ActionIcon
          size="lg"
          radius="xl"
          color="violet"
          variant="filled"
          onClick={toggle}
        >
          {playing ? <IconPlayerPause size={18} /> : <IconPlayerPlay size={18} />}
        </ActionIcon>
        <Stack gap={4} style={{ flex: 1 }}>
          <Group gap={4}>
            <IconHeadphones size={14} color="var(--mantine-color-violet-6)" />
            <Text size="xs" fw={500} c="violet">Audio bai nghe</Text>
          </Group>
          <Progress value={progress} size="sm" radius="xl" color="violet" />
        </Stack>
      </Group>
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setPlaying(false)}
      />
    </Paper>
  )
}

// ─── Option Button ───────────────────────────────────────────────────────────

function OptionButton({
  optionKey, optionText, selected, correct, revealed, onClick,
}: {
  optionKey: string
  optionText: string
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
        padding: '12px 16px', borderRadius: 'var(--mantine-radius-md)',
        background: bg, border, color: textColor,
        cursor: revealed ? 'default' : 'pointer',
        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
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
          {optionKey}
        </Box>
      )}
      <Text size="sm" style={{ flex: 1 }}>{optionText}</Text>
    </UnstyledButton>
  )
}

// ─── Result Screen ───────────────────────────────────────────────────────────

function ResultScreen({
  result, quiz, onRetry, onBack,
}: {
  result: IeltsSubmitResult
  quiz: IeltsTestDetail
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
            <Title order={3}>{pct >= 80 ? 'Xuất sắc!' : pct >= 60 ? 'Tốt lắm!' : 'Cố lên!'}</Title>
            <Text c="dimmed" size="sm" mt={4}>{quiz.title}</Text>
          </div>
          <RingProgress
            size={120} thickness={10}
            sections={[{ value: pct, color: ringColor }]}
            label={<Text ta="center" fw={800} size="lg">{pct}%</Text>}
          />
          <Group gap="xl">
            <Stack gap={0} align="center">
              <Text fw={700} size="lg">{result.correctCount}/{result.totalQuestions}</Text>
              <Text size="xs" c="dimmed">Câu đúng</Text>
            </Stack>
            <Stack gap={0} align="center">
              <Group gap={4}>
                <IconClock size={14} />
                <Text fw={700} size="lg">{timeStr}</Text>
              </Group>
              <Text size="xs" c="dimmed">Thời gian</Text>
            </Stack>
            <Stack gap={0} align="center">
              <Group gap={4}>
                <IconFlame size={14} color="orange" />
                <Text fw={700} size="lg" c="orange">+{result.xpEarned}</Text>
              </Group>
              <Text size="xs" c="dimmed">XP</Text>
            </Stack>
          </Group>
        </Stack>
      </Card>

      {/* Answer review */}
      <Stack gap="sm">
        <Title order={4}>Xem lại đáp án</Title>
        {result.details.map((d, i) => {
          const isCorrect = d.isCorrect ?? d.correct;
          return (
          <Card key={d.questionId} withBorder radius="md" p="md"
            style={{ borderLeft: `4px solid var(--mantine-color-${isCorrect ? 'green' : 'red'}-5)` }}>
            <Group gap="xs" mb={8} align="flex-start">
              <ThemeIcon size="sm" color={isCorrect ? 'green' : 'red'} variant="light" radius="xl">
                {isCorrect ? <IconCheck size={12} /> : <IconX size={12} />}
              </ThemeIcon>
              <Text size="sm" fw={500} style={{ flex: 1 }}>
                {i + 1}. {quiz.questions[i]?.questionText}
              </Text>
            </Group>
            {!isCorrect && d.selectedAnswer && (
              <Text size="xs" c="red" mb={4}>
                Bạn trả lời: {d.selectedAnswer}
              </Text>
            )}
            {!isCorrect && (
              <Text size="xs" c="green" mb={4}>
                Đáp án đúng: {d.correctAnswer}
              </Text>
            )}
            <Alert color="blue" variant="light" p="xs" radius="sm">
              <Text size="xs">{d.explanation}</Text>
            </Alert>
          </Card>
          );
        })}
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

// ─── Test Taking Screen ──────────────────────────────────────────────────────

function TestScreen({
  quiz, onDone,
}: {
  quiz: IeltsTestDetail
  onDone: (result: IeltsSubmitResult) => void
}) {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const timer = useTimer()

  useEffect(() => { timer.start() }, [])  // eslint-disable-line

  const question: IeltsQuestion = quiz.questions[current]
  const selected = answers[question.id] ?? ''
  const isLast = current === quiz.questions.length - 1
  const answeredCount = Object.keys(answers).length
  const progress = Math.round((answeredCount / quiz.questions.length) * 100)

  const handleSelectOption = (optionKey: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: optionKey }))
  }

  const handleFillChange = (value: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }))
  }

  const handleNext = () => {
    if (!isLast) setCurrent((c) => c + 1)
  }

  const handlePrev = () => {
    if (current > 0) setCurrent((c) => c - 1)
  }

  const handleSubmit = async () => {
    if (submitting) return
    setSubmitting(true)
    timer.stop()
    try {
      const res = await IeltsService.submitTest(quiz.id, {
        answers,
        timeTakenSeconds: timer.seconds,
      })
      if (res?.status === 200 && res.data) onDone(res.data)
    } finally {
      setSubmitting(false)
    }
  }

  // Show reading passage once for the test (all questions share same passage)
  const showPassage = quiz.skill === 'reading' && question.passage

  return (
    <Stack gap="lg" maw={800} mx="auto">
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
        <Text size="xs" c="dimmed" ta="right" mt={4}>
          Đã trả lời: {answeredCount}/{quiz.questions.length}
        </Text>
      </Box>

      {/* Audio player for Listening */}
      {quiz.skill === 'listening' && quiz.audioUrl && (
        <AudioPlayer url={quiz.audioUrl} />
      )}

      {/* Reading passage */}
      {showPassage && (
        <Paper withBorder radius="md" p="md" bg="blue.0" mah={300} style={{ overflowY: 'auto' }}>
          <Group gap={6} mb={8}>
            <IconBook size={16} color="var(--mantine-color-blue-6)" />
            <Text size="sm" fw={600} c="blue">Đoạn văn</Text>
          </Group>
          <Text size="sm" style={{ lineHeight: 1.7 }}>{question.passage}</Text>
        </Paper>
      )}

      {/* Question */}
      <Card withBorder radius="md" p="lg">
        <Stack gap="xs" mb="lg">
          <Group gap={8}>
            <Badge size="xs" color={
              question.questionType === 'fill_in_blank' ? 'orange'
              : question.questionType === 'true_false' ? 'teal' : 'blue'
            } variant="light">
              {question.questionType === 'fill_in_blank' ? 'Điền từ'
              : question.questionType === 'true_false' ? 'True / False / Not Given' : 'Trắc nghiệm'}
            </Badge>
            <Badge size="xs" color="gray" variant="light">Câu {current + 1}</Badge>
          </Group>
          <Text fw={600} size="md">{question.questionText}</Text>
        </Stack>

        {/* Fill-in-blank input */}
        {question.questionType === 'fill_in_blank' ? (
          <TextInput
            placeholder="Nhập đáp án của bạn..."
            value={selected}
            onChange={(e) => handleFillChange(e.currentTarget.value)}
            size="md"
            radius="md"
          />
        ) : (
          <Stack gap="xs">
            {question.options.map((opt) => (
              <OptionButton
                key={opt.optionKey}
                optionKey={opt.optionKey}
                optionText={opt.optionText}
                selected={selected === opt.optionKey}
                correct={false}
                revealed={false}
                onClick={() => handleSelectOption(opt.optionKey)}
              />
            ))}
          </Stack>
        )}
      </Card>

      {/* Navigation */}
      <Group justify="space-between">
        <Button variant="light" onClick={handlePrev} disabled={current === 0}>
          Câu trước
        </Button>
        <Group>
          {isLast ? (
            <Button
              size="md"
              leftSection={<IconCheck size={18} />}
              loading={submitting}
              onClick={handleSubmit}
              color="green"
            >
              Nộp bài ({answeredCount}/{quiz.questions.length} câu)
            </Button>
          ) : (
            <Button size="md" onClick={handleNext}>
              Câu tiếp theo
            </Button>
          )}
        </Group>
      </Group>

      {/* Question navigator */}
      <Card withBorder radius="md" p="sm">
        <Text size="xs" c="dimmed" mb={8}>Câu hỏi:</Text>
        <Group gap={6}>
          {quiz.questions.map((q, i) => (
            <UnstyledButton
              key={q.id}
              onClick={() => setCurrent(i)}
              style={{
                width: 32, height: 32, borderRadius: 'var(--mantine-radius-sm)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: i === current ? 700 : 400,
                background: i === current
                  ? 'var(--mantine-color-blue-5)'
                  : answers[q.id]
                    ? 'var(--mantine-color-green-1)'
                    : 'var(--mantine-color-gray-1)',
                color: i === current ? 'white' : 'inherit',
                border: answers[q.id] && i !== current
                  ? '1px solid var(--mantine-color-green-4)'
                  : '1px solid var(--mantine-color-gray-3)',
              }}
            >
              {i + 1}
            </UnstyledButton>
          ))}
        </Group>
      </Card>
    </Stack>
  )
}

// ─── Intro Screen ────────────────────────────────────────────────────────────

function IntroScreen({ quiz, onStart }: { quiz: IeltsTestDetail; onStart: () => void }) {
  const isListening = quiz.skill === 'listening'
  return (
    <Stack gap="lg" maw={480} mx="auto" align="center" py="xl">
      <ThemeIcon size={64} radius="50%" color={isListening ? 'violet' : 'blue'} variant="light">
        {isListening ? <IconHeadphones size={32} /> : <IconBook size={32} />}
      </ThemeIcon>
      <div style={{ textAlign: 'center' }}>
        <Title order={3}>{quiz.title}</Title>
        <Text c="dimmed" mt={8}>{quiz.description}</Text>
      </div>
      <Card withBorder radius="md" p="lg" w="100%">
        <Stack gap="sm">
          {[
            { label: 'Kỹ năng', value: quiz.skill },
            { label: 'Số câu hỏi', value: `${quiz.questionCount} câu` },
            { label: 'Thời gian tham khảo', value: `${quiz.durationMinutes} phút` },
            { label: 'Trình độ', value: `Band ${quiz.level}` },
            { label: 'Độ khó', value: quiz.difficulty === 'easy' ? 'Dễ' : quiz.difficulty === 'medium' ? 'Trung bình' : 'Khó' },
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
      {isListening && (
        <Alert color="violet" variant="light" radius="md" w="100%">
          <Text size="sm">Bài thi Listening có audio. Hãy đảm bảo bạn đang ở nơi yên tĩnh và có tai nghe.</Text>
        </Alert>
      )}
      <Button size="lg" leftSection={<IconListCheck size={20} />} onClick={onStart} fullWidth>
        Bắt đầu làm bài
      </Button>
    </Stack>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

type Screen = 'intro' | 'test' | 'result'

export default function IeltsTestDetailPage() {
  const { testId } = useParams<{ testId: string }>()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState<IeltsTestDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [screen, setScreen] = useState<Screen>('intro')
  const [result, setResult] = useState<IeltsSubmitResult | null>(null)

  useEffect(() => {
    if (!testId) return
    const fetch = async () => {
      setLoading(true)
      const res = await IeltsService.getTestDetail(Number(testId))
      if (res?.status === 200 && res.data) setQuiz(res.data)
      setLoading(false)
    }
    fetch()
  }, [testId])

  if (loading) return <Group justify="center" mt="xl"><Loader /></Group>

  if (!quiz) {
    return (
      <Stack align="center" py="xl">
        <Text c="dimmed">Không tìm thấy bài thi</Text>
        <Button variant="light" onClick={() => navigate('/ielts-practice')}>Quay lại</Button>
      </Stack>
    )
  }

  return (
    <Stack gap="md" p="md">
      {/* Back nav */}
      {screen !== 'test' && (
        <Group>
          <ActionIcon variant="subtle" onClick={() => navigate('/ielts-practice')}>
            <IconArrowLeft size={18} />
          </ActionIcon>
          <Text c="dimmed" size="sm">Luyện đề IELTS / </Text>
          <Text size="sm" fw={500} lineClamp={1}>{quiz.title}</Text>
        </Group>
      )}

      {screen === 'intro' && (
        <IntroScreen quiz={quiz} onStart={() => setScreen('test')} />
      )}

      {screen === 'test' && (
        <TestScreen
          quiz={quiz}
          onDone={(r) => { setResult(r); setScreen('result') }}
        />
      )}

      {screen === 'result' && result && (
        <ResultScreen
          result={result}
          quiz={quiz}
          onRetry={() => { setResult(null); setScreen('intro') }}
          onBack={() => navigate('/ielts-practice')}
        />
      )}
    </Stack>
  )
}
