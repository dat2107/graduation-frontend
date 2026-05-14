import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Collapse,
  Divider,
  Group,
  Loader,
  Paper,
  Radio,
  RingProgress,
  Slider,
  Stack,
  Tabs,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconCheck,
  IconChevronDown,
  IconChevronUp,
  IconClock,
  IconHeadphones,
  IconListCheck,
  IconPlayerPause,
  IconPlayerPlay,
  IconStar,
  IconX,
} from '@tabler/icons-react';
import { ListeningService } from '@/services/listening/listening.service';
import type {
  ListeningLessonDetail as LessonDetailType,
  ListeningQuestion,
  ListeningSubmitResult,
} from '@/@types/listening';

// ─── Audio Player ────────────────────────────────────────────────────────────

function AudioPlayer({
  audioUrl,
  transcript,
  durationSeconds,
}: {
  audioUrl: string | null;
  transcript?: string;
  durationSeconds: number | null;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(durationSeconds ?? 0);
  const [useTTS, setUseTTS] = useState(false);
  const [audioError, setAudioError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => {
      if (audio.duration && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const onEnded = () => setPlaying(false);
    const onError = () => {
      setAudioError(true);
      if (transcript) setUseTTS(true);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [transcript]);

  // If no valid audioUrl, switch to TTS mode immediately
  useEffect(() => {
    if (!audioUrl || audioUrl.includes('example.com')) {
      setAudioError(true);
      if (transcript) setUseTTS(true);
    }
  }, [audioUrl, transcript]);

  const togglePlay = () => {
    if (useTTS && transcript) {
      if (playing) {
        window.speechSynthesis.cancel();
        setPlaying(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(transcript);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        const voices = window.speechSynthesis.getVoices();
        const voice =
          voices.find((v) => v.lang.startsWith('en') && !v.localService) ??
          voices.find((v) => v.lang.startsWith('en'));
        if (voice) utterance.voice = voice;
        utterance.onend = () => setPlaying(false);
        utterance.onerror = () => setPlaying(false);
        setPlaying(true);
        window.speechSynthesis.speak(utterance);
      }
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!playing);
  };

  const handleSliderChange = (value: number) => {
    if (useTTS) return;
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value;
    setCurrentTime(value);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <Card withBorder radius="md" p="md">
      {!useTTS && (
        <audio ref={audioRef} src={audioUrl ?? undefined} preload="metadata" />
      )}
      <Group gap="md">
        <ActionIcon
          size="xl"
          radius="xl"
          color={useTTS ? 'teal' : 'blue'}
          variant="filled"
          onClick={togglePlay}
        >
          {playing ? (
            <IconPlayerPause size={20} />
          ) : (
            <IconPlayerPlay size={20} />
          )}
        </ActionIcon>
        <Stack gap={4} style={{ flex: 1 }}>
          {useTTS ? (
            <Text size="sm" c="teal" fw={500}>
              {playing ? 'Dang doc...' : 'Nhan Play de nghe (Text-to-Speech)'}
            </Text>
          ) : (
            <>
              <Slider
                value={currentTime}
                onChange={handleSliderChange}
                min={0}
                max={duration || 1}
                step={0.1}
                label={null}
                size="sm"
              />
              <Group justify="space-between">
                <Text size="xs" c="dimmed">
                  {formatTime(currentTime)}
                </Text>
                <Text size="xs" c="dimmed">
                  {formatTime(duration)}
                </Text>
              </Group>
            </>
          )}
        </Stack>
      </Group>
      {useTTS && audioError && (
        <Text size="xs" c="dimmed" mt="xs">
          Audio file khong kha dung. Su dung Text-to-Speech.
        </Text>
      )}
    </Card>
  );
}

// ─── Question Item ───────────────────────────────────────────────────────────

function QuestionItem({
  question,
  index,
  answer,
  onAnswer,
  disabled,
}: {
  question: ListeningQuestion;
  index: number;
  answer: string;
  onAnswer: (value: string) => void;
  disabled: boolean;
}) {
  return (
    <Card withBorder radius="md" p="md">
      <Group gap="sm" mb="sm">
        <ThemeIcon size="sm" radius="xl" color="blue" variant="light">
          <Text size="xs" fw={700}>
            {index + 1}
          </Text>
        </ThemeIcon>
        <Badge
          size="xs"
          variant="light"
          color={question.type === 'comprehension' ? 'blue' : 'orange'}
        >
          {question.type === 'comprehension' ? 'Nghe hiểu' : 'Chính tả'}
        </Badge>
      </Group>

      <Text size="sm" fw={500} mb="sm">
        {question.questionText}
      </Text>

      {question.type === 'comprehension' && (
        <Radio.Group value={answer} onChange={onAnswer}>
          <Stack gap="xs">
            {question.options.map((opt) => (
              <Radio
                key={opt.optionKey}
                value={opt.optionKey}
                label={`${opt.optionKey}. ${opt.optionText}`}
                disabled={disabled}
              />
            ))}
          </Stack>
        </Radio.Group>
      )}

      {question.type === 'dictation' && (
        <TextInput
          placeholder="Nhập câu trả lời..."
          value={answer}
          onChange={(e) => onAnswer(e.currentTarget.value)}
          disabled={disabled}
        />
      )}
    </Card>
  );
}

// ─── Result Detail ───────────────────────────────────────────────────────────

function ResultView({
  result,
  onRetry,
  onBack,
}: {
  result: ListeningSubmitResult;
  onRetry: () => void;
  onBack: () => void;
}) {
  const scoreColor =
    result.score >= 80 ? 'green' : result.score >= 60 ? 'yellow' : 'red';

  return (
    <Stack gap="lg">
      {/* Score ring */}
      <Card withBorder radius="md" p="xl">
        <Stack align="center" gap="md">
          <RingProgress
            size={140}
            thickness={12}
            roundCaps
            sections={[{ value: result.score, color: scoreColor }]}
            label={
              <Text ta="center" fw={700} size="xl">
                {result.score}%
              </Text>
            }
          />
          <Group gap="xl">
            <div style={{ textAlign: 'center' }}>
              <Text size="xl" fw={700} c="green">
                {result.correctCount}
              </Text>
              <Text size="xs" c="dimmed">
                Đúng
              </Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Text size="xl" fw={700} c="red">
                {result.totalQuestions - result.correctCount}
              </Text>
              <Text size="xs" c="dimmed">
                Sai
              </Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Text size="xl" fw={700} c="orange">
                +{result.xpEarned}
              </Text>
              <Text size="xs" c="dimmed">
                XP
              </Text>
            </div>
          </Group>
          {result.completed ? (
            <Badge color="green" size="lg" variant="light">
              Hoàn thành bài nghe!
            </Badge>
          ) : (
            <Badge color="orange" size="lg" variant="light">
              Cần đạt 60% để hoàn thành
            </Badge>
          )}
        </Stack>
      </Card>

      {/* Answer details */}
      <Title order={5}>Chi tiết đáp án</Title>
      <Stack gap="sm">
        {result.details.map((d, i) => (
          <Card
            key={d.questionId}
            withBorder
            radius="md"
            p="sm"
            style={{
              borderLeft: `4px solid var(--mantine-color-${d.isCorrect ? 'green' : 'red'}-5)`,
            }}
          >
            <Group gap="xs" mb={4}>
              <ThemeIcon
                size="xs"
                radius="xl"
                color={d.isCorrect ? 'green' : 'red'}
                variant="filled"
              >
                {d.isCorrect ? <IconCheck size={10} /> : <IconX size={10} />}
              </ThemeIcon>
              <Text size="sm" fw={500}>
                Câu {i + 1}
              </Text>
            </Group>
            <Text size="xs" c="dimmed" mb={4}>
              {d.questionText}
            </Text>
            {!d.isCorrect && (
              <Group gap="xs" mb={4}>
                <Text size="xs" c="red">
                  Bạn chọn: {d.selectedAnswer || '(bỏ trống)'}
                </Text>
                <Text size="xs" c="green" fw={600}>
                  Đáp án: {d.correctAnswer}
                </Text>
              </Group>
            )}
            {d.explanation && (
              <Text size="xs" c="blue" fs="italic">
                {d.explanation}
              </Text>
            )}
          </Card>
        ))}
      </Stack>

      {/* Actions */}
      <Group justify="center">
        <Button
          variant="light"
          onClick={onBack}
          leftSection={<IconArrowLeft size={16} />}
        >
          Quay lại
        </Button>
        <Button onClick={onRetry} leftSection={<IconStar size={16} />}>
          Làm lại
        </Button>
      </Group>
    </Stack>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ListeningLessonDetailPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState<LessonDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ListeningSubmitResult | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>('listen');
  const [transcriptOpen, setTranscriptOpen] = useState(false);

  useEffect(() => {
    if (!lessonId) return;
    const fetch = async () => {
      setLoading(true);
      const res = await ListeningService.getLessonDetail(Number(lessonId));
      if (res?.status === 200 && res.data) setLesson(res.data);
      setLoading(false);
    };
    fetch();
  }, [lessonId]);

  const handleSubmit = async () => {
    if (!lessonId || !lesson) return;
    setSubmitting(true);
    const res = await ListeningService.submitAnswers(Number(lessonId), answers);
    if (res?.status === 200 && res.data) {
      setResult(res.data);
    }
    setSubmitting(false);
  };

  const handleRetry = () => {
    setAnswers({});
    setResult(null);
    setActiveTab('questions');
  };

  if (loading) {
    return (
      <Stack align="center" justify="center" p="xl" style={{ minHeight: 400 }}>
        <Loader size="lg" />
        <Text c="dimmed">Đang tải bài nghe...</Text>
      </Stack>
    );
  }

  if (!lesson) {
    return (
      <Stack align="center" justify="center" p="xl" style={{ minHeight: 400 }}>
        <Text size="3rem">404</Text>
        <Text c="dimmed">Không tìm thấy bài nghe</Text>
        <Button variant="light" onClick={() => navigate('/listening')}>
          Quay lại
        </Button>
      </Stack>
    );
  }

  const answeredCount = Object.values(answers).filter(
    (a) => a.trim().length > 0
  ).length;

  const formatDuration = (sec: number | null) => {
    if (!sec) return '—';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
  };

  return (
    <Stack gap="lg" p="md">
      {/* ── Header ─────────────────────────────────────────────── */}
      <Group>
        <ActionIcon variant="subtle" onClick={() => navigate('/listening')}>
          <IconArrowLeft size={20} />
        </ActionIcon>
        <div>
          <Title order={3}>{lesson.title}</Title>
          <Text size="sm" c="dimmed">
            {lesson.description}
          </Text>
        </div>
        <Group ml="auto" gap="xs">
          <Badge
            color="gray"
            variant="light"
            leftSection={<IconClock size={12} />}
          >
            {formatDuration(lesson.durationSeconds)}
          </Badge>
          <Badge
            color={
              lesson.level === 'A1' || lesson.level === 'A2' ? 'green' : 'blue'
            }
          >
            {lesson.level}
          </Badge>
        </Group>
      </Group>

      {/* ── Result view ────────────────────────────────────────── */}
      {result ? (
        <ResultView
          result={result}
          onRetry={handleRetry}
          onBack={() => navigate('/listening')}
        />
      ) : (
        /* ── Tabs: listen + questions ─────────────────────────── */
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="listen" leftSection={<IconHeadphones size={16} />}>
              Nghe
            </Tabs.Tab>
            <Tabs.Tab
              value="questions"
              leftSection={<IconListCheck size={16} />}
            >
              Câu hỏi ({lesson.questionCount})
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="listen" pt="md">
            <Stack gap="md">
              {/* Audio player */}
              <AudioPlayer
                audioUrl={lesson.audioUrl}
                transcript={lesson.transcript}
                durationSeconds={lesson.durationSeconds}
              />

              {/* Collapsible transcript */}
              <Card withBorder radius="md" p={0}>
                <Button
                  variant="subtle"
                  fullWidth
                  onClick={() => setTranscriptOpen(!transcriptOpen)}
                  rightSection={
                    transcriptOpen ? (
                      <IconChevronUp size={16} />
                    ) : (
                      <IconChevronDown size={16} />
                    )
                  }
                  styles={{ root: { borderRadius: 0 } }}
                >
                  {transcriptOpen ? 'Ẩn transcript' : 'Hiện transcript'}
                </Button>
                <Collapse in={transcriptOpen}>
                  <Paper p="md" style={{ whiteSpace: 'pre-line' }}>
                    <Text size="sm" lh={1.7}>
                      {lesson.transcript}
                    </Text>
                  </Paper>
                </Collapse>
              </Card>

              <Group justify="center">
                <Button
                  onClick={() => setActiveTab('questions')}
                  rightSection={<IconListCheck size={16} />}
                >
                  Làm bài
                </Button>
              </Group>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="questions" pt="md">
            <Stack gap="md">
              {lesson.questions.map((q, i) => (
                <QuestionItem
                  key={q.id}
                  question={q}
                  index={i}
                  answer={answers[q.id] ?? ''}
                  onAnswer={(v) =>
                    setAnswers((prev) => ({ ...prev, [q.id]: v }))
                  }
                  disabled={false}
                />
              ))}

              <Divider />

              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Đã trả lời: {answeredCount}/{lesson.questions.length}
                </Text>
                <Button
                  onClick={handleSubmit}
                  loading={submitting}
                  disabled={answeredCount === 0}
                  leftSection={<IconCheck size={16} />}
                >
                  Nộp bài
                </Button>
              </Group>
            </Stack>
          </Tabs.Panel>
        </Tabs>
      )}
    </Stack>
  );
}
