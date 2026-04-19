import { Box, Flex, Group, Stack, Text, Title } from '@mantine/core'
import Views from '@/components/Layout/Views'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function AuthLayout() {
  return (
    <Flex style={{ minHeight: '100vh' }}>
      {/* ─── Left brand panel (desktop only) ─────────────────────────────────── */}
      <Box
        visibleFrom="lg"
        style={{
          width: 480,
          flexShrink: 0,
          background: 'linear-gradient(160deg, #2563eb 0%, #4338ca 100%)',
          padding: '3rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circle */}
        <Box
          style={{
            position: 'absolute',
            bottom: -80,
            right: -80,
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)',
            pointerEvents: 'none',
          }}
        />
        <Box
          style={{
            position: 'absolute',
            top: -40,
            left: -40,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            pointerEvents: 'none',
          }}
        />

        {/* Logo */}
        <Group gap="xs">
          <Text size="xl">🎓</Text>
          <Text size="lg" fw={700} c="white">
            EnglishAI
          </Text>
        </Group>

        {/* Main copy */}
        <Stack gap="md">
          <Title
            order={2}
            c="white"
            style={{ fontSize: '2rem', lineHeight: 1.3 }}
          >
            Học tiếng Anh
            <br />
            thông minh hơn
            <br />
            với AI
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>
            Lộ trình cá nhân hóa · Flashcard spaced-repetition
            <br />
            Quiz thực chiến · Luyện nói với AI
          </Text>
        </Stack>

        {/* Stats */}
        <Group gap="xl">
          {[
            { value: '1000+', label: 'Từ vựng' },
            { value: '50+', label: 'Bài quiz' },
            { value: 'AI', label: 'Trợ lý 24/7' },
          ].map((s) => (
            <Stack key={s.label} gap={2}>
              <Text fw={800} size="xl" c="white">
                {s.value}
              </Text>
              <Text size="xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {s.label}
              </Text>
            </Stack>
          ))}
        </Group>
      </Box>

      {/* ─── Right form panel ─────────────────────────────────────────────────── */}
      <Flex
        flex={1}
        direction="column"
        style={{ backgroundColor: '#f9fafb' }}
      >
        {/* Top bar: language switcher */}
        <Flex justify="flex-end" p="md">
          <LanguageSwitcher />
        </Flex>

        {/* Centered form */}
        <Flex flex={1} align="center" justify="center" px="xl" pb="xl">
          <Box style={{ width: '100%', maxWidth: 448 }}>
            {/* Mobile logo */}
            <Group gap="xs" mb="xl" justify="center" hiddenFrom="lg">
              <Text size="xl">🎓</Text>
              <Text size="lg" fw={700} c="dark">
                EnglishAI
              </Text>
            </Group>

            <Views />
          </Box>
        </Flex>
      </Flex>
    </Flex>
  )
}
