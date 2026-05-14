import { useEffect, useState } from 'react'
import {
  Badge,
  Button,
  Card,
  Group,
  Progress,
  SimpleGrid,
  Skeleton,
  Stack,
  Tabs,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import {
  IconBook,
  IconCheck,
  IconClock,
  IconFlame,
  IconHeadphones,
  IconListCheck,
  IconStar,
  IconTrophy,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { IeltsService } from '@/services/ielts/ielts.service';
import type {
  IeltsDifficulty,
  IeltsHistoryItem,
  IeltsSkill,
  IeltsTest,
} from '@/@types/ielts';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const difficultyConfig: Record<IeltsDifficulty, { label: string; color: string }> = {
  easy: { label: 'Dễ', color: 'green' },
  medium: { label: 'Trung bình', color: 'yellow' },
  hard: { label: 'Khó', color: 'red' },
}

const skillConfig: Record<IeltsSkill, { label: string; icon: typeof IconBook; color: string }> = {
  reading: { label: 'Reading', icon: IconBook, color: 'blue' },
  listening: { label: 'Listening', icon: IconHeadphones, color: 'violet' },
}

const SKILL_TABS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'reading', label: 'Reading' },
  { value: 'listening', label: 'Listening' },
  { value: 'writing', label: 'Writing' },
  { value: 'speaking', label: 'Speaking' },
]

// ─── Test Card ───────────────────────────────────────────────────────────────

function IeltsTestCard({
  test,
  onClick,
}: {
  test: IeltsTest;
  onClick: () => void;
}) {
  const skill = skillConfig[test.skill] ?? {
    label: test.skill ?? 'Unknown',
    icon: IconBook,
    color: 'gray',
  };

  const diff = difficultyConfig[test.difficulty] ?? {
    label: test.difficulty ?? 'Unknown',
    color: 'gray',
  };

  const SkillIcon = skill.icon;
  const isNew = (test.completedCount ?? 0) === 0;

  return (
    <Card
      withBorder
      radius="md"
      shadow="xs"
      p={0}
      style={{ overflow: 'hidden' }}
    >
      <Card.Section
        style={{
          background: `var(--mantine-color-${skill.color}-1)`,
          padding: '16px',
          borderBottom: `2px solid var(--mantine-color-${skill.color}-3)`,
        }}
      >
        <Group justify="space-between" align="flex-start">
          <ThemeIcon size="lg" radius="md" color={skill.color} variant="light">
            <SkillIcon size={20} />
          </ThemeIcon>
          <Group gap={6}>
            <Badge size="sm" color={skill.color} variant="filled">
              {skill.label}
            </Badge>
            <Badge size="sm" color="gray" variant="light">
              Band {test.level}
            </Badge>
            <Badge size="sm" color={diff.color} variant="light">
              {diff.label}
            </Badge>
          </Group>
        </Group>
        <Text fw={700} size="md" mt={8} lineClamp={2} style={{ minHeight: 44 }}>
          {test.title}
        </Text>
      </Card.Section>

      <Stack p="md" gap="sm">
        <Text size="sm" c="dimmed" lineClamp={2} style={{ minHeight: 40 }}>
          {test.description}
        </Text>

        <Group gap="lg">
          <Group gap={4}>
            <IconListCheck size={14} color="var(--mantine-color-gray-6)" />
            <Text size="xs" c="dimmed">
              {test.questionCount} câu
            </Text>
          </Group>
          <Group gap={4}>
            <IconClock size={14} color="var(--mantine-color-gray-6)" />
            <Text size="xs" c="dimmed">
              {test.durationMinutes} phút
            </Text>
          </Group>
          {test.completedCount > 0 && (
            <Group gap={4}>
              <IconCheck size={14} color="var(--mantine-color-green-6)" />
              <Text size="xs" c="green">
                {test.completedCount} lần
              </Text>
            </Group>
          )}
        </Group>

        {test.bestScore !== null && (
          <Group gap={6} align="center">
            <IconStar size={14} color="var(--mantine-color-yellow-6)" />
            <Text size="xs" c="dimmed">
              Cao nhất:{' '}
              <Text
                span
                fw={700}
                c={
                  test.bestScore >= 80
                    ? 'green'
                    : test.bestScore >= 60
                      ? 'yellow'
                      : 'red'
                }
              >
                {test.bestScore}%
              </Text>
            </Text>
            <Progress
              value={test.bestScore}
              color={
                test.bestScore >= 80
                  ? 'green'
                  : test.bestScore >= 60
                    ? 'yellow'
                    : 'red'
              }
              size="xs"
              radius="xl"
              style={{ flex: 1 }}
            />
          </Group>
        )}

        <Button
          variant={isNew ? 'filled' : 'light'}
          color={skill.color}
          size="sm"
          fullWidth
          onClick={onClick}
          leftSection={
            isNew ? <IconListCheck size={16} /> : <IconFlame size={16} />
          }
        >
          {isNew ? 'Làm bài' : 'Làm lại'}
        </Button>
      </Stack>
    </Card>
  );
}

// ─── History Row ─────────────────────────────────────────────────────────────

function HistoryRow({ item }: { item: IeltsHistoryItem }) {
  const scoreColor =
    item.score >= 80 ? 'green' : item.score >= 60 ? 'yellow' : 'red';
  const date = new Date(item.completedAt).toLocaleDateString('vi-VN');
  const skill = skillConfig[item.skill] ?? { label: item.skill ?? 'Unknown', color: 'gray' };
  return (
    <Group
      justify="space-between"
      py={8}
      style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}
    >
      <div>
        <Group gap={6} mb={2}>
          <Badge size="xs" color={skill.color} variant="light">
            {skill.label}
          </Badge>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
        </Group>
        <Text size="xs" c="dimmed">
          {date}
        </Text>
      </div>
      <Badge color={scoreColor} variant="filled" size="md">
        {item.score}%
      </Badge>
    </Group>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function IeltsPracticePage() {
  const navigate = useNavigate();
  const [tests, setTests] = useState<IeltsTest[]>([]);
  const [history, setHistory] = useState<IeltsHistoryItem[]>([]);
  const [activeSkill, setActiveSkill] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const params = activeSkill === 'all' ? undefined : { skill: activeSkill };
      const [testsRes, historyRes] = await Promise.all([
        IeltsService.getTests(params),
        IeltsService.getHistory(),
      ]);
      if (testsRes?.status === 200 && testsRes.data) setTests(testsRes.data);
      if (historyRes?.status === 200 && historyRes.data)
        setHistory(historyRes.data);
      setLoading(false);
    };
    fetch();
  }, [activeSkill]);

  const doneCount = tests.filter((t) => t.completedCount > 0).length;
  const avgScore =
    history.length > 0
      ? Math.round(
          history.reduce((sum, h) => sum + h.score, 0) / history.length
        )
      : 0;

  return (
    <Stack gap="xl" p="md">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div>
        <Title order={2}>Luyện đề IELTS</Title>
        <Text c="dimmed" size="sm" mt={4}>
          Luyện tập Reading và Listening theo chuẩn đề thi IELTS
        </Text>
      </div>

      {/* ── Stats row ──────────────────────────────────────────────────── */}
      <SimpleGrid cols={{ base: 3 }} spacing="sm">
        {[
          {
            icon: <IconListCheck size={18} />,
            label: 'Bài có sẵn',
            value: tests.length,
            color: 'blue',
          },
          {
            icon: <IconCheck size={18} />,
            label: 'Đã hoàn thành',
            value: doneCount,
            color: 'green',
          },
          {
            icon: <IconTrophy size={18} />,
            label: 'Điểm TB',
            value: history.length > 0 ? `${avgScore}%` : '—',
            color: 'orange',
          },
        ].map((s) => (
          <Card key={s.label} withBorder radius="md" p="md">
            <Group gap="sm">
              <ThemeIcon size="lg" radius="md" color={s.color} variant="light">
                {s.icon}
              </ThemeIcon>
              <div>
                <Text size="xl" fw={700} lh={1}>
                  {s.value}
                </Text>
                <Text size="xs" c="dimmed">
                  {s.label}
                </Text>
              </div>
            </Group>
          </Card>
        ))}
      </SimpleGrid>

      {/* ── Skill filter ─────────────────────────────────────────────── */}
      <Tabs
        value={activeSkill}
        onChange={(v) => {
          const val = v ?? 'all'
          if (val === 'writing') { navigate('/ielts-writing'); return }
          if (val === 'speaking') { navigate('/ielts-speaking'); return }
          setActiveSkill(val)
        }}
        variant="pills"
      >
        <Tabs.List>
          {SKILL_TABS.map((t) => (
            <Tabs.Tab key={t.value} value={t.value}>
              {t.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>

      {/* ── Test grid ────────────────────────────────────────────────── */}
      {loading ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} height={280} radius="md" />
          ))}
        </SimpleGrid>
      ) : tests.length === 0 ? (
        <Stack align="center" py="xl">
          <Text size="3rem">📭</Text>
          <Text c="dimmed">Không có bài thi nào cho kỹ năng này</Text>
        </Stack>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {tests.map((test) => (
            <IeltsTestCard
              key={test.id}
              test={test}
              onClick={() => navigate(`/ielts-practice/${test.id}`)}
            />
          ))}
        </SimpleGrid>
      )}

      {/* ── History ──────────────────────────────────────────────────── */}
      {history.length > 0 && (
        <Stack gap="sm">
          <Title order={4}>Lịch sử làm bài gần đây</Title>
          <Card withBorder radius="md" p="md">
            {history.map((item, i) => (
              <HistoryRow key={i} item={item} />
            ))}
          </Card>
        </Stack>
      )}
    </Stack>
  );
}
