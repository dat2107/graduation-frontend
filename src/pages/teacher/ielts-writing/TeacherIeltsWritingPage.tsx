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
  NumberInput,
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
  IconPencilCheck,
  IconPlus,
  IconSearch,
  IconTrash,
} from '@tabler/icons-react'
import type { AxiosError } from 'axios'
import { IeltsWritingService } from '@/services/ieltsWriting/ieltsWriting.service'
import type {
  CreateIeltsWritingTaskRequest,
  IeltsWritingTaskManage,
  IeltsWritingTaskType,
} from '@/@types/ieltsWriting'

// ─── Constants ───────────────────────────────────────────────────────────────

const TASK_TYPE_OPTIONS: { value: IeltsWritingTaskType; label: string }[] = [
  { value: 'TASK_1', label: 'Task 1 (Mô tả biểu đồ/bảng)' },
  { value: 'TASK_2', label: 'Task 2 (Bài luận)' },
]

const TASK_TYPE_LABEL: Record<IeltsWritingTaskType, string> = {
  TASK_1: 'Task 1',
  TASK_2: 'Task 2',
}

const TASK_TYPE_COLOR: Record<IeltsWritingTaskType, string> = {
  TASK_1: 'blue',
  TASK_2: 'grape',
}

const TASK_TYPE_FILTER_OPTIONS = [
  { value: '', label: 'Tất cả task' },
  ...TASK_TYPE_OPTIONS,
]

const PAGE_SIZE = 10

const DEFAULT_FORM: CreateIeltsWritingTaskRequest = {
  title: '',
  promptText: '',
  taskType: 'TASK_1',
  promptImageUrl: '',
  topic: '',
  timeLimitMinutes: 20,
  minWords: 150,
  sampleAnswer: '',
  sampleBand: undefined,
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
    return 'Không thể xóa: bài tập đã có bài làm của học viên.'
  }
  return typeof msg === 'string' ? msg : undefined
}

// ─── Component ───────────────────────────────────────────────────────────────

const TeacherIeltsWritingPage = () => {
  const [allTasks, setAllTasks] = useState<IeltsWritingTaskManage[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [taskTypeFilter, setTaskTypeFilter] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 400)
  const [alert, setAlert] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  // Modal state
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false)
  const [editingTask, setEditingTask] = useState<IeltsWritingTaskManage | null>(
    null,
  )
  const [formLoading, setFormLoading] = useState(false)
  const [formData, setFormData] =
    useState<CreateIeltsWritingTaskRequest>(DEFAULT_FORM)

  // ─── Fetch ─────────────────────────────────────────────────────────────────
  const fetchTasks = useCallback(async () => {
    setLoading(true)
    try {
      const resp = await IeltsWritingService.getTasks({
        taskType: taskTypeFilter || undefined,
      })
      setAllTasks(resp.data ?? [])
    } catch {
      setAlert({ type: 'error', message: 'Không thể tải danh sách bài tập' })
    } finally {
      setLoading(false)
    }
  }, [taskTypeFilter])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, taskTypeFilter])

  // ─── Client-side search + pagination ───────────────────────────────────────
  const filteredTasks = useMemo(() => {
    const kw = debouncedSearch.trim().toLowerCase()
    if (!kw) return allTasks
    return allTasks.filter(
      (t) =>
        t.title?.toLowerCase().includes(kw) ||
        t.promptText?.toLowerCase().includes(kw) ||
        t.topic?.toLowerCase().includes(kw),
    )
  }, [allTasks, debouncedSearch])

  const totalItems = filteredTasks.length
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE))
  const pagedTasks = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredTasks.slice(start, start + PAGE_SIZE)
  }, [filteredTasks, page])

  // Stats
  const task1Count = useMemo(
    () => allTasks.filter((t) => t.taskType === 'TASK_1').length,
    [allTasks],
  )
  const task2Count = useMemo(
    () => allTasks.filter((t) => t.taskType === 'TASK_2').length,
    [allTasks],
  )

  // ─── Modal handlers ────────────────────────────────────────────────────────
  const handleOpenCreate = () => {
    setEditingTask(null)
    setFormData(DEFAULT_FORM)
    openModal()
  }

  const handleOpenEdit = (t: IeltsWritingTaskManage) => {
    setEditingTask(t)
    setFormData({
      title: t.title,
      promptText: t.promptText,
      taskType: t.taskType,
      promptImageUrl: t.promptImageUrl ?? '',
      topic: t.topic ?? '',
      timeLimitMinutes: t.timeLimitMinutes,
      minWords: t.minWords,
      sampleAnswer: t.sampleAnswer ?? '',
      sampleBand: t.sampleBand ?? undefined,
    })
    openModal()
  }

  // When task type changes in form, suggest sensible defaults for time + min words
  const handleTaskTypeChange = (v: string | null) => {
    const next = (v || 'TASK_1') as IeltsWritingTaskType
    setFormData((prev) => ({
      ...prev,
      taskType: next,
      // Only auto-fill when creating (not editing existing values)
      timeLimitMinutes: editingTask
        ? prev.timeLimitMinutes
        : next === 'TASK_1'
        ? 20
        : 40,
      minWords: editingTask
        ? prev.minWords
        : next === 'TASK_1'
        ? 150
        : 250,
    }))
  }

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setAlert({ type: 'error', message: 'Tiêu đề không được để trống' })
      return
    }
    if (!formData.promptText.trim()) {
      setAlert({
        type: 'error',
        message: 'Nội dung đề bài không được để trống',
      })
      return
    }
    setFormLoading(true)
    try {
      // Normalize empty strings to undefined to avoid sending blank fields
      const payload = {
        ...formData,
        promptImageUrl: formData.promptImageUrl?.trim() || undefined,
        topic: formData.topic?.trim() || undefined,
        sampleAnswer: formData.sampleAnswer?.trim() || undefined,
        sampleBand:
          formData.sampleBand === undefined || formData.sampleBand === null
            ? undefined
            : Number(formData.sampleBand),
      }
      if (editingTask) {
        await IeltsWritingService.updateTask(editingTask.id, payload)
        setAlert({
          type: 'success',
          message: `Đã cập nhật bài tập "${formData.title}"`,
        })
      } else {
        await IeltsWritingService.createTask(payload)
        setAlert({
          type: 'success',
          message: `Đã tạo bài tập "${formData.title}"`,
        })
      }
      closeModal()
      fetchTasks()
    } catch (err) {
      const friendly = extractErrorMessage(err)
      setAlert({
        type: 'error',
        message:
          friendly ||
          (editingTask
            ? 'Không thể cập nhật bài tập'
            : 'Không thể tạo bài tập'),
      })
    } finally {
      setFormLoading(false)
    }
  }

  // ─── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (t: IeltsWritingTaskManage) => {
    if (!window.confirm(`Bạn có chắc muốn xóa bài tập "${t.title}"?`)) return
    setActionLoading(t.id)
    try {
      await IeltsWritingService.deleteTask(t.id)
      setAlert({ type: 'success', message: `Đã xóa bài tập "${t.title}"` })
      fetchTasks()
    } catch (err) {
      const friendly = extractErrorMessage(err)
      setAlert({
        type: 'error',
        message: friendly || 'Không thể xóa bài tập',
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
          <Title order={2}>Quản lý IELTS Writing</Title>
          <Text c="dimmed" size="sm">
            Tạo và quản lý các bài tập IELTS Writing Task 1 và Task 2 cho học
            viên.
          </Text>
        </Stack>
        <Button leftSection={<IconPlus size={16} />} onClick={handleOpenCreate}>
          Thêm bài tập
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
      <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} mb="lg">
        <Card withBorder radius="md" p="md">
          <Group>
            <IconPencilCheck size={24} color="var(--mantine-color-blue-6)" />
            <div>
              <Text size="xs" c="dimmed">
                Tổng bài tập
              </Text>
              <Text fw={700} size="lg">
                {loading ? <Skeleton width={30} height={20} /> : allTasks.length}
              </Text>
            </div>
          </Group>
        </Card>
        <Card withBorder radius="md" p="md">
          <Group>
            <Badge variant="light" color="blue" size="lg" radius="sm">
              Task 1
            </Badge>
            <div>
              <Text size="xs" c="dimmed">
                Số bài
              </Text>
              <Text fw={700} size="lg">
                {loading ? <Skeleton width={30} height={20} /> : task1Count}
              </Text>
            </div>
          </Group>
        </Card>
        <Card withBorder radius="md" p="md">
          <Group>
            <Badge variant="light" color="grape" size="lg" radius="sm">
              Task 2
            </Badge>
            <div>
              <Text size="xs" c="dimmed">
                Số bài
              </Text>
              <Text fw={700} size="lg">
                {loading ? <Skeleton width={30} height={20} /> : task2Count}
              </Text>
            </div>
          </Group>
        </Card>
      </SimpleGrid>

      {/* Filters */}
      <Card withBorder radius="md" mb="lg" p="md">
        <Group>
          <TextInput
            placeholder="Tìm theo tiêu đề, đề bài, chủ đề..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            style={{ flex: 1 }}
          />
          <Select
            data={TASK_TYPE_FILTER_OPTIONS}
            value={taskTypeFilter}
            onChange={(v) => setTaskTypeFilter(v || '')}
            placeholder="Lọc loại task"
            clearable
            w={240}
          />
        </Group>
      </Card>

      {/* Table */}
      <Card withBorder radius="md" p={0}>
        <Table.ScrollContainer minWidth={900}>
          <Table striped highlightOnHover verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Bài tập</Table.Th>
                <Table.Th ta="center">Loại</Table.Th>
                <Table.Th>Chủ đề</Table.Th>
                <Table.Th ta="center">Thời gian</Table.Th>
                <Table.Th ta="center">Số từ tối thiểu</Table.Th>
                <Table.Th>Ngày tạo</Table.Th>
                <Table.Th ta="center">Thao tác</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Table.Tr key={i}>
                    {Array.from({ length: 7 }).map((__, j) => (
                      <Table.Td key={j}>
                        <Skeleton height={16} />
                      </Table.Td>
                    ))}
                  </Table.Tr>
                ))
              ) : pagedTasks.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={7}>
                    <Text ta="center" c="dimmed" py="xl">
                      Chưa có bài tập nào.
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                pagedTasks.map((t) => (
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
                        color={TASK_TYPE_COLOR[t.taskType] || 'gray'}
                        size="sm"
                      >
                        {TASK_TYPE_LABEL[t.taskType] || t.taskType}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="xs" c="dimmed">
                        {t.topic || '-'}
                      </Text>
                    </Table.Td>
                    <Table.Td ta="center">
                      <Text size="xs">{t.timeLimitMinutes} phút</Text>
                    </Table.Td>
                    <Table.Td ta="center">
                      <Text size="xs">{t.minWords} từ</Text>
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
                              Sửa bài tập
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
        title={editingTask ? 'Sửa bài tập' : 'Thêm bài tập mới'}
        size="lg"
      >
        <Stack gap="md">
          <TextInput
            label="Tiêu đề"
            placeholder="VD: Line graph showing population growth..."
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.currentTarget.value })
            }
          />
          <Textarea
            label="Nội dung đề bài (prompt)"
            placeholder="Yêu cầu đầy đủ của đề bài học viên sẽ làm..."
            required
            value={formData.promptText}
            onChange={(e) =>
              setFormData({ ...formData, promptText: e.currentTarget.value })
            }
            autosize
            minRows={4}
            maxRows={10}
          />
          <Group grow>
            <Select
              label="Loại task"
              data={TASK_TYPE_OPTIONS}
              required
              value={formData.taskType}
              onChange={handleTaskTypeChange}
            />
            <TextInput
              label="Chủ đề"
              placeholder="VD: Environment, Education..."
              value={formData.topic ?? ''}
              onChange={(e) =>
                setFormData({ ...formData, topic: e.currentTarget.value })
              }
            />
          </Group>
          <Group grow>
            <NumberInput
              label="Thời gian (phút)"
              placeholder="20"
              min={1}
              max={120}
              value={formData.timeLimitMinutes}
              onChange={(v) =>
                setFormData({
                  ...formData,
                  timeLimitMinutes: typeof v === 'number' ? v : undefined,
                })
              }
            />
            <NumberInput
              label="Số từ tối thiểu"
              placeholder="150"
              min={50}
              max={1000}
              value={formData.minWords}
              onChange={(v) =>
                setFormData({
                  ...formData,
                  minWords: typeof v === 'number' ? v : undefined,
                })
              }
            />
          </Group>
          <TextInput
            label="URL hình ảnh đề bài (chỉ Task 1)"
            placeholder="https://... (biểu đồ, bảng, sơ đồ)"
            value={formData.promptImageUrl ?? ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                promptImageUrl: e.currentTarget.value,
              })
            }
          />
          <Textarea
            label="Đáp án mẫu (tùy chọn)"
            placeholder="Bài làm mẫu cho học viên tham khảo..."
            value={formData.sampleAnswer ?? ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                sampleAnswer: e.currentTarget.value,
              })
            }
            autosize
            minRows={2}
            maxRows={6}
          />
          <NumberInput
            label="Band điểm của đáp án mẫu (tùy chọn)"
            placeholder="VD: 7.5"
            min={0}
            max={9}
            step={0.5}
            decimalScale={1}
            value={formData.sampleBand ?? ''}
            onChange={(v) =>
              setFormData({
                ...formData,
                sampleBand: typeof v === 'number' ? v : undefined,
              })
            }
          />
          <Group justify="flex-end" mt="sm">
            <Button variant="default" onClick={closeModal}>
              Hủy
            </Button>
            <Button onClick={handleSubmit} loading={formLoading}>
              {editingTask ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  )
}

export default TeacherIeltsWritingPage
