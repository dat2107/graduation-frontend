import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Alert,
  Anchor,
  Button,
  Paper,
  PasswordInput,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { useForm, yupResolver } from '@mantine/form'
import {
  IconAlertCircle,
  IconCalendar,
  IconCheck,
  IconLock,
  IconMail,
  IconPhone,
  IconUser,
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import useAuth from '@/utils/hooks/useAuth'
import type { UserGender } from '@/@types/user'

export default function SignUp() {
  const { t } = useTranslation()
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const schema = yup.object().shape({
    username: yup
      .string()
      .required(t('auth.signUp.validation.usernameRequired'))
      .min(4, t('auth.signUp.validation.usernameMin'))
      .max(50, t('auth.signUp.validation.usernameMax')),
    password: yup
      .string()
      .required(t('auth.signUp.validation.passwordRequired'))
      .min(8, t('auth.signUp.validation.passwordMin')),
    fullName: yup.string().required(t('auth.signUp.validation.fullNameRequired')),
    email: yup
      .string()
      .required(t('auth.signUp.validation.emailRequired'))
      .email(t('auth.signUp.validation.emailInvalid')),
    phone: yup.string().required(t('auth.signUp.validation.phoneRequired')),
  })

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
      fullName: '',
      email: '',
      phone: '',
      gender: '' as UserGender | '',
      dob: null as Date | null,
    },
    validate: yupResolver(schema),
    validateInputOnBlur: true,
  })

  const handleSubmit = async (values: typeof form.values) => {
    setSubmitting(true)
    setMessage(null)
    const result = await signUp({
      username: values.username,
      password: values.password,
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      gender: values.gender || undefined,
      dob: values.dob ? values.dob.toISOString().split('T')[0] : undefined,
    })
    setSubmitting(false)

    if (result.code === '0') {
      setMessage({ type: 'success', text: result.message })
      setTimeout(() => navigate('/sign-in'), 3000)
    } else {
      setMessage({ type: 'error', text: result.message })
    }
  }

  return (
    <Paper radius="xl" p="xl" withBorder shadow="xs">
      <Stack gap="xs" mb="xl">
        <Title order={2}>{t('auth.signUp.title')}</Title>
        <Text size="sm" c="dimmed">
          {t('auth.signUp.subtitle')}
        </Text>
      </Stack>

      {message && (
        <Alert
          color={message.type === 'success' ? 'green' : 'red'}
          icon={
            message.type === 'success' ? (
              <IconCheck size={16} />
            ) : (
              <IconAlertCircle size={16} />
            )
          }
          mb="md"
          radius="md"
        >
          {message.text}
          {message.type === 'success' && (
            <Text size="xs" mt={4} c="dimmed">
              {t('auth.signUp.redirecting')}
            </Text>
          )}
        </Alert>
      )}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <SimpleGrid cols={2} spacing="md">
            <TextInput
              label={t('auth.signUp.username')}
              placeholder={t('auth.signUp.usernamePlaceholder')}
              leftSection={<IconUser size={16} />}
              required
              {...form.getInputProps('username')}
            />
            <PasswordInput
              label={t('auth.signUp.password')}
              placeholder={t('auth.signUp.passwordPlaceholder')}
              leftSection={<IconLock size={16} />}
              required
              {...form.getInputProps('password')}
            />
          </SimpleGrid>

          <TextInput
            label={t('auth.signUp.fullName')}
            placeholder={t('auth.signUp.fullNamePlaceholder')}
            leftSection={<IconUser size={16} />}
            required
            {...form.getInputProps('fullName')}
          />

          <SimpleGrid cols={2} spacing="md">
            <TextInput
              label={t('auth.signUp.email')}
              placeholder={t('auth.signUp.emailPlaceholder')}
              leftSection={<IconMail size={16} />}
              required
              {...form.getInputProps('email')}
            />
            <TextInput
              label={t('auth.signUp.phone')}
              placeholder={t('auth.signUp.phonePlaceholder')}
              leftSection={<IconPhone size={16} />}
              required
              {...form.getInputProps('phone')}
            />
          </SimpleGrid>

          <SimpleGrid cols={2} spacing="md">
            <Select
              label={t('auth.signUp.gender')}
              placeholder={t('auth.signUp.genderPlaceholder')}
              data={[
                { value: 'MALE', label: t('auth.signUp.genderMale') },
                { value: 'FEMALE', label: t('auth.signUp.genderFemale') },
                { value: 'OTHER', label: t('auth.signUp.genderOther') },
              ]}
              {...form.getInputProps('gender')}
            />
            <DateInput
              label={t('auth.signUp.dob')}
              placeholder={t('auth.signUp.dobPlaceholder')}
              valueFormat="DD/MM/YYYY"
              leftSection={<IconCalendar size={16} />}
              maxDate={new Date()}
              {...form.getInputProps('dob')}
            />
          </SimpleGrid>

          <Button type="submit" fullWidth radius="md" loading={submitting} mt="xs">
            {t('auth.signUp.submit')}
          </Button>
        </Stack>
      </form>

      <Text ta="center" size="sm" mt="lg" c="dimmed">
        {t('auth.signUp.hasAccount')}{' '}
        <Anchor component={Link} to="/sign-in" fw={500}>
          {t('auth.signUp.signInLink')}
        </Anchor>
      </Text>
    </Paper>
  )
}
