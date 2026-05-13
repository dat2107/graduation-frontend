import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  Group,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import {
  IconBook,
  IconBookUpload,
  IconBrain,
  IconExternalLink,
  IconHeadphones,
  IconHeadset,
  IconNotebook,
} from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/store'
import { VocabularyService } from '@/services/vocabulary/vocabulary.service'
import { GrammarService } from '@/services/grammar/grammar.service'
import { ListeningService } from '@/services/listening/listening.service'

// ─── Types ───────────────────────────────────────────────────────────────────

interface TeacherStats {
  vocabTopics: number
  grammarTopics: number
  listeningTopics: number
}

// ─── Manage Link Card ────────────────────────────────────────────────────────

function ManageLinkCard({
  icon,
  title,
  count,
  countLabel,
  color,
  path,
  loading,
}: {
  icon: React.ReactNode
  title: string
  count: number
  countLabel: string
  color: string
  path: string
  loading: boolean
}) {
  const navigate = useNavigate()
  return (
    <Card withBorder radius="md" p="lg">
      <Group justify="space-between" mb="md">
        <ThemeIcon size="xl" radius="md" color={color} variant="light">
          {icon}
        </ThemeIcon>
        {loading ? (
          <Skeleton width={50} height={32} />
        ) : (
          <div style={{ textAlign: 'right' }}>
            <Text size="2rem" fw={700} lh={1}>{count}</Text>
            <Text size="xs" c="dimmed">{countLabel}</Text>
          </div>
        )}
      </Group>
      <Text fw={600} size="sm" mb="sm">{title}</Text>
      <Button
        variant="light"
        color={color}
        size="sm"
        fullWidth
        rightSection={<IconExternalLink size={14} />}
        onClick={() => navigate(path)}
      >
        Quản lý
      </Button>
    </Card>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

const TeacherDashboard = () => {
  const userName = useAppSelector((state) => state.auth.userInfo.name)
  const [stats, setStats] = useState<TeacherStats>({ vocabTopics: 0, grammarTopics: 0, listeningTopics: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        const [vocabRes, grammarRes, listeningRes] = await Promise.allSettled([
          VocabularyService.getTopicsForManage({ page: 0, size: 1 }),
          GrammarService.getTopicsForManage({ page: 0, size: 1 }),
          ListeningService.getTopicsForManage({ page: 0, size: 1 }),
        ])
        setStats({
          vocabTopics: vocabRes.status === 'fulfilled' ? vocabRes.value.data.totalItems : 0,
          grammarTopics: grammarRes.status === 'fulfilled' ? grammarRes.value.data.totalItems : 0,
          listeningTopics: listeningRes.status === 'fulfilled' ? listeningRes.value.data.totalItems : 0,
        })
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Chào buổi sáng'
    if (h < 18) return 'Chào buổi chiều'
    return 'Chào buổi tối'
  })()

  const totalContent = stats.vocabTopics + stats.grammarTopics + stats.listeningTopics

  return (
    <Box p="lg">
      {/* Greeting */}
      <Paper
        radius="md"
        p="xl"
        mb="xl"
        style={{
          background: 'linear-gradient(135deg, var(--mantine-color-violet-6), var(--mantine-color-indigo-5))',
          color: 'white',
        }}
      >
        <Title order={2} c="white">{greeting}, {userName || 'thầy/cô'}!</Title>
        <Text size="sm" mt={4} style={{ opacity: 0.85 }}>
          Quản lý nội dung giảng dạy và theo dõi tiến độ học viên.
        </Text>
      </Paper>

      {/* Overview Stats */}
      <SimpleGrid cols={{ base: 1, sm: 4 }} mb="xl">
        <Card withBorder radius="md" p="md">
          <Group gap="sm">
            <ThemeIcon size="lg" radius="md" color="blue" variant="light">
              <IconBook size={20} />
            </ThemeIcon>
            <div>
              {loading ? <Skeleton width={30} height={22} /> : (
                <Text size="xl" fw={700} lh={1}>{totalContent}</Text>
              )}
              <Text size="xs" c="dimmed">Tổng chủ đề</Text>
            </div>
          </Group>
        </Card>
        <Card withBorder radius="md" p="md">
          <Group gap="sm">
            <ThemeIcon size="lg" radius="md" color="teal" variant="light">
              <IconBookUpload size={20} />
            </ThemeIcon>
            <div>
              {loading ? <Skeleton width={30} height={22} /> : (
                <Text size="xl" fw={700} lh={1}>{stats.vocabTopics}</Text>
              )}
              <Text size="xs" c="dimmed">Từ vựng</Text>
            </div>
          </Group>
        </Card>
        <Card withBorder radius="md" p="md">
          <Group gap="sm">
            <ThemeIcon size="lg" radius="md" color="indigo" variant="light">
              <IconNotebook size={20} />
            </ThemeIcon>
            <div>
              {loading ? <Skeleton width={30} height={22} /> : (
                <Text size="xl" fw={700} lh={1}>{stats.grammarTopics}</Text>
              )}
              <Text size="xs" c="dimmed">Ngữ pháp</Text>
            </div>
          </Group>
        </Card>
        <Card withBorder radius="md" p="md">
          <Group gap="sm">
            <ThemeIcon size="lg" radius="md" color="cyan" variant="light">
              <IconHeadset size={20} />
            </ThemeIcon>
            <div>
              {loading ? <Skeleton width={30} height={22} /> : (
                <Text size="xl" fw={700} lh={1}>{stats.listeningTopics}</Text>
              )}
              <Text size="xs" c="dimmed">Luyện nghe</Text>
            </div>
          </Group>
        </Card>
      </SimpleGrid>

      {/* Management Cards */}
      <Text fw={600} size="sm" c="dimmed" mb="xs">QUẢN LÝ NỘI DUNG</Text>
      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        <ManageLinkCard
          icon={<IconBookUpload size={22} />}
          title="Quản lý Từ vựng"
          count={stats.vocabTopics}
          countLabel="chủ đề"
          color="teal"
          path="/teacher/vocabulary"
          loading={loading}
        />
        <ManageLinkCard
          icon={<IconNotebook size={22} />}
          title="Quản lý Ngữ pháp"
          count={stats.grammarTopics}
          countLabel="chủ đề"
          color="indigo"
          path="/teacher/grammar"
          loading={loading}
        />
        <ManageLinkCard
          icon={<IconHeadset size={22} />}
          title="Quản lý Luyện nghe"
          count={stats.listeningTopics}
          countLabel="chủ đề"
          color="cyan"
          path="/teacher/listening"
          loading={loading}
        />
      </SimpleGrid>
    </Box>
  )
}

export default TeacherDashboard
