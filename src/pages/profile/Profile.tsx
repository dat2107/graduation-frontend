import { useEffect, useState } from 'react'
import {
  Alert,
  Button,
  Group,
  Loader,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { useAppSelector } from '@/store'
import useUser from '@/utils/hooks/useUser'
import type { UserDTO, UserGender } from '@/@types/user'

export default function Profile() {
  const userId = useAppSelector((state) => state.auth.userInfo.userId)
  const { loading, getUserInfo, updateInfo } = useUser()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [profile, setProfile] = useState<UserDTO | null>(null)

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
      dob: values.dob ? values.dob.toISOString().split('T')[0] : undefined,
    })
    if (result.code === '0') {
      setMessage({ type: 'success', text: result.message })
      if (result.data) setProfile(result.data)
    } else {
      setMessage({ type: 'error', text: result.message })
    }
  }

  if (loading && !profile) {
    return (
      <Group justify="center" mt="xl">
        <Loader />
      </Group>
    )
  }

  return (
    <Stack gap="lg" maw={480}>
      <Title order={2}>Hồ sơ cá nhân</Title>

      {message && (
        <Alert color={message.type === 'success' ? 'green' : 'red'}>
          {message.text}
        </Alert>
      )}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Họ và tên"
            placeholder="Nhập họ và tên"
            {...form.getInputProps('fullName')}
          />
          <TextInput
            label="Email"
            placeholder="Nhập email"
            {...form.getInputProps('email')}
          />
          <Select
            label="Giới tính"
            placeholder="Chọn giới tính"
            data={[
              { value: 'MALE', label: 'Nam' },
              { value: 'FEMALE', label: 'Nữ' },
              { value: 'OTHER', label: 'Khác' },
            ]}
            clearable
            {...form.getInputProps('gender')}
          />
          <DateInput
            label="Ngày sinh"
            placeholder="Chọn ngày sinh"
            valueFormat="DD/MM/YYYY"
            maxDate={new Date()}
            {...form.getInputProps('dob')}
          />

          <Group justify="flex-end">
            <Button type="submit" loading={loading}>
              Lưu thay đổi
            </Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  )
}
