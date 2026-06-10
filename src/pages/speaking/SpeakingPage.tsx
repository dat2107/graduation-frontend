import { useEffect, useState } from 'react'
import { Badge, Button, Card, Group, SimpleGrid, Skeleton, Stack, Tabs, Text, ThemeIcon, Title } from '@mantine/core'
import { IconBook, IconMessageCircle, IconMicrophone, IconPhoto, IconSparkles } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { SpeakingService } from '@/services/speaking/speaking.service'
import type { SpeakingTopic, SpeakingPromptType, SpeakingDifficulty } from '@/@types/speaking'

const promptTypeConfig: Record<
  SpeakingPromptType,
  { label: string; color: string; icon: typeof IconMicrophone }
> = {
  READ_ALOUD: { label: 'Đọc to', color: 'blue', icon: IconBook },
  DESCRIBE_IMAGE: { label: 'Mô tả hình', color: 'teal', icon: IconPhoto },
  FREE_SPEAK: { label: 'Nói tự do', color: 'grape', icon: IconMicrophone },
  ANSWER_QUESTION: { label: 'Trả lời câu hỏi', color: 'orange', icon: IconMessageCircle },
}

const difficultyConfig: Record<SpeakingDifficulty, { label: string; color: string }> = {
  EASY: { label: 'Dễ', color: 'green' },
  MEDIUM: { label: 'Trung bình', color: 'yellow' },
  HARD: { label: 'Khó', color: 'red' },
}

const SpeakingPage = () => {
  const navigate = useNavigate()
  const [topics, setTopics] = useState<SpeakingTopic[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>('all')

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      const params = activeTab === 'all' ? undefined : { promptType: activeTab }
      const res = await SpeakingService.getTopics(params)
      if (res?.status === 200 && res.data) setTopics(res.data)
      setLoading(false)
    }
    fetch()
  }, [activeTab])

  return (
    <Stack gap="xl" p="md">
      <div>
        <Title order={2}>Luyện Nói</Title>
        <Text c="dimmed" size="sm" mt={4}>Luyện phát âm và kỹ năng nói tiếng Anh với AI chấm điểm</Text>
      </div>

      <Tabs value={activeTab} onChange={(v) => setActiveTab(v ?? 'all')} variant="pills">
        <Tabs.List>
          <Tabs.Tab value="all">Tất cả</Tabs.Tab>
          <Tabs.Tab value="READ_ALOUD">Đọc to</Tabs.Tab>
          <Tabs.Tab value="DESCRIBE_IMAGE">Mô tả hình</Tabs.Tab>
          <Tabs.Tab value="FREE_SPEAK">Nói tự do</Tabs.Tab>
          <Tabs.Tab value="ANSWER_QUESTION">Trả lời</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      {loading ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {[1, 2, 3].map((i) => <Skeleton key={i} height={200} radius="md" />)}
        </SimpleGrid>
      ) : topics.length === 0 ? (
        <Stack align="center" py="xl">
          <Text c="dimmed">Chưa có chủ đề nào</Text>
        </Stack>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {topics.map((topic) => {
            const ptCfg = promptTypeConfig[topic.promptType]
            const diffCfg = difficultyConfig[topic.difficulty]
            const PtIcon = ptCfg.icon
            return (
              <Card key={topic.id} withBorder radius="md" shadow="xs" p={0} style={{ overflow: 'hidden' }}>
                <Card.Section
                  style={{
                    background: `var(--mantine-color-${ptCfg.color}-1)`,
                    padding: '16px',
                    borderBottom: `2px solid var(--mantine-color-${ptCfg.color}-3)`,
                  }}
                >
                  <Group justify="space-between" align="flex-start">
                    <ThemeIcon size="lg" radius="md" color={ptCfg.color} variant="filled">
                      <PtIcon size={20} />
                    </ThemeIcon>
                    <Badge size="sm" color={diffCfg.color} variant="light">{diffCfg.label}</Badge>
                  </Group>
                  <Text fw={700} size="md" mt={8} lineClamp={1}>{topic.title}</Text>
                </Card.Section>

                <Stack p="md" gap="sm">
                  <Group gap={6}>
                    <Badge size="sm" color={ptCfg.color} variant="filled">{ptCfg.label}</Badge>
                    {topic.category && <Badge size="sm" color="gray" variant="light">{topic.category}</Badge>}
                  </Group>

                  <Text size="sm" c="dimmed" lineClamp={2} style={{ minHeight: 40 }}>
                    {topic.promptText}
                  </Text>

                  <Group gap={4}>
                    <IconSparkles size={14} color="var(--mantine-color-grape-6)" />
                    <Text size="xs" c="dimmed">AI chấm phát âm, trôi chảy & ngữ pháp</Text>
                  </Group>

                  <Button
                    variant="filled"
                    color={ptCfg.color}
                    size="sm"
                    fullWidth
                    leftSection={<IconMicrophone size={16} />}
                    onClick={() => navigate(`/speaking/practice/${topic.id}`)}
                  >
                    Luyện nói
                  </Button>
                </Stack>
              </Card>
            )
          })}
        </SimpleGrid>
      )}
    </Stack>
  )
}

export default SpeakingPage
