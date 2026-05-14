import { useEffect, useState } from 'react'
import {
  Badge,
  Button,
  Card,
  Group,
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
  IconPencil,
  IconStar,
  IconTrophy,
} from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { IeltsWritingService } from '@/services/ieltsWriting/ieltsWriting.service'
import type { IeltsWritingTask, IeltsWritingTaskType, IeltsWritingSubmission } from '@/@types/ieltsWriting'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const taskTypeConfig: Record<IeltsWritingTaskType, { label: string; color: string }> = {
  TASK_1: { label: 'Task 1', color: 'blue' },
  TASK_2: { label: 'Task 2', color: 'grape' },
}

const SKILL_COLOR = 'pink'

const getBandColor = (band: number) => {
  if (band >= 7.0) return 'green'
  if (band >= 5.5) return 'yellow'
  return 'red'
}

// ─── Writing Task Card ──────────────────────────────────────────────────────

function WritingTaskCard({
  task,
  onClick,
}: {
  task: IeltsWritingTask
  onClick: () => void
}) {
  const cfg = taskTypeConfig[task.taskType]

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
          background: `var(--mantine-color-${SKILL_COLOR}-1)`,
          padding: '16px',
          borderBottom: `2px solid var(--mantine-color-${SKILL_COLOR}-3)`,
        }}
      >
        <Group justify="space-between" align="flex-start">
          <ThemeIcon size="lg" radius="md" color={SKILL_COLOR} variant="light">
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
          color={SKILL_COLOR}
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

// ─── History Row ────────────────────────────────────────────────────────────

function HistoryRow({ item }: { item: IeltsWritingSubmission }) {
  const bandColor = getBandColor(item.overallBand)
  const date = new Date(item.createdAt).toLocaleDateString('vi-VN')
  const cfg = taskTypeConfig[item.taskType]

  return (
    <Group
      justify="space-between"
      py={8}
      style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}
    >
      <div>
        <Group gap={6} mb={2}>
          <Badge size="xs" color={cfg.color} variant="light">
            {cfg.label}
          </Badge>
          <Text size="sm" fw={500}>
            {item.taskTitle}
          </Text>
        </Group>
        <Text size="xs" c="dimmed">
          {date}
        </Text>
      </div>
      <Badge color={bandColor} variant="filled" size="md">
        Band {item.overallBand}
      </Badge>
    </Group>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────────────

const IeltsWritingPage = () => {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState<IeltsWritingTask[]>([])
  const [history, setHistory] = useState<IeltsWritingSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>('all')

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      const params = activeTab === 'all' ? undefined : { taskType: activeTab }
      const [tasksRes, historyRes] = await Promise.all([
        IeltsWritingService.getTasks(params),
        IeltsWritingService.getHistory(),
      ])
      if (tasksRes?.status === 200 && tasksRes.data) setTasks(tasksRes.data)
      if (historyRes?.status === 200 && historyRes.data) setHistory(historyRes.data)
      setLoading(false)
    }
    fetch()
  }, [activeTab])

  const doneCount = history.length
  const avgBand =
    history.length > 0
      ? (history.reduce((sum, h) => sum + h.overallBand, 0) / history.length).toFixed(1)
      : '—'

  return (
    <Stack gap="xl" p="md">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div>
        <Title order={2}>IELTS Writing Practice</Title>
        <Text c="dimmed" size="sm" mt={4}>
          Luyện viết IELTS Task 1 và Task 2 với AI chấm điểm theo chuẩn IELTS
        </Text>
      </div>

      {/* ── Stats row ──────────────────────────────────────────────────── */}
      <SimpleGrid cols={{ base: 3 }} spacing="sm">
        {[
          {
            icon: <IconListCheck size={18} />,
            label: 'Đề có sẵn',
            value: tasks.length,
            color: 'blue',
          },
          {
            icon: <IconCheck size={18} />,
            label: 'Bài đã nộp',
            value: doneCount,
            color: 'green',
          },
          {
            icon: <IconTrophy size={18} />,
            label: 'Band TB',
            value: avgBand,
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

      {/* ── Tab filter ─────────────────────────────────────────────────── */}
      <Tabs value={activeTab} onChange={(v) => setActiveTab(v ?? 'all')} variant="pills">
        <Tabs.List>
          <Tabs.Tab value="all">Tất cả</Tabs.Tab>
          <Tabs.Tab value="TASK_1">Task 1</Tabs.Tab>
          <Tabs.Tab value="TASK_2">Task 2</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      {/* ── Task grid ──────────────────────────────────────────────────── */}
      {loading ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} height={280} radius="md" />
          ))}
        </SimpleGrid>
      ) : tasks.length === 0 ? (
        <Stack align="center" py="xl">
          <Text size="3rem">📭</Text>
          <Text c="dimmed">Chưa có đề bài nào</Text>
        </Stack>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {tasks.map((task) => (
            <WritingTaskCard
              key={task.id}
              task={task}
              onClick={() => navigate(`/ielts-writing/exam/${task.id}`)}
            />
          ))}
        </SimpleGrid>
      )}

      {/* ── History ────────────────────────────────────────────────────── */}
      {history.length > 0 && (
        <Stack gap="sm">
          <Title order={4}>Lịch sử làm bài gần đây</Title>
          <Card withBorder radius="md" p="md">
            {history.slice(0, 10).map((item) => (
              <HistoryRow key={item.id} item={item} />
            ))}
          </Card>
        </Stack>
      )}
    </Stack>
  )
}

export default IeltsWritingPage
