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
  Modal,
} from '@mantine/core'
import {
  IconCheck,
  IconClock,
  IconHeadphones,
  IconListCheck,
  IconPlayerPlay,
  IconTrophy,
} from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { useDisclosure } from '@mantine/hooks'
import { ListeningService } from '@/services/listening/listening.service'
import type { ListeningTopic, ListeningLesson, ListeningProgress } from '@/@types/listening'

// ─── Level tabs ──────────────────────────────────────────────────────────────

const LEVEL_TABS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'A1', label: 'A1' },
  { value: 'A2', label: 'A2' },
  { value: 'B1', label: 'B1' },
  { value: 'B2', label: 'B2' },
  { value: 'C1', label: 'C1' },
  { value: 'C2', label: 'C2' },
]

const levelColorMap: Record<string, string> = {
  A1: 'green',
  A2: 'teal',
  B1: 'blue',
  B2: 'indigo',
  C1: 'violet',
  C2: 'grape',
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return '—'
  const min = Math.floor(seconds / 60)
  const sec = seconds % 60
  return sec > 0 ? `${min}m ${sec}s` : `${min}m`
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  color: string
}) {
  return (
    <Card withBorder radius="md" p="md">
      <Group gap="sm">
        <ThemeIcon size="lg" radius="md" color={color} variant="light">
          {icon}
        </ThemeIcon>
        <div>
          <Text size="xl" fw={700} lh={1}>
            {value}
          </Text>
          <Text size="xs" c="dimmed">
            {label}
          </Text>
        </div>
      </Group>
    </Card>
  )
}

// ─── Topic Card ──────────────────────────────────────────────────────────────

function TopicCard({
  topic,
  onClick,
}: {
  topic: ListeningTopic
  onClick: () => void
}) {
  const color = levelColorMap[topic.level] ?? 'gray'
  const allDone = topic.lessonCount > 0 && topic.completedCount === topic.lessonCount

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
          <Text size="2rem">{topic.emoji}</Text>
          <Badge size="sm" color={color} variant="filled">
            {topic.level}
          </Badge>
        </Group>
        <Text fw={700} size="md" mt={8}>
          {topic.name}
        </Text>
      </Card.Section>

      <Stack p="md" gap="sm">
        <Text size="sm" c="dimmed" lineClamp={2} style={{ minHeight: 40 }}>
          {topic.description}
        </Text>

        <Group gap="lg">
          <Group gap={4}>
            <IconHeadphones size={14} color="var(--mantine-color-gray-6)" />
            <Text size="xs" c="dimmed">
              {topic.lessonCount} bài nghe
            </Text>
          </Group>
          <Group gap={4}>
            <IconCheck size={14} color="var(--mantine-color-green-6)" />
            <Text size="xs" c="green">
              {topic.completedCount}/{topic.lessonCount}
            </Text>
          </Group>
        </Group>

        {topic.lessonCount > 0 && (
          <Progress
            value={(topic.completedCount / topic.lessonCount) * 100}
            color={allDone ? 'green' : color}
            size="xs"
            radius="xl"
          />
        )}

        <Button
          variant={allDone ? 'light' : 'filled'}
          color={color}
          size="sm"
          fullWidth
          onClick={onClick}
          leftSection={allDone ? <IconCheck size={16} /> : <IconPlayerPlay size={16} />}
        >
          {allDone ? 'Ôn tập' : 'Nghe ngay'}
        </Button>
      </Stack>
    </Card>
  )
}

// ─── Lesson Card ─────────────────────────────────────────────────────────────

function LessonCard({
  lesson,
  onClick,
}: {
  lesson: ListeningLesson
  onClick: () => void
}) {
  const color = levelColorMap[lesson.level] ?? 'gray'
  const scoreColor =
    lesson.score !== null
      ? lesson.score >= 80
        ? 'green'
        : lesson.score >= 60
          ? 'yellow'
          : 'red'
      : 'gray'

  return (
    <Card withBorder radius="md" p="md" style={{ cursor: 'pointer' }} onClick={onClick}>
      <Group justify="space-between" mb="xs">
        <Text fw={600} size="sm">
          {lesson.title}
        </Text>
        {lesson.completed && (
          <Badge color="green" variant="light" size="sm">
            Hoàn thành
          </Badge>
        )}
      </Group>
      <Text size="xs" c="dimmed" lineClamp={2} mb="sm">
        {lesson.description}
      </Text>
      <Group gap="lg">
        <Group gap={4}>
          <IconListCheck size={14} color="var(--mantine-color-gray-6)" />
          <Text size="xs" c="dimmed">
            {lesson.questionCount} câu hỏi
          </Text>
        </Group>
        <Group gap={4}>
          <IconClock size={14} color="var(--mantine-color-gray-6)" />
          <Text size="xs" c="dimmed">
            {formatDuration(lesson.durationSeconds)}
          </Text>
        </Group>
        {lesson.score !== null && (
          <Group gap={4}>
            <IconTrophy size={14} color={`var(--mantine-color-${scoreColor}-6)`} />
            <Text size="xs" c={scoreColor} fw={600}>
              {lesson.score}%
            </Text>
          </Group>
        )}
      </Group>
    </Card>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function ListeningPage() {
  const navigate = useNavigate()
  const [topics, setTopics] = useState<ListeningTopic[]>([])
  const [progress, setProgress] = useState<ListeningProgress | null>(null)
  const [activeLevel, setActiveLevel] = useState('all')
  const [loading, setLoading] = useState(true)

  // Lesson modal state
  const [selectedTopic, setSelectedTopic] = useState<ListeningTopic | null>(null)
  const [lessons, setLessons] = useState<ListeningLesson[]>([])
  const [lessonsLoading, setLessonsLoading] = useState(false)
  const [opened, { open, close }] = useDisclosure(false)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      const level = activeLevel === 'all' ? undefined : activeLevel
      const [topicsRes, progressRes] = await Promise.all([
        ListeningService.getTopics(level),
        ListeningService.getUserProgress(),
      ])
      if (topicsRes?.status === 200 && topicsRes.data) setTopics(topicsRes.data)
      if (progressRes?.status === 200 && progressRes.data) setProgress(progressRes.data)
      setLoading(false)
    }
    fetch()
  }, [activeLevel])

  const handleTopicClick = async (topic: ListeningTopic) => {
    setSelectedTopic(topic)
    setLessonsLoading(true)
    open()
    const res = await ListeningService.getLessons({ topicId: topic.id })
    if (res?.status === 200 && res.data) setLessons(res.data)
    setLessonsLoading(false)
  }

  return (
    <Stack gap="xl" p="md">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div>
        <Title order={2}>Luyện nghe</Title>
        <Text c="dimmed" size="sm" mt={4}>
          Cải thiện kỹ năng nghe tiếng Anh qua các bài nghe và câu hỏi tương tác
        </Text>
      </div>

      {/* ── Stats row ───────────────────────────────────────────── */}
      <SimpleGrid cols={{ base: 2, sm: 5 }} spacing="sm">
        <StatCard
          icon={<IconHeadphones size={18} />}
          label="Tổng bài nghe"
          value={progress?.totalLessons ?? 0}
          color="blue"
        />
        <StatCard
          icon={<IconCheck size={18} />}
          label="Đã hoàn thành"
          value={progress?.completedLessons ?? 0}
          color="green"
        />
        <StatCard
          icon={<IconTrophy size={18} />}
          label="Điểm TB"
          value={progress ? `${progress.averageScore}%` : '—'}
          color="orange"
        />
        <StatCard
          icon={<IconListCheck size={18} />}
          label="Câu hỏi đã làm"
          value={progress?.totalQuestionsDone ?? 0}
          color="violet"
        />
        <StatCard
          icon={<IconClock size={18} />}
          label="Phút nghe"
          value={progress?.totalListeningMinutes ?? 0}
          color="cyan"
        />
      </SimpleGrid>

      {/* ── Level filter ────────────────────────────────────────── */}
      <Tabs
        value={activeLevel}
        onChange={(v) => setActiveLevel(v ?? 'all')}
        variant="pills"
      >
        <Tabs.List>
          {LEVEL_TABS.map((t) => (
            <Tabs.Tab key={t.value} value={t.value}>
              {t.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>

      {/* ── Topic grid ──────────────────────────────────────────── */}
      {loading ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height={260} radius="md" />
          ))}
        </SimpleGrid>
      ) : topics.length === 0 ? (
        <Stack align="center" py="xl">
          <Text size="3rem">📭</Text>
          <Text c="dimmed">Không có chủ đề nào cho cấp độ này</Text>
        </Stack>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {topics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onClick={() => handleTopicClick(topic)}
            />
          ))}
        </SimpleGrid>
      )}

      {/* ── Lessons Modal ───────────────────────────────────────── */}
      <Modal
        opened={opened}
        onClose={close}
        title={
          <Group gap="sm">
            <Text size="xl">{selectedTopic?.emoji}</Text>
            <div>
              <Text fw={700}>{selectedTopic?.name}</Text>
              <Text size="xs" c="dimmed">
                {selectedTopic?.description}
              </Text>
            </div>
          </Group>
        }
        size="lg"
      >
        {lessonsLoading ? (
          <Stack gap="sm">
            {[1, 2].map((i) => (
              <Skeleton key={i} height={100} radius="md" />
            ))}
          </Stack>
        ) : lessons.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            Chưa có bài nghe nào
          </Text>
        ) : (
          <Stack gap="sm">
            {lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                onClick={() => navigate(`/listening/${lesson.id}`)}
              />
            ))}
          </Stack>
        )}
      </Modal>
    </Stack>
  )
}
