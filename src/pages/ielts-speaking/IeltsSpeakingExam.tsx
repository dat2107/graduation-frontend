import { useEffect, useState, useCallback, useRef } from 'react'
import { Button, Center, Group, Loader, Paper, Stack, Text, Title, Badge, Stepper } from '@mantine/core'
import { IconArrowRight, IconCheck, IconMicrophone } from '@tabler/icons-react'
import { useParams, useNavigate } from 'react-router-dom'
import { notifications } from '@mantine/notifications'
import { IeltsSpeakingService } from '@/services/ieltsSpeaking/ieltsSpeaking.service'
import AudioRecorder from '@/components/AudioRecorder'
import type { IeltsSpeakingTestDetail, IeltsSpeakingQuestion } from '@/@types/ieltsSpeaking'
import styles from './IeltsSpeakingExam.module.css'

const partLabels: Record<string, string> = {
  PART_1: 'Part 1 — Introduction',
  PART_2: 'Part 2 — Long Turn',
  PART_3: 'Part 3 — Discussion',
}

const IeltsSpeakingExam = () => {
  const { testId } = useParams<{ testId: string }>()
  const navigate = useNavigate()
  const [test, setTest] = useState<IeltsSpeakingTestDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [sessionId, setSessionId] = useState<number | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [submittingResponse, setSubmittingResponse] = useState(false)
  const [finishing, setFinishing] = useState(false)
  const [prepTime, setPrepTime] = useState(0)
  const [started, setStarted] = useState(false)
  const startTimeRef = useRef(Date.now())

  useEffect(() => {
    if (!testId) return
    IeltsSpeakingService.getTest(Number(testId)).then((res) => {
      if (res?.status === 200 && res.data) setTest(res.data)
      setLoading(false)
    })
  }, [testId])

  const handleStart = useCallback(async () => {
    if (!test) return
    try {
      const res = await IeltsSpeakingService.startSession(test.id)
      if (res?.status === 200 && res.data) {
        setSessionId(res.data.id)
        setStarted(true)
        const firstQ = test.questions[0]
        if (firstQ?.prepTimeSeconds > 0) {
          setPrepTime(firstQ.prepTimeSeconds)
        }
      }
    } catch {
      notifications.show({ title: 'Lỗi', message: 'Không thể bắt đầu phiên thi', color: 'red' })
    }
  }, [test])

  useEffect(() => {
    if (prepTime <= 0) return
    const timer = setInterval(() => setPrepTime((t) => Math.max(0, t - 1)), 1000)
    return () => clearInterval(timer)
  }, [prepTime])

  const currentQuestion: IeltsSpeakingQuestion | undefined = test?.questions[currentIndex]
  const isLastQuestion = test ? currentIndex >= test.questions.length - 1 : false

  const handleRecordingComplete = useCallback(async (blob: Blob) => {
    if (!sessionId || !currentQuestion) return
    setSubmittingResponse(true)
    try {
      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000)
      const res = await IeltsSpeakingService.submitResponse(sessionId, currentQuestion.id, blob, duration)
      if (res?.status === 200) {
        if (!isLastQuestion) {
          const nextIndex = currentIndex + 1
          setCurrentIndex(nextIndex)
          startTimeRef.current = Date.now()
          const nextQ = test?.questions[nextIndex]
          if (nextQ?.prepTimeSeconds > 0) {
            setPrepTime(nextQ.prepTimeSeconds)
          }
        }
      }
    } catch {
      notifications.show({ title: 'Lỗi', message: 'Không thể gửi câu trả lời', color: 'red' })
    } finally {
      setSubmittingResponse(false)
    }
  }, [sessionId, currentQuestion, currentIndex, isLastQuestion, test])

  const handleFinish = useCallback(async () => {
    if (!sessionId) return
    setFinishing(true)
    try {
      const res = await IeltsSpeakingService.finishSession(sessionId)
      if (res?.status === 200 && res.data) {
        navigate(`/ielts-speaking/result/${sessionId}`)
      }
    } catch {
      notifications.show({ title: 'Lỗi', message: 'Không thể hoàn thành phiên thi', color: 'red' })
    } finally {
      setFinishing(false)
    }
  }, [sessionId, navigate])

  if (loading) return <Center py="xl"><Loader /></Center>
  if (!test) return <Center py="xl"><Text c="dimmed">Không tìm thấy bài thi</Text></Center>

  if (!started) {
    return (
      <Stack gap="lg" p="md" maw={800} mx="auto">
        <Title order={3}>{test.title}</Title>
        <Paper withBorder p="xl" radius="md">
          <Stack gap="md">
            <Text fw={600}>Hướng dẫn thi IELTS Speaking</Text>
            <Text size="sm" c="dimmed">Bài thi gồm 3 phần với {test.questions.length} câu hỏi:</Text>
            <Stack gap="xs">
              <Text size="sm"><strong>Part 1:</strong> Giới thiệu & câu hỏi chung (4-5 phút)</Text>
              <Text size="sm"><strong>Part 2:</strong> Nói dài về chủ đề cho trước — có thời gian chuẩn bị (3-4 phút)</Text>
              <Text size="sm"><strong>Part 3:</strong> Thảo luận chuyên sâu (4-5 phút)</Text>
            </Stack>
            <Text size="sm" c="dimmed">Mỗi câu hỏi sẽ hiện lần lượt. Bạn ghi âm câu trả lời rồi chuyển sang câu tiếp theo.</Text>
            <Button size="lg" leftSection={<IconMicrophone size={20} />} onClick={handleStart}>
              Bắt đầu thi
            </Button>
          </Stack>
        </Paper>
      </Stack>
    )
  }

  return (
    <Stack gap="lg" p="md" maw={800} mx="auto">
      <Group justify="space-between">
        <div>
          <Title order={3}>{test.title}</Title>
          {currentQuestion && (
            <Badge color="violet" mt={4}>{partLabels[currentQuestion.part] ?? currentQuestion.part}</Badge>
          )}
        </div>
        <Badge size="lg" variant="light">
          {currentIndex + 1} / {test.questions.length}
        </Badge>
      </Group>

      <Stepper active={currentIndex} size="xs">
        {test.questions.map((q, i) => (
          <Stepper.Step key={q.id} label={`Q${i + 1}`} />
        ))}
      </Stepper>

      {currentQuestion && (
        <>
          <Paper withBorder p="lg" radius="md" bg="gray.0">
            <Text fw={600} mb="sm">Câu hỏi:</Text>
            <Text size="lg">{currentQuestion.questionText}</Text>
          </Paper>

          {currentQuestion.cueCardText && (
            <div className={styles.cueCard}>
              <Text fw={600} mb="sm" c="violet">Cue Card:</Text>
              <Text style={{ whiteSpace: 'pre-wrap' }}>{currentQuestion.cueCardText}</Text>
            </div>
          )}

          {prepTime > 0 ? (
            <Paper withBorder p="xl" radius="md">
              <Stack align="center" gap="md">
                <Text fw={600}>Thời gian chuẩn bị</Text>
                <Text fz={48} fw={800} c="violet" className={styles.prepTimer}>
                  {Math.floor(prepTime / 60)}:{(prepTime % 60).toString().padStart(2, '0')}
                </Text>
                <Text size="sm" c="dimmed">Hãy chuẩn bị ý tưởng trước khi ghi âm</Text>
              </Stack>
            </Paper>
          ) : (
            <Paper withBorder p="xl" radius="md">
              <Stack align="center" gap="md">
                <Text fw={600}>Ghi âm câu trả lời</Text>
                {submittingResponse ? (
                  <Stack align="center" gap="sm">
                    <Loader />
                    <Text size="sm" c="dimmed">Đang xử lý...</Text>
                  </Stack>
                ) : (
                  <AudioRecorder
                    onRecordingComplete={handleRecordingComplete}
                    maxDuration={currentQuestion.part === 'PART_2' ? 120 : 60}
                  />
                )}
              </Stack>
            </Paper>
          )}

          {isLastQuestion && !submittingResponse && (
            <Group justify="center">
              <Button
                size="lg"
                color="green"
                leftSection={<IconCheck size={20} />}
                loading={finishing}
                onClick={handleFinish}
              >
                {finishing ? 'Đang chấm bài...' : 'Hoàn thành & Xem kết quả'}
              </Button>
            </Group>
          )}
        </>
      )}
    </Stack>
  )
}

export default IeltsSpeakingExam
