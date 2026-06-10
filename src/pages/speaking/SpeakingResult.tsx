import { useEffect, useState } from 'react'
import { Button, Center, Divider, Group, Loader, Paper, RingProgress, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import { useParams, useNavigate } from 'react-router-dom'
import { SpeakingService } from '@/services/speaking/speaking.service'
import type { SpeakingSubmission } from '@/@types/speaking'
import { MarkdownContent } from '@/components/MarkdownContent'

const getScoreColor = (score: number) => {
  if (score >= 80) return 'green'
  if (score >= 60) return 'yellow'
  return 'red'
}

const ScoreCard = ({ label, score }: { label: string; score: number }) => (
  <Paper withBorder p="lg" radius="md">
    <Stack align="center" gap="sm">
      <RingProgress
        size={90}
        thickness={8}
        roundCaps
        sections={[{ value: score, color: getScoreColor(score) }]}
        label={<Text ta="center" fw={700} size="lg">{score}</Text>}
      />
      <Text size="sm" fw={500} ta="center">{label}</Text>
    </Stack>
  </Paper>
)

const SpeakingResult = () => {
  const { submissionId } = useParams<{ submissionId: string }>()
  const navigate = useNavigate()
  const [submission, setSubmission] = useState<SpeakingSubmission | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!submissionId) return
    SpeakingService.getSubmission(Number(submissionId)).then((res) => {
      if (res?.status === 200 && res.data) setSubmission(res.data)
      setLoading(false)
    })
  }, [submissionId])

  if (loading) return <Center py="xl"><Loader /></Center>
  if (!submission) return <Center py="xl"><Text c="dimmed">Không tìm thấy kết quả</Text></Center>

  return (
    <Stack gap="xl" p="md" maw={900} mx="auto">
      <Group justify="space-between">
        <div>
          <Title order={3}>Kết quả Speaking</Title>
          <Text c="dimmed" size="sm">{submission.topicTitle}</Text>
        </div>
      </Group>

      <Paper withBorder p="xl" radius="md">
        <Stack align="center" gap="md">
          <Text size="sm" c="dimmed">Overall Score</Text>
          <RingProgress
            size={140}
            thickness={12}
            roundCaps
            sections={[{ value: submission.overallScore, color: getScoreColor(submission.overallScore) }]}
            label={<Text ta="center" fw={800} fz={32}>{submission.overallScore}</Text>}
          />
        </Stack>
      </Paper>

      <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
        <ScoreCard label="Pronunciation" score={submission.pronunciationScore} />
        <ScoreCard label="Fluency" score={submission.fluencyScore} />
        <ScoreCard label="Content" score={submission.contentScore} />
        <ScoreCard label="Grammar" score={submission.grammarScore} />
      </SimpleGrid>

      {submission.transcript && (
        <Paper withBorder p="lg" radius="md">
          <Text fw={600} mb="sm">Transcript</Text>
          <Divider mb="sm" />
          <Text style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{submission.transcript}</Text>
        </Paper>
      )}

      {submission.aiFeedback && (
        <Paper withBorder p="lg" radius="md">
          <Text fw={600} mb="sm">Nhận xét từ AI</Text>
          <Divider mb="sm" />
          <MarkdownContent content={submission.aiFeedback} />
        </Paper>
      )}

      <Group justify="center">
        <Button variant="light" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate('/speaking')}>
          Quay lại danh sách
        </Button>
      </Group>
    </Stack>
  )
}

export default SpeakingResult
