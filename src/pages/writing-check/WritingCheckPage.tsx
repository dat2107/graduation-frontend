import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Group,
  Loader,
  Paper,
  RingProgress,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import {
  IconPencilCheck,
  IconSend,
  IconHistory,
  IconArrowRight,
  IconAlertTriangle,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { WritingService } from '@/services/writing/writing.service';
import { MarkdownContent } from '@/components/MarkdownContent';
import type { WritingSubmission, QuickCheckResponse } from '@/@types/writing';
import type { EnglishLevel } from '@/@types/chat';
import styles from '@/css/pages/writing-check/WritingCheckPage.module.css';

const LEVEL_OPTIONS = [
  { value: 'A1', label: 'A1 - Beginner' },
  { value: 'A2', label: 'A2 - Elementary' },
  { value: 'B1', label: 'B1 - Intermediate' },
  { value: 'B2', label: 'B2 - Upper Intermediate' },
  { value: 'C1', label: 'C1 - Advanced' },
  { value: 'C2', label: 'C2 - Proficiency' },
];

function getScoreColor(score: number | null): string {
  if (score === null) return 'gray';
  if (score >= 80) return 'green';
  if (score >= 60) return 'blue';
  if (score >= 40) return 'yellow';
  return 'red';
}

export default function WritingCheckPage() {
  // ── Form state ─────────────────────────────────────────────────────────────────
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [level, setLevel] = useState<EnglishLevel>('B1');
  const [submitting, setSubmitting] = useState(false);

  // ── Quick check (realtime) ───────────────────────────────────────────────────
  const [quickCheck, setQuickCheck] = useState<QuickCheckResponse | null>(null);
  const [checking, setChecking] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCheckedRef = useRef('');

  // ── Result state ───────────────────────────────────────────────────────────────
  const [activeSubmission, setActiveSubmission] =
    useState<WritingSubmission | null>(null);
  const [history, setHistory] = useState<WritingSubmission[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // ── Debounced quick check ────────────────────────────────────────────────────
  const triggerQuickCheck = useCallback(
    (text: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);

      // Skip if text is too short or unchanged
      if (text.trim().length < 20 || text.trim() === lastCheckedRef.current) {
        if (text.trim().length < 20) setQuickCheck(null);
        return;
      }

      // Skip if non-English content
      if (detectNonEnglish(text)) {
        setQuickCheck(null);
        return;
      }

      debounceRef.current = setTimeout(async () => {
        setChecking(true);
        try {
          const res = await WritingService.quickCheck({
            content: text.trim(),
            englishLevel: level,
          });
          if (res?.status === 200 && res.data) {
            setQuickCheck(res.data);
            lastCheckedRef.current = text.trim();
          }
        } catch {
          // silent — don't break typing flow
        } finally {
          setChecking(false);
        }
      }, 2000);
    },
    [level]
  );

  const handleContentChange = (value: string) => {
    setContent(value);
    triggerQuickCheck(value);
  };

  // Cleanup debounce on unmount
  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    []
  );

  // ── Load history ───────────────────────────────────────────────────────────────
  const loadHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const res = await WritingService.getHistory();
      if (res?.status === 200 && res.data) {
        setHistory(res.data);
      }
    } catch {
      // silent
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // ── Language validation ────────────────────────────────────────────────────────
  const detectNonEnglish = (text: string): boolean => {
    const cleaned = text.replace(/[\s\d.,!?;:'"()\-–—\[\]{}@#$%^&*+=<>/\\|~`_]/g, '');
    if (!cleaned) return false;
    const nonEnglishChars = cleaned.replace(/[a-zA-Z]/g, '').length;
    return nonEnglishChars / cleaned.length > 0.15;
  };

  // ── Submit writing ─────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!content.trim()) return;
    if (detectNonEnglish(content)) {
      notifications.show({
        title: 'Vui lòng viết bằng tiếng Anh',
        message: 'Bài viết chứa nhiều ký tự không phải tiếng Anh. Hãy viết hoàn toàn bằng tiếng Anh để AI đánh giá chính xác.',
        color: 'orange',
      });
      return;
    }
    setSubmitting(true);
    try {
      const res = await WritingService.submit({
        title: title.trim() || undefined,
        content: content.trim(),
        englishLevel: level,
      });
      if (res?.status === 200 && res.data) {
        setActiveSubmission(res.data);
        setHistory((prev) => [res.data, ...prev]);
      }
    } catch {
      // error handled by interceptor
    } finally {
      setSubmitting(false);
    }
  };

  // ── View history item ──────────────────────────────────────────────────────────
  const handleViewHistory = async (id: number) => {
    try {
      const res = await WritingService.getSubmission(id);
      if (res?.status === 200 && res.data) {
        setActiveSubmission(res.data);
      }
    } catch {
      // silent
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────────
  return (
    <Box p="lg">
      <Group mb="lg" gap="sm">
        <IconPencilCheck size={28} stroke={1.5} />
        <Title order={2}>AI Writing Check</Title>
      </Group>

      <div className={styles.pageLayout}>
        {/* ── Left: Form + History ──────────────────────────────────────── */}
        <div className={styles.formPanel}>
          <Paper p="lg" radius="md" withBorder>
            <Stack gap="md">
              <TextInput
                label="Tiêu đề (tùy chọn)"
                placeholder="VD: My favorite hobby"
                value={title}
                onChange={(e) => setTitle(e.currentTarget.value)}
              />

              <Select
                label="Trình độ tiếng Anh"
                data={LEVEL_OPTIONS}
                value={level}
                onChange={(v) => setLevel((v as EnglishLevel) || 'B1')}
                allowDeselect={false}
              />

              <Textarea
                label="Bài viết tiếng Anh"
                placeholder="Write your essay here... (AI sẽ tự động kiểm tra khi bạn ngừng gõ)"
                minRows={8}
                maxRows={16}
                autosize
                value={content}
                onChange={(e) => handleContentChange(e.currentTarget.value)}
                description={`${content.length}/5000 ký tự`}
                maxLength={5000}
              />

              {/* Inline quick check results */}
              {checking && (
                <div className={styles.checkingIndicator}>
                  <Loader size={14} />
                  <span>Đang kiểm tra...</span>
                </div>
              )}

              {!checking && quickCheck && quickCheck.errors.length > 0 && (
                <div className={styles.inlineErrors}>
                  <Group gap={6} mb={8}>
                    <IconAlertTriangle
                      size={16}
                      color="var(--mantine-color-orange-6)"
                    />
                    <Text size="sm" fw={600} c="orange.7">
                      {quickCheck.errors.length} lỗi phát hiện
                    </Text>
                  </Group>
                  {quickCheck.errors.map((err, i) => (
                    <div key={i} className={styles.errorItem}>
                      <Group gap={6} wrap="nowrap" style={{ flex: 1 }}>
                        <Badge
                          size="xs"
                          variant="light"
                          color={
                            err.type === 'GRAMMAR'
                              ? 'red'
                              : err.type === 'SPELLING'
                                ? 'orange'
                                : err.type === 'VOCABULARY'
                                  ? 'blue'
                                  : 'gray'
                          }
                        >
                          {err.type}
                        </Badge>
                        <Text size="sm">
                          <span className={styles.errorOriginal}>
                            {err.original}
                          </span>{' '}
                          <IconArrowRight
                            size={12}
                            style={{
                              display: 'inline',
                              verticalAlign: 'middle',
                            }}
                          />{' '}
                          <span className={styles.errorCorrection}>
                            {err.correction}
                          </span>
                        </Text>
                      </Group>
                      <Text size="xs" c="dimmed" style={{ flexShrink: 0 }}>
                        {err.explanation}
                      </Text>
                    </div>
                  ))}
                  {quickCheck.suggestions.length > 0 && (
                    <Text size="xs" c="dimmed" mt={8}>
                      💡 {quickCheck.suggestions.join(' • ')}
                    </Text>
                  )}
                </div>
              )}

              {!checking &&
                quickCheck &&
                quickCheck.errors.length === 0 &&
                content.trim().length >= 20 && (
                  <Text size="sm" c="green.6" fw={500}>
                    ✓ Không phát hiện lỗi
                  </Text>
                )}

              <Button
                leftSection={
                  submitting ? (
                    <Loader size={16} color="white" />
                  ) : (
                    <IconSend size={16} />
                  )
                }
                onClick={handleSubmit}
                disabled={!content.trim() || submitting}
                loading={submitting}
                fullWidth
              >
                {submitting ? 'Đang đánh giá...' : 'Gửi để AI đánh giá'}
              </Button>
            </Stack>
          </Paper>

          {/* History */}
          <Paper p="md" radius="md" withBorder mt="lg">
            <Group gap="xs" mb="sm">
              <IconHistory size={18} />
              <Text fw={600} size="sm">
                Lịch sử bài viết
              </Text>
            </Group>

            {loadingHistory ? (
              <Stack align="center" py="md">
                <Loader size="sm" />
              </Stack>
            ) : history.length === 0 ? (
              <Text size="sm" c="dimmed" ta="center" py="md">
                Chưa có bài viết nào
              </Text>
            ) : (
              <Stack gap={4}>
                {history.map((item) => (
                  <Group
                    key={item.id}
                    className={`${styles.historyItem} ${
                      activeSubmission?.id === item.id
                        ? styles.historyItemActive
                        : ''
                    }`}
                    justify="space-between"
                    wrap="nowrap"
                    onClick={() => handleViewHistory(item.id)}
                  >
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      <Text size="sm" fw={500} truncate="end">
                        {item.title || 'Untitled'}
                      </Text>
                      <Group gap={6} mt={2}>
                        <Badge size="xs" variant="light">
                          {item.englishLevel}
                        </Badge>
                        {item.overallScore !== null && (
                          <Badge
                            size="xs"
                            color={getScoreColor(item.overallScore)}
                            variant="light"
                          >
                            {item.overallScore}/100
                          </Badge>
                        )}
                      </Group>
                    </Box>
                    <Text size="xs" c="dimmed">
                      {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                    </Text>
                  </Group>
                ))}
              </Stack>
            )}
          </Paper>
        </div>

        {/* ── Right: Results ────────────────────────────────────────────── */}
        <div className={styles.resultPanel}>
          {!activeSubmission ? (
            <Paper p="xl" radius="md" withBorder>
              <Stack align="center" gap="md" py="xl">
                <IconPencilCheck
                  size={48}
                  stroke={1.2}
                  color="var(--mantine-color-dimmed)"
                />
                <Text size="lg" fw={500} c="dimmed">
                  Kết quả đánh giá
                </Text>
                <Text size="sm" c="dimmed" ta="center">
                  Viết bài tiếng Anh và gửi để AI đánh giá ngữ pháp, từ vựng,
                  tính mạch lạc và khả năng đáp ứng yêu cầu.
                </Text>
              </Stack>
            </Paper>
          ) : (
            <Stack gap="md">
              {/* Overall Score */}
              <Paper p="lg" radius="md" withBorder>
                <Group justify="center" gap="xl">
                  <RingProgress
                    size={120}
                    thickness={10}
                    roundCaps
                    sections={[
                      {
                        value: activeSubmission.overallScore ?? 0,
                        color: getScoreColor(activeSubmission.overallScore),
                      },
                    ]}
                    label={
                      <Text ta="center" fw={800} size="xl">
                        {activeSubmission.overallScore ?? '—'}
                      </Text>
                    }
                  />
                  <Box>
                    <Text fw={700} size="lg">
                      Điểm tổng
                    </Text>
                    <Text size="sm" c="dimmed">
                      {activeSubmission.englishLevel}
                    </Text>
                  </Box>
                </Group>
              </Paper>

              {/* Score Breakdown */}
              <SimpleGrid cols={{ base: 2, sm: 4 }}>
                {(
                  [
                    ['Ngữ pháp', activeSubmission.grammarScore],
                    ['Từ vựng', activeSubmission.vocabularyScore],
                    ['Mạch lạc', activeSubmission.coherenceScore],
                    ['Đáp ứng', activeSubmission.taskResponseScore],
                  ] as [string, number | null][]
                ).map(([label, score]) => (
                  <Card key={label} className={styles.scoreCard} withBorder>
                    <Text size="xs" c="dimmed" mb={4}>
                      {label}
                    </Text>
                    <Text size="xl" fw={700} c={getScoreColor(score)}>
                      {score ?? '—'}
                    </Text>
                  </Card>
                ))}
              </SimpleGrid>

              {/* Feedback */}
              {activeSubmission.feedback && (
                <Paper p="lg" radius="md" withBorder>
                  <Text fw={600} mb="sm">
                    Nhận xét chi tiết
                  </Text>
                  <Divider mb="sm" />
                  <div className={styles.feedbackText}>
                    <MarkdownContent content={activeSubmission.feedback} />
                  </div>
                </Paper>
              )}

              {/* Corrected Text */}
              {activeSubmission.correctedText && (
                <Paper p="lg" radius="md" withBorder>
                  <Text fw={600} mb="sm">
                    Bài viết đã sửa
                  </Text>
                  <Divider mb="sm" />
                  <div className={styles.correctedText}>
                    <MarkdownContent content={activeSubmission.correctedText} />
                  </div>
                </Paper>
              )}
            </Stack>
          )}
        </div>
      </div>
    </Box>
  );
}
