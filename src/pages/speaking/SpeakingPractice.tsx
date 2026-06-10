import { useEffect, useState, useCallback } from 'react'
import { Button, Center, Group, Loader, Paper, Stack, Text, Title, Badge, Card } from '@mantine/core'
import { IconArrowLeft, IconSend, IconHistory } from '@tabler/icons-react'
import { useParams, useNavigate } from 'react-router-dom'
import { notifications } from '@mantine/notifications'
import { SpeakingService } from '@/services/speaking/speaking.service'
import AudioRecorder from '@/components/AudioRecorder'
import type { SpeakingTopic, SpeakingSubmission } from '@/@types/speaking'

const promptTypeLabels: Record<string, string> = {
  READ_ALOUD: 'Đọc to',
  DESCRIBE_IMAGE: 'Mô tả hình',
  FREE_SPEAK: 'Nói tự do',
  ANSWER_QUESTION: 'Trả lời câu hỏi',
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'green'
  if (score >= 60) return 'yellow'
  return 'red'
}

const SpeakingPractice = () => {
  const { topicId } = useParams<{ topicId: string }>()
  const navigate = useNavigate()
  const [topic, setTopic] = useState<SpeakingTopic | null>(null)
  const [history, setHistory] = useState<SpeakingSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)

  useEffect(() => {
    if (!topicId) return
    SpeakingService.getTopic(Number(topicId)).then((res) => {
      if (res?.status === 200 && res.data) setTopic(res.data)
      setLoading(false)
    })
    SpeakingService.getHistory().then((res) => {
      if (res?.status === 200 && res.data) {
        setHistory(res.data.filter((s) => s.topicId === Number(topicId)))
      }
    })
  }, [topicId])

  const handleRecordingComplete = useCallback((blob: Blob) => {
    setAudioBlob(blob)
  }, [])

  const handleSubmit = useCallback(async () => {
    if (!topic || !audioBlob) return
    setSubmitting(true)
    try {
      const res = await SpeakingService.submit(topic.id, audioBlob)
      if (res?.status === 200 && res.data) {
        navigate(`/speaking/result/${res.data.id}`)
      }
    } catch {
      notifications.show({ title: 'Lỗi', message: 'Không thể nộp bài', color: 'red' })
    } finally {
      setSubmitting(false)
    }
  }, [topic, audioBlob, navigate])

  if (loading) return <Center py="xl"><Loader /></Center>
  if (!topic) return <Center py="xl"><Text c="dimmed">Không tìm thấy chủ đề</Text></Center>

  return (
    <Stack gap="lg" p="md" maw={800} mx="auto">
      <Group justify="space-between">
        <div>
          <Title order={3}>{topic.title}</Title>
          <Badge color="blue" mt={4}>{promptTypeLabels[topic.promptType] ?? topic.promptType}</Badge>
        </div>
      </Group>

      <Paper withBorder p="lg" radius="md" bg="gray.0">
        <Text size="sm" fw={600} mb="xs">Đề bài:</Text>
        <Text style={{ whiteSpace: 'pre-wrap' }}>{topic.promptText}</Text>
        {topic.imageUrl && <img src={topic.imageUrl} alt="Topic" style={{ maxWidth: '100%', marginTop: 12, borderRadius: 8 }} />}
      </Paper>

      <Paper withBorder p="xl" radius="md">
        <Stack align="center" gap="md">
          <Text fw={600}>Ghi âm câu trả lời</Text>
          <AudioRecorder onRecordingComplete={handleRecordingComplete} maxDuration={180} />
        </Stack>
      </Paper>

      <Group justify="space-between">
        <Button variant="light" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate('/speaking')}>
          Quay lại
        </Button>
        <Button
          leftSection={<IconSend size={16} />}
          loading={submitting}
          disabled={!audioBlob || submitting}
          onClick={handleSubmit}
        >
          {submitting ? 'Đang chấm bài...' : 'Nộp bài'}
        </Button>
      </Group>

      {history.length > 0 && (
        <Stack gap="sm">
          <Group gap="xs">
            <IconHistory size={20} />
            <Title order={4}>Lịch sử luyện nói chủ đề này</Title>
          </Group>
          <Card withBorder radius="md" p="md">
            {history.map((item) => {
              const date = new Date(item.createdAt).toLocaleDateString('vi-VN')
              return (
                <Group
                  key={item.id}
                  justify="space-between"
                  py={8}
                  style={{ borderBottom: '1px solid var(--mantine-color-gray-2)', cursor: 'pointer' }}
                  onClick={() => navigate(`/speaking/result/${item.id}`)}
                >
                  <div>
                    <Text size="sm" fw={500}>{item.topicTitle}</Text>
                    <Text size="xs" c="dimmed">{date}</Text>
                  </div>
                  <Badge color={getScoreColor(item.overallScore)} variant="filled" size="md">
                    {item.overallScore} điểm
                  </Badge>
                </Group>
              )
            })}
          </Card>
        </Stack>
      )}
    </Stack>
  )
}

export default SpeakingPractice
