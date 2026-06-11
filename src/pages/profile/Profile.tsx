import { useEffect, useRef, useState } from 'react'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  FileButton,
  Group,
  Loader,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { IconCamera, IconCheck, IconAlertCircle, IconUser } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@/store'
import useUser from '@/utils/hooks/useUser'
import type { UserDTO, UserGender } from '@/@types/user'

export default function Profile() {
  const { t } = useTranslation()

  const GENDER_OPTIONS = [
    { value: 'MALE', label: t('profile.genderMale') },
    { value: 'FEMALE', label: t('profile.genderFemale') },
    { value: 'OTHER', label: t('profile.genderOther') },
  ]

  const userId = useAppSelector((state) => state.auth.userInfo.userId)
  const username = useAppSelector((state) => state.auth.userInfo.name)
  const role = useAppSelector((state) => state.auth.userInfo.role)
  const { loading, getUserInfo, updateInfo, updateAvatar } = useUser()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [profile, setProfile] = useState<UserDTO | null>(null)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const resetRef = useRef<() => void>(null)

  const form = useForm({
    initialValues: {
      fullName: '',
      email: '',
      gender: '' as UserGender | '',
      dob: null as Date | null,
    },
  })

  useEffect(() => {
    const fetchProfile = async () => {
      const result = await getUserInfo()
      if (result.code === '0' && result.data) {
        const data = result.data
        setProfile(data)
        form.setValues({
          fullName: data.fullName || '',
          email: data.email || '',
          gender: (data.gender as UserGender) || '',
          dob: data.dob ? new Date(data.dob) : null,
        })
      }
    }
    if (userId) fetchProfile()
  }, [userId])

  const handleSubmit = async (values: typeof form.values) => {
    setMessage(null)
    const result = await updateInfo({
      fullName: values.fullName || undefined,
      email: values.email || undefined,
      gender: (values.gender as UserGender) || undefined,
      dob: values.dob
        ? `${values.dob.getFullYear()}-${String(values.dob.getMonth() + 1).padStart(2, '0')}-${String(values.dob.getDate()).padStart(2, '0')}`
        : undefined,
    })
    if (result.code === '0') {
      setMessage({ type: 'success', text: result.message })
      if (result.data) setProfile(result.data)
    } else {
      setMessage({ type: 'error', text: result.message })
    }
  }

  const handleAvatarChange = async (file: File | null) => {
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: t('profile.avatarTooLarge') })
      return
    }
    setAvatarLoading(true)
    setMessage(null)
    const reader = new FileReader()
    reader.onload = async () => {
      const base64 = reader.result as string
      const result = await updateAvatar(base64)
      if (result.code === '0' && result.data) {
        setProfile(result.data)
        setMessage({ type: 'success', text: result.message })
      } else {
        setMessage({ type: 'error', text: result.message })
      }
      setAvatarLoading(false)
      resetRef.current?.()
    }
    reader.readAsDataURL(file)
  }

  if (loading && !profile) {
    return (
      <Group justify="center" mt="xl">
        <Loader />
      </Group>
    )
  }

  const roleLabel =
    role === 'ADMIN' ? t('profile.roleAdmin') : role === 'TEACHER' ? t('profile.roleTeacher') : t('profile.roleStudent')

  return (
    <Box p="lg" maw={720} mx="auto">
      <Title order={2} mb="lg">{t('profile.title')}</Title>

      {message && (
        <Alert
          color={message.type === 'success' ? 'green' : 'red'}
          icon={message.type === 'success' ? <IconCheck size={16} /> : <IconAlertCircle size={16} />}
          mb="md"
          radius="md"
          withCloseButton
          onClose={() => setMessage(null)}
        >
          {message.text}
        </Alert>
      )}

      {/* Profile header card */}
      <Card withBorder radius="md" p="xl" mb="lg">
        <Group>
          <Box pos="relative" style={{ display: 'inline-block' }}>
            <Avatar
              size={80}
              radius="xl"
              color="blue"
              src={profile?.avatarUrl || undefined}
            >
              <IconUser size={36} />
            </Avatar>
            <FileButton
              resetRef={resetRef}
              onChange={handleAvatarChange}
              accept="image/png,image/jpeg,image/webp"
            >
              {(props) => (
                <Button
                  {...props}
                  variant="filled"
                  color="blue"
                  size="compact-xs"
                  radius="xl"
                  loading={avatarLoading}
                  pos="absolute"
                  bottom={-2}
                  right={-2}
                  p={4}
                  style={{ minWidth: 'unset', width: 28, height: 28 }}
                >
                  <IconCamera size={14} />
                </Button>
              )}
            </FileButton>
          </Box>
          <div>
            <Text fw={600} size="lg">{profile?.fullName || username || '—'}</Text>
            <Text size="sm" c="dimmed">@{username}</Text>
            <Text size="xs" c="dimmed" mt={2}>{roleLabel}</Text>
          </div>
        </Group>
      </Card>

      {/* Edit form card */}
      <Card withBorder radius="md" p="xl">
        <Text fw={600} size="md" mb="xs">{t('profile.editInfo')}</Text>
        <Divider mb="lg" />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <TextInput
                label={t('profile.fullName')}
                placeholder={t('profile.fullNamePlaceholder')}
                {...form.getInputProps('fullName')}
              />
              <TextInput
                label={t('profile.email')}
                placeholder={t('profile.emailPlaceholder')}
                {...form.getInputProps('email')}
              />
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <Select
                label={t('profile.gender')}
                placeholder={t('profile.genderPlaceholder')}
                data={GENDER_OPTIONS}
                clearable
                {...form.getInputProps('gender')}
              />
              <DateInput
                label={t('profile.dob')}
                placeholder={t('profile.dobPlaceholder')}
                valueFormat="DD/MM/YYYY"
                maxDate={new Date()}
                {...form.getInputProps('dob')}
              />
            </SimpleGrid>

            <Group justify="flex-end" mt="sm">
              <Button type="submit" loading={loading}>
                {t('profile.save')}
              </Button>
            </Group>
          </Stack>
        </form>
      </Card>
    </Box>
  )
}
