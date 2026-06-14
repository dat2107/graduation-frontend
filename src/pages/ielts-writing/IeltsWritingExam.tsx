import { useEffect, useState, useRef, useCallback } from 'react'
import { Button, Card, Group, Loader, Paper, Stack, Text, Textarea, Title, Badge, Center } from '@mantine/core'
import { IconClock, IconSend } from '@tabler/icons-react'
import { useParams, useNavigate } from 'react-router-dom'
import { notifications } from '@mantine/notifications'
import { IeltsWritingService } from '@/services/ieltsWriting/ieltsWriting.service'
import { TaskChart, stripChartData } from '@/components/TaskChart'
import type { IeltsWritingTask } from '@/@types/ieltsWriting'

const IeltsWritingExam = () => {
  const { taskId } = useParams<{ taskId: string }>()
  const navigate = useNavigate()
  const [task, setTask] = useState<IeltsWritingTask | null>(null)
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const startTimeRef = useRef(Date.now())

  useEffect(() => {
    if (!taskId) return
    IeltsWritingService.getTask(Number(taskId)).then((res) => {
      if (res?.status === 200 && res.data) {
        setTask(res.data)
        setTimeLeft(res.data.timeLimitMinutes * 60)
      }
      setLoading(false)
    })
  }, [taskId])

  useEffect(() => {
    if (timeLeft <= 0 || !task) return
    const timer = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000)
    return () => clearInterval(timer)
  }, [timeLeft, task])

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0
  const minMet = task ? wordCount >= task.minWords : false

  const handleSubmit = useCallback(async () => {
    if (!task || !minMet) return
    setSubmitting(true)
    try {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000)
      const res = await IeltsWritingService.submit({ taskId: task.id, content, timeSpentSeconds: timeSpent })
      if (res?.status === 200 && res.data) {
        navigate(`/ielts-writing/result/${res.data.id}`)
      }
    } catch {
      notifications.show({ title: 'Lỗi', message: 'Không thể nộp bài', color: 'red' })
    } finally {
      setSubmitting(false)
    }
  }, [task, content, minMet, navigate])

  if (loading) return <Center py="xl"><Loader /></Center>
  if (!task) return <Center py="xl"><Text c="dimmed">Không tìm thấy đề bài</Text></Center>

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <Stack gap="lg" p="md" maw={900} mx="auto">
      <Group justify="space-between">
        <div>
          <Title order={3}>{task.title}</Title>
          <Badge color={task.taskType === 'TASK_1' ? 'blue' : 'grape'} mt={4}>{task.taskType.replace('_', ' ')}</Badge>
        </div>
        <Card withBorder p="sm" radius="md">
          <Group gap="xs">
            <IconClock size={18} color={timeLeft < 300 ? 'var(--mantine-color-red-6)' : 'var(--mantine-color-gray-6)'} />
            <Text fw={700} c={timeLeft < 300 ? 'red' : undefined} size="lg">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </Text>
          </Group>
        </Card>
      </Group>

      <Paper withBorder p="lg" radius="md" bg="gray.0">
        <Text size="sm" fw={600} mb="xs">Đề bài:</Text>
        <Text style={{ whiteSpace: 'pre-wrap' }}>{stripChartData(task.promptText)}</Text>
        {task.promptImageUrl && <img src={task.promptImageUrl} alt="Task" style={{ maxWidth: '100%', marginTop: 12, borderRadius: 8 }} />}
      </Paper>

      {!task.promptImageUrl && <TaskChart promptText={task.promptText} />}

      <Textarea
        placeholder="Viết bài của bạn tại đây..."
        minRows={12}
        autosize
        value={content}
        onChange={(e) => setContent(e.currentTarget.value)}
      />

      <Group justify="space-between">
        <Text size="sm" c={minMet ? 'green' : 'red'}>
          {wordCount} / {task.minWords} từ {minMet ? '✓' : '(chưa đủ)'}
        </Text>
        <Button
          leftSection={<IconSend size={16} />}
          loading={submitting}
          disabled={!minMet || submitting}
          onClick={handleSubmit}
        >
          {submitting ? 'Đang chấm bài...' : 'Nộp bài'}
        </Button>
      </Group>
    </Stack>
  )
}

export default IeltsWritingExam
