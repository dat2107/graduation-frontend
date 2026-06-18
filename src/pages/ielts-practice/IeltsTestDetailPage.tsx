import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Flex,
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

// ─── Question type labels ──────────────────────────────────────────────────

const QUESTION_TYPE_LABEL: Record<string, string> = {
  multiple_choice: 'Trắc nghiệm',
  true_false: 'True / False / Not Given',
  matching: 'Nối thông tin',
  map_labelling: 'Điền sơ đồ / bản đồ',
  fill_in_blank: 'Điền từ',
  note_completion: 'Hoàn thành ghi chú',
  form_completion: 'Hoàn thành biểu mẫu',
  table_completion: 'Hoàn thành bảng',
  flowchart_completion: 'Hoàn thành sơ đồ',
  sentence_completion: 'Hoàn thành câu',
  short_answer: 'Trả lời ngắn',
}

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
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const timer = useTimer()

  useEffect(() => { timer.start() }, [])  // eslint-disable-line

  const total = quiz.questions.length
  const answeredCount = Object.values(answers).filter((v) => v?.toString().trim()).length
  const progress = Math.round((answeredCount / total) * 100)

  const setAnswer = (id: number, value: string) =>
    setAnswers((prev) => ({ ...prev, [id]: value }))

  const scrollToQ = (id: number) =>
    document.getElementById(`q-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })

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

  const isReading = quiz.skill === 'reading'

  // Group questions by part. Each part has its passage (passage 1/2/3 for reading)
  // and the question range for the "Part N · Câu X–Y" header.
  const parts: { part: number; passage: string | null; from: number; to: number; questions: IeltsQuestion[] }[] = []
  quiz.questions.forEach((q) => {
    let p = parts.find((x) => x.part === q.partNumber)
    if (!p) {
      p = { part: q.partNumber, passage: q.passage ?? null, from: q.orderIndex, to: q.orderIndex, questions: [] }
      parts.push(p)
    }
    if (!p.passage && q.passage) p.passage = q.passage
    p.from = Math.min(p.from, q.orderIndex)
    p.to = Math.max(p.to, q.orderIndex)
    p.questions.push(q)
  })

  const renderQuestion = (q: IeltsQuestion) => {
    const useOptions = (q.options?.length ?? 0) > 0
    const value = answers[q.id] ?? ''
    return (
      <Card key={q.id} id={`q-${q.id}`} withBorder radius="md" p="md">
        <Group gap={10} align="flex-start" wrap="nowrap" mb={8}>
          <Box
            style={{
              minWidth: 26, height: 26, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700,
              background: value ? 'var(--mantine-color-blue-5)' : 'var(--mantine-color-gray-2)',
              color: value ? 'white' : 'var(--mantine-color-dark-5)',
            }}
          >
            {q.orderIndex}
          </Box>
          <Text fw={500} size="sm" style={{ flex: 1, paddingTop: 3 }}>{q.questionText}</Text>
        </Group>
        {useOptions ? (
          <Stack gap={6} style={{ marginLeft: 36 }}>
            {q.options.map((opt) => (
              <OptionButton
                key={opt.optionKey}
                optionKey={opt.optionKey}
                optionText={opt.optionText}
                selected={value === opt.optionKey}
                correct={false}
                revealed={false}
                onClick={() => setAnswer(q.id, opt.optionKey)}
              />
            ))}
          </Stack>
        ) : (
          <TextInput
            placeholder="Nhập đáp án..."
            value={value}
            onChange={(e) => setAnswer(q.id, e.currentTarget.value)}
            size="sm"
            style={{ maxWidth: 360, marginLeft: 36 }}
          />
        )}
      </Card>
    )
  }

  // Reading: split layout — passage (left, sticky) + questions (right, scroll),
  // one block per passage. Listening: single scrollable page (audio plays once).
  const body = isReading ? (
    parts.map((p) => (
      <Flex key={p.part} gap="md" align="flex-start" mb="xl" direction={{ base: 'column', md: 'row' }}>
        <Paper
          withBorder radius="md" p="md" bg="blue.0"
          style={{ flex: 1, position: 'sticky', top: 80, maxHeight: 'calc(100vh - 110px)', overflowY: 'auto' }}
        >
          <Badge variant="light" color="violet" mb={8}>Passage {p.part}</Badge>
          <Text size="sm" style={{ lineHeight: 1.8, whiteSpace: 'pre-line' }}>{p.passage}</Text>
        </Paper>
        <Stack gap="sm" style={{ flex: 1 }}>
          <Badge variant="light" color="violet">Part {p.part} · Câu {p.from}–{p.to}</Badge>
          {p.questions.map(renderQuestion)}
        </Stack>
      </Flex>
    ))
  ) : (
    parts.map((p) => (
      <Box key={p.part}>
        <Badge variant="light" color="violet" mt="md" mb={6}>Part {p.part} · Câu {p.from}–{p.to}</Badge>
        {p.passage && (
          <Paper withBorder radius="md" p="md" bg="blue.0" mb="sm">
            <Text size="sm" style={{ lineHeight: 1.7, whiteSpace: 'pre-line' }}>{p.passage}</Text>
          </Paper>
        )}
        <Stack gap="sm">
          {p.questions.map(renderQuestion)}
        </Stack>
      </Box>
    ))
  )

  return (
    <Flex gap="lg" align="flex-start" justify="center">
      <Stack gap="sm" maw={isReading ? 1140 : 820} style={{ flex: 1, minWidth: 0 }}>
      {/* Sticky bar: audio + timer + submit stay visible while scrolling */}
      <Box
        style={{
          position: 'sticky', top: 0, zIndex: 5,
          background: 'var(--mantine-color-body)', paddingTop: 8, paddingBottom: 8,
        }}
      >
        {quiz.skill === 'listening' && quiz.audioUrl && <AudioPlayer url={quiz.audioUrl} />}
        <Group justify="space-between" mt={quiz.skill === 'listening' ? 8 : 0}>
          <Group gap={6}>
            <IconClock size={14} color="var(--mantine-color-gray-6)" />
            <Text size="sm" c="dimmed" ff="monospace">{timer.format(timer.seconds)}</Text>
            <Text size="sm" c="dimmed">· Đã trả lời {answeredCount}/{total}</Text>
          </Group>
          <Button size="sm" color="green" leftSection={<IconCheck size={16} />} loading={submitting} onClick={handleSubmit}>
            Nộp bài
          </Button>
        </Group>
        <Progress value={progress} size="xs" radius="xl" color="blue" mt={6} />
      </Box>

      {body}

      </Stack>

      {/* Bảng câu đã làm: cột dính bên phải, nằm trong bố cục nên không che nội dung */}
      <Paper
        withBorder radius="md" p="xs" visibleFrom="lg"
        style={{
          position: 'sticky', top: 76, width: 184, flexShrink: 0,
          maxHeight: '80vh', overflowY: 'auto', background: 'var(--mantine-color-body)',
        }}
      >
        <Text size="xs" c="dimmed" mb={6}>Đã làm {answeredCount}/{total}</Text>
        <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
          {quiz.questions.map((q: IeltsQuestion) => {
            const done = !!answers[q.id]?.toString().trim()
            return (
              <UnstyledButton
                key={q.id}
                onClick={() => scrollToQ(q.id)}
                title={`Câu ${q.orderIndex}`}
                style={{
                  height: 28, borderRadius: 6, fontSize: 12, fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: done ? 'var(--mantine-color-green-5)' : 'var(--mantine-color-gray-1)',
                  color: done ? 'white' : 'var(--mantine-color-dark-5)',
                  border: `1px solid ${done ? 'var(--mantine-color-green-6)' : 'var(--mantine-color-gray-3)'}`,
                }}
              >
                {q.orderIndex}
              </UnstyledButton>
            )
          })}
        </Box>
      </Paper>
    </Flex>
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
