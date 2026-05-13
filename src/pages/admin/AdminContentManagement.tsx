import { useEffect, useState } from 'react'
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Group,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
  Table,
  Tabs,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import {
  IconBook,
  IconBrain,
  IconExternalLink,
  IconHeadphones,
} from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { VocabularyService } from '@/services/vocabulary/vocabulary.service'
import { GrammarService } from '@/services/grammar/grammar.service'
import { ListeningService } from '@/services/listening/listening.service'
import type { VocabTopicManage } from '@/@types/vocabulary'
import type { GrammarTopicManage } from '@/@types/grammar'
import type { ListeningTopicManage } from '@/@types/listening'

// ─── Constants ───────────────────────────────────────────────────────────────

const LEVEL_COLORS: Record<string, string> = {
  A1: 'green', A2: 'lime', B1: 'yellow', B2: 'orange', C1: 'red', C2: 'grape',
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface ContentSummary {
  vocabTopics: VocabTopicManage[]
  vocabTotal: number
  grammarTopics: GrammarTopicManage[]
  grammarTotal: number
  listeningTopics: ListeningTopicManage[]
  listeningTotal: number
}

// ─── Component ───────────────────────────────────────────────────────────────

const AdminContentManagement = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<ContentSummary>({
    vocabTopics: [], vocabTotal: 0,
    grammarTopics: [], grammarTotal: 0,
    listeningTopics: [], listeningTotal: 0,
  })
  const [activeTab, setActiveTab] = useState<string | null>('vocabulary')

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      try {
        const [vocabRes, grammarRes, listeningRes] = await Promise.allSettled([
          VocabularyService.getTopicsForManage({ page: 0, size: 10 }),
          GrammarService.getTopicsForManage({ page: 0, size: 10 }),
          ListeningService.getTopicsForManage({ page: 0, size: 10 }),
        ])
        setData({
          vocabTopics: vocabRes.status === 'fulfilled' ? vocabRes.value.data.items : [],
          vocabTotal: vocabRes.status === 'fulfilled' ? vocabRes.value.data.totalItems : 0,
          grammarTopics: grammarRes.status === 'fulfilled' ? grammarRes.value.data.items : [],
          grammarTotal: grammarRes.status === 'fulfilled' ? grammarRes.value.data.totalItems : 0,
          listeningTopics: listeningRes.status === 'fulfilled' ? listeningRes.value.data.items : [],
          listeningTotal: listeningRes.status === 'fulfilled' ? listeningRes.value.data.totalItems : 0,
        })
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const totalContent = data.vocabTotal + data.grammarTotal + data.listeningTotal

  return (
    <Box p="lg">
      {/* Header */}
      <Stack gap="xs" mb="lg">
        <Title order={2}>Quản lý nội dung</Title>
        <Text c="dimmed" size="sm">
          Tổng hợp tất cả nội dung học tập trên hệ thống. Nhấn vào từng mục để quản lý chi tiết.
        </Text>
      </Stack>

      {/* Summary Cards */}
      <SimpleGrid cols={{ base: 1, xs: 3 }} mb="xl">
        <Card
          withBorder radius="md" p="lg"
          style={{ cursor: 'pointer' }}
          onClick={() => setActiveTab('vocabulary')}
        >
          <Group>
            <ThemeIcon size="xl" radius="md" color="teal" variant="light">
              <IconBook size={22} />
            </ThemeIcon>
            <div>
              <Text fw={700} size="xl" lh={1}>
                {loading ? <Skeleton width={30} height={24} /> : data.vocabTotal}
              </Text>
              <Text size="sm" c="dimmed">Chủ đề Từ vựng</Text>
            </div>
          </Group>
        </Card>
        <Card
          withBorder radius="md" p="lg"
          style={{ cursor: 'pointer' }}
          onClick={() => setActiveTab('grammar')}
        >
          <Group>
            <ThemeIcon size="xl" radius="md" color="indigo" variant="light">
              <IconBrain size={22} />
            </ThemeIcon>
            <div>
              <Text fw={700} size="xl" lh={1}>
                {loading ? <Skeleton width={30} height={24} /> : data.grammarTotal}
              </Text>
              <Text size="sm" c="dimmed">Chủ đề Ngữ pháp</Text>
            </div>
          </Group>
        </Card>
        <Card
          withBorder radius="md" p="lg"
          style={{ cursor: 'pointer' }}
          onClick={() => setActiveTab('listening')}
        >
          <Group>
            <ThemeIcon size="xl" radius="md" color="cyan" variant="light">
              <IconHeadphones size={22} />
            </ThemeIcon>
            <div>
              <Text fw={700} size="xl" lh={1}>
                {loading ? <Skeleton width={30} height={24} /> : data.listeningTotal}
              </Text>
              <Text size="sm" c="dimmed">Chủ đề Luyện nghe</Text>
            </div>
          </Group>
        </Card>
      </SimpleGrid>

      {/* Content Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List mb="md">
          <Tabs.Tab value="vocabulary" leftSection={<IconBook size={16} />}>
            Từ vựng ({data.vocabTotal})
          </Tabs.Tab>
          <Tabs.Tab value="grammar" leftSection={<IconBrain size={16} />}>
            Ngữ pháp ({data.grammarTotal})
          </Tabs.Tab>
          <Tabs.Tab value="listening" leftSection={<IconHeadphones size={16} />}>
            Luyện nghe ({data.listeningTotal})
          </Tabs.Tab>
        </Tabs.List>

        {/* Vocabulary Tab */}
        <Tabs.Panel value="vocabulary">
          <Group justify="space-between" mb="md">
            <Text fw={600}>Chủ đề Từ vựng gần đây</Text>
            <Button
              variant="light"
              size="xs"
              rightSection={<IconExternalLink size={14} />}
              onClick={() => navigate('/teacher/vocabulary')}
            >
              Quản lý đầy đủ
            </Button>
          </Group>
          <ContentTable
            loading={loading}
            items={data.vocabTopics.map((t) => ({
              id: t.id,
              emoji: t.emoji || '📚',
              name: t.name,
              level: t.level,
              count: t.wordCount,
              countLabel: 'từ',
              active: t.active,
              createdAt: t.createdAt,
            }))}
            onViewDetail={(id) => navigate(`/teacher/vocabulary/${id}`)}
          />
        </Tabs.Panel>

        {/* Grammar Tab */}
        <Tabs.Panel value="grammar">
          <Group justify="space-between" mb="md">
            <Text fw={600}>Chủ đề Ngữ pháp gần đây</Text>
            <Button
              variant="light"
              size="xs"
              rightSection={<IconExternalLink size={14} />}
              onClick={() => navigate('/teacher/grammar')}
            >
              Quản lý đầy đủ
            </Button>
          </Group>
          <ContentTable
            loading={loading}
            items={data.grammarTopics.map((t) => ({
              id: t.id,
              emoji: t.emoji || '📖',
              name: t.name,
              level: t.level,
              count: t.lessonCount,
              countLabel: 'bài học',
              active: t.active,
              createdAt: t.createdAt,
            }))}
            onViewDetail={(id) => navigate(`/teacher/grammar/${id}`)}
          />
        </Tabs.Panel>

        {/* Listening Tab */}
        <Tabs.Panel value="listening">
          <Group justify="space-between" mb="md">
            <Text fw={600}>Chủ đề Luyện nghe gần đây</Text>
            <Button
              variant="light"
              size="xs"
              rightSection={<IconExternalLink size={14} />}
              onClick={() => navigate('/teacher/listening')}
            >
              Quản lý đầy đủ
            </Button>
          </Group>
          <ContentTable
            loading={loading}
            items={data.listeningTopics.map((t) => ({
              id: t.id,
              emoji: t.emoji || '🎧',
              name: t.name,
              level: t.level,
              count: t.lessonCount,
              countLabel: 'bài nghe',
              active: t.active,
              createdAt: t.createdAt,
            }))}
            onViewDetail={(id) => navigate(`/teacher/listening/${id}`)}
          />
        </Tabs.Panel>
      </Tabs>
    </Box>
  )
}

// ─── Reusable Content Table ──────────────────────────────────────────────────

interface ContentTableItem {
  id: number
  emoji: string
  name: string
  level: string
  count: number
  countLabel: string
  active: boolean
  createdAt: string
}

function ContentTable({
  loading,
  items,
  onViewDetail,
}: {
  loading: boolean
  items: ContentTableItem[]
  onViewDetail: (id: number) => void
}) {
  return (
    <Card withBorder radius="md" p={0}>
      <Table.ScrollContainer minWidth={600}>
        <Table striped highlightOnHover verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Chủ đề</Table.Th>
              <Table.Th ta="center">Level</Table.Th>
              <Table.Th ta="center">Số lượng</Table.Th>
              <Table.Th ta="center">Trạng thái</Table.Th>
              <Table.Th>Ngày tạo</Table.Th>
              <Table.Th ta="center">Thao tác</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Table.Tr key={i}>
                  {Array.from({ length: 6 }).map((__, j) => (
                    <Table.Td key={j}><Skeleton height={16} /></Table.Td>
                  ))}
                </Table.Tr>
              ))
            ) : items.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Text ta="center" c="dimmed" py="lg">Chưa có dữ liệu</Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              items.map((item) => (
                <Table.Tr key={item.id} style={!item.active ? { opacity: 0.5 } : undefined}>
                  <Table.Td>
                    <Group gap="xs">
                      <Text size="lg">{item.emoji}</Text>
                      <Text size="sm" fw={500}>{item.name}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td ta="center">
                    <Badge variant="light" color={LEVEL_COLORS[item.level] || 'gray'} size="sm">
                      {item.level}
                    </Badge>
                  </Table.Td>
                  <Table.Td ta="center">
                    <Text size="sm">{item.count} {item.countLabel}</Text>
                  </Table.Td>
                  <Table.Td ta="center">
                    <Badge variant="dot" color={item.active ? 'green' : 'red'} size="sm">
                      {item.active ? 'Hiện' : 'Ẩn'}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="xs" c="dimmed">{item.createdAt}</Text>
                  </Table.Td>
                  <Table.Td ta="center">
                    <ActionIcon
                      variant="subtle"
                      color="blue"
                      size="sm"
                      onClick={() => onViewDetail(item.id)}
                    >
                      <IconExternalLink size={16} />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Card>
  )
}

export default AdminContentManagement
