import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Loader,
  Paper,
  Radio,
  RingProgress,
  Stack,
  Tabs,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  TypographyStylesProvider,
} from '@mantine/core'
import {
  IconArrowLeft,
  IconBook,
  IconCheck,
  IconListCheck,
  IconStar,
  IconX,
} from '@tabler/icons-react'
import { GrammarService } from '@/services/grammar/grammar.service'
import type {
  GrammarLessonDetail as LessonDetailType,
  GrammarExercise,
  GrammarSubmitResult,
} from '@/@types/grammar'

// ─── Sentence Order Exercise ─────────────────────────────────────────────────

function SentenceOrderInput({
  questionText,
  value,
  onChange,
  disabled,
}: {
  questionText: string
  value: string
  onChange: (v: string) => void
  disabled: boolean
}) {
  // Extract words from the question text after "Arrange:" or "Arrange the words:"
  const arrangeMatch = questionText.match(/Arrange(?:\s+the\s+words)?:\s*(.+)/i)
  const rawWords = arrangeMatch ? arrangeMatch[1] : questionText
  const allWords = rawWords
    .split(/\s*\/\s*/)
    .map((w) => w.trim())
    .filter((w) => w.length > 0 && w !== '?')

  const selectedWords = value ? value.split(' ').filter(Boolean) : []

  // Remaining available words
  const usedIndices = new Set<number>()
  const tempSelected = [...selectedWords]
  for (const sw of tempSelected) {
    const idx = allWords.findIndex(
      (w, i) => w.toLowerCase() === sw.toLowerCase() && !usedIndices.has(i)
    )
    if (idx !== -1) usedIndices.add(idx)
  }

  const handleWordClick = (word: string, wordIndex: number) => {
    if (disabled) return
    if (usedIndices.has(wordIndex)) return
    const newSelected = [...selectedWords, word]
    onChange(newSelected.join(' '))
  }

  const handleRemoveWord = (index: number) => {
    if (disabled) return
    const newSelected = selectedWords.filter((_, i) => i !== index)
    onChange(newSelected.join(' '))
  }

  const handleClear = () => {
    if (disabled) return
    onChange('')
  }

  return (
    <Stack gap="xs">
      {/* Selected words area */}
      <Paper
        withBorder
        p="sm"
        radius="md"
        style={{ minHeight: 48, background: 'var(--mantine-color-gray-0)' }}
      >
        {selectedWords.length === 0 ? (
          <Text size="sm" c="dimmed">
            Nhấn vào từ bên dưới để sắp xếp...
          </Text>
        ) : (
          <Group gap={6}>
            {selectedWords.map((word, i) => (
              <Badge
                key={i}
                size="lg"
                variant="filled"
                color="blue"
                style={{ cursor: disabled ? 'default' : 'pointer' }}
                onClick={() => handleRemoveWord(i)}
                rightSection={
                  !disabled && (
                    <IconX size={12} style={{ marginLeft: 2 }} />
                  )
                }
              >
                {word}
              </Badge>
            ))}
            {!disabled && selectedWords.length > 0 && (
              <ActionIcon size="sm" variant="subtle" color="gray" onClick={handleClear}>
                <IconX size={14} />
              </ActionIcon>
            )}
          </Group>
        )}
      </Paper>

      {/* Available words */}
      <Group gap={6}>
        {allWords.map((word, i) => (
          <Badge
            key={i}
            size="lg"
            variant={usedIndices.has(i) ? 'light' : 'outline'}
            color={usedIndices.has(i) ? 'gray' : 'blue'}
            style={{
              cursor: disabled || usedIndices.has(i) ? 'default' : 'pointer',
              opacity: usedIndices.has(i) ? 0.4 : 1,
            }}
            onClick={() => handleWordClick(word, i)}
          >
            {word}
          </Badge>
        ))}
      </Group>
    </Stack>
  )
}

// ─── Exercise Item ───────────────────────────────────────────────────────────

function ExerciseItem({
  exercise,
  index,
  answer,
  onAnswer,
  disabled,
}: {
  exercise: GrammarExercise
  index: number
  answer: string
  onAnswer: (value: string) => void
  disabled: boolean
}) {
  return (
    <Card withBorder radius="md" p="md">
      <Group gap="sm" mb="sm">
        <ThemeIcon size="sm" radius="xl" color="blue" variant="light">
          <Text size="xs" fw={700}>
            {index + 1}
          </Text>
        </ThemeIcon>
        <Badge size="xs" variant="light" color="gray">
          {exercise.type === 'fill_in_blank'
            ? 'Điền từ'
            : exercise.type === 'multiple_choice'
              ? 'Trắc nghiệm'
              : 'Sắp xếp câu'}
        </Badge>
      </Group>

      <Text size="sm" fw={500} mb="sm">
        {exercise.questionText}
      </Text>

      {exercise.type === 'fill_in_blank' && (
        <TextInput
          placeholder="Nhập câu trả lời..."
          value={answer}
          onChange={(e) => onAnswer(e.currentTarget.value)}
          disabled={disabled}
        />
      )}

      {exercise.type === 'multiple_choice' && (
        <Radio.Group value={answer} onChange={onAnswer}>
          <Stack gap="xs">
            {exercise.options.map((opt) => (
              <Radio
                key={opt.optionKey}
                value={opt.optionKey}
                label={`${opt.optionKey}. ${opt.optionText}`}
                disabled={disabled}
              />
            ))}
          </Stack>
        </Radio.Group>
      )}

      {exercise.type === 'sentence_order' && (
        <SentenceOrderInput
          questionText={exercise.questionText}
          value={answer}
          onChange={onAnswer}
          disabled={disabled}
        />
      )}
    </Card>
  )
}

// ─── Result Detail ───────────────────────────────────────────────────────────

function ResultView({
  result,
  onRetry,
  onBack,
}: {
  result: GrammarSubmitResult
  onRetry: () => void
  onBack: () => void
}) {
  const scoreColor =
    result.score >= 80 ? 'green' : result.score >= 60 ? 'yellow' : 'red'

  return (
    <Stack gap="lg">
      {/* Score ring */}
      <Card withBorder radius="md" p="xl">
        <Stack align="center" gap="md">
          <RingProgress
            size={140}
            thickness={12}
            roundCaps
            sections={[{ value: result.score, color: scoreColor }]}
            label={
              <Text ta="center" fw={700} size="xl">
                {result.score}%
              </Text>
            }
          />
          <Group gap="xl">
            <div style={{ textAlign: 'center' }}>
              <Text size="xl" fw={700} c="green">
                {result.correctCount}
              </Text>
              <Text size="xs" c="dimmed">
                Đúng
              </Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Text size="xl" fw={700} c="red">
                {result.totalQuestions - result.correctCount}
              </Text>
              <Text size="xs" c="dimmed">
                Sai
              </Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Text size="xl" fw={700} c="orange">
                +{result.xpEarned}
              </Text>
              <Text size="xs" c="dimmed">
                XP
              </Text>
            </div>
          </Group>
          {result.completed ? (
            <Badge color="green" size="lg" variant="light">
              Hoàn thành bài học!
            </Badge>
          ) : (
            <Badge color="orange" size="lg" variant="light">
              Cần đạt 60% để hoàn thành
            </Badge>
          )}
        </Stack>
      </Card>

      {/* Answer details */}
      <Title order={5}>Chi tiết đáp án</Title>
      <Stack gap="sm">
        {result.details.map((d, i) => {
          const isCorrect = d.isCorrect ?? d.correct;
          return (
          <Card
            key={d.exerciseId}
            withBorder
            radius="md"
            p="sm"
            style={{
              borderLeft: `4px solid var(--mantine-color-${isCorrect ? 'green' : 'red'}-5)`,
            }}
          >
            <Group gap="xs" mb={4}>
              <ThemeIcon
                size="xs"
                radius="xl"
                color={isCorrect ? 'green' : 'red'}
                variant="filled"
              >
                {isCorrect ? <IconCheck size={10} /> : <IconX size={10} />}
              </ThemeIcon>
              <Text size="sm" fw={500}>
                Câu {i + 1}
              </Text>
            </Group>
            <Text size="xs" c="dimmed" mb={4}>
              {d.questionText}
            </Text>
            {!isCorrect && (
              <Group gap="xs" mb={4}>
                <Text size="xs" c="red">
                  Bạn chọn: {d.selectedAnswer || '(bỏ trống)'}
                </Text>
                <Text size="xs" c="green" fw={600}>
                  Đáp án: {d.correctAnswer}
                </Text>
              </Group>
            )}
            {d.explanation && (
              <Text size="xs" c="blue" fs="italic">
                {d.explanation}
              </Text>
            )}
          </Card>
          );
        })}
      </Stack>

      {/* Actions */}
      <Group justify="center">
        <Button variant="light" onClick={onBack} leftSection={<IconArrowLeft size={16} />}>
          Quay lại
        </Button>
        <Button onClick={onRetry} leftSection={<IconStar size={16} />}>
          Làm lại
        </Button>
      </Group>
    </Stack>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function GrammarLessonDetailPage() {
  const { lessonId } = useParams<{ lessonId: string }>()
  const navigate = useNavigate()

  const [lesson, setLesson] = useState<LessonDetailType | null>(null)
  const [loading, setLoading] = useState(true)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<GrammarSubmitResult | null>(null)
  const [activeTab, setActiveTab] = useState<string | null>('theory')

  useEffect(() => {
    if (!lessonId) return
    const fetch = async () => {
      setLoading(true)
      const res = await GrammarService.getLessonDetail(Number(lessonId))
      if (res?.status === 200 && res.data) setLesson(res.data)
      setLoading(false)
    }
    fetch()
  }, [lessonId])

  const handleSubmit = async () => {
    if (!lessonId || !lesson) return
    setSubmitting(true)
    const res = await GrammarService.submitExercises(Number(lessonId), answers)
    if (res?.status === 200 && res.data) {
      setResult(res.data)
    }
    setSubmitting(false)
  }

  const handleRetry = () => {
    setAnswers({})
    setResult(null)
    setActiveTab('exercises')
  }

  if (loading) {
    return (
      <Stack align="center" justify="center" p="xl" style={{ minHeight: 400 }}>
        <Loader size="lg" />
        <Text c="dimmed">Đang tải bài học...</Text>
      </Stack>
    )
  }

  if (!lesson) {
    return (
      <Stack align="center" justify="center" p="xl" style={{ minHeight: 400 }}>
        <Text size="3rem">404</Text>
        <Text c="dimmed">Không tìm thấy bài học</Text>
        <Button variant="light" onClick={() => navigate('/grammar')}>
          Quay lại
        </Button>
      </Stack>
    )
  }

  const answeredCount = Object.values(answers).filter((a) => a.trim().length > 0).length

  return (
    <Stack gap="lg" p="md">
      {/* ── Header ─────────────────────────────────────────────── */}
      <Group>
        <ActionIcon variant="subtle" onClick={() => navigate('/grammar')}>
          <IconArrowLeft size={20} />
        </ActionIcon>
        <div>
          <Title order={3}>{lesson.title}</Title>
          <Text size="sm" c="dimmed">
            {lesson.summary}
          </Text>
        </div>
        <Badge ml="auto" color={lesson.level === 'A1' || lesson.level === 'A2' ? 'green' : 'blue'}>
          {lesson.level}
        </Badge>
      </Group>

      {/* ── Result view ────────────────────────────────────────── */}
      {result ? (
        <ResultView
          result={result}
          onRetry={handleRetry}
          onBack={() => navigate('/grammar')}
        />
      ) : (
        /* ── Tabs: theory + exercises ────────────────────────── */
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="theory" leftSection={<IconBook size={16} />}>
              Lý thuyết
            </Tabs.Tab>
            <Tabs.Tab value="exercises" leftSection={<IconListCheck size={16} />}>
              Bài tập ({lesson.exerciseCount})
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="theory" pt="md">
            <Card withBorder radius="md" p="lg">
              <TypographyStylesProvider>
                <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
              </TypographyStylesProvider>
            </Card>
            <Group justify="center" mt="md">
              <Button
                onClick={() => setActiveTab('exercises')}
                rightSection={<IconListCheck size={16} />}
              >
                Làm bài tập
              </Button>
            </Group>
          </Tabs.Panel>

          <Tabs.Panel value="exercises" pt="md">
            <Stack gap="md">
              {lesson.exercises.map((ex, i) => (
                <ExerciseItem
                  key={ex.id}
                  exercise={ex}
                  index={i}
                  answer={answers[ex.id] ?? ''}
                  onAnswer={(v) =>
                    setAnswers((prev) => ({ ...prev, [ex.id]: v }))
                  }
                  disabled={false}
                />
              ))}

              <Divider />

              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Đã trả lời: {answeredCount}/{lesson.exercises.length}
                </Text>
                <Button
                  onClick={handleSubmit}
                  loading={submitting}
                  disabled={answeredCount === 0}
                  leftSection={<IconCheck size={16} />}
                >
                  Nộp bài
                </Button>
              </Group>
            </Stack>
          </Tabs.Panel>
        </Tabs>
      )}
    </Stack>
  )
}
