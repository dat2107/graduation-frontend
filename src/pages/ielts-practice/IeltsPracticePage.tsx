import { useEffect, useMemo, useState } from 'react'
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
  IconBook,
  IconCheck,
  IconClock,
  IconFlame,
  IconHeadphones,
  IconListCheck,
  IconMicrophone,
  IconPencil,
  IconStar,
  IconTrophy,
} from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { IeltsService } from '@/services/ielts/ielts.service'
import { IeltsWritingService } from '@/services/ieltsWriting/ieltsWriting.service'
import { IeltsSpeakingService } from '@/services/ieltsSpeaking/ieltsSpeaking.service'
import type {
  IeltsDifficulty,
  IeltsHistoryItem,
  IeltsSkill,
  IeltsTest,
} from '@/@types/ielts'
import type {
  IeltsWritingTask,
  IeltsWritingTaskType,
  IeltsWritingSubmission,
} from '@/@types/ieltsWriting'
import type { IeltsSpeakingTest, IeltsSpeakingHistory } from '@/@types/ieltsSpeaking'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const difficultyConfig: Record<IeltsDifficulty, { label: string; color: string }> = {
  easy: { label: 'Dễ', color: 'green' },
  medium: { label: 'Trung bình', color: 'yellow' },
  hard: { label: 'Khó', color: 'red' },
}

const skillConfig: Record<string, { label: string; icon: typeof IconBook; color: string }> = {
  reading: { label: 'Reading', icon: IconBook, color: 'blue' },
  listening: { label: 'Listening', icon: IconHeadphones, color: 'violet' },
  writing: { label: 'Writing', icon: IconPencil, color: 'pink' },
  speaking: { label: 'Speaking', icon: IconMicrophone, color: 'grape' },
}

const writingTaskTypeConfig: Record<IeltsWritingTaskType, { label: string; color: string }> = {
  TASK_1: { label: 'Task 1', color: 'blue' },
  TASK_2: { label: 'Task 2', color: 'grape' },
}

const SKILL_TABS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'reading', label: 'Reading' },
  { value: 'listening', label: 'Listening' },
  { value: 'writing', label: 'Writing' },
  { value: 'speaking', label: 'Speaking' },
]

// ─── Reading/Listening Test Card ────────────────────────────────────────────

function IeltsTestCard({
  test,
  onClick,
}: {
  test: IeltsTest
  onClick: () => void
}) {
  const skill = skillConfig[test.skill] ?? {
    label: test.skill ?? 'Unknown',
    icon: IconBook,
    color: 'gray',
  }

  const diff = difficultyConfig[test.difficulty] ?? {
    label: test.difficulty ?? 'Unknown',
    color: 'gray',
  }

  const SkillIcon = skill.icon
  const isNew = (test.completedCount ?? 0) === 0

  return (
    <Card
      withBorder
      radius="md"
      shadow="xs"
      p={0}
      style={{ overflow: 'hidden' }}
    >
      <Card.Section
        style={{
          background: `var(--mantine-color-${skill.color}-1)`,
          padding: '16px',
          borderBottom: `2px solid var(--mantine-color-${skill.color}-3)`,
        }}
      >
        <Group justify="space-between" align="flex-start">
          <ThemeIcon size="lg" radius="md" color={skill.color} variant="light">
            <SkillIcon size={20} />
          </ThemeIcon>
          <Group gap={6}>
            <Badge size="sm" color={skill.color} variant="filled">
              {skill.label}
            </Badge>
            <Badge size="sm" color="gray" variant="light">
              Band {test.level}
            </Badge>
            <Badge size="sm" color={diff.color} variant="light">
              {diff.label}
            </Badge>
          </Group>
        </Group>
        <Text fw={700} size="md" mt={8} lineClamp={2} style={{ minHeight: 44 }}>
          {test.title}
        </Text>
      </Card.Section>

      <Stack p="md" gap="sm">
        <Text size="sm" c="dimmed" lineClamp={2} style={{ minHeight: 40 }}>
          {test.description}
        </Text>

        <Group gap="lg">
          <Group gap={4}>
            <IconListCheck size={14} color="var(--mantine-color-gray-6)" />
            <Text size="xs" c="dimmed">
              {test.questionCount} câu
            </Text>
          </Group>
          <Group gap={4}>
            <IconClock size={14} color="var(--mantine-color-gray-6)" />
            <Text size="xs" c="dimmed">
              {test.durationMinutes} phút
            </Text>
          </Group>
          {test.completedCount > 0 && (
            <Group gap={4}>
              <IconCheck size={14} color="var(--mantine-color-green-6)" />
              <Text size="xs" c="green">
                {test.completedCount} lần
              </Text>
            </Group>
          )}
        </Group>

        {test.bestScore !== null && (
          <Group gap={6} align="center">
            <IconStar size={14} color="var(--mantine-color-yellow-6)" />
            <Text size="xs" c="dimmed">
              Cao nhất:{' '}
              <Text
                span
                fw={700}
                c={
                  test.bestScore >= 80
                    ? 'green'
                    : test.bestScore >= 60
                      ? 'yellow'
                      : 'red'
                }
              >
                {test.bestScore}%
              </Text>
            </Text>
            <Progress
              value={test.bestScore}
              color={
                test.bestScore >= 80
                  ? 'green'
                  : test.bestScore >= 60
                    ? 'yellow'
                    : 'red'
              }
              size="xs"
              radius="xl"
              style={{ flex: 1 }}
            />
          </Group>
        )}

        <Button
          variant={isNew ? 'filled' : 'light'}
          color={skill.color}
          size="sm"
          fullWidth
          onClick={onClick}
          leftSection={
            isNew ? <IconListCheck size={16} /> : <IconFlame size={16} />
          }
        >
          {isNew ? 'Làm bài' : 'Làm lại'}
        </Button>
      </Stack>
    </Card>
  )
}

// ─── Writing Task Card ──────────────────────────────────────────────────────

function WritingTaskCard({
  task,
  onClick,
}: {
  task: IeltsWritingTask
  onClick: () => void
}) {
  const cfg = writingTaskTypeConfig[task.taskType]
  const skill = skillConfig.writing

  return (
    <Card
      withBorder
      radius="md"
      shadow="xs"
      p={0}
      style={{ overflow: 'hidden' }}
    >
      <Card.Section
        style={{
          background: `var(--mantine-color-${skill.color}-1)`,
          padding: '16px',
          borderBottom: `2px solid var(--mantine-color-${skill.color}-3)`,
        }}
      >
        <Group justify="space-between" align="flex-start">
          <ThemeIcon size="lg" radius="md" color={skill.color} variant="light">
            <IconPencil size={20} />
          </ThemeIcon>
          <Group gap={6}>
            <Badge size="sm" color={cfg.color} variant="filled">
              {cfg.label}
            </Badge>
            {task.topic && (
              <Badge size="sm" color="gray" variant="light">
                {task.topic}
              </Badge>
            )}
          </Group>
        </Group>
        <Text fw={700} size="md" mt={8} lineClamp={2} style={{ minHeight: 44 }}>
          {task.title}
        </Text>
      </Card.Section>

      <Stack p="md" gap="sm">
        <Text size="sm" c="dimmed" lineClamp={2} style={{ minHeight: 40 }}>
          {task.promptText}
        </Text>

        <Group gap="lg">
          <Group gap={4}>
            <IconClock size={14} color="var(--mantine-color-gray-6)" />
            <Text size="xs" c="dimmed">
              {task.timeLimitMinutes} phút
            </Text>
          </Group>
          <Group gap={4}>
            <IconPencil size={14} color="var(--mantine-color-gray-6)" />
            <Text size="xs" c="dimmed">
              Tối thiểu {task.minWords} từ
            </Text>
          </Group>
        </Group>

        <Button
          variant="filled"
          color={skill.color}
          size="sm"
          fullWidth
          onClick={onClick}
          leftSection={<IconListCheck size={16} />}
        >
          Làm bài
        </Button>
      </Stack>
    </Card>
  )
}

// ─── Speaking Test Card ─────────────────────────────────────────────────────

function SpeakingTestCard({
  test,
  onClick,
}: {
  test: IeltsSpeakingTest
  onClick: () => void
}) {
  const skill = skillConfig.speaking

  return (
    <Card
      withBorder
      radius="md"
      shadow="xs"
      p={0}
      style={{ overflow: 'hidden' }}
    >
      <Card.Section
        style={{
          background: `var(--mantine-color-${skill.color}-1)`,
          padding: '16px',
          borderBottom: `2px solid var(--mantine-color-${skill.color}-3)`,
        }}
      >
        <Group justify="space-between" align="flex-start">
          <ThemeIcon size="lg" radius="md" color={skill.color} variant="light">
            <IconMicrophone size={20} />
          </ThemeIcon>
          <Group gap={6}>
            <Badge size="sm" color={skill.color} variant="filled">
              Speaking
            </Badge>
            {test.topic && (
              <Badge size="sm" color="gray" variant="light">
                {test.topic}
              </Badge>
            )}
          </Group>
        </Group>
        <Text fw={700} size="md" mt={8} lineClamp={2} style={{ minHeight: 44 }}>
          {test.title}
        </Text>
      </Card.Section>

      <Stack p="md" gap="sm">
        <Text size="sm" c="dimmed" lineClamp={2} style={{ minHeight: 40 }}>
          {test.description}
        </Text>

        <Group gap="lg">
          <Group gap={4}>
            <IconListCheck size={14} color="var(--mantine-color-gray-6)" />
            <Text size="xs" c="dimmed">
              {test.questionCount} câu hỏi
            </Text>
          </Group>
          <Group gap={4}>
            <IconMicrophone size={14} color="var(--mantine-color-gray-6)" />
            <Text size="xs" c="dimmed">
              3 phần
            </Text>
          </Group>
        </Group>

        <Button
          variant="filled"
          color={skill.color}
          size="sm"
          fullWidth
          onClick={onClick}
          leftSection={<IconListCheck size={16} />}
        >
          Làm bài
        </Button>
      </Stack>
    </Card>
  )
}

// ─── History (unified across skills) ─────────────────────────────────────────

/** A single history entry normalised across Reading/Listening, Writing & Speaking. */
interface UnifiedHistoryItem {
  key: string
  title: string
  skillLabel: string
  skillColor: string
  date: string
  scoreText: string
  scoreColor: string
  sortTs: number
}

const pctColor = (s: number) => (s >= 80 ? 'green' : s >= 60 ? 'yellow' : 'red')
const bandColor = (b: number) => (b >= 7 ? 'green' : b >= 5.5 ? 'yellow' : 'red')

function HistoryRow({ item }: { item: UnifiedHistoryItem }) {
  return (
    <Group
      justify="space-between"
      py={8}
      style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}
    >
      <div>
        <Group gap={6} mb={2}>
          <Badge size="xs" color={item.skillColor} variant="light">
            {item.skillLabel}
          </Badge>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
        </Group>
        <Text size="xs" c="dimmed">
          {new Date(item.date).toLocaleDateString('vi-VN')}
        </Text>
      </div>
      <Badge color={item.scoreColor} variant="filled" size="md">
        {item.scoreText}
      </Badge>
    </Group>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function IeltsPracticePage() {
  const navigate = useNavigate()
  const [activeSkill, setActiveSkill] = useState('all')
  const [loading, setLoading] = useState(true)

  // Reading/Listening data
  const [tests, setTests] = useState<IeltsTest[]>([])
  const [history, setHistory] = useState<IeltsHistoryItem[]>([])

  // Writing data
  const [writingTasks, setWritingTasks] = useState<IeltsWritingTask[]>([])
  const [writingHistory, setWritingHistory] = useState<IeltsWritingSubmission[]>([])

  // Speaking data
  const [speakingTests, setSpeakingTests] = useState<IeltsSpeakingTest[]>([])
  const [speakingHistory, setSpeakingHistory] = useState<IeltsSpeakingHistory[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      if (activeSkill === 'writing') {
        const [tasksRes, whRes] = await Promise.all([
          IeltsWritingService.getTasks(),
          IeltsWritingService.getHistory(),
        ])
        if (tasksRes?.status === 200 && tasksRes.data) setWritingTasks(tasksRes.data)
        if (whRes?.status === 200 && whRes.data) setWritingHistory(whRes.data)
      } else if (activeSkill === 'speaking') {
        const [testsRes, shRes] = await Promise.all([
          IeltsSpeakingService.getTests(),
          IeltsSpeakingService.getHistory(),
        ])
        if (testsRes?.status === 200 && testsRes.data) setSpeakingTests(testsRes.data)
        if (shRes?.status === 200 && shRes.data) setSpeakingHistory(shRes.data)
      } else if (activeSkill === 'all') {
        // Tab "Tất cả": gộp đủ 4 kỹ năng + lịch sử của cả ba loại.
        const [testsRes, historyRes, writingRes, speakingRes, whRes, shRes] = await Promise.all([
          IeltsService.getTests(),
          IeltsService.getHistory(),
          IeltsWritingService.getTasks(),
          IeltsSpeakingService.getTests(),
          IeltsWritingService.getHistory(),
          IeltsSpeakingService.getHistory(),
        ])
        if (testsRes?.status === 200 && testsRes.data) setTests(testsRes.data)
        if (historyRes?.status === 200 && historyRes.data) setHistory(historyRes.data)
        if (writingRes?.status === 200 && writingRes.data) setWritingTasks(writingRes.data)
        if (speakingRes?.status === 200 && speakingRes.data) setSpeakingTests(speakingRes.data)
        if (whRes?.status === 200 && whRes.data) setWritingHistory(whRes.data)
        if (shRes?.status === 200 && shRes.data) setSpeakingHistory(shRes.data)
      } else {
        const [testsRes, historyRes] = await Promise.all([
          IeltsService.getTests({ skill: activeSkill }),
          IeltsService.getHistory(),
        ])
        if (testsRes?.status === 200 && testsRes.data) setTests(testsRes.data)
        if (historyRes?.status === 200 && historyRes.data) setHistory(historyRes.data)
      }

      setLoading(false)
    }
    fetchData()
  }, [activeSkill])

  // Stats depend on active tab
  const isAll = activeSkill === 'all'
  const isWriting = activeSkill === 'writing'
  const isSpeaking = activeSkill === 'speaking'
  // Reading/Listening-based stats (done count, avg score, history) also apply to "Tất cả".
  const isReadingListening = !isWriting && !isSpeaking

  const totalCount = isWriting
    ? writingTasks.length
    : isSpeaking
      ? speakingTests.length
      : isAll
        ? tests.length + writingTasks.length + speakingTests.length
        : tests.length

  const doneCount = isReadingListening
    ? tests.filter((t) => t.completedCount > 0).length
    : 0

  const avgScore = isReadingListening && history.length > 0
    ? `${Math.round(history.reduce((sum, h) => sum + h.score, 0) / history.length)}%`
    : '—'

  // Unified, date-sorted history matching the active tab (10 most recent).
  const unifiedHistory = useMemo<UnifiedHistoryItem[]>(() => {
    const items: UnifiedHistoryItem[] = []
    if (isAll || isReadingListening) {
      history.forEach((h, i) => {
        const sk = skillConfig[h.skill] ?? { label: h.skill ?? 'Unknown', color: 'gray' }
        items.push({
          key: `rl-${i}`,
          title: h.title,
          skillLabel: sk.label,
          skillColor: sk.color,
          date: h.completedAt,
          scoreText: `${h.score}%`,
          scoreColor: pctColor(h.score),
          sortTs: new Date(h.completedAt).getTime(),
        })
      })
    }
    if (isAll || isWriting) {
      writingHistory.forEach((w) => {
        items.push({
          key: `w-${w.id}`,
          title: w.taskTitle,
          skillLabel: 'Writing',
          skillColor: 'pink',
          date: w.createdAt,
          scoreText: `Band ${w.overallBand}`,
          scoreColor: bandColor(w.overallBand),
          sortTs: new Date(w.createdAt).getTime(),
        })
      })
    }
    if (isAll || isSpeaking) {
      speakingHistory.forEach((s) => {
        items.push({
          key: `s-${s.sessionId}`,
          title: s.testTitle,
          skillLabel: 'Speaking',
          skillColor: 'grape',
          date: s.createdAt,
          scoreText: s.overallBand != null ? `Band ${s.overallBand}` : '—',
          scoreColor: s.overallBand != null ? bandColor(s.overallBand) : 'gray',
          sortTs: new Date(s.createdAt).getTime(),
        })
      })
    }
    return items.sort((a, b) => b.sortTs - a.sortTs).slice(0, 10)
  }, [isAll, isReadingListening, isWriting, isSpeaking, history, writingHistory, speakingHistory])

  return (
    <Stack gap="xl" p="md">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div>
        <Title order={2}>Luyện đề IELTS</Title>
        <Text c="dimmed" size="sm" mt={4}>
          Luyện tập Reading, Listening, Writing và Speaking theo chuẩn đề thi IELTS
        </Text>
      </div>

      {/* ── Stats row ──────────────────────────────────────────────────── */}
      <SimpleGrid cols={{ base: 3 }} spacing="sm">
        {[
          {
            icon: <IconListCheck size={18} />,
            label: 'Bài có sẵn',
            value: totalCount,
            color: 'blue',
          },
          {
            icon: <IconCheck size={18} />,
            label: 'Đã hoàn thành',
            value: doneCount,
            color: 'green',
          },
          {
            icon: <IconTrophy size={18} />,
            label: 'Điểm TB',
            value: avgScore,
            color: 'orange',
          },
        ].map((s) => (
          <Card key={s.label} withBorder radius="md" p="md">
            <Group gap="sm">
              <ThemeIcon size="lg" radius="md" color={s.color} variant="light">
                {s.icon}
              </ThemeIcon>
              <div>
                <Text size="xl" fw={700} lh={1}>
                  {s.value}
                </Text>
                <Text size="xs" c="dimmed">
                  {s.label}
                </Text>
              </div>
            </Group>
          </Card>
        ))}
      </SimpleGrid>

      {/* ── Skill filter ─────────────────────────────────────────────── */}
      <Tabs
        value={activeSkill}
        onChange={(v) => setActiveSkill(v ?? 'all')}
        variant="pills"
      >
        <Tabs.List>
          {SKILL_TABS.map((t) => (
            <Tabs.Tab key={t.value} value={t.value}>
              {t.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>

      {/* ── Content grid ───────────────────────────────────────────────── */}
      {loading ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} height={280} radius="md" />
          ))}
        </SimpleGrid>
      ) : isWriting ? (
        writingTasks.length === 0 ? (
          <Stack align="center" py="xl">
            <Text size="3rem">📭</Text>
            <Text c="dimmed">Chưa có đề Writing nào</Text>
          </Stack>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
            {writingTasks.map((task) => (
              <WritingTaskCard
                key={task.id}
                task={task}
                onClick={() => navigate(`/ielts-writing/exam/${task.id}`)}
              />
            ))}
          </SimpleGrid>
        )
      ) : isSpeaking ? (
        speakingTests.length === 0 ? (
          <Stack align="center" py="xl">
            <Text size="3rem">📭</Text>
            <Text c="dimmed">Chưa có đề Speaking nào</Text>
          </Stack>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
            {speakingTests.map((test) => (
              <SpeakingTestCard
                key={test.id}
                test={test}
                onClick={() => navigate(`/ielts-speaking/exam/${test.id}`)}
              />
            ))}
          </SimpleGrid>
        )
      ) : isAll ? (
        tests.length + writingTasks.length + speakingTests.length === 0 ? (
          <Stack align="center" py="xl">
            <Text size="3rem">📭</Text>
            <Text c="dimmed">Chưa có bài nào</Text>
          </Stack>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
            {tests.map((test) => (
              <IeltsTestCard
                key={`r-${test.id}`}
                test={test}
                onClick={() => navigate(`/ielts-practice/${test.id}`)}
              />
            ))}
            {writingTasks.map((task) => (
              <WritingTaskCard
                key={`w-${task.id}`}
                task={task}
                onClick={() => navigate(`/ielts-writing/exam/${task.id}`)}
              />
            ))}
            {speakingTests.map((test) => (
              <SpeakingTestCard
                key={`s-${test.id}`}
                test={test}
                onClick={() => navigate(`/ielts-speaking/exam/${test.id}`)}
              />
            ))}
          </SimpleGrid>
        )
      ) : tests.length === 0 ? (
        <Stack align="center" py="xl">
          <Text size="3rem">📭</Text>
          <Text c="dimmed">Không có bài thi nào cho kỹ năng này</Text>
        </Stack>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {tests.map((test) => (
            <IeltsTestCard
              key={test.id}
              test={test}
              onClick={() => navigate(`/ielts-practice/${test.id}`)}
            />
          ))}
        </SimpleGrid>
      )}

      {/* ── History (theo tab đang chọn) ────────────────────────────────── */}
      {unifiedHistory.length > 0 && (
        <Stack gap="sm">
          <Title order={4}>Lịch sử làm bài gần đây</Title>
          <Card withBorder radius="md" p="md">
            {unifiedHistory.map((item) => (
              <HistoryRow key={item.key} item={item} />
            ))}
          </Card>
        </Stack>
      )}
    </Stack>
  )
}
