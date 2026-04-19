import { useEffect, useState } from 'react'
import {
  Badge,
  Button,
  Card,
  Group,
  Progress,
  SimpleGrid,
  Skeleton,
  Stack,
  Tabs,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import {
  IconCheck,
  IconClock,
  IconFlame,
  IconListCheck,
  IconLock,
  IconStar,
  IconTrophy,
} from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { QuizService } from '@/services/quiz/quiz.service'
import type { Quiz, QuizDifficulty, QuizHistoryItem, QuizLevel } from '@/@types/quiz'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const levelColor: Record<QuizLevel, string> = {
  A1: 'green', A2: 'teal', B1: 'blue', B2: 'violet', C1: 'orange',
}

const difficultyConfig: Record<QuizDifficulty, { label: string; color: string }> = {
  easy: { label: 'Dễ', color: 'green' },
  medium: { label: 'Trung bình', color: 'yellow' },
  hard: { label: 'Khó', color: 'red' },
}

const TOPIC_TABS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'Từ vựng', label: '📖 Từ vựng' },
  { value: 'Ngữ pháp', label: '✏️ Ngữ pháp' },
  { value: 'IELTS', label: '🎓 IELTS' },
]

// ─── Quiz Card ────────────────────────────────────────────────────────────────

function QuizCard({ quiz, onClick }: { quiz: Quiz; onClick: () => void }) {
  const diff = difficultyConfig[quiz.difficulty]
  const color = levelColor[quiz.level]
  const isNew = quiz.completedCount === 0

  return (
    <Card withBorder radius="md" shadow="xs" p={0} style={{ overflow: 'hidden' }}>
      <Card.Section
        style={{
          background: `var(--mantine-color-${color}-1)`,
          padding: '16px',
          borderBottom: `2px solid var(--mantine-color-${color}-3)`,
        }}
      >
        <Group justify="space-between" align="flex-start">
          <Text size="2rem" lh={1}>{quiz.emoji}</Text>
          <Group gap={6}>
            <Badge size="sm" color={color} variant="filled">{quiz.level}</Badge>
            <Badge size="sm" color={diff.color} variant="light">{diff.label}</Badge>
          </Group>
        </Group>
        <Text fw={700} size="md" mt={8} lineClamp={2} style={{ minHeight: 44 }}>
          {quiz.title}
        </Text>
      </Card.Section>

      <Stack p="md" gap="sm">
        <Text size="sm" c="dimmed" lineClamp={2} style={{ minHeight: 40 }}>
          {quiz.description}
        </Text>

        <Group gap="lg">
          <Group gap={4}>
            <IconListCheck size={14} color="var(--mantine-color-gray-6)" />
            <Text size="xs" c="dimmed">{quiz.questionCount} câu</Text>
          </Group>
          <Group gap={4}>
            <IconClock size={14} color="var(--mantine-color-gray-6)" />
            <Text size="xs" c="dimmed">{quiz.durationMinutes} phút</Text>
          </Group>
          {quiz.completedCount > 0 && (
            <Group gap={4}>
              <IconCheck size={14} color="var(--mantine-color-green-6)" />
              <Text size="xs" c="green">{quiz.completedCount} lần</Text>
            </Group>
          )}
        </Group>

        {quiz.bestScore !== null && (
          <Group gap={6} align="center">
            <IconStar size={14} color="var(--mantine-color-yellow-6)" />
            <Text size="xs" c="dimmed">
              Cao nhất:{' '}
              <Text
                span fw={700}
                c={quiz.bestScore >= 80 ? 'green' : quiz.bestScore >= 60 ? 'yellow' : 'red'}
              >
                {quiz.bestScore}%
              </Text>
            </Text>
            <Progress
              value={quiz.bestScore}
              color={quiz.bestScore >= 80 ? 'green' : quiz.bestScore >= 60 ? 'yellow' : 'red'}
              size="xs"
              radius="xl"
              style={{ flex: 1 }}
            />
          </Group>
        )}

        <Button
          variant={isNew ? 'filled' : 'light'}
          color={color}
          size="sm"
          fullWidth
          onClick={onClick}
          leftSection={isNew ? <IconListCheck size={16} /> : <IconFlame size={16} />}
        >
          {isNew ? 'Làm bài' : 'Làm lại'}
        </Button>
      </Stack>
    </Card>
  )
}

// ─── History Row ──────────────────────────────────────────────────────────────

function HistoryRow({ item }: { item: QuizHistoryItem }) {
  const scoreColor = item.score >= 80 ? 'green' : item.score >= 60 ? 'yellow' : 'red'
  const date = new Date(item.completedAt).toLocaleDateString('vi-VN')
  return (
    <Group justify="space-between" py={8} style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}>
      <div>
        <Text size="sm" fw={500}>{item.title}</Text>
        <Text size="xs" c="dimmed">{date}</Text>
      </div>
      <Badge color={scoreColor} variant="filled" size="md">{item.score}%</Badge>
    </Group>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function QuizPage() {
  const navigate = useNavigate()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [history, setHistory] = useState<QuizHistoryItem[]>([])
  const [activeTopic, setActiveTopic] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      const [quizRes, historyRes] = await Promise.all([
        QuizService.getQuizList(activeTopic === 'all' ? undefined : { topic: activeTopic }),
        QuizService.getHistory(),
      ])
      if (quizRes?.status === 200 && quizRes.data) setQuizzes(quizRes.data)
      if (historyRes?.status === 200 && historyRes.data) setHistory(historyRes.data)
      setLoading(false)
    }
    fetch()
  }, [activeTopic])

  const doneCount = quizzes.filter((q) => q.completedCount > 0).length
  const avgScore =
    history.length > 0
      ? Math.round(history.reduce((sum, h) => sum + h.score, 0) / history.length)
      : 0

  return (
    <Stack gap="xl" p="md">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div>
        <Title order={2}>📝 Kiểm tra</Title>
        <Text c="dimmed" size="sm" mt={4}>
          Ôn luyện và kiểm tra kiến thức tiếng Anh theo chủ đề và trình độ
        </Text>
      </div>

      {/* ── Stats row ──────────────────────────────────────────────────── */}
      <SimpleGrid cols={{ base: 3 }} spacing="sm">
        {[
          { icon: <IconListCheck size={18} />, label: 'Bài có sẵn', value: quizzes.length, color: 'blue' },
          { icon: <IconCheck size={18} />, label: 'Đã hoàn thành', value: doneCount, color: 'green' },
          { icon: <IconTrophy size={18} />, label: 'Điểm TB', value: history.length > 0 ? `${avgScore}%` : '—', color: 'orange' },
        ].map((s) => (
          <Card key={s.label} withBorder radius="md" p="md">
            <Group gap="sm">
              <ThemeIcon size="lg" radius="md" color={s.color} variant="light">{s.icon}</ThemeIcon>
              <div>
                <Text size="xl" fw={700} lh={1}>{s.value}</Text>
                <Text size="xs" c="dimmed">{s.label}</Text>
              </div>
            </Group>
          </Card>
        ))}
      </SimpleGrid>

      {/* ── Topic filter ───────────────────────────────────────────────── */}
      <Tabs value={activeTopic} onChange={(v) => setActiveTopic(v ?? 'all')} variant="pills">
        <Tabs.List>
          {TOPIC_TABS.map((t) => (
            <Tabs.Tab key={t.value} value={t.value}>{t.label}</Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>

      {/* ── Quiz grid ──────────────────────────────────────────────────── */}
      {loading ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} height={280} radius="md" />)}
        </SimpleGrid>
      ) : quizzes.length === 0 ? (
        <Stack align="center" py="xl">
          <Text size="3rem">📭</Text>
          <Text c="dimmed">Không có bài kiểm tra nào cho chủ đề này</Text>
        </Stack>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {quizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              onClick={() => navigate(`/quiz/${quiz.id}`)}
            />
          ))}
        </SimpleGrid>
      )}

      {/* ── History ────────────────────────────────────────────────────── */}
      {history.length > 0 && (
        <Stack gap="sm">
          <Title order={4}>🕐 Lịch sử làm bài gần đây</Title>
          <Card withBorder radius="md" p="md">
            {history.map((item, i) => <HistoryRow key={i} item={item} />)}
          </Card>
        </Stack>
      )}
    </Stack>
  )
}
