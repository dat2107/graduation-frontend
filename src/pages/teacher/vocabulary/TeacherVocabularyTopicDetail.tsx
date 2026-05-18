import { useCallback, useEffect, useState } from 'react';
import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Breadcrumbs,
  Anchor,
  Button,
  Card,
  FileButton,
  Group,
  Loader,
  Menu,
  Modal,
  Pagination,
  Select,
  Skeleton,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useDisclosure, useDebouncedValue } from '@mantine/hooks';
import {
  IconAlertCircle,
  IconArrowLeft,
  IconCheck,
  IconDotsVertical,
  IconEdit,
  IconPlus,
  IconSearch,
  IconUpload,
  IconTrash,
} from '@tabler/icons-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { VocabularyService } from '@/services/vocabulary/vocabulary.service';
import type {
  VocabWordManage,
  WordLevel,
  PartOfSpeech,
  CreateVocabWordRequest,
  VocabTopicManage,
} from '@/@types/vocabulary';

// ─── Constants ───────────────────────────────────────────────────────────────

const LEVEL_COLORS: Record<string, string> = {
  A1: 'green',
  A2: 'lime',
  B1: 'yellow',
  B2: 'orange',
  C1: 'red',
  C2: 'grape',
};

const POS_OPTIONS = [
  { value: 'noun', label: 'Noun' },
  { value: 'verb', label: 'Verb' },
  { value: 'adjective', label: 'Adjective' },
  { value: 'adverb', label: 'Adverb' },
  { value: 'preposition', label: 'Preposition' },
  { value: 'phrase', label: 'Phrase' },
];

const LEVEL_OPTIONS = [
  { value: 'A1', label: 'A1' },
  { value: 'A2', label: 'A2' },
  { value: 'B1', label: 'B1' },
  { value: 'B2', label: 'B2' },
  { value: 'C1', label: 'C1' },
  { value: 'C2', label: 'C2' },
];

const PAGE_SIZE = 15;

const emptyForm: CreateVocabWordRequest = {
  word: '',
  phonetic: '',
  meaning: '',
  example: '',
  level: 'A1',
};

// ─── Component ───────────────────────────────────────────────────────────────

const TeacherVocabularyTopicDetail = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const numericTopicId = Number(topicId);

  const [topicInfo, setTopicInfo] = useState<VocabTopicManage | null>(null);
  const [words, setWords] = useState<VocabWordManage[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 400);
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Modal
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  const [editingWord, setEditingWord] = useState<VocabWordManage | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [dictionaryLoading, setDictionaryLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState<CreateVocabWordRequest>(emptyForm);

  // ─── Fetch topic info ──────────────────────────────────────────────────────
  useEffect(() => {
    const fetchTopic = async () => {
      if (!Number.isFinite(numericTopicId)) return;

      try {
        const resp = await VocabularyService.getTopicForManage(numericTopicId);
        setTopicInfo(resp.data);
      } catch {
        setTopicInfo(null);
      }
    };
    fetchTopic();
  }, [numericTopicId]);

  // ─── Fetch words ───────────────────────────────────────────────────────────
  const fetchWords = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await VocabularyService.getWordsForManage(numericTopicId, {
        page: page - 1,
        size: PAGE_SIZE,
        search: debouncedSearch || undefined,
      });
      const { data } = resp;
      setWords(data.items);
      setTotalItems(data.totalItems);
      setTotalPages(data.totalPages);
    } catch {
      setAlert({ type: 'error', message: 'Không thể tải danh sách từ vựng' });
    } finally {
      setLoading(false);
    }
  }, [numericTopicId, page, debouncedSearch]);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // ─── Modal handlers ────────────────────────────────────────────────────────
  const handleOpenCreate = () => {
    setEditingWord(null);
    setFormData({ ...emptyForm, level: words[0]?.level || 'A1' });
    openModal();
  };

  const handleOpenEdit = (w: VocabWordManage) => {
    setEditingWord(w);
    setFormData({
      word: w.word,
      phonetic: w.phonetic || '',
      partOfSpeech: w.partOfSpeech || undefined,
      meaning: w.meaning,
      example: w.example || '',
      level: w.level,
      audioUrl: w.audioUrl || '',
      imageUrl: w.imageUrl || '',
    });
    openModal();
  };

  const handleLookupDictionary = async () => {
    const word = formData.word.trim();

    if (!word) {
      setAlert({
        type: 'error',
        message: 'Nhập từ vựng trước khi tra từ điển',
      });
      return;
    }

    setDictionaryLoading(true);
    try {
      const lookupData = await VocabularyService.lookupDictionaryWord(word);

      setFormData((current) => ({
        ...current,
        phonetic: current.phonetic || lookupData.phonetic || '',
        partOfSpeech: current.partOfSpeech || lookupData.partOfSpeech,
        meaning: current.meaning || lookupData.meaning || '',
        example: current.example || lookupData.example || '',
        audioUrl: current.audioUrl || lookupData.audioUrl || '',
      }));
      setAlert({ type: 'success', message: `Đã lấy dữ liệu cho "${word}"` });
    } catch {
      setAlert({
        type: 'error',
        message: `Không tìm thấy dữ liệu từ điển cho "${word}"`,
      });
    } finally {
      setDictionaryLoading(false);
    }
  };

  const handleImageFileChange = async (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAlert({ type: 'error', message: 'Chỉ hỗ trợ upload file ảnh' });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setAlert({ type: 'error', message: 'Ảnh không được vượt quá 2MB' });
      return;
    }

    setImageUploading(true);
    try {
      const resp = await VocabularyService.uploadWordImage(file);
      setFormData((current) => ({
        ...current,
        imageUrl: resp.data,
      }));
      setAlert({ type: 'success', message: `Đã upload ảnh "${file.name}"` });
    } catch {
      setAlert({ type: 'error', message: 'Không thể upload ảnh lên MinIO' });
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.word.trim() || !formData.meaning.trim()) {
      setAlert({
        type: 'error',
        message: 'Từ vựng và nghĩa không được để trống',
      });
      return;
    }
    setFormLoading(true);
    try {
      if (editingWord) {
        await VocabularyService.updateWord(editingWord.id, formData);
        setAlert({
          type: 'success',
          message: `Đã cập nhật "${formData.word}"`,
        });
      } else {
        await VocabularyService.createWord(numericTopicId, formData);
        setAlert({ type: 'success', message: `Đã thêm "${formData.word}"` });
      }
      closeModal();
      fetchWords();
    } catch {
      setAlert({
        type: 'error',
        message: editingWord ? 'Không thể cập nhật' : 'Không thể thêm từ',
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (w: VocabWordManage) => {
    setActionLoading(w.id);
    try {
      await VocabularyService.deleteWord(w.id);
      setAlert({ type: 'success', message: `Đã xóa "${w.word}"` });
      fetchWords();
    } catch {
      setAlert({ type: 'error', message: 'Không thể xóa từ' });
    } finally {
      setActionLoading(null);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <Box p="lg">
      {/* Breadcrumb */}
      <Breadcrumbs mb="md">
        <Anchor component={Link} to="/teacher/vocabulary" size="sm">
          QL Từ vựng
        </Anchor>
        <Text size="sm">Chi tiết chủ đề</Text>
      </Breadcrumbs>

      {/* Header */}
      <Group justify="space-between" mb="lg">
        <Group>
          <ActionIcon
            variant="subtle"
            onClick={() => navigate('/teacher/vocabulary')}
          >
            <IconArrowLeft size={20} />
          </ActionIcon>
          <Stack gap={2}>
            <Title order={2}>
              Từ vựng trong chủ đề {topicInfo?.name ?? `#${topicId}`}
            </Title>
            <Text c="dimmed" size="sm">
              {totalItems} từ
            </Text>
          </Stack>
        </Group>
        <Button leftSection={<IconPlus size={16} />} onClick={handleOpenCreate}>
          Thêm từ
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

      {/* Search */}
      <Card withBorder radius="md" mb="lg" p="md">
        <TextInput
          placeholder="Tìm từ vựng..."
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
      </Card>

      {/* Table */}
      <Card withBorder radius="md" p={0}>
        <Table.ScrollContainer minWidth={800}>
          <Table striped highlightOnHover verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Từ vựng</Table.Th>
                <Table.Th>Phiên âm</Table.Th>
                <Table.Th ta="center">Loại từ</Table.Th>
                <Table.Th>Nghĩa</Table.Th>
                <Table.Th>Ví dụ</Table.Th>
                <Table.Th ta="center">Level</Table.Th>
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
              ) : words.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={7}>
                    <Text ta="center" c="dimmed" py="xl">
                      Chưa có từ nào. Bấm "Thêm từ" để bắt đầu.
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                words.map((w) => (
                  <Table.Tr key={w.id}>
                    <Table.Td>
                      <Text size="sm" fw={600}>
                        {w.word}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        {w.phonetic || '—'}
                      </Text>
                    </Table.Td>
                    <Table.Td ta="center">
                      {w.partOfSpeech ? (
                        <Badge variant="outline" size="xs">
                          {w.partOfSpeech}
                        </Badge>
                      ) : (
                        <Text size="xs" c="dimmed">
                          —
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" lineClamp={1} maw={200}>
                        {w.meaning}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text
                        size="xs"
                        c="dimmed"
                        lineClamp={1}
                        maw={200}
                        fs="italic"
                      >
                        {w.example || '—'}
                      </Text>
                    </Table.Td>
                    <Table.Td ta="center">
                      <Badge
                        variant="light"
                        color={LEVEL_COLORS[w.level] || 'gray'}
                        size="xs"
                      >
                        {w.level}
                      </Badge>
                    </Table.Td>
                    <Table.Td ta="center">
                      {actionLoading === w.id ? (
                        <Loader size="xs" />
                      ) : (
                        <Menu shadow="md" width={160} position="bottom-end">
                          <Menu.Target>
                            <ActionIcon variant="subtle" color="gray" size="sm">
                              <IconDotsVertical size={16} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item
                              leftSection={<IconEdit size={14} />}
                              onClick={() => handleOpenEdit(w)}
                            >
                              Sửa
                            </Menu.Item>
                            <Menu.Item
                              leftSection={<IconTrash size={14} />}
                              color="red"
                              onClick={() => handleDelete(w)}
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

      {/* Create/Edit Word Modal */}
      <Modal
        opened={modalOpened}
        onClose={closeModal}
        title={editingWord ? `Sửa "${editingWord.word}"` : 'Thêm từ mới'}
        size="lg"
      >
        <Stack gap="md">
          <Group align="flex-end">
            <TextInput
              label="Từ vựng"
              placeholder="VD: apple, run, beautiful..."
              required
              style={{ flex: 1 }}
              value={formData.word}
              onChange={(e) =>
                setFormData({ ...formData, word: e.currentTarget.value })
              }
            />
            <Button
              variant="light"
              leftSection={<IconSearch size={16} />}
              loading={dictionaryLoading}
              disabled={!formData.word.trim()}
              onClick={handleLookupDictionary}
            >
              Tra từ
            </Button>
            <TextInput
              label="Phiên âm"
              placeholder="/ˈæp.əl/"
              style={{ flex: 1 }}
              value={formData.phonetic}
              onChange={(e) =>
                setFormData({ ...formData, phonetic: e.currentTarget.value })
              }
            />
          </Group>
          <Group grow>
            <Select
              label="Loại từ"
              data={POS_OPTIONS}
              value={formData.partOfSpeech || null}
              onChange={(v) =>
                setFormData({
                  ...formData,
                  partOfSpeech: (v || undefined) as PartOfSpeech | undefined,
                })
              }
              clearable
              placeholder="Chọn loại từ"
            />
            <Select
              label="Level"
              data={LEVEL_OPTIONS}
              required
              value={formData.level}
              onChange={(v) =>
                setFormData({ ...formData, level: (v || 'A1') as WordLevel })
              }
            />
          </Group>
          <TextInput
            label="Nghĩa"
            placeholder="Nghĩa tiếng Việt"
            required
            value={formData.meaning}
            onChange={(e) =>
              setFormData({ ...formData, meaning: e.currentTarget.value })
            }
          />
          <TextInput
            label="Ví dụ"
            placeholder="VD: I eat an apple every day."
            value={formData.example}
            onChange={(e) =>
              setFormData({ ...formData, example: e.currentTarget.value })
            }
          />
          <Group grow align="flex-end">
            <TextInput
              label="Audio URL"
              placeholder="https://..."
              value={formData.audioUrl}
              onChange={(e) =>
                setFormData({ ...formData, audioUrl: e.currentTarget.value })
              }
            />
            <TextInput
              label="Image URL"
              placeholder="Dán URL hoặc bấm icon để upload"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.currentTarget.value })
              }
              rightSectionWidth={36}
              rightSection={
                <FileButton
                  onChange={handleImageFileChange}
                  accept="image/png,image/jpeg,image/webp,image/gif"
                >
                  {(props) => (
                    <ActionIcon
                      {...props}
                      variant="subtle"
                      color="blue"
                      disabled={imageUploading}
                      aria-label="Upload ảnh"
                    >
                      {imageUploading ? (
                        <Loader size={14} />
                      ) : (
                        <IconUpload size={16} />
                      )}
                    </ActionIcon>
                  )}
                </FileButton>
              }
            />
          </Group>
          <Group justify="flex-end" mt="sm">
            <Button variant="default" onClick={closeModal}>
              Hủy
            </Button>
            <Button onClick={handleSubmit} loading={formLoading}>
              {editingWord ? 'Cập nhật' : 'Thêm từ'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
};

export default TeacherVocabularyTopicDetail;
