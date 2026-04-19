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
import { IconBook, IconFlame, IconStar, IconTrophy } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { VocabularyService } from '@/services/vocabulary/vocabulary.service'
import type { VocabProgress, VocabSet, WordLevel } from '@/@types/vocabulary'

// ─── Level color mapping ──────────────────────────────────────────────────────
const levelColor: Record<WordLevel, string> = {
  A1: 'green',
  A2: 'teal',
  B1: 'blue',
  B2: 'violet',
  C1: 'orange',
  C2: 'red',
}

const LEVEL_TABS: Array<{ value: string; label: string }> = [
  { value: 'all', label: 'Tất cả' },
  { value: 'A1', label: 'A1' },
  { value: 'A2', label: 'A2' },
  { value: 'B1', label: 'B1' },
  { value: 'B2', label: 'B2' },
  { value: 'C1', label: 'C1+' },
]

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: number | string
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

// ─── Vocab Set Card ───────────────────────────────────────────────────────────
function VocabSetCard({ set, onClick }: { set: VocabSet; onClick: () => void }) {
  const progressPct = set.wordCount > 0 ? Math.round((set.learnedCount / set.wordCount) * 100) : 0
  const masteredPct = set.wordCount > 0 ? Math.round((set.masteredCount / set.wordCount) * 100) : 0
  const color = levelColor[set.level]
  const isNew = set.learnedCount === 0

  return (
    <Card withBorder radius="md" shadow="xs" p={0} style={{ overflow: 'hidden' }}>
      {/* Colored header strip */}
      <Card.Section
        style={{
          background: `var(--mantine-color-${color}-1)`,
          padding: '16px',
          borderBottom: `2px solid var(--mantine-color-${color}-3)`,
        }}
      >
        <Group justify="space-between" align="flex-start">
          <Text size="2.2rem" lh={1}>
            {set.emoji}
          </Text>
          <Badge color={color} variant="filled" size="sm">
            {set.level}
          </Badge>
        </Group>
        <Text fw={700} size="md" mt={8} lineClamp={1}>
          {set.name}
        </Text>
        <Text size="xs" c="dimmed">
          {set.topic}
        </Text>
      </Card.Section>

      <Stack p="md" gap="sm">
        <Text size="sm" c="dimmed" lineClamp={2} style={{ minHeight: 40 }}>
          {set.description}
        </Text>

        <div>
          <Group justify="space-between" mb={4}>
            <Text size="xs" c="dimmed">
              Đã học
            </Text>
            <Text size="xs" fw={600} c={color}>
              {set.learnedCount}/{set.wordCount} từ
            </Text>
          </Group>
          <Progress.Root size="sm" radius="xl">
            <Progress.Section value={masteredPct} color="green" />
            <Progress.Section value={progressPct - masteredPct} color={color} />
          </Progress.Root>
          <Group justify="space-between" mt={4}>
            <Text size="xs" c="dimmed">
              <span style={{ color: 'var(--mantine-color-green-6)' }}>■</span> Thuộc:{' '}
              {set.masteredCount}
            </Text>
            <Text size="xs" c="dimmed">
              {progressPct}%
            </Text>
          </Group>
        </div>

        <Button
          variant={isNew ? 'filled' : 'light'}
          color={color}
          size="sm"
          fullWidth
          onClick={onClick}
          leftSection={<IconBook size={16} />}
        >
          {isNew ? 'Bắt đầu học' : 'Tiếp tục học'}
        </Button>
      </Stack>
    </Card>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function VocabularyPage() {
  const navigate = useNavigate()
  const [sets, setSets] = useState<VocabSet[]>([])
  const [progress, setProgress] = useState<VocabProgress | null>(null)
  const [activeLevel, setActiveLevel] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      const [setsRes, progressRes] = await Promise.all([
        VocabularyService.getSets(activeLevel === 'all' ? undefined : activeLevel),
        VocabularyService.getUserProgress(),
      ])
      if (setsRes?.status === 200 && setsRes.data) setSets(setsRes.data)
      if (progressRes?.status === 200 && progressRes.data) setProgress(progressRes.data)
      setLoading(false)
    }
    fetch()
  }, [activeLevel])

  return (
    <Stack gap="xl" p="md">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div>
        <Title order={2}>📚 Từ vựng</Title>
        <Text c="dimmed" size="sm" mt={4}>
          Học từ vựng theo chủ đề với flashcard và hệ thống ôn tập thông minh
        </Text>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────────── */}
      {progress ? (
        <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="sm">
          <StatCard
            icon={<IconBook size={18} />}
            label="Đã học"
            value={progress.learnedWords}
            color="blue"
          />
          <StatCard
            icon={<IconStar size={18} />}
            label="Đã thuộc"
            value={progress.masteredWords}
            color="green"
          />
          <StatCard
            icon={<IconFlame size={18} />}
            label="Ngày liên tiếp"
            value={`${progress.currentStreak} ngày`}
            color="orange"
          />
          <StatCard
            icon={<IconTrophy size={18} />}
            label="Cần ôn hôm nay"
            value={progress.reviewDueToday}
            color="violet"
          />
        </SimpleGrid>
      ) : (
        <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="sm">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height={80} radius="md" />
          ))}
        </SimpleGrid>
      )}

      {/* ── Level Filter ───────────────────────────────────────────────── */}
      <Tabs
        value={activeLevel}
        onChange={(v) => setActiveLevel(v ?? 'all')}
        variant="pills"
      >
        <Tabs.List>
          {LEVEL_TABS.map((tab) => (
            <Tabs.Tab key={tab.value} value={tab.value}>
              {tab.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>

      {/* ── Sets Grid ──────────────────────────────────────────────────── */}
      {loading ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} height={280} radius="md" />
          ))}
        </SimpleGrid>
      ) : sets.length === 0 ? (
        <Stack align="center" py="xl">
          <Text size="3rem">📭</Text>
          <Text c="dimmed">Không có bộ từ vựng nào cho cấp độ này</Text>
        </Stack>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {sets.map((set) => (
            <VocabSetCard
              key={set.id}
              set={set}
              onClick={() => navigate(`/vocabulary/${set.id}`)}
            />
          ))}
        </SimpleGrid>
      )}
    </Stack>
  )
}
