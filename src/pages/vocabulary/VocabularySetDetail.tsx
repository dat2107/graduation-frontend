import { useEffect, useState } from 'react'
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Loader,
  Progress,
  RingProgress,
  Stack,
  Table,
  Tabs,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import {
  IconArrowLeft,
  IconCheck,
  IconChevronRight,
  IconRefresh,
  IconRotate,
  IconTrophy,
} from '@tabler/icons-react'
import { useNavigate, useParams } from 'react-router-dom'
import { VocabularyService } from '@/services/vocabulary/vocabulary.service'
import type { VocabSetDetail, VocabWord, WordLevel, WordStatus } from '@/@types/vocabulary'
import styles from './Flashcard.module.css'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const levelColor: Record<WordLevel, string> = {
  A1: 'green', A2: 'teal', B1: 'blue', B2: 'violet', C1: 'orange', C2: 'red',
}

const statusConfig: Record<WordStatus, { label: string; color: string }> = {
  new: { label: 'Mới', color: 'gray' },
  learning: { label: 'Đang học', color: 'blue' },
  mastered: { label: 'Thuộc', color: 'green' },
}

const posLabel: Record<string, string> = {
  noun: 'danh từ', verb: 'động từ', adjective: 'tính từ',
  adverb: 'trạng từ', preposition: 'giới từ', phrase: 'cụm từ',
}

// ─── Word List Tab ────────────────────────────────────────────────────────────

function WordListTab({ words }: { words: VocabWord[] }) {
  return (
    <Box style={{ overflowX: 'auto' }}>
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: 40 }}>#</Table.Th>
            <Table.Th>Từ</Table.Th>
            <Table.Th>Phiên âm</Table.Th>
            <Table.Th>Từ loại</Table.Th>
            <Table.Th>Nghĩa</Table.Th>
            <Table.Th>Ví dụ</Table.Th>
            <Table.Th>Trạng thái</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {words.map((w, idx) => {
            const st = statusConfig[w.status]
            return (
              <Table.Tr key={w.id}>
                <Table.Td c="dimmed">{idx + 1}</Table.Td>
                <Table.Td>
                  <Text fw={700} size="sm">{w.word}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" c="dimmed" ff="monospace">{w.phonetic}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="xs" c="dimmed">{posLabel[w.partOfSpeech] ?? w.partOfSpeech}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{w.meaning}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="xs" c="dimmed" fs="italic" style={{ maxWidth: 260 }}>
                    {w.example}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Badge size="sm" color={st.color} variant="light">{st.label}</Badge>
                </Table.Td>
              </Table.Tr>
            )
          })}
        </Table.Tbody>
      </Table>
    </Box>
  )
}

// ─── Flashcard Tab ────────────────────────────────────────────────────────────

function FlashcardTab({ words, setId }: { words: VocabWord[]; setId: string }) {
  const [current, setCurrent] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [results, setResults] = useState<Record<string, number>>({})
  const [sessionDone, setSessionDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const word = words[current]
  const reviewed = Object.keys(results).length
  const progressPct = Math.round((reviewed / words.length) * 100)

  const handleFlip = () => setIsFlipped((f) => !f)

  const handleRate = async (quality: 0 | 1 | 2 | 3) => {
    if (submitting || !word) return
    setSubmitting(true)
    try {
      await VocabularyService.reviewFlashcard({ wordId: word.id, quality })
      setResults((prev) => ({ ...prev, [word.id]: quality }))

      if (current + 1 >= words.length) {
        setSessionDone(true)
      } else {
        setCurrent((c) => c + 1)
        setIsFlipped(false)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleRestart = () => {
    setCurrent(0)
    setIsFlipped(false)
    setResults({})
    setSessionDone(false)
  }

  // ── Session Done Screen ────────────────────────────────────────────────────
  if (sessionDone) {
    const goodCount = Object.values(results).filter((q) => q >= 2).length
    const pct = Math.round((goodCount / words.length) * 100)
    return (
      <Stack align="center" gap="lg" py="xl">
        <ThemeIcon size={80} radius="50%" color="green" variant="light">
          <IconTrophy size={40} />
        </ThemeIcon>
        <Title order={3}>Hoàn thành phiên học! 🎉</Title>
        <RingProgress
          size={120}
          thickness={10}
          sections={[{ value: pct, color: 'green' }]}
          label={<Text ta="center" fw={700}>{pct}%</Text>}
        />
        <Stack gap={4} align="center">
          <Text size="sm" c="dimmed">
            Từ nhớ được:{' '}
            <Text span fw={700} c="green">{goodCount}</Text>/{words.length}
          </Text>
          <Text size="sm" c="dimmed">
            +{goodCount * 10} XP kiếm được
          </Text>
        </Stack>
        <Group>
          <Button
            variant="light"
            leftSection={<IconRefresh size={16} />}
            onClick={handleRestart}
          >
            Học lại
          </Button>
          <Button
            leftSection={<IconCheck size={16} />}
            onClick={handleRestart}
          >
            Tiếp tục
          </Button>
        </Group>
      </Stack>
    )
  }

  return (
    <Stack gap="lg" align="center">
      {/* Progress bar */}
      <Box w="100%" maw={560}>
        <Group justify="space-between" mb={6}>
          <Text size="sm" c="dimmed">
            {current + 1} / {words.length}
          </Text>
          <Text size="sm" c="dimmed">
            {reviewed} đã ôn
          </Text>
        </Group>
        <Progress value={progressPct} color="blue" size="sm" radius="xl" />
      </Box>

      {/* Flip card */}
      <div className={styles.scene} onClick={handleFlip} role="button" aria-label="Lật thẻ">
        <div className={`${styles.card} ${isFlipped ? styles.flipped : ''}`}>
          {/* Front — word */}
          <div className={`${styles.face} ${styles.front}`}>
            <Text size="xs" c="dimmed" mb={8} tt="uppercase" fw={600} style={{ letterSpacing: 1 }}>
              <Badge size="sm" color={levelColor[word.level]} variant="light">
                {word.level}
              </Badge>
            </Text>
            <Text size="2rem" fw={800} ta="center" lh={1.2}>
              {word.word}
            </Text>
            <Text size="md" c="dimmed" mt={8} ff="monospace">
              {word.phonetic}
            </Text>
            <Text size="xs" c="blue.4" mt={4}>
              {posLabel[word.partOfSpeech] ?? word.partOfSpeech}
            </Text>
            <span className={styles.hintText}>
              <IconRotate size={12} /> nhấn để xem nghĩa
            </span>
          </div>

          {/* Back — meaning */}
          <div className={`${styles.face} ${styles.back}`}>
            <Text size="xs" c="green.6" fw={700} mb={8}>
              {word.word}
            </Text>
            <Text size="1.5rem" fw={700} ta="center" lh={1.3} c="green.8">
              {word.meaning}
            </Text>
            <Text size="sm" c="dimmed" mt={12} fs="italic" ta="center" maw={400}>
              "{word.example}"
            </Text>
            <span className={styles.hintText}>
              <IconRotate size={12} /> nhấn để lật lại
            </span>
          </div>
        </div>
      </div>

      {/* Rating buttons — only show after flip */}
      {isFlipped ? (
        <Stack gap="xs" w="100%" maw={560}>
          <Text size="xs" c="dimmed" ta="center">
            Bạn nhớ từ này ở mức nào?
          </Text>
          <Group grow>
            <Button
              variant="light" color="red" size="sm"
              disabled={submitting}
              onClick={() => handleRate(0)}
            >
              😰 Quên
            </Button>
            <Button
              variant="light" color="orange" size="sm"
              disabled={submitting}
              onClick={() => handleRate(1)}
            >
              😅 Khó
            </Button>
            <Button
              variant="light" color="blue" size="sm"
              disabled={submitting}
              onClick={() => handleRate(2)}
            >
              🙂 Được
            </Button>
            <Button
              variant="light" color="green" size="sm"
              disabled={submitting}
              onClick={() => handleRate(3)}
            >
              😄 Dễ
            </Button>
          </Group>
        </Stack>
      ) : (
        <Button
          variant="subtle"
          rightSection={<IconChevronRight size={16} />}
          onClick={handleFlip}
          size="sm"
        >
          Xem nghĩa
        </Button>
      )}
    </Stack>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function VocabularySetDetail() {
  const { setId } = useParams<{ setId: string }>()
  const navigate = useNavigate()
  const [setDetail, setSetDetail] = useState<VocabSetDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>('list')

  useEffect(() => {
    if (!setId) return
    const fetch = async () => {
      setLoading(true)
      const res = await VocabularyService.getSetDetail(setId)
      if (res?.status === 200 && res.data) setSetDetail(res.data)
      setLoading(false)
    }
    fetch()
  }, [setId])

  if (loading) {
    return (
      <Group justify="center" mt="xl">
        <Loader />
      </Group>
    )
  }

  if (!setDetail) {
    return (
      <Stack align="center" py="xl">
        <Text c="dimmed">Không tìm thấy bộ từ vựng</Text>
        <Button variant="light" onClick={() => navigate('/vocabulary')}>
          Quay lại
        </Button>
      </Stack>
    )
  }

  const levelColor2 = levelColor[setDetail.level]
  const progressPct =
    setDetail.wordCount > 0
      ? Math.round((setDetail.learnedCount / setDetail.wordCount) * 100)
      : 0

  return (
    <Stack gap="lg" p="md">
      {/* ── Breadcrumb / Back ─────────────────────────────────────────── */}
      <Group>
        <ActionIcon variant="subtle" onClick={() => navigate('/vocabulary')}>
          <IconArrowLeft size={18} />
        </ActionIcon>
        <Text c="dimmed" size="sm">
          Từ vựng /
        </Text>
        <Text size="sm" fw={500}>
          {setDetail.name}
        </Text>
      </Group>

      {/* ── Set Header ───────────────────────────────────────────────── */}
      <Group gap="md" align="flex-start">
        <Text size="3rem" lh={1}>
          {setDetail.emoji}
        </Text>
        <Stack gap={4} style={{ flex: 1 }}>
          <Group gap="sm">
            <Title order={3}>{setDetail.name}</Title>
            <Badge color={levelColor2} variant="filled">
              {setDetail.level}
            </Badge>
            <Badge color="gray" variant="light">
              {setDetail.topic}
            </Badge>
          </Group>
          <Text size="sm" c="dimmed">
            {setDetail.description}
          </Text>
          <Group gap="xl" mt={4}>
            <Text size="sm">
              📖{' '}
              <Text span fw={600}>
                {setDetail.wordCount}
              </Text>{' '}
              từ
            </Text>
            <Text size="sm">
              🎯{' '}
              <Text span fw={600} c="blue">
                {setDetail.learnedCount}
              </Text>{' '}
              đã học
            </Text>
            <Text size="sm">
              ⭐{' '}
              <Text span fw={600} c="green">
                {setDetail.masteredCount}
              </Text>{' '}
              thuộc
            </Text>
          </Group>
          <Box maw={300} mt={4}>
            <Progress value={progressPct} color={levelColor2} size="sm" radius="xl" />
            <Text size="xs" c="dimmed" mt={2}>
              {progressPct}% hoàn thành
            </Text>
          </Box>
        </Stack>
      </Group>

      {/* ── Tabs ─────────────────────────────────────────────────────── */}
      <Tabs value={activeTab} onChange={(v) => setActiveTab(v ?? 'list')}>
        <Tabs.List>
          <Tabs.Tab value="list">📋 Danh sách từ ({setDetail.words.length})</Tabs.Tab>
          <Tabs.Tab value="flashcard">🃏 Học Flashcard</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="list" pt="md">
          <WordListTab words={setDetail.words} />
        </Tabs.Panel>

        <Tabs.Panel value="flashcard" pt="md">
          {setDetail.words.length > 0 ? (
            <FlashcardTab words={setDetail.words} setId={setDetail.id} />
          ) : (
            <Stack align="center" py="xl">
              <Text c="dimmed">Bộ từ này chưa có từ nào</Text>
            </Stack>
          )}
        </Tabs.Panel>
      </Tabs>
    </Stack>
  )
}
