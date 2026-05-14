import { useEffect, useState } from 'react'
import { Badge, Button, Center, Divider, Group, Loader, Paper, RingProgress, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import { useParams, useNavigate } from 'react-router-dom'
import { IeltsWritingService } from '@/services/ieltsWriting/ieltsWriting.service'
import type { IeltsWritingSubmission } from '@/@types/ieltsWriting'

const getBandColor = (band: number) => {
  if (band >= 7.0) return 'green'
  if (band >= 5.5) return 'yellow'
  return 'red'
}

const BandCard = ({ label, band }: { label: string; band: number }) => (
  <Paper withBorder p="lg" radius="md">
    <Stack align="center" gap="sm">
      <RingProgress
        size={90}
        thickness={8}
        roundCaps
        sections={[{ value: (band / 9) * 100, color: getBandColor(band) }]}
        label={<Text ta="center" fw={700} size="lg">{band}</Text>}
      />
      <Text size="sm" fw={500} ta="center">{label}</Text>
    </Stack>
  </Paper>
)

const IeltsWritingResult = () => {
  const { submissionId } = useParams<{ submissionId: string }>()
  const navigate = useNavigate()
  const [submission, setSubmission] = useState<IeltsWritingSubmission | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!submissionId) return
    IeltsWritingService.getSubmission(Number(submissionId)).then((res) => {
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
          <Title order={3}>Kết quả IELTS Writing</Title>
          <Text c="dimmed" size="sm">{submission.taskTitle}</Text>
        </div>
        <Badge color={submission.taskType === 'TASK_1' ? 'blue' : 'grape'}>{submission.taskType.replace('_', ' ')}</Badge>
      </Group>

      <Paper withBorder p="xl" radius="md">
        <Stack align="center" gap="md">
          <Text size="sm" c="dimmed">Overall Band Score</Text>
          <RingProgress
            size={140}
            thickness={12}
            roundCaps
            sections={[{ value: (submission.overallBand / 9) * 100, color: getBandColor(submission.overallBand) }]}
            label={<Text ta="center" fw={800} fz={32}>{submission.overallBand}</Text>}
          />
        </Stack>
      </Paper>

      <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
        <BandCard label="Task Achievement" band={submission.taskAchievementBand} />
        <BandCard label="Coherence & Cohesion" band={submission.coherenceCohesionBand} />
        <BandCard label="Lexical Resource" band={submission.lexicalResourceBand} />
        <BandCard label="Grammatical Range" band={submission.grammaticalRangeBand} />
      </SimpleGrid>

      {submission.aiFeedback && (
        <Paper withBorder p="lg" radius="md">
          <Text fw={600} mb="sm">Nhận xét từ AI</Text>
          <Divider mb="sm" />
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{submission.aiFeedback}</div>
        </Paper>
      )}

      <Group justify="center">
        <Button variant="light" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate('/ielts-writing')}>
          Quay lại danh sách
        </Button>
      </Group>
    </Stack>
  )
}

export default IeltsWritingResult
