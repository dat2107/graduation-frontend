import { useEffect, useState } from 'react'
import {
  Badge,
  Button,
  Card,
  Group,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import {
  IconCheck,
  IconFlame,
  IconListCheck,
  IconMicrophone,
  IconTrophy,
} from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { IeltsSpeakingService } from '@/services/ieltsSpeaking/ieltsSpeaking.service'
import type { IeltsSpeakingTest, IeltsSpeakingHistory } from '@/@types/ieltsSpeaking'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SKILL_COLOR = 'violet'

const getBandColor = (band: number) => {
  if (band >= 7.0) return 'green'
  if (band >= 5.5) return 'yellow'
  return 'red'
}

// ─── Speaking Test Card ─────────────────────────────────────────────────────

function SpeakingTestCard({
  test,
  onClick,
}: {
  test: IeltsSpeakingTest
  onClick: () => void
}) {
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
            <IconMicrophone size={20} />
          </ThemeIcon>
          <Group gap={6}>
            <Badge size="sm" color={SKILL_COLOR} variant="filled">
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

function HistoryRow({ item }: { item: IeltsSpeakingHistory }) {
  const date = new Date(item.createdAt).toLocaleDateString('vi-VN')
  const statusColor = item.status === 'COMPLETED' ? 'green' : 'yellow'

  return (
    <Group
      justify="space-between"
      py={8}
      style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}
    >
      <div>
        <Group gap={6} mb={2}>
          <Badge size="xs" color={SKILL_COLOR} variant="light">
            Speaking
          </Badge>
          <Text size="sm" fw={500}>
            {item.testTitle}
          </Text>
        </Group>
        <Text size="xs" c="dimmed">
          {date}
        </Text>
      </div>
      {item.overallBand !== null ? (
        <Badge color={getBandColor(item.overallBand)} variant="filled" size="md">
          Band {item.overallBand}
        </Badge>
      ) : (
        <Badge color={statusColor} variant="light" size="md">
          {item.status === 'COMPLETED' ? 'Hoàn thành' : 'Đang làm'}
        </Badge>
      )}
    </Group>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────────────

const IeltsSpeakingTestList = () => {
  const navigate = useNavigate()
  const [tests, setTests] = useState<IeltsSpeakingTest[]>([])
  const [history, setHistory] = useState<IeltsSpeakingHistory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      const [testsRes, historyRes] = await Promise.all([
        IeltsSpeakingService.getTests(),
        IeltsSpeakingService.getHistory(),
      ])
      if (testsRes?.status === 200 && testsRes.data) setTests(testsRes.data)
      if (historyRes?.status === 200 && historyRes.data) setHistory(historyRes.data)
      setLoading(false)
    }
    fetch()
  }, [])

  const completedCount = history.filter((h) => h.status === 'COMPLETED').length
  const completedWithBand = history.filter((h) => h.overallBand !== null)
  const avgBand =
    completedWithBand.length > 0
      ? (completedWithBand.reduce((sum, h) => sum + (h.overallBand ?? 0), 0) / completedWithBand.length).toFixed(1)
      : '—'

  return (
    <Stack gap="xl" p="md">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div>
        <Title order={2}>IELTS Speaking Practice</Title>
        <Text c="dimmed" size="sm" mt={4}>
          Luyện thi IELTS Speaking 3 phần với AI chấm điểm theo chuẩn IELTS
        </Text>
      </div>

      {/* ── Stats row ──────────────────────────────────────────────────── */}
      <SimpleGrid cols={{ base: 3 }} spacing="sm">
        {[
          {
            icon: <IconListCheck size={18} />,
            label: 'Bài có sẵn',
            value: tests.length,
            color: 'blue',
          },
          {
            icon: <IconCheck size={18} />,
            label: 'Đã hoàn thành',
            value: completedCount,
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

      {/* ── Test grid ──────────────────────────────────────────────────── */}
      {loading ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} height={280} radius="md" />
          ))}
        </SimpleGrid>
      ) : tests.length === 0 ? (
        <Stack align="center" py="xl">
          <Text size="3rem">📭</Text>
          <Text c="dimmed">Chưa có bài thi nào</Text>
        </Stack>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {tests.map((test) => (
            <SpeakingTestCard
              key={test.id}
              test={test}
              onClick={() => navigate(`/ielts-speaking/exam/${test.id}`)}
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
              <HistoryRow key={item.sessionId} item={item} />
            ))}
          </Card>
        </Stack>
      )}
    </Stack>
  )
}

export default IeltsSpeakingTestList
