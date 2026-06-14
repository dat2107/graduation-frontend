import { useEffect, useState } from 'react'
import { Badge, Button, Card, Center, Divider, Group, Loader, Paper, RingProgress, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import { useParams, useNavigate } from 'react-router-dom'
import { IeltsSpeakingService } from '@/services/ieltsSpeaking/ieltsSpeaking.service'
import { MarkdownContent } from '@/components/MarkdownContent'
import type { IeltsSpeakingSession } from '@/@types/ieltsSpeaking'

const getBandColor = (band: number) => {
  if (band >= 7.0) return 'green'
  if (band >= 5.5) return 'yellow'
  return 'red'
}

const BandCard = ({ label, band }: { label: string; band: number | null }) => (
  <Paper withBorder p="lg" radius="md">
    <Stack align="center" gap="sm">
      <RingProgress
        size={90}
        thickness={8}
        roundCaps
        sections={[{ value: ((band ?? 0) / 9) * 100, color: getBandColor(band ?? 0) }]}
        label={<Text ta="center" fw={700} size="lg">{band ?? '-'}</Text>}
      />
      <Text size="sm" fw={500} ta="center">{label}</Text>
    </Stack>
  </Paper>
)

const partLabels: Record<string, string> = {
  PART_1: 'Part 1',
  PART_2: 'Part 2',
  PART_3: 'Part 3',
}

const IeltsSpeakingResult = () => {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const [session, setSession] = useState<IeltsSpeakingSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sessionId) return
    IeltsSpeakingService.getSession(Number(sessionId)).then((res) => {
      if (res?.status === 200 && res.data) setSession(res.data)
      setLoading(false)
    })
  }, [sessionId])

  if (loading) return <Center py="xl"><Loader /></Center>
  if (!session) return <Center py="xl"><Text c="dimmed">Không tìm thấy kết quả</Text></Center>

  return (
    <Stack gap="xl" p="md" maw={900} mx="auto">
      <Group justify="space-between">
        <div>
          <Title order={3}>Kết quả IELTS Speaking</Title>
          <Text c="dimmed" size="sm">{session.testTitle}</Text>
        </div>
        <Badge color={session.status === 'COMPLETED' ? 'green' : 'yellow'}>{session.status}</Badge>
      </Group>

      {session.overallBand !== null && (
        <Paper withBorder p="xl" radius="md">
          <Stack align="center" gap="md">
            <Text size="sm" c="dimmed">Overall Band Score</Text>
            <RingProgress
              size={140}
              thickness={12}
              roundCaps
              sections={[{ value: (session.overallBand / 9) * 100, color: getBandColor(session.overallBand) }]}
              label={<Text ta="center" fw={800} fz={32}>{session.overallBand}</Text>}
            />
          </Stack>
        </Paper>
      )}

      <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
        <BandCard label="Fluency & Coherence" band={session.fluencyCoherenceBand} />
        <BandCard label="Lexical Resource" band={session.lexicalResourceBand} />
        <BandCard label="Grammatical Range" band={session.grammaticalRangeBand} />
        <BandCard label="Pronunciation" band={session.pronunciationBand} />
      </SimpleGrid>

      {session.aiFeedback && (
        <Paper withBorder p="lg" radius="md">
          <Text fw={600} mb="sm">Nhận xét từ AI</Text>
          <Divider mb="sm" />
          <MarkdownContent content={session.aiFeedback} />
        </Paper>
      )}

      {session.responses && session.responses.length > 0 && (
        <Stack gap="md">
          <Title order={4}>Chi tiết từng câu hỏi</Title>
          {session.responses.map((resp, i) => (
            <Card key={resp.id} withBorder radius="md" p="md">
              <Group justify="space-between" mb="xs">
                <Group gap="xs">
                  <Badge color="violet" size="sm">{partLabels[resp.part] ?? resp.part}</Badge>
                  <Text fw={600} size="sm">Câu {i + 1}</Text>
                </Group>
                {resp.durationSeconds > 0 && (
                  <Text size="xs" c="dimmed">
                    {Math.floor(resp.durationSeconds / 60)}:{(resp.durationSeconds % 60).toString().padStart(2, '0')}
                  </Text>
                )}
              </Group>
              <Text size="sm" c="dimmed" mb="xs">{resp.questionText}</Text>
              {resp.transcript ? (
                <Paper p="sm" bg="gray.0" radius="sm">
                  <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>{resp.transcript}</Text>
                </Paper>
              ) : (
                <Text size="sm" c="dimmed" fs="italic">Chưa có transcript</Text>
              )}
            </Card>
          ))}
        </Stack>
      )}

      <Group justify="center">
        <Button variant="light" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate('/ielts-speaking')}>
          Quay lại danh sách
        </Button>
      </Group>
    </Stack>
  )
}

export default IeltsSpeakingResult
