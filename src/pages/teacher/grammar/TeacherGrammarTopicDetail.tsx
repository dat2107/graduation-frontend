import { useCallback, useEffect, useState } from 'react'
import {
  ActionIcon,
  Alert,
  Anchor,
  Badge,
  Box,
  Breadcrumbs,
  Button,
  Card,
  Group,
  Loader,
  Menu,
  Modal,
  NumberInput,
  Pagination,
  Select,
  Skeleton,
  Stack,
  Switch,
  Table,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core'
import { useDisclosure, useDebouncedValue } from '@mantine/hooks'
import {
  IconAlertCircle,
  IconArrowLeft,
  IconCheck,
  IconDotsVertical,
  IconEdit,
  IconPlus,
  IconSearch,
  IconTrash,
} from '@tabler/icons-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { GrammarService } from '@/services/grammar/grammar.service'
import type { GrammarLessonManage, CreateGrammarLessonRequest } from '@/@types/grammar'
import type { WordLevel } from '@/@types/grammar'

// ─── Constants ───────────────────────────────────────────────────────────────

const LEVEL_COLORS: Record<string, string> = {
  A1: 'green', A2: 'lime', B1: 'yellow', B2: 'orange', C1: 'red', C2: 'grape',
}

const LEVEL_OPTIONS = [
  { value: 'A1', label: 'A1' }, { value: 'A2', label: 'A2' },
  { value: 'B1', label: 'B1' }, { value: 'B2', label: 'B2' },
  { value: 'C1', label: 'C1' }, { value: 'C2', label: 'C2' },
]

const PAGE_SIZE = 15

const emptyForm: CreateGrammarLessonRequest = {
  title: '', summary: '', content: '', level: 'A1', orderIndex: 0,
}

// ─── Component ───────────────────────────────────────────────────────────────

const TeacherGrammarTopicDetail = () => {
  const { topicId } = useParams<{ topicId: string }>()
  const navigate = useNavigate()
  const numericTopicId = Number(topicId)

  const [lessons, setLessons] = useState<GrammarLessonManage[]>([])
  const [loading, setLoading] = useState(true)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 400)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  // Modal
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false)
  const [editingLesson, setEditingLesson] = useState<GrammarLessonManage | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [formData, setFormData] = useState<CreateGrammarLessonRequest>(emptyForm)

  // ─── Fetch lessons ────────────────────────────────────────────────────────
  const fetchLessons = useCallback(async () => {
    setLoading(true)
    try {
      const resp = await GrammarService.getLessonsForManage(numericTopicId, {
        page: page - 1,
        size: PAGE_SIZE,
        search: debouncedSearch || undefined,
      })
      const data = resp.data
      setLessons(data.items)
      setTotalItems(data.totalItems)
      setTotalPages(data.totalPages)
    } catch {
      setAlert({ type: 'error', message: 'Không thể tải danh sách bài học' })
    } finally {
      setLoading(false)
    }
  }, [numericTopicId, page, debouncedSearch])

  useEffect(() => { fetchLessons() }, [fetchLessons])
  useEffect(() => { setPage(1) }, [debouncedSearch])

  // ─── Modal handlers ────────────────────────────────────────────────────────
  const handleOpenCreate = () => {
    setEditingLesson(null)
    setFormData({ ...emptyForm, level: lessons[0]?.level || 'A1' })
    openModal()
  }

  const handleOpenEdit = (l: GrammarLessonManage) => {
    setEditingLesson(l)
    setFormData({
      title: l.title,
      summary: l.summary,
      level: l.level,
      orderIndex: l.orderIndex,
    })
    openModal()
  }

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setAlert({ type: 'error', message: 'Tiêu đề bài học không được để trống' })
      return
    }
    setFormLoading(true)
    try {
      if (editingLesson) {
        await GrammarService.updateLesson(editingLesson.id, formData)
        setAlert({ type: 'success', message: `Đã cập nhật "${formData.title}"` })
      } else {
        await GrammarService.createLesson(numericTopicId, formData)
        setAlert({ type: 'success', message: `Đã thêm "${formData.title}"` })
      }
      closeModal()
      fetchLessons()
    } catch {
      setAlert({ type: 'error', message: editingLesson ? 'Không thể cập nhật' : 'Không thể thêm bài học' })
    } finally {
      setFormLoading(false)
    }
  }

  const handleToggleActive = async (l: GrammarLessonManage) => {
    setActionLoading(l.id)
    try {
      await GrammarService.updateLesson(l.id, { active: !l.active })
      setAlert({ type: 'success', message: `Đã ${l.active ? 'ẩn' : 'hiện'} "${l.title}"` })
      fetchLessons()
    } catch {
      setAlert({ type: 'error', message: 'Thao tác thất bại' })
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (l: GrammarLessonManage) => {
    setActionLoading(l.id)
    try {
      await GrammarService.deleteLesson(l.id)
      setAlert({ type: 'success', message: `Đã xóa "${l.title}"` })
      fetchLessons()
    } catch {
      setAlert({ type: 'error', message: 'Không thể xóa bài học' })
    } finally {
      setActionLoading(null)
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <Box p="lg">
      {/* Breadcrumb */}
      <Breadcrumbs mb="md">
        <Anchor component={Link} to="/teacher/grammar" size="sm">QL Ngữ pháp</Anchor>
        <Text size="sm">Chi tiết chủ đề</Text>
      </Breadcrumbs>

      {/* Header */}
      <Group justify="space-between" mb="lg">
        <Group>
          <ActionIcon variant="subtle" onClick={() => navigate('/teacher/grammar')}>
            <IconArrowLeft size={20} />
          </ActionIcon>
          <Stack gap={2}>
            <Title order={2}>Bài học trong chủ đề #{topicId}</Title>
            <Text c="dimmed" size="sm">{totalItems} bài học</Text>
          </Stack>
        </Group>
        <Button leftSection={<IconPlus size={16} />} onClick={handleOpenCreate}>
          Thêm bài học
        </Button>
      </Group>

      {/* Alert */}
      {alert && (
        <Alert
          color={alert.type === 'success' ? 'green' : 'red'}
          icon={alert.type === 'success' ? <IconCheck size={16} /> : <IconAlertCircle size={16} />}
          mb="md" radius="md" withCloseButton onClose={() => setAlert(null)}
        >
          {alert.message}
        </Alert>
      )}

      {/* Search */}
      <Card withBorder radius="md" mb="lg" p="md">
        <TextInput
          placeholder="Tìm bài học..."
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
      </Card>

      {/* Table */}
      <Card withBorder radius="md" p={0}>
        <Table.ScrollContainer minWidth={700}>
          <Table striped highlightOnHover verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th w={60} ta="center">#</Table.Th>
                <Table.Th>Tiêu đề</Table.Th>
                <Table.Th ta="center">Level</Table.Th>
                <Table.Th ta="center">Số bài tập</Table.Th>
                <Table.Th ta="center">Trạng thái</Table.Th>
                <Table.Th>Ngày tạo</Table.Th>
                <Table.Th ta="center">Thao tác</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Table.Tr key={i}>
                    {Array.from({ length: 7 }).map((__, j) => (
                      <Table.Td key={j}><Skeleton height={16} /></Table.Td>
                    ))}
                  </Table.Tr>
                ))
              ) : lessons.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={7}>
                    <Text ta="center" c="dimmed" py="xl">
                      Chưa có bài học nào. Bấm "Thêm bài học" để bắt đầu.
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                lessons.map((l) => (
                  <Table.Tr key={l.id} style={!l.active ? { opacity: 0.5 } : undefined}>
                    <Table.Td ta="center">
                      <Text size="sm" c="dimmed">{l.orderIndex}</Text>
                    </Table.Td>
                    <Table.Td>
                      <div>
                        <Text size="sm" fw={600}>{l.title}</Text>
                        {l.summary && <Text size="xs" c="dimmed" lineClamp={1}>{l.summary}</Text>}
                      </div>
                    </Table.Td>
                    <Table.Td ta="center">
                      <Badge variant="light" color={LEVEL_COLORS[l.level] || 'gray'} size="xs">
                        {l.level}
                      </Badge>
                    </Table.Td>
                    <Table.Td ta="center">
                      <Text size="sm" fw={500}>{l.exerciseCount}</Text>
                    </Table.Td>
                    <Table.Td ta="center">
                      <Badge variant="dot" color={l.active ? 'green' : 'red'} size="sm">
                        {l.active ? 'Hiện' : 'Ẩn'}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="xs" c="dimmed">{l.createdAt}</Text>
                    </Table.Td>
                    <Table.Td ta="center">
                      {actionLoading === l.id ? (
                        <Loader size="xs" />
                      ) : (
                        <Menu shadow="md" width={160} position="bottom-end">
                          <Menu.Target>
                            <ActionIcon variant="subtle" color="gray" size="sm">
                              <IconDotsVertical size={16} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => handleOpenEdit(l)}>
                              Sửa
                            </Menu.Item>
                            <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => handleToggleActive(l)}>
                              {l.active ? 'Ẩn' : 'Hiện'}
                            </Menu.Item>
                            <Menu.Item leftSection={<IconTrash size={14} />} color="red" onClick={() => handleDelete(l)}>
                              Xóa
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      )}
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Group justify="center" mt="lg">
          <Pagination value={page} onChange={setPage} total={totalPages} size="sm" />
        </Group>
      )}

      {/* Create/Edit Lesson Modal */}
      <Modal
        opened={modalOpened}
        onClose={closeModal}
        title={editingLesson ? `Sửa "${editingLesson.title}"` : 'Thêm bài học mới'}
        size="lg"
      >
        <Stack gap="md">
          <TextInput
            label="Tiêu đề"
            placeholder="VD: Present Simple - Cách dùng cơ bản..."
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.currentTarget.value })}
          />
          <Textarea
            label="Tóm tắt"
            placeholder="Mô tả ngắn về bài học..."
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.currentTarget.value })}
            autosize
            minRows={2}
          />
          <Textarea
            label="Nội dung bài học"
            placeholder="Nội dung chi tiết (HTML hoặc Markdown)..."
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.currentTarget.value })}
            autosize
            minRows={4}
          />
          <Group grow>
            <Select
              label="Level"
              data={LEVEL_OPTIONS}
              required
              value={formData.level}
              onChange={(v) => setFormData({ ...formData, level: (v || 'A1') as WordLevel })}
            />
            <NumberInput
              label="Thứ tự"
              placeholder="0"
              min={0}
              value={formData.orderIndex}
              onChange={(v) => setFormData({ ...formData, orderIndex: Number(v) || 0 })}
            />
          </Group>
          {editingLesson && (
            <Switch
              label="Hiển thị cho học viên"
              checked={(formData as any).active ?? editingLesson.active}
              onChange={(e) => setFormData({ ...formData, active: e.currentTarget.checked } as any)}
            />
          )}
          <Group justify="flex-end" mt="sm">
            <Button variant="default" onClick={closeModal}>Hủy</Button>
            <Button onClick={handleSubmit} loading={formLoading}>
              {editingLesson ? 'Cập nhật' : 'Thêm bài học'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  )
}

export default TeacherGrammarTopicDetail
