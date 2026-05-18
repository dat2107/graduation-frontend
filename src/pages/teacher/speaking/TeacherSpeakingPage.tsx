import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Group,
  Loader,
  Menu,
  Modal,
  Pagination,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Table,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core'
import { useDebouncedValue, useDisclosure } from '@mantine/hooks'
import {
  IconAlertCircle,
  IconCheck,
  IconDotsVertical,
  IconEdit,
  IconMicrophone,
  IconPlus,
  IconSearch,
  IconTrash,
} from '@tabler/icons-react'
import type { AxiosError } from 'axios'
import { SpeakingService } from '@/services/speaking/speaking.service'
import type {
  CreateSpeakingTopicRequest,
  SpeakingDifficulty,
  SpeakingPromptType,
  SpeakingTopicManage,
} from '@/@types/speaking'

// ─── Constants ───────────────────────────────────────────────────────────────

const PROMPT_TYPE_OPTIONS: { value: SpeakingPromptType; label: string }[] = [
  { value: 'READ_ALOUD', label: 'Đọc to (Read Aloud)' },
  { value: 'DESCRIBE_IMAGE', label: 'Mô tả ảnh (Describe Image)' },
  { value: 'FREE_SPEAK', label: 'Nói tự do (Free Speak)' },
  { value: 'ANSWER_QUESTION', label: 'Trả lời câu hỏi (Answer Question)' },
]

const PROMPT_TYPE_LABEL: Record<SpeakingPromptType, string> = {
  READ_ALOUD: 'Đọc to',
  DESCRIBE_IMAGE: 'Mô tả ảnh',
  FREE_SPEAK: 'Nói tự do',
  ANSWER_QUESTION: 'Trả lời câu hỏi',
}

const PROMPT_TYPE_COLOR: Record<SpeakingPromptType, string> = {
  READ_ALOUD: 'blue',
  DESCRIBE_IMAGE: 'grape',
  FREE_SPEAK: 'teal',
  ANSWER_QUESTION: 'orange',
}

const DIFFICULTY_OPTIONS: { value: SpeakingDifficulty; label: string }[] = [
  { value: 'EASY', label: 'Dễ' },
  { value: 'MEDIUM', label: 'Trung bình' },
  { value: 'HARD', label: 'Khó' },
]

const DIFFICULTY_LABEL: Record<SpeakingDifficulty, string> = {
  EASY: 'Dễ',
  MEDIUM: 'Trung bình',
  HARD: 'Khó',
}

const DIFFICULTY_COLOR: Record<SpeakingDifficulty, string> = {
  EASY: 'green',
  MEDIUM: 'yellow',
  HARD: 'red',
}

const PROMPT_FILTER_OPTIONS = [
  { value: '', label: 'Tất cả loại' },
  ...PROMPT_TYPE_OPTIONS,
]

const DIFFICULTY_FILTER_OPTIONS = [
  { value: '', label: 'Tất cả độ khó' },
  ...DIFFICULTY_OPTIONS,
]

const PAGE_SIZE = 10

const DEFAULT_FORM: CreateSpeakingTopicRequest = {
  title: '',
  promptText: '',
  promptType: 'READ_ALOUD',
  difficulty: 'EASY',
  imageUrl: '',
  category: '',
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatDateTime = (iso?: string) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const extractErrorMessage = (err: unknown): string | undefined => {
  const ax = err as AxiosError<{ message?: string; status?: number | string }>
  const data = ax?.response?.data
  if (!data) return undefined
  const msg = data.message
  if (typeof msg === 'string' && msg.toUpperCase().includes('INVALID_STATUS')) {
    return 'Không thể xóa: chủ đề đã có bài làm của học viên.'
  }
  return typeof msg === 'string' ? msg : undefined
}

// ─── Component ───────────────────────────────────────────────────────────────

const TeacherSpeakingPage = () => {
  const [allTopics, setAllTopics] = useState<SpeakingTopicManage[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [promptTypeFilter, setPromptTypeFilter] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 400)
  const [alert, setAlert] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  // Modal state
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false)
  const [editingTopic, setEditingTopic] = useState<SpeakingTopicManage | null>(
    null,
  )
  const [formLoading, setFormLoading] = useState(false)
  const [formData, setFormData] = useState<CreateSpeakingTopicRequest>(DEFAULT_FORM)

  // ─── Fetch ─────────────────────────────────────────────────────────────────
  const fetchTopics = useCallback(async () => {
    setLoading(true)
    try {
      const resp = await SpeakingService.getTopics({
        promptType: promptTypeFilter || undefined,
        difficulty: difficultyFilter || undefined,
      })
      setAllTopics(resp.data ?? [])
    } catch {
      setAlert({ type: 'error', message: 'Không thể tải danh sách chủ đề' })
    } finally {
      setLoading(false)
    }
  }, [promptTypeFilter, difficultyFilter])

  useEffect(() => {
    fetchTopics()
  }, [fetchTopics])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, promptTypeFilter, difficultyFilter])

  // ─── Client-side search + pagination ───────────────────────────────────────
  const filteredTopics = useMemo(() => {
    const kw = debouncedSearch.trim().toLowerCase()
    if (!kw) return allTopics
    return allTopics.filter(
      (t) =>
        t.title?.toLowerCase().includes(kw) ||
        t.promptText?.toLowerCase().includes(kw) ||
        t.category?.toLowerCase().includes(kw),
    )
  }, [allTopics, debouncedSearch])

  const totalItems = filteredTopics.length
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE))
  const pagedTopics = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredTopics.slice(start, start + PAGE_SIZE)
  }, [filteredTopics, page])

  // Stats
  const countByPromptType = useMemo(() => {
    const acc: Record<string, number> = {}
    allTopics.forEach((t) => {
      acc[t.promptType] = (acc[t.promptType] || 0) + 1
    })
    return acc
  }, [allTopics])

  // ─── Modal handlers ────────────────────────────────────────────────────────
  const handleOpenCreate = () => {
    setEditingTopic(null)
    setFormData(DEFAULT_FORM)
    openModal()
  }

  const handleOpenEdit = (t: SpeakingTopicManage) => {
    setEditingTopic(t)
    setFormData({
      title: t.title,
      promptText: t.promptText,
      promptType: t.promptType,
      difficulty: t.difficulty,
      imageUrl: t.imageUrl ?? '',
      category: t.category ?? '',
    })
    openModal()
  }

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setAlert({ type: 'error', message: 'Tên chủ đề không được để trống' })
      return
    }
    if (!formData.promptText.trim()) {
      setAlert({ type: 'error', message: 'Nội dung prompt không được để trống' })
      return
    }
    setFormLoading(true)
    try {
      // Normalize empty strings to undefined to avoid sending blank fields
      const payload = {
        ...formData,
        imageUrl: formData.imageUrl?.trim() || undefined,
        category: formData.category?.trim() || undefined,
      }
      if (editingTopic) {
        await SpeakingService.updateTopic(editingTopic.id, payload)
        setAlert({
          type: 'success',
          message: `Đã cập nhật chủ đề "${formData.title}"`,
        })
      } else {
        await SpeakingService.createTopic(payload)
        setAlert({
          type: 'success',
          message: `Đã tạo chủ đề "${formData.title}"`,
        })
      }
      closeModal()
      fetchTopics()
    } catch (err) {
      const friendly = extractErrorMessage(err)
      setAlert({
        type: 'error',
        message:
          friendly ||
          (editingTopic ? 'Không thể cập nhật chủ đề' : 'Không thể tạo chủ đề'),
      })
    } finally {
      setFormLoading(false)
    }
  }

  // ─── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (t: SpeakingTopicManage) => {
    if (!window.confirm(`Bạn có chắc muốn xóa chủ đề "${t.title}"?`)) return
    setActionLoading(t.id)
    try {
      await SpeakingService.deleteTopic(t.id)
      setAlert({ type: 'success', message: `Đã xóa chủ đề "${t.title}"` })
      fetchTopics()
    } catch (err) {
      const friendly = extractErrorMessage(err)
      setAlert({
        type: 'error',
        message: friendly || 'Không thể xóa chủ đề',
      })
    } finally {
      setActionLoading(null)
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <Box p="lg">
      {/* Header */}
      <Group justify="space-between" mb="lg">
        <Stack gap="xs">
          <Title order={2}>Quản lý Luyện nói</Title>
          <Text c="dimmed" size="sm">
            Tạo và quản lý các chủ đề luyện nói cho học viên.
          </Text>
        </Stack>
        <Button leftSection={<IconPlus size={16} />} onClick={handleOpenCreate}>
          Thêm chủ đề
        </Button>
      </Group>

      {/* Alert */}
      {alert && (
        <Alert
          color={alert.type === 'success' ? 'green' : 'red'}
          icon={
            alert.type === 'success' ? (
              <IconCheck size={16} />
            ) : (
              <IconAlertCircle size={16} />
            )
          }
          mb="md"
          radius="md"
          withCloseButton
          onClose={() => setAlert(null)}
        >
          {alert.message}
        </Alert>
      )}

      {/* Stats */}
      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} mb="lg">
        <Card withBorder radius="md" p="md">
          <Group>
            <IconMicrophone size={24} color="var(--mantine-color-blue-6)" />
            <div>
              <Text size="xs" c="dimmed">
                Tổng chủ đề
              </Text>
              <Text fw={700} size="lg">
                {loading ? <Skeleton width={30} height={20} /> : allTopics.length}
              </Text>
            </div>
          </Group>
        </Card>
        {PROMPT_TYPE_OPTIONS.map((opt) => (
          <Card key={opt.value} withBorder radius="md" p="md">
            <Group>
              <Badge
                variant="light"
                color={PROMPT_TYPE_COLOR[opt.value]}
                size="lg"
                radius="sm"
              >
                {PROMPT_TYPE_LABEL[opt.value]}
              </Badge>
              <div>
                <Text size="xs" c="dimmed">
                  Số chủ đề
                </Text>
                <Text fw={700} size="lg">
                  {loading ? (
                    <Skeleton width={30} height={20} />
                  ) : (
                    countByPromptType[opt.value] || 0
                  )}
                </Text>
              </div>
            </Group>
          </Card>
        ))}
      </SimpleGrid>

      {/* Filters */}
      <Card withBorder radius="md" mb="lg" p="md">
        <Group>
          <TextInput
            placeholder="Tìm theo tên, prompt, chủ đề..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            style={{ flex: 1 }}
          />
          <Select
            data={PROMPT_FILTER_OPTIONS}
            value={promptTypeFilter}
            onChange={(v) => setPromptTypeFilter(v || '')}
            placeholder="Lọc loại prompt"
            clearable
            w={200}
          />
          <Select
            data={DIFFICULTY_FILTER_OPTIONS}
            value={difficultyFilter}
            onChange={(v) => setDifficultyFilter(v || '')}
            placeholder="Lọc độ khó"
            clearable
            w={170}
          />
        </Group>
      </Card>

      {/* Table */}
      <Card withBorder radius="md" p={0}>
        <Table.ScrollContainer minWidth={800}>
          <Table striped highlightOnHover verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Chủ đề</Table.Th>
                <Table.Th ta="center">Loại prompt</Table.Th>
                <Table.Th ta="center">Độ khó</Table.Th>
                <Table.Th>Danh mục</Table.Th>
                <Table.Th>Ngày tạo</Table.Th>
                <Table.Th ta="center">Thao tác</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Table.Tr key={i}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <Table.Td key={j}>
                        <Skeleton height={16} />
                      </Table.Td>
                    ))}
                  </Table.Tr>
                ))
              ) : pagedTopics.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={6}>
                    <Text ta="center" c="dimmed" py="xl">
                      Chưa có chủ đề nào.
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                pagedTopics.map((t) => (
                  <Table.Tr key={t.id}>
                    <Table.Td>
                      <Stack gap={2}>
                        <Text size="sm" fw={500} lineClamp={1}>
                          {t.title}
                        </Text>
                        <Text size="xs" c="dimmed" lineClamp={2}>
                          {t.promptText}
                        </Text>
                      </Stack>
                    </Table.Td>
                    <Table.Td ta="center">
                      <Badge
                        variant="light"
                        color={PROMPT_TYPE_COLOR[t.promptType] || 'gray'}
                        size="sm"
                      >
                        {PROMPT_TYPE_LABEL[t.promptType] || t.promptType}
                      </Badge>
                    </Table.Td>
                    <Table.Td ta="center">
                      <Badge
                        variant="dot"
                        color={DIFFICULTY_COLOR[t.difficulty] || 'gray'}
                        size="sm"
                      >
                        {DIFFICULTY_LABEL[t.difficulty] || t.difficulty}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="xs" c="dimmed">
                        {t.category || '-'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="xs" c="dimmed">
                        {formatDateTime(t.createdAt)}
                      </Text>
                    </Table.Td>
                    <Table.Td ta="center">
                      {actionLoading === t.id ? (
                        <Loader size="xs" />
                      ) : (
                        <Menu shadow="md" width={180} position="bottom-end">
                          <Menu.Target>
                            <ActionIcon variant="subtle" color="gray" size="sm">
                              <IconDotsVertical size={16} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item
                              leftSection={<IconEdit size={14} />}
                              onClick={() => handleOpenEdit(t)}
                            >
                              Sửa chủ đề
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item
                              leftSection={<IconTrash size={14} />}
                              color="red"
                              onClick={() => handleDelete(t)}
                            >
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
          <Pagination
            value={page}
            onChange={setPage}
            total={totalPages}
            size="sm"
          />
        </Group>
      )}

      {/* Create/Edit Modal */}
      <Modal
        opened={modalOpened}
        onClose={closeModal}
        title={editingTopic ? 'Sửa chủ đề' : 'Thêm chủ đề mới'}
        size="lg"
      >
        <Stack gap="md">
          <TextInput
            label="Tên chủ đề"
            placeholder="VD: Mô tả một bức ảnh phong cảnh..."
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.currentTarget.value })
            }
          />
          <Textarea
            label="Nội dung prompt"
            placeholder="Nội dung yêu cầu hoặc câu hỏi học viên sẽ luyện nói..."
            required
            value={formData.promptText}
            onChange={(e) =>
              setFormData({ ...formData, promptText: e.currentTarget.value })
            }
            autosize
            minRows={3}
            maxRows={8}
          />
          <Group grow>
            <Select
              label="Loại prompt"
              data={PROMPT_TYPE_OPTIONS}
              required
              value={formData.promptType}
              onChange={(v) =>
                setFormData({
                  ...formData,
                  promptType: (v || 'READ_ALOUD') as SpeakingPromptType,
                })
              }
            />
            <Select
              label="Độ khó"
              data={DIFFICULTY_OPTIONS}
              required
              value={formData.difficulty}
              onChange={(v) =>
                setFormData({
                  ...formData,
                  difficulty: (v || 'EASY') as SpeakingDifficulty,
                })
              }
            />
          </Group>
          <Group grow>
            <TextInput
              label="Danh mục"
              placeholder="VD: Travel, Daily life..."
              value={formData.category ?? ''}
              onChange={(e) =>
                setFormData({ ...formData, category: e.currentTarget.value })
              }
            />
            <TextInput
              label="URL hình ảnh"
              placeholder="https://..."
              value={formData.imageUrl ?? ''}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.currentTarget.value })
              }
            />
          </Group>
          <Group justify="flex-end" mt="sm">
            <Button variant="default" onClick={closeModal}>
              Hủy
            </Button>
            <Button onClick={handleSubmit} loading={formLoading}>
              {editingTopic ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  )
}

export default TeacherSpeakingPage
