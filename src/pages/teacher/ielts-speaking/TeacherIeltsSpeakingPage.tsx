import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Group,
  Loader,
  Menu,
  Modal,
  NumberInput,
  Pagination,
  Paper,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Table,
  Text,
  TextInput,
  Textarea,
  Title,
  Tooltip,
} from '@mantine/core'
import { useDebouncedValue, useDisclosure } from '@mantine/hooks'
import {
  IconAlertCircle,
  IconCheck,
  IconDotsVertical,
  IconEdit,
  IconHeadset,
  IconMessageDots,
  IconPlus,
  IconSearch,
  IconTrash,
} from '@tabler/icons-react'
import type { AxiosError } from 'axios'
import { IeltsSpeakingService } from '@/services/ieltsSpeaking/ieltsSpeaking.service'
import type {
  CreateIeltsSpeakingTestRequest,
  IeltsSpeakingPart,
  IeltsSpeakingQuestionItem,
  IeltsSpeakingTestManage,
} from '@/@types/ieltsSpeaking'

// ─── Constants ───────────────────────────────────────────────────────────────

const PART_OPTIONS: { value: IeltsSpeakingPart; label: string }[] = [
  { value: 'PART_1', label: 'Part 1 (Hỏi đáp ngắn)' },
  { value: 'PART_2', label: 'Part 2 (Cue card)' },
  { value: 'PART_3', label: 'Part 3 (Thảo luận)' },
]

const PART_LABEL: Record<IeltsSpeakingPart, string> = {
  PART_1: 'Part 1',
  PART_2: 'Part 2',
  PART_3: 'Part 3',
}

const PART_COLOR: Record<IeltsSpeakingPart, string> = {
  PART_1: 'blue',
  PART_2: 'grape',
  PART_3: 'orange',
}

const PAGE_SIZE = 10

const DEFAULT_FORM: CreateIeltsSpeakingTestRequest = {
  title: '',
  description: '',
  topic: '',
  questions: [],
}

const makeEmptyQuestion = (orderIndex: number): IeltsSpeakingQuestionItem => ({
  part: 'PART_1',
  questionText: '',
  cueCardText: '',
  orderIndex,
  prepTimeSeconds: 0,
})

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
    return 'Không thể xóa: bài thi đã có lượt làm bài của học viên.'
  }
  return typeof msg === 'string' ? msg : undefined
}

// ─── Component ───────────────────────────────────────────────────────────────

const TeacherIeltsSpeakingPage = () => {
  const [allTests, setAllTests] = useState<IeltsSpeakingTestManage[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 400)
  const [alert, setAlert] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  // Modal state
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false)
  const [editingTest, setEditingTest] =
    useState<IeltsSpeakingTestManage | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [formData, setFormData] =
    useState<CreateIeltsSpeakingTestRequest>(DEFAULT_FORM)

  // ─── Fetch ─────────────────────────────────────────────────────────────────
  const fetchTests = useCallback(async () => {
    setLoading(true)
    try {
      const resp = await IeltsSpeakingService.getTests()
      setAllTests(resp.data ?? [])
    } catch {
      setAlert({ type: 'error', message: 'Không thể tải danh sách bài thi' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTests()
  }, [fetchTests])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  // ─── Client-side search + pagination ───────────────────────────────────────
  const filteredTests = useMemo(() => {
    const kw = debouncedSearch.trim().toLowerCase()
    if (!kw) return allTests
    return allTests.filter(
      (t) =>
        t.title?.toLowerCase().includes(kw) ||
        t.description?.toLowerCase().includes(kw) ||
        t.topic?.toLowerCase().includes(kw),
    )
  }, [allTests, debouncedSearch])

  const totalItems = filteredTests.length
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE))
  const pagedTests = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredTests.slice(start, start + PAGE_SIZE)
  }, [filteredTests, page])

  // Stats
  const totalQuestions = useMemo(
    () => allTests.reduce((sum, t) => sum + (t.questionCount ?? 0), 0),
    [allTests],
  )

  // ─── Modal handlers ────────────────────────────────────────────────────────
  const handleOpenCreate = () => {
    setEditingTest(null)
    setFormData(DEFAULT_FORM)
    openModal()
  }

  const handleOpenEdit = async (t: IeltsSpeakingTestManage) => {
    setEditingTest(t)
    // Pre-populate metadata with what we already have so the modal renders
    // instantly; questions will arrive after the detail fetch.
    setFormData({
      title: t.title,
      description: t.description ?? '',
      topic: t.topic ?? '',
      questions: [],
    })
    openModal()
    setDetailLoading(true)
    try {
      const resp = await IeltsSpeakingService.getTest(t.id)
      const detail = resp.data
      if (detail) {
        setFormData({
          title: detail.title,
          description: detail.description ?? '',
          topic: detail.topic ?? '',
          questions: (detail.questions ?? []).map((q) => ({
            part: q.part,
            questionText: q.questionText,
            cueCardText: q.cueCardText ?? '',
            orderIndex: q.orderIndex,
            prepTimeSeconds: q.prepTimeSeconds ?? 0,
          })),
        })
      }
    } catch {
      setAlert({
        type: 'error',
        message: 'Không thể tải chi tiết bài thi',
      })
    } finally {
      setDetailLoading(false)
    }
  }

  // ─── Question editor handlers ──────────────────────────────────────────────
  const handleAddQuestion = () => {
    setFormData((prev) => {
      const nextOrder =
        prev.questions.length === 0
          ? 1
          : Math.max(...prev.questions.map((q) => q.orderIndex ?? 0)) + 1
      return {
        ...prev,
        questions: [...prev.questions, makeEmptyQuestion(nextOrder)],
      }
    })
  }

  const handleRemoveQuestion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }))
  }

  const handleUpdateQuestion = <K extends keyof IeltsSpeakingQuestionItem>(
    index: number,
    field: K,
    value: IeltsSpeakingQuestionItem[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === index ? { ...q, [field]: value } : q,
      ),
    }))
  }

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setAlert({ type: 'error', message: 'Tiêu đề không được để trống' })
      return
    }
    // Validate each question text non-blank
    const blankIdx = formData.questions.findIndex(
      (q) => !q.questionText?.trim(),
    )
    if (blankIdx >= 0) {
      setAlert({
        type: 'error',
        message: `Câu hỏi #${blankIdx + 1} chưa có nội dung`,
      })
      return
    }
    setFormLoading(true)
    try {
      // Normalize payload: trim strings, drop blank optionals,
      // null cueCardText for non-Part-2 questions.
      const cleanedQuestions: IeltsSpeakingQuestionItem[] =
        formData.questions.map((q, i) => ({
          part: q.part,
          questionText: q.questionText.trim(),
          cueCardText:
            q.part === 'PART_2'
              ? q.cueCardText?.trim() || undefined
              : undefined,
          orderIndex:
            typeof q.orderIndex === 'number' && q.orderIndex > 0
              ? q.orderIndex
              : i + 1,
          prepTimeSeconds:
            typeof q.prepTimeSeconds === 'number' ? q.prepTimeSeconds : 0,
        }))

      if (editingTest) {
        await IeltsSpeakingService.updateTest(editingTest.id, {
          title: formData.title.trim(),
          description: formData.description?.trim() || undefined,
          topic: formData.topic?.trim() || undefined,
          questions: cleanedQuestions,
        })
        setAlert({
          type: 'success',
          message: `Đã cập nhật bài thi "${formData.title}"`,
        })
      } else {
        await IeltsSpeakingService.createTest({
          title: formData.title.trim(),
          description: formData.description?.trim() || undefined,
          topic: formData.topic?.trim() || undefined,
          questions: cleanedQuestions,
        })
        setAlert({
          type: 'success',
          message: `Đã tạo bài thi "${formData.title}"`,
        })
      }
      closeModal()
      fetchTests()
    } catch (err) {
      const friendly = extractErrorMessage(err)
      setAlert({
        type: 'error',
        message:
          friendly ||
          (editingTest
            ? 'Không thể cập nhật bài thi'
            : 'Không thể tạo bài thi'),
      })
    } finally {
      setFormLoading(false)
    }
  }

  // ─── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (t: IeltsSpeakingTestManage) => {
    if (!window.confirm(`Bạn có chắc muốn xóa bài thi "${t.title}"?`)) return
    setActionLoading(t.id)
    try {
      await IeltsSpeakingService.deleteTest(t.id)
      setAlert({ type: 'success', message: `Đã xóa bài thi "${t.title}"` })
      fetchTests()
    } catch (err) {
      const friendly = extractErrorMessage(err)
      setAlert({
        type: 'error',
        message: friendly || 'Không thể xóa bài thi',
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
          <Title order={2}>Quản lý IELTS Speaking</Title>
          <Text c="dimmed" size="sm">
            Tạo và quản lý các bài thi IELTS Speaking gồm 3 phần với danh sách
            câu hỏi cho học viên luyện tập.
          </Text>
        </Stack>
        <Button leftSection={<IconPlus size={16} />} onClick={handleOpenCreate}>
          Tạo bài thi
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
      <SimpleGrid cols={{ base: 1, xs: 2 }} mb="lg">
        <Card withBorder radius="md" p="md">
          <Group>
            <IconHeadset size={24} color="var(--mantine-color-blue-6)" />
            <div>
              <Text size="xs" c="dimmed">
                Tổng bài thi
              </Text>
              <Text fw={700} size="lg">
                {loading ? <Skeleton width={30} height={20} /> : allTests.length}
              </Text>
            </div>
          </Group>
        </Card>
        <Card withBorder radius="md" p="md">
          <Group>
            <IconMessageDots size={24} color="var(--mantine-color-grape-6)" />
            <div>
              <Text size="xs" c="dimmed">
                Tổng câu hỏi
              </Text>
              <Text fw={700} size="lg">
                {loading ? (
                  <Skeleton width={30} height={20} />
                ) : (
                  totalQuestions
                )}
              </Text>
            </div>
          </Group>
        </Card>
      </SimpleGrid>

      {/* Filters */}
      <Card withBorder radius="md" mb="lg" p="md">
        <Group>
          <TextInput
            placeholder="Tìm theo tiêu đề, mô tả, chủ đề..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            style={{ flex: 1 }}
          />
        </Group>
      </Card>

      {/* Table */}
      <Card withBorder radius="md" p={0}>
        <Table.ScrollContainer minWidth={900}>
          <Table striped highlightOnHover verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Bài thi</Table.Th>
                <Table.Th>Chủ đề</Table.Th>
                <Table.Th ta="center">Số câu hỏi</Table.Th>
                <Table.Th>Ngày tạo</Table.Th>
                <Table.Th ta="center">Thao tác</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Table.Tr key={i}>
                    {Array.from({ length: 5 }).map((__, j) => (
                      <Table.Td key={j}>
                        <Skeleton height={16} />
                      </Table.Td>
                    ))}
                  </Table.Tr>
                ))
              ) : pagedTests.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={5}>
                    <Text ta="center" c="dimmed" py="xl">
                      Chưa có bài thi nào.
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                pagedTests.map((t) => (
                  <Table.Tr key={t.id}>
                    <Table.Td>
                      <Stack gap={2}>
                        <Text size="sm" fw={500} lineClamp={1}>
                          {t.title}
                        </Text>
                        <Text size="xs" c="dimmed" lineClamp={2}>
                          {t.description || '—'}
                        </Text>
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <Text size="xs" c="dimmed">
                        {t.topic || '-'}
                      </Text>
                    </Table.Td>
                    <Table.Td ta="center">
                      <Badge variant="light" color="blue" size="sm">
                        {t.questionCount ?? 0}
                      </Badge>
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
                              Sửa bài thi
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
        title={editingTest ? 'Sửa bài thi' : 'Tạo bài thi mới'}
        size="xl"
        closeOnClickOutside={!formLoading}
      >
        <Stack gap="md">
          <TextInput
            label="Tên bài thi"
            placeholder="VD: IELTS Speaking Mock Test 1"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.currentTarget.value })
            }
          />
          <Textarea
            label="Mô tả"
            placeholder="Mô tả ngắn về bài thi, mục tiêu, level..."
            value={formData.description ?? ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.currentTarget.value,
              })
            }
            autosize
            minRows={2}
            maxRows={5}
          />
          <TextInput
            label="Chủ đề"
            placeholder="VD: Travel, Education, Technology..."
            value={formData.topic ?? ''}
            onChange={(e) =>
              setFormData({ ...formData, topic: e.currentTarget.value })
            }
          />

          <Divider
            label={
              <Group gap="xs">
                <IconMessageDots size={14} />
                <Text size="sm" fw={500}>
                  Danh sách câu hỏi ({formData.questions.length})
                </Text>
              </Group>
            }
            labelPosition="left"
          />

          {detailLoading ? (
            <Stack gap="sm">
              <Skeleton height={120} radius="md" />
              <Skeleton height={120} radius="md" />
            </Stack>
          ) : (
            <Stack gap="sm">
              {formData.questions.length === 0 && (
                <Text size="sm" c="dimmed" ta="center" py="sm">
                  Chưa có câu hỏi nào. Bấm "Thêm câu hỏi" để bắt đầu.
                </Text>
              )}
              {formData.questions.map((q, idx) => (
                <Paper
                  key={idx}
                  withBorder
                  p="md"
                  radius="md"
                  bg="var(--mantine-color-gray-0)"
                >
                  <Stack gap="sm">
                    <Group justify="space-between">
                      <Group gap="xs">
                        <Badge
                          variant="light"
                          color={PART_COLOR[q.part]}
                          size="sm"
                        >
                          Câu #{idx + 1}
                        </Badge>
                        <Badge variant="filled" color="gray" size="sm">
                          {PART_LABEL[q.part]}
                        </Badge>
                      </Group>
                      <Tooltip label="Xóa câu hỏi này">
                        <ActionIcon
                          color="red"
                          variant="subtle"
                          onClick={() => handleRemoveQuestion(idx)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>

                    <Group grow>
                      <Select
                        label="Part"
                        data={PART_OPTIONS}
                        value={q.part}
                        onChange={(v) =>
                          handleUpdateQuestion(
                            idx,
                            'part',
                            (v || 'PART_1') as IeltsSpeakingPart,
                          )
                        }
                        allowDeselect={false}
                      />
                      <NumberInput
                        label="Thứ tự"
                        min={1}
                        max={99}
                        value={q.orderIndex}
                        onChange={(v) =>
                          handleUpdateQuestion(
                            idx,
                            'orderIndex',
                            typeof v === 'number' ? v : idx + 1,
                          )
                        }
                      />
                      <NumberInput
                        label="Thời gian chuẩn bị (giây)"
                        min={0}
                        max={300}
                        value={q.prepTimeSeconds ?? 0}
                        onChange={(v) =>
                          handleUpdateQuestion(
                            idx,
                            'prepTimeSeconds',
                            typeof v === 'number' ? v : 0,
                          )
                        }
                      />
                    </Group>

                    <Textarea
                      label="Nội dung câu hỏi"
                      placeholder="VD: Where do you live?"
                      required
                      value={q.questionText}
                      onChange={(e) =>
                        handleUpdateQuestion(
                          idx,
                          'questionText',
                          e.currentTarget.value,
                        )
                      }
                      autosize
                      minRows={2}
                      maxRows={6}
                    />

                    {q.part === 'PART_2' && (
                      <Textarea
                        label="Cue card (chỉ Part 2)"
                        placeholder="Describe a person who has influenced you. You should say:&#10;- who this person is&#10;- how you know them&#10;- what they have done&#10;- and explain why they have influenced you."
                        value={q.cueCardText ?? ''}
                        onChange={(e) =>
                          handleUpdateQuestion(
                            idx,
                            'cueCardText',
                            e.currentTarget.value,
                          )
                        }
                        autosize
                        minRows={3}
                        maxRows={8}
                      />
                    )}
                  </Stack>
                </Paper>
              ))}

              <Button
                variant="light"
                leftSection={<IconPlus size={14} />}
                onClick={handleAddQuestion}
                fullWidth
              >
                Thêm câu hỏi
              </Button>
            </Stack>
          )}

          <Group justify="flex-end" mt="sm">
            <Button
              variant="default"
              onClick={closeModal}
              disabled={formLoading}
            >
              Hủy
            </Button>
            <Button onClick={handleSubmit} loading={formLoading}>
              {editingTest ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  )
}

export default TeacherIeltsSpeakingPage
