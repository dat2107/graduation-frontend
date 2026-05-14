import { useEffect, useState } from 'react'
import { Badge, Button, Card, Group, SimpleGrid, Skeleton, Stack, Tabs, Text, Title } from '@mantine/core'
import { IconMicrophone, IconClock } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { SpeakingService } from '@/services/speaking/speaking.service'
import type { SpeakingTopic, SpeakingPromptType, SpeakingDifficulty } from '@/@types/speaking'

const promptTypeConfig: Record<SpeakingPromptType, { label: string; color: string }> = {
  READ_ALOUD: { label: 'Đọc to', color: 'blue' },
  DESCRIBE_IMAGE: { label: 'Mô tả hình', color: 'teal' },
  FREE_SPEAK: { label: 'Nói tự do', color: 'grape' },
  ANSWER_QUESTION: { label: 'Trả lời câu hỏi', color: 'orange' },
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
        <Title order={2}>Luyện Nói (Speaking)</Title>
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
            return (
              <Card key={topic.id} withBorder radius="md" shadow="xs" p="lg">
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Badge color={ptCfg.color} variant="filled">{ptCfg.label}</Badge>
                    <Badge color={diffCfg.color} variant="light">{diffCfg.label}</Badge>
                  </Group>
                  {topic.category && <Badge color="gray" variant="light" size="sm">{topic.category}</Badge>}
                  <Text fw={600} lineClamp={2}>{topic.title}</Text>
                  <Text size="sm" c="dimmed" lineClamp={2}>{topic.promptText}</Text>
                  <Button
                    variant="light"
                    color={ptCfg.color}
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
