import { useEffect, useState, useCallback } from 'react'
import { Button, Center, Group, Loader, Paper, Stack, Text, Title, Badge } from '@mantine/core'
import { IconArrowLeft, IconSend } from '@tabler/icons-react'
import { useParams, useNavigate } from 'react-router-dom'
import { notifications } from '@mantine/notifications'
import { SpeakingService } from '@/services/speaking/speaking.service'
import AudioRecorder from '@/components/AudioRecorder'
import type { SpeakingTopic } from '@/@types/speaking'

const promptTypeLabels: Record<string, string> = {
  READ_ALOUD: 'Đọc to',
  DESCRIBE_IMAGE: 'Mô tả hình',
  FREE_SPEAK: 'Nói tự do',
  ANSWER_QUESTION: 'Trả lời câu hỏi',
}

const SpeakingPractice = () => {
  const { topicId } = useParams<{ topicId: string }>()
  const navigate = useNavigate()
  const [topic, setTopic] = useState<SpeakingTopic | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)

  useEffect(() => {
    if (!topicId) return
    SpeakingService.getTopic(Number(topicId)).then((res) => {
      if (res?.status === 200 && res.data) setTopic(res.data)
      setLoading(false)
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
    </Stack>
  )
}

export default SpeakingPractice
