import { useEffect, useState } from 'react'
import { Badge, Button, Card, Group, SimpleGrid, Skeleton, Stack, Text, Title } from '@mantine/core'
import { IconMicrophone, IconListCheck } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { IeltsSpeakingService } from '@/services/ieltsSpeaking/ieltsSpeaking.service'
import type { IeltsSpeakingTest } from '@/@types/ieltsSpeaking'

const IeltsSpeakingTestList = () => {
  const navigate = useNavigate()
  const [tests, setTests] = useState<IeltsSpeakingTest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    IeltsSpeakingService.getTests().then((res) => {
      if (res?.status === 200 && res.data) setTests(res.data)
      setLoading(false)
    })
  }, [])

  return (
    <Stack gap="xl" p="md">
      <div>
        <Title order={2}>IELTS Speaking Practice</Title>
        <Text c="dimmed" size="sm" mt={4}>Luyện thi IELTS Speaking 3 phần với AI chấm điểm theo chuẩn IELTS</Text>
      </div>

      {loading ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {[1, 2, 3].map((i) => <Skeleton key={i} height={200} radius="md" />)}
        </SimpleGrid>
      ) : tests.length === 0 ? (
        <Stack align="center" py="xl">
          <Text c="dimmed">Chưa có bài thi nào</Text>
        </Stack>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {tests.map((test) => (
            <Card key={test.id} withBorder radius="md" shadow="xs" p="lg">
              <Stack gap="sm">
                <Group justify="space-between">
                  <Badge color="violet" variant="filled">IELTS Speaking</Badge>
                  {test.topic && <Badge color="gray" variant="light">{test.topic}</Badge>}
                </Group>
                <Text fw={600} lineClamp={2}>{test.title}</Text>
                <Text size="sm" c="dimmed" lineClamp={2}>{test.description}</Text>
                <Group gap="lg">
                  <Group gap={4}>
                    <IconListCheck size={14} color="var(--mantine-color-gray-6)" />
                    <Text size="xs" c="dimmed">{test.questionCount} câu hỏi</Text>
                  </Group>
                  <Group gap={4}>
                    <IconMicrophone size={14} color="var(--mantine-color-gray-6)" />
                    <Text size="xs" c="dimmed">3 phần</Text>
                  </Group>
                </Group>
                <Button
                  variant="light"
                  color="violet"
                  fullWidth
                  leftSection={<IconMicrophone size={16} />}
                  onClick={() => navigate(`/ielts-speaking/exam/${test.id}`)}
                >
                  Làm bài
                </Button>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Stack>
  )
}

export default IeltsSpeakingTestList
