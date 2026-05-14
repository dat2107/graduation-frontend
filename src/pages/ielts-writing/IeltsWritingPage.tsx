import { useEffect, useState } from 'react'
import { Badge, Card, Group, SimpleGrid, Skeleton, Stack, Tabs, Text, ThemeIcon, Title, Button } from '@mantine/core'
import { IconClock, IconPencil, IconListCheck } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { IeltsWritingService } from '@/services/ieltsWriting/ieltsWriting.service'
import type { IeltsWritingTask, IeltsWritingTaskType } from '@/@types/ieltsWriting'

const taskTypeConfig: Record<IeltsWritingTaskType, { label: string; color: string }> = {
  TASK_1: { label: 'Task 1', color: 'blue' },
  TASK_2: { label: 'Task 2', color: 'grape' },
}

const IeltsWritingPage = () => {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState<IeltsWritingTask[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>('all')

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      const params = activeTab === 'all' ? undefined : { taskType: activeTab }
      const res = await IeltsWritingService.getTasks(params)
      if (res?.status === 200 && res.data) setTasks(res.data)
      setLoading(false)
    }
    fetch()
  }, [activeTab])

  return (
    <Stack gap="xl" p="md">
      <div>
        <Title order={2}>IELTS Writing Practice</Title>
        <Text c="dimmed" size="sm" mt={4}>Luyện viết IELTS Task 1 và Task 2 với AI chấm điểm theo chuẩn IELTS</Text>
      </div>

      <Tabs value={activeTab} onChange={(v) => setActiveTab(v ?? 'all')} variant="pills">
        <Tabs.List>
          <Tabs.Tab value="all">Tất cả</Tabs.Tab>
          <Tabs.Tab value="TASK_1">Task 1</Tabs.Tab>
          <Tabs.Tab value="TASK_2">Task 2</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      {loading ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {[1, 2, 3].map((i) => <Skeleton key={i} height={200} radius="md" />)}
        </SimpleGrid>
      ) : tasks.length === 0 ? (
        <Stack align="center" py="xl">
          <Text c="dimmed">Chưa có đề bài nào</Text>
        </Stack>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {tasks.map((task) => {
            const cfg = taskTypeConfig[task.taskType]
            return (
              <Card key={task.id} withBorder radius="md" shadow="xs" p="lg">
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Badge color={cfg.color} variant="filled">{cfg.label}</Badge>
                    {task.topic && <Badge color="gray" variant="light">{task.topic}</Badge>}
                  </Group>
                  <Text fw={600} lineClamp={2}>{task.title}</Text>
                  <Text size="sm" c="dimmed" lineClamp={2}>{task.promptText}</Text>
                  <Group gap="lg">
                    <Group gap={4}>
                      <IconClock size={14} color="var(--mantine-color-gray-6)" />
                      <Text size="xs" c="dimmed">{task.timeLimitMinutes} phút</Text>
                    </Group>
                    <Group gap={4}>
                      <IconPencil size={14} color="var(--mantine-color-gray-6)" />
                      <Text size="xs" c="dimmed">Tối thiểu {task.minWords} từ</Text>
                    </Group>
                  </Group>
                  <Button
                    variant="light"
                    color={cfg.color}
                    fullWidth
                    leftSection={<IconListCheck size={16} />}
                    onClick={() => navigate(`/ielts-writing/exam/${task.id}`)}
                  >
                    Làm bài
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

export default IeltsWritingPage
