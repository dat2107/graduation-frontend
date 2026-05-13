import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Alert,
  Anchor,
  Button,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import {
  IconAlertCircle,
  IconBrandGoogle,
  IconLock,
  IconUser,
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import appConfig from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import useAuth from '@/utils/hooks/useAuth'
import { useAppSelector } from '@/store'

export default function SignIn() {
  const { t } = useTranslation()
  const { signIn, authenticated } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const userRole = useAppSelector((state) => state.auth.userInfo.role)

  useEffect(() => {
    if (authenticated) {
      const redirectUrl = searchParams.get(REDIRECT_URL_KEY)
      if (redirectUrl) {
        navigate(redirectUrl, { replace: true })
      } else if (userRole === 'ADMIN') {
        navigate('/admin/users', { replace: true })
      } else if (userRole === 'TEACHER') {
        navigate('/teacher/vocabulary', { replace: true })
      } else {
        navigate(appConfig.authenticatedEntryPath, { replace: true })
      }
    }
  }, [authenticated, userRole])

  const schema = yup.object().shape({
    username: yup.string().required(t('auth.signIn.validation.usernameRequired')),
    password: yup.string().required(t('auth.signIn.validation.passwordRequired')),
  })

  const form = useForm({
    initialValues: { username: '', password: '' },
    validate: yupResolver(schema),
    validateInputOnBlur: true,
  })

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true)
    setError(null)
    try {
      const result = await signIn(values)
      if (result.code !== '0') {
        setError(result.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    window.location.href = '/oauth2/authorization/google'
  }

  return (
    <Paper radius="xl" p="xl" withBorder shadow="xs">
      <Stack gap="xs" mb="xl">
        <Title order={2}>{t('auth.signIn.title')}</Title>
        <Text size="sm" c="dimmed">
          {t('auth.signIn.subtitle')}
        </Text>
      </Stack>

      {error && (
        <Alert
          color="red"
          icon={<IconAlertCircle size={16} />}
          mb="md"
          radius="md"
        >
          {error}
        </Alert>
      )}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label={t('auth.signIn.username')}
            placeholder={t('auth.signIn.usernamePlaceholder')}
            leftSection={<IconUser size={16} />}
            {...form.getInputProps('username')}
          />
          <PasswordInput
            label={t('auth.signIn.password')}
            placeholder={t('auth.signIn.passwordPlaceholder')}
            leftSection={<IconLock size={16} />}
            {...form.getInputProps('password')}
          />

          <Group justify="flex-end" mt={-8}>
            <Anchor component={Link} to="/forgot-password" size="sm">
              {t('auth.signIn.forgotPassword')}
            </Anchor>
          </Group>

          <Button type="submit" fullWidth radius="md" loading={loading}>
            {t('auth.signIn.submit')}
          </Button>
        </Stack>
      </form>

      <Divider
        label={t('auth.signIn.orContinueWith')}
        labelPosition="center"
        my="lg"
      />

      <Button
        variant="default"
        fullWidth
        radius="md"
        leftSection={<IconBrandGoogle size={18} />}
        onClick={handleGoogleSignIn}
      >
        {t('auth.signIn.googleSignIn')}
      </Button>

      <Text ta="center" size="sm" mt="lg" c="dimmed">
        {t('auth.signIn.noAccount')}{' '}
        <Anchor component={Link} to="/sign-up" fw={500}>
          {t('auth.signIn.signUpLink')}
        </Anchor>
      </Text>
    </Paper>
  )
}
