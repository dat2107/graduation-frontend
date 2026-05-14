import { ActionIcon, Badge, Button, Group, Stack, Text } from '@mantine/core'
import { IconMicrophone, IconPlayerStop, IconRefresh } from '@tabler/icons-react'
import { useAudioRecorder } from './useAudioRecorder'
import { useEffect } from 'react'
import styles from './AudioRecorder.module.css'

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void
  maxDuration?: number
}

const formatTime = (s: number) => {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}

const AudioRecorder = ({ onRecordingComplete, maxDuration }: AudioRecorderProps) => {
  const { state, duration, audioBlob, audioUrl, start, stop, reset } = useAudioRecorder()

  useEffect(() => {
    if (maxDuration && duration >= maxDuration && state === 'recording') {
      stop()
    }
  }, [duration, maxDuration, state, stop])

  useEffect(() => {
    if (state === 'done' && audioBlob) {
      onRecordingComplete(audioBlob)
    }
  }, [state, audioBlob, onRecordingComplete])

  if (state === 'idle') {
    return (
      <Stack align="center" gap="sm">
        <ActionIcon size={64} radius="xl" color="red" variant="filled" onClick={start}>
          <IconMicrophone size={32} />
        </ActionIcon>
        <Text size="sm" c="dimmed">Nhấn để bắt đầu ghi âm</Text>
      </Stack>
    )
  }

  if (state === 'recording') {
    return (
      <Stack align="center" gap="sm">
        <div className={styles.pulse}>
          <ActionIcon size={64} radius="xl" color="red" variant="filled" onClick={stop}>
            <IconPlayerStop size={32} />
          </ActionIcon>
        </div>
        <Badge color="red" size="lg" variant="dot">{formatTime(duration)}</Badge>
        {maxDuration && (
          <Text size="xs" c="dimmed">Tối đa {formatTime(maxDuration)}</Text>
        )}
      </Stack>
    )
  }

  return (
    <Stack align="center" gap="sm">
      {audioUrl && <audio controls src={audioUrl} style={{ width: '100%', maxWidth: 400 }} />}
      <Group>
        <Button variant="light" size="sm" leftSection={<IconRefresh size={16} />} onClick={reset}>
          Ghi lại
        </Button>
      </Group>
      <Text size="xs" c="dimmed">Thời lượng: {formatTime(duration)}</Text>
    </Stack>
  )
}

export default AudioRecorder
