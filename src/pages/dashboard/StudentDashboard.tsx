import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  Group,
  Paper,
  Progress,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import {
  IconBook,
  IconBrain,
  IconFlame,
  IconHeadphones,
  IconListCheck,
  IconMessageChatbot,
  IconPencilCheck,
  IconPlayerPlay,
  IconTargetArrow,
  IconTrophy,
} from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/store'
import { VocabularyService } from '@/services/vocabulary/vocabulary.service'
import { GrammarService } from '@/services/grammar/grammar.service'
import { ListeningService } from '@/services/listening/listening.service'
import type { VocabProgress } from '@/@types/vocabulary'
import type { GrammarProgress } from '@/@types/grammar'
import type { ListeningProgress } from '@/@types/listening'

// ─── Types ───────────────────────────────────────────────────────────────────

interface DashboardData {
  vocab: VocabProgress | null
  grammar: GrammarProgress | null
  listening: ListeningProgress | null
}

// ─── Quick Access Card ───────────────────────────────────────────────────────

function QuickAccessCard({
  icon,
  title,
  description,
  color,
  path,
}: {
  icon: React.ReactNode
  title: string
  description: string
  color: string
  path: string
}) {
  const navigate = useNavigate()
  return (
    <Card
      withBorder
      radius="md"
      p="lg"
      style={{ cursor: 'pointer', transition: 'transform 0.15s' }}
      onClick={() => navigate(path)}
    >
      <Stack gap="sm">
        <ThemeIcon size="xl" radius="md" color={color} variant="light">
          {icon}
        </ThemeIcon>
        <div>
          <Text fw={600} size="sm">{title}</Text>
          <Text size="xs" c="dimmed">{description}</Text>
        </div>
        <Button variant="light" color={color} size="xs" fullWidth leftSection={<IconPlayerPlay size={14} />}>
          Bắt đầu
        </Button>
      </Stack>
    </Card>
  )
}

// ─── Progress Card ───────────────────────────────────────────────────────────

function ProgressCard({
  icon,
  title,
  completed,
  total,
  color,
  loading,
}: {
  icon: React.ReactNode
  title: string
  completed: number
  total: number
  color: string
  loading: boolean
}) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0
  return (
    <Card withBorder radius="md" p="md">
      <Group justify="space-between" mb="xs">
        <Group gap="xs">
          <ThemeIcon size="sm" radius="sm" color={color} variant="light">
            {icon}
          </ThemeIcon>
          <Text size="sm" fw={500}>{title}</Text>
        </Group>
        {loading ? (
          <Skeleton width={40} height={16} />
        ) : (
          <Text size="xs" c="dimmed">{completed}/{total}</Text>
        )}
      </Group>
      {loading ? (
        <Skeleton height={6} radius="xl" />
      ) : (
        <Progress value={pct} color={color} size="sm" radius="xl" />
      )}
    </Card>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

const StudentDashboard = () => {
  const userName = useAppSelector((state) => state.auth.userInfo.name)
  const [data, setData] = useState<DashboardData>({ vocab: null, grammar: null, listening: null })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      try {
        const [vocabRes, grammarRes, listeningRes] = await Promise.allSettled([
          VocabularyService.getUserProgress(),
          GrammarService.getUserProgress(),
          ListeningService.getUserProgress(),
        ])
        setData({
          vocab: vocabRes.status === 'fulfilled' && vocabRes.value.status === 200 ? vocabRes.value.data : null,
          grammar: grammarRes.status === 'fulfilled' && grammarRes.value.status === 200 ? grammarRes.value.data : null,
          listening: listeningRes.status === 'fulfilled' && listeningRes.value.status === 200 ? listeningRes.value.data : null,
        })
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Chào buổi sáng'
    if (h < 18) return 'Chào buổi chiều'
    return 'Chào buổi tối'
  })()

  return (
    <Box p="lg">
      {/* Greeting */}
      <Paper
        radius="md"
        p="xl"
        mb="xl"
        style={{
          background: 'linear-gradient(135deg, var(--mantine-color-blue-6), var(--mantine-color-cyan-5))',
          color: 'white',
        }}
      >
        <Title order={2} c="white">{greeting}, {userName || 'bạn'}!</Title>
        <Text size="sm" mt={4} style={{ opacity: 0.85 }}>
          Tiếp tục hành trình học tiếng Anh. Mỗi ngày một bước tiến!
        </Text>
      </Paper>

      {/* Stats Overview */}
      <SimpleGrid cols={{ base: 2, sm: 4 }} mb="xl">
        <Card withBorder radius="md" p="md">
          <Group gap="sm">
            <ThemeIcon size="lg" radius="md" color="teal" variant="light">
              <IconBook size={20} />
            </ThemeIcon>
            <div>
              {loading ? <Skeleton width={30} height={22} /> : (
                <Text size="xl" fw={700} lh={1}>{data.vocab?.learnedWords ?? 0}</Text>
              )}
              <Text size="xs" c="dimmed">Từ đã học</Text>
            </div>
          </Group>
        </Card>
        <Card withBorder radius="md" p="md">
          <Group gap="sm">
            <ThemeIcon size="lg" radius="md" color="indigo" variant="light">
              <IconBrain size={20} />
            </ThemeIcon>
            <div>
              {loading ? <Skeleton width={30} height={22} /> : (
                <Text size="xl" fw={700} lh={1}>{data.grammar?.completedLessons ?? 0}</Text>
              )}
              <Text size="xs" c="dimmed">Bài ngữ pháp</Text>
            </div>
          </Group>
        </Card>
        <Card withBorder radius="md" p="md">
          <Group gap="sm">
            <ThemeIcon size="lg" radius="md" color="cyan" variant="light">
              <IconHeadphones size={20} />
            </ThemeIcon>
            <div>
              {loading ? <Skeleton width={30} height={22} /> : (
                <Text size="xl" fw={700} lh={1}>{data.listening?.totalListeningMinutes ?? 0}</Text>
              )}
              <Text size="xs" c="dimmed">Phút nghe</Text>
            </div>
          </Group>
        </Card>
        <Card withBorder radius="md" p="md">
          <Group gap="sm">
            <ThemeIcon size="lg" radius="md" color="orange" variant="light">
              <IconFlame size={20} />
            </ThemeIcon>
            <div>
              {loading ? <Skeleton width={30} height={22} /> : (
                <Text size="xl" fw={700} lh={1}>{data.vocab?.currentStreak ?? 0}</Text>
              )}
              <Text size="xs" c="dimmed">Ngày streak</Text>
            </div>
          </Group>
        </Card>
      </SimpleGrid>

      {/* Progress Section */}
      <Text fw={600} size="sm" c="dimmed" mb="xs">TIẾN ĐỘ HỌC TẬP</Text>
      <SimpleGrid cols={{ base: 1, sm: 3 }} mb="xl">
        <ProgressCard
          icon={<IconBook size={14} />}
          title="Từ vựng"
          completed={data.vocab?.masteredWords ?? 0}
          total={data.vocab?.totalWords ?? 0}
          color="teal"
          loading={loading}
        />
        <ProgressCard
          icon={<IconBrain size={14} />}
          title="Ngữ pháp"
          completed={data.grammar?.completedLessons ?? 0}
          total={data.grammar?.totalLessons ?? 0}
          color="indigo"
          loading={loading}
        />
        <ProgressCard
          icon={<IconHeadphones size={14} />}
          title="Luyện nghe"
          completed={data.listening?.completedLessons ?? 0}
          total={data.listening?.totalLessons ?? 0}
          color="cyan"
          loading={loading}
        />
      </SimpleGrid>

      {/* Quick Access */}
      <Text fw={600} size="sm" c="dimmed" mb="xs">BẮT ĐẦU HỌC</Text>
      <SimpleGrid cols={{ base: 2, sm: 3, lg: 6 }}>
        <QuickAccessCard
          icon={<IconBook size={22} />}
          title="Từ vựng"
          description="Flashcard & ôn tập"
          color="teal"
          path="/vocabulary"
        />
        <QuickAccessCard
          icon={<IconBrain size={22} />}
          title="Ngữ pháp"
          description="Bài học & bài tập"
          color="indigo"
          path="/grammar"
        />
        <QuickAccessCard
          icon={<IconHeadphones size={22} />}
          title="Luyện nghe"
          description="Nghe & trả lời"
          color="cyan"
          path="/listening"
        />
        <QuickAccessCard
          icon={<IconListCheck size={22} />}
          title="Luyện đề IELTS"
          description="Thi thử IELTS"
          color="violet"
          path="/ielts-practice"
        />
        <QuickAccessCard
          icon={<IconPencilCheck size={22} />}
          title="AI Chấm bài"
          description="Chấm bài viết"
          color="pink"
          path="/writing-check"
        />
        <QuickAccessCard
          icon={<IconMessageChatbot size={22} />}
          title="AI Chatbot"
          description="Luyện hội thoại"
          color="grape"
          path="/ai-chat"
        />
      </SimpleGrid>
    </Box>
  )
}

export default StudentDashboard
