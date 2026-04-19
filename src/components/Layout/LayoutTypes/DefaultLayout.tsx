import {
  AppShell,
  Avatar,
  Badge,
  Burger,
  Divider,
  Group,
  NavLink,
  ScrollArea,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Link, useLocation } from 'react-router-dom'
import { IconLogout, IconUser } from '@tabler/icons-react'
import Views from '@/components/Layout/Views'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import navigationConfig from '@/configs/navigation.config'
import useAuth from '@/utils/hooks/useAuth'
import { useAppSelector } from '@/store'

const DefaultLayout = () => {
  const [opened, { toggle }] = useDisclosure()
  const { pathname } = useLocation()
  const { signOut } = useAuth()
  const userInfo = useAppSelector((state) => state.auth.userInfo)

  const avatarLabel = userInfo?.name
    ? userInfo.name
        .split(' ')
        .map((w: string) => w[0])
        .slice(-2)
        .join('')
        .toUpperCase()
    : 'U'

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 240, breakpoint: 'sm', collapsed: { mobile: !opened } }}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Text fw={800} size="lg" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
              🎓 EnglishAI
            </Text>
          </Group>
          <Group gap="sm">
            <LanguageSwitcher />
            <Tooltip label={userInfo?.name || 'Tài khoản'} position="bottom">
              <Avatar
                size="sm"
                radius="xl"
                color="blue"
                component={Link}
                to="/profile"
                style={{ cursor: 'pointer' }}
              >
                {avatarLabel}
              </Avatar>
            </Tooltip>
          </Group>
        </Group>
      </AppShell.Header>

      {/* ── Sidebar ────────────────────────────────────────────────────── */}
      <AppShell.Navbar p="xs">
        <AppShell.Section grow component={ScrollArea}>
          <Stack gap={2} mt="xs">
            {navigationConfig.map((item) => {
              const Icon = item.icon
              const isActive =
                pathname === item.path ||
                (item.path !== '/dashboard' && pathname.startsWith(item.path + '/'))
              const isDisabled = (item as any).disabled

              return (
                <Tooltip
                  key={item.key}
                  label="Sắp ra mắt"
                  disabled={!isDisabled}
                  position="right"
                >
                  {isDisabled ? (
                    <NavLink
                      label={
                        <Group gap={6} wrap="nowrap">
                          <Text size="sm" style={{ flex: 1 }}>{item.title}</Text>
                          <Badge size="xs" variant="light" color="gray">Sắp có</Badge>
                        </Group>
                      }
                      leftSection={Icon ? <Icon size={18} stroke={1.5} /> : null}
                      disabled
                      style={{ opacity: 0.55 }}
                    />
                  ) : (
                    <NavLink
                      component={Link}
                      to={item.path}
                      label={<Text size="sm">{item.title}</Text>}
                      leftSection={Icon ? <Icon size={18} stroke={1.5} /> : null}
                      active={isActive}
                    />
                  )}
                </Tooltip>
              )
            })}
          </Stack>
        </AppShell.Section>

        <AppShell.Section>
          <Divider mb="xs" />
          <NavLink
            component={Link}
            to="/profile"
            label="Hồ sơ cá nhân"
            leftSection={<IconUser size={18} stroke={1.5} />}
            active={pathname === '/profile'}
          />
          <NavLink
            label="Đăng xuất"
            leftSection={<IconLogout size={18} stroke={1.5} />}
            onClick={signOut}
            color="red"
            style={{ color: 'var(--mantine-color-red-6)' }}
          />
        </AppShell.Section>
      </AppShell.Navbar>

      {/* ── Main Content ───────────────────────────────────────────────── */}
      <AppShell.Main>
        <Views />
      </AppShell.Main>
    </AppShell>
  )
}

export default DefaultLayout
