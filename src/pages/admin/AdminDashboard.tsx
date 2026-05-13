import { useEffect, useState } from 'react'
import {
  Box,
  Card,
  Group,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Button,
  RingProgress,
  Paper,
} from '@mantine/core'
import {
  IconBook,
  IconBrain,
  IconChartBar,
  IconHeadphones,
  IconListCheck,
  IconMessageChatbot,
  IconUsers,
  IconUserCheck,
  IconUserOff,
  IconUserShield,
} from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import UserService from '@/services/user/user.service'
import { VocabularyService } from '@/services/vocabulary/vocabulary.service'
import { GrammarService } from '@/services/grammar/grammar.service'
import { ListeningService } from '@/services/listening/listening.service'

// ─── Types ───────────────────────────────────────────────────────────────────

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  totalVocabTopics: number
  totalGrammarTopics: number
  totalListeningTopics: number
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  color,
  loading,
}: {
  icon: React.ReactNode
  label: string
  value: number | string
  color: string
  loading: boolean
}) {
  return (
    <Card withBorder radius="md" p="md">
      <Group gap="sm">
        <ThemeIcon size="lg" radius="md" color={color} variant="light">
          {icon}
        </ThemeIcon>
        <div>
          {loading ? (
            <Skeleton width={40} height={24} />
          ) : (
            <Text size="xl" fw={700} lh={1}>
              {value}
            </Text>
          )}
          <Text size="xs" c="dimmed">
            {label}
          </Text>
        </div>
      </Group>
    </Card>
  )
}

// ─── Quick Link Card ─────────────────────────────────────────────────────────

function QuickLinkCard({
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
      style={{ cursor: 'pointer' }}
      onClick={() => navigate(path)}
    >
      <Group>
        <ThemeIcon size="xl" radius="md" color={color} variant="light">
          {icon}
        </ThemeIcon>
        <div style={{ flex: 1 }}>
          <Text fw={600} size="sm">
            {title}
          </Text>
          <Text size="xs" c="dimmed">
            {description}
          </Text>
        </div>
        <Button variant="light" color={color} size="xs">
          Truy cập
        </Button>
      </Group>
    </Card>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalVocabTopics: 0,
    totalGrammarTopics: 0,
    totalListeningTopics: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        const [usersRes, vocabRes, grammarRes, listeningRes] = await Promise.allSettled([
          UserService.getAllUsers({ page: 0, size: 1 }),
          VocabularyService.getTopicsForManage({ page: 0, size: 1 }),
          GrammarService.getTopicsForManage({ page: 0, size: 1 }),
          ListeningService.getTopicsForManage({ page: 0, size: 1 }),
        ])

        setStats({
          totalUsers: usersRes.status === 'fulfilled' ? usersRes.value.data.totalItems : 0,
          activeUsers: 0, // Will show from user list
          inactiveUsers: 0,
          totalVocabTopics: vocabRes.status === 'fulfilled' ? vocabRes.value.data.totalItems : 0,
          totalGrammarTopics: grammarRes.status === 'fulfilled' ? grammarRes.value.data.totalItems : 0,
          totalListeningTopics: listeningRes.status === 'fulfilled' ? listeningRes.value.data.totalItems : 0,
        })
      } catch {
        // Silent fail — stats will show 0
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const totalContent = stats.totalVocabTopics + stats.totalGrammarTopics + stats.totalListeningTopics

  return (
    <Box p="lg">
      {/* Header */}
      <Stack gap="xs" mb="xl">
        <Title order={2}>Bảng điều khiển Admin</Title>
        <Text c="dimmed" size="sm">
          Tổng quan hệ thống học tiếng Anh — quản lý người dùng, nội dung và theo dõi hoạt động.
        </Text>
      </Stack>

      {/* User Stats */}
      <Text fw={600} size="sm" c="dimmed" mb="xs">
        NGƯỜI DÙNG
      </Text>
      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} mb="xl">
        <StatCard
          icon={<IconUsers size={20} />}
          label="Tổng người dùng"
          value={stats.totalUsers}
          color="blue"
          loading={loading}
        />
        <StatCard
          icon={<IconUserCheck size={20} />}
          label="Đang hoạt động"
          value={stats.activeUsers || '—'}
          color="green"
          loading={loading}
        />
        <StatCard
          icon={<IconUserOff size={20} />}
          label="Bị vô hiệu hóa"
          value={stats.inactiveUsers || '—'}
          color="red"
          loading={loading}
        />
        <StatCard
          icon={<IconUserShield size={20} />}
          label="Tổng nội dung"
          value={totalContent}
          color="violet"
          loading={loading}
        />
      </SimpleGrid>

      {/* Content Stats */}
      <Text fw={600} size="sm" c="dimmed" mb="xs">
        NỘI DUNG HỌC TẬP
      </Text>
      <SimpleGrid cols={{ base: 1, xs: 3 }} mb="xl">
        <StatCard
          icon={<IconBook size={20} />}
          label="Chủ đề Từ vựng"
          value={stats.totalVocabTopics}
          color="teal"
          loading={loading}
        />
        <StatCard
          icon={<IconBrain size={20} />}
          label="Chủ đề Ngữ pháp"
          value={stats.totalGrammarTopics}
          color="indigo"
          loading={loading}
        />
        <StatCard
          icon={<IconHeadphones size={20} />}
          label="Chủ đề Luyện nghe"
          value={stats.totalListeningTopics}
          color="cyan"
          loading={loading}
        />
      </SimpleGrid>

      {/* Content Distribution Ring */}
      {!loading && totalContent > 0 && (
        <Paper withBorder radius="md" p="lg" mb="xl">
          <Group justify="space-between" align="flex-start">
            <div>
              <Text fw={600} mb="xs">Phân bố nội dung</Text>
              <Stack gap={4}>
                <Group gap="xs">
                  <Box w={12} h={12} bg="teal" style={{ borderRadius: 2 }} />
                  <Text size="sm">Từ vựng: {stats.totalVocabTopics} chủ đề</Text>
                </Group>
                <Group gap="xs">
                  <Box w={12} h={12} bg="indigo" style={{ borderRadius: 2 }} />
                  <Text size="sm">Ngữ pháp: {stats.totalGrammarTopics} chủ đề</Text>
                </Group>
                <Group gap="xs">
                  <Box w={12} h={12} bg="cyan" style={{ borderRadius: 2 }} />
                  <Text size="sm">Luyện nghe: {stats.totalListeningTopics} chủ đề</Text>
                </Group>
              </Stack>
            </div>
            <RingProgress
              size={140}
              thickness={16}
              roundCaps
              sections={[
                {
                  value: totalContent > 0 ? (stats.totalVocabTopics / totalContent) * 100 : 0,
                  color: 'teal',
                },
                {
                  value: totalContent > 0 ? (stats.totalGrammarTopics / totalContent) * 100 : 0,
                  color: 'indigo',
                },
                {
                  value: totalContent > 0 ? (stats.totalListeningTopics / totalContent) * 100 : 0,
                  color: 'cyan',
                },
              ]}
              label={
                <Text ta="center" fw={700} size="lg">
                  {totalContent}
                </Text>
              }
            />
          </Group>
        </Paper>
      )}

      {/* Quick Links */}
      <Text fw={600} size="sm" c="dimmed" mb="xs">
        TRUY CẬP NHANH
      </Text>
      <SimpleGrid cols={{ base: 1, md: 2 }} mb="lg">
        <QuickLinkCard
          icon={<IconUsers size={22} />}
          title="Quản lý người dùng"
          description="Xem, phân quyền và quản lý tài khoản"
          color="blue"
          path="/admin/users"
        />
        <QuickLinkCard
          icon={<IconChartBar size={22} />}
          title="Quản lý nội dung"
          description="Tổng hợp nội dung học tập trên hệ thống"
          color="violet"
          path="/admin/content"
        />
        <QuickLinkCard
          icon={<IconBook size={22} />}
          title="QL Từ vựng"
          description="Quản lý chủ đề và từ vựng"
          color="teal"
          path="/teacher/vocabulary"
        />
        <QuickLinkCard
          icon={<IconBrain size={22} />}
          title="QL Ngữ pháp"
          description="Quản lý chủ đề và bài học ngữ pháp"
          color="indigo"
          path="/teacher/grammar"
        />
        <QuickLinkCard
          icon={<IconHeadphones size={22} />}
          title="QL Luyện nghe"
          description="Quản lý chủ đề và bài nghe"
          color="cyan"
          path="/teacher/listening"
        />
        <QuickLinkCard
          icon={<IconMessageChatbot size={22} />}
          title="AI Chatbot"
          description="Cấu hình AI chatbot học tiếng Anh"
          color="grape"
          path="/ai-chat"
        />
      </SimpleGrid>
    </Box>
  )
}

export default AdminDashboard
