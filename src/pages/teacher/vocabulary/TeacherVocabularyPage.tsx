import { useCallback, useEffect, useState } from 'react';
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
  Switch,
  Table,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { useDisclosure, useDebouncedValue } from '@mantine/hooks';
import {
  IconAlertCircle,
  IconCheck,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconPlus,
  IconSearch,
  IconTrash,
  IconVocabulary,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { VocabularyService } from '@/services/vocabulary/vocabulary.service';
import type {
  VocabTopicManage,
  WordLevel,
  CreateVocabTopicRequest,
} from '@/@types/vocabulary';

// ─── Constants ───────────────────────────────────────────────────────────────

const LEVEL_OPTIONS = [
  { value: '', label: 'Tất cả level' },
  { value: 'A1', label: 'A1' },
  { value: 'A2', label: 'A2' },
  { value: 'B1', label: 'B1' },
  { value: 'B2', label: 'B2' },
  { value: 'C1', label: 'C1' },
  { value: 'C2', label: 'C2' },
];

type TopicFormData = CreateVocabTopicRequest & {
  active?: boolean;
};

const LEVEL_COLORS: Record<string, string> = {
  A1: 'green',
  A2: 'lime',
  B1: 'yellow',
  B2: 'orange',
  C1: 'red',
  C2: 'grape',
};

const PAGE_SIZE = 10;

// ─── Component ───────────────────────────────────────────────────────────────

const TeacherVocabularyPage = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<VocabTopicManage[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 400);
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Modal state
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  const [editingTopic, setEditingTopic] = useState<VocabTopicManage | null>(
    null
  );
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState<TopicFormData>({
    name: '',
    description: '',
    level: 'A1',
    emoji: '',
  });

  // ─── Fetch ─────────────────────────────────────────────────────────────────
  const fetchTopics = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await VocabularyService.getTopicsForManage({
        page: page - 1,
        size: PAGE_SIZE,
        search: debouncedSearch || undefined,
        level: levelFilter || undefined,
      });
      const { data } = resp;
      setTopics(data.items);
      setTotalItems(data.totalItems);
      setTotalPages(data.totalPages);
    } catch {
      setAlert({ type: 'error', message: 'Không thể tải danh sách chủ đề' });
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, levelFilter]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, levelFilter]);

  // ─── Modal Handlers ────────────────────────────────────────────────────────
  const handleOpenCreate = () => {
    setEditingTopic(null);
    setFormData({
      name: '',
      description: '',
      level: 'A1',
      emoji: '',
    });
    openModal();
  };

  const handleOpenEdit = (t: VocabTopicManage) => {
    setEditingTopic(t);
    setFormData({
      name: t.name,
      description: t.description,
      level: t.level,
      emoji: t.emoji,
      active: t.active,
    });
    openModal();
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setAlert({ type: 'error', message: 'Tên chủ đề không được để trống' });
      return;
    }
    setFormLoading(true);
    try {
      if (editingTopic) {
        await VocabularyService.updateTopic(editingTopic.id, formData);
        setAlert({
          type: 'success',
          message: `Đã cập nhật chủ đề "${formData.name}"`,
        });
      } else {
        await VocabularyService.createTopic(formData);
        setAlert({
          type: 'success',
          message: `Đã tạo chủ đề "${formData.name}"`,
        });
      }
      closeModal();
      fetchTopics();
    } catch {
      setAlert({
        type: 'error',
        message: editingTopic ? 'Không thể cập nhật' : 'Không thể tạo chủ đề',
      });
    } finally {
      setFormLoading(false);
    }
  };

  // ─── Actions ───────────────────────────────────────────────────────────────
  const handleToggleActive = async (t: VocabTopicManage) => {
    setActionLoading(t.id);
    try {
      await VocabularyService.updateTopic(t.id, { active: !t.active });
      setAlert({
        type: 'success',
        message: `Đã ${t.active ? 'ẩn' : 'hiện'} chủ đề "${t.name}"`,
      });
      fetchTopics();
    } catch {
      setAlert({ type: 'error', message: 'Thao tác thất bại' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (t: VocabTopicManage) => {
    setActionLoading(t.id);
    try {
      await VocabularyService.deleteTopic(t.id);
      setAlert({ type: 'success', message: `Đã xóa chủ đề "${t.name}"` });
      fetchTopics();
    } catch {
      setAlert({ type: 'error', message: 'Không thể xóa chủ đề' });
    } finally {
      setActionLoading(null);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <Box p="lg">
      {/* Header */}
      <Group justify="space-between" mb="lg">
        <Stack gap="xs">
          <Title order={2}>Quản lý Từ vựng</Title>
          <Text c="dimmed" size="sm">
            Tạo và quản lý các chủ đề từ vựng, thêm từ mới vào từng chủ đề.
          </Text>
        </Stack>
        <Button leftSection={<IconPlus size={16} />} onClick={handleOpenCreate}>
          Tạo chủ đề
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
      <SimpleGrid cols={{ base: 1, xs: 3 }} mb="lg">
        <Card withBorder radius="md" p="md">
          <Group>
            <IconVocabulary size={24} color="var(--mantine-color-blue-6)" />
            <div>
              <Text size="xs" c="dimmed">
                Tổng chủ đề
              </Text>
              <Text fw={700} size="lg">
                {loading ? <Skeleton width={30} height={20} /> : totalItems}
              </Text>
            </div>
          </Group>
        </Card>
        <Card withBorder radius="md" p="md">
          <Group>
            <IconCheck size={24} color="var(--mantine-color-green-6)" />
            <div>
              <Text size="xs" c="dimmed">
                Đang hoạt động
              </Text>
              <Text fw={700} size="lg" c="green">
                {loading ? (
                  <Skeleton width={30} height={20} />
                ) : (
                  topics.filter((t) => t.active).length
                )}
              </Text>
            </div>
          </Group>
        </Card>
        <Card withBorder radius="md" p="md">
          <Group>
            <IconVocabulary size={24} color="var(--mantine-color-violet-6)" />
            <div>
              <Text size="xs" c="dimmed">
                Tổng từ vựng
              </Text>
              <Text fw={700} size="lg">
                {loading ? (
                  <Skeleton width={30} height={20} />
                ) : (
                  topics.reduce((s, t) => s + t.wordCount, 0)
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
            placeholder="Tìm theo tên chủ đề..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            style={{ flex: 1 }}
          />
          <Select
            data={LEVEL_OPTIONS}
            value={levelFilter}
            onChange={(v) => setLevelFilter(v || '')}
            placeholder="Lọc level"
            clearable
            w={150}
          />
        </Group>
      </Card>

      {/* Table */}
      <Card withBorder radius="md" p={0}>
        <Table.ScrollContainer minWidth={700}>
          <Table striped highlightOnHover verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Chủ đề</Table.Th>
                <Table.Th ta="center">Level</Table.Th>
                <Table.Th ta="center">Số từ</Table.Th>
                <Table.Th ta="center">Trạng thái</Table.Th>
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
              ) : topics.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={6}>
                    <Text ta="center" c="dimmed" py="xl">
                      Chưa có chủ đề nào.
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                topics.map((t) => (
                  <Table.Tr
                    key={t.id}
                    style={!t.active ? { opacity: 0.5 } : undefined}
                  >
                    <Table.Td>
                      <Group gap="xs">
                        <Text size="lg">{t.emoji || '📚'}</Text>
                        <div>
                          <Text size="sm" fw={500}>
                            {t.name}
                          </Text>
                        </div>
                      </Group>
                    </Table.Td>
                    <Table.Td ta="center">
                      <Badge
                        variant="light"
                        color={LEVEL_COLORS[t.level] || 'gray'}
                        size="sm"
                      >
                        {t.level}
                      </Badge>
                    </Table.Td>
                    <Table.Td ta="center">
                      <Text size="sm" fw={500}>
                        {t.wordCount}
                      </Text>
                    </Table.Td>
                    <Table.Td ta="center">
                      <Badge
                        variant="dot"
                        color={t.active ? 'green' : 'red'}
                        size="sm"
                      >
                        {t.active ? 'Hiện' : 'Ẩn'}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="xs" c="dimmed">
                        {t.createdAt}
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
                              leftSection={<IconEye size={14} />}
                              onClick={() =>
                                navigate(`/teacher/vocabulary/${t.id}`)
                              }
                            >
                              Xem từ vựng
                            </Menu.Item>
                            <Menu.Item
                              leftSection={<IconEdit size={14} />}
                              onClick={() => handleOpenEdit(t)}
                            >
                              Sửa chủ đề
                            </Menu.Item>
                            <Menu.Item
                              leftSection={<IconEye size={14} />}
                              onClick={() => handleToggleActive(t)}
                            >
                              {t.active ? 'Ẩn chủ đề' : 'Hiện chủ đề'}
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
        title={editingTopic ? 'Sửa chủ đề' : 'Tạo chủ đề mới'}
        size="md"
      >
        <Stack gap="md">
          <TextInput
            label="Tên chủ đề"
            placeholder="VD: Animals, Food & Drinks..."
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.currentTarget.value })
            }
          />
          <Textarea
            label="Mô tả"
            placeholder="Mô tả ngắn về chủ đề..."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.currentTarget.value })
            }
            autosize
            minRows={2}
          />
          <Group grow>
            <Select
              label="Level"
              data={[
                { value: 'A1', label: 'A1 - Beginner' },
                { value: 'A2', label: 'A2 - Elementary' },
                { value: 'B1', label: 'B1 - Intermediate' },
                { value: 'B2', label: 'B2 - Upper Intermediate' },
                { value: 'C1', label: 'C1 - Advanced' },
                { value: 'C2', label: 'C2 - Proficiency' },
              ]}
              required
              value={formData.level}
              onChange={(v) =>
                setFormData({ ...formData, level: (v || 'A1') as WordLevel })
              }
            />
            <TextInput
              label="Emoji"
              placeholder="🐱"
              value={formData.emoji}
              onChange={(e) =>
                setFormData({ ...formData, emoji: e.currentTarget.value })
              }
            />
          </Group>
          {editingTopic && (
            <Switch
              label="Hiển thị cho học viên"
              checked={formData.active ?? editingTopic.active}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  active: e.currentTarget.checked,
                })
              }
            />
          )}
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
  );
};

export default TeacherVocabularyPage;
