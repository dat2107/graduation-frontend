import { Link, Navigate } from 'react-router-dom'
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import {
  IconArrowRight,
  IconBook,
  IconBrain,
  IconHeadphones,
  IconListCheck,
  IconMessageChatbot,
  IconMicrophone,
  IconStar,
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import useAuth from '@/utils/hooks/useAuth'
import LanguageSwitcher from '@/components/LanguageSwitcher'

const featureMeta = [
  { icon: IconBook, color: 'blue', key: 'vocabulary' },
  { icon: IconListCheck, color: 'green', key: 'quiz' },
  { icon: IconBrain, color: 'violet', key: 'grammar' },
  { icon: IconHeadphones, color: 'orange', key: 'listening' },
  { icon: IconMicrophone, color: 'pink', key: 'speaking' },
  { icon: IconMessageChatbot, color: 'teal', key: 'aiChat' },
] as const

export default function LandingPage() {
  const { t } = useTranslation()
  const { authenticated } = useAuth()

  if (authenticated) return <Navigate to="/dashboard" replace />

  const stats = [
    { value: '1000+', label: t('landing.stats.vocabulary') },
    { value: '50+', label: t('landing.stats.quizzes') },
    { value: '6', label: t('landing.stats.levels') },
    { value: 'AI', label: t('landing.stats.assistant') },
  ]

  return (
    <Box style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      {/* ─── Navbar ─────────────────────────────────────────────────────────────── */}
      <Box
        component="header"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          backgroundColor: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <Container size="xl">
          <Flex h={64} align="center" justify="space-between">
            <Group gap="xs">
              <Text size="xl">🎓</Text>
              <Text size="lg" fw={700} c="dark">
                {t('common.appName')}
              </Text>
            </Group>
            <Group gap="sm">
              <LanguageSwitcher />
              <Button
                component={Link}
                to="/sign-in"
                variant="subtle"
                color="gray"
              >
                {t('landing.nav.signIn')}
              </Button>
              <Button component={Link} to="/sign-up" radius="xl">
                {t('landing.nav.signUpFree')}
              </Button>
            </Group>
          </Flex>
        </Container>
      </Box>

      {/* ─── Hero ────────────────────────────────────────────────────────────────── */}
      <Box
        style={{
          paddingTop: 64,
          minHeight: '100vh',
          background:
            'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #eef2ff 100%)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Container size="xl">
          <Stack align="center" gap="xl" py={80}>
            <Badge
              variant="light"
              color="blue"
              size="lg"
              radius="xl"
              leftSection={<IconStar size={14} />}
            >
              {t('landing.hero.badge')}
            </Badge>

            <Stack align="center" gap="md">
              <Title
                order={1}
                ta="center"
                style={{
                  fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
                  lineHeight: 1.2,
                }}
              >
                {t('landing.hero.title1')}
                <br />
                <Text
                  component="span"
                  inherit
                  style={{
                    background: 'linear-gradient(90deg, #2563eb, #4f46e5)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {t('landing.hero.title2')}
                </Text>
              </Title>

              <Text size="xl" c="dimmed" maw={560} ta="center" lh={1.7}>
                {t('landing.hero.subtitle')}
              </Text>
            </Stack>

            <Group gap="md">
              <Button
                component={Link}
                to="/sign-up"
                size="lg"
                radius="xl"
                rightSection={<IconArrowRight size={18} />}
              >
                {t('landing.hero.startFree')}
              </Button>
              <Button
                component={Link}
                to="/sign-in"
                size="lg"
                radius="xl"
                variant="outline"
              >
                {t('landing.hero.signIn')}
              </Button>
            </Group>

            {/* Stats */}
            <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="xl" mt="md">
              {stats.map((s) => (
                <Stack key={s.label} align="center" gap={4}>
                  <Text
                    size="2.2rem"
                    fw={800}
                    c="blue"
                    style={{ lineHeight: 1 }}
                  >
                    {s.value}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {s.label}
                  </Text>
                </Stack>
              ))}
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      {/* ─── Features ────────────────────────────────────────────────────────────── */}
      <Box py={80} style={{ backgroundColor: '#fff' }}>
        <Container size="xl">
          <Stack align="center" gap="md" mb={48}>
            <Badge variant="light" color="violet" size="lg" radius="xl">
              {t('landing.features.badge')}
            </Badge>
            <Title order={2} ta="center">
              {t('landing.features.title')}
            </Title>
            <Text c="dimmed" maw={480} ta="center">
              {t('landing.features.subtitle')}
            </Text>
          </Stack>

          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
            {featureMeta.map((f) => (
              <Paper
                key={f.key}
                p="xl"
                radius="lg"
                withBorder
                style={{ borderColor: '#f0f0f0' }}
              >
                <ThemeIcon
                  size="lg"
                  radius="md"
                  color={f.color}
                  variant="light"
                  mb="md"
                >
                  <f.icon size={20} />
                </ThemeIcon>
                <Text fw={600} mb="xs">
                  {t(`landing.features.${f.key}.title`)}
                </Text>
                <Text size="sm" c="dimmed" lh={1.6}>
                  {t(`landing.features.${f.key}.desc`)}
                </Text>
              </Paper>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* ─── CTA Banner ──────────────────────────────────────────────────────────── */}
      <Box
        py={72}
        style={{ background: 'linear-gradient(90deg, #2563eb, #4f46e5)' }}
      >
        <Container size="sm">
          <Stack align="center" gap="lg">
            <Title order={2} ta="center" c="white">
              {t('landing.cta.title')}
            </Title>
            <Text size="lg" c="rgba(255,255,255,0.8)" ta="center">
              {t('landing.cta.subtitle')}
            </Text>
            <Button
              component={Link}
              to="/sign-up"
              size="lg"
              radius="xl"
              color="white"
              c="blue"
              rightSection={<IconArrowRight size={18} />}
            >
              {t('landing.cta.button')}
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* ─── Footer ──────────────────────────────────────────────────────────────── */}
      <Box
        py="lg"
        style={{ backgroundColor: '#f9fafb', borderTop: '1px solid #f0f0f0' }}
      >
        <Container size="xl">
          <Flex
            align="center"
            justify="space-between"
            direction={{ base: 'column', sm: 'row' }}
            gap="sm"
          >
            <Group gap="xs">
              <Text>🎓</Text>
              <Text fw={600} c="dark.7">
                {t('common.appName')}
              </Text>
              <Text c="dimmed" size="sm">
                · {t('landing.footer.thesis')}
              </Text>
            </Group>
            <Group gap="lg">
              <Text size="sm" c="dimmed" component={Link} to="/sign-in">
                {t('landing.nav.signIn')}
              </Text>
              <Text size="sm" c="dimmed" component={Link} to="/sign-up">
                {t('landing.nav.signUpFree')}
              </Text>
            </Group>
          </Flex>
        </Container>
      </Box>
    </Box>
  )
}
